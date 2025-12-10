"use client";

import { useEffect, useState } from "react";
import { fetchBalance } from "@/lib/linera";
import FaucetRequest from "./FaucetRequest";

export default function WalletCard({ wallet }) {
  const [balance, setBalance] = useState("Loading...");

  const loadBalance = () => {
    fetchBalance(wallet.publicKey).then((b) => setBalance(b));
  };

  useEffect(() => {
    loadBalance();
  }, []);

  return (
    <div className="p-4 rounded-xl bg-white border">
      <p className="font-bold">Public Key:</p>
      <p className="text-xs break-all mb-2">{wallet.publicKey}</p>

      <p className="font-bold">Balance:</p>
      <p className="mb-4">{balance}</p>

      {/* Faucet Request */}
      <FaucetRequest wallet={wallet} onSuccess={loadBalance} />
    </div>
  );
}
