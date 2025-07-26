import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { MapPin, Mail, Phone, Github } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-dark text-white py-5 mt-5">
      <Container>
        <Row>
          <Col md={4} className="mb-4 mb-md-0">
            <h5 className="d-flex align-items-center">
              <MapPin className="me-2" size={20} />
              TenderScope
            </h5>
            <p className="mt-3">
              A public tender tracking and reporting platform that helps businesses find opportunities and ensures transparency in the tendering process.
            </p>
          </Col>
          
          <Col md={4} className="mb-4 mb-md-0">
            <h5>Quick Links</h5>
            <ul className="list-unstyled mt-3">
              <li className="mb-2"><a href="/" className="text-white text-decoration-none">Home</a></li>
              <li className="mb-2"><a href="/dashboard" className="text-white text-decoration-none">Dashboard</a></li>
              <li className="mb-2"><a href="/create-tender" className="text-white text-decoration-none">Create Tender</a></li>
              <li className="mb-2"><a href="/login" className="text-white text-decoration-none">Login</a></li>
              <li><a href="/register" className="text-white text-decoration-none">Register</a></li>
            </ul>
          </Col>
          
          <Col md={4}>
            <h5>Contact Us</h5>
            <ul className="list-unstyled mt-3">
              <li className="mb-2 d-flex align-items-center">
                <Mail size={18} className="me-2" />
                <a href="mailto:info@tenderscope.com" className="text-white text-decoration-none">info@tenderscope.com</a>
              </li>
              <li className="mb-2 d-flex align-items-center">
                <Phone size={18} className="me-2" />
                <a href="tel:+1234567890" className="text-white text-decoration-none">+1 (234) 567-890</a>
              </li>
              <li className="d-flex align-items-center">
                <Github size={18} className="me-2" />
                <a href="https://github.com/tenderscope" className="text-white text-decoration-none">github.com/tenderscope</a>
              </li>
            </ul>
          </Col>
        </Row>
        
        <hr className="my-4" />
        
        <div className="text-center">
          <p className="mb-0">&copy; {new Date().getFullYear()} TenderScope. All rights reserved.</p>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;