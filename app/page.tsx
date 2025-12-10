"use client";

import { useState, useEffect } from "react";
import WalletCreateForm from "@/components/WalletCreateForm";
import WalletLoadForm from "@/components/WalletLoadForm";
import FaucetRequest from "@/components/FaucetRequest";
import WalletBalance from "@/components/WalletBalance";
import SendTokenForm from "@/components/SendTokenForm";
import { getWalletFromLocal } from "@/lib/wallet";

export default function Page() {
  const [wallet, setWallet] = useState<any>(null);

  useEffect(() => {
    const w = getWalletFromLocal();
    if (w) setWallet(w);
  }, []);

  return (
    <div className="max-w-xl mx-auto mt-12 space-y-6">
      <h1 className="text-2xl font-bold">Linera Wallet Mini-App</h1>

      {!wallet && (
        <>
          <WalletCreateForm setWallet={setWallet} />
          <WalletLoadForm setWallet={setWallet} />
        </>
      )}

      {wallet && (
        <div className="space-y-4">
          <p className="font-mono break-all">
            <b>Public Key:</b> {wallet.publicKey}
          </p>

          <WalletBalance publicKey={wallet.publicKey} />
          <FaucetRequest />
          <SendTokenForm wallet={wallet} />
        </div>
      )}
    </div>
  );
}

