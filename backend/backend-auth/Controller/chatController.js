// import pool from "../web/db.js"; // Pastikan path ini benar sesuai struktur foldermu

// // SIMPAN CHAT
// export const saveHistory = async (req, res) => {
//   const { userId, role, message } = req.body;

//   if (!userId || !role || !message) {
//     return res.status(400).json({ error: "Data tidak lengkap" });
//   }

//   try {
//     await pool.query(
//       "INSERT INTO chats (user_id, role, message) VALUES ($1, $2, $3)",
//       [userId, role, message]
//     );
//     res.json({ status: "Saved" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: err.message });
//   }
// };

// // AMBIL HISTORY CHAT
// export const getHistory = async (req, res) => {
//   try {
//     const { userId } = req.params;

//     const result = await pool.query(
//       "SELECT role, message as text, timestamp FROM chats WHERE user_id = $1 ORDER BY timestamp ASC",
//       [userId]
//     );

//     res.json(result.rows);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: err.message });
//   }
// };

// // delete history
// export const deleteHistory = async (req, res) => {
//   const { id } = req.params;
//   try {
//     await pool.query("DELETE FROM chats WHERE id = $1", [id]);
//     res.json({ message: "Pesan dihapus permanen" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // Buat Sesi Baru (Saat user klik New Chat atau kirim pesan pertama)
// export const createSession = async (req, res) => {
//   const { userId, title } = req.body;
//   try {
//     const result = await pool.query(
//       "INSERT INTO chat_sessions (user_id, title) VALUES ($1, $2) RETURNING id, title, created_at",
//       [userId, title || "Percakapan Baru"]
//     );
//     res.json(result.rows[0]);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: err.message });
//   }
// };

import pool from "../web/db.js";

// ==========================================
// 1. KELOLA SESI (SIDEBAR KIRI)
// ==========================================

// Buat Sesi Baru
export const createSession = async (req, res) => {
  const { userId, title } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO chat_sessions (user_id, title) VALUES ($1, $2) RETURNING id, title, created_at",
      [userId, title || "Percakapan Baru"]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error createSession:", err);
    res.status(500).json({ error: err.message });
  }
};

// Ambil Daftar Sesi
export const getSessions = async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM chat_sessions WHERE user_id = $1 ORDER BY created_at DESC",
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error getSessions:", err);
    res.status(500).json({ error: err.message });
  }
};

// Hapus Sesi
export const deleteSession = async (req, res) => {
  const { sessionId } = req.params;
  try {
    await pool.query("DELETE FROM chat_sessions WHERE id = $1", [sessionId]);
    res.json({ message: "Sesi percakapan dihapus" });
  } catch (err) {
    console.error("Error deleteSession:", err);
    res.status(500).json({ error: err.message });
  }
};

// ==========================================
// 2. KELOLA PESAN (CHAT AREA KANAN)
// ==========================================

// Simpan Chat
export const saveHistory = async (req, res) => {
  const { userId, role, message, sessionId } = req.body;

  if (!userId || !role || !message) {
    return res.status(400).json({ error: "Data tidak lengkap" });
  }

  try {
    // 🔥 PERBAIKAN: Menggunakan kolom 'message' bukan 'text'
    await pool.query(
      "INSERT INTO chats (user_id, role, message, session_id) VALUES ($1, $2, $3, $4)",
      [userId, role, message, sessionId]
    );
    res.json({ status: "Saved" });
  } catch (err) {
    console.error("Error saveHistory:", err);
    res.status(500).json({ error: err.message });
  }
};

// Ambil Pesan per Sesi
export const getMessagesBySession = async (req, res) => {
  const { sessionId } = req.params;
  try {
    // 🔥 PERBAIKAN:
    // 1. Select kolom 'message' dari database.
    // 2. Pakai 'AS text' supaya Frontend (App.jsx) tetap bisa membacanya sebagai 'text' tanpa ubah kodingan frontend.
    const result = await pool.query(
      "SELECT id, role, message as text, timestamp, session_id FROM chats WHERE session_id = $1 ORDER BY timestamp ASC",
      [sessionId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error getMessagesBySession:", err);
    res.status(500).json({ error: err.message });
  }
};

// Hapus Satu Pesan
export const deleteHistory = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM chats WHERE id = $1", [id]);
    res.json({ message: "Pesan dihapus permanen" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
