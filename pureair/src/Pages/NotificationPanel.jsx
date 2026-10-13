import React, { useState, useEffect } from 'react';
import './NotificationPanel.css';

const NotificationPanel = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [anomalies, setAnomalies] = useState([]);
  const [wsConnected, setWsConnected] = useState(false);

  useEffect(() => {
    const connectWebSocket = () => {
      const ws = new WebSocket('ws://localhost:8081/ws');

      ws.onopen = () => {
        console.log('WebSocket bağlantısı kuruldu');
        setWsConnected(true);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('Yeni anomali verisi alındı:', data);
          setAnomalies(prevAnomalies => [...prevAnomalies, data]);
        } catch (error) {
          console.error('WebSocket mesajı işlenirken hata:', error);
        }
      };

      ws.onclose = () => {
        console.log('WebSocket bağlantısı kapandı, yeniden bağlanılıyor...');
        setWsConnected(false);
        setTimeout(connectWebSocket, 5000);
      };

      ws.onerror = (error) => {
        console.error('WebSocket hatası:', error);
        ws.close();
      };

      return ws;
    };

    const ws = connectWebSocket();

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, []);

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  return (
    <div className="notification-panel" onClick={togglePopup}>
      <div className="scale"></div>
      <div className="hover-text">
        {wsConnected ? 'Detail' : 'Connecting...'}
      </div>
      {isPopupOpen && (
        <div className="aqi-popup">
          <button className="close-button" onClick={closePopup}>×</button>
          <h3>Air Quality Index (AQI) Levels</h3>
          <div className="aqi-content">
            {anomalies.length > 0 && (
              <div className="anomalies-section">
                <h4>Recent Anomalies</h4>
                <ul>
                  {anomalies.slice(-5).map((anomaly, index) => (
                    <li key={index} className="anomaly-item">
                      <strong>Time:</strong> {new Date(anomaly.time).toLocaleString()}<br />
                      <strong>Location:</strong> {anomaly.city || `${anomaly.latitude.toFixed(4)}, ${anomaly.longitude.toFixed(4)}`}<br />
                      <strong>Parameters:</strong>
                      <ul>
                        {anomaly.pm25 != null && <li>PM2.5: {anomaly.pm25} µg/m³</li>}
                        {anomaly.pm10 != null && <li>PM10: {anomaly.pm10} µg/m³</li>}
                        {anomaly.no2 != null && <li>NO2: {anomaly.no2} µg/m³</li>}
                        {anomaly.so2 != null && <li>SO2: {anomaly.so2} µg/m³</li>}
                        {anomaly.o3 != null && <li>O3: {anomaly.o3} µg/m³</li>}
                      </ul>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <ul>
              <li className="aqi-item good">
                <span className="aqi-level">Good (0-50):</span>
                <div className="aqi-description">
                  Air quality is considered satisfactory, and air pollution poses little or no risk.
                </div>
                <div className="aqi-warning">
                  <strong>Advice:</strong> It's a great day to enjoy outdoor activities!
                </div>
              </li>
              <li className="aqi-item moderate">
                <span className="aqi-level">Moderate (50-100):</span>
                <div className="aqi-description">
                  Air quality is acceptable; however, for some pollutants there may be a moderate health concern for a very small number of people who are unusually sensitive to air pollution.
                </div>
                <div className="aqi-warning">
                  <strong>Advice:</strong> Generally safe, but sensitive individuals should monitor for any discomfort.
                </div>
              </li>
              <li className="aqi-item unhealthy-sensitive">
                <span className="aqi-level">Unhealthy for Sensitive Groups (100-150):</span>
                <div className="aqi-description">
                  Members of sensitive groups may experience health effects. The general public is not likely to be affected.
                </div>
                <div className="aqi-warning">
                  <strong>Advice:</strong> Sensitive groups (e.g., children, elderly, or those with respiratory issues) should reduce prolonged outdoor activities.
                </div>
              </li>
              <li className="aqi-item unhealthy">
                <span className="aqi-level">Unhealthy (150-200):</span>
                <div className="aqi-description">
                  Everyone may begin to experience health effects; members of sensitive groups may experience more serious health effects.
                </div>
                <div className="aqi-warning">
                  <strong>Advice:</strong> Limit outdoor activities, especially for sensitive groups. Consider wearing a mask if necessary.
                </div>
              </li>
              <li className="aqi-item very-unhealthy">
                <span className="aqi-level">Very Unhealthy (200-300):</span>
                <div className="aqi-description">
                  Health alert: everyone may experience more serious health effects.
                </div>
                <div className="aqi-warning">
                  <strong>Advice:</strong> Avoid outdoor activities. Stay indoors and keep windows closed to reduce exposure.
                </div>
              </li>
              <li className="aqi-item hazardous">
                <span className="aqi-level">Hazardous (300-500):</span>
                <div className="aqi-description">
                  Health warning of emergency conditions. The entire population is more likely to be affected.
                </div>
                <div className="aqi-warning">
                  <strong>Advice:</strong> Stay indoors, use air purifiers, and avoid any outdoor exposure. This is a health emergency.
                </div>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationPanel;