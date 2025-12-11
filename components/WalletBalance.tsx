"use client";

import { useEffect, useState } from "react";

interface WalletBalanceProps {
  publicKey: string;
  refreshSignal?: number;
}

export default function WalletBalance({ publicKey, refreshSignal }: WalletBalanceProps) {
  const [balance, setBalance] = useState<number | null>(null);

  const fetchBalance = async () => {
    try {
      const res = await fetch("/api/balance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicKey }),
      });
      const data = await res.json();

      if (data.success) {
        setBalance(data.balance);
      } else {
        setBalance(0); // fallback kalau error
      }
    } catch {
      setBalance(0); // fallback kalau fetch gagal
    }
  };

  useEffect(() => {
    fetchBalance();
    const interval = setInterval(fetchBalance, 10000);
    return () => clearInterval(interval);
  }, [publicKey, refreshSignal]);

  return (
    <div className="p-4 border rounded-xl bg-white mt-4">
      <b>Balance:</b> {balance !== null ? balance : "Loading..."} tokens
    </div>
  );
}
