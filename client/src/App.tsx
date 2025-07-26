import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoadingSpinner from './components/LoadingSpinner';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import TenderDetail from './pages/TenderDetail';
import CreateTender from './pages/CreateTender';
import Admin from './pages/Admin';
import NotFound from './pages/NotFound';

// Protected route component
const ProtectedRoute: React.FC<{ 
  element: React.ReactNode; 
  isAdmin?: boolean;
}> = ({ element, isAdmin = false }) => {
  const { isAuthenticated, isAdmin: userIsAdmin, loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (isAdmin && !userIsAdmin) {
    return <Navigate to="/dashboard" />;
  }
  
  return <>{element}</>;
};

function App() {
  const { loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <main className="flex-grow-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/tenders/:id" element={<TenderDetail />} />
          
          {/* Protected routes */}
          <Route 
            path="/dashboard" 
            element={<ProtectedRoute element={<Dashboard />} />} 
          />
          <Route 
            path="/create-tender" 
            element={<ProtectedRoute element={<CreateTender />} />} 
          />
          <Route 
            path="/admin/*" 
            element={<ProtectedRoute element={<Admin />} isAdmin={true} />} 
          />
          
          {/* 404 route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;