// MapModal.jsx
import React from "react";
import MapComponent from "./MapComponent";

const MapModal = ({ onClose }) => {
  const handleUbicationSelected = (event) => {
    if (onClose) {
      onClose(event); // Devuelve la ubicación seleccionada al padre
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("modal-overlay")) {
      if (onClose) {
        onClose(null); // Cierra sin datos
      }
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <MapComponent onUbicationSelected={handleUbicationSelected} />
      </div>
    </div>
  );
};

export default MapModal;
