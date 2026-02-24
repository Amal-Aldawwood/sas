"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export default function AdminLogin() {
  const router = useRouter();
  const { login, error: authError, user } = useAuth();
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
      
      // Login using the auth context (with undefined as the tenant parameter to indicate admin login)
      await login(formData.email, formData.password);
      
      // Redirect happens in the auth context
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div
              className="h-16 w-16 rounded-full flex items-center justify-center text-white text-2xl"
              style={{ backgroundColor: "#007bff" }}
            >
              A
            </div>
          </div>
          
          <h2 
            className="text-2xl font-bold mb-1 text-blue-600"
          >
            Admin Login
          </h2>
          <p className="text-gray-600">Sign in with your super admin account</p>
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.email}
              onChange={handleChange}
              placeholder="admin@yourapp.com"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </div>
          
          <div className="mt-6 text-center text-sm">
            <p className="text-gray-600">
              Credentials: admin@yourapp.com / your-secure-password
            </p>
          </div>
        </form>
        
        <div 
          className="mt-8 pt-6 text-center text-xs text-gray-500"
          style={{ borderTop: `1px solid #007bff10` }}
        >
          Admin Portal
        </div>
      </div>
    </div>
  );
}
