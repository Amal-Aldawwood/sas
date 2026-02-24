"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NoAuthTenantCreate() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    subdomain: "",
    primaryColor: "#FF6B00",
    secondaryColor: "#0066FF",
    logoUrl: "",
    adminEmail: "",
    adminPassword: "",
    adminName: ""
  });
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [createdTenant, setCreatedTenant] = useState<{name: string, link: string} | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");
    setCreatedTenant(null);
    
    try {
      // Validate required fields
      if (!formData.name || !formData.subdomain) {
        throw new Error("Company name and subdomain are required");
      }
      
      if (!formData.adminEmail || !formData.adminPassword || !formData.adminName) {
        throw new Error("Admin name, email, and password are required");
      }
      
      // Validate email format
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(formData.adminEmail)) {
        throw new Error("Please enter a valid email address");
      }
      
      // Validate subdomain format
      if (!/^[a-z0-9-]+$/.test(formData.subdomain)) {
        throw new Error("Subdomain must contain only lowercase letters, numbers, and hyphens");
      }
      
      // Validate password strength
      if (formData.adminPassword.length < 8) {
        throw new Error("Password must be at least 8 characters long");
      }
      
      // Send request to create tenant
      const response = await fetch("/api/admin/tenants", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Failed to create client");
      }
      
      // Create tenant link for different environments
      const tenantLink = window.location.hostname.includes('localhost') || window.location.hostname.includes('127.0.0.1')
        ? `/tenant/${formData.subdomain}/dashboard`
        : `https://${formData.subdomain}.${window.location.hostname.split('.').slice(1).join('.')}/dashboard`;
      
      // Store created tenant info
      setCreatedTenant({
        name: formData.name,
        link: tenantLink
      });
      
      console.log(`Client created successfully. Link: ${tenantLink}`);
      
      // Show success message
      setSuccessMessage(`Client "${formData.name}" created successfully!`);
      
      // Clear form data
      setFormData({
        name: "",
        subdomain: "",
        primaryColor: "#FF6B00",
        secondaryColor: "#0066FF",
        logoUrl: "",
        adminEmail: "",
        adminPassword: "",
        adminName: ""
      });
      
      // Redirect after a delay
      setTimeout(() => {
        router.push("/admin/dashboard");
      }, 5000);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-3xl mx-auto py-10 px-4 sm:px-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Add New Client (No Auth Required)</h1>
          <Link
            href="/"
            className="px-3 py-1 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          >
            Back to Home
          </Link>
        </div>
        
        <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                This page bypasses authentication for testing purposes. In a production environment, this would require admin login.
              </p>
            </div>
          </div>
        </div>
        
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </div>
        )}
        
        {successMessage && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-md">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>{successMessage}</span>
            </div>
            
            {createdTenant && (
              <div className="mt-2">
                <Link 
                  href={createdTenant.link}
                  className="text-blue-600 underline hover:text-blue-800"
                >
                  Click here
                </Link>
                <span> to access the new client dashboard, or you will be redirected to admin dashboard in 5 seconds.</span>
                <div className="mt-1 text-sm text-gray-600">
                  Client URL: <code className="bg-gray-100 px-1 py-0.5 rounded">{createdTenant.link}</code>
                </div>
              </div>
            )}
          </div>
        )}
        
        <div className="bg-white shadow rounded-lg p-6">
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <h2 className="text-xl font-medium text-gray-900">Company Information</h2>
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Company Name <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                      placeholder="Alnajah Company"
                    />
                  </div>
                </div>
                
                <div className="sm:col-span-3">
                  <label htmlFor="subdomain" className="block text-sm font-medium text-gray-700">
                    Subdomain <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <input
                      type="text"
                      name="subdomain"
                      id="subdomain"
                      value={formData.subdomain}
                      onChange={handleChange}
                      className="focus:ring-blue-500 focus:border-blue-500 flex-1 block w-full rounded-none rounded-l-md sm:text-sm border-gray-300 p-2 border"
                      placeholder="alnajah"
                    />
                    <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                      .yourapp.com
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Use lowercase letters, numbers, and hyphens only. This will be part of the client's URL.
                  </p>
                </div>
                
                <div className="sm:col-span-3">
                  <label htmlFor="primaryColor" className="block text-sm font-medium text-gray-700">
                    Primary Color
                  </label>
                  <div className="mt-1 flex items-center">
                    <input
                      type="color"
                      name="primaryColor"
                      id="primaryColor"
                      value={formData.primaryColor}
                      onChange={handleChange}
                      className="h-8 w-8 border border-gray-300 rounded-md shadow-sm"
                    />
                    <input
                      type="text"
                      name="primaryColor"
                      value={formData.primaryColor}
                      onChange={handleChange}
                      className="ml-2 flex-1 focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                    />
                  </div>
                </div>
                
                <div className="sm:col-span-3">
                  <label htmlFor="secondaryColor" className="block text-sm font-medium text-gray-700">
                    Secondary Color
                  </label>
                  <div className="mt-1 flex items-center">
                    <input
                      type="color"
                      name="secondaryColor"
                      id="secondaryColor"
                      value={formData.secondaryColor}
                      onChange={handleChange}
                      className="h-8 w-8 border border-gray-300 rounded-md shadow-sm"
                    />
                    <input
                      type="text"
                      name="secondaryColor"
                      value={formData.secondaryColor}
                      onChange={handleChange}
                      className="ml-2 flex-1 focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                    />
                  </div>
                </div>
                
                <div className="sm:col-span-6">
                  <label htmlFor="logoUrl" className="block text-sm font-medium text-gray-700">
                    Logo URL
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="logoUrl"
                      id="logoUrl"
                      value={formData.logoUrl}
                      onChange={handleChange}
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                      placeholder="https://example.com/logo.png"
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      In a real application, this would be a file upload. For demo purposes, enter an image URL.
                    </p>
                  </div>
                </div>
              </div>
              
              <hr className="my-6" />
              
              <h2 className="text-xl font-medium text-gray-900">Admin Account</h2>
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label htmlFor="adminName" className="block text-sm font-medium text-gray-700">
                    Admin Name <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="adminName"
                      id="adminName"
                      value={formData.adminName}
                      onChange={handleChange}
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                      placeholder="John Doe"
                    />
                  </div>
                </div>
                
                <div className="sm:col-span-3">
                  <label htmlFor="adminEmail" className="block text-sm font-medium text-gray-700">
                    Admin Email <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1">
                    <input
                      type="email"
                      name="adminEmail"
                      id="adminEmail"
                      value={formData.adminEmail}
                      onChange={handleChange}
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                      placeholder="admin@alnajah.com"
                    />
                  </div>
                </div>
                
                <div className="sm:col-span-3">
                  <label htmlFor="adminPassword" className="block text-sm font-medium text-gray-700">
                    Admin Password <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1">
                    <input
                      type="password"
                      name="adminPassword"
                      id="adminPassword"
                      value={formData.adminPassword}
                      onChange={handleChange}
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Must be at least 8 characters long
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="pt-5">
                <div className="flex justify-end">
                  <Link
                    href="/"
                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    disabled={loading}
                  >
                    {loading ? "Creating..." : "Create"}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
