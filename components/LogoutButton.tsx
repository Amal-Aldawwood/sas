"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton({ tenant }: { tenant: { subdomain: string } }) {
  const router = useRouter();
  
  const handleLogout = async () => {
    await fetch(`/api/${tenant.subdomain}/auth/logout`, {
      method: "POST",
    });
    router.push(`/login`);
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
