"use client";

import { useState } from "react";
import nacl from "tweetnacl";
import { sendTokens } from "@/lib/linera";

export default function SendTokenForm({ wallet }: { wallet: any }) {
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const [tx, setTx] = useState<any>(null);

  const handleSend = async () => {
    const message = Buffer.from(`${wallet.publicKey}:${to}:${amount}`);
    const signature = nacl.sign.detached(
      message,
      Buffer.from(wallet.secretKey, "hex")
    );

    const res = await sendTokens(
      wallet.publicKey,
      to,
      amount,
      Buffer.from(signature).toString("hex")
    );

    setTx(res);
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
        <div className="mt-3">
          <pre>{JSON.stringify(tx, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
