import React from "react";

export default function TenantsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full">
      {/* This layout ensures proper routing for tenant management pages */}
      {children}
    </div>
  );
}
