import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { getAuth, setAuth, clearAuth } from '@/services/api';

type AuthUser = {
  id: number;
  nomeCompleto: string;
  email: string;
  cpf?: string;
  role: string;
};

type AuthContextType = {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  login: (token: string, usuario: AuthUser) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  loading: true,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setTok] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = getAuth();
    if (stored) {
      setTok(stored.token);
      setUser(stored.usuario);
    }
    setLoading(false);
  }, []);

  const login = (t: string, u: AuthUser) => {
    setAuth({ token: t, usuario: u });
    setTok(t);
    setUser(u);
  };

  const logout = () => {
    clearAuth();
    setTok(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
