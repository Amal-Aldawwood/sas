"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function DirectAccessClinr() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the Clinr tenant dashboard using the direct-access pattern
    // This will be properly handled by our middleware and tenant validation
    // Added a slight delay to allow the page to render first
    const timeout = setTimeout(() => {
      router.push("/direct-access-clinr/dashboard");
    }, 1500);
    
    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
        <div className="mb-6">
          <div
            className="h-16 w-16 rounded-full flex items-center justify-center text-white text-2xl mx-auto"
            style={{ backgroundColor: "#ff6b00" }}
          >
            C
          </div>
        </div>
        <h1 className="text-2xl font-bold mb-4" style={{ color: "#ff6b00" }}>
          Redirecting to Clinr Dashboard
        </h1>
        <p className="mb-4">
          You are being redirected to the Clinr tenant dashboard...
        </p>
        <div className="mt-4 mb-6">
          <div className="h-2 bg-blue-200 rounded w-full relative overflow-hidden">
            <div className="h-full bg-blue-600 absolute left-0 top-0 animate-[progress_1.5s_ease-in-out]" style={{ width: "100%" }}></div>
          </div>
        </div>
        <div className="mt-8">
          <Link
            href="/direct-access-clinr/dashboard"
            className="px-4 py-2 text-white rounded-md hover:opacity-90 inline-block"
            style={{ backgroundColor: "#ff6b00" }}
          >
            Go to Clinr Dashboard
          </Link>
        </div>
        <div className="mt-4">
          <p className="text-sm text-gray-500">
            Login with: admin@clinr.com / password123
          </p>
        </div>
      </div>
    </div>
  );
}
