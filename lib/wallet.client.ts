"use client";

import nacl from "tweetnacl";

const STORAGE_KEY = "linera_wallet";

// --- helper: convert Uint8Array <-> hex ---
function bytesToHex(bytes: Uint8Array) {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function hexToBytes(hex: string) {
  return new Uint8Array(hex.match(/.{1,2}/g)!.map((b) => parseInt(b, 16)));
}

// ----- GENERATE WALLET -----
export function generateWallet() {
  if (typeof window === "undefined") return null;

  const keyPair = nacl.sign.keyPair();

  const wallet = {
    publicKey: bytesToHex(keyPair.publicKey),
    secretKey: bytesToHex(keyPair.secretKey),
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(wallet));
  return wallet;
}

// ----- LOAD WALLET -----
export function getWalletFromLocal() {
  if (typeof window === "undefined") return null;

  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  return JSON.parse(raw);
}

// ----- SAVE -----
export function saveWalletToLocal(wallet: any) {
  if (typeof window === "undefined") return;

  localStorage.setItem(STORAGE_KEY, JSON.stringify(wallet));
}

// ----- CLEAR -----
export function clearWallet() {
  if (typeof window === "undefined") return;

  localStorage.removeItem(STORAGE_KEY);
}

// ----- LOAD FROM SECRET -----
export function loadWalletFromSecretKey(secretKeyHex: string) {
  if (typeof window === "undefined") return null;

  const secretKey = hexToBytes(secretKeyHex);
  const keyPair = nacl.sign.keyPair.fromSecretKey(secretKey);

  const wallet = {
    publicKey: bytesToHex(keyPair.publicKey),
    secretKey: secretKeyHex,
  };

  saveWalletToLocal(wallet);
  return wallet;
}
