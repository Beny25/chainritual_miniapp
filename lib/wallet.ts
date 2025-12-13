import nacl from "tweetnacl";

const STORAGE_KEY = "linera_wallet";

export type Wallet = {
  publicKey: string;
  secretKey: string;
  chainId?: string;
};

// ===== CREATE =====
export function generateWallet(): Wallet {
  const keyPair = nacl.sign.keyPair();
  const wallet: Wallet = {
    publicKey: Buffer.from(keyPair.publicKey).toString("hex"),
    secretKey: Buffer.from(keyPair.secretKey).toString("hex"),
  };
  saveWalletToLocal(wallet);
  return wallet;
}

// ===== LOAD FROM SECRET KEY =====
export function loadWalletFromSecretKey(secretKeyHex: string): Wallet {
  if (!/^[0-9a-fA-F]{64}$/.test(secretKeyHex)) {
    throw new Error("Secret key must be 64 hex chars");
  }

  const secretKey = Uint8Array.from(
    secretKeyHex.match(/.{1,2}/g)!.map((b) => parseInt(b, 16))
  );

  const keyPair = nacl.sign.keyPair.fromSecretKey(secretKey);

  const wallet: Wallet = {
    publicKey: Buffer.from(keyPair.publicKey).toString("hex"),
    secretKey: secretKeyHex,
  };

  saveWalletToLocal(wallet);
  return wallet;
}

// ===== LOAD FROM FILE =====
export async function loadWallet(file: File): Promise<Wallet> {
  const text = await file.text();
  const wallet: Wallet = JSON.parse(text);
  saveWalletToLocal(wallet);
  return wallet;
}

// ===== BACKUP =====
export function downloadWallet(wallet: Wallet) {
  const blob = new Blob([JSON.stringify(wallet, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "linera-wallet.json";
  a.click();
  URL.revokeObjectURL(url);
}

// ===== LOCAL STORAGE =====
export function saveWalletToLocal(wallet: Wallet) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(wallet));
}

export function getWalletFromLocal(): Wallet | null {
  const w = localStorage.getItem(STORAGE_KEY);
  return w ? JSON.parse(w) : null;
}

export function clearWallet() {
  localStorage.removeItem(STORAGE_KEY);
}
