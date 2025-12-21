import "dotenv/config";
import pg from "pg";
const { Pool } = pg;

// Setup Koneksi Neon Postgres
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export default pool;
