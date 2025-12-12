"use client";

import { useState } from "react";

export default function FaucetRequest({ publicKey, onRefresh }: { publicKey: string; onRefresh: () => void }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleRequest = async () => {
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/faucet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicKey }),
      });
      const data = await res.json();

      if (data.success) {
        setMessage("Faucet berhasil! Silakan tunggu beberapa detik untuk balance update.");
        onRefresh(); // trigger balance refresh
      } else {
        setMessage("Faucet gagal: " + (data.error ?? "Unknown error"));
      }
    } catch (err: any) {
      setMessage("Faucet error: " + err.message);
    }

    setLoading(false);
  };

  return (
    <div className="p-4 border rounded-xl bg-white mt-4">
      <button
        onClick={handleRequest}
        disabled={loading}
        className="px-4 py-2 bg-purple-600 text-white rounded-lg"
      >
        {loading ? "Requesting..." : "Request Testnet Tokens"}
      </button>
      {message && <p className="mt-2 text-sm">{message}</p>}
    </div>
  );
}
