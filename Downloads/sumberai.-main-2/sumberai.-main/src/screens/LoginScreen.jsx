import React, { useState } from 'react';
import { Logo } from '../components/Shared';

export default function LoginScreen({ onLogin }) {
  const [mode, setMode] = useState("login"); // "login" or "register"
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    const username = name.trim();
    const pass = password.trim();
    
    if(username.length === 0 || pass.length === 0) {
      setError("Username dan Password wajib diisi!");
      return;
    }

    // Ambil database user
    const dbString = localStorage.getItem("sumberai_users_db");
    const db = dbString ? JSON.parse(dbString) : {};

    if (mode === "register") {
      if (db[username]) {
        setError("Username sudah digunakan. Silakan gunakan yang lain.");
        return;
      }
      // Buat user baru (modal awal 0, belum klaim)
      const newUser = {
        name: username,
        password: pass,
        coins: 0,
        hasClaimedStarter: false
      };
      db[username] = newUser;
      localStorage.setItem("sumberai_users_db", JSON.stringify(db));
      onLogin(newUser);
    } else {
      // Login mode
      const user = db[username];
      if (!user) {
        setError("Username tidak ditemukan. Silakan Daftar terlebih dahulu.");
        return;
      }
      if (user.password !== pass) {
        setError("Password salah!");
        return;
      }
      onLogin(user);
    }
  };

  return (
    <div style={{
      minHeight: "100vh", 
      background: "linear-gradient(180deg, #F8FAFF 0%, #EEF4FF 100%)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      padding: 24
    }}>
      <div style={{ animation: "fadeUp .5s ease", marginBottom: 40 }}>
        <Logo size={45} />
      </div>

      <div style={{
        background:"var(--bg-card)",
        borderRadius: 24,
        padding: "32px 24px",
        width: "100%",
        boxShadow: "0 10px 40px rgba(37,99,235,.15)",
        animation: "fadeUp .6s ease"
      }}>
        <div style={{ display: "flex", marginBottom: 24, background: "#F1F5F9", borderRadius: 12, padding: 4 }}>
          <button className="tap" onClick={() => { setMode("login"); setError(""); }} style={{ flex: 1, padding: "10px 0", borderRadius: 10, border: "none", background: mode === "login" ? "#fff" : "transparent", fontWeight: 800, fontSize: 14, color: mode === "login" ? "#2563EB" : "#64748B", boxShadow: mode === "login" ? "0 2px 8px rgba(0,0,0,0.05)" : "none", cursor: "pointer", transition: "all 0.2s" }}>
            Masuk
          </button>
          <button className="tap" onClick={() => { setMode("register"); setError(""); }} style={{ flex: 1, padding: "10px 0", borderRadius: 10, border: "none", background: mode === "register" ? "#fff" : "transparent", fontWeight: 800, fontSize: 14, color: mode === "register" ? "#2563EB" : "#64748B", boxShadow: mode === "register" ? "0 2px 8px rgba(0,0,0,0.05)" : "none", cursor: "pointer", transition: "all 0.2s" }}>
            Daftar Baru
          </button>
        </div>

        <h2 style={{ fontFamily: "Exo 2", fontWeight: 900, fontSize: 22, color: "#1E2A45", marginBottom: 8, textAlign: "center" }}>
          {mode === "login" ? "Selamat Datang Kembali!" : "Buat Akun SUMBER AI"}
        </h2>
        <p style={{ fontSize: 13, color: "#64748B", textAlign: "center", marginBottom: 24, lineHeight: 1.6 }}>
          {mode === "login" ? "Silakan masuk untuk melanjutkan petualangan dan belajar AI." : "Daftar sekarang dan klaim 50 koin pertamamu!"}
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#475569", marginBottom: 8 }}>
              USERNAME
            </label>
            <input 
              type="text" 
              placeholder="Contoh: budi_pintar"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                width: "100%", padding: "16px 20px", borderRadius: 16, border: "2px solid #E2E8F0", fontSize: 15, outline: "none", fontWeight: 600, color: "#1E2A45", transition: "all .3s ease", boxSizing: "border-box"
              }}
              onFocus={(e) => e.target.style.borderColor = "#2563EB"}
              onBlur={(e) => e.target.style.borderColor = "#E2E8F0"}
              required
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#475569", marginBottom: 8 }}>
              PASSWORD
            </label>
            <input 
              type="password" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "100%", padding: "16px 20px", borderRadius: 16, border: "2px solid #E2E8F0", fontSize: 15, outline: "none", fontWeight: 600, color: "#1E2A45", transition: "all .3s ease", boxSizing: "border-box"
              }}
              onFocus={(e) => e.target.style.borderColor = "#2563EB"}
              onBlur={(e) => e.target.style.borderColor = "#E2E8F0"}
              required
            />
          </div>

          {error && (
            <div style={{ background: "#FEE2E2", color: "#EF4444", padding: "10px 14px", borderRadius: 12, fontSize: 12, fontWeight: 700, marginBottom: 20, textAlign: "center" }}>
              {error}
            </div>
          )}

          <button 
            type="submit"
            className="tap"
            style={{
              width: "100%",
              padding: 18,
              background: (name.trim().length > 0 && password.trim().length > 0) ? "linear-gradient(135deg, #2563EB, #06B6D4)" : "#CBD5E1",
              color: "#fff",
              border: "none",
              borderRadius: 16,
              fontSize: 15,
              fontWeight: 800,
              boxShadow: (name.trim().length > 0 && password.trim().length > 0) ? "0 8px 24px rgba(37,99,235,.3)" : "none",
              cursor: (name.trim().length > 0 && password.trim().length > 0) ? "pointer" : "not-allowed",
              transition: "all .3s"
            }}
          >
            {mode === "login" ? "Masuk ke SUMBER AI 🚀" : "Daftar Akun Sekarang"}
          </button>
        </form>
      </div>
      
      <div style={{ marginTop: 30, fontSize: 11, color: "#94A3B8", fontWeight: 600, animation: "fadeUp .7s ease" }}>
        Simulasi Local Database (Data Tersimpan di Browser)
      </div>
    </div>
  );
}
