"use client";

import { useEffect, useState } from "react";
import { fetchBalance } from "../lib/balance"; // pastiin path benar

export default function WalletBalance({ publicKey }: { publicKey: string }) {
  const [balance, setBalance] = useState<number>(0);

  const reload = () => {
    const b = fetchBalance(publicKey);
    setBalance(b);
  };

  useEffect(() => {
    reload();
  }, [publicKey]);
  
  useEffect(() => {
    const key = "balance_" + publicKey;
    const saved = localStorage.getItem(key);
    if (saved) setBalance(Number(saved));
  }, [publicKey]);

  // dipanggil dari faucet
  useEffect(() => {
    const handler = (e: any) => {
      if (e.detail?.publicKey === publicKey) {
        setBalance(e.detail.balance);
      }
    };
    window.addEventListener("balance:update", handler);
    return () => window.removeEventListener("balance:update", handler);
  }, [publicKey]);

  return (
    <div className="p-4 border rounded-xl bg-white">
      <b>Balance:</b> {balance}
    </div>
  );
}
