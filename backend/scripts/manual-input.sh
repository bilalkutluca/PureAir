#!/bin/bash

  # Parametreleri kontrol et
  if [ $# -ne 4 ]; then
      echo "Usage: $0 <latitude> <longitude> <parameter> <value>"
      echo "Example: $0 41.0082 28.9784 pm25 20.5"
      exit 1
  fi

  latitude=$1
  longitude=$2
  parameter=$3
  value=$4

  # Geçerli parametreler
  valid_parameters=("pm25" "pm10" "no2" "so2" "o3")

  # Parametre doğrulama
  valid=false
  for param in "${valid_parameters[@]}"; do
      if [ "$parameter" = "$param" ]; then
          valid=true
          break
      fi
  done

  if [ "$valid" = false ]; then
      echo "Error: Invalid parameter '$parameter'. Must be one of: ${valid_parameters[*]}"
      exit 1
  fi

  # JSON gövdesini oluştur
  body=$(jq -n --arg time "$(date -u +%Y-%m-%dT%H:%M:%SZ)" \
              --argjson lat "$latitude" \
              --argjson lon "$longitude" \
              --argjson a "false" \
              --arg p "$parameter" \
              --argjson v "$value" \
              '{time: $time, latitude: $lat, longitude: $lon, anomaly: $a, ($p): $v}')

  # Veriyi gönder
  response=$(curl -s -w "%{http_code}" -o /dev/null -X POST "http://localhost:8081/api/air-quality" \
                 -H "Content-Type: application/json" \
                 -d "$body")
  if [ "$response" -eq 200 ]; then
      echo "Data sent successfully: $body"
  else
      echo "Error sending data (HTTP $response): $body"
  fi