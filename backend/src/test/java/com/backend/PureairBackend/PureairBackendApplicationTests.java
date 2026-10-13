package com.backend.PureairBackend;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.core.DefaultKafkaProducerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.core.ProducerFactory;
import org.springframework.test.context.ActiveProfiles;

import java.util.HashMap;
import java.util.Map;

@SpringBootTest(properties = {
		"spring.jpa.hibernate.ddl-auto=none",
		"spring.datasource.url=",
		"spring.datasource.driver-class-name=",
		"spring.autoconfigure.exclude=org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration,org.springframework.boot.autoconfigure.orm.jpa.HibernateJpaAutoConfiguration,org.springframework.boot.autoconfigure.kafka.KafkaAutoConfiguration"
})
@ActiveProfiles("test")
class PureairBackendApplicationTests {

	@Test
	void contextLoads() {
	}

	@Configuration
	static class TestConfig {
		@Bean
		public ProducerFactory<String, com.backend.PureairBackend.dto.AirQualityDTO> producerFactory() {
			// Sahte bir ProducerFactory oluşturuyoruz
			Map<String, Object> configProps = new HashMap<>();
			configProps.put("bootstrap.servers", "localhost:9092"); // Test sırasında kullanılmayacak
			configProps.put("key.serializer", "org.apache.kafka.common.serialization.StringSerializer");
			configProps.put("value.serializer", "org.springframework.kafka.support.serializer.JsonSerializer");
			return new DefaultKafkaProducerFactory<>(configProps);
		}

		@Bean
		public KafkaTemplate<String, com.backend.PureairBackend.dto.AirQualityDTO> kafkaTemplate() {
			return new KafkaTemplate<>(producerFactory());
		}
	}
}