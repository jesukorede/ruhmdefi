'use client';

import { useWeb3 } from '@/lib/web3/Web3Provider';
import { useAccount, useConnect, useDisconnect, useNetwork } from 'wagmi';
import { useState, useEffect } from 'react';
import { ChevronDown, LogOut, Wallet } from 'lucide-react';
import { SUPPORTED_CHAINS } from '@/lib/web3/networks';

// Dynamic import for Solana wallet adapter to avoid SSR issues
const WalletMultiButtonDynamic = dynamic(
  async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }
);

export default function WalletConnector() {
  const { isConnected, address, chainId, connect, disconnect, switchChain } = useWeb3();
  const [showChainSelector, setShowChainSelector] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Set mounted state to prevent hydration issues
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Handle chain switching
  const handleChainSelect = async (chainId: number) => {
    try {
      await switchChain(chainId);
      setShowChainSelector(false);
    } catch (error) {
      console.error('Failed to switch chain:', error);
    }
  };

  // Format address for display
  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (!isMounted) {
    return (
      <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
    );
  }

  return (
    <div className="relative">
      {isConnected ? (
        <div className="flex items-center space-x-2">
          {/* Chain Selector */}
          <div className="relative">
            <button
              onClick={() => setShowChainSelector(!showChainSelector)}
              className="flex items-center space-x-1 px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <span className="text-sm font-medium">
                {SUPPORTED_CHAINS.find(c => c.id === chainId)?.name || 'Unknown'}
              </span>
              <ChevronDown className="w-4 h-4" />
            </button>
            
            {showChainSelector && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-50 border border-gray-200 dark:border-gray-700">
                {SUPPORTED_CHAINS.map((chain) => (
                  <button
                    key={chain.id}
                    onClick={() => handleChainSelect(chain.id)}
                    className={`w-full text-left px-4 py-2 text-sm ${
                      chainId === chain.id
                        ? 'bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-200'
                        : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    {chain.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Wallet Address */}
          <div className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <Wallet className="w-4 h-4 text-gray-600 dark:text-gray-300" />
            <span className="text-sm font-medium">
              {address && formatAddress(address)}
            </span>
          </div>

          {/* Disconnect Button */}
          <button
            onClick={disconnect}
            className="p-2 text-gray-500 hover:text-red-500 transition-colors"
            title="Disconnect"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      ) : (
        <div className="flex space-x-2">
          {/* Solana Wallet Button */}
          <div className="wallet-adapter-button-wrapper">
            <WalletMultiButtonDynamic
              style={{
                backgroundColor: '#14F195',
                color: '#000',
                border: 'none',
                borderRadius: '0.5rem',
                padding: '0.5rem 1rem',
                fontSize: '0.875rem',
                fontWeight: 500,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '2.5rem',
              }}
            >
              Connect Solana
            </WalletMultiButtonDynamic>
          </div>

          {/* EVM (Base) Wallet Button */}
          <button
            onClick={() => connect()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Connect EVM
          </button>
        </div>
      )}
    </div>
  );
}
