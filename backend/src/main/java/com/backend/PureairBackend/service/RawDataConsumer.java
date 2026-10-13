package com.backend.PureairBackend.service;

import com.backend.PureairBackend.dto.AirQualityDTO;
import com.backend.PureairBackend.entity.AirQuality;
import com.backend.PureairBackend.config.WebSocketController;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class RawDataConsumer {

    private static final Logger logger = LoggerFactory.getLogger(RawDataConsumer.class);
    private final AirQualityService airQualityService;
    private final AnomalyDetectionService anomalyDetectionService;
    private final WebSocketController webSocketController;

    @Autowired
    public RawDataConsumer(
            AirQualityService airQualityService,
            AnomalyDetectionService anomalyDetectionService,
            WebSocketController webSocketController) {
        this.airQualityService = airQualityService;
        this.anomalyDetectionService = anomalyDetectionService;
        this.webSocketController = webSocketController;
    }

    @KafkaListener(topics = "raw-air-quality", groupId = "pureair-consumer")
    public void consume(AirQualityDTO airQualityDTO) {
        logger.info("Received raw air quality data: {}", airQualityDTO);

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

        try {
            boolean isAnomaly = anomalyDetectionService.isAnyAnomaly(airQuality, null);
            if (isAnomaly) {
                logger.info("Anomaly detected for data: {}", airQualityDTO);
                airQuality.setAnomaly(true);
                airQualityDTO.setAnomaly(true);
                webSocketController.sendAnomalyNotification("New anomaly detected: " + airQualityDTO.toString());
            }
        } catch (Exception e) {
            logger.error("An error occurred during anomaly detection", e);
        }

        airQualityService.saveAirQualityData(airQualityDTO);
    }
}
