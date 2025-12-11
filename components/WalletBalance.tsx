"use client";

import { useState, useEffect } from "react";

export default function WalletBalance({ publicKey }: { publicKey: string }) {
  const [balance, setBalance] = useState(0);

  const loadBalance = () => {
    const key = "balance_" + publicKey;
    const val = Number(localStorage.getItem(key) || 0);
    setBalance(val);
  };

  useEffect(() => {
    loadBalance();
  }, [publicKey]);

  // listen update from SendTokenForm & Faucet
  useEffect(() => {
    const handler = () => loadBalance();
    window.addEventListener("balance:update", handler);
    return () => window.removeEventListener("balance:update", handler);
  }, []);

  return (
    <div className="p-4 border rounded-xl bg-white">
      <b>Balance:</b> {balance}
    </div>
  );
}
