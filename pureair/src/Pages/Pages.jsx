import React, { useState, useRef, useEffect } from 'react';
import LogoPure from "./LogoPure.jsx";
import Icon from "./Icon.jsx";
import Map from "./Map.jsx";
import NotificationPanel from "./NotificationPanel.jsx"; // Bildirim paneli
import './Pages.css';
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faMagnifyingGlass, faPlus, faMinus, faBars } from "@fortawesome/free-solid-svg-icons";
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function Pages({ zoom, setZoom }) {
  return (
    <div className="map-page-container">
      <Map zoom={zoom} setZoom={setZoom} />
      <LogoPure />
      <Icon zoom={zoom} setZoom={setZoom} />
      <NotificationPanel /> 
    </div>
  );
}

export default Pages;