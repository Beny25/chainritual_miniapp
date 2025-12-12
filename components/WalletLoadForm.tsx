"use client";

import { useState } from "react";
import { loadWalletFromSecretKey, saveWalletToLocal } from "@/lib/wallet";

export default function WalletLoadForm({ setWallet }: { setWallet: (wallet: any) => void }) {
const [secretKey, setSecretKey] = useState("");
const [error, setError] = useState<string | null>(null);

const handleLoad = async () => {
try {
const w = await loadWalletFromSecretKey(secretKey);
setWallet(w);
saveWalletToLocal(w);
setError(null);
} catch (e) {
setError("Invalid secret key");
}
};

return (
<div className="p-4 border rounded-xl bg-white mt-4 space-y-3">
<textarea
value={secretKey}
onChange={(e) => setSecretKey(e.target.value)}
placeholder="Paste your secret key here..."
className="w-full p-2 border rounded"
/>
<button  
onClick={handleLoad}  
className="px-4 py-2 bg-purple-600 text-white rounded-lg"  
>
Load Wallet
</button>

{error && <p className="text-red-600">{error}</p>}  
</div>

);
}

Bro bisa bantu ini pake typetext aja bukan file
