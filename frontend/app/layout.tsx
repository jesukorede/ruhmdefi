'use client';
import './globals.css';
import { useEffect, useState } from 'react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Web3Provider } from '../src/lib/web3/Web3Provider';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>(
    () => (typeof window !== 'undefined' 
      ? (localStorage.getItem('theme') as 'light' | 'dark') || 'dark' 
      : 'dark'
    )
  );

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
    }
  }, [theme]);

  return (
    <html lang="en" data-theme={theme}>
      <body>
        <Web3Provider>
          <div className="min-h-screen flex bg-[var(--background)] text-[var(--foreground)]">
            <Sidebar />
            <div className="flex-1">
              <Navbar 
                theme={theme} 
                onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')} 
              />
              <main className="px-4 md:px-6 py-6 max-w-6xl mx-auto">
                {children}
              </main>
            </div>
          </div>
        </Web3Provider>
        <SpeedInsights />
          <SpeedInsights />
        </body>
      </html>
    );
}
