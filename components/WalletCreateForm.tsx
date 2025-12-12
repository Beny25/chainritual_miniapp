"use client";

import { useState, useEffect } from "react";
import { generateWallet, downloadWallet, getWalletFromLocal, saveWalletToLocal } from "@/lib/wallet";

// helper untuk request chain & faucet
async function requestChain(publicKey: string): Promise<string> {
  const res = await fetch("/api/request-chain", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ publicKey }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Request chain failed");
  return data.chainId; // ini chainId baru
}

async function requestFaucet(chainId: string): Promise<void> {
  const res = await fetch("/api/faucet", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chainId }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Faucet failed");
}

export default function WalletCreateForm({ setWallet }: { setWallet: (wallet: any) => void }) {
  const [wallet, setLocalWallet] = useState<any>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = getWalletFromLocal();
    if (saved) {
      setLocalWallet(saved);
      setWallet(saved);
      if (saved.chainId) fetchBalance(saved.chainId);
    }
  }, [setWallet]);

  const fetchBalance = async (chainId: string) => {
    try {
      const res = await fetch(`/api/balance?chainId=${chainId}`);
      const data = await res.json();
      setBalance(data.balance ?? 0);
    } catch {
      setBalance(0);
    }
  };

  const handleCreate = async () => {
    setLoading(true);
    try {
      const w = generateWallet();
      // simpan dulu ke local
      saveWalletToLocal(w);
      setLocalWallet(w);
      setWallet(w);

      // request chain
      const chainId = await requestChain(w.publicKey);
      w.chainId = chainId;
      saveWalletToLocal(w);
      setWallet(w);
      setLocalWallet(w);

      // request faucet
      await requestFaucet(chainId);

      // fetch balance
      await fetchBalance(chainId);

    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-xl bg-white space-y-3">
      <button
        onClick={handleCreate}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg"
      >
        {loading ? "Creating..." : "Create Wallet"}
      </button>

      {wallet && (
        <div>
          <p><b>Public Key:</b> {wallet.publicKey}</p>
          {wallet.chainId && <p><b>Chain ID:</b> {wallet.chainId}</p>}
          <p><b>Balance:</b> {balance !== null ? balance : "Loading..."} tokens</p>
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
