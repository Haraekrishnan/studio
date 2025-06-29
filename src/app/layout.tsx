'use client';
import { AppContextProvider, useAppContext } from '@/context/app-context';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';
import { useEffect } from 'react';

function AppTitleUpdater() {
  const { appName } = useAppContext();
  useEffect(() => {
    document.title = appName;
  }, [appName]);
  return null;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        {/* Title is set dynamically by AppTitleUpdater */}
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
          <AppTitleUpdater />
          {children}
          <Toaster />
        </AppContextProvider>
      </body>
    </html>
  );
}
