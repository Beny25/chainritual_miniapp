"use client";

import { useState } from "react";

type Props = {
  publicKey: string;
  onRefresh?: () => void;
};

export default function FaucetRequest({ publicKey, onRefresh }: Props) {
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState<string | null>(null);

  const handleRequest = async () => {
    setLoading(true);

    try {
      const res = await fetch("/api/faucet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicKey }),
      });

      const data = await res.json();

      if (data.success) {
        const newBalance = data.data?.claim?.config?.balance ?? "0";

        if (newBalance === "0") {
          // Wallet pernah claim faucet sebelumnya
          alert("Faucet sudah pernah diklaim sebelumnya. Saldo tetap.");
        } else {
          // Update balance
          localStorage.setItem("balance_" + publicKey, newBalance);
          window.dispatchEvent(new Event("balance:update"));
          setBalance(newBalance);
          if (onRefresh) onRefresh();
          alert(`Faucet berhasil! Saldo sekarang: ${newBalance}`);
        }
      } else {
        alert("Faucet gagal: " + data.error);
      }
    } catch (err: any) {
      console.error(err);
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

      {balance !== null && (
        <p className="text-sm mt-2">Balance: {balance}</p>
      )}
    </div>
  );
}
