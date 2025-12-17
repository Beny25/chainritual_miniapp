"use client";

import { useState } from "react";

type Props = {
  publicKey: string;
};

export default function FaucetRequest({ publicKey }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const requestFaucet = async () => {
    if (!publicKey) {
      setError("Public key not found");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("/api/faucet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicKey }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Faucet failed");
      }

      // 🔑 Simpan chainId hasil claim
      localStorage.setItem("linera:chainId", data.chainId);

      // 🔄 Trigger update balance
      window.dispatchEvent(new Event("balance:update"));

      setSuccess(
        `Faucet success 🎉\nChain: ${data.chainId.slice(0, 10)}...\nBalance: ${data.balance}`
      );
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-xl bg-white space-y-3">
      <div className="text-sm text-gray-600 break-all">
        <b>Owner:</b> {publicKey}
      </div>

      <button
        onClick={requestFaucet}
        disabled={loading}
        className="px-4 py-2 rounded-lg bg-black text-white disabled:opacity-50"
      >
        {loading ? "Requesting..." : "Request Faucet"}
      </button>

      {success && (
        <pre className="text-xs bg-green-50 text-green-700 p-2 rounded">
          {success}
        </pre>
      )}

      {error && (
        <pre className="text-xs bg-red-50 text-red-700 p-2 rounded">
          {error}
        </pre>
      )}
    </div>
  );
  }
