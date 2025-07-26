import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar as BootstrapNavbar, Container, Nav, Button } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { MapPin } from 'lucide-react';

const Navbar: React.FC = () => {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  return (
    <BootstrapNavbar bg="white" expand="lg" className="shadow-sm py-3">
      <Container>
        <BootstrapNavbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <MapPin className="me-2" size={24} color="#0d6efd" />
          <span>TenderScope</span>
        </BootstrapNavbar.Brand>
        
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            {isAuthenticated && (
              <>
                <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
                <Nav.Link as={Link} to="/create-tender">Create Tender</Nav.Link>
                {isAdmin && (
                  <Nav.Link as={Link} to="/admin">Admin Panel</Nav.Link>
                )}
              </>
            )}
          </Nav>
          
          <Nav>
            {isAuthenticated ? (
              <div className="d-flex align-items-center">
                <span className="me-3">Welcome, {user?.name}</span>
                <Button variant="outline-primary" onClick={handleLogout}>Logout</Button>
              </div>
            ) : (
              <div className="d-flex">
                <Nav.Link as={Link} to="/login" className="me-2">Login</Nav.Link>
                <Button as={Link} to="/register" variant="primary">Register</Button>
              </div>
            )}
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;