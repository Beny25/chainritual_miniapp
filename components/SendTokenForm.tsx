"use client";

import { useState } from "react";
import nacl from "tweetnacl";
import { sendTokens } from "@/lib/linera";

export default function SendTokenForm({ wallet }: { wallet: any }) {
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const [tx, setTx] = useState<any>(null);
  const [error, setError] = useState("");

  const handleSend = async () => {
    setError("");
    setTx(null);

    // === Basic Validation ===
    if (!/^[0-9]+$/.test(amount)) {
      setError("Amount must be a number.");
      return;
    }
    if (Number(amount) <= 0) {
      setError("Amount must be greater than 0.");
      return;
    }
    if (!/^[a-fA-F0-9]{64}$/.test(to)) {
      setError("Recipient public key must be 64 hex characters.");
      return;
    }

    try {
      const message = Buffer.from(
        `${wallet.publicKey}:${to}:${amount}`
      );
      const signature = nacl.sign.detached(
        message,
        Buffer.from(wallet.secretKey, "hex")
      );

      const res = await sendTokens(
        wallet.publicKey,
        to,
        amount,
        Buffer.from(signature).toString("hex")
      );

      setTx(res);
    } catch (e: any) {
      setError("Failed to send transaction.");
    }
  };

  return (
    <div className="p-4 border rounded-xl bg-white mt-4">
      <input
        className="border p-2 w-full mb-2"
        placeholder="Recipient Public Key"
        value={to}
        onChange={(e) => setTo(e.target.value.trim())}
      />

      <input
        type="number"
        min="0"
        className="border p-2 w-full mb-2"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <button
        onClick={handleSend}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg w-full"
      >
        Send
      </button>

      {error && (
        <p className="text-red-500 text-sm mt-2">{error}</p>
      )}

      {tx && (
        <div className="mt-3 bg-gray-50 p-3 rounded-lg border">
          <pre className="text-sm">{JSON.stringify(tx, null, 2)}</pre>
        </div>
      )}
    </div>
  );
        }
