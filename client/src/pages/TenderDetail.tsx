import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Modal, Alert, Spinner } from 'react-bootstrap';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Plus, Calendar, User, MapPin, AlertTriangle, Edit, Trash2 } from 'lucide-react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import MapView from '../components/MapView';
import ReportForm from '../components/ReportForm';

interface Tender {
  id: number;
  title: string;
  description: string;
  lat: number;
  lng: number;
  userId: number;
  userName: string;
  createdAt: string;
}

const TenderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [tender, setTender] = useState<Tender | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  useEffect(() => {
    fetchTender();
  }, [id]);
  
  const fetchTender = async () => {
    try {
      const response = await api.get(`/tenders/${id}`);
      setTender(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch tender details');
    } finally {
      setLoading(false);
    }
  };
  
  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await api.delete(`/tenders/${id}`);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete tender');
      setShowDeleteModal(false);
    } finally {
      setDeleteLoading(false);
    }
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
  
  // Check if user is the owner of the tender
  const isOwner = user && tender && user.id === tender.userId;
  
  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Loading tender details...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error}</Alert>
        <div className="text-center mt-3">
          <Button as={Link} to="/" variant="primary">Back to Home</Button>
        </div>
      </Container>
    );
  }
  
  if (!tender) {
    return (
      <Container className="py-5">
        <Alert variant="warning">Tender not found</Alert>
        <div className="text-center mt-3">
          <Button as={Link} to="/" variant="primary">Back to Home</Button>
        </div>
      </Container>
    );
  }
  
  return (
    <div>
      <div className="page-header">
        <Container>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="mb-2">{tender.title}</h1>
              <div className="d-flex align-items-center text-muted">
                <User size={16} className="me-1" />
                <span className="me-3">Posted by {tender.userName}</span>
                <Calendar size={16} className="me-1" />
                <span>Posted on {formatDate(tender.createdAt)}</span>
              </div>
            </div>
            <Badge bg="primary" className="px-3 py-2">Tender</Badge>
          </div>
        </Container>
      </div>
      
      <Container className="py-4">
        <Row>
          <Col lg={8} className="mb-4 mb-lg-0">
            <Card className="shadow-sm mb-4">
              <Card.Body>
                <h4 className="mb-3">Description</h4>
                <p className="mb-4">{tender.description}</p>
                
                <h4 className="mb-3">Location</h4>
                <div className="d-flex align-items-center mb-3">
                  <MapPin size={18} className="me-2 text-danger" />
                  <span>
                    Latitude: {tender.lat.toFixed(6)}, Longitude: {tender.lng.toFixed(6)}
                  </span>
                </div>
                
                <MapView tenders={[tender]} height="400px" />
              </Card.Body>
            </Card>
            
            {/* Actions for authenticated users */}
            {isAuthenticated && !isOwner && (
              <Card className="shadow-sm">
                <Card.Body>
                  <h4 className="mb-3">Actions</h4>
                  <Button 
                    variant="warning" 
                    onClick={() => setShowReportModal(true)}
                  >
                    <AlertTriangle size={18} className="me-2" />
                    Report This Tender
                  </Button>
                </Card.Body>
              </Card>
            )}
            
            {/* Owner actions */}
            {isOwner && (
              <Card className="shadow-sm">
                <Card.Body>
                  <h4 className="mb-3">Manage Tender</h4>
                  <div className="d-flex">
                    <Button 
                      as={Link} 
                      to={`/edit-tender/${tender.id}`} 
                      variant="primary" 
                      className="me-2"
                    >
                      <Edit size={18} className="me-2" />
                      Edit Tender
                    </Button>
                    <Button 
                      variant="danger" 
                      onClick={() => setShowDeleteModal(true)}
                    >
                      <Trash2 size={18} className="me-2" />
                      Delete Tender
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            )}
          </Col>
          
          <Col lg={4}>
            <Card className="shadow-sm mb-4">
              <Card.Body>
                <h4 className="mb-3">Tender Details</h4>
                <ul className="list-unstyled">
                  <li className="mb-2">
                    <strong>ID:</strong> {tender.id}
                  </li>
                  <li className="mb-2">
                    <strong>Posted By:</strong> {tender.userName}
                  </li>
                  <li className="mb-2">
                    <strong>Posted On:</strong> {formatDate(tender.createdAt)}
                  </li>
                  <li>
                    <strong>Location:</strong> {tender.lat.toFixed(6)}, {tender.lng.toFixed(6)}
                  </li>
                </ul>
              </Card.Body>
            </Card>
            
            <div className="d-grid gap-2">
              <Button as={Link} to="/" variant="outline-primary">
                Back to All Tenders
              </Button>
              {isAuthenticated && (
                <Button as={Link} to="/create-tender" variant="primary">
                  <Plus size={18} className="me-1" />
                  Create New Tender
                </Button>
              )}
            </div>
          </Col>
        </Row>
      </Container>
      
      {/* Report Modal */}
      <Modal show={showReportModal} onHide={() => setShowReportModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Report Tender</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ReportForm 
            tenderId={tender.id} 
            onReportSubmitted={() => setShowReportModal(false)} 
          />
        </Modal.Body>
      </Modal>
      
      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this tender? This action cannot be undone.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="danger" 
            onClick={handleDelete}
            disabled={deleteLoading}
          >
            {deleteLoading ? 'Deleting...' : 'Delete Tender'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TenderDetail;