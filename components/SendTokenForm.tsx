"use client";

import { useState } from "react";
import nacl from "tweetnacl";

export default function SendTokenForm({ wallet }: { wallet: any }) {
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const [tx, setTx] = useState<any>(null);

  const handleSend = () => {
    if (!to || to.length < 10) {
      alert("Recipient public key tidak valid!");
      return;
    }
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      alert("Amount harus angka!");
      return;
    }

    const amountNumber = Number(amount);

    // keys di localStorage
    const fromKey = "balance_" + wallet.publicKey;
    const toKey = "balance_" + to;

    const fromCurrent = Number(localStorage.getItem(fromKey) || 0);
    if (fromCurrent < amountNumber) {
      alert("Insufficient balance!");
      return;
    }

    const toCurrent = Number(localStorage.getItem(toKey) || 0);

    // update saldo
    const fromUpdated = fromCurrent - amountNumber;
    const toUpdated = toCurrent + amountNumber;

    localStorage.setItem(fromKey, String(fromUpdated));
    localStorage.setItem(toKey, String(toUpdated));

    // broadcast event ke WalletBalance pengirim & penerima
    window.dispatchEvent(new CustomEvent("balance:update", {
      detail: { publicKey: wallet.publicKey, balance: fromUpdated }
    }));
    window.dispatchEvent(new CustomEvent("balance:update", {
      detail: { publicKey: to, balance: toUpdated }
    }));

    setTx({ success: true });
    alert(`✅ ${amountNumber} tokens sent to ${to}!`);
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
