import { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./index.css"; 

// Import Dashboard Baru (Biarkan Saja)
import DashboardAdmin from "./DashboardAdmin";
import DashboardContributor from "./DashboardContributor";

// --- KONFIGURASI SERVER ---
const API_AI = import.meta.env.VITE_API_AI;
const API_DB = import.meta.env.VITE_API_DB;

function App() {
  // --- STATE AUTH ---
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [userId, setUserId] = useState(localStorage.getItem("userId"));
  const [role, setRole] = useState(localStorage.getItem("role") || "user");

  const [username, setUsername] = useState(
    localStorage.getItem("username") || ""
  );
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  // --- STATE CHAT & SESSION (BARU) ---
  const [sessions, setSessions] = useState([]); // List Sidebar
  const [activeSessionId, setActiveSessionId] = useState(null); // ID Chat Aktif
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Toggle Sidebar

  // State pesan (Default kosong/greeting)
  const [messages, setMessages] = useState([
    {
      role: "system",
      text: "Halo! Saya Asisten Kanker AI. Silakan mulai percakapan baru.",
      timestamp: new Date().toISOString(),
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  // --- 1. LOAD DAFTAR SESI SAAT LOGIN ---
  useEffect(() => {
    if (token && userId) {
      fetchSessions();
    }
  }, [token, userId]);

  // --- 2. LOAD PESAN SAAT GANTI SESI ---
  useEffect(() => {
    if (activeSessionId) {
      fetchMessages(activeSessionId);
    } else {
      // Jika mode "New Chat", reset pesan
      setMessages([
        {
          role: "system",
          text: "Halo! Saya Asisten Kanker AI. Silakan mulai percakapan baru.",
          timestamp: new Date().toISOString(),
        },
      ]);
    }
  }, [activeSessionId]);

  // --- API HELPER FUNCTIONS (BARU) ---
  const fetchSessions = async () => {
    try {
      const res = await axios.get(`${API_DB}/sessions/${userId}`);
      setSessions(res.data);
    } catch (err) {
      console.error("Gagal ambil sesi:", err);
    }
  };

  const fetchMessages = async (sessionId) => {
    try {
      const res = await axios.get(`${API_DB}/history/${sessionId}`);
      // Mapping data dari DB ke format UI
      const history = res.data.map((item) => ({
        role: item.role === "user" ? "user" : "system",
        text: item.text,
        timestamp: item.timestamp || item.created_at,
        image: item.image, // Jika nanti ada fitur simpan gambar
        id: item.id,
      }));
      setMessages(history);
    } catch (err) {
      console.error("Gagal ambil pesan:", err);
    }
  };

  const createNewSession = async (firstMessage) => {
    try {
      // Judul otomatis dari 30 karakter pertama
      const title = firstMessage.substring(0, 30) + "...";
      const res = await axios.post(`${API_DB}/sessions`, { userId, title });
      const newSession = res.data;

      setSessions([newSession, ...sessions]); // Update sidebar
      setActiveSessionId(newSession.id); // Set aktif
      return newSession.id;
    } catch (err) {
      console.error("Gagal buat sesi:", err);
      return null;
    }
  };

  const handleDeleteSession = async (sessionId, e) => {
    e.stopPropagation(); // Biar gak ke-trigger klik select session
    if (!confirm("Hapus percakapan ini?")) return;
    try {
      await axios.delete(`${API_DB}/sessions/${sessionId}`);
      setSessions(sessions.filter((s) => s.id !== sessionId));
      if (activeSessionId === sessionId) {
        setActiveSessionId(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // --- AUTH FUNCTION (TETAP SAMA) ---
  const handleAuth = async (e) => {
    e.preventDefault();
    if (!username || !password) return;
    setAuthLoading(true);
    const endpoint = isRegister ? "/register" : "/login";
    try {
      const res = await axios.post(`${API_DB}${endpoint}`, {
        username,
        password,
      });
      if (isRegister) {
        alert("Registrasi berhasil! Silakan login.");
        setIsRegister(false);
        setPassword("");
      } else {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("userId", res.data.userId);
        localStorage.setItem("role", res.data.role);
        const loggedInName = res.data.username || username;
        localStorage.setItem("username", loggedInName);
        setToken(res.data.token);
        setUserId(res.data.userId);
        setRole(res.data.role);
        setUsername(loggedInName);
      }
    } catch (err) {
      alert("Gagal: " + (err.response?.data?.error || "Error Server"));
    }
    setAuthLoading(false);
  };

  // --- FUNGSI COPY & DELETE & LOGOUT ---
  const handleLogout = () => {
    localStorage.clear();
    setToken(null);
    setUserId(null);
    setRole(null);
    setUsername("");
    setSessions([]);
    setMessages([]);
    setActiveSessionId(null);
  };

  const handleCopyMessage = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        alert("Teks berhasil disalin! 📋");
      })
      .catch((err) => {
        console.error("Gagal menyalin:", err);
      });
  };

  const handleDeleteMessage = async (index, msgId) => {
    if (!confirm("Hapus pesan ini secara permanen?")) return;
    const newMsgs = messages.filter((_, i) => i !== index);
    setMessages(newMsgs);
    if (msgId && userId) {
      try {
        await axios.delete(`${API_DB}/deleteHistory/${msgId}`);
      } catch (err) {
        console.error("Gagal hapus di DB:", err);
      }
    }
  };

  // --- CHAT FUNCTIONS (UPDATE LOGIC SESSION) ---
  const handleSend = async () => {
    if (!input.trim()) return;

    let currentSession = activeSessionId;

    // 1. Jika belum ada sesi (New Chat), buat dulu
    if (!currentSession) {
      currentSession = await createNewSession(input);
      if (!currentSession) return alert("Gagal membuat sesi chat");
    }

    const userTime = new Date().toISOString();
    const newMsgs = [
      ...messages,
      { role: "user", text: input, timestamp: userTime },
    ];
    setMessages(newMsgs);
    setInput("");
    setLoading(true);

    // 2. Simpan Pesan User (Pakai Session ID)
    if (userId)
      axios.post(`${API_DB}/saveHistory`, {
        userId,
        role: "user",
        message: input,
        sessionId: currentSession, // 🔥 PENTING
      });

    try {
      const res = await axios.post(`${API_AI}/ask`, { query: input });
      const aiReply = res.data.answer;
      const aiTime = new Date().toISOString();
      setMessages((prev) => [
        ...prev,
        { role: "system", text: aiReply, timestamp: aiTime },
      ]);

      // 3. Simpan Pesan AI (Pakai Session ID)
      if (userId)
        axios.post(`${API_DB}/saveHistory`, {
          userId,
          role: "system",
          message: aiReply,
          sessionId: currentSession, // 🔥 PENTING
        });
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "system", text: "Maaf, server AI sedang sibuk." },
      ]);
    }
    setLoading(false);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    let currentSession = activeSessionId;
    // Jika upload gambar di new chat, buat sesi baru
    if (!currentSession) {
      currentSession = await createNewSession("Analisis Gambar");
      if (!currentSession) return;
    }

    const imgUrl = URL.createObjectURL(file);
    const userTime = new Date().toISOString();
    const newMsgs = [
      ...messages,
      {
        role: "user",
        text: "Menganalisis gambar...",
        image: imgUrl,
        timestamp: userTime,
      },
    ];
    setMessages(newMsgs);
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(`${API_AI}/analyze-image`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const aiAnalysis = res.data.analysis;
      const aiTime = new Date().toISOString();
      setMessages((prev) => [
        ...prev,
        { role: "system", text: aiAnalysis, timestamp: aiTime },
      ]);

      if (userId)
        axios.post(`${API_DB}/saveHistory`, {
          userId,
          role: "system",
          message: aiAnalysis,
          sessionId: currentSession, // 🔥 PENTING
        });
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "system", text: "Gagal analisis gambar." },
      ]);
    }
    setLoading(false);
    e.target.value = null;
  };

  // --- LEAF ANIMATION (TETAP SAMA) ---
  const leaves = Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 10}s`,
    animationDuration: `${10 + Math.random() * 10}s`,
    scale: 0.5 + Math.random() * 0.5,
  }));

  const LeafBackground = () => (
    <div className="leaf-container">
      {leaves.map((leaf) => (
        <div
          key={leaf.id}
          className="leaf"
          style={{
            left: leaf.left,
            animationDelay: leaf.animationDelay,
            animationDuration: leaf.animationDuration,
            transform: `scale(${leaf.scale})`,
          }}
        >
          <svg
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="#4caf50"
            style={{ opacity: 0.6 }}
          >
            <path d="M17,8C8,10,5.9,16.17,3.82,21.34L5.71,22l1-2.3A4.49,4.49,0,0,0,8,20C19,20,22,3,22,3,21,5,14,5.25,9,6.25S2,11.5,2,13.5a6.22,6.22,0,0,0,1.75,3.75C7,13,11,9,17,8Z" />
          </svg>
        </div>
      ))}
    </div>
  );

  // ==========================================
  // 🔥 RENDER UI 🔥
  // ==========================================

  // 1. TAMPILAN LOGIN (TETAP SAMA)
  if (!token) {
    return (
      <div className="app-wrapper">
        <div className="login-card">
          <div className="login-left">
            <h2>Hi Medivors !</h2>
            <h1>
              WELCOME TO <br />
              MEDIVORA AI
            </h1>
            <div className="login-social">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
              <span>@medivora.ai</span>
            </div>
          </div>

          <div className="login-right">
            <div className="login-logo">
              <img src="/LogoMedivora.PNG" alt="Logo" />
              <h3>MEDIVORA</h3>
              <p>KANKER ASISTEN AI</p>
            </div>
            <form onSubmit={handleAuth} className="login-form">
              <div className="input-group">
                <label>username</label>
                <div className="input-wrapper">
                  <span className="input-icon">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </span>
                  <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="input-group">
                <label>password</label>
                <div className="input-wrapper">
                  <span className="input-icon">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <rect
                        x="3"
                        y="11"
                        width="18"
                        height="11"
                        rx="2"
                        ry="2"
                      ></rect>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                  </span>
                  <input
                    type={showPass ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <span
                    className="password-toggle"
                    onClick={() => setShowPass(!showPass)}
                  >
                    {showPass ? "👁️" : "👁️‍🗨️"}
                  </span>
                </div>
                <span className="forgot-pass">forgot password ?</span>
              </div>
              <button
                type="submit"
                className="btn-login"
                disabled={authLoading}
              >
                {authLoading
                  ? "Processing..."
                  : isRegister
                  ? "Sign Up"
                  : "Log in"}
              </button>
            </form>
            <div className="login-footer">
              {isRegister
                ? "Already have an account? "
                : "Already have an account? "}
              <span onClick={() => setIsRegister(!isRegister)}>
                {isRegister ? "Log in" : "Sign Up"}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. DASHBOARD ROLE LAIN (TETAP SAMA)
  if (role === "admin") return <DashboardAdmin handleLogout={handleLogout} />;
  if (role === "contributor")
    return <DashboardContributor userId={userId} handleLogout={handleLogout} />;

  // 3. TAMPILAN CHAT DENGAN SIDEBAR (LAYOUT BARU)
  return (
    <div className="app-wrapper main-chat-layout">
      <LeafBackground />

      {/* 🔥 SIDEBAR KIRI 🔥 */}
      <div className={`chat-sidebar ${isSidebarOpen ? "open" : "closed"}`}>
        {/* Tombol New Chat */}
        <div className="sidebar-header">
          <button
            className="btn-new-chat"
            onClick={() => setActiveSessionId(null)}
          >
            <span>+</span> New Chat
          </button>
          <button
            className="btn-toggle-mobile"
            onClick={() => setIsSidebarOpen(false)}
          >
            ✕
          </button>
        </div>

        {/* List Session */}
        <div className="session-list">
          <div className="session-label">──────── Riwayat ────────</div>
          {sessions.length === 0 ? (
            <div className="empty-session">Belum ada riwayat</div>
          ) : (
            sessions.map((session) => (
              <div
                key={session.id}
                className={`session-item ${
                  activeSessionId === session.id ? "active" : ""
                }`}
                onClick={() => {
                  setActiveSessionId(session.id);
                  if (window.innerWidth < 768) setIsSidebarOpen(false); // Auto close di HP
                }}
              >
                <span className="session-title">{session.title}</span>
                <button
                  className="btn-del-session"
                  onClick={(e) => handleDeleteSession(session.id, e)}
                >
                  🗑️
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer Sidebar (User & Logout) */}
        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">👤</div>
            <div className="user-name">{username || `${userId}`}</div>
          </div>
          <button
            onClick={handleLogout}
            className="btn-logout-icon"
            title="Logout"
          >
            ⏻
          </button>
        </div>
      </div>

      {/* Tombol Buka Sidebar (Mobile Only) */}
      {!isSidebarOpen && (
        <button
          className="btn-open-sidebar"
          onClick={() => setIsSidebarOpen(true)}
        >
          ☰
        </button>
      )}

      {/* 🔥 AREA CHAT KANAN 🔥 */}
      <div className="chat-main-area">
        {/* Tombol Logout & Settings (Versi Mengambang - Opsional jika mau dihapus krn sudah ada di sidebar) */}
        {/* Saya biarkan jika Anda ingin tetap ada tombol ini di atas background */}
        {/* <div className="settings-btn" style={{ zIndex: 50 }}>
          <svg
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
          </svg>
        </div> */}

        {/* CHAT CARD (Kotak putih di tengah) */}
        <div className="chat-card full-height">
          <div className="chat-header-card">
            <div className="chat-header-logo">
              <img src="/LogoMedivora.PNG" alt="Logo" />
            </div>
            <div className="chat-header-text">
              <h1>MEDIVORA</h1>
              <p>KANKER ASISTEN AI</p>
            </div>
            <div className="online-badge">
              <div className="blinking-dot"></div>
              <span>Online</span>
            </div>
          </div>

          {/* Chat Area */}
          <div className="chat-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`message-wrapper ${msg.role}`}>
                <div className="message-content-group">
                  <div className={`message ${msg.role}`}>
                    {msg.image && (
                      <img
                        src={msg.image}
                        alt="scan"
                        style={{ maxWidth: "200px", borderRadius: "10px" }}
                      />
                    )}
                    <div>{msg.text}</div>
                    <span className="msg-time">
                      {new Date(msg.timestamp || Date.now()).toLocaleTimeString(
                        [],
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </span>
                  </div>

                  <div className="message-actions">
                    <button
                      onClick={() => handleCopyMessage(msg.text)}
                      title="Salin Teks"
                    >
                      📋
                    </button>
                    <button
                      onClick={() => handleDeleteMessage(idx, msg.id)}
                      title="Hapus Pesan"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="message system">
                <em>Mengetik...</em>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="chat-input-area">
            <div
              style={{
                display: "flex",
                gap: "10px",
                alignItems: "center",
                background: "#f1f1f1",
                borderRadius: "30px",
                padding: "5px 15px",
              }}
            >
              <input
                type="file"
                hidden
                ref={fileInputRef}
                accept="image/*"
                onChange={handleImageUpload}
              />
              <button
                onClick={() => fileInputRef.current.click()}
                style={{
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                }}
              >
                📎
              </button>
              <input
                style={{
                  flex: 1,
                  border: "none",
                  background: "transparent",
                  outline: "none",
                  padding: "10px",
                }}
                placeholder="Kirim pesan..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <button
                onClick={handleSend}
                style={{
                  background: "none",
                  cursor: "pointer",
                }}
              >
                ➤
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
