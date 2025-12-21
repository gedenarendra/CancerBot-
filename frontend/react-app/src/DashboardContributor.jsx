import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
const API_DB = import.meta.env.VITE_API_DB;

function DashboardContributor({ userId, handleLogout }) {
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
      fetchMyDocs();
    } catch (err) {
      alert("Gagal upload");
    }
  };

  return (
    <div className="contributor-layout">
      {/* HEADER */}
      <header className="contributor-header">
        <h1>DASHBOARD KONTRIBUTOR</h1>
        <button onClick={handleLogout} className="btn-logout-white">
          Log out
        </button>
      </header>

      <div className="contributor-content">
        {/* CARD 1: UPLOAD JOURNAL */}
        <div className="contributor-card">
          <h3 className="card-heading">Upload Journal</h3>
          <form onSubmit={handleUpload} className="upload-form-wrapper">
            {/* Input Judul */}
            <div className="input-row">
              <input
                type="text"
                className="contrib-text-input"
                placeholder="Judul"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            {/* Input File */}
            <div className="input-row">
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setFile(e.target.files[0])}
                required
                className="contrib-file-input"
              />
            </div>

            {/* Tombol Upload Biru */}
            <button type="submit" className="btn-upload-blue">
              Upload
            </button>
          </form>
        </div>

        {/* CARD 2: RIWAYAT */}
        <div className="contributor-card">
          <h3 className="card-heading">Riwayat</h3>

          <div className="history-table-wrapper">
            {/* Header Tabel (Abu-abu) */}
            <div className="history-header-row">
              <div className="h-col left">Judul</div>
              <div className="h-col right">Status</div>
            </div>

            {/* Body Tabel */}
            <div className="history-body">
              {myDocs.length === 0 ? (
                <div className="empty-history">Belum ada riwayat upload.</div>
              ) : (
                myDocs.map((doc) => (
                  <div key={doc.id} className="history-row">
                    <div className="h-col left title-text">{doc.title}</div>
                    <div className="h-col right status-wrapper">
                      <span className="status-text">{doc.status}</span>
                      {/* Indikator Bulat Warna (Hijau/Merah/Kuning) */}
                      <span className={`status-dot ${doc.status}`}></span>
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
