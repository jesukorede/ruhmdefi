// WalletConnect component
"use client";

import dynamic from "next/dynamic";

const WalletMultiButtonDynamic = dynamic(
  async () => (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

export default function WalletConnect() {
  return (
    <WalletMultiButtonDynamic
      aria-label="Select Wallet"
      className="!bg-[#119611] !text-white !border-none hover:!brightness-110 !rounded !px-4 !py-2"
    />
  );
}