'use client';
import './globals.css';
import { ReactNode } from 'react';
import { clusterApiUrl } from '@solana/web3.js';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import '@solana/wallet-adapter-react-ui/styles.css';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

export default function RootLayout({ children }: { children: ReactNode }) {
  const endpoint = process.env.NEXT_PUBLIC_RPC_ENDPOINT || clusterApiUrl('devnet');
  const wallets = [new PhantomWalletAdapter()];

  return (
    <html lang="en">
      <body>
        <ConnectionProvider endpoint={endpoint}>
          <WalletProvider wallets={wallets} autoConnect>
            <WalletModalProvider>
              <div className="min-h-screen flex bg-gray-50">
                <Sidebar />
                <div className="flex-1">
                  <Navbar />
                  <main className="p-6">{children}</main>
                </div>
              </div>
            </WalletModalProvider>
          </WalletProvider>
        </ConnectionProvider>
      </body>
    </html>
  );
}
