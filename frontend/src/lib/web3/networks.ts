// Base Network Configuration
export const BASE_MAINNET = {
  id: 8453,
  name: 'Base Mainnet',
  network: 'base-mainnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Ethereum',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://mainnet.base.org'],
    },
    public: {
      http: ['https://mainnet.base.org'],
    },
  },
  blockExplorers: {
    default: { name: 'Basescan', url: 'https://basescan.org' },
  },
} as const;

export const BASE_TESTNET = {
  id: 84531,
  name: 'Base Goerli',
  network: 'base-goerli',
  nativeCurrency: {
    decimals: 18,
    name: 'Ethereum',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://goerli.base.org'],
    },
    public: {
      http: ['https://goerli.base.org'],
    },
  },
  blockExplorers: {
    default: { name: 'Basescan Testnet', url: 'https://goerli.basescan.org' },
  },
  testnet: true,
} as const;

export const SUPPORTED_CHAINS = [
  BASE_MAINNET,
  BASE_TESTNET,
];

export const DEFAULT_CHAIN = process.env.NODE_ENV === 'production' ? BASE_MAINNET : BASE_TESTNET;
