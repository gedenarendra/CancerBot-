// import { useState, useEffect } from "react";
// import axios from "axios";
// import "./App.css";
// const API_DB = import.meta.env.VITE_API_DB;

// function DashboardAdmin({ handleLogout }) {
//   const [documents, setDocuments] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [activeTab, setActiveTab] = useState("documents");
//   const [uploadTitle, setUploadTitle] = useState("");
//   const [uploadFile, setUploadFile] = useState(null);
//   const [uploadLoading, setUploadLoading] = useState(false);
//   const [historyDocs, setHistoryDocs] = useState([]);

//   useEffect(() => {
//     fetchPendingDocs();
//     fetchUsers();
//     fetchHistory();
//   }, []);

//   const fetchPendingDocs = async () => {
//     try {
//       const res = await axios.get(`${API_DB}/admin/documents`);
//       setDocuments(res.data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const fetchHistory = async () => {
//     try {
//       const myId = localStorage.getItem("userId");

//       if (myId) {
//         const res = await axios.get(`${API_DB}/my-documents/${myId}`);
//         setHistoryDocs(res.data);
//       }
//     } catch (err) {
//       console.error("Gagal ambil history:", err);
//     }
//   };

//   const handleAction = async (docId, action) => {
//     if (!confirm(action === "approve" ? "Setujui & Latih AI?" : "Tolak?"))
//       return;
//     try {
//       await axios.post(`${API_DB}/admin/${action}`, { docId });
//       alert(`Sukses ${action}`);
//       fetchPendingDocs();
//     } catch (err) {
//       alert("Gagal: " + err.response?.data?.error);
//     }
//   };

//   const fetchUsers = async () => {
//     try {
//       const res = await axios.get(`${API_DB}/admin/users`);
//       setUsers(res.data);
//     } catch (err) {
//       console.error("Gagal ambil user:", err);
//     }
//   };

//   const handleChangeRole = async (userId, newRole) => {
//     if (!confirm(`Yakin ingin mengubah role user ini menjadi ${newRole}?`))
//       return;
//     try {
//       await axios.put(`${API_DB}/admin/users/role`, { userId, newRole });
//       alert("Role berhasil diubah!");
//       fetchUsers();
//     } catch (err) {
//       alert("Gagal update role " + err.response?.data?.error);
//     }
//   };

//   const handleAdminUpload = async (e) => {
//     e.preventDefault();
//     if (!uploadTitle || !uploadFile) {
//       alert("Mohon lengkapi judul dan file.");
//       return;
//     }

//     setUploadLoading(true);
//     const formData = new FormData();
//     formData.append("title", uploadTitle);
//     formData.append("file", uploadFile);

//     // Ambil User ID
//     const userId = localStorage.getItem("userId");
//     if (userId) formData.append("userId", userId);

//     try {
//       // 1. PROSES UPLOAD (Status Awal: Pending)
//       const uploadRes = await axios.post(`${API_DB}/upload`, formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       // Ambil ID dokumen yang baru saja dibuat dari response backend
//       // (Pastikan backend Anda mengembalikan JSON { id: ... } saat upload sukses)
//       const newDocId = uploadRes.data.id || uploadRes.data.docId;

//       if (newDocId) {
//         // 2. 🔥 BYPASS LOGIC: LANGSUNG AUTO-APPROVE & LATIH AI
//         // Kita panggil endpoint approve secara otomatis tanpa klik tombol centang
//         await axios.post(`${API_DB}/admin/approve`, { docId: newDocId });

//         alert(
//           "Journal berhasil diupload dan LANGSUNG DIPELAJARI AI (Auto-Approve)! 🚀"
//         );
//       } else {
//         // Fallback jika backend tidak mengembalikan ID
//         alert(
//           "Journal diupload (Status Pending). Silakan approve manual di tab Verifikasi."
//         );
//       }

//       // Reset Form
//       setUploadTitle("");
//       setUploadFile(null);
//       const fileInput = document.getElementById("file-upload-input");
//       if (fileInput) fileInput.value = "";

//       fetchPendingDocs();
//       fetchHistory();
//     } catch (err) {
//       console.error(err);
//       alert(
//         "Gagal proses upload & ingest: " +
//           (err.response?.data?.error || err.message)
//       );
//     }
//     setUploadLoading(false);
//   };

//   const showExtractedText = (text) => {
//     if (!text) {
//       alert(
//         "⚠️ Belum ada teks yang diekstrak AI.\n(Mungkin file belum selesai diproses atau PDF berupa gambar scan)."
//       );
//     } else {
//       // Kita potong 1000 karakter pertama saja biar alert tidak kepenuhan
//       alert(
//         "📝 TEKS YANG DIBACA AI (Preview):\n\n" +
//           text.substring(0, 1000) +
//           "...\n\n(Teks selebihnya tersimpan aman di database)"
//       );
//     }
//   };

//   return (
//     <div className="admin-layout">
//       {/* HEADER */}
//       <header className="admin-header-bar">
//         <h1>DASHBOARD ADMIN</h1>
//         <button onClick={handleLogout} className="btn-logout-white">
//           Log out
//         </button>
//       </header>

//       {/* NAVIGASI TAB (MENU BAR) */}
//       <div className="admin-nav-cards">
//         {/* Tab 1: Menunggu Persetujuan */}
//         <div
//           className={`nav-card ${activeTab === "documents" ? "active" : ""}`}
//           onClick={() => setActiveTab("documents")}
//         >
//           <span>Menunggu Persetujuan</span>
//         </div>

//         {/* Tab 2: Manajemen Role */}
//         <div
//           className={`nav-card ${activeTab === "users" ? "active" : ""}`}
//           onClick={() => setActiveTab("users")}
//         >
//           <span>
//             Manajemen Role
//             <br />
//             Pengguna
//           </span>
//         </div>

//         {/* Tab 3: Upload Journal (BARU) */}
//         <div
//           className={`nav-card ${activeTab === "upload" ? "active" : ""}`}
//           onClick={() => setActiveTab("upload")}
//         >
//           <span>
//             Upload
//             <br />
//             Journal
//           </span>
//         </div>
//       </div>

//       {/* CONTENT AREA (BERUBAH SESUAI TAB) */}
//       <div className="admin-content-wrapper">
//         {/* KONTEN 1: VERIFIKASI JOURNAL */}
//         {activeTab === "documents" && (
//           <div className="content-card fade-in">
//             <h3 className="card-title">tahap verifikasi journal</h3>

//             <div className="table-header-row">
//               <div className="th-col">Judul</div>
//               <div className="th-col">File</div>
//               <div className="th-col center">Verifikasi</div>
//             </div>

//             <div className="table-body">
//               {documents.filter((doc) => doc.status === "pending").length ===
//               0 ? (
//                 <div className="empty-row">Tidak ada dokumen pending.</div>
//               ) : (
//                 documents
//                   .filter((doc) => doc.status === "pending")
//                   .map((doc) => (
//                     <div className="table-row" key={doc.id}>
//                       <div className="td-col title-col">{doc.title}</div>
//                       <div className="td-col file-col">{doc.filename}</div>
//                       <div className="td-col action-col center">
//                         <button
//                           className="btn-icon check"
//                           onClick={() => handleAction(doc.id, "approve")}
//                           title="Setujui"
//                         >
//                           <svg
//                             viewBox="0 0 24 24"
//                             fill="none"
//                             stroke="currentColor"
//                             strokeWidth="2"
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                           >
//                             <polyline points="20 6 9 17 4 12"></polyline>
//                           </svg>
//                         </button>
//                         <button
//                           className="btn-icon cross"
//                           onClick={() => handleAction(doc.id, "reject")}
//                           title="Tolak"
//                         >
//                           <svg
//                             viewBox="0 0 24 24"
//                             fill="none"
//                             stroke="currentColor"
//                             strokeWidth="2"
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                           >
//                             <line x1="18" y1="6" x2="6" y2="18"></line>
//                             <line x1="6" y1="6" x2="18" y2="18"></line>
//                           </svg>
//                         </button>
//                       </div>
//                     </div>
//                   ))
//               )}
//             </div>
//           </div>
//         )}

//         {/* KONTEN 2: MANAJEMEN ROLE */}
//         {activeTab === "users" && (
//           <div className="content-card fade-in">
//             <h3 className="card-title">Manajemen Role Pengguna</h3>

//             <div className="table-header-row">
//               <div className="th-col small">Id</div>
//               <div className="th-col">Username</div>
//               <div className="th-col center">Role Now</div>
//               <div className="th-col center">Edit Role</div>
//             </div>

//             <div className="table-body">
//               {users.map((user) => (
//                 <div className="table-row role-row" key={user.id}>
//                   <div className="td-col small">#{user.id}</div>
//                   <div className="td-col username-text">{user.username}</div>

//                   <div className="td-col center">
//                     <span className={`role-badge ${user.role}`}>
//                       {user.role}
//                     </span>
//                   </div>

//                   <div className="td-col center">
//                     <div className="select-wrapper">
//                       <select
//                         value={user.role}
//                         onChange={(e) =>
//                           handleChangeRole(user.id, e.target.value)
//                         }
//                         className="role-select"
//                       >
//                         <option value="user">user</option>
//                         <option value="contributor">contributor</option>
//                         <option value="admin">admin</option>
//                       </select>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* KONTEN 3: UPLOAD JOURNAL (BARU) */}
//         {activeTab === "upload" && (
//           <div className="upload-layout fade-in">
//             {/* Form Upload */}
//             <div className="upload-form-card">
//               <h3 className="card-title">upload journal</h3>

//               <div className="form-group" style={{ marginBottom: "20px" }}>
//                 <input
//                   type="text"
//                   className="custom-input"
//                   placeholder="judul"
//                   value={uploadTitle}
//                   onChange={(e) => setUploadTitle(e.target.value)}
//                 />
//               </div>

//               <div className="form-group file-input-group">
//                 <label htmlFor="file-upload-input" className="file-label-btn">
//                   chose file
//                 </label>
//                 <span className="file-name-display">
//                   {uploadFile ? uploadFile.name : "no file chosen"}
//                 </span>
//                 <input
//                   id="file-upload-input"
//                   type="file"
//                   className="hidden-file-input"
//                   onChange={(e) => setUploadFile(e.target.files[0])}
//                   accept=".pdf,.doc,.docx"
//                 />
//               </div>

//               <div className="upload-btn-wrapper">
//                 <button
//                   className="btn-upload-blue"
//                   onClick={handleAdminUpload}
//                   disabled={uploadLoading}
//                 >
//                   {uploadLoading ? "uploading..." : "upload"}
//                 </button>
//               </div>
//             </div>

//             {/* List Riwayat */}
//             <div className="history-card">
//               <h3 className="card-title">riwayat</h3>

//               <div className="history-header">
//                 <span>judul</span>
//                 <span>status</span>
//               </div>

//               <div className="history-list">
//                 {historyDocs.length === 0 ? (
//                   <div className="empty-row">Belum ada riwayat.</div>
//                 ) : (
//                   historyDocs.map((doc) => (
//                     <div className="history-item" key={doc.id}>
//                       <div className="history-title">{doc.title}</div>
//                       <div className="history-status">
//                         {doc.status}
//                         {/* Indikator Warna Status */}
//                         <span
//                           className={`status-dot ${
//                             doc.status === "approved"
//                               ? "approved"
//                               : doc.status === "rejected"
//                               ? "rejected"
//                               : "pending"
//                           }`}
//                         ></span>
//                       </div>
//                       {/* <div className="history-action">
//                         <button
//                           className="btn-view-text"
//                           onClick={() => showExtractedText(doc.extracted_text)}
//                           title="Lihat teks yang dibaca AI"
//                         >
//                           👁️
//                         </button>
//                       </div> */}
//                     </div>
//                   ))
//                 )}
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default DashboardAdmin;

import { useState, useEffect } from "react";
import axios from "axios";
import "./DashboardAdmin.css";
const API_DB = import.meta.env.VITE_API_DB;

// Import assets
import logo from "../public/LogoMedivora.PNG";

function DashboardAdmin({ handleLogout }) {
  // --- STATE DATA ---
  const [documents, setDocuments] = useState([]); // Menampung data global dari /admin/all-docs
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [historyDocs, setHistoryDocs] = useState([]); // Riwayat khusus admin yang sedang login

  // --- STATE STATISTIK ---
  const [stats, setStats] = useState({
    totalRoles: 0,
    totalJournals: 0,
    waitingAccept: 0,
  });

  useEffect(() => {
    fetchAllDocuments(); // Mengambil data dari endpoint baru /admin/all-docs
    fetchUsers();
    fetchHistory();
  }, []);

  // --- LOGIC STATISTIK: DIHITUNG DARI DATA GLOBAL (documents) ---
  useEffect(() => {
    const roleCount = users.length;

    // Menghitung seluruh journal yang statusnya 'approved' di sistem
    const approvedJournals = documents.filter(
      (doc) => doc.status && doc.status.toLowerCase() === "approved"
    ).length;

    // Menghitung seluruh yang statusnya 'pending' di sistem
    const pendingCount = documents.filter(
      (doc) => doc.status && doc.status.toLowerCase() === "pending"
    ).length;

    setStats({
      totalRoles: roleCount,
      totalJournals: approvedJournals,
      waitingAccept: pendingCount,
    });
  }, [users, documents]);

  // --- LOGIC API ---

  // Mengambil SEMUA dokumen di sistem (Global History)
  const fetchAllDocuments = async () => {
    try {
      // Menggunakan route baru yang Anda buat di backend
      const res = await axios.get(`${API_DB}/admin/all-docs`);
      console.log("Data Dokumen Sistem:", res.data);
      setDocuments(res.data);
    } catch (err) {
      console.error("Gagal ambil seluruh dokumen:", err);
    }
  };

  const fetchHistory = async () => {
    try {
      const myId = localStorage.getItem("userId");
      if (myId) {
        const res = await axios.get(`${API_DB}/my-documents/${myId}`);
        setHistoryDocs(res.data);
      }
    } catch (err) {
      console.error("Gagal ambil history pribadi:", err);
    }
  };

  const handleAction = async (docId, action) => {
    if (!confirm(action === "approve" ? "Setujui & Latih AI?" : "Tolak?"))
      return;
    try {
      await axios.post(`${API_DB}/admin/${action}`, { docId });
      alert(`Sukses ${action}`);
      fetchAllDocuments(); // Refresh data global
    } catch (err) {
      alert("Gagal: " + err.response?.data?.error);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_DB}/admin/users`);
      setUsers(res.data);
    } catch (err) {
      console.error("Gagal ambil user:", err);
    }
  };

  const handleChangeRole = async (userId, newRole) => {
    if (!confirm(`Yakin ingin mengubah role user ini menjadi ${newRole}?`))
      return;
    try {
      await axios.put(`${API_DB}/admin/users/role`, { userId, newRole });
      alert("Role berhasil diubah!");
      fetchUsers();
    } catch (err) {
      alert("Gagal update role " + err.response?.data?.error);
    }
  };

  const handleAdminUpload = async (e) => {
    e.preventDefault();
    if (!uploadTitle || !uploadFile) {
      alert("Mohon lengkapi judul dan file.");
      return;
    }

    setUploadLoading(true);
    const formData = new FormData();
    formData.append("title", uploadTitle);
    formData.append("file", uploadFile);

    const userId = localStorage.getItem("userId");
    if (userId) formData.append("userId", userId);

    try {
      const uploadRes = await axios.post(`${API_DB}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const newDocId = uploadRes.data.id || uploadRes.data.docId;

      if (newDocId) {
        await axios.post(`${API_DB}/admin/approve`, { docId: newDocId });
        alert("Journal berhasil diupload dan LANGSUNG DIPELAJARI AI! 🚀");
      }

      setUploadTitle("");
      setUploadFile(null);
      fetchAllDocuments(); // Refresh statistik global
      fetchHistory(); // Refresh history pribadi admin
    } catch (err) {
      console.error(err);
      alert(
        "Gagal proses upload: " + (err.response?.data?.error || err.message)
      );
    }
    setUploadLoading(false);
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo-area">
            <div className="logo-icon-img">
              <img src={logo} alt="Medivora Logo" />
            </div>
            <div className="logo-text">
              <h2>MEDIVORA</h2>
              <small>KANKER ASISTEN AI</small>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button
            className={`nav-btn ${activeTab === "dashboard" ? "active" : ""}`}
            onClick={() => setActiveTab("dashboard")}
          >
            Dashboard
          </button>
          <button
            className={`nav-btn ${activeTab === "documents" ? "active" : ""}`}
            onClick={() => setActiveTab("documents")}
          >
            Menunggu Persetujuan
          </button>
          <button
            className={`nav-btn ${activeTab === "users" ? "active" : ""}`}
            onClick={() => setActiveTab("users")}
          >
            Manajemen Role Pengguna
          </button>
          <button
            className={`nav-btn ${activeTab === "upload" ? "active" : ""}`}
            onClick={() => setActiveTab("upload")}
          >
            Upload Journal
          </button>
        </nav>
      </aside>

      <main className="main-content">
        <header className="top-bar">
          <h1 className="page-title">DASHBOARD ADMIN</h1>
          <button onClick={handleLogout} className="btn-logout">
            Log out
          </button>
        </header>

        <div className="content-area">
          {activeTab === "dashboard" && (
            <div className="dashboard-grid fade-in">
              <div className="banner-card">
                <img
                  src="https://images.unsplash.com/photo-1548839140-29a749e1cf4d?auto=format&fit=crop&w=800&q=80"
                  alt="Banner"
                  className="banner-img"
                />
                <div className="banner-overlay">
                  <h2>Hidrasi Tepat</h2>
                  <div className="time-badge">
                    05.00 <small>Bangun tidur</small>
                  </div>
                  <div className="time-badge">
                    10.00 <small>Kerja mulai sibuk</small>
                  </div>
                  <div className="time-badge">
                    14.00 <small>Jaga fokus</small>
                  </div>
                </div>
              </div>

              <div className="stats-column">
                <div className="stat-card green-card">
                  <div className="stat-header">
                    <span>👥</span>
                    <h3>Role</h3>
                  </div>
                  <div className="stat-number">{stats.totalRoles}+</div>
                  <button
                    className="stat-btn"
                    onClick={() => setActiveTab("users")}
                  >
                    lihat manajemen role
                  </button>
                </div>
                <div className="stat-card green-card">
                  <div className="stat-header">
                    <span>📖</span>
                    <h3>Total Journal</h3>
                  </div>
                  <div className="stat-number">{stats.totalJournals}+</div>
                  <button
                    className="stat-btn"
                    onClick={() => setActiveTab("upload")}
                  >
                    Lihat seluruh jurnal
                  </button>
                </div>
                <div className="stat-card image-bg-card">
                  <div className="bg-overlay"></div>
                  <div className="card-content-overlay">
                    <div className="stat-header">
                      <span>🕒</span>
                      <h3>Waiting Accept</h3>
                    </div>
                    <div className="stat-number small">
                      {stats.waitingAccept} Tertunda
                    </div>
                    <button
                      className="stat-btn transparent"
                      onClick={() => setActiveTab("documents")}
                    >
                      Lihat Tahap Verfikasi
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "documents" && (
            <div className="table-card fade-in">
              <h3>Tahap Verifikasi Journal</h3>
              <div className="custom-table">
                <div className="tbl-head">
                  <div>Judul</div>
                  <div>File</div>
                  <div className="center">Verifikasi</div>
                </div>
                <div className="tbl-body">
                  {documents.filter((doc) => doc.status === "pending")
                    .length === 0 ? (
                    <div className="empty-msg">Tidak ada dokumen pending.</div>
                  ) : (
                    documents
                      .filter((doc) => doc.status === "pending")
                      .map((doc) => (
                        <div className="tbl-row" key={doc.id}>
                          <div className="col-title">{doc.title}</div>
                          <div className="col-file">{doc.filename}</div>
                          <div className="center actions">
                            <button
                              className="btn-icon check"
                              onClick={() => handleAction(doc.id, "approve")}
                            >
                              ✔
                            </button>
                            <button
                              className="btn-icon cross"
                              onClick={() => handleAction(doc.id, "reject")}
                            >
                              ✖
                            </button>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "users" && (
            <div className="table-card fade-in">
              <h3>Manajemen Role Pengguna</h3>
              <div className="custom-table">
                <div className="tbl-head">
                  <div>ID</div>
                  <div>Username</div>
                  <div className="center">Role Now</div>
                  <div className="center">Edit Role</div>
                </div>
                <div className="tbl-body">
                  {users.map((user) => (
                    <div className="tbl-row" key={user.id}>
                      <div>#{user.id}</div>
                      <div style={{ fontWeight: "bold" }}>{user.username}</div>
                      <div className="center">
                        <span className={`badge ${user.role}`}>
                          {user.role}
                        </span>
                      </div>
                      <div className="center">
                        <select
                          className="role-select"
                          value={user.role}
                          onChange={(e) =>
                            handleChangeRole(user.id, e.target.value)
                          }
                        >
                          <option value="user">user</option>
                          <option value="contributor">contributor</option>
                          <option value="admin">admin</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "upload" && (
            <div className="upload-wrapper fade-in">
              <div className="form-card">
                <h3>Upload Journal</h3>
                <input
                  type="text"
                  className="inp-text"
                  placeholder="Judul Journal"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                />
                <div className="file-area">
                  <label htmlFor="file-upload-input" className="btn-choose">
                    Choose File
                  </label>
                  <span className="file-name">
                    {uploadFile ? uploadFile.name : "No file chosen"}
                  </span>
                  <input
                    id="file-upload-input"
                    type="file"
                    hidden
                    onChange={(e) => setUploadFile(e.target.files[0])}
                    accept=".pdf"
                  />
                </div>
                <button
                  className="btn-submit"
                  onClick={handleAdminUpload}
                  disabled={uploadLoading}
                >
                  {uploadLoading ? "Uploading..." : "Upload"}
                </button>
              </div>
              <div className="history-section">
                <h4>Riwayat Upload Anda</h4>
                <div className="history-list-compact">
                  {historyDocs.map((doc) => (
                    <div className="hist-item" key={doc.id}>
                      <span>{doc.title}</span>
                      <span className={`status-pill ${doc.status}`}>
                        {doc.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default DashboardAdmin;
