import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Pages from "/src/Pages/Pages.jsx";
import Home from "/src/Home/Home.jsx";
import Components from "/src/Components/Components.jsx";
import Graph from "/src/Graph/Graph.jsx";
import DetayliAnaliz from "./Graph/DetayliAnaliz";
import 'leaflet/dist/leaflet.css';
import Gizlilik from "./Footer/Gizlilik";
import Hakkimizda from "./Footer/Hakkimizda";
import Iletisim from "./Footer/Iletisim";
import Notifications from "./Pages/Notifications";




function App() {
  const [zoom, setZoom] = useState(10);

  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/map" element={<Pages zoom={zoom} setZoom={setZoom} />} />
          <Route path="/components" element={<Components />} />
          <Route path="/graph" element={<Graph />} />
          <Route path="/detayli-analiz" element={<DetayliAnaliz />} />
          <Route path="/gizlilik" element={<Gizlilik />} /> {/* Gizlilik sayfası */}
          <Route path="/hakkimizda" element={<Hakkimizda />} /> {/* Hakkımızda sayfası */}
          <Route path="/iletisim" element={<Iletisim />} /> {/* İletişim sayfası */}
          <Route path="/notifications" element={<Notifications />} /> {/* Bildirim sayfası */}
          <Route path="*" element={<div><h1>404 - Sayfa Bulunamadı</h1></div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
