import "./globals.css";
import ClientLayout from "./client-layout";

export const metadata = {
  title: "Multi-Tenant SaaS Application",
  description: "A multi-tenant SaaS application with customer management",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
