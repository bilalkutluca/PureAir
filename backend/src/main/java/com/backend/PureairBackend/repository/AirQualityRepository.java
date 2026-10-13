package com.backend.PureairBackend.repository;

import com.backend.PureairBackend.entity.AirQuality;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.ZonedDateTime;
import java.util.List;

@Repository
public interface AirQualityRepository extends JpaRepository<AirQuality, Long> {

    List<AirQuality> findByTimeAfter(ZonedDateTime time);

    @Query(value = "SELECT * FROM air_quality WHERE earth_distance(" +
            "ll_to_earth(:latitude, :longitude), ll_to_earth(latitude, longitude)) <= :radius * 1000",
            nativeQuery = true)
    List<AirQuality> findByLocation(double latitude, double longitude, double radius);
}