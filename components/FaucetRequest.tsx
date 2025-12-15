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
      // Pastikan publicKey selalu ada prefix "0x"
      const owner = publicKey.startsWith("0x") ? publicKey : "0x" + publicKey;

      // Request langsung ke VPS GraphQL faucet
      const query = {
        query: `mutation { claim(owner: "${owner}") }`
      };

      const res = await fetch("http://192.210.217.157:8080", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(query),
      });

      const data = await res.json();
      console.log("Faucet response:", data);

      if (data.data && data.data.claim) {
        setResult({ success: true, data: data.data.claim });
        if (onRefresh) onRefresh(); // refresh balance
        alert("Faucet berhasil! Silakan cek saldo beberapa detik lagi.");
      } else if (data.errors) {
        setResult({ success: false, error: data.errors[0].message });
        alert("Faucet gagal: " + data.errors[0].message);
      } else {
        setResult({ success: false, error: "Unknown error" });
        alert("Faucet gagal: Unknown error");
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
