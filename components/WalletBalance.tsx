"use client";

import { useEffect, useState } from "react";
import { getBalance } from "@/lib/linera";

export default function WalletBalance({ publicKey }: { publicKey: string }) {
  const [balance, setBalance] = useState<any>(null);

  const fetchBalance = async () => {
    const data = await getBalance(publicKey);
    setBalance(data);
  };

  useEffect(() => {
    fetchBalance();
    const interval = setInterval(fetchBalance, 10000); // refresh tiap 10 detik
    return () => clearInterval(interval);
  }, [publicKey]);

  return (
    <div className="p-4 border rounded-xl bg-white mt-4">
      <b>Balance:</b> {balance ? JSON.stringify(balance) : "Loading..."}
    </div>
  );
}
