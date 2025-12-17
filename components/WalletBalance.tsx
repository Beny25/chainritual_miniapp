// components/WalletBalance.tsx
"use client";

import { useState, useEffect } from "react";

type Props = {
  chainId: string | null;
};

export default function WalletBalance({ chainId }: Props) {
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadBalance = async () => {
    if (!chainId) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/balance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chainId }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch balance");
      }

      setBalance(Number(data.balance || 0));
    } catch (err: any) {
      console.error(err);
      setError(err.message);
      setBalance(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBalance();
  }, [chainId]);

  // listen event dari faucet / transfer
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
