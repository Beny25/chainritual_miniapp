"use client";

import { useState } from "react";
import { loadWalletFromSecretKey, Wallet } from "@/lib/wallet";

export default function WalletLoadForm({
  onLoaded,
}: {
  onLoaded: (wallet: Wallet) => void;
}) {
  const [secretKey, setSecretKey] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleLoad = () => {
    try {
      const wallet = loadWalletFromSecretKey(secretKey.trim());
      onLoaded(wallet);
      setError(null);
    } catch (e: any) {
      setError(e.message);
    }
  };

  return (
    <div className="p-4 border rounded-xl space-y-2">
      <textarea
        value={secretKey}
        onChange={(e) => setSecretKey(e.target.value)}
        placeholder="Paste 64-char hex secret key"
        className="w-full p-2 border rounded"
      />

      <button
        onClick={handleLoad}
        className="bg-purple-600 text-white px-4 py-2 rounded-lg"
      >
        Load Wallet
      </button>

      {error && <p className="text-red-600">{error}</p>}
    </div>
  );
}
