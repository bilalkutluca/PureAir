param (
    [int]$duration = 60,
    [int]$rate = 1,
    [int]$anomalyChance = 10
)

$endTime = (Get-Date).AddSeconds($duration)
$parameters = @("pm25", "pm10", "no2", "so2", "o3")
$thresholds = @{
    pm25 = 25.0
    pm10 = 50.0
    no2 = 40.0
    so2 = 20.0
    o3 = 100.0
}

while ((Get-Date) -lt $endTime) {
    $latitude = 41.0082 + (Get-Random -Minimum -0.1 -Maximum 0.1)
    $longitude = 28.9784 + (Get-Random -Minimum -0.1 -Maximum 0.1)
    $body = @{
        time = (Get-Date -Format "o")
        latitude = $latitude
        longitude = $longitude
        anomaly = $false
    }

    foreach ($param in $parameters) {
        $value = Get-Random -Minimum 0 -Maximum 100
        if ((Get-Random -Minimum 0 -Maximum 100) -lt $anomalyChance) {
            $value = $thresholds[$param] * (1 + (Get-Random -Minimum 0.5 -Maximum 1.0))
            $body["anomaly"] = $true
        }
        $body[$param] = [math]::Round($value, 2)
    }

    try {
        Invoke-RestMethod -Uri "http://localhost:8081/api/air-quality" -Method Post -Body ($body | ConvertTo-Json) -ContentType "application/json"
        Write-Output "Data sent successfully: $($body | ConvertTo-Json)"
    }
    catch {
        Write-Output "Error sending data: $_ | Failed data: $($body | ConvertTo-Json)"
    }

    Start-Sleep -Seconds (1 / $rate)
}