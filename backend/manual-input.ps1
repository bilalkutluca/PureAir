param (
    [Parameter(Mandatory=$true)][double]$latitude,
    [Parameter(Mandatory=$true)][double]$longitude,
    [Parameter(Mandatory=$true)][string]$parameter,
    [Parameter(Mandatory=$true)][double]$value
)

# Geçerli parametreler
$validParameters = @("pm25", "pm10", "no2", "so2", "o3")

# Parametre doğrulama
if (-not ($validParameters -contains $parameter)) {
    Write-Output "Error: Invalid parameter '$parameter'. Must be one of: $validParameters"
    exit 1
}

$body = @{
    time = (Get-Date -Format "o")
    latitude = $latitude
    longitude = $longitude
    anomaly = $false
    $parameter = $value
} | ConvertTo-Json

try {
    Invoke-RestMethod -Uri "http://localhost:8081/api/air-quality" -Method Post -Body $body -ContentType "application/json"
    Write-Output "Data sent successfully: $body"
}
catch {
    Write-Output "Error sending data: $_ | Failed data: $body"
}