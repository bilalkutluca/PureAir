import React from 'react';

const Iletisim = () => {
  // Inline stil objesi
  const contactStyle = {
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
    <div style={contactStyle}>
      <h1>Contact Us</h1>
      <p>If you have any questions or concerns about our privacy policy, please feel free to contact us:</p>
      <p>
        <strong>Email:</strong> info@pureair.com
      </p>
      <p>
        <strong>Address:</strong> PureAir, 1234 Air Quality St., Clean City, ABD 12345
      </p>
    </div>
  );
};

export default Iletisim;
