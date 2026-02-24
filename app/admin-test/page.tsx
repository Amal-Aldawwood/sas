"use client";

export default function AdminTestPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-gray-900">Admin Test Page</h1>
        <p className="mt-4">
          This test page doesn't use route groups to check if that's causing the issue.
        </p>
      </div>
    </div>
  );
}
