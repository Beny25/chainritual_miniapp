"use client";

import { useState } from "react";
import WalletBalance from "./WalletBalance";

export default function FaucetRequest({ publicKey }: { publicKey: string }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [refreshSignal, setRefreshSignal] = useState(0);

  const handleRequest = async () => {
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/faucet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicKey }),
      });

      const data = await res.json();

      if (data.success) {
        setMessage("Tokens requested successfully!");
        setRefreshSignal(prev => prev + 1); // trigger WalletBalance refresh
      } else {
        setMessage("Faucet request failed: " + (data.error || "Unknown error"));
      }
    } catch (err: any) {
      setMessage("Error: " + err.message);
    }

    setLoading(false);
  };

  return (
    <div className="p-4 border rounded-xl bg-white mt-4 shadow-sm max-w-md">
      <WalletBalance publicKey={publicKey} refreshSignal={refreshSignal} />

      <button
        onClick={handleRequest}
        disabled={loading}
        className="mt-2 px-4 py-2 bg-purple-600 text-white rounded-lg"
      >
        {loading ? "Requesting..." : "Request Testnet Tokens"}
      </button>

      {message && (
        <p className={`mt-2 text-sm ${message.includes("success") ? "text-green-600" : "text-red-600"}`}>
          {message}
        </p>
      )}
    </div>
  );
}
