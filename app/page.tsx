"use client";

import { useState, useEffect } from "react";
import WalletManager from "@/components/WalletManager";
import FaucetRequest from "@/components/FaucetRequest";
import SendTokenForm from "@/components/SendTokenForm";
import HeaderBanner from "@/components/HeaderBanner";

export default function Page() {
  const [wallet, setWallet] = useState<any>(null);
  const [reloadFlag, setReloadFlag] = useState(0);

  // untuk reload balance dll
  const reloadBalance = () => setReloadFlag((prev) => prev + 1);

  // load first wallet on mount
  useEffect(() => {
    // wallet sudah di-handle di WalletManager, kita update state wallet di sini
  }, []);

  return (
    <div className="max-w-md mx-auto mt-2 p-4 space-y-6">
      <HeaderBanner />

      <WalletManager wallet={wallet} setWallet={setWallet} />

      {wallet && (
  <div className="space-y-4 bg-white p-4 rounded-xl shadow">
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
