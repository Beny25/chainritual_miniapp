// components/FaucetRequest.tsx
"use client";

import { useState } from "react";

type Props = {
  publicKey: string;
  setChainId: (id: string) => void;
};

export default function FaucetRequest({ publicKey, setChainId }: Props) {
  const [loading, setLoading] = useState(false);

  const handleRequest = async () => {
    setLoading(true);
    try {
      // 1️⃣ Claim via faucet API
      const res = await fetch("/api/faucet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicKey }),
      });
      
      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      // 2️⃣ Ambil chainId dari VPS endpoint
      const chainRes = await fetch(`/api/chainId?owner=${publicKey}`);
      const { chainId } = await chainRes.json();
      if (!chainId) throw new Error("ChainId not found");

      // 3️⃣ Simpan dan trigger balance update
      localStorage.setItem("chainId", chainId);
      setChainId(chainId);
      window.dispatchEvent(new Event("balance:update"));

      alert("Faucet success");
    } catch (err: any) {
      console.error(err);
      alert("Faucet gagal: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <button
        onClick={handleRequest}
        disabled={loading}
        className="bg-purple-600 text-white px-4 py-2 rounded-lg w-full"
      >
        {loading ? "Processing..." : "Request Testnet Tokens"}
      </button>
    </div>
  );
    }
