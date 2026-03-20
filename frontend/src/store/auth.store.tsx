import { createContext, useContext, useState, useEffect, useRef, ReactNode, JSX } from 'react';
import { AuthUser } from '../features/auth/types/auth.types';
import { refreshTokens } from '../services/auth.service';

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isReady: boolean;
  setAuth: (user: AuthUser, accessToken: string) => void;
  clearAuth: () => void;
}

const AuthContext = createContext<AuthState | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }): JSX.Element => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isReady, setIsReady] = useState(false);
  const isFetching = useRef(false);

  const setAuth = (user: AuthUser, accessToken: string): void => {
    window.__accessToken = accessToken;
    setUser(user);
  };

  const clearAuth = (): void => {
    window.__accessToken = undefined;
    setUser(null);
  };

  useEffect(() => {
    if (isFetching.current) {
      setIsReady(true);
      return;
    }
    isFetching.current = true;

    refreshTokens()
      .then(({ accessToken, user }) => setAuth(user, accessToken))
      .catch(() => {})
      .finally(() => setIsReady(true));
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isReady, setAuth, clearAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthStore = (): AuthState => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuthStore must be used within an AuthProvider');
  return context;
};
