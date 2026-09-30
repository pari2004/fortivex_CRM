'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getDynamicAccounts } from '@/lib/data/mockUsers';
import { Logo } from '@/components/common/Logo';
import { PermissionsManager } from '@/lib/PermissionsManager';
export type Role = 'it' | 'admin' | 'counselor' | 'manager' | 'marketing' | 'member';

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
  managerId?: string;
  teamId?: string;
  avatar?: string;
}

type PermissionMatrix = Record<string, Record<string, boolean>>;
const mergePermissions = (...matrices: PermissionMatrix[]): PermissionMatrix => matrices.reduce<PermissionMatrix>((merged, matrix) => {
  Object.entries(matrix || {}).forEach(([module, actions]) => {
    merged[module] = { ...merged[module] };
    Object.entries(actions).forEach(([action, allowed]) => { merged[module][action] = Boolean(merged[module][action] || allowed); });
  });
  return merged;
}, {});



interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  role: Role;
  rolePermissions: Record<string, Record<string, boolean>>;
  hasPermission: (module: string, action?: string) => boolean;
  canViewUser: (targetUserId?: string) => boolean;
  canManageUser: (targetUserId?: string) => boolean;
  login: (mobile: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  setRole: (role: Role) => void;
  updateUser: (updates: Partial<User>) => void;
  forceRefreshPermissions: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [role, setRoleState] = useState<Role>('admin');
  const [rolePermissions, setRolePermissions] = useState<Record<string, Record<string, boolean>>>({});
  const [isInitializing, setIsInitializing] = useState(true);
  const pathname = usePathname();

  const updatePermissionsForRole = (currentRole: string, userId?: string) => {
    try {
      if (currentRole === 'it') {
        const ALL_MODULES = [
          'Dashboard', 'Leads', 'Pipeline', 'Applications', 'Students', 'Tasks', 
          'Calendar', 'Calls', 'WhatsApp', 'Email', 'Documents', 'Payments', 
          'Reports', 'Analytics', 'Users', 'Roles', 'Automation', 'Settings',
          'Customization', 'Integration'
        ];
        const allPerms: any = {};
        ALL_MODULES.forEach(m => allPerms[m] = { View: true, Create: true, Edit: true, Delete: true });
        setRolePermissions(allPerms);
        return;
      }

      const storedUserPermissions = PermissionsManager.getUserPermissions();
      const personalPermissions = storedUserPermissions && userId ? storedUserPermissions[userId] || {} : {};
      
      const storedRoles = PermissionsManager.getCustomRoles();
      let customRolePerms: PermissionMatrix = {};
      if (storedRoles && Array.isArray(storedRoles)) {
        const parsedRoles = storedRoles;
        const roleMap: Record<string, string> = {
          'it': 'IT',
          'admin': 'Admin',
          'manager': 'Manager', // Might not exist in initialData, but keep for robustness
          'counselor': 'Admission Counselor',
          'marketing': 'Marketing', // Fixed from 'Marketing Manager'
          'member': 'Member'
        };
        const mappedName = roleMap[currentRole] || 'Admin';
        const matchedRole = parsedRoles.find((r: any) => r.name === mappedName);
        if (matchedRole && matchedRole.permissions && Object.keys(matchedRole.permissions).length > 0) {
          customRolePerms = matchedRole.permissions;
        }
      }

      const merged = mergePermissions(personalPermissions, customRolePerms);
      if (Object.keys(merged).length > 0) {
        setRolePermissions(merged);
        return;
      }

      // Default fallback if not found
      setRolePermissions({});
      return;
    } catch(e) {
      console.error('Error loading custom roles', e);
    }
    
    // Default fallback if not found
    setRolePermissions({});
  };

  const hasPermission = (module: string, action: string = 'View'): boolean => {
    if (role === 'it') return true; // IT is the ultimate super admin
    if (Object.keys(rolePermissions).length === 0) {
       // fallback for uninitialized
       return module === 'Dashboard';
    }
    return !!rolePermissions[module]?.[action];
  };

  const canViewUser = (targetUserId?: string): boolean => {
    if (role === 'it') return true;
    if (!user) return false;
    if (!targetUserId) return true; // If no owner is specified, assume global
    if (targetUserId === user.id) return true;
    if (targetUserId === user.name) return true; // Handling mock string names

    if (role === 'manager') {
      const targetUser = getDynamicAccounts().find(u => u.id === targetUserId || u.name === targetUserId);
      if (targetUser && targetUser.managerId === user.id) return true;
    }
    
    return false;
  };

  const canManageUser = (targetUserId?: string): boolean => {
    if (role === 'it') return true;
    if (!user) return false;
    if (targetUserId === user.id) return false; // Usually can't manage self's permissions
    if (targetUserId === user.name) return false;

    if (role === 'manager') {
      const targetUser = getDynamicAccounts().find(u => u.id === targetUserId || u.name === targetUserId);
      if (targetUser && targetUser.managerId === user.id) return true;
    }
    
    return false;
  };

  const router = useRouter();

<<<<<<< Updated upstream
  // Validate the real session against the server on mount (httpOnly cookie is the source of truth).
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        if (data.user && data.user.role) {
          setUser(data.user);
          setRoleState(data.user.role);
          updatePermissionsForRole(data.user.role);
          setIsAuthenticated(true);
        }
      } catch (e) {
        console.error('Failed to validate session', e);
      } finally {
        setIsInitializing(false);
      }
    })();
  }, []);

  const login = async (mobile: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Login failed.' };
      }
      setUser(data.user);
      setRoleState(data.user.role);
      updatePermissionsForRole(data.user.role);
      setIsAuthenticated(true);
      router.push('/dashboard');
      return { success: true };
    } catch (e) {
      console.error('Login failed', e);
      return { success: false, error: 'Unable to reach the server.' };
    }
=======
  // Re-sync permissions on route navigation
  useEffect(() => {
    if (isAuthenticated && user) {
      updatePermissionsForRole(user.role, user.id);
    }
  }, [pathname, isAuthenticated, user?.id, user?.role]);

  // Sync permissions across components & storage events
  useEffect(() => {
    const handlePermissionsUpdated = () => {
      if (user) {
        updatePermissionsForRole(user.role, user.id);
      }
    };

    window.addEventListener('storage', handlePermissionsUpdated);
    window.addEventListener('crm_permissions_updated', handlePermissionsUpdated);

    return () => {
      window.removeEventListener('storage', handlePermissionsUpdated);
      window.removeEventListener('crm_permissions_updated', handlePermissionsUpdated);
    };
  }, [user]);

  // Persist session in localStorage if running in browser
  useEffect(() => {
    const init = async () => {
      await PermissionsManager.load();
      const savedSession = localStorage.getItem('empowers_session');
      if (savedSession) {
        try {
          const parsed = JSON.parse(savedSession) as User;
          if (parsed && parsed.role) {
            setUser(parsed);
            setRoleState(parsed.role);
            updatePermissionsForRole(parsed.role, parsed.id);
            setIsAuthenticated(true);
          }
        } catch (e) {
          console.error('Failed to parse session', e);
        }
      }
      setIsInitializing(false);
    };
    init();
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    setRoleState(userData.role);
    updatePermissionsForRole(userData.role, userData.id);
    setIsAuthenticated(true);
    localStorage.setItem('empowers_session', JSON.stringify(userData));
    router.push('/dashboard');
>>>>>>> Stashed changes
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    fetch('/api/auth/logout', { method: 'POST' }).catch(console.error);
    router.push('/login');
  };

  const setRole = (newRole: Role) => {
    setRoleState(newRole);
    updatePermissionsForRole(newRole, user?.id);
    if (user) {
      const updatedUser = { ...user, role: newRole };
      setUser(updatedUser);
      fetch(`/api/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      }).catch(console.error);
    }
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      fetch(`/api/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      }).catch(console.error);
    }
  };

  const forceRefreshPermissions = () => {
    updatePermissionsForRole(role, user?.id);
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
    <AuthContext.Provider value={{ isAuthenticated, user, role, rolePermissions, hasPermission, canViewUser, canManageUser, login, logout, setRole, updateUser, forceRefreshPermissions }}>
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
