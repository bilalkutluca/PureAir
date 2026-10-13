import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat'; // Heatmap için gerekli
import { useNavigate, useLocation } from 'react-router-dom';
import { fetchAirQualityData } from '../services/apiService';

function Map({ zoom, setZoom }) {
  const [pollutionData, setPollutionData] = useState([]);
  const [anomalyData, setAnomalyData] = useState([]);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [error, setError] = useState(null);
  const defaultPosition = [41.0082, 28.9784];
  const [center, setCenter] = useState(defaultPosition);
  const mapRef = useRef(null);
  const heatLayerRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const { lat, lng } = location.state || {};
    if (lat && lng) {
      setCenter([lat, lng]);
    }
  }, [location.state]);

  const MapUpdater = ({ zoom, center }) => {
    const map = useMap();
    useEffect(() => {
      if (map) {
        map.setView(center, zoom);
        map.invalidateSize();
      }
    }, [zoom, center, map]);
    return null;
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const airQualityData = await fetchAirQualityData();
        // latitude ve longitude'ları number'a çeviriyoruz!
        const formattedData = airQualityData.map(item => [
          Number(item.latitude),
          Number(item.longitude),
          calculateIntensity(item),
        ]);
        const anomalies = airQualityData.filter(item => item.anomaly);
        setPollutionData(formattedData);
        setAnomalyData(anomalies);
        setError(null);
      } catch (err) {
        setError('Hava kalitesi verileri yüklenemedi. Lütfen daha sonra tekrar deneyin.');
        setPollutionData([]);
        setAnomalyData([]);
      }
    };

    loadData();
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  const calculateIntensity = (item) => {
    const pm25 = item.PM25 || 0;
    return Math.min(pm25 / 100, 1);
  };

  useEffect(() => {
    if (!mapRef.current || pollutionData.length === 0) {
      return;
    }

    // Eski heat layer'ı kaldır
    if (heatLayerRef.current) {
      heatLayerRef.current.remove();
    }

    // HeatLayer'ı ekle (window.L.heatLayer ile de denenebilir)
    heatLayerRef.current = (window.L.heatLayer || L.heatLayer)(pollutionData, {
      radius: 25,
      blur: 15,
      maxZoom: 17,
      gradient: {
        0.0: '#00FF00',
        0.2: '#FFFF00',
        0.4: '#FFA500',
        0.6: '#FF0000',
        0.8: '#800080',
        1.0: '#8B0000',
      },
    }).addTo(mapRef.current);

    mapRef.current.invalidateSize();

    return () => {
      if (heatLayerRef.current) {
        heatLayerRef.current.remove();
      }
    };
  }, [pollutionData]);

  return (
    <div>
      <h1 className="map-title">Air Pollution Map</h1>
      {error && <div className="error-message">{error}</div>}
      <MapContainer
        className="map-container"
        center={center}
        zoom={zoom}
        zoomControl={true}
        style={{ width: '100%', height: '100%' }}
        whenCreated={(mapInstance) => { mapRef.current = mapInstance }}
        onZoomEnd={(e) => {
          const newZoom = e.target.getZoom();
          setZoom(newZoom);
        }}
      >
        <MapUpdater zoom={zoom} center={center} />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {selectedPosition && (
          <Marker position={selectedPosition}>
            <Popup>
              Seçilen Konum<br />Lat: {selectedPosition[0].toFixed(4)}, Lng: {selectedPosition[1].toFixed(4)}
            </Popup>
          </Marker>
        )}
        {anomalyData.map((item, index) => (
          <Marker
            key={index}
            position={[Number(item.latitude), Number(item.longitude)]}
            icon={L.divIcon({
              className: 'anomaly-marker',
              html: '<div style="background-color: red; width: 10px; height: 10px; border-radius: 50%;"></div>',
              iconSize: [10, 10],
            })}
          >
            <Popup>
              <div className="anomaly-popup-title">Anomaly Detected</div>
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
              <div className="anomaly-popup-warning">Threshold exceeded</div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default Map;