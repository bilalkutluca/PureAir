import React, { useState, useEffect } from 'react';

function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8081/ws/notifications');

    ws.onopen = () => {
      console.log('WebSocket bağlantısı kuruldu');
    };

    ws.onmessage = (event) => {
      const message = event.data;
      setNotifications(prev => [
        { id: Date.now(), message },
        ...prev.slice(0, 9) // Son 10 bildirimi tut
      ]);
    };

    ws.onerror = (error) => {
      console.error('WebSocket hatası:', error);
    };

    ws.onclose = () => {
      console.log('WebSocket bağlantısı kapandı');
    };

    return () => {
      ws.close();
    };
  }, []);

  const notificationStyle = {
    backgroundColor: 'gray',
    color: 'white',
    padding: '20px',
    fontFamily: 'Montserrat, sans-serif',
    height: '100vh',
    width: '100vw',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    overflowY: 'auto',
  };

  const cardStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: '16px',
    borderRadius: '12px',
    marginBottom: '12px',
    width: '80%',
    maxWidth: '600px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
  };

  const headingStyle = {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
  };

  return (
    <div style={notificationStyle}>
      <h2 style={headingStyle}>🔔 Bildirimler</h2>
      {notifications.length === 0 && (
        <div style={cardStyle}>Henüz bildirim yok.</div>
      )}
      {notifications.map(notification => (
        <div key={notification.id} style={cardStyle}>
          ⚠️ {notification.message}
        </div>
      ))}
    </div>
  );
}

export default Notifications;