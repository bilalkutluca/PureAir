
//ResponsiveContainer: Grafiğin responsive olmasını sağlar, ekran boyutuna göre otomatik ölçeklenir.
//LineChart: Çizgi grafiği oluşturur.
//XAxis ve YAxis: X ekseni zamanı (time), Y ekseni kirlilik değerlerini gösterir.
//Tooltip: Kullanıcı grafikte bir noktaya hover yaptığında detayları gösterir.
//Legend: Grafikteki çizgilerin (PM2.5, PM10, vb.) açıklamasını gösterir.
//Line: Her bir kirlilik parametresi için bir çizgi oluşturur (örneğin PM25, PM10).
//Anomali İşaretleme: dot prop’u ile anomali olan noktalarda kırmızı bir daire (<circle>) çiziyoruz. anomaly: true olan veri noktalarında bu daire görünecek.


import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const formatTime = (value) => {
  const d = new Date(value);
  if (isNaN(d)) return value;
  return d.toLocaleString([], { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
};

// Backend'deki eşiklerle aynı
const thresholds = { PM25: 25, PM10: 50, NO2: 40, SO2: 20, O3: 100 };

// Sadece kendi eşiğini aşan çizgide kırmızı nokta göster
const anomalyDot = (props, key) => (
  props.payload[key] > thresholds[key]
    ? <circle key={`${key}-${props.index}`} cx={props.cx} cy={props.cy} r={4} fill="red" />
    : null
);

function PollutionGraph({ data }) {
  return (
    <div className="pollution-chart-container">
      <ResponsiveContainer width="100%" height={400}> {/* Yüksekliği 500'den 400'e düşürdük */}
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" tickFormatter={formatTime} minTickGap={40} />
          <YAxis label={{ value: 'Değer (µg/m³)', angle: -90, position: 'insideLeft' }} />
          <Tooltip labelFormatter={formatTime} />
          <Legend />
          <Line
            type="monotone"
            dataKey="PM25"
            stroke="#8884d8"
            name="PM2.5"
            dot={(props) => anomalyDot(props, "PM25")}
          />
          <Line
            type="monotone"
            dataKey="PM10"
            stroke="#82ca9d"
            name="PM10"
            dot={(props) => anomalyDot(props, "PM10")}
          />
          <Line
            type="monotone"
            dataKey="NO2"
            stroke="#ff7300"
            name="NO2"
            dot={(props) => anomalyDot(props, "NO2")}
          />
          <Line
            type="monotone"
            dataKey="SO2"
            stroke="#ff0000"
            name="SO2"
            dot={(props) => anomalyDot(props, "SO2")}
          />
          <Line
            type="monotone"
            dataKey="O3"
            stroke="#00C49F"
            name="O3"
            dot={(props) => anomalyDot(props, "O3")}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default PollutionGraph;

