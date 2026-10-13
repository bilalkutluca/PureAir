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

    // Her konumun en son ölçümü (harita için)
    @Query(value = "SELECT DISTINCT ON (latitude, longitude) * FROM air_quality " +
            "WHERE time > :since ORDER BY latitude, longitude, time DESC",
            nativeQuery = true)
    List<AirQuality> findLatestPerLocation(ZonedDateTime since);

    // Saatlik ortalamalar: [epoch saniye, pm25, pm10, no2, so2, o3]
    @Query(value = "SELECT extract(epoch from time_bucket('1 hour', time)) AS bucket, " +
            "avg(pm25), avg(pm10), avg(no2), avg(so2), avg(o3) FROM air_quality " +
            "WHERE time > :since GROUP BY bucket ORDER BY bucket",
            nativeQuery = true)
    List<Object[]> findHourlyAverages(ZonedDateTime since);

    @Query(value = "SELECT extract(epoch from time_bucket('1 hour', time)) AS bucket, " +
            "avg(pm25), avg(pm10), avg(no2), avg(so2), avg(o3) FROM air_quality " +
            "WHERE time > :since AND earth_distance(" +
            "ll_to_earth(:latitude, :longitude), ll_to_earth(latitude, longitude)) <= :radius * 1000 " +
            "GROUP BY bucket ORDER BY bucket",
            nativeQuery = true)
    List<Object[]> findHourlyAveragesByLocation(ZonedDateTime since, double latitude, double longitude, double radius);

    boolean existsByLatitudeAndLongitudeAndTime(Double latitude, Double longitude, ZonedDateTime time);

    long countByCityIsNotNull();
}