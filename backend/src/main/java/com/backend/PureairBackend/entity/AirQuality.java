package com.backend.PureairBackend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.ZonedDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "air_quality")
public class AirQuality {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "time", nullable = false)
    private ZonedDateTime time;

    @Column(name = "latitude", nullable = false)
    private Double latitude;

    @Column(name = "longitude", nullable = false)
    private Double longitude;

    @Column(name = "pm25")
    private Double pm25;

    @Column(name = "pm10")
    private Double pm10;

    @Column(name = "no2")
    private Double no2;

    @Column(name = "so2")
    private Double so2;

    @Column(name = "o3")
    private Double o3;

    @Column(name = "anomaly")
    private Boolean anomaly;

    @Column(name = "city")
    private String city;
}