import React from 'react';
import { Container, Row, Col, Nav, Tab } from 'react-bootstrap';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, FileText, AlertTriangle } from 'lucide-react';
import AdminDashboard from '../components/AdminDashboard';
import AdminUserList from '../components/AdminUserList';
import AdminTenderList from '../components/AdminTenderList';
import AdminReportList from '../components/AdminReportList';

const Admin: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  
  return (
    <Container fluid className="py-4">
      <h2 className="mb-4">Admin Panel</h2>
      
      <Row>
        <Col md={3} lg={2} className="mb-4">
          <div className="bg-white shadow-sm rounded p-3">
            <Nav className="flex-column">
              <Nav.Link 
                as={Link} 
                to="/admin" 
                className={currentPath === '/admin' ? 'active' : ''}
              >
                <LayoutDashboard size={18} className="me-2" />
                Dashboard
              </Nav.Link>
              <Nav.Link 
                as={Link} 
                to="/admin/users" 
                className={currentPath === '/admin/users' ? 'active' : ''}
              >
                <Users size={18} className="me-2" />
                Users
              </Nav.Link>
              <Nav.Link 
                as={Link} 
                to="/admin/tenders" 
                className={currentPath === '/admin/tenders' ? 'active' : ''}
              >
                <FileText size={18} className="me-2" />
                Tenders
              </Nav.Link>
              <Nav.Link 
                as={Link} 
                to="/admin/reports" 
                className={currentPath === '/admin/reports' ? 'active' : ''}
              >
                <AlertTriangle size={18} className="me-2" />
                Reports
              </Nav.Link>
            </Nav>
          </div>
        </Col>
        
        <Col md={9} lg={10}>
          <div className="bg-white shadow-sm rounded p-4">
            <Routes>
              <Route path="/" element={<AdminDashboard />} />
              <Route path="/users" element={<AdminUserList />} />
              <Route path="/tenders" element={<AdminTenderList />} />
              <Route path="/reports" element={<AdminReportList />} />
            </Routes>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Admin;