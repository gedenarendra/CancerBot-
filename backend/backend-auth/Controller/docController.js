// docController.js
import pool from "../web/db.js";
import axios from "axios";

// 1. Upload Document (user & admin)
export const uploadDocument = async (req, res) => {
  const { title, userId } = req.body;
  const file = req.file;

  if (!file) return res.status(400).json({ error: "File PDF wajib" });

  try {
    // 1. CEK ROLE PENGUPLOAD
    const userCheck = await pool.query("SELECT role FROM users WHERE id = $1", [
      userId,
    ]);
    const userRole =
      userCheck.rows.length > 0 ? userCheck.rows[0].role : "user";

    // 2. TENTUKAN STATUS OTOMATIS
    const initialStatus = userRole === "admin" ? "approved" : "pending";

    // 3. SIMPAN KE DATABASE (Awalnya extracted_text kosong dulu)
    const result = await pool.query(
      "INSERT INTO documents (title, filename, filepath, uploaded_by, status) VALUES ($1, $2, $3, $4, $5) RETURNING id",
      [title, file.filename, file.path, userId, initialStatus]
    );

    const newDocId = result.rows[0].id;

    // 🔥 TAMBAHAN LOGIC: JIKA ADMIN, LANGSUNG LATIH AI & SIMPAN TEXT 🔥
    let aiMessage = "";

    if (userRole === "admin") {
      try {
        // Panggil Server Python
        const pyRes = await axios.post("http://localhost:8000/ingest", {
          filepath: file.path,
        });

        // 🔥 TANGKAP TEXT DARI PYTHON (ingest.py yang baru)
        const textFromAI = pyRes.data.extracted_text || "";

        // 🔥 UPDATE DATABASE DENGAN TEXT TERSEBUT
        await pool.query(
          "UPDATE documents SET extracted_text = $1 WHERE id = $2",
          [textFromAI, newDocId]
        );

        aiMessage = " & AI berhasil dilatih + Teks disimpan!";
      } catch (pyErr) {
        console.error("Auto-ingest Error:", pyErr.message);
        aiMessage = " (Tapi AI gagal dilatih, cek server python).";
      }
    }

    // 4. KIRIM RESPON
    res.json({
      message:
        userRole === "admin"
          ? "Upload Admin: Auto Approved" + aiMessage
          : "Upload berhasil! Menunggu Admin.",
      id: newDocId,
      status: initialStatus,
      role: userRole,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// 2. Get My Docs (Contributor, admin)
export const getMyDocs = async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await pool.query(
      "SELECT * FROM documents WHERE uploaded_by = $1 ORDER BY created_at DESC",
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 3. Get Pending Docs (Admin)
export const getPendingDocs = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM documents WHERE status = 'pending' ORDER BY created_at ASC"
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 4. Approve Doc (Admin) -> Trigger Python AI
export const approveDoc = async (req, res) => {
  const { docId } = req.body;
  try {
    const docRes = await pool.query("SELECT * FROM documents WHERE id = $1", [
      docId,
    ]);
    if (docRes.rows.length === 0)
      return res.status(404).json({ error: "Dokumen hilang" });
    const doc = docRes.rows[0];

    try {
      // Panggil Python
      const pyRes = await axios.post("http://localhost:8000/ingest", {
        filepath: doc.filepath,
      });

      // 🔥 LOGIC BARU: SIMPAN TEXT SAAT APPROVE 🔥
      const textFromAI = pyRes.data.extracted_text || "";

      // Update Status JADI 'approved' DAN Simpan Teksnya
      await pool.query(
        "UPDATE documents SET status = 'approved', extracted_text = $1 WHERE id = $2",
        [textFromAI, docId]
      );

      res.json({ message: "Dokumen disetujui, AI dilatih & Teks disimpan!" });
    } catch (pyErr) {
      console.error("Python Error:", pyErr.message);
      return res
        .status(500)
        .json({ error: "Gagal menyuruh AI belajar. Cek Server Python." });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 5. Reject Doc (Admin)
export const rejectDoc = async (req, res) => {
  const { docId } = req.body;
  try {
    await pool.query("UPDATE documents SET status = 'rejected' WHERE id = $1", [
      docId,
    ]);
    res.json({ message: "Dokumen ditolak." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ambil seluruh data user yang terdaftar
export const getalluser = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, username, role FROM users ORDER BY id ASC"
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updaterole = async (req, res) => {
  const { userId, newRole } = req.body;
  // validasi input
  if (!["user", "contributor", "admin"].includes(newRole)) {
    return res.status(400).json({ error: "Role tidak valid!" });
  }
  try {
    await pool.query("UPDATE users SET role = $1 WHERE id = $2", [
      newRole,
      userId,
    ]);
    res.json({
      message: `Sukses! User #${userId} sekarang menjadi ${newRole}.`,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 6. Get All Docs (Admin Global History)
export const getAllDocs = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM documents ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
