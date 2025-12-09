// /lib/signer.ts

import * as ed from "@noble/ed25519";

const STORAGE_KEY = "linera-wallet";

// ----------- Helpers -----------

function isBrowser() {
  return typeof window !== "undefined";
}

// ----------- Generate Wallet -----------

export async function generateWallet() {
  const privateKey = ed.utils.randomPrivateKey();
  const publicKey = await ed.getPublicKeyAsync(privateKey);

  const wallet = {
    privateKey: Buffer.from(privateKey).toString("hex"),
    publicKey: Buffer.from(publicKey).toString("hex"),
  };

  // store only in browser
  if (isBrowser()) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(wallet));
  }

  return wallet;
}

// ----------- Load Wallet -----------

export function loadWallet() {
  if (!isBrowser()) return null;

  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

// ----------- Clear Wallet -----------

export function clearWallet() {
  if (!isBrowser()) return;
  localStorage.removeItem(STORAGE_KEY);
}

// ----------- Sign Message -----------

export async function signMessage(message: Uint8Array) {
  const wallet = loadWallet();
  if (!wallet) throw new Error("No wallet found");

  const privateKey = Uint8Array.from(Buffer.from(wallet.privateKey, "hex"));
  return await ed.signAsync(message, privateKey);
}
