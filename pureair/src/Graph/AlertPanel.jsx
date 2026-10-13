import React from 'react';

function AlertPanel({ anomalies }) {
  // Eğer anomali yoksa, "No anomalies detected" mesajı göster
  if (!anomalies || anomalies.length === 0) {
    return (
      <div className="alert-panel no-anomaly">
        No anomalies detected.
      </div>
    );
  }

  // Anomali varsa, tablo formatında göster
  return (
    <div className="alert-panel">
      <h3 className="alert-title">WARNING: Anomalies</h3>
      <table className="anomaly-table">
        <thead>
          <tr>
            <th>Time</th>
            <th>Values</th>
            <th>Reason</th>
          </tr>
        </thead>
        <tbody>
          {anomalies.map((item, index) => {
            // Anomali nedenlerini belirle
            const reasons = [];
            if (item.PM25 > 25) reasons.push(`PM2.5: ${item.PM25} (Threshold: 25)`);
            if (item.PM10 > 50) reasons.push(`PM10: ${item.PM10} (Threshold: 50)`);
            if (item.NO2 > 40) reasons.push(`NO2: ${item.NO2} (Threshold: 40)`);
            if (item.SO2 > 20) reasons.push(`SO2: ${item.SO2} (Threshold: 20)`);
            if (item.O3 > 50) reasons.push(`O3: ${item.O3} (Threshold: 50)`);

            return (
              <tr key={index}>
                <td>{item.time}</td>
                <td>
                  PM2.5: {item.PM25}, PM10: {item.PM10}, NO2: {item.NO2}, SO2: {item.SO2}, O3: {item.O3}
                </td>
                <td className="anomaly-reason">{reasons.join(', ')}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default AlertPanel;