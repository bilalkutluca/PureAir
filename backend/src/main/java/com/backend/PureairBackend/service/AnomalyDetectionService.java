package com.backend.PureairBackend.service;

import com.backend.PureairBackend.entity.AirQuality;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AnomalyDetectionService {

    private static final double PM25_THRESHOLD = 25.0; // WHO standardı
    private static final double PM10_THRESHOLD = 50.0;
    private static final double NO2_THRESHOLD = 40.0;
    private static final double SO2_THRESHOLD = 20.0;
    private static final double O3_THRESHOLD = 100.0;

    public boolean isAnyAnomaly(AirQuality airQuality, List<AirQuality> recentData) {
        if (airQuality == null) {
            return false;
        }

        // Eşik değer kontrolü
        boolean thresholdAnomaly = isThresholdAnomaly(airQuality);

        // İstatistiksel anomali kontrolü (opsiyonel, recentData varsa)
        boolean statisticalAnomaly = recentData != null && isStatisticalAnomaly(airQuality, recentData);

        return thresholdAnomaly || statisticalAnomaly;
    }

    private boolean isThresholdAnomaly(AirQuality airQuality) {
        return (airQuality.getPm25() != null && airQuality.getPm25() > PM25_THRESHOLD) ||
                (airQuality.getPm10() != null && airQuality.getPm10() > PM10_THRESHOLD) ||
                (airQuality.getNo2() != null && airQuality.getNo2() > NO2_THRESHOLD) ||
                (airQuality.getSo2() != null && airQuality.getSo2() > SO2_THRESHOLD) ||
                (airQuality.getO3() != null && airQuality.getO3() > O3_THRESHOLD);
    }

    private boolean isStatisticalAnomaly(AirQuality airQuality, List<AirQuality> recentData) {
        if (recentData == null || recentData.isEmpty()) {
            return false;
        }

        // Örnek: PM2.5 için ortalama ve standart sapma hesapla
        double pm25Mean = recentData.stream()
                .filter(a -> a.getPm25() != null)
                .mapToDouble(AirQuality::getPm25)
                .average()
                .orElse(0.0);

        double pm25StdDev = Math.sqrt(recentData.stream()
                .filter(a -> a.getPm25() != null)
                .mapToDouble(a -> Math.pow(a.getPm25() - pm25Mean, 2))
                .average()
                .orElse(0.0));

        // Anomali: PM2.5 değeri ortalamadan 2 standart sapma uzaktaysa
        return airQuality.getPm25() != null &&
                Math.abs(airQuality.getPm25() - pm25Mean) > 2 * pm25StdDev;
    }
}