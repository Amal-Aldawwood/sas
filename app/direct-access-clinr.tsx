"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DirectAccessClinr() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the Clinr tenant dashboard
    router.push("/clinr/dashboard");
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
        <h1 className="text-2xl font-bold text-blue-600 mb-4">
          Redirecting to Clinr Dashboard
        </h1>
        <p className="mb-4">
          You are being redirected to the Clinr tenant dashboard...
        </p>
        <div className="mt-4 animate-pulse">
          <div className="h-2 bg-blue-200 rounded"></div>
        </div>
        <div className="mt-8">
          <button
            onClick={() => router.push("/clinr/dashboard")}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Go to Clinr Dashboard
          </button>
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
