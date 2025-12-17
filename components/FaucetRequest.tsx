"use client";

import { Dispatch, SetStateAction, useState } from "react";

export type Wallet = {
  publicKey: string;
  privateKey?: string;
  chainId?: string;
};

export type FaucetRequestProps = {
  wallet: Wallet;
  setWallet: Dispatch<SetStateAction<Wallet>>;
};

export default function FaucetRequest({
  wallet,
  setWallet,
}: FaucetRequestProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const requestFaucet = async () => {
    if (!wallet?.publicKey) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("/api/faucet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          publicKey: wallet.publicKey.startsWith("0x")
            ? wallet.publicKey
            : "0x" + wallet.publicKey,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Faucet failed");
      }

      // optional: update wallet with chainId if returned
      if (data.chainId) {
        setWallet((w) => ({
          ...w,
          chainId: data.chainId,
        }));
      }

      setSuccess("Faucet success!");

      // trigger balance reload
      window.dispatchEvent(new Event("balance:update"));
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-xl bg-white space-y-2">
      <button
        onClick={requestFaucet}
        disabled={loading}
        className="px-4 py-2 rounded bg-black text-white disabled:opacity-50"
      >
        {loading ? "Requesting..." : "Request Faucet"}
      </button>

      {error && <div className="text-red-500 text-sm">{error}</div>}
      {success && <div className="text-green-600 text-sm">{success}</div>}
    </div>
  );
      }
