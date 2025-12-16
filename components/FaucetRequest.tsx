"use client";

import { useState } from "react";

type Props = {
  wallet: any; // wallet global state
  setWallet: (w: any) => void; // updater wallet
};

export default function FaucetRequest({ wallet, setWallet }: Props) {
  const [loading, setLoading] = useState(false);

  const handleRequest = async () => {
    if (!wallet?.publicKey) return alert("Buat wallet dulu bro");

    setLoading(true);

    try {
      const res = await fetch("/api/faucet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicKey: wallet.publicKey }),
      });

      const data = await res.json();

      if (data.success) {
        const newBalance = data.data?.claim?.config?.balance ?? "0";

        if (newBalance === "0") {
          alert("Faucet sudah pernah diklaim sebelumnya. Saldo tetap.");
        } else {
          // Update wallet state global
          const updatedWallet = { ...wallet, balance: newBalance };
          setWallet(updatedWallet);

          // Update localStorage
          localStorage.setItem("balance_" + wallet.publicKey, newBalance);

          // Trigger event untuk komponen lain kalau perlu
          window.dispatchEvent(new Event("balance:update"));

          alert(`Faucet berhasil! Saldo sekarang: ${newBalance}`);
        }
      } else {
        alert("Faucet gagal: " + data.error);
      }
    } catch (err: any) {
      console.error("Faucet request error:", err);
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

      {wallet?.balance && (
        <p className="text-sm mt-2">Balance: {wallet.balance}</p>
      )}
    </div>
  );
}
