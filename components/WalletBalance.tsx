"use client";

import { useEffect, useState } from "react";
import { getBalance } from "@/lib/linera";

interface WalletBalanceProps {
  publicKey: string;
  refreshSignal?: number;
}

export default function WalletBalance({ publicKey, refreshSignal }: WalletBalanceProps) {
  const [balance, setBalance] = useState<any>("Loading...");

  const fetchBalance = async () => {
    try {
      const data = await getBalance(publicKey);
      // tampilkan full response dari node
      setBalance(data ?? "No data");
    } catch (err: any) {
      setBalance("Error fetching balance: " + err.message);
    }
  };

  useEffect(() => {
    fetchBalance();
    const interval = setInterval(fetchBalance, 10000);
    return () => clearInterval(interval);
  }, [publicKey, refreshSignal]);

  return (
    <div className="p-4 border rounded-xl bg-white mt-4">
      <b>Balance debug:</b>
      <pre className="text-sm mt-1">{JSON.stringify(balance, null, 2)}</pre>
    </div>
  );
}
