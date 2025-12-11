"use client";
import { useState } from "react";
import { sendTokens } from "@/lib/linera";

export default function SendTokenForm({ wallet }: { wallet: any }) {
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");

  const send = async (e: any) => {
    e.preventDefault();

    const amt = Number(amount);

    // 1. Panggil API dummy (optional, cuma untuk txId)
    await sendTokens(wallet.publicKey, to, amount, "dummy-signature");

    // 2. UPDATE dummy localStorage
    const fromKey = "balance_" + wallet.publicKey;
    const toKey = "balance_" + to;

    const fromBalance = Number(localStorage.getItem(fromKey) || 0);
    const toBalance = Number(localStorage.getItem(toKey) || 0);

    const newFrom = fromBalance - amt;
    const newTo = toBalance + amt;

    // Simpan
    localStorage.setItem(fromKey, newFrom.toString());
    localStorage.setItem(toKey, newTo.toString());

    // Broadcast event (pengirim)
    window.dispatchEvent(
      new CustomEvent("balance:update", {
        detail: { publicKey: wallet.publicKey, balance: newFrom },
      })
    );

    // Broadcast event (penerima)
    window.dispatchEvent(
      new CustomEvent("balance:update", {
        detail: { publicKey: to, balance: newTo },
      })
    );

    setTo("");
    setAmount("");
  };

  return (
    <form onSubmit={send} className="space-y-3">
      <input
        className="border p-2 w-full"
        placeholder="Recipient Public Key"
        value={to}
        onChange={(e) => setTo(e.target.value)}
      />

      <input
        className="border p-2 w-full"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <button className="bg-black text-white p-2 rounded w-full">
        Send Tokens
      </button>
    </form>
  );
}
