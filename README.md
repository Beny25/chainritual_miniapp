# <img src="https://github.com/linera-io/linera-protocol/assets/1105398/fe08c941-93af-4114-bb83-bcc0eaec95f9" width="250" height="85" />
# Testnet Conway

[![License](https://img.shields.io/github/license/Beny25/chainritual_miniapp)](LICENSE)
[![Twitter](https://img.shields.io/twitter/follow/bandit.base.eth)](https://x.com/Alidepok1)

# Linera Wallet Miniapp

**Miniapp wallet sederhana** untuk membuat, memuat, dan mengelola wallet di Linera blockchain. Cocok untuk edukasi, testing, dan eksperimen blockchain.

---

## 🚀 Fitur Saat Ini
- ✨ **Create wallet baru** dengan generate keypair
- 💾 **Download wallet JSON** (public & secret key)
- 📂 **Load wallet** dari file JSON yang diupload

---

## 🛠 Roadmap / Rencana Pengembangan

### Fase 1: Dasar
- [x] Create wallet dan tampilkan public key
- [x] Download wallet JSON
- [x] Load wallet dari file JSON
- [ ] Simpan wallet ke localStorage untuk persistent session

### Fase 2: Interaksi Blockchain
- [ ] Request testnet faucet token (Linera testnet)
- [ ] Kirim transaksi / send token antar wallet

### Fase 3: UX/UI Improvement
- [ ] Tambah notifikasi sukses/gagal
- [ ] Loading state pada aksi async
- [ ] Desain UI lebih menarik dan responsif

### Fase 4: Keamanan & Backup
- [ ] Fitur backup manual & restore wallet
- [ ] Enkripsi localStorage wallet dengan password

### Fase 5: Deployment & Testing
- [ ] Deploy ke Vercel / platform hosting
- [ ] Automated tests & linting setup

---

## 💻 Cara Pakai
1. Clone repo:  
   ```bash
   git clone https://github.com/Beny25/chainritual_miniapp.git

2. Masuk folder project:

cd chainritual_miniapp


3. Install dependencies:

npm install


4. Jalankan aplikasi:

npm run dev


5. Buka browser di http://localhost:3000 dan coba fitur wallet!




---

📣 Author

Bandit.base eth
Twitter: @Alidepok1


---

📝 Catatan

Miniapp ini untuk edukasi dan testing Linera blockchain. Private key sepenuhnya disimpan di sisi user, tidak dikirim ke server. Gunakan dengan aman, jangan pakai untuk aset nyata tanpa proteksi tambahan.


---

🔗 Link Repo

https://github.com/Beny25/chainritual_miniapp
