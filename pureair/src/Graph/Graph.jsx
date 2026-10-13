import React, { useState, useEffect } from 'react';
import PollutionGraph from './PollutionGraph';
import GraphLogo from './GraphLogo';
import GraphPage from './GraphPage';
import GraphMenu from './GraphMenu';
import './Graph.css';
import { fetchAirQualityTrend } from '../services/apiService';

function Graph() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        // tüm şehirlerin saatlik ortalaması, son 3 gün
        const airQualityData = await fetchAirQualityTrend(72);
        setData(airQualityData);
        setLoading(false);
      } catch (err) {
        setError('Hava kalitesi verileri yüklenemedi.');
        setLoading(false);
      }
    };

    loadData();
    const interval = setInterval(loadData, 30000); // Harita ile uyumlu hale getirmek için
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div>Yükleniyor...</div>;
  if (error) return <div>Hata: {error}</div>;

  return (
    <div className="graph-container">
      <GraphPage />
      <GraphLogo />
      <div className="graph-content">
        <PollutionGraph data={data} />
      </div>
      <GraphMenu />
    </div>
  );
}

export default Graph;