"use client";

import React, { useEffect, useState } from "react";
import {
  generateWallet,
  downloadWallet,
  getWalletFromLocal,
  saveWalletToLocal,
  clearWallet,
  loadWalletFromSecretKey,
  Wallet,
} from "@/lib/wallet";

export default function WalletManager() {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [allWallets, setAllWallets] = useState<Wallet[]>([]);
  const [showLoadForm, setShowLoadForm] = useState(false);
  const [secretKeyInput, setSecretKeyInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const w = getWalletFromLocal();
    if (w) {
      setWallet(w);
      setAllWallets([w]);
    }
  }, []);

  const handleCreate = () => {
    const newWallet = generateWallet();
    setWallet(newWallet);
    setAllWallets([newWallet]);
  };

  const handleLoad = async () => {
    try {
      const w = await loadWalletFromSecretKey(secretKeyInput);
      saveWalletToLocal(w);
      setWallet(w);
      setAllWallets([w]);
      setShowLoadForm(false);
      setSecretKeyInput("");
      setError(null);
    } catch {
      setError("Invalid secret key!");
    }
  };

  const handleDelete = () => {
    clearWallet();
    setWallet(null);
    setAllWallets([]);
  };

  const handleDownload = () => {
    if (wallet) downloadWallet(wallet);
  };

  return (
    <div className="space-y-4 p-4 bg-white rounded-xl shadow">
      {/* Create / Load */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={handleCreate}
          className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm"
        >
          Create Wallet
        </button>
        <button
          onClick={() => setShowLoadForm((prev) => !prev)}
          className="bg-gray-600 text-white px-3 py-1 rounded-lg text-sm"
        >
          Load Wallet
        </button>
        {wallet && (
          <>
            <button
              onClick={handleDownload}
              className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm"
            >
              Backup Wallet
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-600 text-white px-3 py-1 rounded-lg text-sm"
            >
              Delete Wallet
            </button>
          </>
        )}
      </div>

      {/* Load Form */}
      {showLoadForm && (
        <div className="mt-2 space-y-1">
          <input
            type="text"
            value={secretKeyInput}
            onChange={(e) => setSecretKeyInput(e.target.value)}
            placeholder="Paste 64-char secret key"
            className="border p-1 rounded w-full text-sm"
            maxLength={64}
          />
          <button
            onClick={handleLoad}
            className="bg-gray-600 text-white px-3 py-1 rounded-lg text-sm"
          >
            Load
          </button>
          {error && <p className="text-red-600 text-sm">{error}</p>}
        </div>
      )}

      {/* Current Wallet */}
      {wallet && (
        <div className="mt-2">
          <div className="font-semibold mb-1 text-sm">Current Wallet Public Key:</div>
          <div className="font-mono bg-gray-100 p-2 rounded break-all text-xs">
            {wallet.publicKey}
          </div>
        </div>
      )}
    </div>
  );
      }
