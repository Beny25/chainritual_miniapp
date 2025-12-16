"use client";

import { useState } from "react";

type Props = {
  publicKey: string; // wallet.publicKey
  onRefresh?: () => void;
};

export default function FaucetRequest({ publicKey, onRefresh }: Props) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleRequest = async () => {
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/faucet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicKey }),
      });

      const data = await res.json();

      if (data.success) {
        // Update localStorage dan trigger event
        const key = "balance_" + publicKey;
        localStorage.setItem(key, data.data.balance);
        window.dispatchEvent(new Event("balance:update"));

        setResult({ success: true, balance: data.data.balance });
        if (onRefresh) onRefresh();
        alert("Faucet berhasil! Silakan cek saldo beberapa detik lagi.");
      } else {
        setResult({ success: false, error: data.error });
        alert("Faucet gagal: " + data.error);
      }
    } catch (err: any) {
      console.error("Faucet request error:", err);
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

      {result && <pre className="text-sm">{JSON.stringify(result, null, 2)}</pre>}
    </div>
  );
}
