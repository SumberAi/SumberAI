import React, { useState } from 'react';
import { Logo } from '../components/Shared';

export default function LoginScreen({ onLogin }) {
  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if(name.trim().length > 0) {
      onLogin(name.trim());
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
        <h2 style={{ fontFamily: "Exo 2", fontWeight: 900, fontSize: 22, color: "#1E2A45", marginBottom: 8, textAlign: "center" }}>
          Selamat Datang!
        </h2>
        <p style={{ fontSize: 13, color: "#64748B", textAlign: "center", marginBottom: 24, lineHeight: 1.6 }}>
          Ini adalah simulasi Login. Ketik nama Anda di bawah ini, dan lihat bagaimana nama tersebut digunakan secara <b>Realtime</b> di seluruh aplikasi.
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#475569", marginBottom: 8 }}>
              NAMA MAHASISWA
            </label>
            <input 
              type="text" 
              placeholder="Contoh: Budi Santoso"
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

          <button 
            type="submit"
            className="tap"
            style={{
              width: "100%",
              padding: 18,
              background: name.trim().length > 0 ? "linear-gradient(135deg, #2563EB, #06B6D4)" : "#CBD5E1",
              color: "#fff",
              border: "none",
              borderRadius: 16,
              fontSize: 15,
              fontWeight: 800,
              boxShadow: name.trim().length > 0 ? "0 8px 24px rgba(37,99,235,.3)" : "none",
              cursor: name.trim().length > 0 ? "pointer" : "not-allowed",
              transition: "all .3s"
            }}
          >
            Lanjutkan & Masuk 🚀
          </button>
        </form>
      </div>
      
      <div style={{ marginTop: 30, fontSize: 11, color: "#94A3B8", fontWeight: 600, animation: "fadeUp .7s ease" }}>
        Simulasi Realtime Data Binding
      </div>
    </div>
  );
}
