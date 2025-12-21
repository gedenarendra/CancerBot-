<div align="center">

# 🩺 Medivora (CancerBot)

**Your AI Bestie for Oncology Info. No Halu, Just Facts. 💅✨**

![Python](https://img.shields.io/badge/Python-3.10%2B-blue?style=for-the-badge&logo=python)
![FastAPI](https://img.shields.io/badge/FastAPI-⚡-009688?style=for-the-badge&logo=fastapi)
![React](https://img.shields.io/badge/Frontend-React-61DAFB?style=for-the-badge&logo=react)
![Groq](https://img.shields.io/badge/AI-Llama%203-orange?style=for-the-badge)

  <p>
    <a href="#-the-tea-apa-ini">The Tea</a> •
    <a href="#-tech-stack-drip">Tech Stack</a> •
    <a href="#-cara-start-gaskeun">Cara Start</a> •
    <a href="#-env-secrets">Rahasia Dapur (.env)</a>
  </p>

</div>

---

## ☕ The Tea (Apa Ini?)

Jujurly, ini bukan chatbot biasa. **Medivora** adalah asisten medis spesialis kanker yang dibangun pake teknologi **RAG (Retrieval Augmented Generation)**.

Kenapa _slay_?

1.  **Anti-Halu**: Dia cuma jawab berdasarkan Jurnal PDF yang udah di-upload Admin. Kalau gak ada di data, dia bakal bilang jujur (gak ngarang bebas kek mantan lu 💀).
2.  **Visionary**: Bisa baca gambar medis (X-Ray/CT Scan) dan kasih analisis awal. _Crazy right?_
3.  **Sat Set**: Pake **Groq LPU**, jadi responnya secepat kilat. ⚡

---

## 💧 Tech Stack (The Drip)

Kita bangun ini pake _tools_ yang lagi _hype_ dan _gacor_:

- **Brain**: 🧠 LangChain + Groq (Llama 3.3 & Llama 3.2 Vision).
- **Backend**: ⚡ FastAPI (Python) - *Fast as f*ck boi.\*
- **Frontend**: ⚛️ React + Vite (Modern vibes).
- **Memory**: 🐘 PostgreSQL (Neon/Supabase) buat nyimpen sesi chat.
- **Knowledge**: 📚 ChromaDB (Vector Database buat nyimpen ingatan jurnal).

---

## 🚀 Cara Start (Gaskeun)

Pastikan di laptop lu udah ada **Python**, **Node.js**, dan **PostgreSQL**. Kalau udah, _lessgo_!

### 1. Clone Dulu Ngab

```bash
git clone [https://github.com/username-lu/CancerBot.git](https://github.com/username-lu/CancerBot.git)
cd CancerBot
```
