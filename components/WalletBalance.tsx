"use client";

import { useEffect, useState } from "react";
import { getBalance } from "@/lib/linera";

interface WalletBalanceProps {
  publicKey: string;
  refreshSignal?: number; // tambahkan ini
}

export default function WalletBalance({ publicKey, refreshSignal }: WalletBalanceProps) {
  const [balance, setBalance] = useState<number | null>(null);

  const fetchBalance = async () => {
    const data = await getBalance(publicKey);
    setBalance(data?.amount ?? 0);
  };

  useEffect(() => {
    fetchBalance();
    const interval = setInterval(fetchBalance, 10000);
    return () => clearInterval(interval);
  }, [publicKey, refreshSignal]); // pakai refreshSignal untuk trigger manual

  return (
    <div className="p-4 border rounded-xl bg-white mt-4">
      <b>Balance:</b> {balance ?? "Loading..."} tokens
    </div>
  );
}
