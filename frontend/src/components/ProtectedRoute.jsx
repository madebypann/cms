import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { session, loading } = useAuth();

  if (loading) {
    return <p style={{ textAlign: 'center', marginTop: 40 }}>Memuat...</p>;
  }

  if (!session) {
    return <Navigate to="/controlpanel/login" replace />;
  }

  return children;
}