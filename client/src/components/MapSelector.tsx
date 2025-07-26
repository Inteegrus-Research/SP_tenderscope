import React, { useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

interface MapSelectorProps {
  selectedLocation: { lat: number; lng: number };
  onLocationSelect: (lat: number, lng: number) => void;
  height?: string;
}

// Custom marker icon
const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  shadowSize: [41, 41]
});

// Component to handle map clicks
const LocationMarker: React.FC<{
  position: { lat: number; lng: number };
  onLocationSelect: (lat: number, lng: number) => void;
}> = ({ position, onLocationSelect }) => {
  const markerRef = useRef<L.Marker>(null);
  
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  
  return <Marker position={position} icon={customIcon} ref={markerRef} />;
};

const MapSelector: React.FC<MapSelectorProps> = ({ 
  selectedLocation, 
  onLocationSelect,
  height = '400px'
}) => {
  return (
    <div style={{ height, width: '100%' }}>
      <MapContainer
        center={[selectedLocation.lat, selectedLocation.lng]}
        zoom={13}
        style={{ height: '100%', width: '100%', borderRadius: '8px' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker 
          position={selectedLocation} 
          onLocationSelect={onLocationSelect} 
        />
      </MapContainer>
    </div>
  );
};

export default MapSelector;