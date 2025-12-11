import nacl from "tweetnacl";

const STORAGE_KEY = "linera_wallets";
const CURRENT_KEY = "linera_current_wallet";

// Buat wallet baru
export function generateWallet() {
  const keyPair = nacl.sign.keyPair();
  const wallet = {
    publicKey: Buffer.from(keyPair.publicKey).toString("hex"),
    secretKey: Buffer.from(keyPair.secretKey).toString("hex"),
  };
  saveWalletToLocal(wallet);
  return wallet;
}

// Download wallet JSON
export function downloadWallet(wallet: any) {
  const blob = new Blob([JSON.stringify(wallet, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `wallet_${wallet.publicKey}.json`;
  a.click();
}

// Load dari file
export async function loadWallet(file: File) {
  const text = await file.text();
  const wallet = JSON.parse(text);
  saveWalletToLocal(wallet);
  return wallet;
}

// Load dari secret key
export async function loadWalletFromSecretKey(secretKeyHex: string) {
  const secretKey = Uint8Array.from(
    secretKeyHex.match(/.{1,2}/g)!.map((b) => parseInt(b, 16))
  );
  if (secretKey.length !== nacl.sign.secretKeyLength) {
    throw new Error("Invalid secret key length");
  }
  const keyPair = nacl.sign.keyPair.fromSecretKey(secretKey);
  const wallet = {
    publicKey: Buffer.from(keyPair.publicKey).toString("hex"),
    secretKey: secretKeyHex,
  };
  saveWalletToLocal(wallet);
  return wallet;
}

// =============================
// Multiple Wallet Management
// =============================

export function getAllWallets(): any[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveWalletToLocal(wallet: any) {
  const wallets = getAllWallets();
  const exists = wallets.find((w) => w.publicKey === wallet.publicKey);
  if (!exists) wallets.push(wallet);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(wallets));
  localStorage.setItem(CURRENT_KEY, wallet.publicKey);
}

export function getWalletFromLocal(): any | null {
  const pubKey = localStorage.getItem(CURRENT_KEY);
  if (!pubKey) return null;
  const wallets = getAllWallets();
  return wallets.find((w) => w.publicKey === pubKey) || null;
}

export function switchWallet(wallet: any) {
  localStorage.setItem(CURRENT_KEY, wallet.publicKey);
}

export function deleteWallet(pubKey: string) {
  let wallets = getAllWallets();
  wallets = wallets.filter((w) => w.publicKey !== pubKey);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(wallets));

  const current = localStorage.getItem(CURRENT_KEY);
  if (current === pubKey) {
    localStorage.removeItem(CURRENT_KEY);
  }
}

export function clearAllWallets() {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(CURRENT_KEY);
}
