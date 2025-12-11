"use client";

import { useState } from "react";
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
  // ========= VALIDASI PUBLIC KEY =========
  if (!to || !/^[0-9a-fA-F]{64}$/.test(to)) {
    alert("Recipient public key harus 64 karakter hex!");
    return;
  }

  // ========= VALIDASI AMOUNT =========
  const amt = Number(amount);
  if (!amount || isNaN(amt) || amt <= 0) {
    alert("Amount harus angka > 0!");
    return;
  }

  // ========= KIRIM KE BACKEND DUMMY / REAL =========
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

  // ========= UPDATE BALANCE (HANYA DI BROWSER) =========
  if (typeof window !== "undefined") {
    const senderKey = "balance_" + wallet.publicKey;
    const receiverKey = "balance_" + to;

    const senderBalance = Number(localStorage.getItem(senderKey) || 0);
    const receiverBalance = Number(localStorage.getItem(receiverKey) || 0);

    // kurangi saldo pengirim
    localStorage.setItem(senderKey, String(senderBalance - amt));

    // tambah saldo penerima
    localStorage.setItem(receiverKey, String(receiverBalance + amt));

    // broadcast ke UI
    window.dispatchEvent(
      new CustomEvent("balance:update", {
        detail: {
          publicKey: wallet.publicKey,
          balance: senderBalance - amt,
        },
      })
    );

    // ========= SIMPAN HISTORY TX =========
    const histKey = "history_" + wallet.publicKey;
    const prev = JSON.parse(localStorage.getItem(histKey) || "[]");

    const newTx = {
      txId: data.txId,
      to,
      amount: amt,
      direction: "sent",
      timestamp: Date.now(),
    };

    localStorage.setItem(histKey, JSON.stringify([newTx, ...prev]));
  }
};

    // Update UI (sender)
    window.dispatchEvent(
      new CustomEvent("balance:update", {
        detail: { publicKey: wallet.publicKey, balance: newSenderBalance },
      })
    );

    // Update UI (receiver)
    window.dispatchEvent(
      new CustomEvent("balance:update", {
        detail: { publicKey: to, balance: newReceiverBalance },
      })
    );

    reloadBalance(); // refresh komponen balance pengirim

    setTx(res);
    alert("Success! TxID: " + res.txId);

    // reset input
    setAmount("");
    setTo("");
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
          ✅ Transaction sent!
        </div>
      )}
    </div>
  );
}
