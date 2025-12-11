"use client";

import { useState, useEffect } from "react";
import {
  generateWallet,
  downloadWallet,
  loadWallet,
  getWalletFromLocal,
  saveWalletToLocal,
  clearWallet,
} from "@/lib/wallet";

export default function WalletManager({ setWallet }: { setWallet: (w: any) => void }) {
  const [wallet, setLocalWallet] = useState<any>(null);

  useEffect(() => {
    const w = getWalletFromLocal();
    if (w) setLocalWallet(w);
  }, []);

  const handleCreate = () => {
    const w = generateWallet();
    setLocalWallet(w);
    setWallet(w);
  };

  const handleLoad = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    try {
      const w = await loadWallet(e.target.files[0]);
      setLocalWallet(w);
      setWallet(w);
    } catch (err) {
      alert("Failed to load wallet");
    }
  };

  const handleBackup = () => {
    if (!wallet) return;
    downloadWallet(wallet);
  };

  const handleDelete = () => {
    clearWallet();
    setLocalWallet(null);
    setWallet(null);
  };

  return (
    <div className="p-4 bg-white rounded-xl shadow space-y-4 max-w-md mx-auto">
      <div className="flex gap-2">
        <button onClick={handleCreate} className="px-3 py-1 bg-blue-600 text-white rounded">
          Create Wallet
        </button>

        <label className="px-3 py-1 bg-gray-300 rounded cursor-pointer">
          Load Wallet
          <input type="file" accept=".json" onChange={handleLoad} className="hidden" />
        </label>

        {wallet && (
          <>
            <button
              onClick={handleBackup}
              className="px-3 py-1 bg-green-600 text-white rounded"
            >
              Backup Wallet
            </button>
            <button
              onClick={handleDelete}
              className="px-3 py-1 bg-red-600 text-white rounded"
            >
              Delete Wallet
            </button>
          </>
        )}
      </div>

      {wallet && (
        <div>
          <div className="font-semibold">Current Wallet Public Key:</div>
          <div className="font-mono break-all p-2 bg-gray-100 rounded mt-1">
            {wallet.publicKey}
          </div>
        </div>
      )}

      {!wallet && <div>No wallet loaded.</div>}
    </div>
  );
}
