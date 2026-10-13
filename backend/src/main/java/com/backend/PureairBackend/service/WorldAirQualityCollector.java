package com.backend.PureairBackend.service;

import com.backend.PureairBackend.dto.AirQualityDTO;
import com.backend.PureairBackend.entity.AirQuality;
import com.backend.PureairBackend.repository.AirQualityRepository;
import com.fasterxml.jackson.databind.JsonNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.core.io.ClassPathResource;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

// Dünya şehirlerinin hava kalitesi verisini Open-Meteo'dan çekip Kafka'ya basar
@Service
@ConditionalOnProperty(name = "air.quality.collector.enabled", havingValue = "true")
public class WorldAirQualityCollector {

    private static final Logger logger = LoggerFactory.getLogger(WorldAirQualityCollector.class);
    private static final String API_URL = "https://air-quality-api.open-meteo.com/v1/air-quality";
    private static final String FIELDS = "pm2_5,pm10,nitrogen_dioxide,sulphur_dioxide,ozone";
    private static final String TOPIC = "raw-air-quality";
    private static final int BATCH_SIZE = 50;

    private record City(String name, double latitude, double longitude) {}

    private final KafkaTemplate<String, AirQualityDTO> kafkaTemplate;
    private final AirQualityRepository airQualityRepository;
    private final AnomalyDetectionService anomalyDetectionService;
    private final RestClient restClient = RestClient.create();
    private final List<City> cities;

    @Value("${air.quality.collector.backfill-days:3}")
    private int backfillDays;

    public WorldAirQualityCollector(KafkaTemplate<String, AirQualityDTO> kafkaTemplate,
                                    AirQualityRepository airQualityRepository,
                                    AnomalyDetectionService anomalyDetectionService) throws IOException {
        this.kafkaTemplate = kafkaTemplate;
        this.airQualityRepository = airQualityRepository;
        this.anomalyDetectionService = anomalyDetectionService;
        this.cities = loadCities();
    }

    private List<City> loadCities() throws IOException {
        List<City> result = new ArrayList<>();
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(
                new ClassPathResource("world-cities.csv").getInputStream(), StandardCharsets.UTF_8))) {
            reader.readLine(); // başlık satırı
            String line;
            while ((line = reader.readLine()) != null) {
                String[] parts = line.split(",");
                if (parts.length < 4) continue;
                result.add(new City(parts[0] + ", " + parts[1],
                        Double.parseDouble(parts[2]), Double.parseDouble(parts[3])));
            }
        }
        return result;
    }

    @Scheduled(initialDelayString = "${air.quality.collector.initial-delay-ms:20000}",
            fixedRateString = "${air.quality.collector.interval-ms:3600000}")
    public void collect() {
        // İlk çalıştırmada grafikler boş kalmasın diye geçmiş günleri de al
        boolean backfill = airQualityRepository.countByCityIsNotNull() == 0;
        int sent = 0;

        for (int i = 0; i < cities.size(); i += BATCH_SIZE) {
            List<City> batch = cities.subList(i, Math.min(i + BATCH_SIZE, cities.size()));
            try {
                sent += backfill ? backfillBatch(batch) : collectBatch(batch);
            } catch (Exception e) {
                logger.error("Hava kalitesi verisi alınamadı ({} - {})", i, i + batch.size(), e);
            }
        }
        logger.info("{} tamamlandı: {} şehir, {} kayıt", backfill ? "Geçmiş veri yükleme" : "Veri toplama",
                cities.size(), sent);
    }

    private JsonNode fetch(List<City> batch, String query) {
        String latitudes = batch.stream().map(c -> String.valueOf(c.latitude())).collect(Collectors.joining(","));
        String longitudes = batch.stream().map(c -> String.valueOf(c.longitude())).collect(Collectors.joining(","));
        String url = API_URL + "?latitude=" + latitudes + "&longitude=" + longitudes + "&timezone=GMT&" + query;
        JsonNode body = restClient.get().uri(url).retrieve().body(JsonNode.class);
        if (body == null) {
            throw new IllegalStateException("Open-Meteo boş yanıt döndü");
        }
        return body;
    }

    // Güncel saatin verisini Kafka'ya gönderir; anomali tespiti ve kayıt consumer tarafında
    private int collectBatch(List<City> batch) {
        JsonNode body = fetch(batch, "current=" + FIELDS);
        int sent = 0;
        for (int i = 0; i < batch.size(); i++) {
            City city = batch.get(i);
            JsonNode current = (body.isArray() ? body.get(i) : body).path("current");
            if (current.isMissingNode()) continue;

            ZonedDateTime time = parseTime(current.path("time").asText());
            // aynı saat tekrar gelirse (yeniden başlatma vb.) ikinci kez yazma
            if (airQualityRepository.existsByLatitudeAndLongitudeAndTime(city.latitude(), city.longitude(), time)) {
                continue;
            }
            kafkaTemplate.send(TOPIC, city.name(), toDto(city, time,
                    current.path("pm2_5"), current.path("pm10"), current.path("nitrogen_dioxide"),
                    current.path("sulphur_dioxide"), current.path("ozone")));
            sent++;
        }
        return sent;
    }

    // Geçmiş günlerin saatlik verisini doğrudan veritabanına yazar (binlerce bildirim gitmesin diye Kafka'sız)
    private int backfillBatch(List<City> batch) {
        JsonNode body = fetch(batch, "hourly=" + FIELDS + "&past_days=" + backfillDays + "&forecast_days=1");
        ZonedDateTime now = ZonedDateTime.now(ZoneOffset.UTC);
        List<AirQuality> rows = new ArrayList<>();

        for (int i = 0; i < batch.size(); i++) {
            City city = batch.get(i);
            JsonNode hourly = (body.isArray() ? body.get(i) : body).path("hourly");
            JsonNode times = hourly.path("time");
            for (int h = 0; h < times.size(); h++) {
                ZonedDateTime time = parseTime(times.get(h).asText());
                if (time.isAfter(now)) break; // tahmin saatlerini alma

                AirQualityDTO dto = toDto(city, time,
                        hourly.path("pm2_5").path(h), hourly.path("pm10").path(h),
                        hourly.path("nitrogen_dioxide").path(h), hourly.path("sulphur_dioxide").path(h),
                        hourly.path("ozone").path(h));
                if (dto.getPm25() == null && dto.getPm10() == null) continue;

                AirQuality row = new AirQuality();
                row.setTime(dto.getTime());
                row.setLatitude(dto.getLatitude());
                row.setLongitude(dto.getLongitude());
                row.setPm25(dto.getPm25());
                row.setPm10(dto.getPm10());
                row.setNo2(dto.getNo2());
                row.setSo2(dto.getSo2());
                row.setO3(dto.getO3());
                row.setCity(dto.getCity());
                row.setAnomaly(anomalyDetectionService.isAnyAnomaly(row, null));
                rows.add(row);
            }
        }
        airQualityRepository.saveAll(rows);
        return rows.size();
    }

    private AirQualityDTO toDto(City city, ZonedDateTime time,
                                JsonNode pm25, JsonNode pm10, JsonNode no2, JsonNode so2, JsonNode o3) {
        AirQualityDTO dto = new AirQualityDTO();
        dto.setTime(time);
        dto.setLatitude(city.latitude());
        dto.setLongitude(city.longitude());
        dto.setCity(city.name());
        dto.setPm25(number(pm25));
        dto.setPm10(number(pm10));
        dto.setNo2(number(no2));
        dto.setSo2(number(so2));
        dto.setO3(number(o3));
        dto.setAnomaly(false);
        return dto;
    }

    private Double number(JsonNode node) {
        return node.isNumber() ? node.asDouble() : null;
    }

    private ZonedDateTime parseTime(String value) {
        return LocalDateTime.parse(value).atZone(ZoneOffset.UTC);
    }
}
