'use client';
import './globals.css';
import { ReactNode, useMemo } from 'react';
import { clusterApiUrl } from '@solana/web3.js';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
// Updated: remove BackpackWalletAdapter and GlowWalletAdapter
import { PhantomWalletAdapter, SolflareWalletAdapter, TorusWalletAdapter } from '@solana/wallet-adapter-wallets';
import '@solana/wallet-adapter-react-ui/styles.css';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useEffect, useState } from 'react';
import { SpeedInsights } from "@vercel/speed-insights/next";

export default function RootLayout({ children }: { children: ReactNode }) {
    const network = (process.env.NEXT_PUBLIC_SOLANA_NETWORK as any) || 'devnet';
    const endpoint = process.env.NEXT_PUBLIC_RPC_ENDPOINT || clusterApiUrl(network as any);

    const wallets = useMemo(
      () => [
        new PhantomWalletAdapter(),
        new SolflareWalletAdapter({ network }),
        new TorusWalletAdapter(),
      ],
      [network]
    );

    const [theme, setTheme] = useState<'light' | 'dark'>(() => (typeof window !== 'undefined' ? (localStorage.getItem('theme') as 'light' | 'dark') || 'dark' : 'dark'));

    useEffect(() => {
      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
      }
    }, [theme]);

    return (
      <html lang="en" data-theme={theme}>
        <body>
          <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
              <WalletModalProvider>
                <div className="min-h-screen flex bg-[var(--background)] text-[var(--foreground)]">
                  <Sidebar />
                  <div className="flex-1">
                    <Navbar theme={theme} onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')} />
                    <main className="p-6">{children}</main>
                  </div>
                </div>
              </WalletModalProvider>
            </WalletProvider>
          </ConnectionProvider>
          <SpeedInsights />
        </body>
      </html>
    );
}
