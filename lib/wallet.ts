// /lib/wallet.ts
import nacl from "tweetnacl";

export function generateWallet() {
  const keyPair = nacl.sign.keyPair();

  const wallet = {
    publicKey: Buffer.from(keyPair.publicKey).toString("hex"),
    secretKey: Buffer.from(keyPair.secretKey).toString("hex"),
  };

  return wallet;
}

export function downloadWallet(wallet: any) {
  const blob = new Blob([JSON.stringify(wallet, null, 2)], {
    type: "application/json",
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "linera-wallet.json";
  a.click();
}

export async function loadWallet(file: File) {
  const text = await file.text();
  return JSON.parse(text);
    }
