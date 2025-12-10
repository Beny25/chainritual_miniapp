"use client";

import { useState, useEffect } from "react";
import WalletCreateForm from "@/components/WalletCreateForm";
import WalletLoadForm from "@/components/WalletLoadForm";
import WalletBalance from "@/components/WalletBalance";
import FaucetRequest from "@/components/FaucetRequest";
import SendTokenForm from "@/components/SendTokenForm";
import { fetchBalance, requestFaucet, sendTokens } from "@/lib/balance";
import { getWalletFromLocal } from "@/lib/wallet";

export default function Page() {
  const [wallet, setWallet] = useState<any>(null);

  useEffect(() => {
    const w = getWalletFromLocal();
    if (w) setWallet(w);
  }, []);

  return (
    <div className="max-w-md mx-auto mt-10 p-4 space-y-6">

      <h1 className="text-3xl font-bold text-center">Linera Wallet Mini-App</h1>

      {!wallet && (
        <div className="space-y-4 bg-white p-4 rounded-xl shadow">
          <WalletCreateForm setWallet={setWallet} />
          <WalletLoadForm setWallet={setWallet} />
        </div>
      )}

      {wallet && (
        <div className="space-y-4 bg-white p-4 rounded-xl shadow">

          <div className="text-sm">
            <span className="font-semibold">Public Key:</span>
            <div className="font-mono break-all mt-1 p-2 bg-gray-100 rounded">
              {wallet.publicKey}
            </div>
          </div>

          <WalletBalance publicKey={wallet.publicKey} />
<FaucetRequest publicKey={wallet.publicKey} />
<SendTokenForm wallet={wallet} />
        </div>
      )}
    </div>
  );
}
