import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import pool from "./db.js";

// import Route
import authRoute from "../Route/authRoute.js";
import chatRoute from "../Route/chatRoute.js";
import docRoute from "../Route/docRoute.js";

const app = express();
const PORT = 5040;

app.use(cors());
app.use(express.json());

// Init Database
// const intiDB = async () => {
//   try {
//     await pool.query(`
//             CREATE TABLE IF NOT EXISTS users (
//                 id SERIAL PRIMARY KEY,
//                 username VARCHAR(50) UNIQUE NOT NULL,
//                 password VARCHAR(255) NOT NULL
//             );
//             CREATE TABLE IF NOT EXISTS chats (
//                 id SERIAL PRIMARY KEY,
//                 user_id INTEGER REFERENCES users(id),
//                 role VARCHAR(10) NOT NULL,
//                 message TEXT NOT NULL,
//                 timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//             );
//         `);
//     console.log("✅ Tabel Database Siap!");
//   } catch (err) {
//     console.log("❌ Gagal init DB:", err);
//   }
// };
// intiDB();

app.use(authRoute);
app.use(chatRoute);
app.use(docRoute);

app.listen(PORT, () => {
  console.log(`🚀 Server Auth & DB jalan di http://localhost:${PORT}`);
});
