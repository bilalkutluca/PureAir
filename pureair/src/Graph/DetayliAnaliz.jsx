import React, { useState, useEffect } from 'react';
import AlertPanel from './AlertPanel';
import GraphLogo from './GraphLogo';
import DetayliAnalizMenü from './DetayliAnalizMenü';
import PollutionGraph from './PollutionGraph';
import './DetayliAnaliz.css';
import { useLocation } from 'react-router-dom';
import { fetchAirQualityDataByLocation, fetchAirQualityTrend, fetchLatestAirQuality } from '../services/apiService';

function DetayliAnaliz() {
  const location = useLocation();
  const { lat, lng, city } = location.state || {};

  const [data, setData] = useState([]);
  const [trend, setTrend] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        if (lat && lng) {
          // seçilen bölge: saatlik trend + bölgedeki ölçümler
          const [regionTrend, airQualityData] = await Promise.all([
            fetchAirQualityTrend(72, lat, lng),
            fetchAirQualityDataByLocation(lat, lng),
          ]);
          setTrend(regionTrend);
          setData(airQualityData);
        } else {
          // konum seçilmediyse dünya geneli: ortalama trend + şehirlerin son ölçümleri
          const [worldTrend, latest] = await Promise.all([
            fetchAirQualityTrend(72),
            fetchLatestAirQuality(),
          ]);
          setTrend(worldTrend);
          setData(latest);
        }
        setLoading(false);
      } catch (err) {
        setError('Bu bölge için hava kalitesi verileri yüklenemedi.');
        setLoading(false);
      }
    };

    loadData();
  }, [lat, lng]);

  // en yeni / en kirli anomaliler üstte, tablo çok uzamasın diye ilk 25
  const anomalies = data
    .filter(item => item.anomaly)
    .sort((a, b) => (lat && lng) ? b.time.localeCompare(a.time) : b.PM25 - a.PM25)
    .slice(0, 25);

  if (loading) return <div>Yükleniyor...</div>;
  if (error) return <div>Hata: {error}</div>;

return (
  <div className="detayli-analiz-container">
    <h1 className="detayli-analiz-title">Detailed Analysis and Anomalous Values</h1>
    <GraphLogo />
    <div className="detayli-analiz-content">
      <div className="detayli-analiz-region">
        {lat && lng
          ? <>Selected Region: <strong>{city || `${lat.toFixed(4)}, ${lng.toFixed(4)}`}</strong> (last 3 days, hourly)</>
          : <>Worldwide average of all cities (last 3 days, hourly). Pick a city on the map for regional analysis.</>}
      </div>
      <PollutionGraph data={trend} />
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