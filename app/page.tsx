"use client";

import { useState, useEffect } from "react";
import WalletCreateForm from "@/components/WalletCreateForm";
import WalletLoadForm from "@/components/WalletLoadForm";
import FaucetRequest from "@/components/FaucetRequest";
import WalletBalance from "@/components/WalletBalance";
import SendTokenForm from "@/components/SendTokenForm";
import { getWalletFromLocal, clearWallet } from "@/lib/wallet";
import HeaderBanner from "@/components/HeaderBanner";
import Footer from "@/components/Footer";

export default function Page() {
  const [wallet, setWallet] = useState<any>(null);
  const [reloadFlag, setReloadFlag] = useState(0);

  const reloadBalance = () => setReloadFlag(prev => prev + 1);

  useEffect(() => {
    const w = getWalletFromLocal();
    if (w) setWallet(w);
  }, []);

  const handleDownload = () => {
    const data = localStorage.getItem("linera_wallet");
    if (!data) return alert("No wallet found.");
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "linera-wallet.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    clearWallet();
    setWallet(null);
  };

  return (
    <div className="max-w-md mx-auto mt-2 p-4 space-y-6">
      <HeaderBanner />

      {!wallet && (
        <div className="space-y-4 bg-white p-4 rounded-xl shadow">
          <WalletCreateForm setWallet={setWallet} />
          <WalletLoadForm setWallet={setWallet} />
        </div>
      )}

      {wallet && (
        <div className="space-y-4 bg-white p-4 rounded-xl shadow">
          {/* Public Key Display */}
          <div className="text-sm">
            <span className="font-semibold">Current Wallet Public Key:</span>
            <div className="font-mono break-all mt-1 p-2 bg-gray-100 rounded">
              {wallet.publicKey.startsWith("0x") ? wallet.publicKey : "0x" + wallet.publicKey}
            </div>
          </div>

          {/* Wallet Balance */}
          <WalletBalance publicKey={wallet.publicKey.startsWith("0x") ? wallet.publicKey : "0x" + wallet.publicKey} key={reloadFlag} />

          {/* Download Wallet */}
          <button
            className="bg-green-600 text-white px-4 py-2 rounded-lg w-full"
            onClick={handleDownload}
          >
            Download Wallet
          </button>

          {/* Clear Wallet */}
          <button
            className="bg-red-600 text-white px-4 py-2 rounded-lg w-full"
            onClick={handleClear}
          >
            Clear Wallet
          </button>

          {/* Faucet Request */}
          <FaucetRequest publicKey={wallet.publicKey} onRefresh={reloadBalance} />

          {/* Send Tokens */}
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg w-full"
            onClick={() => alert("Coming Soon - Akan aktif saat URL faucet rilis publik.")}
          >
            Send Tokens
          </button>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}
