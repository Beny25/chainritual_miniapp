"use client";

import { useState } from "react";
import nacl from "tweetnacl";
import { sendTokens } from "@/lib/linera";

export default function SendTokenForm({
  wallet,
  reloadBalance, // ⬅️ tambahin prop
}: {
  wallet: any;
  reloadBalance: () => void; // tipe function
}) {
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const [tx, setTx] = useState<any>(null);

  const handleSend = async () => {
    if (!to || to.length < 10) {
      alert("Recipient public key tidak valid!");
      return;
    }

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      alert("Amount harus angka!");
      return;
    }

    const message = Buffer.from(`${wallet.publicKey}:${to}:${amount}`);
    const signature = nacl.sign.detached(
      message,
      Buffer.from(wallet.secretKey, "hex")
    );

    const res = await sendTokens(
      wallet.publicKey,
      to,
      Number(amount), // ⬅️ pastiin number
      Buffer.from(signature).toString("hex")
    );

    setTx(res);
    alert("Token sent successfully!");

    // ⬅️ reload balance biar WalletBalance update
    if (reloadBalance) reloadBalance();
  };

  return (
    <div className="p-4 border rounded-xl bg-white mt-4">
      <input
        className="border p-2 w-full mb-2"
        placeholder="Recipient Public Key"
        value={to}
        onChange={(e) => setTo(e.target.value)}
      />

      <input
        className="border p-2 w-full mb-2"
        placeholder="Amount"
        type="number"
        min="0"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <button
        onClick={handleSend}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg"
      >
        Send
      </button>

      {tx && (
        <div className="mt-3 p-3 bg-green-100 border border-green-300 rounded-lg text-sm">
          ✅ Transaction sent!
        </div>
      )}
    </div>
  );
}
