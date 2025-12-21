import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import {
  uploadDocument,
  getMyDocs,
  getPendingDocs,
  approveDoc,
  rejectDoc,
  getalluser,
  updaterole,
  getAllDocs,
} from "../Controller/docController.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// --- SETUP MULTER (UPLOAD) ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Simpan di folder backend/uploads
    const uploadPath = path.join(__dirname, "../../uploads");

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9) + ".pdf";
    cb(null, unique);
  },
});

const upload = multer({ storage: storage });

// --- DEFINISI ROUTE ---
router.post("/upload", upload.single("file"), uploadDocument);
router.get("/my-documents/:userId", getMyDocs);
router.get("/admin/documents", getPendingDocs);
router.post("/admin/approve", approveDoc);
router.post("/admin/reject", rejectDoc);
router.get("/admin/users", getalluser);
router.put("/admin/users/role", updaterole);
router.get("/admin/all-docs", getAllDocs);

export default router;
