import React, { useState, useEffect } from 'react';

export default function PricingScreen({ gs, onNav, upgradeToPro }) {
  const [showQR, setShowQR] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [lang, setLang] = useState('id'); // 'id' for Indonesian, 'en' for English

  const handleSimulatePayment = () => {
    setPaymentSuccess(true);
    setTimeout(() => {
      upgradeToPro(showQR);
      setShowQR(false);
      setPaymentSuccess(false);
      const message = lang === 'id' ? "Pembayaran Berhasil! Paket telah aktif." : "Payment Successful! Package is now active.";
      alert(message);
    }, 2000);
  };

  const t = {
    title: lang === 'id' ? "Upgrade PRO 🚀" : "Upgrade PRO 🚀",
    desc: lang === 'id' ? "Dapatkan akses fitur tak terbatas dan raih ribuan SmartCoin setiap bulan dari AI Tutor, English Lab, & Game Arena!" : "Accelerate your AI learning and earn more SmartCoins every day!",
    freeTitle: lang === 'id' ? "Mahasiswa Biasa" : "Regular Student",
    freePrice: lang === 'id' ? "Gratis" : "Free",
    freeDesc: lang === 'id' ? "Akses dasar ke ekosistem AI." : "Basic access to the AI ecosystem.",
    f1: lang === 'id' ? "Main Game Arena (Cari Koin)" : "Play Game Arena (Earn Coins)",
    f2: lang === 'id' ? "English Lab (Khusus Beginner)" : "English Lab (Beginner Only)",
    f3: lang === 'id' ? "Akses 20 Modul AI Academy" : "Access 20 AI Academy Modules",
    f4: lang === 'id' ? "Simulasi Interview & Grammar PRO" : "PRO Interview & Grammar",
    popular: lang === 'id' ? "PALING POPULER" : "MOST POPULAR",
    proPrice: lang === 'id' ? "/bulan" : "/month",
    proDesc: lang === 'id' ? "Buka 20 modul premium level industri di AI Academy + Bonus Instan 100 Koin di awal berlangganan!" : "Unlock all 20 premium industry-level modules in AI Academy + 100 Coins instant bonus!",
    p1_1: lang === 'id' ? "Tanpa Batas Energi" : "Unlimited Energy",
    p1_2: lang === 'id' ? " (Main sepuasnya)" : " (Play all you want)",
    p3_1: lang === 'id' ? "Akses Penuh 20 Modul" : "Full Access 20 Modules",
    p3_2: lang === 'id' ? " Kelas Industri" : " Industry Class",
    p4_1: lang === 'id' ? "Buka Semua" : "Unlock All",
    p4_2: lang === 'id' ? " Halaman Materi Mendalam" : " In-depth Material Pages",
    engTitle: lang === 'id' ? "AI ENGLISH TUTOR 🗣️" : "AI ENGLISH TUTOR 🗣️",
    engDesc: lang === 'id' ? "Buka semua mode percakapan AI & dapatkan klaim Bonus 20 Koin setiap harinya (Total 600 Koin/Bulan)." : "Unlock all AI voice conversation modes and get 20 Coins daily.",
    e1: lang === 'id' ? "Akses Tanpa Batas Basic Conversation" : "Unlimited Basic Conversation",
    e2: lang === 'id' ? "Buka Mode Grammar Correction" : "Unlock Grammar Correction Mode",
    e3: lang === 'id' ? "Buka Mode Simulasi Interview SMK" : "Unlock SMK Interview Simulation",
    subBtn: lang === 'id' ? "Berlangganan Sekarang 🚀" : "Subscribe Now 🚀",
    proActiveTitle: lang === 'id' ? "Anda Sudah PRO!" : "You Are PRO!",
    proActiveDesc: lang === 'id' ? "Nikmati fitur PRO tanpa batas! Dapatkan hingga 600 koin/bulan dari Tutor, 840 koin dari Lab, & ratusan koin Game Arena!" : "Enjoy all premium features without limits. Learn faster, earn more coins.",
    modTitle: lang === 'id' ? "Selesaikan Pembayaran" : "Complete Payment",
    modDesc: lang === 'id' ? "Scan kode QR di bawah ini menggunakan aplikasi M-Banking atau E-Wallet Anda." : "Scan the QR code below using your M-Banking or E-Wallet app.",
    orTrans: lang === 'id' ? "Atau Transfer Ke:" : "Or Transfer To:",
    total: lang === 'id' ? "Total Tagihan:" : "Total Bill:",
    waBtn: lang === 'id' ? "Konfirmasi via WhatsApp" : "Confirm via WhatsApp",
    demoBtn: lang === 'id' ? "(Demo) Simulasikan Pembayaran Lunas" : "(Demo) Simulate Paid Payment",
    sucTitle: lang === 'id' ? "Pembayaran Berhasil!" : "Payment Successful!",
    sucDesc: lang === 'id' ? "Memproses akun PRO Anda..." : "Processing your PRO account..."
  };

  const getWaText = () => {
    let pkg = "Paket AI Scholar PRO";
    let prc = "Rp 70.000";
    if (showQR === 'english') { pkg = "AI ENGLISH TUTOR"; prc = "Rp 65.000"; }
    else if (showQR === 'grammar') { pkg = "ENGLISH LAB (SIMULASI GRAMMAR)"; prc = "Rp 50.000"; }
    
    if (lang === 'id') {
      return `Halo Admin SumberAI, saya sudah mentransfer ${prc} untuk berlangganan ${pkg}. Berikut bukti pembayaran saya:`;
    } else {
      return `Hello SumberAI Admin, I have transferred ${prc} for the ${pkg}. Here is my proof of payment:`;
    }
  };

  return (
    <div style={{paddingTop: 80, paddingBottom: 100, minHeight: "100vh", background:"var(--bg-main)", position: "relative"}}>
      <div style={{padding: "0 16px"}}>
        <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24}}>
          <h2 style={{fontFamily: "Exo 2", fontWeight: 900, fontSize: 24, color: "#1E2A45", margin: 0}}>{t.title}</h2>
          
          <div style={{display: "flex", gap: 12, alignItems: "center"}}>
            <div style={{display: "flex", background: "#E2E8F0", borderRadius: 99, padding: 4}}>
              <div className="tap" onClick={() => setLang('id')} style={{padding: "4px 12px", borderRadius: 99, fontSize: 12, fontWeight: 800, color: lang === 'id' ? "#fff" : "#64748B", background: lang === 'id' ? "#3B82F6" : "transparent", boxShadow: lang === 'id' ? "0 2px 8px rgba(0,0,0,.1)" : "none", transition: "all .2s ease", cursor: "pointer"}}>ID</div>
              <div className="tap" onClick={() => setLang('en')} style={{padding: "4px 12px", borderRadius: 99, fontSize: 12, fontWeight: 800, color: lang === 'en' ? "#fff" : "#64748B", background: lang === 'en' ? "#3B82F6" : "transparent", boxShadow: lang === 'en' ? "0 2px 8px rgba(0,0,0,.1)" : "none", transition: "all .2s ease", cursor: "pointer"}}>EN</div>
            </div>
            
            <button className="tap" onClick={() => onNav("home")} style={{background: "#E2E8F0", color: "#475569", border: "none", borderRadius: "50%", width: 32, height: 32, fontWeight: "bold", cursor: "pointer"}}>✕</button>
          </div>
        </div>
        
        <>
            <p style={{fontSize: 14, color: "#64748B", marginBottom: 24, lineHeight: 1.5}}>
              {t.desc}
            </p>

            <div style={{background:"var(--bg-card)", borderRadius: 24, padding: 24, marginBottom: 16, border: "2px solid #E2E8F0", position: "relative"}}>
              <div style={{fontFamily: "Exo 2", fontWeight: 900, fontSize: 20, color: "#64748B"}}>{t.freeTitle}</div>
              <div style={{fontSize: 28, fontWeight: 800, color: "#1E2A45", margin: "8px 0"}}>{t.freePrice}</div>
              <div style={{fontSize: 13, color: "#64748B", marginBottom: 16}}>{t.freeDesc}</div>
              
              <ul style={{listStyle: "none", padding: 0, margin: 0, fontSize: 13, color: "#475569", lineHeight: 2}}>
                <li>✔️ {t.f1}</li>
                <li>✔️ {t.f2}</li>
                <li>❌ <span style={{opacity: 0.5}}>{t.f3}</span></li>
                <li>❌ <span style={{opacity: 0.5}}>{t.f4}</span></li>
              </ul>
            </div>

            <div style={{background: "linear-gradient(135deg, #7C3AED 0%, #8B5CF6 100%)", borderRadius: 24, padding: "2px", boxShadow: "0 12px 32px rgba(124,58,237,.2)", animation: "fadeUp .45s ease", position: "relative", marginBottom: 16}}>
              <div style={{background:"var(--bg-card)", borderRadius: 22, padding: 24, border: "1px solid #C4B5FD"}}>
                <div style={{fontFamily: "Exo 2", fontWeight: 900, fontSize: 20, color: "#7C3AED"}}>ENGLISH LAB (SIMULASI GRAMMAR) 📖</div>
                <div style={{fontSize: 32, fontWeight: 900, color: "#1E2A45", margin: "8px 0"}}>
                  Rp 50.000<span style={{fontSize: 14, fontWeight: 600, color: "#94A3B8"}}>{t.proPrice}</span>
                </div>
                <div style={{fontSize: 13, color: "#64748B", marginBottom: 20}}>Akses 3 Level Grammar (B, I, A) dengan koin ganda. Kumpulkan hingga maksimal 840 Koin per bulan!</div>
                
                <ul style={{listStyle: "none", padding: 0, margin: 0, fontSize: 13, color: "#475569", lineHeight: 2, marginBottom: 24}}>
                  <li>📖 <b>Kombinasi Soal Tata Bahasa</b></li>
                  <li>💡 <b>Pembahasan Detail per Soal</b></li>
                  <li>🔓 <b>Buka Semua Level Kesulitan</b></li>
                  <li>✨ <b>{t.p1_1}</b>{t.p1_2}</li>
                </ul>

                {gs.proStatus?.grammar ? (
                  <div style={{width: "100%", background: "#7C3AED", color: "#fff", padding: 16, borderRadius: 16, fontSize: 15, fontWeight: 900, textAlign: "center", opacity: 0.8}}>
                    ✅ AKTIF
                  </div>
                ) : (
                  <button className="tap" onClick={() => setShowQR("grammar")} style={{width: "100%", background: "#8B5CF6", color: "#fff", border: "none", padding: 16, borderRadius: 16, fontSize: 15, fontWeight: 900, cursor: "pointer", boxShadow: "0 8px 20px rgba(139,92,246,.3)"}}>
                    {t.subBtn}
                  </button>
                )}
              </div>
            </div>

            <div style={{background: "linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%)", borderRadius: 24, padding: "2px", boxShadow: "0 12px 32px rgba(37,99,235,.3)", animation: "fadeUp .45s ease", position: "relative", marginBottom: 16}}>
              <div style={{position: "absolute", top: -12, right: 20, background: "linear-gradient(135deg, #F59E0B, #FCD34D)", color: "#fff", padding: "4px 12px", borderRadius: 99, fontSize: 11, fontWeight: 900, boxShadow: "0 4px 10px rgba(245,158,11,.4)"}}>{t.popular}</div>
              <div style={{background: "linear-gradient(135deg, #0F172A 0%, #1E3A8A 100%)", borderRadius: 22, padding: 24}}>
                <div style={{fontFamily: "Exo 2", fontWeight: 900, fontSize: 20, color: "#93C5FD"}}>{t.engTitle}</div>
                <div style={{fontSize: 32, fontWeight: 900, color: "#fff", margin: "8px 0"}}>
                  Rp 65.000<span style={{fontSize: 14, fontWeight: 600, color: "#94A3B8"}}>{t.proPrice}</span>
                </div>
                <div style={{fontSize: 13, color: "#94A3B8", marginBottom: 20}}>{t.engDesc}</div>
                
                <ul style={{listStyle: "none", padding: 0, margin: 0, fontSize: 13, color: "#E2E8F0", lineHeight: 2, marginBottom: 24}}>
                  <li>🗣️ <b>{t.e1}</b></li>
                  <li>✍️ <b>{t.e2}</b></li>
                  <li>💼 <b>{t.e3}</b></li>
                  <li>✨ <b>{t.p1_1}</b>{t.p1_2}</li>
                </ul>

                {gs.proStatus?.english ? (
                  <div style={{width: "100%", background: "#1E3A8A", color: "#fff", padding: 16, borderRadius: 16, fontSize: 15, fontWeight: 900, textAlign: "center", opacity: 0.8}}>
                    ✅ AKTIF
                  </div>
                ) : (
                  <button className="tap" onClick={() => setShowQR("english")} style={{width: "100%", background: "linear-gradient(135deg, #F59E0B, #FCD34D)", color: "#78350F", border: "none", padding: 16, borderRadius: 16, fontSize: 15, fontWeight: 900, cursor: "pointer", boxShadow: "0 8px 20px rgba(245,158,11,.4)"}}>
                    {t.subBtn}
                  </button>
                )}
              </div>
            </div>

            <div style={{background: "linear-gradient(135deg, #059669 0%, #10B981 100%)", borderRadius: 24, padding: "2px", boxShadow: "0 12px 32px rgba(16,185,129,.2)", animation: "fadeUp .5s ease", position: "relative"}}>
              
              <div style={{background:"var(--bg-card)", borderRadius: 22, padding: 24, border: "1px solid #A7F3D0"}}>
                <div style={{fontFamily: "Exo 2", fontWeight: 900, fontSize: 20, color: "#059669"}}>AI Academy PRO 👑</div>
                <div style={{fontSize: 32, fontWeight: 900, color: "#1E2A45", margin: "8px 0"}}>
                  Rp 70.000<span style={{fontSize: 14, fontWeight: 600, color: "#94A3B8"}}>{t.proPrice}</span>
                </div>
                <div style={{fontSize: 13, color: "#64748B", marginBottom: 20}}>{t.proDesc}</div>
                
                <ul style={{listStyle: "none", padding: 0, margin: 0, fontSize: 13, color: "#475569", lineHeight: 2, marginBottom: 24}}>
                  <li>✨ <b>{t.p1_1}</b>{t.p1_2}</li>
                  <li>🏆 <b>{t.p3_1}</b>{t.p3_2}</li>
                  <li>💬 <b>{t.p4_1}</b>{t.p4_2}</li>
                </ul>

                {gs.proStatus?.scholar ? (
                  <div style={{width: "100%", background: "#059669", color: "#fff", padding: 16, borderRadius: 16, fontSize: 15, fontWeight: 900, textAlign: "center", opacity: 0.8}}>
                    ✅ AKTIF
                  </div>
                ) : (
                  <button className="tap" onClick={() => setShowQR("scholar")} style={{width: "100%", background: "#10B981", color: "#fff", border: "none", padding: 16, borderRadius: 16, fontSize: 15, fontWeight: 900, cursor: "pointer", boxShadow: "0 8px 20px rgba(16,185,129,.3)"}}>
                    {t.subBtn}
                  </button>
                )}
              </div>
            </div>
          </>
      </div>

      {showQR && (
        <div style={{position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", zIndex: 1000, display: "flex", justifyContent: "center", alignItems: "center"}}>
          <div style={{background:"var(--bg-card)", width: "85%", maxWidth: 360, borderRadius: 24, padding: 24, textAlign: "center", animation: "fadeUp .3s ease", position: "relative"}}>
            <button className="tap" onClick={() => setShowQR(false)} style={{position: "absolute", top: 12, right: 12, background: "transparent", border: "none", fontSize: 20, color: "#94A3B8", cursor: "pointer"}}>✕</button>
            
            <h3 style={{fontFamily: "Exo 2", fontWeight: 900, fontSize: 20, color: "#1E2A45", marginBottom: 8}}>{t.modTitle}</h3>
            <p style={{fontSize: 13, color: "#64748B", marginBottom: 20}}>{t.modDesc}</p>
            
            {paymentSuccess ? (
              <div style={{padding: "40px 0", animation: "fadeUp .5s ease"}}>
                <div style={{fontSize: 60, marginBottom: 16}}>✅</div>
                <div style={{fontSize: 18, fontWeight: 800, color: "#10B981"}}>{t.sucTitle}</div>
                <div style={{fontSize: 12, color: "#64748B", marginTop: 8}}>{t.sucDesc}</div>
              </div>
            ) : (
              <>
                <div style={{background:"var(--bg-main)", padding: 16, borderRadius: 16, border: "2px dashed #CBD5E1", marginBottom: 16, display: "flex", flexDirection: "column", alignItems: "center"}}>
                  <div style={{width: 150, height: 150, background: "linear-gradient(45deg, #1E2A45 25%, transparent 25%, transparent 75%, #1E2A45 75%, #1E2A45), linear-gradient(45deg, #1E2A45 25%, transparent 25%, transparent 75%, #1E2A45 75%, #1E2A45)", backgroundSize: "20px 20px", backgroundPosition: "0 0, 10px 10px", marginBottom: 12, border: "8px solid #fff", borderRadius: 8}}></div>
                  <div style={{fontSize: 14, fontWeight: 900, fontFamily: "Exo 2", color: "#1E2A45"}}>QRIS SUMBER AI</div>
                  <div style={{fontSize: 12, color: "#64748B", marginTop: 4}}>Semua E-Wallet / M-Banking didukung</div>
                </div>

                <div style={{fontSize: 15, fontWeight: 800, color: "#1E2A45", marginBottom: 12}}>{t.total} <span style={{color: "#2563EB"}}>{showQR === "english" ? "Rp 65.000" : showQR === "grammar" ? "Rp 50.000" : "Rp 70.000"}</span></div>
                
                <button className="tap" onClick={() => window.open(`https://wa.me/6285269236207?text=${encodeURIComponent(getWaText())}`, "_blank")} style={{width: "100%", background: "#25D366", color: "#fff", border: "none", padding: 14, borderRadius: 12, fontSize: 14, fontWeight: 800, cursor: "pointer", display: "flex", justifyContent: "center", alignItems: "center", gap: 8, boxShadow: "0 4px 12px rgba(37,211,102,.3)"}}>
                  <span style={{fontSize: 18}}>✅</span> {t.waBtn}
                </button>

                <button className="tap" onClick={handleSimulatePayment} style={{width: "100%", background: "transparent", color: "#94A3B8", border: "none", padding: 10, fontSize: 11, fontWeight: 700, cursor: "pointer", marginTop: 8, textDecoration: "underline"}}>
                  {t.demoBtn}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

