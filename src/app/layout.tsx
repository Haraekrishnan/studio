'use client';
import type { Metadata } from 'next';
import { AppContextProvider } from '@/context/app-context';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';

// This would typically be in a metadata export, but for client components we can do it this way.
if (typeof window !== 'undefined') {
  document.title = 'TaskMaster Pro - Aries Marine';
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <title>TaskMaster Pro - Aries Marine</title>
        <meta name="description" content="A collaborative task management application." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased h-full bg-background">
        <AppContextProvider>
          {children}
          <Toaster />
        </AppContextProvider>
      </body>
    </html>
  );
}
