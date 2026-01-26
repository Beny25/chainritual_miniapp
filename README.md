# <img src="https://github.com/linera-io/linera-protocol/assets/1105398/fe08c941-93af-4114-bb83-bcc0eaec95f9" width="250" height="85" />
# Linera Testnet Conway

[![License](https://img.shields.io/github/license/Beny25/chainritual_miniapp)](LICENSE)
[![Twitter](https://img.shields.io/twitter/follow/bandit.base.eth)](https://x.com/Alidepok1)

# Linera Wallet Miniapp

**Linera Wallet Miniapp** adalah miniapp sederhana untuk eksperimen **wallet, chain, dan faucet flow** di **Linera Testnet Conway**.

Project ini difokuskan untuk:
- edukasi Linera
- testing wallet & chain lifecycle
- integrasi frontend ↔ linera client

> ⚠️ Project ini **belum fokus ke logic application (App ID)** karena Linera app bersifat immutable setelah publish.

---

## 🚀 Fitur Saat Ini

- 🔑 **Generate wallet (keypair)** di frontend
- 💾 **Download wallet JSON** (public & secret key)
- 📂 **Load wallet** dari file JSON
- 💧 **Request Testnet Tokens (Faucet)**  
  > Faucet request berhasil, balance akan muncul setelah wallet / chain di-query ulang
- ⛓️ **Request chain (via Linera client backend)** *(planned integration)*

---

## 🧠 Design Notes (Penting)

### Kenapa belum pakai Linera App ID?

- Linera application **tidak bisa di-upgrade**
- Salah logic = redeploy dari nol
- Untuk tahap awal, fokus ke:
  - wallet generation
  - chain creation
  - faucet flow
  - dashboard state

Logic application akan ditambahkan **setelah flow wallet & chain stabil**.

---

## 🧩 Arsitektur Sederhana

Frontend (Miniapp) ├── Generate keypair ├── Upload / download wallet ├── Faucet request button └── Dashboard (chainId, balance)

Backend (Linera Client / API) ├── linera wallet init ├── linera wallet request-chain └── linera faucet request

> Browser **tidak bisa langsung** menjalankan `linera` CLI  
> Backend / VPS **dibutuhkan** untuk production.

---

## 🛠 Roadmap

### Fase 1: Wallet Dasar
- [x] Generate wallet (keypair)
- [x] Download wallet JSON
- [x] Load wallet dari file JSON
- [ ] Simpan wallet ke localStorage

### Fase 2: Chain & Faucet
- [x] Request faucet token (testnet)
- [ ] Auto create chain
- [ ] Fetch & display real-time balance
- [ ] Display active chain ID

### Fase 3: UX / UI
- [ ] Loading & error state
- [ ] Toast / notification
- [ ] Mobile-friendly UI

### Fase 4: Security
- [ ] Encrypted wallet storage
- [ ] Password-based unlock
- [ ] Manual backup & restore

### Fase 5: On-chain App (Future)
- [ ] Linera application logic
- [ ] GraphQL service integration
- [ ] App-specific dashboard

---

## 💻 Cara Menjalankan (Local)

```bash
git clone https://github.com/Beny25/chainritual_miniapp.git
cd chainritual_miniapp
npm install
npm run dev

Buka:
👉 http://localhost:3000


---

🔐 Security Notice

Private key tidak pernah dikirim ke server

Semua wallet data disimpan di sisi user

Gunakan testnet only

Jangan gunakan untuk aset real



---

📌 Status Project

🟢 Wallet flow: OK

🟡 Chain & balance: in progress

🔴 App ID logic: belum dipakai (by design)



---

👤 Author

Bandit.base.eth
Twitter / X: @Alidepok1


---

🔗 Repository

https://github.com/Beny25/chainritual_miniapp
