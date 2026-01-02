import React from "react";
import "./LiquidGlass.css"; // ✅ Import file CSS yang baru dibuat

const LiquidGlass = ({ children, onClick, className = "" }) => {
  return (
    <button
      onClick={onClick}
      className={`liquid-glass-btn ${className}`} // Gabungkan class custom
    >
      {/* Efek Kilau (Shine) */}
      <div className="liquid-glass-shine" />

      {/* Konten Teks */}
      <span className="liquid-glass-content">{children}</span>
    </button>
  );
};

export default LiquidGlass;
