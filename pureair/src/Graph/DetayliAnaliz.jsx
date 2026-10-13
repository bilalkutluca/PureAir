import React, { useState, useEffect } from 'react';
import AlertPanel from './AlertPanel';
import GraphLogo from './GraphLogo';
import DetayliAnalizMenü from './DetayliAnalizMenü';
import './DetayliAnaliz.css';
import { useLocation } from 'react-router-dom';
import { fetchAirQualityDataByLocation } from '../services/apiService';

function DetayliAnaliz() {
  const location = useLocation();
  const { lat, lng } = location.state || {};

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        if (lat && lng) {
          const airQualityData = await fetchAirQualityDataByLocation(lat, lng);
          setData(airQualityData);
        } else {
          setData([]);
        }
        setLoading(false);
      } catch (err) {
        setError('Bu bölge için hava kalitesi verileri yüklenemedi.');
        setLoading(false);
      }
    };

    loadData();
  }, [lat, lng]);

  const anomalies = data.filter(item => item.anomaly);

  if (loading) return <div>Yükleniyor...</div>;
  if (error) return <div>Hata: {error}</div>;

return (
  <div className="detayli-analiz-container">
    <h1 className="detayli-analiz-title">Detailed Analysis and Anomalous Values</h1>
    {lat && lng && (
      <p>Selected Region: Latitude: {lat.toFixed(4)}, Longitude: {lng.toFixed(4)}</p>
    )}
    <GraphLogo />
    <div className="detayli-analiz-content">
      <div className="legend-container">
        <h3 className="legend-title">Line Descriptions</h3>
        <div className="legend-item">
          <span className="legend-color" style={{ backgroundColor: '#6a5acd' }}></span>
          PM2.5: Fine Particulate Matter (2.5 microns)
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ backgroundColor: '#00ced1' }}></span>
          PM10: Particulate Matter (10 microns)
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ backgroundColor: '#ffa500' }}></span>
          NO2: Nitrogen Dioxide
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ backgroundColor: '#ff4500' }}></span>
          SO2: Sulfur Dioxide
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ backgroundColor: '#9932cc' }}></span>
          O3: Ozone
        </div>
        <div className="legend-item">
          <span className="legend-color anomaly-dot"></span>
          Anomaly: Values above threshold levels
        </div>
      </div>
      <AlertPanel anomalies={anomalies} />
    </div>
    <DetayliAnalizMenü />
  </div>
);
}

export default DetayliAnaliz;