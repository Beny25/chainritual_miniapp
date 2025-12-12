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

  // Load wallet dari secret key 
  const [secretKey, setSecretKey] = useState("");

const handleLoadSecretKey = async () => {
  if (secretKey.length < 64 || !/^[0-9a-fA-F]{64}$/.test(secretKey)) {
    alert("Invalid secret key! Must be 64 hex characters.");
    return;
  }

  try {
    const loadedWallet = await loadWalletFromSecretKey(secretKey);
    setWallet(loadedWallet);
    setAllWallets([loadedWallet]);
    saveWalletToLocal(loadedWallet);
  } catch (err) {
    alert("Failed to load wallet: " + err);
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
  {/* Buttons create/load */}
  <div className="flex gap-2">
    <button onClick={handleCreate} className="bg-blue-600 text-white px-4 py-2 rounded-lg">
      Create Wallet
    </button>

    <input
      type="text"
      value={secretKey}
      onChange={(e) => setSecretKey(e.target.value)}
      placeholder="Paste your 64-char hex secret key..."
      className="border p-2 rounded w-full max-w-xs"
      maxLength={64}
    />

    <button onClick={handleLoadSecretKey} className="bg-gray-600 text-white px-4 py-2 rounded-lg">
      Load Wallet
    </button>
  </div>

  {/* Backup / Delete */}
  {wallet && (
    <div className="flex gap-2">
      <button onClick={() => downloadWalletFile(wallet)} className="bg-green-600 text-white px-4 py-2 rounded-lg">
        Backup Wallet
      </button>

      <button onClick={handleDelete} className="bg-red-600 text-white px-4 py-2 rounded-lg">
        Delete Wallet
      </button>
    </div>
  )}

  {/* Current wallet */}
  {wallet && (
    <div>
      <div className="font-semibold mb-1">Current Wallet Public Key:</div>
      <div className="font-mono bg-gray-100 p-2 rounded break-all">{wallet.publicKey}</div>
    </div>
  )}

  {/* Saved wallets */}
  {allWallets.length > 1 && (
    <div>
      <div className="font-semibold mb-1">Saved Wallets:</div>
      <ul className="space-y-1 max-h-40 overflow-y-auto">
        {allWallets.map((w) => (
          <li key={w.publicKey} className="flex justify-between items-center bg-gray-100 p-2 rounded">
            <span className="truncate">{w.publicKey}</span>
          </li>
        ))}
      </ul>
    </div>
  )}
</div>
  );
 }
