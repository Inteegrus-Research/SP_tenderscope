import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import L from 'leaflet';

interface Tender {
  id: number;
  title: string;
  description: string;
  lat: number;
  lng: number;
  userName: string;
  createdAt: string;
}

interface MapViewProps {
  tenders: Tender[];
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

const MapView: React.FC<MapViewProps> = ({ tenders, height = '500px' }) => {
  const [activeMarkerId, setActiveMarkerId] = useState<number | null>(null);
  
  // Calculate center of the map based on tenders
  const getMapCenter = () => {
    if (tenders.length === 0) {
      return [40.7128, -74.0060]; // Default to NYC
    }
    
    // Calculate average lat/lng
    const sumLat = tenders.reduce((sum, tender) => sum + tender.lat, 0);
    const sumLng = tenders.reduce((sum, tender) => sum + tender.lng, 0);
    
    return [sumLat / tenders.length, sumLng / tenders.length];
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  return (
    <div style={{ height, width: '100%' }}>
      <MapContainer
        center={getMapCenter() as [number, number]}
        zoom={12}
        style={{ height: '100%', width: '100%', borderRadius: '8px' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {tenders.map(tender => (
          <Marker
            key={tender.id}
            position={[tender.lat, tender.lng]}
            icon={customIcon}
            eventHandlers={{
              click: () => {
                setActiveMarkerId(tender.id);
              }
            }}
          >
            <Popup>
              <div className="popup-content">
                <Badge bg="primary" className="mb-2">Tender</Badge>
                <h6>{tender.title}</h6>
                <p className="small mb-2">{tender.description.substring(0, 100)}...</p>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <small className="text-muted">By {tender.userName}</small>
                  <small className="text-muted">{formatDate(tender.createdAt)}</small>
                </div>
                <Button
                  as={Link}
                  to={`/tenders/${tender.id}`}
                  variant="outline-primary"
                  size="sm"
                  className="w-100"
                >
                  View Details
                </Button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapView;