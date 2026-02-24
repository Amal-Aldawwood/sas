"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// This is a special route that redirects to the correct tenant dashboard
// It handles the format: /tenant/{tenantSubdomain}/dashboard
// This is used by the client creation page to provide a direct link to the new client dashboard

export default function TenantRedirector({
  params,
}: {
  params: { tenant: string };
}) {
  const router = useRouter();
  const tenantSubdomain = params.tenant;
  
  useEffect(() => {
    console.log(`Redirecting to tenant dashboard: ${tenantSubdomain}`);
    
    // Redirect to the tenant dashboard using the app router format
    router.push(`/${tenantSubdomain}/dashboard`);
  }, [tenantSubdomain, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-4">Redirecting to client dashboard</h1>
        <p className="text-gray-600 text-center mb-6">
          Please wait while we redirect you to the {tenantSubdomain} dashboard...
        </p>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    </div>
  );
}
