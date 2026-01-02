import React, { useState } from "react";
import Iridescence from "./component/Iridescence";

const Login = ({
  username,
  setUsername,
  password,
  setPassword,
  handleAuth,
  isRegister,
  setIsRegister,
  authLoading,
  onBackToHome,
}) => {
  // State lokal untuk mata password (show/hide)
  const [showPass, setShowPass] = useState(false);

  return (
    <div
      className="app-wrapper"
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      {/* 1. BACKGROUND IRIDESCENCE (Hijau) */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
        }}
      >
        <Iridescence
          color={[0.05, 0.25, 0.05]} // Warna hijau sesuai kode asli kamu
          mouseReact={true}
          amplitude={0.1}
          speed={1.0}
        />
      </div>

      {/* 2. TOMBOL BACK (Agar bisa kembali ke Landing Page) */}
      <button
        onClick={onBackToHome}
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          background: "transparent",
          border: "none",
          color: "#fff",
          cursor: "pointer",
          fontWeight: "bold",
          zIndex: 20,
        }}
      >
        ← Back to Home
      </button>

      {/* 3. LOGIN CARD (Struktur asli kamu) */}
      <div className="login-card" style={{ position: "relative", zIndex: 10 }}>
        {/* Bagian Kiri */}
        <div className="login-left">
          <h2>Hi Medivors !</h2>
          <h1>
            WELCOME TO <br /> MEDIVORA AI
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

        {/* Bagian Kanan (Form) */}
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

            <button type="submit" className="btn-login" disabled={authLoading}>
              {authLoading
                ? "Processing..."
                : isRegister
                ? "Sign Up"
                : "Log in"}
            </button>
          </form>

          <div className="login-footer">
            <span onClick={() => setIsRegister(!isRegister)}>
              {isRegister
                ? "Already have an account? Log in"
                : "Don't have an account? Sign Up"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
