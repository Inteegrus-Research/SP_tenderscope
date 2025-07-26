import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Nav, Tab, Alert, Spinner, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Plus, FileText, AlertTriangle } from 'lucide-react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import TenderCard from '../components/TenderCard';

interface Tender {
  id: number;
  title: string;
  description: string;
  lat: number;
  lng: number;
  userName: string;
  createdAt: string;
}

interface Report {
  id: number;
  tenderId: number;
  reason: string;
  tenderTitle: string;
  status: string;
  createdAt: string;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [userTenders, setUserTenders] = useState<Tender[]>([]);
  const [userReports, setUserReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    fetchUserData();
  }, []);
  
  const fetchUserData = async () => {
    setLoading(true);
    try {
      const [tendersRes, reportsRes] = await Promise.all([
        api.get('/tenders/user/me'),
        api.get('/reports/user')
      ]);
      
      setUserTenders(tendersRes.data);
      setUserReports(reportsRes.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch user data');
    } finally {
      setLoading(false);
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
  
  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge bg="warning">Pending</Badge>;
      case 'resolved':
        return <Badge bg="success">Resolved</Badge>;
      case 'rejected':
        return <Badge bg="danger">Rejected</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };
  
  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Loading dashboard...</p>
      </div>
    );
  }
  
  return (
    <Container className="py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Dashboard</h2>
        <Button as={Link} to="/create-tender" variant="primary">
          <Plus size={18} className="me-1" />
          Create Tender
        </Button>
      </div>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Card className="mb-4 bg-light border-0">
        <Card.Body>
          <Row>
            <Col md={8}>
              <h4>Welcome, {user?.name}!</h4>
              <p className="mb-0">
                This is your personal dashboard where you can manage your tenders and reports.
              </p>
            </Col>
            <Col md={4} className="d-flex justify-content-md-end align-items-center mt-3 mt-md-0">
              <div className="text-center text-md-end">
                <div className="d-flex">
                  <div className="me-4">
                    <h5 className="mb-0">{userTenders.length}</h5>
                    <small className="text-muted">Tenders</small>
                  </div>
                  <div>
                    <h5 className="mb-0">{userReports.length}</h5>
                    <small className="text-muted">Reports</small>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
      
      <Tab.Container defaultActiveKey="tenders">
        <Nav variant="tabs" className="mb-4">
          <Nav.Item>
            <Nav.Link eventKey="tenders">
              <FileText size={18} className="me-1" />
              My Tenders
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="reports">
              <AlertTriangle size={18} className="me-1" />
              My Reports
            </Nav.Link>
          </Nav.Item>
        </Nav>
        
        <Tab.Content>
          <Tab.Pane eventKey="tenders">
            {userTenders.length === 0 ? (
              <div className="text-center py-5">
                <p className="mb-3">You haven't created any tenders yet</p>
                <Button as={Link} to="/create-tender" variant="primary">
                  Create Your First Tender
                </Button>
              </div>
            ) : (
              <Row>
                {userTenders.map(tender => (
                  <Col key={tender.id} lg={4} md={6} className="mb-4">
                    <TenderCard tender={tender} />
                  </Col>
                ))}
              </Row>
            )}
          </Tab.Pane>
          
          <Tab.Pane eventKey="reports">
            {userReports.length === 0 ? (
              <div className="text-center py-5">
                <p>You haven't reported any tenders yet</p>
              </div>
            ) : (
              <div className="list-group">
                {userReports.map(report => (
                  <div 
                    key={report.id} 
                    className={`list-group-item list-group-item-action report-${report.status}`}
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <h5 className="mb-1">
                        <Link to={`/tenders/${report.tenderId}`} className="text-decoration-none">
                          {report.tenderTitle}
                        </Link>
                      </h5>
                      {getStatusBadge(report.status)}
                    </div>
                    <p className="mb-1">{report.reason}</p>
                    <small className="text-muted">Reported on {formatDate(report.createdAt)}</small>
                  </div>
                ))}
              </div>
            )}
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </Container>
  );
};

export default Dashboard;