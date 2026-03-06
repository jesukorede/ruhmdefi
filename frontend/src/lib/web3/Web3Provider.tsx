'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { ConnectionProvider, WalletProvider as SolanaWalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider as SolanaModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';
import { DEFAULT_CHAIN, SUPPORTED_CHAINS } from './networks';

// Configure chains for Wagmi
const { chains, publicClient, webSocketPublicClient } = configureChains(
  SUPPORTED_CHAINS,
  [publicProvider()],
);

// Create Wagmi config
const config = createConfig({
  autoConnect: true,
  connectors: [
    new InjectedConnector({
      chains,
      options: {
        name: 'Injected',
        shimDisconnect: true,
      },
    }),
    new WalletConnectConnector({
      chains,
      options: {
        projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '',
        showQrModal: true,
      },
    }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: 'RuhmDeFi',
      },
    }),
  ],
  publicClient,
  webSocketPublicClient,
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
    <WagmiConfig config={config}>
      <ConnectionProvider endpoint={solanaEndpoint}>
        <SolanaWalletProvider wallets={solanaWallets} autoConnect={false}>
          <SolanaModalProvider>
            <Web3Context.Provider value={contextValue}>
              {children}
            </Web3Context.Provider>
          </SolanaModalProvider>
        </SolanaWalletProvider>
      </ConnectionProvider>
    </WagmiConfig>
  );
}

export function useWeb3() {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
}
