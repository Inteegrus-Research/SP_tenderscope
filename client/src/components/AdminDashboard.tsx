import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import { Users, FileText, AlertTriangle, CheckCircle } from 'lucide-react';
import api from '../api';

interface DashboardStats {
  users: number;
  tenders: number;
  reports: number;
  pendingReports: number;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    fetchStats();
  }, []);
  
  const fetchStats = async () => {
    try {
      const response = await api.get('/admin/stats');
      setStats(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch dashboard stats');
    } finally {
      setLoading(false);
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
  
  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }
  
  if (!stats) {
    return <Alert variant="warning">No stats available</Alert>;
  }
  
  return (
    <Row>
      <Col md={3} sm={6} className="mb-4">
        <Card className="h-100 shadow-sm">
          <Card.Body className="d-flex align-items-center">
            <div className="rounded-circle bg-primary bg-opacity-10 p-3 me-3">
              <Users size={24} className="text-primary" />
            </div>
            <div>
              <h3 className="mb-0">{stats.users}</h3>
              <p className="text-muted mb-0">Total Users</p>
            </div>
          </Card.Body>
        </Card>
      </Col>
      
      <Col md={3} sm={6} className="mb-4">
        <Card className="h-100 shadow-sm">
          <Card.Body className="d-flex align-items-center">
            <div className="rounded-circle bg-success bg-opacity-10 p-3 me-3">
              <FileText size={24} className="text-success" />
            </div>
            <div>
              <h3 className="mb-0">{stats.tenders}</h3>
              <p className="text-muted mb-0">Total Tenders</p>
            </div>
          </Card.Body>
        </Card>
      </Col>
      
      <Col md={3} sm={6} className="mb-4">
        <Card className="h-100 shadow-sm">
          <Card.Body className="d-flex align-items-center">
            <div className="rounded-circle bg-warning bg-opacity-10 p-3 me-3">
              <AlertTriangle size={24} className="text-warning" />
            </div>
            <div>
              <h3 className="mb-0">{stats.pendingReports}</h3>
              <p className="text-muted mb-0">Pending Reports</p>
            </div>
          </Card.Body>
        </Card>
      </Col>
      
      <Col md={3} sm={6} className="mb-4">
        <Card className="h-100 shadow-sm">
          <Card.Body className="d-flex align-items-center">
            <div className="rounded-circle bg-info bg-opacity-10 p-3 me-3">
              <CheckCircle size={24} className="text-info" />
            </div>
            <div>
              <h3 className="mb-0">{stats.reports - stats.pendingReports}</h3>
              <p className="text-muted mb-0">Resolved Reports</p>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default AdminDashboard;