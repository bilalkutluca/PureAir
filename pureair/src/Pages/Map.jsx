import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat'; // Heatmap için gerekli
import { useNavigate, useLocation } from 'react-router-dom';
import { fetchLatestAirQuality } from '../services/apiService';

const heatGradient = {
  0.0: '#00FF00',
  0.2: '#FFFF00',
  0.4: '#FFA500',
  0.6: '#FF0000',
  0.8: '#800080',
  1.0: '#8B0000',
};

// PM2.5 değerine göre nokta rengi (alttaki skala ile aynı renkler)
const getColor = (pm25) => {
  if (pm25 <= 12) return '#2ecc40';
  if (pm25 <= 25) return '#e6c700';
  if (pm25 <= 50) return '#FFA500';
  if (pm25 <= 75) return '#FF0000';
  if (pm25 <= 100) return '#800080';
  return '#8B0000';
};

function MapUpdater({ zoom, center, setZoom }) {
  const map = useMap();

  // Fare tekerleğiyle yapılan zoom'u state'e yansıt
  useMapEvents({
    zoomend: () => setZoom(map.getZoom()),
  });

  useEffect(() => {
    // animasyon sürerken gelen ikinci setView yutuluyor, o yüzden animasyonsuz
    map.setView(center, zoom, { animate: false });
    map.invalidateSize();
  }, [zoom, center, map]);

  return null;
}

function HeatLayer({ points }) {
  const map = useMap();

  useEffect(() => {
    if (points.length === 0) return;

    // maxZoom küçük tutulmazsa uzak zoom'da ısı katmanı neredeyse görünmüyor
    const layer = (window.L.heatLayer || L.heatLayer)(points, {
      radius: 22,
      blur: 18,
      maxZoom: 2,
      minOpacity: 0.25,
      gradient: heatGradient,
    }).addTo(map);

    return () => {
      layer.remove();
    };
  }, [points, map]);

  return null;
}

function Map({ zoom, setZoom }) {
  const [stations, setStations] = useState([]);
  const [error, setError] = useState(null);
  const defaultPosition = [25, 15]; // dünya görünümü
  const [center, setCenter] = useState(defaultPosition);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const { lat, lng } = location.state || {};
    if (lat && lng) {
      setCenter([lat, lng]);
    }
  }, [location.state]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const airQualityData = await fetchLatestAirQuality();
        setStations(airQualityData);
        setError(null);
      } catch (err) {
        setError('Hava kalitesi verileri yüklenemedi. Lütfen daha sonra tekrar deneyin.');
        setStations([]);
      }
    };

    loadData();
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  const calculateIntensity = (item) => {
    const pm25 = item.PM25 || 0;
    // üst üste binen noktalar toplandığı için alt değerleri düşük tut
    return Math.max(0.06, Math.min(pm25 / 100, 1));
  };

  // latitude ve longitude'ları number'a çeviriyoruz!
  const heatPoints = React.useMemo(() => stations.map(item => [
    Number(item.latitude),
    Number(item.longitude),
    calculateIntensity(item),
  ]), [stations]);

  return (
    <div>
      <h1 className="map-title">Air Pollution Map</h1>
      {error && <div className="error-message">{error}</div>}
      <MapContainer
        className="map-container"
        center={center}
        zoom={zoom}
        minZoom={2}
        worldCopyJump={true}
        zoomControl={true}
        style={{ width: '100%', height: '100%' }}
      >
        <MapUpdater zoom={zoom} center={center} setZoom={setZoom} />
        <HeatLayer points={heatPoints} />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | Air quality: <a href="https://open-meteo.com/">Open-Meteo</a>'
        />
        {stations.map((item, index) => (
          <CircleMarker
            key={index}
            center={[Number(item.latitude), Number(item.longitude)]}
            radius={item.anomaly ? 8 : 6}
            pathOptions={{
              color: item.anomaly ? '#b71c1c' : '#ffffff',
              weight: item.anomaly ? 3 : 1,
              fillColor: getColor(item.PM25),
              fillOpacity: 0.9,
            }}
          >
            <Popup>
              <div className="anomaly-popup-title">
                {item.city || 'Measurement Point'}
              </div>
              <div className="anomaly-popup-meta">
                {new Date(item.time).toLocaleString()}<br />
                Lat: {Number(item.latitude).toFixed(4)}, Lng: {Number(item.longitude).toFixed(4)}
              </div>
              <div className="anomaly-popup-params">
                <span className="anomaly-popup-badge pm25">PM2.5: {item.PM25} µg/m³</span>
                <span className="anomaly-popup-badge pm10">PM10: {item.PM10} µg/m³</span>
                <span className="anomaly-popup-badge no2">NO2: {item.NO2} µg/m³</span>
                <span className="anomaly-popup-badge so2">SO2: {item.SO2} µg/m³</span>
                <span className="anomaly-popup-badge o3">O3: {item.O3} µg/m³</span>
              </div>
              {item.anomaly && <div className="anomaly-popup-warning">Anomaly: threshold exceeded</div>}
              <div
                className="popup-detail-link"
                onClick={() => navigate('/detayli-analiz', {
                  state: { lat: Number(item.latitude), lng: Number(item.longitude), city: item.city },
                })}
              >
                Detailed analysis →
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}

export default Map;
