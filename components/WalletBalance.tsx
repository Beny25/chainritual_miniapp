"use client";

import { useEffect, useState } from "react";

export default function WalletBalance({ publicKey }: { publicKey: string }) {
  const [balance, setBalance] = useState<number>(0);

  useEffect(() => {
    const key = "balance_" + publicKey;
    const saved = localStorage.getItem(key);
    if (saved) setBalance(Number(saved));
  }, [publicKey]);

  // dipanggil dari faucet
  useEffect(() => {
    window.addEventListener("balance:update", (e: any) => {
      if (e.detail?.publicKey === publicKey) {
        setBalance(e.detail.balance);
      }
    });
  }, []);

  return (
    <div className="p-4 border rounded-xl bg-white">
      <b>Balance:</b> {balance}
    </div>
  );
}
