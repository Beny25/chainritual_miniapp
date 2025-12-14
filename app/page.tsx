"use client";

import { useState, useEffect } from "react";
import WalletCreateForm from "@/components/WalletCreateForm";
import WalletLoadForm from "@/components/WalletLoadForm";
import FaucetRequest from "@/components/FaucetRequest";
import SendTokenForm from "@/components/SendTokenForm";
import { getWalletFromLocal } from "@/lib/wallet";
import HeaderBanner from "@/components/HeaderBanner";

export default function Page() {
  const [wallet, setWallet] = useState<any>(null);
  const [reloadFlag, setReloadFlag] = useState(0);

  const reloadBalance = () => setReloadFlag(prev => prev + 1);

  useEffect(() => {
    const w = getWalletFromLocal();
    if (w) setWallet(w);
  }, []);

  return (
    <div className="max-w-md mx-auto mt-2 p-4 space-y-6">
      <HeaderBanner />

      {!wallet && (
        <div className="space-y-4 bg-white p-4 rounded-xl shadow">
          <WalletCreateForm setWallet={setWallet} />
          <WalletLoadForm setWallet={setWallet} />
        </div>
      )}

  {wallet && (
  <div className="space-y-4 bg-white p-4 rounded-xl shadow">
    {/* Public Key Display */}
    <div className="text-sm">
      <span className="font-semibold">Current Wallet Public Key:</span>
      <div className="font-mono break-all mt-1 p-2 bg-gray-100 rounded">
        {wallet.publicKey}
      </div>
    </div>

    {/* Faucet - coming soon */}
    <button
      className="bg-purple-600 text-white px-4 py-2 rounded-lg w-full"
      onClick={() => alert("Coming Soon - Akan aktif saat URL faucet rilis publik.")}
    >
      Request Testnet Tokens
    </button>

    {/* Send - coming soon */}
    <button
      className="bg-blue-600 text-white px-4 py-2 rounded-lg w-full"
      onClick={() => alert("Coming Soon - Akan aktif saat URL faucet rilis publik.")}
    >
      Send Tokens
    </button>
  </div>
)}
    </div>
  );
}
