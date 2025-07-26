import React, { useState, useEffect } from 'react';
import { Table, Button, Badge, Spinner, Alert, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import api from '../api';
import { Eye, CheckCircle, XCircle } from 'lucide-react';

interface Report {
  id: number;
  tenderId: number;
  reason: string;
  userName: string;
  tenderTitle: string;
  status: string;
  createdAt: string;
}

const AdminReportList: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    fetchReports();
  }, []);
  
  const fetchReports = async () => {
    try {
      const response = await api.get('/admin/reports');
      setReports(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch reports');
    } finally {
      setLoading(false);
    }
  };
  
  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      const response = await api.put(`/admin/reports/${id}`, { status });
      
      // Update the reports list with the updated report
      setReports(reports.map(report => 
        report.id === id ? response.data : report
      ));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update report status');
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
  
  // Get badge color based on status
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
        <p className="mt-2">Loading reports...</p>
      </div>
    );
  }
  
  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }
  
  return (
    <div>
      {reports.length === 0 ? (
        <Alert variant="info">No reports found</Alert>
      ) : (
        reports.map(report => (
          <Card 
            key={report.id} 
            className={`mb-3 admin-card report-${report.status}`}
          >
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start mb-2">
                <div>
                  <h5 className="mb-0">
                    Report #{report.id} - {report.tenderTitle}
                  </h5>
                  <small className="text-muted">
                    Reported by {report.userName} on {formatDate(report.createdAt)}
                  </small>
                </div>
                <div>{getStatusBadge(report.status)}</div>
              </div>
              
              <Card.Text className="my-3">
                <strong>Reason:</strong> {report.reason}
              </Card.Text>
              
              <div className="d-flex justify-content-between align-items-center">
                <Button
                  as={Link}
                  to={`/tenders/${report.tenderId}`}
                  variant="outline-primary"
                  size="sm"
                  className="me-2"
                >
                  <Eye size={16} className="me-1" />
                  View Tender
                </Button>
                
                <div>
                  {report.status === 'pending' && (
                    <>
                      <Button
                        variant="outline-success"
                        size="sm"
                        className="me-2"
                        onClick={() => handleUpdateStatus(report.id, 'resolved')}
                      >
                        <CheckCircle size={16} className="me-1" />
                        Resolve
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleUpdateStatus(report.id, 'rejected')}
                      >
                        <XCircle size={16} className="me-1" />
                        Reject
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </Card.Body>
          </Card>
        ))
      )}
    </div>
  );
};

export default AdminReportList;