import React from "react";
import { useNavigate } from 'react-router-dom';

function Footer() {
  const navigate = useNavigate();

  return (
    <div className="footer-content">
      <div className="footer-links">
        <div className="footer-map" onClick={() => navigate("/gizlilik")}>
          Privacy
        </div>
        <div className="footer-map" onClick={() => navigate("/hakkimizda")}>
          About Us
        </div>
        <div className="footer-map" onClick={() => navigate("/iletisim")}>
          Contact
        </div>
      </div>
     
    </div>
  );
}

export default Footer;