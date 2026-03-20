import { useEffect, useRef, useState, JSX } from 'react';
import { refreshTokens } from '../services/auth.service';
import { useAuthStore } from '../store/auth.store';

interface AuthInitializerProps {
  children: JSX.Element;
}

// Wrappé autour des pages qui nécessitent de connaître l'état auth
const AuthInitializer = ({ children }: AuthInitializerProps): JSX.Element | null => {
  const [isReady, setIsReady] = useState(false);
  const { setAuth } = useAuthStore();
  const isFetching = useRef(false);

  useEffect(() => {
    if (isFetching.current) return;
    isFetching.current = true;

    refreshTokens()
      .then(({ accessToken, user }) => setAuth(user, accessToken))
      .catch(() => {})
      .finally(() => setIsReady(true));
  }, [setAuth]);

  if (!isReady) return null;

  return children;
};

export default AuthInitializer;
