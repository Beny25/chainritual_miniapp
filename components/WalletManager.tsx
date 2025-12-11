"use client";

import { useState, useEffect } from "react";
import {
  createWallet,
  saveWalletToLocal,
  getAllWallets,
  deleteWallet,
  getWalletFromLocal,
  switchWallet,
  downloadWalletFile,
} from "@/lib/wallet";

export default function WalletManager({ wallet, setWallet }: any) {
  const [allWallets, setAllWallets] = useState<any[]>([]);

  const refreshWallets = () => {
    const list = getAllWallets();
    setAllWallets(list);
  };

  const handleCreate = () => {
    const w = createWallet();
    saveWalletToLocal(w);
    setWallet(w);
    refreshWallets();
  };

  const handleLoad = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const data = JSON.parse(event.target?.result as string);
      saveWalletToLocal(data);
      setWallet(data);
      refreshWallets();
    };
    reader.readAsText(file);
  };

  const handleSelect = (w: any) => {
    switchWallet(w);
    setWallet(w);
  };

  const handleDelete = (pubKey: string) => {
    deleteWallet(pubKey);
    const current = getWalletFromLocal();
    setWallet(current);
    refreshWallets();
  };

  useEffect(() => {
    refreshWallets();
  }, []);

  return (
    <div className="space-y-3 text-sm">
      <div className="flex gap-2">
        <button onClick={handleCreate} className="bg-blue-500 text-white px-3 py-1 rounded">
          Create Wallet
        </button>

        <label className="bg-gray-300 text-black px-3 py-1 rounded cursor-pointer">
          Load Wallet
          <input type="file" accept=".json" onChange={handleLoad} className="hidden" />
        </label>

        {wallet && (
          <button
            onClick={() => downloadWalletFile(wallet)}
            className="bg-green-500 text-white px-3 py-1 rounded"
          >
            Backup
          </button>
        )}
      </div>

      {allWallets.length > 0 && (
        <div className="mt-2">
          <div className="font-semibold mb-1">Saved Wallets:</div>
          <ul className="space-y-1">
            {allWallets.map((w) => (
              <li key={w.publicKey} className="flex justify-between items-center bg-gray-100 p-2 rounded">
                <span className="truncate">{w.publicKey.slice(0, 20)}...</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSelect(w)}
                    className="text-blue-600 text-xs"
                  >
                    Select
                  </button>
                  <button
                    onClick={() => handleDelete(w.publicKey)}
                    className="text-red-600 text-xs"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
