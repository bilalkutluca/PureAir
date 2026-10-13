import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api/air-quality`
  : (process.env.NODE_ENV === 'production'
      ? 'http://localhost:8081/api/air-quality'
      : 'http://localhost:8081/api/air-quality');

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 saniye timeout
});

// Retry fonksiyonu
const retry = async (fn, retries = 3, delay = 1000) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err) {
      if (i === retries - 1) throw err;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

export const fetchAirQualityData = async () => {
  try {
    const response = await retry(() => axiosInstance.get('/data'));
    console.log('fetchAirQualityData response:', response.data);
    const transformedData = response.data.map(item => ({
      time: new Date(item.time).toISOString(),
      PM25: item.pm25 ?? 0,
      PM10: item.pm10 ?? 0,
      NO2: item.no2 ?? 0,
      SO2: item.so2 ?? 0,
      O3: item.o3 ?? 0,
      anomaly: item.anomaly ?? false,
      latitude: item.latitude,
      longitude: item.longitude
    }));
    return transformedData;
  } catch (error) {
    console.error('Error fetching air quality data:', error.message, error.response?.data);
    throw new Error(`Hava kalitesi verileri alınamadı: ${error.message}`);
  }
};

export const fetchAirQualityDataByLocation = async (lat, lng) => {
  try {
    const radius = 10;
    const response = await retry(() => axiosInstance.get('/region', {
      params: { latitude: lat, longitude: lng, radius }
    }));
    console.log('fetchAirQualityDataByLocation response:', response.data);
    const transformedData = response.data.map(item => ({
      time: new Date(item.time).toISOString(),
      PM25: item.pm25 ?? 0,
      PM10: item.pm10 ?? 0,
      NO2: item.no2 ?? 0,
      SO2: item.so2 ?? 0,
      O3: item.o3 ?? 0,
      anomaly: item.anomaly ?? false,
      latitude: item.latitude,
      longitude: item.longitude
    }));
    return transformedData;
  } catch (error) {
    console.error('Error fetching air quality data by location:', error.message, error.response?.data);
    throw new Error(`Bölge için hava kalitesi verileri alınamadı: ${error.message}`);
  }
};