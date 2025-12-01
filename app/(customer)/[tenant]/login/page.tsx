"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export default function TenantLogin({
  params,
}: {
  params: { tenant: string };
}) {
  const router = useRouter();
  const { login, error: authError, user } = useAuth();
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [tenantInfo, setTenantInfo] = useState<any>(null);

  // Get tenant information based on subdomain
  useEffect(() => {
    const fetchTenantInfo = async () => {
      try {
        // Call our API to get tenant info from subdomain
        const response = await fetch(`/api/${params.tenant}/auth/tenant-info`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch tenant information");
        }
        
        if (data.tenant) {
          setTenantInfo(data.tenant);
          // Set document title based on tenant name
          document.title = `${data.tenant.name} | Login`;
        } else {
          setError("Tenant not found");
        }
      } catch (error: any) {
        setError(error.message);
      }
    };

    fetchTenantInfo();
  }, [params.tenant]);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      // Validate form
      if (!formData.email || !formData.password) {
        throw new Error("Email and password are required");
      }
      
      // Login using the auth context
      await login(formData.email, formData.password, params.tenant);
      
      // Redirect happens in the auth context
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!tenantInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <div className="text-center">
            {error ? (
              <div>
                <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
                <p className="text-gray-600 mb-4">{error}</p>
              </div>
            ) : (
              <div className="animate-pulse">
                <div className="h-12 w-12 bg-gray-200 rounded-full mx-auto mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-8"></div>
                <div className="h-10 bg-gray-200 rounded mb-4"></div>
                <div className="h-10 bg-gray-200 rounded mb-4"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Set up styles based on tenant branding
  const styleVars = {
    "--primary-color": tenantInfo.primaryColor,
    "--secondary-color": tenantInfo.secondaryColor,
  } as React.CSSProperties;

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-gray-100 px-4" 
      style={styleVars}
    >
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="text-center mb-8">
          {/* Tenant logo */}
          <div className="flex justify-center mb-6">
            {tenantInfo.logoUrl ? (
              <img
                src={tenantInfo.logoUrl}
                alt={`${tenantInfo.name} logo`}
                className="h-16 w-auto"
              />
            ) : (
              <div
                className="h-16 w-16 rounded-full flex items-center justify-center text-white text-2xl"
                style={{ backgroundColor: tenantInfo.primaryColor }}
              >
                {tenantInfo.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          
          <h2 
            className="text-2xl font-bold mb-1" 
            style={{ color: tenantInfo.primaryColor }}
          >
            {tenantInfo.name}
          </h2>
          <p className="text-gray-600">Sign in to your account</p>
        </div>
        
        {(error || authError) && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md">
            {error || authError}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label 
              htmlFor="email" 
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2"
              style={{ 
                "--focus-color": tenantInfo.primaryColor
              } as React.CSSProperties}
              value={formData.email}
              onChange={handleChange}
              placeholder="your.email@example.com"
            />
          </div>
          
          <div className="mb-6">
            <label 
              htmlFor="password" 
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2"
              style={{ 
                "--focus-color": tenantInfo.primaryColor
              } as React.CSSProperties}
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none"
              style={{ backgroundColor: tenantInfo.primaryColor }}
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </form>
        
        <div className="mt-6 text-center text-sm">
          <p className="text-gray-600">
            Forgot your password?{" "}
            <a 
              href="#" 
              className="font-medium hover:underline"
              style={{ color: tenantInfo.primaryColor }}
            >
              Reset it here
            </a>
          </p>
        </div>
        
        <div 
          className="mt-8 pt-6 text-center text-xs text-gray-500"
          style={{ borderTop: `1px solid ${tenantInfo.primaryColor}10` }}
        >
          Powered by YourApp
        </div>
      </div>
    </div>
  );
}
