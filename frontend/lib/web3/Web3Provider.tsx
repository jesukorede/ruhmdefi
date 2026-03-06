'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { ConnectionProvider, WalletProvider as SolanaWalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider as SolanaModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { injected, walletConnect, coinbaseWallet } from 'wagmi/connectors';
import { DEFAULT_CHAIN, SUPPORTED_CHAINS, BASE_MAINNET, BASE_TESTNET } from './networks';

// Create Wagmi config
const config = createConfig({
  chains: SUPPORTED_CHAINS,
  connectors: [
    injected(),
    walletConnect({
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '',
    }),
    coinbaseWallet({
      appName: 'RuhmDeFi',
    }),
  ],
  transports: {
    [BASE_MAINNET.id]: http(),
    [BASE_TESTNET.id]: http(),
  },
});

interface Web3ContextType {
  isConnected: boolean;
  address?: `0x${string}`;
  chainId?: number;
  connect: () => Promise<void>;
  disconnect: () => void;
  switchChain: (chainId: number) => Promise<void>;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export function Web3Provider({ children }: { children: React.ReactNode }) {
  // Solana network configuration
  const solanaNetwork = process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'devnet';
  const solanaEndpoint = process.env.NEXT_PUBLIC_SOLANA_RPC_ENDPOINT || clusterApiUrl(solanaNetwork as any);
  
  // Solana wallets
  const solanaWallets = useMemo(
    () => [new PhantomWalletAdapter(), new SolflareWalletAdapter()],
    []
  );

  // Ethereum/BSC state
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<`0x${string}`>();
  const [chainId, setChainId] = useState<number>();

  // Connect wallet
  const connect = async () => {
    try {
      // This will be handled by the wallet connectors
      setIsConnected(true);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      setIsConnected(false);
    }
  };

  // Disconnect wallet
  const disconnect = () => {
    setIsConnected(false);
    setAddress(undefined);
    setChainId(undefined);
  };

  // Switch chain
  const switchChain = async (newChainId: number) => {
    try {
      // This will be handled by the wallet connectors
      setChainId(newChainId);
    } catch (error) {
      console.error('Failed to switch chain:', error);
    }
  };

  // Context value
  const contextValue = useMemo(
    () => ({
      isConnected,
      address,
      chainId,
      connect,
      disconnect,
      switchChain,
    }),
    [isConnected, address, chainId]
  );

  return (
    <WagmiProvider config={config}>
      <ConnectionProvider endpoint={solanaEndpoint}>
        <SolanaWalletProvider wallets={solanaWallets} autoConnect={false}>
          <SolanaModalProvider>
            <Web3Context.Provider value={contextValue}>
              {children}
            </Web3Context.Provider>
          </SolanaModalProvider>
        </SolanaWalletProvider>
      </ConnectionProvider>
    </WagmiProvider>
  );
}

export function useWeb3() {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
}
