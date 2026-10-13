package com.backend.PureairBackend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class PureairBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(PureairBackendApplication.class, args);
	}
}