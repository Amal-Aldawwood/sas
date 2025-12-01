"use client";

import { useRouter } from "next/navigation";

export default function AdminLogoutButton() {
  const router = useRouter();
  
  const handleLogout = async () => {
    await fetch('/api/admin/auth/logout', { 
      method: 'POST' 
    });
    
    // Navigate to admin login page
    router.push('/admin');
  };
  
  return (
    <button 
      type="button" 
      className="px-3 py-1 rounded-md text-sm text-gray-700 hover:bg-gray-100"
      onClick={handleLogout}
    >
      Logout
    </button>
  );
}
