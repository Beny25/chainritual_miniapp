"use client";

import { useState, useEffect } from "react";
import WalletManager from "@/components/WalletManager";
import WalletBalance from "@/components/WalletBalance";
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

      <WalletManager setWallet={setWallet} wallet={wallet} />

      {wallet && (
        <div className="space-y-4 bg-white p-4 rounded-xl shadow">

          {/* Public Key Display */}
          <div className="text-sm">
            <span className="font-semibold">Public Key:</span>
            <div className="font-mono break-all mt-1 p-2 bg-gray-100 rounded">
              {wallet.publicKey}
            </div>
          </div>

          {/* Wallet Balance */}
          <WalletBalance key={reloadFlag} publicKey={wallet.publicKey} />

          {/* Faucet Request (bisa di-disable/comming soon) */}
          <FaucetRequest publicKey={wallet.publicKey} reloadBalance={reloadBalance} />

          {/* Send Token */}
          <SendTokenForm wallet={wallet} reloadBalance={reloadBalance} />

        </div>
      )}
    </div>
  );
}
