import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <Container className="py-5 text-center">
      <div className="my-5">
        <h1 className="display-1 fw-bold">404</h1>
        <h2 className="mb-4">Page Not Found</h2>
        <p className="lead mb-5">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Button as={Link} to="/" variant="primary" size="lg">
          <Home size={18} className="me-2" />
          Back to Home
        </Button>
      </div>
    </Container>
  );
};

export default NotFound;