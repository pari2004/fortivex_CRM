'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/common/Logo';
export type Role = 'admin' | 'counselor' | 'manager' | 'marketing' | 'member';

export interface User {
  id: string;
  name: string;
  mobile: string;
  email?: string;
  department?: string;
  designation?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  role: Role;
  avatar?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  role: Role;
  login: (user: User) => void;
  logout: () => void;
  setRole: (role: Role) => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [role, setRoleState] = useState<Role>('admin');
  const [isInitializing, setIsInitializing] = useState(true);
  const router = useRouter();

  // Persist session in localStorage if running in browser
  useEffect(() => {
    const savedSession = localStorage.getItem('empowers_session');
    if (savedSession) {
      try {
        const parsed = JSON.parse(savedSession) as User;
        if (parsed && parsed.role) {
          setUser(parsed);
          setRoleState(parsed.role);
          setIsAuthenticated(true);
        }
      } catch (e) {
        console.error('Failed to parse session', e);
      }
    }
    setIsInitializing(false);
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    setRoleState(userData.role);
    setIsAuthenticated(true);
    localStorage.setItem('empowers_session', JSON.stringify(userData));
    router.push('/dashboard');
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('empowers_session');
    router.push('/login');
  };

  const setRole = (newRole: Role) => {
    setRoleState(newRole);
    if (user) {
      const updatedUser = { ...user, role: newRole };
      setUser(updatedUser);
      localStorage.setItem('empowers_session', JSON.stringify(updatedUser));
    }
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('empowers_session', JSON.stringify(updatedUser));
    }
  };

  if (isInitializing) {
    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0a0c14', color: '#fff', gap: '0' }}>
        <Logo size={110} />
        <div style={{ marginTop: '16px', fontSize: '20px', fontWeight: 800, letterSpacing: '0.5px', color: '#fff' }}>FORTIVEX.AI CRM</div>
        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', letterSpacing: '2px', textTransform: 'uppercase', marginTop: '4px' }}>AI-Powered Admissions CRM</div>
        <div style={{ marginTop: '28px', width: '36px', height: '36px', border: '3px solid rgba(67,100,247,0.2)', borderTopColor: '#4364f7', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div>
        <div style={{ marginTop: '14px', fontSize: '13px', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.8px' }}>Loading...</div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, role, login, logout, setRole, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
