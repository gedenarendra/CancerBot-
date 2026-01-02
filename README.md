<div align="center">

# 🩺 Medivora (CancerBot)

**Your AI Bestie for Oncology Info. No Halu, Just Facts. 💅✨**

![Python](https://img.shields.io/badge/Python-3.10%2B-blue?style=for-the-badge&logo=python)
![NodeJS](https://img.shields.io/badge/Node.js-Express-green?style=for-the-badge&logo=nodedotjs)
![FastAPI](https://img.shields.io/badge/FastAPI-⚡-009688?style=for-the-badge&logo=fastapi)
![React](https://img.shields.io/badge/Frontend-React%20Vite-61DAFB?style=for-the-badge&logo=react)
![Groq](https://img.shields.io/badge/AI-Llama%203-orange?style=for-the-badge)

<p>
    <a href="#-the-tea-apa-ini">The Tea</a> •
    <a href="#-tech-stack-drip">Tech Stack</a> •
    <a href="#-struktur-proyek">Struktur</a> •
    <a href="#-cara-start-gaskeun">Cara Start</a> •
    <a href="#-env-secrets">Rahasia Dapur</a>
</p>

</div>

---

## ☕ The Tea (Apa Ini?)

Jujurly, ini bukan chatbot biasa. **Medivora** adalah asisten medis spesialis kanker yang dibangun pake teknologi **RAG (Retrieval Augmented Generation)**.

Kenapa _slay_?

1.  **Anti-Halu**: Dia cuma jawab berdasarkan Jurnal PDF yang udah di-upload Admin ke sistem. Kalau gak ada di data, dia bakal bilang jujur (gak ngarang bebas kek mantan lu 💀).
2.  **Visionary**: Bisa baca gambar medis (X-Ray/CT Scan) dan kasih analisis awal. _Crazy right?_
3.  **Role-Based**: Ada dashboard khusus buat **Admin** (upload jurnal) dan **Contributor** (dokter/ahli).
4.  **Sat Set**: Pake **Groq LPU**, jadi responnya secepat kilat. ⚡

---

## 💧 Tech Stack (The Drip)

Kita bangun ini pake _tools_ yang lagi _hype_ dan _gacor_. Sistemnya terbagi jadi 3 bagian utama (Microservices architecture, _fancy_ kan?):

-   **Frontend**: ⚛️ React + Vite (Pake 3D assets & Glassmorphism UI).
-   **Backend AI**: 🧠 Python + FastAPI + LangChain (Otaknya Medivora).
-   **Backend Auth**: 🛡️ Node.js + Express (Buat login, register, & simpan history chat).
-   **Database**: 🐘 PostgreSQL (User data) & ChromaDB (Vector store buat ingatan jurnal).

---

## 📂 Struktur Proyek

Biar gak bingung pas ngoding, pahami dulu map-nya ngab:

```text
CancerBot/
├── backend/
│   ├── ai/               # 🧠 The BRAIN (Python, LangChain, Groq)
│   ├── backend-auth/     # 🛡️ The BODY (Node.js, Express, Auth Controller)
│   └── uploads/          # 📄 Tempat nyimpen PDF jurnal kanker
├── frontend/
│   └── react-app/        # 💅 The FACE (React, Vite, UI Components)
└── README.md
Mohon maaf, ini adalah **satu blok kode utuh** yang berisi seluruh konten `README.md` dari awal sampai akhir.

Kamu bisa langsung klik tombol **Copy** di pojok kanan atas kotak kode ini dan paste ke file `README.md` kamu.

## 🚀 Cara Start (Gaskeun)

Project ini butuh **3 Terminal** yang jalan barengan. Jangan panik, ikuti langkah ini pelan-pelan.

### 1. Setup Backend Auth (Node.js) 🛡️

Ini buat urusan login dan database user.

```bash
cd backend/backend-auth
npm install
# Pastikan PostgreSQL udah nyala ya!
node web/server.js

```

### 2. Setup Backend AI (Python) 🧠

Ini buat jalanin otak AI-nya. Buka terminal baru:

```bash
cd backend/ai
# Bikin venv dulu biar rapi (opsional tapi recommended)
python -m venv venv
# Windows: venv\Scripts\activate | Mac/Linux: source venv/bin/activate

# Install bumbu-bumbu kehidupan
pip install -r requirements.txt

# Jalanin mesinnya
python main.py

```

### 3. Setup Frontend (React) 💅

Terakhir, nyalain UI-nya. Buka terminal ketiga:

```bash
cd frontend/react-app
npm install
npm run dev

```

Kalo udah jalan semua, buka browser di `http://localhost:5173` (atau port yang muncul di terminal). *Boom!* 💥

---

## 🤫 Rahasia Dapur (.env)

Jangan lupa bikin file `.env` di folder masing-masing ya, kalau gak programnya bakal *tantrum*.

**Di `backend/ai/.env`:**

```env
GROQ_API_KEY=gsk_... (Minta API Key di console.groq.com)
CHROMA_DB_PATH=./chroma_db

```

**Di `backend/backend-auth/.env`:**

```env
PORT=3000
DATABASE_URL=...............................
JWT_SECRET=...........................

```

---

## 🤝 Contributing

Mau ikut ngebantu? Boleh banget!
Pull Request *open* buat siapa aja yang mau bikin kode ini makin *clean* dan *performant*.

**Note:** File PDF jurnal disimpan di `backend/uploads`. Jangan hapus sembarangan kalau gamau dimarahin dokter.

<div align="center">

Made with 💖 & ☕ by [Narendra]

</div>

```

```
