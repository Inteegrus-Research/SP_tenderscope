import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import MapSelector from './MapSelector';

interface TenderFormProps {
  initialData?: {
    id?: number;
    title: string;
    description: string;
    lat: number;
    lng: number;
  };
  isEditing?: boolean;
}

const TenderForm: React.FC<TenderFormProps> = ({ 
  initialData = { title: '', description: '', lat: 40.7128, lng: -74.0060 },
  isEditing = false
}) => {
  const [formData, setFormData] = useState(initialData);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleLocationSelect = (lat: number, lng: number) => {
    setFormData(prev => ({ ...prev, lat, lng }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      if (isEditing && initialData.id) {
        await api.put(`/tenders/${initialData.id}`, formData);
        navigate(`/tenders/${initialData.id}`);
      } else {
        const response = await api.post('/tenders', formData);
        navigate(`/tenders/${response.data.id}`);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div>
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter tender title"
            required
          />
        </Form.Group>
        
        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter tender description"
            rows={4}
            required
          />
        </Form.Group>
        
        <Form.Group className="mb-4">
          <Form.Label>Location</Form.Label>
          <p className="text-muted small mb-2">Click on the map to select the tender location</p>
          <MapSelector
            selectedLocation={{ lat: formData.lat, lng: formData.lng }}
            onLocationSelect={handleLocationSelect}
            height="300px"
          />
          <div className="mt-2 d-flex justify-content-between">
            <small className="text-muted">Latitude: {formData.lat.toFixed(6)}</small>
            <small className="text-muted">Longitude: {formData.lng.toFixed(6)}</small>
          </div>
        </Form.Group>
        
        <div className="d-grid">
          <Button 
            variant="primary" 
            type="submit" 
            disabled={loading}
          >
            {loading ? 'Submitting...' : isEditing ? 'Update Tender' : 'Create Tender'}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default TenderForm;