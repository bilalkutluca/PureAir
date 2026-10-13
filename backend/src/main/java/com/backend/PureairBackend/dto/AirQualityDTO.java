package com.backend.PureairBackend.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.ZonedDateTime;

@Getter
@Setter
public class AirQualityDTO {
    private ZonedDateTime time;
    private Double latitude;
    private Double longitude;
    private Double pm25;
    private Double pm10;
    private Double no2;
    private Double so2;
    private Double o3;
    private Boolean anomaly;
    private String city;

}