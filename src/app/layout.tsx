'use client';
import { AppContextProvider, useAppContext } from '@/context/app-context';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';
import { useEffect } from 'react';
import { cn } from '@/lib/utils';

function AppTitleUpdater({ children }: { children: React.ReactNode }) {
  const { appName } = useAppContext();
  useEffect(() => {
    document.title = appName;
  }, [appName]);

  return <>{children}</>;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className='h-full'>
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
          <AppContextProvider>
            <AppTitleUpdater>
              {children}
              <Toaster />
            </AppTitleUpdater>
          </AppContextProvider>
      </body>
    </html>
  );
}
