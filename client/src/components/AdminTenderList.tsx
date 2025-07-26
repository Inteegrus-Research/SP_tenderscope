import React, { useState, useEffect } from 'react';
import { Table, Button, Badge, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import api from '../api';
import { Eye, Trash2 } from 'lucide-react';

interface Tender {
  id: number;
  title: string;
  description: string;
  userName: string;
  createdAt: string;
}

const AdminTenderList: React.FC = () => {
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    fetchTenders();
  }, []);
  
  const fetchTenders = async () => {
    try {
      const response = await api.get('/tenders');
      setTenders(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch tenders');
    } finally {
      setLoading(false);
    }
  };
  
  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this tender?')) {
      return;
    }
    
    try {
      await api.delete(`/tenders/${id}`);
      setTenders(tenders.filter(tender => tender.id !== id));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete tender');
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
  
  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Loading tenders...</p>
      </div>
    );
  }
  
  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }
  
  return (
    <div className="table-responsive">
      <Table striped hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Posted By</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tenders.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center py-4">No tenders found</td>
            </tr>
          ) : (
            tenders.map(tender => (
              <tr key={tender.id}>
                <td>{tender.id}</td>
                <td>
                  <div className="d-flex align-items-center">
                    <Badge bg="primary" className="me-2">Tender</Badge>
                    {tender.title}
                  </div>
                </td>
                <td>{tender.userName}</td>
                <td>{formatDate(tender.createdAt)}</td>
                <td>
                  <div className="d-flex">
                    <Button
                      as={Link}
                      to={`/tenders/${tender.id}`}
                      variant="outline-primary"
                      size="sm"
                      className="me-2"
                    >
                      <Eye size={16} />
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDelete(tender.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default AdminTenderList;