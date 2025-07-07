'use client';
import { AppContextProvider, useAppContext } from '@/context/app-context';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';
import { useEffect } from 'react';
import { cn } from '@/lib/utils';

function AppThemeWrapper({ children }: { children: React.ReactNode }) {
  const { appName, theme } = useAppContext();
  useEffect(() => {
    document.title = appName;
  }, [appName]);

  return (
    <html lang="en" className={cn('h-full', theme)}>
      <head>
        <meta name="description" content="A collaborative task management application." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased h-full bg-background">
          {children}
      </body>
    </html>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AppContextProvider>
      <AppThemeWrapper>
        {children}
        <Toaster />
      </AppThemeWrapper>
    </AppContextProvider>
  );
}
