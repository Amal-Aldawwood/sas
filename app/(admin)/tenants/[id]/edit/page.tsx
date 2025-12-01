"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function EditTenant({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    subdomain: "",
    primaryColor: "#FF6B00",
    secondaryColor: "#0066FF",
    logoUrl: "",
  });
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [originalSubdomain, setOriginalSubdomain] = useState("");

  // Fetch tenant data
  useEffect(() => {
    async function fetchTenant() {
      try {
        const response = await fetch(`/api/admin/tenants/${params.id}`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch client data");
        }
        
        setFormData({
          name: data.tenant.name,
          subdomain: data.tenant.subdomain,
          primaryColor: data.tenant.primaryColor,
          secondaryColor: data.tenant.secondaryColor,
          logoUrl: data.tenant.logoUrl || "",
        });
        
        // Store the original subdomain to check if it was changed
        setOriginalSubdomain(data.tenant.subdomain);
      } catch (error: any) {
        setError(error.message);
        console.error("Error fetching tenant:", error);
      } finally {
        setInitialLoading(false);
      }
    }
    
    fetchTenant();
  }, [params.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");
    
    try {
      // Validate form
      if (!formData.name || !formData.subdomain) {
        throw new Error("Name and subdomain are required");
      }
      
      // Validate subdomain format (letters, numbers, hyphens only)
      if (!/^[a-z0-9-]+$/.test(formData.subdomain)) {
        throw new Error("Subdomain must contain only lowercase letters, numbers, and hyphens");
      }
      
      // Validate logo URL if provided
      if (formData.logoUrl) {
        try {
          new URL(formData.logoUrl);
        } catch (e) {
          throw new Error("Please enter a valid URL for the logo");
        }
      }
      
      // Send request to update tenant
      const response = await fetch(`/api/admin/tenants/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Failed to update client");
      }
      
      // Show success message
      setSuccessMessage(`Client "${formData.name}" has been updated successfully!`);
      
      // Create tenant link for different environments (in case subdomain changed)
      const tenantLink = window.location.hostname.includes('localhost')
        ? `/tenant/${formData.subdomain}/dashboard` // Local development format
        : `https://${formData.subdomain}.${window.location.hostname.split('.').slice(1).join('.')}/dashboard`; // Production format
      
      // If subdomain was changed, provide a link to the new subdomain
      if (formData.subdomain !== originalSubdomain) {
        setSuccessMessage(
          `Client "${formData.name}" has been updated successfully! The subdomain has changed from "${originalSubdomain}" to "${formData.subdomain}". You can now access the client at ${tenantLink}`
        );
      }
      
      // Set redirect timeout (longer when subdomain changed to let user read the message)
      const redirectDelay = formData.subdomain !== originalSubdomain ? 7000 : 3000;
      
      // Redirect after a delay to allow user to see the success message
      setTimeout(() => {
        router.push("/admin/dashboard");
      }, redirectDelay);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading client data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-3xl mx-auto py-10 px-4 sm:px-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Edit Client</h1>
          <Link
            href="/admin/dashboard"
            className="px-3 py-1 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          >
            Back to Dashboard
          </Link>
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
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-md flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>{successMessage}</span>
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
                    />
                    <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                      .yourapp.com
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Use lowercase letters, numbers, and hyphens only. This will be part of the client's URL.
                    {originalSubdomain !== formData.subdomain && (
                      <span className="text-orange-500 block mt-1">
                        Warning: Changing the subdomain will change the client's URL!
                      </span>
                    )}
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
              
              <div className="pt-5">
                <div className="flex justify-end">
                  <Link
                    href="/admin/dashboard"
                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    disabled={loading}
                  >
                    {loading ? "Updating..." : "Update Client"}
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
