// GraphMenu.js
import React from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faMap, faChartLine, faMagnifyingGlassChart } from "@fortawesome/free-solid-svg-icons";

function GraphMenu() {
  const navigate = useNavigate();
  return (
    <div className="graph-menu">
      <div className="graph-icon" onClick={() => navigate("/")} title="Back To Homepage">
        <FontAwesomeIcon icon={faHouse} />
      </div>
      <div className="graph-icon" onClick={() => navigate("/map")} title="Back To Map">
        <FontAwesomeIcon icon={faMap} />
      </div>
      <div className="graph-icon" onClick={() => navigate("/detayli-analiz")} title="Analyze The Graph İn Detail">
        <FontAwesomeIcon icon={faMagnifyingGlassChart} />
      </div>
    
    </div>
  );
}

export default GraphMenu;