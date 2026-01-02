import { useState } from "react";
import axios from "axios";
import "./index.css";

// Import Components
import LandingPage from "./LandingPage";
import Login from "./Login";
import User from "./User";
import DashboardAdmin from "./DashboardAdmin";
import DashboardContributor from "./DashboardContributor";

const API_DB = import.meta.env.VITE_API_DB;

function App() {
  // Global State
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [userId, setUserId] = useState(localStorage.getItem("userId"));
  const [role, setRole] = useState(localStorage.getItem("role") || "user");
  const [username, setUsername] = useState(
    localStorage.getItem("username") || ""
  );

  // Login State
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);

  // State Landing Page
  const [showLanding, setShowLanding] = useState(true);

  // Auth Handler
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
        localStorage.setItem("username", res.data.username || username);

        setToken(res.data.token);
        setUserId(res.data.userId);
        setRole(res.data.role);
        setUsername(res.data.username || username);
      }
    } catch (err) {
      alert("Gagal: " + (err.response?.data?.error || "Error Server"));
    }
    setAuthLoading(false);
  };

  const handleLogout = () => {
    localStorage.clear();
    setToken(null);
    setUserId(null);
    setRole(null);
    setUsername("");
    setShowLanding(true); // Balik ke landing page saat logout
  };

  // --- RENDER LOGIC ---

  // 1. Belum Login
  if (!token) {
    // A. Tampilkan Landing Page dulu
    if (showLanding) {
      return <LandingPage onGetStarted={() => setShowLanding(false)} />;
    }

    // B. Kalau sudah klik mulai, Tampilkan Login
    return (
      <Login
        username={username}
        setUsername={setUsername}
        password={password}
        setPassword={setPassword}
        handleAuth={handleAuth}
        isRegister={isRegister}
        setIsRegister={setIsRegister}
        authLoading={authLoading}
        onBackToHome={() => setShowLanding(true)}
      />
    );
  }

  // 2. Sudah Login (Cek Role)
  if (role === "admin") return <DashboardAdmin handleLogout={handleLogout} />;
  if (role === "contributor")
    return <DashboardContributor userId={userId} handleLogout={handleLogout} />;

  // 3. User Biasa (Chat Dashboard)
  return (
    <User
      token={token}
      userId={userId}
      username={username}
      handleLogout={handleLogout}
    />
  );
}

export default App;
