"use client";

import { useState } from "react";
import nacl from "tweetnacl";

export default function SendTokenForm({ wallet }: { wallet: any }) {
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");

  const handleSend = () => {
    const amt = Number(amount);

    if (!to || to.length < 10) return alert("Public key tidak valid!");
    if (amt <= 0) return alert("Amount tidak valid!");

    const senderKey = "balance_" + wallet.publicKey;
    const receiverKey = "balance_" + to;

    const sender = Number(localStorage.getItem(senderKey) || 0);
    const receiver = Number(localStorage.getItem(receiverKey) || 0);

    if (sender < amt) return alert("Balance tidak cukup!");

    // update
    localStorage.setItem(senderKey, String(sender - amt));
    localStorage.setItem(receiverKey, String(receiver + amt));

    // broadcast (global)
    window.dispatchEvent(new CustomEvent("balance:update"));

    alert("Sent!");
  };

  return (
    <div className="p-4 border rounded-xl bg-white mt-4">
      <input
        className="border p-2 w-full mb-2"
        placeholder="Recipient"
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

      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg" onClick={handleSend}>
        Send
      </button>
    </div>
  );
}
