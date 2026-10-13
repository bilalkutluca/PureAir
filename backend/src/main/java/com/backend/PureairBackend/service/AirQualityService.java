package com.backend.PureairBackend.service;

import com.backend.PureairBackend.dto.AirQualityDTO;
import com.backend.PureairBackend.entity.AirQuality;
import com.backend.PureairBackend.repository.AirQualityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;

import java.time.Instant;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AirQualityService {

    private final AirQualityRepository airQualityRepository;
    private final AnomalyDetectionService anomalyDetectionService;

    @Autowired
    public AirQualityService(AirQualityRepository airQualityRepository,
                             AnomalyDetectionService anomalyDetectionService) {
        this.airQualityRepository = airQualityRepository;
        this.anomalyDetectionService = anomalyDetectionService;
    }

    public AirQuality saveAirQualityData(AirQualityDTO airQualityDTO) {
        AirQuality airQuality = new AirQuality();
        airQuality.setTime(airQualityDTO.getTime());
        airQuality.setLatitude(airQualityDTO.getLatitude());
        airQuality.setLongitude(airQualityDTO.getLongitude());
        airQuality.setPm25(airQualityDTO.getPm25());
        airQuality.setPm10(airQualityDTO.getPm10());
        airQuality.setNo2(airQualityDTO.getNo2());
        airQuality.setSo2(airQualityDTO.getSo2());
        airQuality.setO3(airQualityDTO.getO3());
        airQuality.setAnomaly(airQualityDTO.getAnomaly());
        airQuality.setCity(airQualityDTO.getCity());
        System.out.println("Saving air quality data with anomaly: " + airQuality.getAnomaly());
        return airQualityRepository.save(airQuality);
    }

    @Value("${air.quality.recent.days:15}")
    private int recentDays;

    // Parametresiz versiyon: recentDays kadar geçmişi getirir
    public List<AirQualityDTO> getRecentAirQualityData() {
        return getRecentAirQualityData(null);
    }

    // Saat bazlı ya da recentDays kadar veri getirir
    public List<AirQualityDTO> getRecentAirQualityData(Long hoursAgo) {
        ZonedDateTime threshold = (hoursAgo != null)
                ? ZonedDateTime.now().minusHours(hoursAgo)
                : ZonedDateTime.now().minusDays(recentDays);

        return airQualityRepository.findByTimeAfter(threshold)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<AirQualityDTO> getAirQualityDataByRegion(double latitude, double longitude, double radius) {
        return airQualityRepository.findByLocation(latitude, longitude, radius)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Haritada gösterilecek, konum başına en güncel ölçüm
    public List<AirQualityDTO> getLatestPerLocation(long hoursAgo) {
        return airQualityRepository.findLatestPerLocation(ZonedDateTime.now().minusHours(hoursAgo))
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Saatlik ortalama; konum verilirse sadece o bölge, verilmezse tüm dünya
    public List<AirQualityDTO> getHourlyTrend(long hoursAgo, Double latitude, Double longitude, double radius) {
        ZonedDateTime since = ZonedDateTime.now().minusHours(hoursAgo);
        List<Object[]> rows = (latitude != null && longitude != null)
                ? airQualityRepository.findHourlyAveragesByLocation(since, latitude, longitude, radius)
                : airQualityRepository.findHourlyAverages(since);

        return rows.stream().map(row -> {
            AirQuality avg = new AirQuality();
            avg.setTime(Instant.ofEpochSecond(((Number) row[0]).longValue()).atZone(ZoneOffset.UTC));
            avg.setLatitude(latitude);
            avg.setLongitude(longitude);
            avg.setPm25(round(row[1]));
            avg.setPm10(round(row[2]));
            avg.setNo2(round(row[3]));
            avg.setSo2(round(row[4]));
            avg.setO3(round(row[5]));
            avg.setAnomaly(anomalyDetectionService.isAnyAnomaly(avg, null));
            return convertToDTO(avg);
        }).collect(Collectors.toList());
    }

    private Double round(Object value) {
        if (value == null) return null;
        return Math.round(((Number) value).doubleValue() * 100.0) / 100.0;
    }

    private AirQualityDTO convertToDTO(AirQuality airQuality) {
        AirQualityDTO dto = new AirQualityDTO();
        dto.setTime(airQuality.getTime());
        dto.setLatitude(airQuality.getLatitude());
        dto.setLongitude(airQuality.getLongitude());
        dto.setPm25(airQuality.getPm25());
        dto.setPm10(airQuality.getPm10());
        dto.setNo2(airQuality.getNo2());
        dto.setSo2(airQuality.getSo2());
        dto.setO3(airQuality.getO3());
        dto.setAnomaly(airQuality.getAnomaly());
        dto.setCity(airQuality.getCity());
        return dto;
    }
}
