"use client";

import Link from "next/link";
import AdminLogoutButton from "@/components/AdminLogoutButton";
import { AuthProvider } from "@/lib/auth-context";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
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
        
        {/* Main content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </AuthProvider>
  );
}
