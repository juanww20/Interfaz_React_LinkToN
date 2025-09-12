import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const MapComponent = ({ onUbicationSelected }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const currentMarker = useRef(null);

  useEffect(() => {
    // Inicializar mapa
    const googleSat = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "© OpenStreetMap",
      detectRetina: true,
      subdomains: "abc",
    });

    const bounds = {
      north: 10.16202,
      east: -68.00765,
      south: 10.16202,
      west: -68.00765,
    };

    const southWest = L.latLng(bounds.south, bounds.west);

    mapInstance.current = L.map(mapRef.current, {
      center: southWest,
      zoom: 14,
      minZoom: 2,
      maxZoom: 22,
      layers: [googleSat],
    });

    // Evento click en el mapa
    mapInstance.current.on("click", async (e) => {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;

      // Eliminar marcador previo
      if (currentMarker.current) {
        mapInstance.current.removeLayer(currentMarker.current);
      }

      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`,
          {
            headers: {
              "Accept-Language": "es",
            },
          }
        );
        if (!response.ok) throw new Error("Error en la respuesta de Nominatim");

        const data = await response.json();
        const result = {
          lat,
          lng,
          adress: data.name || data.address?.quarter || data.address?.neighbourhood || data.address?.suburb || '',
          state: data?.address?.state || "",
          postcode: data?.address?.postcode || "",
          country: data?.address?.country || "",
          city: data?.address?.city || data?.county || "",
          university: data?.address?.university || data?.address?.amenity || "",
        };
      
        

        // Crear marcador
        currentMarker.current = L.marker([lat, lng]).addTo(mapInstance.current);

        // Emitir datos al padre
        if (onUbicationSelected) {
          onUbicationSelected(result);
        }
      } catch (error) {
        console.error("Error obteniendo dirección:", error);
      }
    });

    // Cleanup
    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
      }
    };
  }, [onUbicationSelected]);

  return (
    <div className="container-map">
      <div id="map" ref={mapRef} style={{ height: "400px" }}></div>
    </div>
  );
};

export default MapComponent;
