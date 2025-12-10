"use client";

import { useState } from "react";

export default function FaucetRequest({ publicKey }: { publicKey: string }) {
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const handleRequest = async () => {
    setLoading(true);

    // Simulate faucet
    setTimeout(() => {
      const key = "balance_" + publicKey;
      const current = Number(localStorage.getItem(key) || 0);
      const updated = current + 100; // nambah 100 token

      localStorage.setItem(key, String(updated));

      // broadcast ke WalletBalance
      window.dispatchEvent(
        new CustomEvent("balance:update", {
          detail: { publicKey, balance: updated },
        })
      );

      setShowPopup(true);
      setLoading(false);

      setTimeout(() => setShowPopup(false), 1200);
    }, 600);
  };

  return (
    <div className="p-4 border rounded-xl bg-white mt-4 relative">
      <button
        onClick={handleRequest}
        disabled={loading}
        className="px-4 py-2 bg-purple-600 text-white rounded-lg"
      >
        {loading ? "Requesting..." : "Request Testnet Tokens"}
      </button>

      {showPopup && (
        <div className="absolute top-full left-0 mt-2 bg-green-500 text-white px-3 py-2 rounded-lg shadow">
          +100 tokens added!
        </div>
      )}
    </div>
  );
      }
