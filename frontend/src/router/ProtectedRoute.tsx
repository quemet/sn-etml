import { Navigate } from 'react-router-dom';
import { JSX } from 'react';
import { useAuthStore } from '../store/auth.store';

interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps): JSX.Element | null => {
  const { isAuthenticated, isReady } = useAuthStore();

  if (!isReady) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return children;
};

export default ProtectedRoute;
