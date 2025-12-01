"use client";

import { getTenantBySubdomain, prisma } from "@/lib/prisma";
import { useRouter } from "next/navigation";
import { useState } from "react";

// Dashboard for tenant users
export default function TenantDashboard({
  params,
}: {
  params: { tenant: string };
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // These functions would be defined client-side using hooks
  const handleAddRecord = () => {
    setIsLoading(true);
    // In a real app, this would make an API call
    console.log("Adding new record");
    setTimeout(() => {
      setIsLoading(false);
      // Refresh the page data
      router.refresh();
    }, 500);
  };

  const handleInviteUser = () => {
    setIsLoading(true);
    console.log("Inviting user");
    setTimeout(() => {
      setIsLoading(false);
      // Maybe show a success message
    }, 500);
  };

  const handleViewAllRecords = () => {
    router.push(`/${params.tenant}/data`);
  };

  // Tenant information would be fetched from an API endpoint
  // since we can't use async/await directly in client components
  // This is a static example for demonstration
  
  // For simplicity, we're using a static example
  // In a real app, you'd fetch this data from an API
  const tenant = {
    id: "1",
    name: "Alnajah Company",
    subdomain: params.tenant,
    primaryColor: "#FF6B00",
    secondaryColor: "#0066FF"
  };
  
  const userCount = 5; // Static example
  const totalItems = 10; // Static example
  const recentItems = 3; // Static example
  
  // Sample data for demonstration
  const data = [
    { id: "1", content: "Sample Record 1", createdAt: new Date('2024-01-05') },
    { id: "2", content: "Sample Record 2", createdAt: new Date('2024-01-04') },
    { id: "3", content: "Sample Record 3", createdAt: new Date('2024-01-03') },
  ];
  
  if (!tenant) {
    return <div>Tenant not found</div>;
  }
  
  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 
          className="text-3xl font-bold mb-8" 
          style={{ color: tenant.primaryColor }}
        >
          {tenant.name} Dashboard
        </h1>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
          {/* Total Users Card */}
          <div 
            className="bg-white overflow-hidden shadow rounded-lg"
            style={{ borderTop: `4px solid ${tenant.primaryColor}` }}
          >
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">
                Total Users
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">
                {userCount}
              </dd>
            </div>
          </div>
          
          {/* Total Data Items Card */}
          <div 
            className="bg-white overflow-hidden shadow rounded-lg"
            style={{ borderTop: `4px solid ${tenant.primaryColor}` }}
          >
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">
                Total Records
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">
                {totalItems}
              </dd>
            </div>
          </div>
          
          {/* Recent Items Card */}
          <div 
            className="bg-white overflow-hidden shadow rounded-lg"
            style={{ borderTop: `4px solid ${tenant.secondaryColor}` }}
          >
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">
                New Records (Last 7 Days)
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">
                {recentItems}
              </dd>
            </div>
          </div>
        </div>
        
        {/* Recent Data */}
        <div className="bg-white shadow overflow-hidden rounded-lg mb-8">
          <div 
            className="px-4 py-5 border-b border-gray-200 sm:px-6 flex justify-between items-center"
            style={{ borderBottom: `1px solid ${tenant.primaryColor}20` }}
          >
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Recent Records
            </h3>
            <span 
              className="px-3 py-1 rounded-full text-sm font-medium"
              style={{ 
                backgroundColor: `${tenant.primaryColor}20`,
                color: tenant.primaryColor
              }}
            >
              {data.length} Total
            </span>
          </div>
          
          {data.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {data.slice(0, 5).map((item) => (
                <li key={item.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {item.content}
                    </p>
                    <div className="ml-2 flex-shrink-0 flex">
                      <p 
                        className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                        style={{ 
                          backgroundColor: `${tenant.secondaryColor}20`,
                          color: tenant.secondaryColor
                        }}
                      >
                        {item.createdAt.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-10 text-gray-500">
              No records found. Add some data to get started.
            </div>
          )}
          
          {data.length > 5 && (
            <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
              <button
                type="button"
                onClick={handleViewAllRecords}
                className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
              >
                View all records
              </button>
            </div>
          )}
        </div>
        
        {/* Welcome Section */}
        <div 
          className="bg-white shadow overflow-hidden rounded-lg p-6"
          style={{ borderLeft: `4px solid ${tenant.secondaryColor}` }}
        >
          <h2 className="text-xl font-semibold mb-4">
            Welcome to Your Dashboard
          </h2>
          <p className="text-gray-600">
            This is your personalized dashboard for {tenant.name}. Here you can view and manage your data, users, and settings.
          </p>
          <div className="mt-4 flex">
            <button
              type="button"
              onClick={handleAddRecord}
              disabled={isLoading}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none"
              style={{ backgroundColor: tenant.primaryColor }}
            >
              {isLoading ? 'Processing...' : 'Add New Record'}
            </button>
            <button
              type="button"
              onClick={handleInviteUser}
              disabled={isLoading}
              className="ml-3 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
            >
              Invite User
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
