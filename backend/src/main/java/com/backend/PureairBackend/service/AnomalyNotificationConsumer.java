package com.backend.PureairBackend.service;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class AnomalyNotificationConsumer {

    @KafkaListener(topics = "anomaly-notifications", groupId = "pureair-group")
    public void consume(String message) {
        System.out.println("Anomaly notification received: " + message);
    }
}
