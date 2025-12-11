"use client";

import { useState } from "react";
import nacl from "tweetnacl";
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
    // -------------------- VALIDASI PUBLIC KEY --------------------
    if (!/^[0-9a-fA-F]{64}$/.test(to)) {
      alert("Recipient public key tidak valid! (64 karakter hex)");
      return;
    }

    // -------------------- VALIDASI AMOUNT --------------------
    const amt = Number(amount);
    if (isNaN(amt) || amt <= 0) {
      alert("Amount harus > 0");
      return;
    }

    // -------------------- SIGN MESSAGE --------------------
    const message = Buffer.from(`${wallet.publicKey}:${to}:${amt}`);
    const signature = nacl.sign.detached(
      message,
      Buffer.from(wallet.secretKey, "hex")
    );

    const res = await sendTokens(
      wallet.publicKey,
      to,
      String(amt),
      Buffer.from(signature).toString("hex")
    );

    // -------------------- UPDATE BALANCE LOCALLY --------------------
    const fromKey = "balance_" + wallet.publicKey;
    const toKey = "balance_" + to;

    const senderBalance = Number(localStorage.getItem(fromKey) || 0);
    localStorage.setItem(fromKey, String(senderBalance - amt));

    const receiverBalance = Number(localStorage.getItem(toKey) || 0);
    localStorage.setItem(toKey, String(receiverBalance + amt));

    // Trigger event buat update UI
    window.dispatchEvent(
      new CustomEvent("balance:update", {
        detail: { publicKey: wallet.publicKey, balance: senderBalance - amt },
      })
    );

    window.dispatchEvent(
      new CustomEvent("balance:update", {
        detail: { publicKey: to, balance: receiverBalance + amt },
      })
    );

    setTx(res);
    reloadBalance();
    alert("Token sent successfully!");
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
