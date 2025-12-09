"use client";

import { useState } from "react";
import { generateWallet, downloadWallet } from "@/lib/wallet";

export default function WalletCreateForm() {
  const [wallet, setWallet] = useState<any>(null);

  const handleCreate = () => {
    const w = generateWallet();
    setWallet(w);
  };

  return (
    <div className="p-4 border rounded-xl bg-white">
      <button
        onClick={handleCreate}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg"
      >
        Create Wallet
      </button>

      {wallet && (
        <div className="mt-4">
          <p><b>Public Key:</b> {wallet.publicKey}</p>
          <button
            onClick={() => downloadWallet(wallet)}
            className="px-3 py-1 bg-green-600 text-white rounded-lg mt-2"
          >
            Download Wallet JSON
          </button>
        </div>
      )}
    </div>
  );
}
