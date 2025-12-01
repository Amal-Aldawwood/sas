"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function TestRouting() {
  const [currentUrl, setCurrentUrl] = useState("");
  const [hostname, setHostname] = useState("");
  const [availableTenants, setAvailableTenants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Get current URL info
    setCurrentUrl(window.location.href);
    setHostname(window.location.hostname);

    // Fetch all tenants to verify data
    const fetchTenants = async () => {
      try {
        const response = await fetch('/api/admin/tenants');
        if (response.ok) {
          const data = await response.json();
          setAvailableTenants(data.tenants || []);
        } else {
          setError("Failed to fetch tenants");
        }
      } catch (err) {
        setError("Error fetching tenant data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTenants();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-blue-600">Routing Test Page</h1>

        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-2">Current URL Information</h2>
          <div className="bg-gray-50 p-4 rounded border">
            <p><strong>Full URL:</strong> {currentUrl}</p>
            <p><strong>Hostname:</strong> {hostname}</p>
            <p><strong>Pathname:</strong> {typeof window !== 'undefined' ? window.location.pathname : ''}</p>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-2">Available Tenants</h2>
          {loading ? (
            <p>Loading tenant data...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <div className="bg-gray-50 p-4 rounded border">
              {availableTenants.length > 0 ? (
                <ul className="space-y-2">
                  {availableTenants.map((tenant) => (
                    <li key={tenant.id}>
                      <strong>{tenant.name}</strong> - 
                      Subdomain: <code className="bg-gray-200 px-1">{tenant.subdomain}</code>
                      <div className="mt-1">
                        <Link 
                          href={`/tenant/${tenant.subdomain}/dashboard`}
                          className="text-blue-500 hover:underline mr-4"
                        >
                          Visit Dashboard
                        </Link>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No tenants found.</p>
              )}
            </div>
          )}
        </div>

        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-2">Common Routes</h2>
          <div className="bg-gray-50 p-4 rounded border">
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-blue-500 hover:underline">
                  Home Page
                </Link>
              </li>
              <li>
                <Link href="/admin/dashboard" className="text-blue-500 hover:underline">
                  Admin Dashboard
                </Link>
              </li>
              <li>
                <Link href="/tenant/alnajah/dashboard" className="text-blue-500 hover:underline">
                  Alnajah Dashboard
                </Link>
              </li>
              <li>
                <Link href="/tenant/almajd/dashboard" className="text-blue-500 hover:underline">
                  Almajd Dashboard
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 p-4 bg-yellow-50 rounded border border-yellow-200">
          <h2 className="text-lg font-semibold mb-2 text-yellow-800">Debugging Tips</h2>
          <ul className="list-disc pl-5 space-y-1 text-gray-700">
            <li>Make sure your middleware.ts is correctly routing requests</li>
            <li>Check Next.js configuration for any routing issues</li>
            <li>Verify that the database has tenant data with the expected subdomains</li>
            <li>Check browser console for any JavaScript errors</li>
            <li>Try accessing tenant routes via /tenant/[subdomain]/dashboard format</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
