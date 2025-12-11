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
    // ================ VALIDASI PUBLIC KEY ================
    if (!to || !/^[0-9a-fA-F]{64}$/.test(to)) {
      alert("Recipient public key harus 64 karakter (hex)!");
      return;
    }

    // ================ VALIDASI AMOUNT ================
    const amt = Number(amount);
    if (!amount || isNaN(amt) || amt <= 0) {
      alert("Amount harus angka > 0!");
      return;
    }

    // ================ SIGN MESSAGE ================
    const message = Buffer.from(`${wallet.publicKey}:${to}:${amt}`);
    const signature = nacl.sign.detached(
      message,
      Buffer.from(wallet.secretKey, "hex")
    );

    // Kirim dummy API (tidak mengubah apa2)
    const res = await sendTokens(
      wallet.publicKey,
      to,
      String(amt),
      Buffer.from(signature).toString("hex")
    );

    // ================ UPDATE BALANCE LOCALLY ================
    const senderKey = "balance_" + wallet.publicKey;
    const receiverKey = "balance_" + to;

    const senderBalance = Number(localStorage.getItem(senderKey) || 0);
    const receiverBalance = Number(localStorage.getItem(receiverKey) || 0);

    // sender berkurang
    localStorage.setItem(senderKey, String(senderBalance - amt));

    // receiver nambah
    localStorage.setItem(receiverKey, String(receiverBalance + amt));

    // ================ BROADCAST EVENT KE UI ================
    window.dispatchEvent(
      new CustomEvent("balance:update", {
        detail: {
          publicKey: wallet.publicKey,
          balance: senderBalance - amt,
        },
      })
    );

    window.dispatchEvent(
      new CustomEvent("balance:update", {
        detail: {
          publicKey: to,
          balance: receiverBalance + amt,
        },
      })
    );

    reloadBalance(); // refresh komponen sendiri
    setTx(res);
    alert("Token sent successfully!");
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
