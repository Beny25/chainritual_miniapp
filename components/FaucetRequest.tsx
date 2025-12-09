"use client";

import { useState } from "react";

export default function FaucetRequest({ publicKey }: { publicKey: string }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleRequest = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/faucet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicKey }),
      });

      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setResult({ error: err.message });
    } finally {
      setLoading(false);
    }
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

      {result && (
        <div className="mt-3">
          <pre className="text-sm">{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
