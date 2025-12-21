// const { error } = require("console");
import pool from "../web/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = "rahasia_negara_cancerbot_123";

// REGISTER
export const register = async (req, res) => {
  const { username, password, role } = req.body;

  try {
    const userRole = role || "user";
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING id",
      [username, hashedPassword, userRole]
    );
    res.json({ message: "User Berhasil dibuat", userId: result.rows[0].id });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Username mungkin sudah terpakai atau Error Server" });
  }
};

// LOGIN
export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query("SELECT * from users WHERE username = $1", [
      username,
    ]);

    if (result.rows.length === 0)
      return res.status(400).json({ error: "User tidak ditemukan" });

    const user = result.rows[0];

    // Cek Password
    const validPass = await bcrypt.compare(password, user.password);

    if (!validPass) return res.status(400).json({ error: "Password Salah" });

    // Buat token JWT
    const token = jwt.sign(
      { userId: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: "24hr" }
    );

    // 🔥 PERBAIKAN DI SINI 🔥
    // Kita WAJIB mengirim userId agar Frontend bisa menyimpannya
    res.json({
      message: "Login Berhasil",
      token,
      userId: user.id,
      username: user.username,
      role: user.role,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
