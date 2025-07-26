import React from 'react';
import { Card, Badge, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, User } from 'lucide-react';

interface TenderCardProps {
  tender: {
    id: number;
    title: string;
    description: string;
    lat: number;
    lng: number;
    userName: string;
    createdAt: string;
  };
}

const TenderCard: React.FC<TenderCardProps> = ({ tender }) => {
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
    <Card className="tender-card h-100 shadow-sm">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start mb-2">
          <Badge bg="primary" className="mb-2">Tender</Badge>
          <small className="text-muted d-flex align-items-center">
            <Calendar size={14} className="me-1" />
            {formatDate(tender.createdAt)}
          </small>
        </div>
        
        <Card.Title>{tender.title}</Card.Title>
        
        <Card.Text className="text-truncate mb-3">
          {tender.description}
        </Card.Text>
        
        <div className="d-flex align-items-center mb-3">
          <MapPin size={16} className="me-1 text-danger" />
          <small className="text-muted">
            {tender.lat.toFixed(4)}, {tender.lng.toFixed(4)}
          </small>
        </div>
        
        <div className="d-flex align-items-center mb-3">
          <User size={16} className="me-1" />
          <small className="text-muted">Posted by {tender.userName}</small>
        </div>
      </Card.Body>
      
      <Card.Footer className="bg-white border-top-0">
        <Button 
          as={Link} 
          to={`/tenders/${tender.id}`} 
          variant="outline-primary" 
          className="w-100"
        >
          View Details
        </Button>
      </Card.Footer>
    </Card>
  );
};

export default TenderCard;