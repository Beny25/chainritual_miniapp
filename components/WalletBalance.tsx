"use client";

import { useEffect, useState } from "react";

export default function WalletBalance({ publicKey }: { publicKey: string }) {
  const [balance, setBalance] = useState<string>("Loading...");

  useEffect(() => {
    // Dummy balance (biar tampilan rapi)
    setTimeout(() => {
      setBalance("50 TEST"); // fake balance
    }, 600);
  }, [publicKey]);

  return (
    <div className="p-4 border rounded-xl bg-white">
      <div className="font-semibold">Balance:</div>
      <div className="text-lg">{balance}</div>
    </div>
  );
      }
