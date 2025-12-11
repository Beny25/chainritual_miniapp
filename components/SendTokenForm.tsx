"use client";

import { useState } from "react";
import nacl from "tweetnacl";

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

    if (!amt || amt <= 0) {
      alert("Amount harus angka!");
      return;
    }

    // ----------------------------
    // 1) Kurangi balance pengirim
    // ----------------------------
    const senderKey = "balance_" + wallet.publicKey;
    const senderBalance = Number(localStorage.getItem(senderKey) || 0);

    if (senderBalance < amt) {
      alert("Balance tidak cukup!");
      return;
    }

    const newSenderBalance = senderBalance - amt;
    localStorage.setItem(senderKey, String(newSenderBalance));

    // broadcast untuk pengirim (agar WalletBalance update)
    window.dispatchEvent(
      new CustomEvent("balance:update", {
        detail: { publicKey: wallet.publicKey, balance: newSenderBalance },
      })
    );

    // ----------------------------
    // 2) Tambahkan balance penerima
    // ----------------------------
    const receiverKey = "balance_" + to;
    const receiverBalance = Number(localStorage.getItem(receiverKey) || 0);
    const newReceiverBalance = receiverBalance + amt;

    localStorage.setItem(receiverKey, String(newReceiverBalance));

    // broadcast untuk penerima
    window.dispatchEvent(
      new CustomEvent("balance:update", {
        detail: { publicKey: to, balance: newReceiverBalance },
      })
    );

    // ----------------------------
    // 3) Simulasi signature dan tx
    // ----------------------------
    const message = Buffer.from(`${wallet.publicKey}:${to}:${amount}`);
    const signature = nacl.sign.detached(
      message,
      Buffer.from(wallet.secretKey, "hex")
    );

    setTx({
      from: wallet.publicKey,
      to,
      amount: amt,
      signature: Buffer.from(signature).toString("hex"),
    });

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
          ✅ Transaction simulated!
        </div>
      )}
    </div>
  );
}
