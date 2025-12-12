"use client";

import { useEffect, useState } from "react";

export default function WalletBalance({ wallet }: { wallet: any }) {
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    if (!wallet?.chainId) return;

    const load = async () => {
      const res = await fetch("/api/query-balance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chainId: wallet.chainId }),
      });

      const data = await res.json();
      if (res.ok) setBalance(data.balance);
    };

    load();
  }, [wallet]);

  if (!wallet?.chainId) return null;

  return (
    <div className="bg-white p-3 rounded-xl shadow text-center">
      <p><b>Balance:</b> {balance ?? "Loading..."} tokens</p>
    </div>
  );
}
