"use client";

import { useState } from "react";
import { loadWalletFromSecretKey, saveWalletToLocal } from "@/lib/wallet";

export default function WalletLoadForm({ setWallet }: { setWallet: (wallet: any) => void }) {
  const [secretKey, setSecretKey] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleLoad = async () => {
    if (secretKey.length < 64) {
      setError("Secret key is too short, must be 64 hex characters");
      alert("Secret key is too short!"); // alert tambahan
      return;
    }

    if (!/^[0-9a-fA-F]{64}$/.test(secretKey)) {
      setError("Secret key must be 64 hex characters (0-9, a-f)");
      alert("Invalid secret key format!");
      return;
    }

    try {
      const w = await loadWalletFromSecretKey(secretKey);
      setWallet(w);
      saveWalletToLocal(w);
      setError(null);
    } catch (e) {
      setError("Failed to load wallet: invalid secret key");
      alert("Failed to load wallet! Check your secret key.");
    }
  };

  return (
    <div className="p-4 border rounded-xl bg-white mt-4 space-y-3">
      <input
        type="text"
        value={secretKey}
        onChange={(e) => setSecretKey(e.target.value)}
        placeholder="Paste your 64-char hex secret key..."
        className="w-full p-2 border rounded"
        maxLength={64}
      />
      <button
        onClick={handleLoad}
        className="px-4 py-2 bg-purple-600 text-white rounded-lg"
      >
        Load Wallet
      </button>

      {error && <p className="text-red-600">{error}</p>}
    </div>
  );
}
