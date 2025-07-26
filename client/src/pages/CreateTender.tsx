import React from 'react';
import { Container, Card } from 'react-bootstrap';
import TenderForm from '../components/TenderForm';

const CreateTender: React.FC = () => {
  return (
    <Container className="py-5">
      <h2 className="mb-4">Create a New Tender</h2>
      
      <Card className="shadow-sm">
        <Card.Body>
          <TenderForm />
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CreateTender;