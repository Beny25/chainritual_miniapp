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

    // ========= API CALL =========
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

    // ==========================================================
    //  LOCALSTORAGE — HANYA JALAN DI CLIENT
    // ==========================================================
    if (typeof window !== "undefined") {
      const senderKey = "balance_" + wallet.publicKey;
      const receiverKey = "balance_" + to;

      const senderBalance = Number(localStorage.getItem(senderKey) || 0);
      const receiverBalance = Number(localStorage.getItem(receiverKey) || 0);

      const newSender = senderBalance - amt;
      const newReceiver = receiverBalance + amt;

      localStorage.setItem(senderKey, String(newSender));
      localStorage.setItem(receiverKey, String(newReceiver));

      // Broadcast ke UI
      window.dispatchEvent(
        new CustomEvent("balance:update", {
          detail: { publicKey: wallet.publicKey, balance: newSender },
        })
      );

      window.dispatchEvent(
        new CustomEvent("balance:update", {
          detail: { publicKey: to, balance: newReceiver },
        })
      );

      // Simpan history
      const histKey = "history_" + wallet.publicKey;
      const prev = JSON.parse(localStorage.getItem(histKey) || "[]");

      const txRecord = {
        txId: data.txId,
        to,
        amount: amt,
        direction: "sent",
        timestamp: Date.now(),
      };

      localStorage.setItem(histKey, JSON.stringify([txRecord, ...prev]));
    }

    reloadBalance();
    setTx(data);
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
          ✅ Transaction sent!
        </div>
      )}
    </div>
  );
}
