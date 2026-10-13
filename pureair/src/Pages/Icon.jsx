import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faMagnifyingGlass, faPlus, faMinus, faBars, faShareAlt, faBullhorn } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

function Icon({ zoom, setZoom }) {
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "PureAir Haritası",
        text: "Hava kirliliği haritasını keşfet!",
        url: window.location.href,
      })
        .then(() => console.log("Paylaşım başarılı!"))
        .catch((error) => console.log("Paylaşım hatası:", error));
    } else {
      alert("Paylaşım özelliği bu tarayıcıda desteklenmiyor.");
    }
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setIsSearchOpen(false);
  };

  const handleSearch = async () => {
    if (!searchQuery) return;

    const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5`;
    try {
      const response = await fetch(nominatimUrl);
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Arama hatası:', error);
      setSearchResults([]);
    }
  };

  const handleSelectLocation = (lat, lon) => {
    setZoom(9);
    navigate('/map', { state: { lat: parseFloat(lat), lng: parseFloat(lon) } }); // Koordinatları state ile geçir
    setSearchQuery('');
    setSearchResults([]);
    setIsSearchOpen(false);
  };

  return (
    <div className="simge">
      <div className="icon" onClick={() => navigate("/")}>
        <FontAwesomeIcon icon={faHouse} title="Home Page" />
      </div>
      <div className="icon menu-icon" onClick={toggleSearch}>
        <FontAwesomeIcon icon={faMagnifyingGlass} title="Search" />
        {isSearchOpen && (
          <div className="search-dropdown" onClick={(e) => e.stopPropagation()}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Şehir ara..."
              autoFocus
            />
            <div className="search-results">
              {searchResults.map((result, index) => (
                <div
                  key={index}
                  className="dropdown-item"
                  onClick={() => handleSelectLocation(result.lat, result.lon)}
                >
                  {result.display_name}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="icon" onClick={() => setZoom(prev => prev + 1)}>
        <FontAwesomeIcon icon={faPlus} title="Zoom In" />
      </div>
      <div className="icon" onClick={() => setZoom(prev => Math.max(1, prev - 1))}>
        <FontAwesomeIcon icon={faMinus} title="Zoom Out" />
      </div>
      <div className="icon menu-icon" onClick={toggleMenu}>
        <FontAwesomeIcon icon={faBars} title="Menu" />
        {isMenuOpen && (
          <div className="dropdown-menu">
            <div className="dropdown-item" onClick={() => navigate("/map")}>
              Map
            </div>
            <div className="dropdown-item" onClick={() => navigate("/graph")}>
              Graphics
            </div>
            <div className="dropdown-item" onClick={() => navigate("/detayli-analiz")}>
              Detailed Analysis
            </div>
          </div>
        )}
      </div>
      <div className="icon" onClick={handleShare}>
        <FontAwesomeIcon icon={faShareAlt} title="Share" />
      </div>
      <div className="icon" onClick={() => navigate("/notifications")}>
        <FontAwesomeIcon icon={faBullhorn} title="Notifications" />
      </div>
    </div>
  );
}

export default Icon;