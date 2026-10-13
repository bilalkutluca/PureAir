// src/Home/Home.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import LogoPure from '../Pages/LogoPure';
import Footer from '../Footer/Footer.jsx';
import Weather from '../Home/Weather.jsx'; // Yeni eklenen bileşen
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { faMap, faChartLine, faMagnifyingGlassChart } from '@fortawesome/free-solid-svg-icons';
import './Home.css';
import Clock from './Clock.jsx';

function Home() {
  const [enlargedImage, setEnlargedImage] = useState(null);

  const handleImageClick = (imageIndex) => {
    setEnlargedImage(enlargedImage === imageIndex ? null : imageIndex);
  };

  const handleContainerClick = (e) => {
    if (!e.target.classList.contains('home-image')) {
      setEnlargedImage(null);
    }
  };

  return (
    <div className="home-container" onClick={handleContainerClick}>
      {/* Header: Logo, Başlık ve Yönlendirme İkonları */}
      <header className="home-header">
        <h1 className="page-title">Breathe Pure, Live Better</h1>
        <div className="nav-icon-container">
          <Link to="/map">
            <FontAwesomeIcon icon={faMap} className="nav-icon" title="Map"/> 
          </Link>
          <Link to="/graph">
            <FontAwesomeIcon icon={faChartLine} className="nav-icon" title="Graph" />
          </Link>
          <Link to="/detayli-analiz">
            <FontAwesomeIcon icon={faMagnifyingGlassChart} className="nav-icon" title="Detailed Analysis" />
          </Link>
        </div>
      </header>

      {/* Fotoğraflar */}
      <div className="image-scroll-container">
        <img
          src="/serrat2.png"
          className={`home-image ${enlargedImage === 2 ? 'enlarged' : ''}`}
          alt="Serrat 2"
          onClick={(e) => {
            e.stopPropagation();
            handleImageClick(2);
          }}
        />
        <img
          src="/serrat1.png"
          className={`home-image ${enlargedImage === 1 ? 'enlarged' : ''}`}
          alt="Serrat 1"
          onClick={(e) => {
            e.stopPropagation();
            handleImageClick(1);
          }}
        />
        <img
          src="/serrat3.png"
          className={`home-image ${enlargedImage === 3 ? 'enlarged' : ''}`}
          alt="Serrat 3"
          onClick={(e) => {
            e.stopPropagation();
            handleImageClick(3);
          }}
        />
      </div>

      {/* Fotoğrafların altına açıklama */}
      <div className="image-description">
        <p>"Track air quality in real time and take steps for a healthier life."</p>
      </div>

      {/* Sosyal Medya İkonları */}
      <div className="social-media-container">
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
          <FontAwesomeIcon icon={faFacebookF} className="social-icon" />
        </a>
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
          <FontAwesomeIcon icon={faTwitter} className="social-icon" />
        </a>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
          <FontAwesomeIcon icon={faInstagram} className="social-icon" />
        </a>
      </div>

      {/* Hava Durumu Bileşeni */}
      <Weather />

      {/* Footer */}
      <Footer />

      {/*Clock*/}
      <Clock/>
    </div>
  );
}

export default Home;