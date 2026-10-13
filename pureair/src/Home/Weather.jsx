import React, { useState, useEffect } from 'react';
import './Weather.css';

const Weather = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeather = async (lat, lon) => {
      try {
        const apiKey = import.meta.env.VITE_WEATHER_API;
      
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=en`; // İngilizce için lang=en
       
        const response = await fetch(url);
        if (!response.ok) {
          const errorText = await response.text(); // Hata mesajını al
          throw new Error(`Hava durumu verileri alınamadı: ${response.status} - ${errorText}`);
        }
        const data = await response.json();
       
        setWeatherData({
          temp: Math.round(data.main.temp),
          description: data.weather[0].description,
          icon: data.weather[0].icon,
        });
        setLoading(false);
      } catch (err) {
        console.error('Hata:', err.message); // Hata detayını yaz
        setError(err.message);
        setLoading(false);
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
         
          fetchWeather(position.coords.latitude, position.coords.longitude);
        },
        (err) => {
          
          fetchWeather(41.0082, 28.9784);
        }
      );
    } else {
      
      fetchWeather(41.0082, 28.9784);
    }
  }, []);

  if (loading) return <div className="weather-container">Loading...</div>; // İngilizce için
  if (error) return <div className="weather-container">Error: {error}</div>; // İngilizce için

  return (
    <div className="weather-container">
      <div className="weather-content">
        <img
          src={`http://openweathermap.org/img/wn/${weatherData.icon}.png`}
          alt="Weather icon"
          className="weather-icon"
        />
        <div className="weather-info">
          <span className="temperature">{weatherData.temp}°C</span>
          <span className="description">{weatherData.description}</span>
        </div>
      </div>
    </div>
  );
};

export default Weather;