import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sales Pilot | Lead. Close. Grow.",
  description: "Enterprise Sales CRM and Operations Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} antialiased`}>
        {children}
        <Toaster 
          position="top-right" 
          toastOptions={{
            style: {
              background: '#1e1e38',
              color: '#f8fafc',
              border: '1px solid rgba(99, 102, 241, 0.2)',
            },
            success: {
              iconTheme: { primary: '#10b981', secondary: '#fff' },
            },
          }} 
        />
      </body>
    </html>
  );
}

