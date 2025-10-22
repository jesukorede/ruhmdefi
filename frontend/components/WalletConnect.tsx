'use client';

import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export default function WalletConnect() {
  return (
    <WalletMultiButton
      aria-label="Select Wallet"
      className="!bg-[#119611] !text-white !border-none hover:!brightness-110 !rounded !px-4 !py-2"
    />
  );
}