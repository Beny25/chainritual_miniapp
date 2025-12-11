"use client";

import { useState } from "react";
import { safeStorage } from "@/lib/safeStorage";
import { sendTokens } from "@/lib/linera";

export default function SendTokenForm({
  wallet,
  reloadBalance,
}: {
  wallet: any;
  reloadBalance: () => void;
}) {
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const [tx, setTx] = useState<any>(null);

  const handleSend = async () => {
    // ---------------- VALIDASI PUBLIC KEY ----------------
    if (!to || !/^[0-9a-fA-F]{64}$/.test(to)) {
      alert("Recipient public key harus 64 karakter hex!");
      return;
    }

    // ---------------- VALIDASI AMOUNT ----------------
    const amt = Number(amount);
    if (!amount || isNaN(amt) || amt <= 0) {
      alert("Amount harus angka > 0!");
      return;
    }

    // ---------------- CALL API (dummy / real) ----------------
    const res = await fetch("/api/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        from: wallet.publicKey,
        to,
        amount: amt,
        signature: wallet.secretKey, // dummy
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      alert(data.error || "Send failed");
      return;
    }

    alert("Success! TxID: " + data.txId);

    // ---------------- UPDATE BALANCE LOCALLY ----------------
    const senderKey = "balance_" + wallet.publicKey;
    const receiverKey = "balance_" + to;

    const senderBalance = Number(safeStorage.get(senderKey) || 0);
    const receiverBalance = Number(safeStorage.get(receiverKey) || 0);

    const newSenderBalance = senderBalance - amt;
    const newReceiverBalance = receiverBalance + amt;

    safeStorage.set(senderKey, String(newSenderBalance));
    safeStorage.set(receiverKey, String(newReceiverBalance));

    // ---------------- BROADCAST EVENT KE UI ----------------
    if (typeof window !== "undefined") {
      // sender update
      window.dispatchEvent(
        new CustomEvent("balance:update", {
          detail: {
            publicKey: wallet.publicKey,
            balance: newSenderBalance,
          },
        })
      );

      // receiver update
      window.dispatchEvent(
        new CustomEvent("balance:update", {
          detail: {
            publicKey: to,
            balance: newReceiverBalance,
          },
        })
      );
    }

    // ---------------- SAVE HISTORY ----------------
    const histKey = "history_" + wallet.publicKey;
    const prev = JSON.parse(safeStorage.get(histKey) || "[]");

    const newTx = {
      txId: data.txId,
      to,
      amount: amt,
      direction: "sent",
      timestamp: Date.now(),
    };

    safeStorage.set(histKey, JSON.stringify([newTx, ...prev]));

    // Refresh balance komponen
    reloadBalance();

    setTx(newTx);

    // Reset input
    setTo("");
    setAmount("");
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
        className="border p-2 w-full mb-2"
        placeholder="Amount"
        type="number"
        min="1"
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
          ✅ Transaction sent! (TxID: {tx.txId})
        </div>
      )}
    </div>
  );
}
