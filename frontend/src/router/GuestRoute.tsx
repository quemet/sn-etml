import { Navigate } from 'react-router-dom';
import { JSX } from 'react';
import { useAuthStore } from '../store/auth.store';

interface GuestRouteProps {
  children: JSX.Element;
}

const GuestRoute = ({ children }: GuestRouteProps): JSX.Element | null => {
  const { isAuthenticated, isReady } = useAuthStore();

  if (!isReady) return null;
  if (isAuthenticated) return <Navigate to="/" replace />;

  return children;
};

export default GuestRoute;
