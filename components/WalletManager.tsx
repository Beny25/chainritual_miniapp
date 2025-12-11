"use client";

import { useEffect, useState } from "react";
import {
  createWallet,
  downloadWallet,
  getWalletFromLocal,
  loadWallet,
  loadWalletFromSecretKey,
  getAllWallets,
  saveWallet,
  deleteWallet,
} from "@/lib/wallet";

export default function WalletManager({ wallet, setWallet }: any) {
  const [allWallets, setAllWallets] = useState<any[]>([]);

  const refreshWallets = () => {
    setAllWallets(getAllWallets());
  };

  const handleCreate = () => {
    const newWallet = createWallet();
    setWallet(newWallet);
    refreshWallets();
  };

  const handleLoad = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const w = await loadWallet(e.target.files[0]);
    setWallet(w);
    refreshWallets();
  };

  const handleSelect = (pubKey: string) => {
    const found = allWallets.find((w) => w.publicKey === pubKey);
    if (found) {
      saveWallet(found);
      setWallet(found);
    }
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
            onClick={() => downloadWallet(wallet)}
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
              <li
                key={w.publicKey}
                className="flex justify-between items-center bg-gray-100 p-2 rounded"
              >
                <span className="truncate">{w.publicKey.slice(0, 20)}...</span>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleSelect(w.publicKey)}
                    className="text-blue-500 text-xs"
                  >
                    Use
                  </button>
                  <button
                    onClick={() => handleDelete(w.publicKey)}
                    className="text-red-500 text-xs"
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
