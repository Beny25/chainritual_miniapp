"use client";

import { useState, useEffect } from "react";
import WalletManager from "@/components/WalletManager";
import FaucetRequest from "@/components/FaucetRequest";
import WalletBalance from "@/components/WalletBalance";
import SendTokenForm from "@/components/SendTokenForm";
import HeaderBanner from "@/components/HeaderBanner";

export default function Page() {
  const [wallet, setWallet] = useState<any>(null);
  const [reloadFlag, setReloadFlag] = useState(0);

  // untuk reload balance
  const reloadBalance = () => setReloadFlag((prev) => prev + 1);

  // load first wallet on mount jika belum ada
  useEffect(() => {
    // WalletManager handle load wallet di localStorage, kita set state di sini
  }, []);

  return (
    <div className="max-w-md mx-auto mt-2 p-4 space-y-6">
      <HeaderBanner />

      {/* Wallet create/load */}
      <WalletManager setWallet={setWallet} wallet={wallet} />

      {wallet && (
        <div className="space-y-4 bg-white p-4 rounded-xl shadow">

          {/* Public Key */}
          <p className="font-mono break-all">
            <b>Public Key:</b> {wallet.publicKey}
          </p>

          {/* Wallet Balance */}
          <WalletBalance publicKey={wallet.publicKey} refreshSignal={reloadFlag} />

          {/* Faucet Request */}
          <FaucetRequest publicKey={wallet.publicKey} onRefresh={reloadBalance} />

          {/* Send - coming soon */} 
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg w-full" onClick={() => alert("Coming Soon - Akan aktif saat URL faucet rilis publik.")}
            > 
            Send Tokens 
          </button> 
        </div> 
      )}
    </div>
  );
}
