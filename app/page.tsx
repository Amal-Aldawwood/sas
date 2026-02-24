"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AdminLogoutButton from "@/components/AdminLogoutButton";
import { getAllTenants } from "@/lib/mock-data";

export default function HomePage() {
  // Use our mock data directly instead of fetching from API
  const tenants = getAllTenants();
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-bold text-blue-600">
                YourApp Admin
              </Link>
            </div>
            
            <nav className="flex space-x-8 items-center">
              <Link href="/" className="text-gray-500 hover:text-gray-900">
                Dashboard
              </Link>
              <Link href="/admin/tenants/create" className="text-gray-500 hover:text-gray-900">
                Add Client
              </Link>
              <div className="ml-4 flex items-center md:ml-6">
                <AdminLogoutButton />
              </div>
            </nav>
          </div>
        </div>
      </header>
      
      {/* Main content - Dashboard */}
      <main className="flex-1">
        <div className="min-h-screen bg-gray-100">
          <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <div className="flex space-x-4">
                <Link 
                  href="/direct-access-clinr"
                  className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
                >
                  Clinr Direct Access
                </Link>
                <Link 
                  href="/no-auth-tenant-create"
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Create Client (No Auth)
                </Link>
                <Link 
                  href="/admin-create-tenant"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Add New Client
                </Link>
                <Link 
                  href="/admin/tenants/create"
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                >
                  Legacy Add Client
                </Link>
              </div>
            </div>
            
            <div className="bg-white shadow overflow-hidden rounded-lg">
              <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                <h2 className="text-lg leading-6 font-medium text-gray-900">
                  Clients
                </h2>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {tenants.length} Clients
                </span>
              </div>
              
              <div className="border-t border-gray-200">
                <ul className="divide-y divide-gray-200">
                  {tenants.map((tenant) => (
                    <li key={tenant.id} className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                            {tenant.logoUrl ? (
                              <img
                                src={tenant.logoUrl}
                                alt={`${tenant.name} logo`}
                                className="h-12 w-12 object-cover"
                              />
                            ) : (
                              <span className="text-gray-500 text-xl">
                                {tenant.name.charAt(0).toUpperCase()}
                              </span>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {tenant.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {tenant.subdomain}.yourapp.com
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <a
                            href={`http://${tenant.subdomain}.yourapp.com`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                          >
                            Visit
                          </a>
                          <Link
                            href={`/admin/tenants/${tenant.id}/edit`}
                            className="px-3 py-1 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                          >
                            Edit
                          </Link>
                        </div>
                      </div>
                      
                      <div className="mt-2 flex items-center text-sm text-gray-500">
                        <div className="mr-6">
                          <span className="inline-block w-3 h-3 rounded-full mr-1" style={{ backgroundColor: tenant.primaryColor }} />
                          Primary: {tenant.primaryColor}
                        </div>
                        <div>
                          <span className="inline-block w-3 h-3 rounded-full mr-1" style={{ backgroundColor: tenant.secondaryColor }} />
                          Secondary: {tenant.secondaryColor}
                        </div>
                      </div>
                    </li>
                  ))}
                  
                  {tenants.length === 0 && (
                    <li className="px-4 py-8 sm:px-6 text-center text-gray-500">
                      No clients added yet. Click "Add New Client" to get started.
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
