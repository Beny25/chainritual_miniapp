"use client";

import { useEffect, useState } from "react";

export default function WalletBalance({ publicKey, refreshSignal }: { publicKey: string; refreshSignal?: number }) {
  const [balance, setBalance] = useState("Loading...");

  const fetchBalance = async () => {
    try {
      const res = await fetch("/api/balance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicKey }),
      });
      const data = await res.json();
      setBalance(data?.balance ?? 0);
    } catch {
      setBalance("Error fetching balance");
    }
  };

  useEffect(() => {
    fetchBalance();
    const interval = setInterval(fetchBalance, 5000); // auto-refresh tiap 5 detik
    return () => clearInterval(interval);
  }, [publicKey, refreshSignal]);

  return (
    <div className="p-4 border rounded-xl bg-white mt-4">
      <b>Balance:</b> {balance} tokens
    </div>
  );
}
