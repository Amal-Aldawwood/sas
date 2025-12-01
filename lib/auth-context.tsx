"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

// Define the user type
export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'USER';
  tenantId: string;
};

// Auth context type
type AuthContextType = {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  tenant: any | null; // Tenant details
  login: (email: string, password: string, subdomain?: string) => Promise<void>;
  logout: () => void;
};

// Create the auth context
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
  tenant: null,
  login: async () => {},
  logout: () => {},
});

// Hook for using auth context
export const useAuth = () => useContext(AuthContext);

// Auth provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tenant, setTenant] = useState<any | null>(null);
  
  const router = useRouter();

  // Check for existing session
  useEffect(() => {
    const checkSession = async () => {
      try {
        // Get subdomain from window location in browser environment
        const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
        const isLocalhost = hostname.includes('localhost') || hostname.includes('127.0.0.1');
        
        let subdomain = '';
        
        if (isLocalhost) {
          // Extract from path for localhost (e.g., /tenant/mytenant)
          const path = window.location.pathname;
          const segments = path.split('/').filter(Boolean);
          console.log('[AUTH-CONTEXT] Path segments:', segments);
          
          if (segments[0] === 'tenant' && segments.length > 1) {
            subdomain = segments[1];
          } else if (segments[0] === 'admin') {
            subdomain = 'admin';
          }
        } else {
          // Extract subdomain from hostname for production
          subdomain = hostname.split('.')[0];
        }
        
        console.log('[AUTH-CONTEXT] Detected subdomain:', subdomain);
        
        // If subdomain is 'admin', we're on the admin site
        if (subdomain === 'admin') {
          console.log('[AUTH-CONTEXT] Checking admin session');
          // Try to get admin session
          const response = await fetch('/api/admin/auth/session', {
            credentials: 'same-origin', // Include cookies in the request
            cache: 'no-store' // Don't cache the response
          });
          
          console.log('[AUTH-CONTEXT] Admin session response status:', response.status);
          
          if (response.ok) {
            const data = await response.json();
            console.log('[AUTH-CONTEXT] Admin session data:', data);
            
            if (data.user) {
              setUser(data.user);
            } else {
              // No user found in session, clear any stale user data
              setUser(null);
              console.log('[AUTH-CONTEXT] No admin user in session');
            }
          } else {
            // Failed to get session, clear user data
            setUser(null);
            console.log('[AUTH-CONTEXT] Failed to get admin session');
          }
        } else if (subdomain && subdomain !== 'www') {
          // We're on a tenant site, get tenant info
          const tenantResponse = await fetch(`/api/${subdomain}/auth/tenant-info`);
          if (tenantResponse.ok) {
            const tenantData = await tenantResponse.json();
            setTenant(tenantData.tenant);
          }
          
          // Try to get tenant user session
          const userResponse = await fetch(`/api/${subdomain}/auth/session`);
          if (userResponse.ok) {
            const userData = await userResponse.json();
            if (userData.user) {
              setUser(userData.user);
            }
          }
        }
      } catch (error) {
        console.error('Session check error:', error);
        setError('Failed to retrieve session');
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  // Login function
  const login = async (email: string, password: string, subdomain?: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Determine if this is an admin login attempt
      const isAdminLogin = !subdomain || subdomain === 'admin';
      console.log(`[AUTH-CONTEXT] Login attempt - ${isAdminLogin ? 'admin' : 'tenant'} login`);
      
      let url = isAdminLogin ? '/api/admin/auth/login' : `/api/${subdomain}/auth/login`;
      
      // If this is a tenant login (not admin)
      if (!isAdminLogin && subdomain) {
        // Also get tenant data
        console.log(`[AUTH-CONTEXT] Fetching tenant info for: ${subdomain}`);
        const tenantResponse = await fetch(`/api/${subdomain}/auth/tenant-info`);
        if (tenantResponse.ok) {
          const tenantData = await tenantResponse.json();
          setTenant(tenantData.tenant);
        } else {
          throw new Error('Invalid tenant or tenant not found');
        }
      }
      
      console.log(`[AUTH-CONTEXT] Sending login request to: ${url}`);
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'same-origin', // Include cookies
        body: JSON.stringify({ email, password }),
      });
      
      console.log('[AUTH-CONTEXT] Login response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('[AUTH-CONTEXT] Login successful, user data:', data.user);
        setUser(data.user);
        
        // Redirect based on role
        if (data.user.role === 'SUPER_ADMIN') {
          console.log('[AUTH-CONTEXT] Redirecting to admin dashboard');
          router.push('/admin/dashboard');
        } else {
          console.log('[AUTH-CONTEXT] Redirecting to tenant dashboard');
          router.push('/dashboard');
        }
      } else {
        let errorMessage = 'Login failed';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          // If we can't parse the JSON, use the default error message
        }
        console.error('[AUTH-CONTEXT] Login failed:', errorMessage);
        setError(errorMessage);
        throw new Error(errorMessage); // Re-throw to be caught by the component
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    setLoading(true);
    
    try {
      // Get subdomain from window location in browser environment
      const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
      const isLocalhost = hostname.includes('localhost') || hostname.includes('127.0.0.1');
      
      let subdomain = '';
      
      if (isLocalhost) {
        // Extract from path for localhost (e.g., /tenant/mytenant)
        const path = window.location.pathname;
        const segments = path.split('/').filter(Boolean);
        if (segments[0] === 'tenant' && segments.length > 1) {
          subdomain = segments[1];
        } else if (segments[0] === 'admin') {
          subdomain = 'admin';
        }
      } else {
        // Extract subdomain from hostname for production
        subdomain = hostname.split('.')[0];
      }
      
      console.log('[AUTH-CONTEXT] Logging out from subdomain:', subdomain);
      
      // Determine if this is an admin logout
      const isAdminLogout = subdomain === 'admin';
      let url = isAdminLogout ? '/api/admin/auth/logout' : `/api/${subdomain}/auth/logout`;
      
      console.log(`[AUTH-CONTEXT] Sending logout request to: ${url}`);
      
      await fetch(url, { 
        method: 'POST',
        credentials: 'same-origin' // Include cookies
      });
      
      // Clear user state
      setUser(null);
      setTenant(null);
      
      console.log('[AUTH-CONTEXT] User logged out, redirecting');
      
      // Redirect to login
      if (subdomain === 'admin') {
        router.push('/admin');
      } else if (subdomain) {
        router.push(`/tenant/${subdomain}/login`);
      } else {
        router.push('/');
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    tenant,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
