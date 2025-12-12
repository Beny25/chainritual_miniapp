"use client";

import { useState, useEffect } from "react";
import { generateWallet, downloadWallet, getWalletFromLocal, saveWalletToLocal, Wallet } from "@/lib/wallet";
import { requestChain, queryBalance } from "@/lib/neynar";

export default function WalletCreateForm({ setWallet }: { setWallet: (wallet: Wallet) => void }) {
  const [wallet, setLocalWallet] = useState<Wallet | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  // load wallet dari localStorage saat mount
  useEffect(() => {
    const saved = getWalletFromLocal();
    if (saved) {
      setLocalWallet(saved);
      setWallet(saved); // update parent
      if (saved.chainId) fetchBalance(saved.chainId);
    }
  }, [setWallet]);

  // fetch balance
  const fetchBalance = async (chainId: string) => {
    try {
      const b = await queryBalance(chainId);
      setBalance(b);
    } catch (err) {
      console.error(err);
      setBalance(null);
    }
  };

  const handleCreate = async () => {
  setLoading(true);
  try {
    // 1️⃣ create wallet
    const w = generateWallet();

    // 2️⃣ request chain dari backend / miniapp faucet pakai publicKey
    const chainId = await requestChain(w.publicKey);
    w.chainId = chainId;

    // 3️⃣ simpan di localStorage & update state
    saveWalletToLocal(w);
    setWallet(w);
    setLocalWallet(w);

    // 4️⃣ fetch balance
    fetchBalance(chainId);
  } catch (err) {
    console.error("Failed to create wallet + request chain:", err);
    alert("Gagal create wallet / request chain, cek console.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="p-4 border rounded-xl bg-white space-y-4">
      <button
        onClick={handleCreate}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg w-full"
        disabled={loading}
      >
        {loading ? "Creating..." : "Create Wallet"}
      </button>

      {wallet && (
        <div className="space-y-2">
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
