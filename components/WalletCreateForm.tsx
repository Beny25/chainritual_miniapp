"use client";

import { useState, useEffect } from "react";
import {
  generateWallet,
  downloadWallet,
  getWalletFromLocal,
  saveWalletToLocal,
} from "@/lib/wallet";
import { requestChain, queryBalance } from "@/lib/neynar";

type WalletWithChain = {
  publicKey: string;
  secretKey: string;
  chainId?: string;
};

export default function WalletCreateForm({
  setWallet,
}: {
  setWallet: (wallet: WalletWithChain) => void;
}) {
  const [walletLocal, setLocalWallet] = useState<WalletWithChain | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  // Load wallet dari localStorage saat mount
  useEffect(() => {
    const saved = getWalletFromLocal() as WalletWithChain | null;
    if (saved) {
      setLocalWallet(saved);
      setWallet(saved);
      if (saved.chainId) {
        queryBalance(saved.chainId).then(setBalance);
      }
    }
  }, [setWallet]);

  const handleCreate = async () => {
    setLoading(true);
    try {
      // 1️⃣ generate wallet
      const w: WalletWithChain = generateWallet();

      // 2️⃣ request chain dari backend / miniapp faucet
      const { chainId } = await requestChain();
      w.chainId = chainId;

      // 3️⃣ simpan di localStorage & update state
      saveWalletToLocal(w);
      setLocalWallet(w);
      setWallet(w);

      // 4️⃣ query balance otomatis
      const bal = await queryBalance(chainId);
      setBalance(bal);
    } catch (err: any) {
      alert("Error: " + err.message);
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

      {walletLocal && (
        <div className="space-y-2">
          <p>
            <b>Public Key:</b> {walletLocal.publicKey}
          </p>
          <p>
            <b>Chain ID:</b> {walletLocal.chainId || "Pending..."}
          </p>
          <p>
            <b>Balance:</b>{" "}
            {balance !== null ? balance + " tokens" : "Loading..."}
          </p>

          <button
            onClick={() => downloadWallet(walletLocal)}
            className="px-3 py-1 bg-green-600 text-white rounded-lg mt-2"
          >
            Download Wallet JSON
          </button>
        </div>
      )}
    </div>
  );
}
