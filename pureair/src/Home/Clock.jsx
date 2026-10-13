import React, { useState, useEffect } from 'react';
import './Clock.css';

const Clock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDate = (date) => {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options); // İngilizce format
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }); // 12 saatlik format
  };

  return (
    <div className="clock-container">
      <div className="clock-content">
        <div className="clock-info">
          <span className="time">{formatTime(time)}</span>
          <span className="date">{formatDate(time)}</span>
        </div>
      </div>
    </div>
  );
};

export default Clock;