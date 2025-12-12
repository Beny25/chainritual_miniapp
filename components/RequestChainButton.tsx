"use client";

import { useState } from "react";
import { saveWalletToLocal } from "@/lib/wallet";

export default function RequestChainButton({
  wallet,
  setWallet,
}: {
  wallet: any;
  setWallet: (w: any) => void;
}) {
  const [loading, setLoading] = useState(false);

  const requestChain = async () => {
    if (!wallet) return alert("Buat wallet dulu bro");

    setLoading(true);

    try {
      const res = await fetch("/api/request-chain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicKey: wallet.publicKey }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");

      wallet.chainId = data.chainId;
      saveWalletToLocal(wallet);
      setWallet({ ...wallet });

      alert("Chain berhasil dibuat!");
    } catch (err: any) {
      alert("Faucet gagal: " + err.message);
    }

    setLoading(false);
  };

  return (
    <button
      onClick={requestChain}
      disabled={loading}
      className="px-4 py-2 bg-purple-600 text-white rounded-lg w-full"
    >
      {loading ? "Requesting..." : "Request Testnet Chain"}
    </button>
  );
}
