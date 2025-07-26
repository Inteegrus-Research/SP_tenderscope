import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Form, InputGroup, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { AlertTriangle, Search, MapPin, FileText } from 'lucide-react';
import api from '../api';
import TenderCard from '../components/TenderCard';
import MapView from '../components/MapView';

interface Tender {
  id: number;
  title: string;
  description: string;
  lat: number;
  lng: number;
  userName: string;
  createdAt: string;
}

const Home: React.FC = () => {
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [filteredTenders, setFilteredTenders] = useState<Tender[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  
  useEffect(() => {
    fetchTenders();
  }, []);
  
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredTenders(tenders);
    } else {
      const filtered = tenders.filter(tender => 
        tender.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tender.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredTenders(filtered);
    }
  }, [searchTerm, tenders]);
  
const fetchTenders = async () => {
  try {
    const response = await api.get('/tenders');
    const data = Array.isArray(response.data) ? response.data : [];  // safe fallback
    setTenders(data);
    setFilteredTenders(data);
    setError(null);
  } catch (err: any) {
    setError(err.response?.data?.message || 'Failed to fetch tenders');
  } finally {
    setLoading(false);
  }
};

  
  return (
    <div>
      {/* Hero Section */}
      <div className="bg-primary text-white py-5">
        <Container>
          <Row className="align-items-center">
            <Col lg={6} className="mb-4 mb-lg-0">
              <h1 className="display-4 fw-bold mb-3">Find Public Tenders</h1>
              <p className="lead mb-4">
                TenderScope helps you discover and track public tenders in your area.
                Find opportunities, report issues, and stay informed.
              </p>
              <div className="d-flex gap-3">
                <Button as={Link} to="/register" variant="light" size="lg">
                  Get Started
                </Button>
                <Button as={Link} to="/create-tender" variant="outline-light" size="lg">
                  Post a Tender
                </Button>
              </div>
            </Col>
            <Col lg={6}>
              <img 
                src="https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                alt="TenderScope" 
                className="img-fluid rounded shadow"
                style={{ maxHeight: '350px', objectFit: 'cover', width: '100%' }}
              />
            </Col>
          </Row>
        </Container>
      </div>
      
      {/* Main Content */}
      <Container className="py-5">
        {/* Search and Filter */}
        <Row className="mb-4">
          <Col md={6} className="mb-3 mb-md-0">
            <InputGroup>
              <InputGroup.Text>
                <Search size={18} />
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Search tenders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
          </Col>
          <Col md={6} className="d-flex justify-content-md-end">
            <div className="btn-group">
              <Button
                variant={viewMode === 'list' ? 'primary' : 'outline-primary'}
                onClick={() => setViewMode('list')}
              >
                <FileText size={18} className="me-1" />
                List View
              </Button>
              <Button
                variant={viewMode === 'map' ? 'primary' : 'outline-primary'}
                onClick={() => setViewMode('map')}
              >
                <MapPin size={18} className="me-1" />
                Map View
              </Button>
            </div>
          </Col>
        </Row>
        
        {/* Error State */}
        {error && <Alert variant="danger">{error}</Alert>}
        
        {/* Loading State */}
        {loading ? (
          <div className="text-center my-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2">Loading tenders...</p>
          </div>
        ) : (
          <>
            {/* Empty State */}
            {filteredTenders.length === 0 ? (
              <div className="text-center my-5">
                <p className="mb-3">No tenders found</p>
                <Button as={Link} to="/create-tender" variant="primary">
                  Create a Tender
                </Button>
              </div>
            ) : (
              <>
                {/* Map View */}
                {viewMode === 'map' && (
                  <div className="mb-4">
                    <MapView tenders={filteredTenders} height="600px" />
                  </div>
                )}
                
                {/* List View */}
                {viewMode === 'list' && (
                  <Row>
                    {filteredTenders.map(tender => (
                      <Col key={tender.id} lg={4} md={6} className="mb-4">
                        <TenderCard tender={tender} />
                      </Col>
                    ))}
                  </Row>
                )}
              </>
            )}
          </>
        )}
      </Container>
      
      {/* Features Section */}
      <div className="bg-light py-5">
        <Container>
          <h2 className="text-center mb-5">Why Use TenderScope?</h2>
          <Row>
            <Col md={4} className="mb-4 mb-md-0">
              <div className="text-center">
                <div className="bg-primary bg-opacity-10 rounded-circle p-3 d-inline-block mb-3">
                  <Search size={32} className="text-primary" />
                </div>
                <h4>Find Opportunities</h4>
                <p>Discover public tenders in your area and never miss an opportunity.</p>
              </div>
            </Col>
            <Col md={4} className="mb-4 mb-md-0">
              <div className="text-center">
                <div className="bg-primary bg-opacity-10 rounded-circle p-3 d-inline-block mb-3">
                  <MapPin size={32} className="text-primary" />
                </div>
                <h4>Map Integration</h4>
                <p>View tenders on an interactive map to find opportunities near you.</p>
              </div>
            </Col>
            <Col md={4}>
              <div className="text-center">
                <div className="bg-primary bg-opacity-10 rounded-circle p-3 d-inline-block mb-3">
                  <AlertTriangle size={32} className="text-primary" />
                </div>
                <h4>Report Issues</h4>
                <p>Help maintain transparency by reporting inappropriate tenders.</p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default Home;