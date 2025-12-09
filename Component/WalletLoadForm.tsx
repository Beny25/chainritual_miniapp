"use client";

import { useState } from "react";
import { loadWallet } from "@/lib/wallet";

export default function WalletLoadForm() {
  const [wallet, setWallet] = useState<any>(null);

  const handleLoad = async (e: any) => {
    const file = e.target.files[0];
    const w = await loadWallet(file);
    setWallet(w);
  };

  return (
    <div className="p-4 border rounded-xl bg-white mt-4">
      <input type="file" onChange={handleLoad} />

      {wallet && (
        <div className="mt-4">
          <p><b>Public Key:</b> {wallet.publicKey}</p>
        </div>
      )}
    </div>
  );
}
