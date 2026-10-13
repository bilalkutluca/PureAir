-- /region sorgusundaki earth_distance icin
CREATE EXTENSION IF NOT EXISTS cube;
CREATE EXTENSION IF NOT EXISTS earthdistance;

CREATE TABLE IF NOT EXISTS air_quality (
    time TIMESTAMPTZ NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    pm25 DOUBLE PRECISION,
    pm10 DOUBLE PRECISION,
    no2 DOUBLE PRECISION,
    so2 DOUBLE PRECISION,
    o3 DOUBLE PRECISION,
    anomaly BOOLEAN DEFAULT FALSE
);

SELECT create_hypertable('air_quality', 'time', if_not_exists => TRUE);