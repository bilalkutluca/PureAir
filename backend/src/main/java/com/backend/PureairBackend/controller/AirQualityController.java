package com.backend.PureairBackend.controller;

import com.backend.PureairBackend.dto.AirQualityDTO;
import com.backend.PureairBackend.service.AirQualityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/air-quality")
public class AirQualityController {

    private final AirQualityService airQualityService;

    @Autowired
    public AirQualityController(AirQualityService airQualityService) {
        this.airQualityService = airQualityService;
    }

    @GetMapping("/data")
    public ResponseEntity<List<AirQualityDTO>> getAirQualityData() {
        List<AirQualityDTO> data = airQualityService.getRecentAirQualityData();
        return ResponseEntity.ok(data);
    }

    @GetMapping("/region")
    public ResponseEntity<List<AirQualityDTO>> getAirQualityDataByRegion(
            @RequestParam double latitude,
            @RequestParam double longitude,
            @RequestParam double radius) {
        List<AirQualityDTO> data = airQualityService.getAirQualityDataByRegion(latitude, longitude, radius);
        return ResponseEntity.ok(data);
    }

    @GetMapping("/latest")
    public ResponseEntity<List<AirQualityDTO>> getLatestAirQualityData(
            @RequestParam(defaultValue = "24") long hours) {
        return ResponseEntity.ok(airQualityService.getLatestPerLocation(hours));
    }

    @GetMapping("/trend")
    public ResponseEntity<List<AirQualityDTO>> getAirQualityTrend(
            @RequestParam(defaultValue = "72") long hours,
            @RequestParam(required = false) Double latitude,
            @RequestParam(required = false) Double longitude,
            @RequestParam(defaultValue = "50") double radius) {
        return ResponseEntity.ok(airQualityService.getHourlyTrend(hours, latitude, longitude, radius));
    }

    @PostMapping
    public ResponseEntity<AirQualityDTO> saveAirQualityData(@RequestBody AirQualityDTO airQualityDTO) {
        airQualityService.saveAirQualityData(airQualityDTO);
        return ResponseEntity.ok(airQualityDTO);
    }
}