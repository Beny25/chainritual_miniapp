"use client";

import { useState, useEffect } from "react";
import { generateWallet, downloadWallet, saveWalletToLocal, getWalletFromLocal } from "@/lib/wallet";
import { requestChain, queryBalance } from "@/lib/neynar"; // helper untuk request chain + balance

type Wallet = {
  publicKey: string;
  secretKey: string;
  chainId?: string;
};

export default function WalletCreateForm({ setWallet }: { setWallet: (wallet: Wallet) => void }) {
  const [wallet, setLocalWallet] = useState<Wallet | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = getWalletFromLocal();
    if (saved) {
      setLocalWallet(saved);
      setWallet(saved);
      if (saved.chainId) {
        fetchBalance(saved.chainId);
      }
    }
  }, [setWallet]);

  const fetchBalance = async (chainId: string) => {
    try {
      const b = await queryBalance(chainId);
      setBalance(b);
    } catch (err) {
      console.error("Failed to fetch balance:", err);
      setBalance(null);
    }
  };

  const handleCreate = async () => {
    setLoading(true);
    try {
      // 1️⃣ Generate wallet
      const w: Wallet = generateWallet();

      // 2️⃣ Request chain dari faucet backend
      const chainId = await requestChain(w.publicKey);
      w.chainId = chainId;

      // 3️⃣ Save ke localStorage & update state
      saveWalletToLocal(w);
      setLocalWallet(w);
      setWallet(w);

      // 4️⃣ Query balance
      await fetchBalance(chainId);
    } catch (err) {
      console.error("Failed to create wallet + request chain:", err);
      alert("Failed to create wallet: " + err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-xl bg-white space-y-4">
      <button
        onClick={handleCreate}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg"
        disabled={loading}
      >
        {loading ? "Creating Wallet..." : "Create Wallet"}
      </button>

      {wallet && (
        <div className="space-y-2">
          <p><b>Public Key:</b> {wallet.publicKey}</p>
          <p><b>Chain ID:</b> {wallet.chainId ?? "Pending..."}</p>
          <p><b>Balance:</b> {balance !== null ? balance + " tokens" : "Loading..."}</p>

          <div className="space-x-2 mt-2">
            <button
              onClick={() => downloadWallet(wallet)}
              className="px-3 py-1 bg-green-600 text-white rounded-lg"
            >
              Download Wallet JSON
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
