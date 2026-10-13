
import React from 'react';

const Gizlilik = () => {
  // Inline stil objesi
  const policyStyle = {
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
    <div style={policyStyle}>
      <h1>Privacy Policy</h1>
      <p>
        At <strong>PureAir</strong>, we prioritize the privacy and protection of our users' personal data. This privacy policy explains how we collect, use, and protect the information gathered through the PureAir platform.
      </p>
      <h2>Information We Collect</h2>
      <p>
        PureAir may collect certain personal information from users while using the platform. This information may include:
      </p>
      <ul>
        <li><strong>Personal Information:</strong> Name, email address, and other contact details.</li>
        <li><strong>Technical Information:</strong> IP address, browser type, visited pages, and user interactions with the platform.</li>
      </ul>

      <h2>How We Use the Information</h2>
      <p>We may use the collected information for the following purposes:</p>
      <ul>
        <li><strong>Providing Services:</strong> To deliver air quality monitoring services to users.</li>
        <li><strong>Communication:</strong> To contact users via email for service updates or announcements.</li>
        <li><strong>Service Improvement:</strong> To analyze platform usage data to enhance the user experience.</li>
      </ul>

      <h2>Sharing Information</h2>
      <p>
        PureAir does not sell, rent, or share users' personal information with third parties. However, user data may be shared with authorized authorities when required by law.
      </p>

      <h2>Data Security</h2>
      <p>
        The security of user data is important to us. PureAir takes industry-standard security measures to protect your personal information. However, we cannot guarantee that data transmitted over the internet will be completely secure. By using the platform, users accept these risks.
      </p>

      <h2>Cookies</h2>
      <p>
        PureAir may use cookies to enhance the user experience. Cookies are small data files stored in the user's browser. For more information about cookies and how to disable them, please refer to your browser settings.
      </p>

      <h2>Third-Party Links</h2>
      <p>
        Our platform may contain links to third-party websites. These links are provided for informational purposes only. PureAir is not responsible for the privacy practices of third-party websites, and users should review the privacy policies of those sites before visiting them.
      </p>

      
    </div>
  );
};


export default Gizlilik;
