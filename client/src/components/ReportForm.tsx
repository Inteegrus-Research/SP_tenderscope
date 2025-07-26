import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import api from '../api';

interface ReportFormProps {
  tenderId: number;
  onReportSubmitted?: () => void;
}

const ReportForm: React.FC<ReportFormProps> = ({ tenderId, onReportSubmitted }) => {
  const [reason, setReason] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reason.trim()) {
      setError('Please provide a reason for the report');
      return;
    }
    
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      await api.post('/reports', { tenderId, reason });
      setSuccess('Report submitted successfully');
      setReason('');
      
      if (onReportSubmitted) {
        onReportSubmitted();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit report');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Reason for Report</Form.Label>
          <Form.Control
            as="textarea"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Please explain why you are reporting this tender..."
            rows={4}
            required
          />
          <Form.Text className="text-muted">
            Your report will be reviewed by our administrators.
          </Form.Text>
        </Form.Group>
        
        <Button 
          variant="warning" 
          type="submit" 
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit Report'}
        </Button>
      </Form>
    </div>
  );
};

export default ReportForm;