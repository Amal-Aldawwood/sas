export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This layout doesn't add any UI - it just passes the children through
  // It inherits from the parent tenant layout
  return children;
}
