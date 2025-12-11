"use client";

import nacl from "tweetnacl";

const STORAGE_KEY = "linera_wallet";

export function generateWallet() {
  const keyPair = nacl.sign.keyPair();

  const wallet = {
    publicKey: Buffer.from(keyPair.publicKey).toString("hex"),
    secretKey: Buffer.from(keyPair.secretKey).toString("hex"),
  };

  saveWalletToLocal(wallet);
  return wallet;
}

export function downloadWallet(wallet: any) {
  if (typeof window === "undefined") return;

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
  const wallet = JSON.parse(text);
  saveWalletToLocal(wallet);
  return wallet;
}

export async function loadWalletFromSecretKey(secretKeyHex: string) {
  const secretKey = Uint8Array.from(
    secretKeyHex.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16))
  );

  if (secretKey.length !== nacl.sign.secretKeyLength) {
    throw new Error("Invalid secret key length");
  }

  const keyPair = nacl.sign.keyPair.fromSecretKey(secretKey);

  return {
    publicKey: Buffer.from(keyPair.publicKey).toString("hex"),
    secretKey: secretKeyHex,
  };
}

// =========================
// LOCAL STORAGE WRAPPERS
// =========================

export function saveWalletToLocal(wallet: any) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(wallet));
}

export function getWalletFromLocal(): any | null {
  if (typeof window === "undefined") return null;
  const w = localStorage.getItem(STORAGE_KEY);
  if (!w) return null;
  return JSON.parse(w);
}

export function clearWallet() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}
