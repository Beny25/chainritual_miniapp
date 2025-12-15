"use client";

import { useState } from "react";

type Props = {
  publicKey: string;
  onRefresh?: () => void;
};

export default function FaucetRequest({ publicKey, onRefresh }: Props) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleRequest = async () => {
    setLoading(true);
    setResult(null);

    try {
      // ✅ pastikan publicKey pakai prefix 0x
      const owner = publicKey.startsWith("0x") ? publicKey : `0x${publicKey}`;

      // 1️⃣ Request chain dulu
      const chainRes = await fetch("/api/request-chain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicKey: owner }),
      });
      const chainData = await chainRes.json();
      console.log("Chain response:", chainData);

      if (!chainData.success) {
        throw new Error(chainData.error || "Gagal membuat chain");
      }

      // 2️⃣ Setelah chain siap, request faucet
      const faucetRes = await fetch("/api/faucet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicKey: owner }),
      });
      const faucetData = await faucetRes.json();
      console.log("Faucet response:", faucetData);

      if (faucetData.success) {
        setResult({ success: true, data: faucetData.data });
        alert("Faucet berhasil! Silakan cek saldo beberapa detik lagi.");
        if (onRefresh) onRefresh(); // refresh balance
      } else {
        setResult({ success: false, error: faucetData.error });
        alert("Faucet gagal: " + faucetData.error);
      }
    } catch (err: any) {
      console.error(err);
      setResult({ success: false, error: err.message });
      alert("Faucet gagal: " + err.message);
    }

    setLoading(false);
  };

  return (
    <div className="space-y-2">
      <button
        onClick={handleRequest}
        disabled={loading}
        className="bg-purple-600 text-white px-4 py-2 rounded-lg w-full"
      >
        {loading ? "Requesting..." : "Request Testnet Tokens"}
      </button>

      {result && (
        <pre className="text-sm">{JSON.stringify(result, null, 2)}</pre>
      )}
    </div>
  );
}
