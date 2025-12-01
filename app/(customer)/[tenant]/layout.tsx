"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import LogoutButton from "@/components/LogoutButton";
import { AuthProvider } from "@/lib/auth-context";
import { getTenantPath, validateTenantExists } from "@/lib/tenant-utils";
import TenantNotFound from "@/components/TenantNotFound";

export default function TenantLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { tenant: string };
}) {
  const [tenant, setTenant] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Define the type for debug information
  interface DebugInfo {
    tenantParam?: string;
    apiUrl?: string;
    responseStatus?: number;
    receivedData?: any;
    errorResponse?: string;
    [key: string]: any;
  }
  
  const [debugInfo, setDebugInfo] = useState<DebugInfo>({});

  useEffect(() => {
    // Fetch tenant info when component mounts
    const fetchTenantInfo = async () => {
      try {
        // Capture important debug information about the current environment
        const currentUrl = typeof window !== 'undefined' ? window.location.href : 'SSR';
        const hostname = typeof window !== 'undefined' ? window.location.hostname : 'SSR';
        const pathname = typeof window !== 'undefined' ? window.location.pathname : 'SSR';
        
        console.log(`[TENANT-LAYOUT] Attempting to fetch tenant info for: ${params.tenant}`);
        console.log(`[TENANT-LAYOUT] Current URL: ${currentUrl}`);
        console.log(`[TENANT-LAYOUT] Hostname: ${hostname}`);
        console.log(`[TENANT-LAYOUT] Pathname: ${pathname}`);
        
        // Update debug info with environment details
        setDebugInfo((prev: DebugInfo) => ({
          ...prev, 
          tenantParam: params.tenant,
          currentUrl,
          hostname,
          pathname
        }));
        
        // Validate tenant exists before proceeding
        const tenantExists = await validateTenantExists(params.tenant);
        
        if (!tenantExists) {
          console.error(`[TENANT-LAYOUT] Tenant validation failed for: ${params.tenant}`);
          setDebugInfo((prev: DebugInfo) => ({...prev, validationFailed: true}));
          setError("Tenant not found");
          setLoading(false);
          return;
        }
        
        // Construct API URL for tenant info
        const apiUrl = `/api/${params.tenant}/auth/tenant-info`;
        console.log(`[TENANT-LAYOUT] API URL: ${apiUrl}`);
        setDebugInfo((prev: DebugInfo) => ({...prev, apiUrl}));
        
        // Fetch tenant information
        console.log(`[TENANT-LAYOUT] Fetching tenant data from: ${apiUrl}`);
        const tenantResponse = await fetch(apiUrl, {
          // Include credentials to ensure cookies are sent with the request
          credentials: 'same-origin',
          // Add cache control to prevent stale responses
          cache: 'no-store',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        // Record response status in debug info
        const status = tenantResponse.status;
        console.log(`[TENANT-LAYOUT] Tenant API response status: ${status}`);
        setDebugInfo((prev: DebugInfo) => ({...prev, responseStatus: status}));
        
        if (tenantResponse.ok) {
          const data = await tenantResponse.json();
          console.log(`[TENANT-LAYOUT] Tenant data received:`, data);
          setDebugInfo((prev: DebugInfo) => ({...prev, receivedData: data}));
          
          if (data && data.tenant) {
            setTenant(data.tenant);
          } else {
            console.error(`[TENANT-LAYOUT] Invalid tenant data format:`, data);
            setDebugInfo((prev: DebugInfo) => ({...prev, invalidFormat: true}));
            setError("Invalid tenant data format");
          }
        } else {
          let errorText;
          try {
            errorText = await tenantResponse.text();
          } catch (textError) {
            errorText = "Could not extract error text";
          }
          
          console.error(`[TENANT-LAYOUT] Failed to load tenant: ${status}`, errorText);
          setDebugInfo((prev: DebugInfo) => ({...prev, errorResponse: errorText}));
          setError("Tenant not found");
        }
      } catch (err) {
        console.error("[TENANT-LAYOUT] Error fetching tenant:", err);
        setDebugInfo((prev: DebugInfo) => ({...prev, exception: String(err)}));
        setError("Error loading tenant information");
      } finally {
        setLoading(false);
      }
    };

    if (params.tenant) {
      fetchTenantInfo();
    } else {
      console.error("[TENANT-LAYOUT] No tenant parameter provided");
      setDebugInfo((prev: DebugInfo) => ({...prev, missingParam: true}));
      setError("Missing tenant parameter");
      setLoading(false);
    }
  }, [params.tenant]);

  // If loading, show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Loading...</h1>
          <p className="text-gray-600">Please wait while we load the tenant information.</p>
        </div>
      </div>
    );
  }

  // If error or no tenant, show error state
  if (error || !tenant) {
    console.log(`[TENANT-LAYOUT] Displaying TenantNotFound with debug info:`, debugInfo);
    return <TenantNotFound debugInfo={debugInfo} />;
  }

  // Define the CSS variables for tenant branding
  const styleVars = {
    "--primary-color": tenant.primaryColor,
    "--secondary-color": tenant.secondaryColor,
  } as React.CSSProperties;

  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col" style={styleVars}>
        {/* Header with tenant branding */}
        <header
          className="bg-white shadow"
          style={{ borderBottom: `4px solid var(--primary-color)` }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex items-center">
                {/* Tenant logo */}
                <div className="flex-shrink-0 flex items-center">
                  {tenant.logoUrl ? (
                    <img
                      src={tenant.logoUrl}
                      alt={`${tenant.name} logo`}
                      className="h-8 w-auto"
                    />
                  ) : (
                    <div
                      className="h-8 w-8 rounded-full flex items-center justify-center text-white"
                      style={{ backgroundColor: tenant.primaryColor }}
                    >
                      {tenant.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span
                    className="ml-2 text-xl font-bold"
                    style={{ color: tenant.primaryColor }}
                  >
                    {tenant.name}
                  </span>
                </div>
              </div>

              <nav className="flex space-x-8 items-center">
                <Link
                  href={getTenantPath(tenant.subdomain, 'dashboard')}
                  className="text-gray-500 hover:text-gray-900"
                >
                  Dashboard
                </Link>
                <Link
                  href={getTenantPath(tenant.subdomain, 'users')}
                  className="text-gray-500 hover:text-gray-900"
                >
                  Users
                </Link>
                <div className="ml-4 flex items-center md:ml-6">
                  <LogoutButton tenant={tenant} />
                </div>
              </nav>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 bg-gray-50">
          <div
            className="h-2"
            style={{ backgroundColor: tenant.secondaryColor }}
          ></div>
          {children}
        </main>

        {/* Footer */}
        <footer
          className="bg-white py-4 border-t border-gray-200"
          style={{ borderTop: `1px solid ${tenant.primaryColor}20` }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between">
              <div className="text-sm text-gray-500">
                &copy; {new Date().getFullYear()} {tenant.name}. All rights
                reserved.
              </div>
              <div
                className="text-sm"
                style={{ color: tenant.primaryColor }}
              >
                Powered by YourApp
              </div>
            </div>
          </div>
        </footer>
      </div>
    </AuthProvider>
  );
}
