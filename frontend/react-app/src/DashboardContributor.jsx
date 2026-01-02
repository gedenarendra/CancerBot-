import { useState, useEffect } from "react";
import axios from "axios";
import "./DashboardContributor.css";
const API_DB = import.meta.env.VITE_API_DB;

function DashboardContributor({ userId, handleLogout }) {
  // --- LOGIC TETAP SAMA (TIDAK BERUBAH) ---
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [myDocs, setMyDocs] = useState([]);

  useEffect(() => {
    fetchMyDocs();
  }, []);

  const fetchMyDocs = async () => {
    try {
      const res = await axios.get(`${API_DB}/my-documents/${userId}`);
      setMyDocs(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !title) return alert("Isi semua data!");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("userId", userId);

    try {
      await axios.post(`${API_DB}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Upload Sukses!");
      setTitle("");
      setFile(null);
      const fileInput = document.getElementById("file-input");
      if (fileInput) fileInput.value = "";
      fetchMyDocs();
    } catch (err) {
      alert("Gagal upload");
    }
  };

  return (
    <div className="page-layout">
      {/* 1. POSISI POJOK KIRI ATAS: LOGO BOX (TEXT DI DALAM) & JUDUL */}
      <div className="header-top-left">
        <div className="logo-box-inner">
          <div className="logo-content-vertical">
            <img
              src="/LogoMedivora.PNG"
              alt="Medivora Logo"
              className="logo-img"
            />
            <div className="brand-text-inside">
              <h2>MEDIVORA</h2>
              <small>KANKER ASISTEN AI</small>
            </div>
          </div>
        </div>
        <h1 className="page-title">DASHBOARD KONTRIBUTOR</h1>
      </div>

      {/* 2. TOMBOL LOGOUT POJOK KANAN ATAS */}
      <button onClick={handleLogout} className="btn-logout-top">
        Log out
      </button>

      {/* 3. PANEL TENGAH (FIXED CENTER) */}
      <div className="content-glass-panel">
        <div className="section-block">
          <h3 className="section-label">Upload Journal</h3>
          <div className="white-box">
            <form onSubmit={handleUpload} className="upload-form">
              <input
                type="text"
                className="std-input"
                placeholder="judul"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              <div className="file-input-box">
                <label htmlFor="file-input" className="btn-file-select">
                  chose file
                </label>
                <span className="file-name-display">
                  {file ? file.name : ""}
                </span>
                <input
                  id="file-input"
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setFile(e.target.files[0])}
                  required
                  hidden
                />
              </div>
              <div className="btn-wrapper">
                <button type="submit" className="btn-submit-pill">
                  upload
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="section-block">
          <h3 className="section-label">Riwayat</h3>
          <div className="white-box no-padding">
            <div className="tbl-head">
              <span>judul</span>
              <span>status</span>
            </div>
            <div className="tbl-body">
              {myDocs.length === 0 ? (
                <div className="empty-row">Belum ada riwayat.</div>
              ) : (
                myDocs.map((doc) => (
                  <div key={doc.id} className="tbl-row">
                    <span className="row-text">{doc.title}</span>
                    <div className="row-status">
                      <span>{doc.status}</span>
                      <span className={`dot ${doc.status}`}></span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardContributor;
