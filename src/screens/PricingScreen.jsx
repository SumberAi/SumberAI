import React, { useState, useEffect } from 'react';

export default function PricingScreen({ gs, onNav, upgradeToPro }) {
  const [loadingPayment, setLoadingPayment] = useState(false);
  const lang = gs.lang || 'id';

  useEffect(() => {
    const snapScript = "https://app.sandbox.midtrans.com/snap/snap.js";
    const clientKey = import.meta.env.VITE_MIDTRANS_CLIENT_KEY || 'Mid-client-FJdipn9UYe4nxjZS';
    const script = document.createElement("script");
    script.src = snapScript;
    script.setAttribute("data-client-key", clientKey);
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    }
  }, []);

  const handleMidtransPayment = async (planKey) => {
    setLoadingPayment(true);
    let amount = 0;
    let name = "";
    if (planKey === 'grammar') { amount = 29900; name = "ENGLISH LAB (SIMULASI GRAMMAR)"; }
    else if (planKey === 'english') { amount = 69900; name = "AI ENGLISH TUTOR"; }
    else if (planKey === 'scholar') { amount = 69000; name = "Paket AI Scholar PRO"; }
    else if (planKey === 'full') { amount = 149900; name = "PAKET FULL (LAB + TUTOR + ACADEMY)"; }
    
    try {
      const res = await fetch('/api/payment/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id: `PRO-${planKey}-${Date.now()}`,
          gross_amount: amount,
          first_name: gs?.displayName || "Player",
          email: "player@sumberai.com",
          item_name: name
        })
      });
      const data = await res.json();
      
      if (data.token) {
        window.snap.pay(data.token, {
          onSuccess: function(result) {
             const message = lang === 'id' ? "Pembayaran Berhasil! Paket telah aktif." : "Payment Successful! Package is now active.";
             alert(message);
             if (planKey === 'full') {
               upgradeToPro('grammar');
               upgradeToPro('english');
               upgradeToPro('scholar');
             } else {
               upgradeToPro(planKey);
             }
          },
          onPending: function(result) {
             alert(lang === 'id' ? "Pembayaran tertunda. Silakan selesaikan pembayaran Anda." : "Payment pending. Please complete your payment.");
          },
          onError: function(result) {
             alert(lang === 'id' ? "Pembayaran gagal. Silakan coba lagi." : "Payment failed. Please try again.");
          },
          onClose: function() {
             console.log('Customer closed the popup without finishing the payment');
          }
        });
      } else {
        alert((lang === 'id' ? "Gagal memuat sistem pembayaran: " : "Failed to load payment system: ") + (data.error || data.message || "Unknown Error"));
      }
    } catch (err) {
      console.error(err);
      alert((lang === 'id' ? "Terjadi kesalahan jaringan: " : "Network error occurred: ") + err.message);
    }
    setLoadingPayment(false);
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
    proDesc: lang === 'id' ? "Buka 20 modul premium level industri di AI Academy + Bonus Instan 1500 Koin di awal berlangganan!" : "Unlock all 20 premium industry-level modules in AI Academy + 1500 Coins instant bonus!",
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
    e3: lang === 'id' ? "Buka Mode Simulasi Interview SMA/SMK" : "Unlock High/Vocational School Interview Simulation",
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

  return (
    <div style={{paddingTop: 24, paddingBottom: 100, minHeight: "100vh", background:"var(--bg-main)", position: "relative"}}>
      <div style={{padding: "0 16px"}}>
        <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24}}>
          <h2 style={{fontFamily: "Exo 2", fontWeight: 900, fontSize: 24, color: "#1E2A45", margin: 0}}>{t.title}</h2>
          <div style={{display: "flex", gap: 12, alignItems: "center"}}>
            <button className="tap" onClick={() => onNav("home")} style={{background: "#E2E8F0", color: "#475569", border: "none", borderRadius: "50%", width: 32, height: 32, fontWeight: "bold", cursor: "pointer"}}>✕</button>
          </div>
        </div>
        
        <p style={{fontSize: 14, color: "#64748B", marginBottom: 24, lineHeight: 1.5}}>
          {t.desc}
        </p>

        <div style={{display: "flex", flexDirection: "column", gap: 16, animation: "fadeUp .4s ease"}}>
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
                  Rp 29.900<span style={{fontSize: 14, fontWeight: 600, color: "#94A3B8"}}>{t.proPrice}</span>
                </div>
                <div style={{fontSize: 13, color: "#64748B", marginBottom: 20}}>{lang === 'en' ? "Access 3 Grammar Levels (B, I, A) with double coins. Collect up to 840 Coins per month!" : "Akses 3 Level Grammar (B, I, A) dengan koin ganda. Kumpulkan hingga maksimal 840 Koin per bulan!"}</div>
                
                <ul style={{listStyle: "none", padding: 0, margin: 0, fontSize: 13, color: "#475569", lineHeight: 2, marginBottom: 24}}>
                  <li>📖 <b>{lang === 'en' ? "Grammar Question Combinations" : "Kombinasi Soal Tata Bahasa"}</b></li>
                  <li>💡 <b>{lang === 'en' ? "Detailed Explanation per Question" : "Pembahasan Detail per Soal"}</b></li>
                  <li>🔓 <b>{lang === 'en' ? "Unlock All Difficulty Levels" : "Buka Semua Level Kesulitan"}</b></li>
                  <li>✨ <b>{t.p1_1}</b>{t.p1_2}</li>
                </ul>

                {gs.proStatus?.grammar ? (
                  <div style={{width: "100%", background: "#7C3AED", color: "#fff", padding: 16, borderRadius: 16, fontSize: 15, fontWeight: 900, textAlign: "center", opacity: 0.8}}>
                    ✅ {lang === 'en' ? "ACTIVE" : "AKTIF"}
                  </div>
                ) : (
                  <button className="tap hover-card" onClick={() => handleMidtransPayment("grammar")} disabled={loadingPayment} style={{width: "100%", background: "#8B5CF6", color: "#fff", border: "none", padding: 16, borderRadius: 16, fontSize: 15, fontWeight: 900, cursor: loadingPayment ? "wait" : "pointer", boxShadow: "0 8px 20px rgba(139,92,246,.3)"}}>
                    {loadingPayment ? "..." : t.subBtn}
                  </button>
                )}
              </div>
            </div>

            <div style={{background: "linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%)", borderRadius: 24, padding: "2px", boxShadow: "0 12px 32px rgba(37,99,235,.3)", animation: "fadeUp .45s ease", position: "relative", marginBottom: 16}}>
              <div style={{position: "absolute", top: -12, right: 20, background: "linear-gradient(135deg, #F59E0B, #FCD34D)", color: "#fff", padding: "4px 12px", borderRadius: 99, fontSize: 11, fontWeight: 900, boxShadow: "0 4px 10px rgba(245,158,11,.4)"}}>{t.popular}</div>
              <div style={{background: "linear-gradient(135deg, #0F172A 0%, #1E3A8A 100%)", borderRadius: 22, padding: 24}}>
                <div style={{fontFamily: "Exo 2", fontWeight: 900, fontSize: 20, color: "#93C5FD"}}>{t.engTitle}</div>
                <div style={{fontSize: 32, fontWeight: 900, color: "#fff", margin: "8px 0"}}>
                  Rp 69.900<span style={{fontSize: 14, fontWeight: 600, color: "#94A3B8"}}>{t.proPrice}</span>
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
                    ✅ {lang === 'en' ? "ACTIVE" : "AKTIF"}
                  </div>
                ) : (
                  <button className="tap hover-card" onClick={() => handleMidtransPayment("english")} disabled={loadingPayment} style={{width: "100%", background: "linear-gradient(135deg, #F59E0B, #FCD34D)", color: "#78350F", border: "none", padding: 16, borderRadius: 16, fontSize: 15, fontWeight: 900, cursor: loadingPayment ? "wait" : "pointer", boxShadow: "0 8px 20px rgba(245,158,11,.4)"}}>
                    {loadingPayment ? "..." : t.subBtn}
                  </button>
                )}
              </div>
            </div>

            <div style={{background: "linear-gradient(135deg, #059669 0%, #10B981 100%)", borderRadius: 24, padding: "2px", boxShadow: "0 12px 32px rgba(16,185,129,.2)", animation: "fadeUp .5s ease", position: "relative"}}>
              
              <div style={{background:"var(--bg-card)", borderRadius: 22, padding: 24, border: "1px solid #A7F3D0"}}>
                <div style={{fontFamily: "Exo 2", fontWeight: 900, fontSize: 20, color: "#059669"}}>AI Academy PRO 👑</div>
                <div style={{fontSize: 32, fontWeight: 900, color: "#1E2A45", margin: "8px 0"}}>
                  Rp 69.000<span style={{fontSize: 14, fontWeight: 600, color: "#94A3B8"}}>{t.proPrice}</span>
                </div>
                <div style={{fontSize: 13, color: "#059669", fontWeight: 800, marginBottom: 8}}>{lang === 'en' ? "Or Buy Separately: Rp 9.900 / module" : "Atau Beli Satuan: Rp 9.900 / modul"}</div>
                <div style={{fontSize: 13, color: "#64748B", marginBottom: 20}}>{t.proDesc}</div>
                
                <ul style={{listStyle: "none", padding: 0, margin: 0, fontSize: 13, color: "#475569", lineHeight: 2, marginBottom: 24}}>
                  <li>✨ <b>{t.p1_1}</b>{t.p1_2}</li>
                  <li>🏆 <b>{t.p3_1}</b>{t.p3_2}</li>
                  <li>💬 <b>{t.p4_1}</b>{t.p4_2}</li>
                </ul>

                {gs.proStatus?.scholar ? (
                  <div style={{width: "100%", background: "#059669", color: "#fff", padding: 16, borderRadius: 16, fontSize: 15, fontWeight: 900, textAlign: "center", opacity: 0.8}}>
                    ✅ {lang === 'en' ? "ACTIVE" : "AKTIF"}
                  </div>
                ) : (
                  <button className="tap hover-card" onClick={() => handleMidtransPayment("scholar")} disabled={loadingPayment} style={{width: "100%", background: "#10B981", color: "#fff", border: "none", padding: 16, borderRadius: 16, fontSize: 15, fontWeight: 900, cursor: loadingPayment ? "wait" : "pointer", boxShadow: "0 8px 20px rgba(16,185,129,.3)"}}>
                    {loadingPayment ? "..." : t.subBtn}
                  </button>
                )}
              </div>
            </div>

            <div style={{background: "linear-gradient(135deg, #FCD34D 0%, #F59E0B 100%)", borderRadius: 24, padding: "2px", boxShadow: "0 12px 32px rgba(245,158,11,.3)", animation: "fadeUp .6s ease", position: "relative", marginTop: 16}}>
              <div style={{position: "absolute", top: -12, right: 20, background: "#EF4444", color: "#fff", padding: "4px 12px", borderRadius: 99, fontSize: 11, fontWeight: 900, boxShadow: "0 4px 10px rgba(239,68,68,.4)"}}>BEST DEAL 🔥</div>
              <div style={{background:"var(--bg-card)", borderRadius: 22, padding: 24, border: "1px solid #FDE68A"}}>
                <div style={{fontFamily: "Exo 2", fontWeight: 900, fontSize: 20, color: "#D97706"}}>PAKET FULL BUNDLE 🌟</div>
                <div style={{fontSize: 32, fontWeight: 900, color: "#1E2A45", margin: "8px 0"}}>
                  Rp 149.900<span style={{fontSize: 14, fontWeight: 600, color: "#94A3B8"}}>{lang === 'en' ? "/forever" : "/selamanya"}</span>
                </div>
                <div style={{fontSize: 13, color: "#64748B", marginBottom: 20}}>{lang === 'en' ? "English Lab + AI English Tutor + AI Academy PRO (All Premium Features!)" : "English Lab + AI English Tutor + AI Academy PRO (Semua Fitur Premium!)"}</div>
                
                <ul style={{listStyle: "none", padding: 0, margin: 0, fontSize: 13, color: "#475569", lineHeight: 2, marginBottom: 24}}>
                  <li>✔️ <b>{lang === 'en' ? "Access All English Lab Levels" : "Akses Semua Level English Lab"}</b></li>
                  <li>✔️ <b>{lang === 'en' ? "Access All AI Tutor Modes" : "Akses Semua Mode AI Tutor"}</b></li>
                  <li>✔️ <b>{lang === 'en' ? "Full Access to 20 AI Academy Modules" : "Akses Penuh 20 Modul AI Academy"}</b></li>
                </ul>

                {(gs.proStatus?.grammar && gs.proStatus?.english && gs.proStatus?.scholar) ? (
                  <div style={{width: "100%", background: "#D97706", color: "#fff", padding: 16, borderRadius: 16, fontSize: 15, fontWeight: 900, textAlign: "center", opacity: 0.8}}>
                    ✅ {lang === 'en' ? "ACTIVE" : "AKTIF"}
                  </div>
                ) : (
                  <button className="tap hover-card" onClick={() => handleMidtransPayment("full")} disabled={loadingPayment} style={{width: "100%", background: "linear-gradient(135deg, #F59E0B, #FCD34D)", color: "#78350F", border: "none", padding: 16, borderRadius: 16, fontSize: 15, fontWeight: 900, cursor: loadingPayment ? "wait" : "pointer", boxShadow: "0 8px 20px rgba(245,158,11,.4)"}}>
                    {loadingPayment ? "..." : t.subBtn}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}
