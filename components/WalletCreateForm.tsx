"use client";

import { useState, useEffect } from "react";
import {
  generateWallet,
  downloadWallet,
  getWalletFromLocal,
  saveWalletToLocal,
} from "@/lib/wallet";

// helper untuk request chain ke API lokal
async function requestChain(): Promise<{ chainId: string; accountId: string }> {
  const res = await fetch("/api/request-chain", {
    method: "POST",
  });
  if (!res.ok) throw new Error("Failed to request chain");
  return res.json();
}

// helper untuk query balance dari chainId
async function queryBalance(chainId: string): Promise<number> {
  const res = await fetch(`/api/query-balance?chainId=${chainId}`);
  if (!res.ok) throw new Error("Failed to query balance");
  const data = await res.json();
  return data.balance;
}

export default function WalletCreateForm({ setWallet }: { setWallet: (wallet: any) => void }) {
  const [wallet, setLocalWallet] = useState<any>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = getWalletFromLocal();
    if (saved) {
      setLocalWallet(saved);
      setWallet(saved); // update parent
      if (saved.chainId) {
        queryBalance(saved.chainId).then(setBalance).catch(console.error);
      }
    }
  }, [setWallet]);

  const handleCreate = async () => {
    setLoading(true);
    try {
      // 1️⃣ generate wallet
      const w = generateWallet();

      // 2️⃣ request chain (dapat chainId & accountId)
      const { chainId } = await requestChain();
      w.chainId = chainId;

      // 3️⃣ simpan di local storage & update state
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

      {wallet && (
        <div className="space-y-2">
          <p><b>Public Key:</b> {wallet.publicKey}</p>
          <p><b>Chain ID:</b> {wallet.chainId ?? "Pending..."}</p>
          <p><b>Balance:</b> {balance !== null ? `${balance} tokens` : "Loading..."}</p>

          <button
            onClick={() => downloadWallet(wallet)}
            className="px-3 py-1 bg-green-600 text-white rounded-lg mt-2"
          >
            Download Wallet JSON
          </button>
        </div>
      )}
    </div>
  );
}
