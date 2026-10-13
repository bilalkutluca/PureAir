#!/bin/bash

    # Varsayılan parametreler
    duration=${1:-60}
    rate=${2:-1}
    anomaly_chance=${3:-10}

    # Süre sonunu hesapla
    end_time=$(date -u -d "+${duration} seconds" +%s)
    current_time=$(date -u +%s)

    # Parametreler ve eşik değerleri
    parameters=("pm25" "pm10" "no2" "so2" "o3")
    declare -A thresholds
    thresholds["pm25"]=25.0
    thresholds["pm10"]=50.0
    thresholds["no2"]=40.0
    thresholds["so2"]=20.0
    thresholds["o3"]=100.0

    while [ $current_time -lt $end_time ]; do
        # Rastgele enlem ve boylam
        latitude=$(echo "41.0082 + ($RANDOM % 200 - 100) / 1000.0" | bc -l)
        longitude=$(echo "28.9784 + ($RANDOM % 200 - 100) / 1000.0" | bc -l)

        # JSON gövdesini başlat
        body=$(jq -n --arg time "$(date -u +%Y-%m-%dT%H:%M:%SZ)" \
                    --argjson lat "$latitude" \
                    --argjson lon "$longitude" \
                    --argjson anomaly "false" \
                    '{time: $time, latitude: $lat, longitude: $lon, anomaly: $anomaly}')

        # Her parametre için değer oluştur
        anomaly=false
        for param in "${parameters[@]}"; do
            value=$(shuf -i 0-100 -n 1)
            if [ $((RANDOM % 100)) -lt $anomaly_chance ]; then
                value=$(echo "${thresholds[$param]} * (1 + ($RANDOM % 50 + 50) / 100.0)" | bc -l)
                value=$(printf "%.2f" $value)
                anomaly=true
            fi
            body=$(echo $body | jq --arg p "$param" --argjson v "$value" '.[$p] = $v')
        done

        # Anomaliyi güncelle
        body=$(echo $body | jq --argjson a "$anomaly" '.anomaly = $a')

        # Veriyi gönder
        response=$(curl -s -w "%{http_code}" -o /dev/null -X POST "http://localhost:8081/api/air-quality" \
                       -H "Content-Type: application/json" \
                       -d "$body")
        if [ "$response" -eq 200 ]; then
            echo "Data sent successfully: $body"
        else
            echo "Error sending data (HTTP $response): $body"
        fi

        # Bekleme süresi
        sleep $(echo "1 / $rate" | bc -l)
        current_time=$(date -u +%s)
    done