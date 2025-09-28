import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../services/api';

interface User {
  id: number;
  username: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const token = apiService.getToken();
    if (token) {
      // For now, we'll just set a default user
      // In a real app, you'd validate the token with the backend
      setUser({ id: 1, username: 'admin', role: 'admin' });
    }
    setLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const result = await apiService.login(username, password);
      setUser(result.user);
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    apiService.clearToken();
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      isAuthenticated: !!user,
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
