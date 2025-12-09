"use client";

import { useState } from "react";
import { loadWalletFromSecretKey } from "@/lib/wallet";

export default function WalletLoadForm() {
  const [secretKey, setSecretKey] = useState("");
  const [wallet, setWallet] = useState<any>(null);

  const handleLoad = async () => {
    try {
      const w = await loadWalletFromSecretKey(secretKey);
      setWallet(w);
      // Simpan ke local storage kalau perlu
    } catch (e) {
      alert("Invalid secret key");
    }
  };

  return (
    <div className="p-4 border rounded-xl bg-white mt-4 space-y-3">
      <textarea
        value={secretKey}
        onChange={(e) => setSecretKey(e.target.value)}
        placeholder="Paste your secret key here..."
        className="w-full p-2 border rounded"
      />
      <button
        onClick={handleLoad}
        className="px-4 py-2 bg-purple-600 text-white rounded-lg"
      >
        Load Wallet
      </button>

      {wallet && (
        <div className="mt-4">
          <p><b>Public Key:</b> {wallet.publicKey}</p>
        </div>
      )}
    </div>
  );
}
