"use client";

import { useState, useEffect } from "react";

export default function WalletBalance({ publicKey }: { publicKey: string }) {
  const [balance, setBalance] = useState<number>(0);

  const reload = () => {
    const key = "balance_" + publicKey;
    const saved = Number(localStorage.getItem(key) || 0);
    setBalance(saved);
  };

  useEffect(() => {
    reload();
  }, [publicKey]);

  useEffect(() => {
    const handler = (e: any) => {
      if (e.detail?.publicKey === publicKey) setBalance(e.detail.balance);
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
