"use client";

import React, { useEffect, useState } from "react";
import {
  generateWallet,
  downloadWallet,
  getWalletFromLocal,
  loadWallet,
  saveWalletToLocal,
  clearWallet,
} from "@/lib/wallet";

type Wallet = {
  publicKey: string;
  secretKey: string;
};

type WalletManagerProps = {
  wallet: Wallet | null;
  setWallet: React.Dispatch<React.SetStateAction<Wallet | null>>;
};

export default function WalletManager({ wallet, setWallet }: WalletManagerProps) {
  const [allWallets, setAllWallets] = useState<Wallet[]>([]);

  // Ambil wallet dari local storage saat komponen mount
  const refreshWallets = () => {
    const w = getWalletFromLocal();
    if (w) setWallet(w);
    setAllWallets(w ? [w] : []);
  };

  useEffect(() => {
    refreshWallets();
  }, []);

  // Create wallet baru
  const handleCreate = () => {
    const newWallet = generateWallet();
    setWallet(newWallet);
    setAllWallets([newWallet]);
  };

  // Load wallet dari file JSON
  const handleLoad = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      try {
        const loadedWallet = await loadWallet(file);
        setWallet(loadedWallet);
        setAllWallets([loadedWallet]);
      } catch (err) {
        alert("Failed to load wallet: " + err);
      }
    }
  };

  // Download wallet JSON
  const downloadWalletFile = (wallet: Wallet) => {
    downloadWallet(wallet);
  };

  // Delete wallet (clear local storage and state)
  const handleDelete = () => {
    clearWallet();
    setWallet(null);
    setAllWallets([]);
  };

  return (
    <div className="space-y-4 p-4 bg-white rounded-xl shadow">
      <div className="flex gap-2">
        <button
          onClick={handleCreate}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Create Wallet
        </button>

        <label className="bg-gray-300 text-black px-4 py-2 rounded-lg cursor-pointer">
          Load Wallet
          <input
            type="file"
            accept=".json"
            onChange={handleLoad}
            className="hidden"
          />
        </label>

        {wallet && (
          <>
            <button
              onClick={() => downloadWalletFile(wallet)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg"
            >
              Backup Wallet
            </button>

            <button
              onClick={handleDelete}
              className="bg-red-600 text-white px-4 py-2 rounded-lg"
            >
              Delete Wallet
            </button>
          </>
        )}
      </div>

      {wallet && (
        <div>
          <div className="font-semibold mb-1">Current Wallet Public Key:</div>
          <div className="font-mono bg-gray-100 p-2 rounded break-all">
            {wallet.publicKey}
          </div>
        </div>
      )}

      {allWallets.length > 1 && (
        <div>
          <div className="font-semibold mb-1">Saved Wallets:</div>
          <ul className="space-y-1 max-h-40 overflow-y-auto">
            {allWallets.map((w) => (
              <li
                key={w.publicKey}
                className="flex justify-between items-center bg-gray-100 p-2 rounded"
              >
                <span className="truncate">{w.publicKey}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
      }
