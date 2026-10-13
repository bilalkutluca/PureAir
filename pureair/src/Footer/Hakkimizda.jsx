
    import React from 'react';

    const Hakkimizda = () => {
      // Inline stil objesi
      const aboutUsStyle = {
      backgroundColor: 'gray',  // Arka plan rengi gri
      color: 'white',           // Yazı rengi beyaz
      padding: '20px',
      fontFamily: 'Montserrat, sans-serif',
      height: '100vh',  // Sayfa yüksekliğini tam olarak pencere yüksekliği yapıyoruz
      width: '100vw',   // Sayfa genişliğini tam olarak pencere genişliği yapıyoruz
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'center',
      overflowY: 'auto',  // Yalnızca dikey kaydırma ekliyoruz
    };
    
      return (
        <div style={aboutUsStyle}>
          <h1>About Us</h1>
          <p>
            At <strong>PureAir</strong>, we believe that breathing clean and healthy air is a fundamental right for everyone.
          </p>
          <p>
            By leveraging technology and innovative solutions, we provide a platform that monitors air quality in real-time and keeps our users informed.
          </p>
          <p>
            Our mission is to track global air pollution levels and make this data accessible to raise awareness for a cleaner environment.
          </p>
          <p>
            Breathe easy with <strong>PureAir</strong>!
          </p>
        </div>
      );
    };
        

export default Hakkimizda;
