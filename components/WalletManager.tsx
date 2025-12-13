"use client";

import React, { useEffect, useState } from "react";
import {
  generateWallet,
  downloadWallet,
  getWalletFromLocal,
  saveWalletToLocal,
  clearWallet,
} from "@/lib/wallet";
import WalletLoadForm from "@/components/WalletLoadForm";

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

  // Ambil wallet dari local storage saat mount
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

  // Download wallet JSON
  const downloadWalletFile = (wallet: Wallet) => downloadWallet(wallet);

  // Delete wallet
  const handleDelete = () => {
    clearWallet();
    setWallet(null);
    setAllWallets([]);
  };

  return (
    <div className="space-y-4 p-4 bg-white rounded-xl shadow">
      {/* Create Wallet button */}
      <div className="flex gap-2">
        <button
          onClick={handleCreate}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Create Wallet
        </button>
      </div>

      {/* Load Wallet Form */}
      <WalletLoadForm
  onLoaded={(w) => {
    setWallet(w);
    setAllWallets([w]);
  }}
/>

      {/* Backup / Delete buttons */}
      {wallet && (
        <div className="flex gap-2 mt-2">
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
        </div>
      )}

      {/* Current Wallet */}
      {wallet && (
        <div className="mt-4">
          <div className="font-semibold mb-1">Current Wallet Public Key:</div>
          <div className="font-mono bg-gray-100 p-2 rounded break-all">
            {wallet.publicKey}
          </div>
        </div>
      )}

      {/* Saved Wallets list */}
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
