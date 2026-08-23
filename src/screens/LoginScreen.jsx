import React, { useState } from 'react';
import { Logo } from '../components/Shared';
import { auth, db } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInAnonymously, sendPasswordResetEmail, GoogleAuthProvider, signInWithPopup, signInWithCredential, OAuthProvider } from 'firebase/auth';
import { SignInWithApple } from '@capacitor-community/apple-sign-in';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { Capacitor } from '@capacitor/core';
import { FirebaseAuthentication } from '@capacitor-firebase/authentication';
export default function LoginScreen({ onLogin, onSkip }) {
  const [mode, setMode] = useState("login"); // "login" or "register"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const defaultGs = {
    lang: "id",
    name: "",
    hasSetUsername: false,
    hasCompletedTour: false,
    major: "Digital Business",
    university: "Universitas Jambi",
    coins: 0,
    hasClaimedStarter: false,
    streak: 3,
    level: 1,
    xp: 0,
    xpNext: 500,
    battlesWon: 0,
    redeemed: 0,
    engDone: 0,
    engLabWeeklyCoins: { beginner: 0, intermediate: 0, advanced: 0 },
    engLabResetDate: null,
    tutorResetDate: null,
    tutorDailyBonusDate: null,
    typingDailyCoins: 0,
    typingResetDate: null,
    memoryDailyCoins: 0,
    memoryResetDate: null,
    petualanganDailyCoins: 0,
    petualanganResetDate: null,
    dailySpinResetDate: null,
    basicChatCount: 0,
    interviewDone: 0,
    negsDone: 0,
    academyDone: 0,
    proStatus: {
      scholar: false,
      english: false,
      grammar: false,
      mod_otomatisasi: false,
      mod_proposal: false,
      mod_etika: false
    },
    voiceLimit: 12,
    voiceResetDate: null,
    playtimeMinutes: 0
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if(email.trim().length === 0 || password.trim().length === 0) {
      setError("Email dan Password wajib diisi!");
      return;
    }

    setLoading(true);

    try {
      if (mode === "register") {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        let newUser = {
          ...defaultGs,
          name: email.split('@')[0],
          email: email
        };

        if (email.toLowerCase() === "sumberai.unja@gmail.com") {
          newUser.coins = 99999;
          newUser.level = 99;
          newUser.xp = 99999;
          newUser.proStatus = { scholar: true, english: true, grammar: true, mod_otomatisasi: true, mod_proposal: true, mod_etika: true };
          newUser.voiceLimit = 99999;
        }

        await setDoc(doc(db, "users", user.uid), newUser);
        onLogin(newUser);

      } else {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        const userDoc = await getDoc(doc(db, "users", user.uid));
        let userData = userDoc.exists() ? userDoc.data() : { ...defaultGs, name: email.split('@')[0], email: email };
        
        if (email.toLowerCase() === "sumberai.unja@gmail.com") {
          userData.coins = 99999;
          userData.level = 99;
          userData.xp = 99999;
          userData.proStatus = { scholar: true, english: true, grammar: true, mod_otomatisasi: true, mod_proposal: true, mod_etika: true };
          userData.voiceLimit = 99999;
          await setDoc(doc(db, "users", user.uid), userData);
        }

        onLogin(userData);
      }
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setError("Email sudah terdaftar. Silakan masuk.");
      } else if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError("Email atau Password salah!");
      } else {
        setError("Terjadi kesalahan: " + err.message);
      }
    }
    setLoading(false);
  };

  // Helper functions for Apple Sign In Nonce
  const generateNonce = (length) => {
    const charset = '0123456789ABCDEFGHIJKLMNOPQRSTUVXYZabcdefghijklmnopqrstuvwxyz-._';
    let result = '';
    const bytes = new Uint8Array(length);
    crypto.getRandomValues(bytes);
    for (let i = 0; i < length; i++) {
      result += charset[bytes[i] % charset.length];
    }
    return result;
  };

  const sha256 = async (rawNonce) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(rawNonce);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const handleAppleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      if (Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'ios') {
        const rawNonce = generateNonce(32);
        const hashedNonce = await sha256(rawNonce);

        const result = await SignInWithApple.authorize({
          clientId: 'com.sumberai.app',
          redirectURI: '',
          scopes: 'email name',
          state: '12345',
          nonce: hashedNonce,
        });
        
        if (result.response && result.response.identityToken) {
          const provider = new OAuthProvider('apple.com');
          const credential = provider.credential({
            idToken: result.response.identityToken,
            rawNonce: rawNonce
          });
          const fbResult = await signInWithCredential(auth, credential);
          const user = fbResult.user;
          
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            onLogin(userDoc.data());
          } else {
            // New User Registration
            const names = user.displayName ? user.displayName.split(" ") : ["User", "Apple"];
            const userData = {
              id: user.uid,
              firstName: names[0] || "User",
              lastName: names.slice(1).join(" ") || "Apple",
              email: user.email || "",
              grade: "10",
              school: "Apple User",
              xp: 0,
              level: 1,
              coins: 50,
              createdAt: new Date().toISOString()
            };
            await setDoc(doc(db, "users", user.uid), userData);
            onLogin(userData);
          }
        } else {
          setError("Gagal mendapatkan token Apple.");
        }
      } else {
         setError("Sign in with Apple hanya tersedia di perangkat iOS.");
      }
    } catch (err) {
      setError("Gagal login dengan Apple: " + err.message);
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      let user;
      
      if (Capacitor.isNativePlatform()) {
        const result = await FirebaseAuthentication.signInWithGoogle();
        const credential = GoogleAuthProvider.credential(result.credential?.idToken);
        const fbResult = await signInWithCredential(auth, credential);
        user = fbResult.user;
      } else {
        const provider = new GoogleAuthProvider();
        const fbResult = await signInWithPopup(auth, provider);
        user = fbResult.user;
      }
      
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        // User exists, just log them in
        onLogin(userDoc.data());
      } else {
        // New user, create profile
        let newUser = {
          ...defaultGs,
          name: user.displayName || user.email.split('@')[0],
          email: user.email
        };
        await setDoc(doc(db, "users", user.uid), newUser);
        onLogin(newUser);
      }
    } catch (err) {
      if (err.code === 'auth/popup-closed-by-user') {
        setError("Login Google dibatalkan.");
      } else {
        setError("Gagal login dengan Google: " + err.message);
      }
    }
    setLoading(false);
  };

  const handleForgotPassword = async () => {
    if(!email) {
      setError("Masukkan alamat email Anda terlebih dahulu di kolom atas untuk mereset password.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      setError("");
      alert("✅ Tautan reset password telah dikirim ke email Anda! Silakan cek kotak masuk atau folder spam.");
    } catch(err) {
      setError("Gagal mengirim email reset: " + err.message);
    }
  };

  return (
    <>
      <style>{`
        @keyframes float1 {
          0% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0, 0) scale(1); }
        }
        @keyframes float2 {
          0% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-30px, 50px) scale(1.2); }
          66% { transform: translate(20px, -20px) scale(0.8); }
          100% { transform: translate(0, 0) scale(1); }
        }
        @keyframes fadeUpNeon {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .glass-card {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 1);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.08);
          animation: fadeUpNeon 0.6s ease-out forwards;
        }
        .neon-input {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          color: #0f172a;
          transition: all 0.3s ease;
        }
        .neon-input:focus {
          border-color: #38bdf8;
          box-shadow: 0 0 15px rgba(56, 189, 248, 0.15);
        }
        .neon-input::placeholder {
          color: #94a3b8;
        }
        .neon-btn {
          background: linear-gradient(135deg, #0ea5e9, #6366f1);
          transition: all 0.3s;
        }
        .neon-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(14, 165, 233, 0.3);
        }
      `}</style>

      <div style={{
        minHeight: "100dvh", 
        backgroundColor: "#f8fafc",
        backgroundImage: "radial-gradient(circle at top right, rgba(14, 165, 233, 0.08), transparent 40%), radial-gradient(circle at bottom left, rgba(99, 102, 241, 0.08), transparent 40%)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "calc(40px + env(safe-area-inset-top)) 24px calc(40px + env(safe-area-inset-bottom))",
        position: "relative",
        overflowY: "auto",
        overflowX: "hidden"
      }}>
        <div style={{
          position: "absolute", top: "10%", left: "10%", width: 300, height: 300, 
          background: "radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, transparent 70%)", 
          borderRadius: "50%", filter: "blur(40px)", animation: "float1 10s infinite ease-in-out"
        }} />
        <div style={{
          position: "absolute", bottom: "10%", right: "10%", width: 350, height: 350, 
          background: "radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)", 
          borderRadius: "50%", filter: "blur(40px)", animation: "float2 12s infinite ease-in-out reverse"
        }} />

        <div style={{ animation: "fadeUpNeon 0.5s ease-out", marginBottom: 30, position: "relative", zIndex: 10 }}>
          <Logo size={50} />
        </div>

        <div className="glass-card" style={{
          borderRadius: 24,
          padding: "32px 24px",
          width: "100%",
          maxWidth: "400px",
          position: "relative",
          zIndex: 10
        }}>
          <div style={{ display: "flex", marginBottom: 32, background: "rgba(241, 245, 249, 1)", borderRadius: 16, padding: 6, position: "relative" }}>
            <div style={{
              position: "absolute", top: 6, bottom: 6, left: mode === "login" ? 6 : "50%", width: "calc(50% - 6px)",
              background: "#ffffff", borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.05)", transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
            }} />
            <button className="tap" onClick={() => { setMode("login"); setError(""); }} style={{ flex: 1, padding: "12px 0", borderRadius: 12, border: "none", background: "transparent", fontWeight: 800, fontSize: 14, color: mode === "login" ? "#0f172a" : "#64748b", cursor: "pointer", position: "relative", zIndex: 2 }}>
              Masuk
            </button>
            <button className="tap" onClick={() => { setMode("register"); setError(""); }} style={{ flex: 1, padding: "12px 0", borderRadius: 12, border: "none", background: "transparent", fontWeight: 800, fontSize: 14, color: mode === "register" ? "#0f172a" : "#64748b", cursor: "pointer", position: "relative", zIndex: 2 }}>
              Daftar Baru
            </button>
          </div>

          <h2 style={{ fontFamily: "Exo 2", fontWeight: 900, fontSize: 26, color: "#0f172a", marginBottom: 8, textAlign: "center" }}>
            {mode === "login" ? "Selamat Datang!" : "Mulai Perjalanan AI"}
          </h2>
          <p style={{ fontSize: 13, color: "#64748b", textAlign: "center", marginBottom: 30, lineHeight: 1.6 }}>
            {mode === "login" ? "Akses portal pembelajaran cerdas Anda." : "Amankan progress dan capai level tertinggi!"}
          </p>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 20, position: "relative" }}>
              <svg style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              <input 
                type="email" 
                placeholder="Alamat Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="neon-input"
                style={{ width: "100%", padding: "16px 20px 16px 48px", borderRadius: 16, fontSize: 15, outline: "none", fontWeight: 500, boxSizing: "border-box" }}
                required
              />
            </div>

            <div style={{ marginBottom: 24, position: "relative" }}>
              <svg style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="neon-input"
                style={{ width: "100%", padding: "16px 48px 16px 48px", borderRadius: 16, fontSize: 15, outline: "none", fontWeight: 500, boxSizing: "border-box" }}
                required
              />
              <div 
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", color: "#94a3b8", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 4 }}
              >
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                )}
              </div>
            </div>

            {error && (
              <div style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.3)", color: "#ef4444", padding: "12px 14px", borderRadius: 12, fontSize: 12, fontWeight: 600, marginBottom: 20, textAlign: "center" }}>
                {error}
              </div>
            )}

            {mode === "login" && (
              <div style={{ textAlign: "right", marginTop: "-12px", marginBottom: "20px" }}>
                <span onClick={handleForgotPassword} style={{ fontSize: 12, color: "#0ea5e9", cursor: "pointer", fontWeight: 600, transition: "color 0.2s" }} onMouseOver={e => e.target.style.color="#0284c7"} onMouseOut={e => e.target.style.color="#0ea5e9"}>
                  Lupa Password?
                </span>
              </div>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="tap neon-btn"
              style={{
                width: "100%", padding: "16px", color: "#fff", border: "none", borderRadius: 16, fontSize: 15, fontWeight: 800,
                opacity: (email.trim().length > 0 && password.trim().length > 0 && !loading) ? 1 : 0.5,
                cursor: (email.trim().length > 0 && password.trim().length > 0 && !loading) ? "pointer" : "not-allowed",
                marginBottom: 16
              }}
            >
              {loading ? "Menghubungkan..." : (mode === "login" ? "Masuk ke Sistem 🚀" : "Mulai Mendaftar")}
            </button>

            <div style={{ display: "flex", alignItems: "center", margin: "16px 0" }}>
              <div style={{ flex: 1, height: 1, backgroundColor: "#e2e8f0" }}></div>
              <span style={{ padding: "0 12px", color: "#64748b", fontSize: 12, fontWeight: 600 }}>ATAU</span>
              <div style={{ flex: 1, height: 1, backgroundColor: "#e2e8f0" }}></div>
            </div>

            {Capacitor.getPlatform() === 'ios' && (
              <button
                type="button"
                onClick={handleAppleLogin}
                disabled={loading}
                style={{
                  width: "100%", padding: "16px", borderRadius: 16, border: "1px solid #000", background: "#000",
                  color: "#fff", fontWeight: 700, fontSize: 15, cursor: loading ? "not-allowed" : "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 12, transition: "all 0.3s ease",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
                  marginBottom: 12
                }}
              >
                <svg width="20" height="20" viewBox="0 0 384 512" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
                </svg>
                Sign in with Apple
              </button>
            )}

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              style={{
                width: "100%", padding: "16px", borderRadius: 16, border: "1px solid #e2e8f0", background: "#ffffff",
                color: "#0f172a", fontWeight: 700, fontSize: 15, cursor: loading ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 12, transition: "all 0.3s ease",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)"
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.67 15.63 16.89 16.79 15.72 17.57V20.34H19.29C21.37 18.42 22.56 15.6 22.56 12.25Z" fill="#4285F4"/>
                <path d="M12 23C14.97 23 17.46 22.02 19.29 20.34L15.72 17.57C14.73 18.23 13.47 18.63 12 18.63C9.15 18.63 6.74 16.71 5.88 14.12H2.19V16.98C4.01 20.61 7.7 23 12 23Z" fill="#34A853"/>
                <path d="M5.88 14.12C5.66 13.47 5.54 12.76 5.54 12C5.54 11.24 5.66 10.53 5.88 9.88V7.02H2.19C1.45 8.5 1 10.2 1 12C1 13.8 1.45 15.5 2.19 16.98L5.88 14.12Z" fill="#FBBC05"/>
                <path d="M12 5.38C13.62 5.38 15.06 5.94 16.21 7.02L19.38 3.85C17.45 2.05 14.97 1 12 1C7.7 1 4.01 3.39 2.19 7.02L5.88 9.88C6.74 7.29 9.15 5.38 12 5.38Z" fill="#EA4335"/>
              </svg>
              Masuk dengan Google
            </button>

            {onSkip && (
              <button 
                type="button"
                className="tap"
                onClick={onSkip}
                style={{
                  width: "100%", padding: "14px", borderRadius: 16, border: "2px solid #e2e8f0", background: "transparent",
                  color: "#64748b", fontWeight: 800, fontSize: 14, cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.3s ease",
                  marginTop: 16
                }}
              >
                Mulai Nanti (Guest Mode)
              </button>
            )}
          </form>
        </div>
        
        <div style={{ marginTop: 40, fontSize: 12, color: "#64748b", fontWeight: 600, animation: "fadeUpNeon 0.8s ease-out forwards", textAlign: "center" }}>
          Secured by Google Cloud Platform <svg style={{ display:"inline", verticalAlign:"middle", marginLeft:4 }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
        </div>
      </div>
    </>
  );
}
