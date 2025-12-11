"use client";

import { useState } from "react";
import nacl from "tweetnacl";
import { sendTokens } from "@/lib/linera";

export default function SendTokenForm({ wallet }: { wallet: any }) {
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const [tx, setTx] = useState<any>(null);

  const handleSend = async () => {
    const amt = Number(amount);

    if (!to || to.length < 10) {
      alert("Recipient public key tidak valid!");
      return;
    }

    if (!amount || isNaN(amt) || amt <= 0) {
      alert("Amount harus angka!");
      return;
    }

    // =====================
    // 1) SIGN TRANSACTION (dummy)
    // =====================
    const message = Buffer.from(`${wallet.publicKey}:${to}:${amt}`);
    const signature = nacl.sign.detached(
      message,
      Buffer.from(wallet.secretKey, "hex")
    );

    // Simulate backend broadcast
    await sendTokens(
      wallet.publicKey,
      to,
      String(amt),
      Buffer.from(signature).toString("hex")
    );

    // =====================
    // 2) UPDATE BALANCE SENDER
    // =====================
    const keySender = "balance_" + wallet.publicKey;
    const senderBalance = Number(localStorage.getItem(keySender) || 0);

    const updatedSender = senderBalance - amt;
    localStorage.setItem(keySender, String(updatedSender));

    // broadcast update
    window.dispatchEvent(
      new CustomEvent("balance:update", {
        detail: { publicKey: wallet.publicKey, balance: updatedSender },
      })
    );

    // =====================
    // 3) UPDATE BALANCE RECEIVER
    // =====================
    const keyReceiver = "balance_" + to;
    const receiverBalance = Number(localStorage.getItem(keyReceiver) || 0);

    const updatedReceiver = receiverBalance + amt;
    localStorage.setItem(keyReceiver, String(updatedReceiver));

    // broadcast update (untuk halaman penerima kalau dibuka)
    window.dispatchEvent(
      new CustomEvent("balance:update", {
        detail: { publicKey: to, balance: updatedReceiver },
      })
    );

    // =====================
    // DONE
    // =====================
    setTx({ to, amount: amt });
    alert("Token sent!");
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
          ✅ Sent {tx.amount} tokens to {tx.to}
        </div>
      )}
    </div>
  );
}
