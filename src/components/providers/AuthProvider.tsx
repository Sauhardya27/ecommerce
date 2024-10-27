"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initializeAuth = () => {
      const token = Cookies.get('authToken');
      const storedUser = localStorage.getItem('user');
      
      if (token && storedUser) {
        try {
          setIsAuthenticated(true);
          setUser(JSON.parse(storedUser));
        } catch (error) {
          Cookies.remove('authToken');
          localStorage.removeItem('user');
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = (token: string, userData: User) => {
    try {
      Cookies.set('authToken', token, { 
        expires: 1,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production'
      });
      localStorage.setItem('user', JSON.stringify(userData));
      setIsAuthenticated(true);
      setUser(userData);
      
    } catch (error) {
      console.error('Error during login:', error);
      logout();
    }
  };

  const logout = () => {
    Cookies.remove('authToken');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
    router.push('/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider 
      value={{
        isAuthenticated,
        user,
        login,
        logout,
        isLoading
      }}
    >
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