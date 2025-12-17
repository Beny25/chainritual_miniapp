// components/WalletBalance.tsx
"use client";

import { useEffect, useState } from "react";

export type WalletBalanceProps = {
  publicKey: string;
};

export default function WalletBalance({ publicKey }: WalletBalanceProps) {
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadBalance = async () => {
    if (!publicKey) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/balance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicKey }),
      });

      const data = await res.json();

      if (res.ok) {
        setBalance(Number(data.balance || 0));
      } else {
        setError(data.error || "Failed to fetch balance");
      }
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBalance();
  }, [publicKey]);

  useEffect(() => {
    const handler = () => loadBalance();
    window.addEventListener("balance:update", handler);
    return () => window.removeEventListener("balance:update", handler);
  }, []);

  return (
    <div className="p-4 border rounded-xl bg-white">
      <b>Balance:</b>{" "}
      {loading ? "Loading..." : error ? `Error: ${error}` : balance}
    </div>
  );
}
