"use client";

import { useState, useEffect } from "react";
import WalletManager from "@/components/WalletManager";
import WalletBalance from "@/components/WalletBalance";
import HeaderBanner from "@/components/HeaderBanner";
import { getWalletFromLocal } from "@/lib/wallet";

export default function Page() {
  const [wallet, setWallet] = useState<any>(null);
  const [reloadFlag, setReloadFlag] = useState(0);

  const reloadBalance = () => setReloadFlag(prev => prev + 1);

  useEffect(() => {
    const w = getWalletFromLocal();
    if (w) setWallet(w);
  }, []);

  return (
    <div className="max-w-md mx-auto mt-4 p-4 space-y-6">
      <HeaderBanner />

      {/* Wallet Manager: Create / Load / Select / Delete */}
      <div className="bg-white p-4 rounded-xl shadow">
        <WalletManager wallet={wallet} setWallet={setWallet} />
      </div>

      {/* Show wallet info when available */}
      {wallet && (
        <div className="bg-white p-4 rounded-xl shadow space-y-4">
          <div className="text-sm">
            <span className="font-semibold">Public Key:</span>
            <div className="font-mono break-all mt-1 p-2 bg-gray-100 rounded">
              {wallet.publicKey}
            </div>
          </div>

          {/* Show balance */}
          <WalletBalance key={reloadFlag} publicKey={wallet.publicKey} />

          {/* Faucet + Send Token disabled */}
          <div className="p-3 bg-yellow-100 text-yellow-800 text-sm rounded">
            Faucet & Send Token features coming soon after public faucet is live.
          </div>
        </div>
      )}
    </div>
  );
}
