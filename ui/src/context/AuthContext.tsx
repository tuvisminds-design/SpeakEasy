import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../services/api';

interface User {
  id: number;
  email: string;
  first_name?: string;
  last_name?: string;
  role: string;
}

interface UserProfile {
  id: number;
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  bio?: string;
  avatar_url?: string;
  company?: string;
  job_title?: string;
  location?: string;
  website?: string;
  role: string;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  sendOTP: (email: string) => Promise<void>;
  verifyOTP: (email: string, otp: string) => Promise<void>;
  logout: () => void;
  updateProfile: (profileData: Partial<UserProfile>) => Promise<void>;
  fetchProfile: () => Promise<void>;
  isAuthenticated: boolean;
  loading: boolean;
}

interface SignUpData {
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  company?: string;
  job_title?: string;
  location?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const token = apiService.getToken();
    if (token) {
      // In a real app, you'd validate the token with the backend
      // For now, we'll just set a default user for demo purposes
      setUser({ id: 1, email: 'kulkarni.madhwaraj@gmail.com', first_name: 'Madhwaraj', last_name: 'Kulkarni', role: 'admin' });
      // Fetch profile data
      fetchProfile();
    }
    setLoading(false);
  }, []);

  const fetchProfile = async () => {
    try {
      const profileData = await apiService.getProfile();
      setProfile(profileData);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    }
  };

  const sendOTP = async (email: string) => {
    try {
      setLoading(true);
      await apiService.sendOTP(email);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async (email: string, otp: string) => {
    try {
      setLoading(true);
      const result = await apiService.verifyOTP(email, otp);
      setUser(result.user);
      await fetchProfile();
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profileData: Partial<UserProfile>) => {
    try {
      const updatedProfile = await apiService.updateProfile(profileData);
      setProfile(updatedProfile);
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setProfile(null);
    apiService.clearToken();
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      profile,
      sendOTP,
      verifyOTP,
      logout, 
      updateProfile,
      fetchProfile,
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
