"use client";

import nacl from "tweetnacl";

const STORAGE_KEY = "linera_wallet";

// ----- GENERATE WALLET -----
export function generateWallet() {
  const keyPair = nacl.sign.keyPair();

  const wallet = {
    publicKey: Buffer.from(keyPair.publicKey).toString("hex"),
    secretKey: Buffer.from(keyPair.secretKey).toString("hex"),
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(wallet));
  return wallet;
}

// ----- LOAD WALLET -----
export function getWalletFromLocal() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  return JSON.parse(raw);
}

// ----- SAVE -----
export function saveWalletToLocal(wallet: any) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(wallet));
}

// ----- CLEAR -----
export function clearWallet() {
  localStorage.removeItem(STORAGE_KEY);
}

// ----- LOAD FROM SECRET -----
export function loadWalletFromSecretKey(secretKeyHex: string) {
  const secretKey = Uint8Array.from(
    secretKeyHex.match(/.{1,2}/g)!.map((b) => parseInt(b, 16))
  );

  const keyPair = nacl.sign.keyPair.fromSecretKey(secretKey);

  const wallet = {
    publicKey: Buffer.from(keyPair.publicKey).toString("hex"),
    secretKey: secretKeyHex,
  };

  saveWalletToLocal(wallet);
  return wallet;
}
