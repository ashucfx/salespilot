import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SalesPilot | Enterprise CRM & Operations",
  description: "Enterprise Sales CRM and Operations Platform for managing leads, pipeline, and payouts.",
  metadataBase: new URL('https://salespilot.theripplenexus.com'),
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon.png', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'SalesPilot',
    description: 'Enterprise Sales CRM and Operations Platform',
    type: 'website',
    url: 'https://salespilot.theripplenexus.com',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* Explicit cross-browser favicon links */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
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

