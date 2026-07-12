import React, { useState } from 'react';
import { C } from '../data/mockData';
import { modulesData } from '../data/modulesData';

const Tag = ({ label, color, bg }) => (
  <div style={{ background: bg, color: color, padding: "2px 8px", borderRadius: 6, fontSize: 10, fontWeight: 800 }}>
    {label}
  </div>
);

export default function AcademyScreen({ gs, onCoinEarned, onXPEarned, onNav, upgradeToPro }) {
  const [buyModal, setBuyModal] = useState(null);
  const [qrModal, setQrModal] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [readingModal, setReadingModal] = useState(null);
  const [readingPage, setReadingPage] = useState(0);

  const modules = modulesData;

  const handleSimulatePayment = () => {
    setPaymentSuccess(true);
    setTimeout(() => {
      const isAlreadyPro = gs.proStatus?.scholar;
      upgradeToPro(qrModal.type);
      let message = gs?.lang === 'en' ? "Payment Successful! Package activated." : "Pembayaran Berhasil! Paket telah aktif.";
      alert(message);
      setQrModal(null);
      setPaymentSuccess(false);
    }, 2000);
  };

  const isEn = gs?.lang === 'en';

  return (
    <div style={{paddingTop: 80, paddingBottom: 24, flex: 1, background:"var(--bg-main)", position: "relative"}}>
      <div style={{padding: "0 16px"}}>
        <div style={{display: "flex", alignItems: "center", marginBottom: 24}}>
          <button className="tap" onClick={() => onNav('home')} style={{background: "#fff", border: "1px solid #E2E8F0", padding: "8px 16px", borderRadius: "99px", display: "flex", alignItems: "center", gap: 6, cursor: "pointer", marginRight: 16, boxShadow: "0 4px 12px rgba(0,0,0,0.04)", flexShrink: 0, color: "#1E293B", fontWeight: 800, fontSize: 13}}>
            ◀ {isEn ? "BACK" : "KEMBALI"}
          </button>
          <div style={{flex: 1}}>
            <h2 style={{fontFamily: "Exo 2", fontWeight: 900, fontSize: 24, color: C.text, margin: 0}}>AI Academy 📚</h2>
            <p style={{fontSize: 13, color: C.textSec, margin: "4px 0 0 0"}}>{isEn ? "Learn interactive AI modules." : "Pelajari modul AI interaktif."}</p>
          </div>
        </div>

        {/* MODULE 1: GRATIS */}
        <div 
          className="tap" 
          onClick={() => window.open('https://restor.lensetek.online/', '_blank')} 
          style={{
            background:"var(--bg-card)", 
            borderRadius: 18, 
            padding: 16, 
            marginBottom: 12, 
            boxShadow: C.shadowCard, 
            display: "flex", 
            alignItems: "center", 
            gap: 12, 
            animation: `fadeUp .3s ease both`,
            position: "relative",
            cursor: "pointer"
          }}
        >
          <div style={{width: 48, height: 48, borderRadius: 14, background: C.blueLt, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0}}>
            📘
          </div>
          <div style={{flex: 1}}>
            <div style={{fontFamily: "Exo 2", fontWeight: 800, fontSize: 15, color: C.text, marginBottom: 4}}>Agentic AI Researchers & Authors</div>
            <div style={{fontSize: 11, color: C.textSec, lineHeight: 1.5, marginBottom: 6}}>{isEn ? "Free interactive module for AI Researchers." : "Modul interaktif gratis untuk Peneliti AI."}</div>
            <div style={{display: "flex", gap: 8}}>
              <Tag label="FREE" color="#10B981" bg="#D1FAE5" />
            </div>
          </div>
        </div>

        {/* MODULE 2: BERBAYAR */}
        <div 
          className="tap" 
          onClick={() => {
            const isLocked = !gs.proStatus?.scholar;
            if(isLocked) {
              setBuyModal({ id: 'scholar', title: "AI Agent for Brevet A & B Course", price: "Rp 69.000" });
            } else {
              window.open('https://asadel.co.id/courses/brevet-ab', '_blank');
            }
          }} 
          style={{
            background:"var(--bg-card)", 
            borderRadius: 18, 
            padding: 16, 
            marginBottom: 12, 
            boxShadow: C.shadowCard, 
            display: "flex", 
            alignItems: "center", 
            gap: 12, 
            animation: `fadeUp .4s ease both`,
            filter: !gs.proStatus?.scholar ? "grayscale(100%) opacity(0.7)" : "none",
            position: "relative",
            cursor: "pointer"
          }}
        >
          <div style={{width: 48, height: 48, borderRadius: 14, background: C.blueLt, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0}}>
            {!gs.proStatus?.scholar ? "🔒" : "📘"}
          </div>
          <div style={{flex: 1}}>
            <div style={{fontFamily: "Exo 2", fontWeight: 800, fontSize: 15, color: C.text, marginBottom: 4}}>AI Agent for Brevet A & B Course</div>
            <div style={{fontSize: 11, color: C.textSec, lineHeight: 1.5, marginBottom: 6}}>{isEn ? "Premium course for Brevet A & B." : "Kursus premium Brevet A & B."}</div>
            <div style={{display: "flex", gap: 8}}>
              <Tag label="PRO" color="#fff" bg="#3B82F6" />
            </div>
          </div>
        </div>
      </div>

      {/* MODAL PILIHAN PEMBELIAN */}
      {buyModal && (
        <div style={{position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", zIndex: 1000, display: "flex", justifyContent: "center", alignItems: "center"}}>
          <div style={{background:"var(--bg-card)", width: "85%", maxWidth: 360, borderRadius: 24, padding: 24, animation: "fadeUp .3s ease", position: "relative"}}>
            <button className="tap" onClick={() => setBuyModal(null)} style={{position: "absolute", top: 12, right: 12, background: "transparent", border: "none", fontSize: 20, color: "#94A3B8", cursor: "pointer"}}>✕</button>
            
            <h3 style={{fontFamily: "Exo 2", fontWeight: 900, fontSize: 20, color: "#1E2A45", marginBottom: 8}}>{isEn ? "Unlock Module Access" : "Buka Akses Modul"}</h3>
            <p style={{fontSize: 13, color: "#64748B", marginBottom: 20}}>{isEn ? "The module " : "Modul "}<b>{buyModal.title}</b>{isEn ? " is locked. Please select your subscription plan:" : " ini terkunci. Silakan pilih paket langganan Anda:"}</p>
            
            {/* Opsi Beli Satuan */}
            <div className="tap" onClick={() => { setQrModal({ type: buyModal.id, price: buyModal.price, title: buyModal.title }); setBuyModal(null); }} style={{background:"var(--bg-main)", border: "2px solid #CBD5E1", borderRadius: 16, padding: 16, marginBottom: 12, cursor: "pointer"}}>
              <div style={{fontSize: 12, color: "#64748B", fontWeight: 800, marginBottom: 4}}>{isEn ? "BUY SINGLE" : "BELI SATUAN"}</div>
              <div style={{fontFamily: "Exo 2", fontWeight: 900, fontSize: 16, color: "#1E2A45", marginBottom: 4}}>{buyModal.title}</div>
              <div style={{fontSize: 18, fontWeight: 900, color: "#2563EB"}}>{buyModal.price}</div>
            </div>

            {/* Opsi Beli Bundel */}
            <div className="tap" onClick={() => { setQrModal({ type: 'scholar', price: "Rp 69.000", title: "AI Academy Bundle (Semua Modul)" }); setBuyModal(null); }} style={{background: "linear-gradient(135deg, #1E3A8A, #3B82F6)", borderRadius: 16, padding: 16, cursor: "pointer", color: "#fff", boxShadow: "0 8px 24px rgba(37,99,235,.3)", position: "relative", overflow: "hidden"}}>
              <div style={{position: "absolute", top: 0, right: 0, background: "#F59E0B", color: "#fff", padding: "4px 12px", borderBottomLeftRadius: 16, fontSize: 10, fontWeight: 900}}>{isEn ? "BEST VALUE" : "LEBIH HEMAT"}</div>
              <div style={{fontSize: 12, color: "#93C5FD", fontWeight: 800, marginBottom: 4}}>{isEn ? "BUY BUNDLE" : "BELI BUNDEL"}</div>
              <div style={{fontFamily: "Exo 2", fontWeight: 900, fontSize: 16, marginBottom: 4}}>AI Academy PRO 👑</div>
              <div style={{fontSize: 13, color: "#E2E8F0", marginBottom: 8}}>{isEn ? "Unlock ALL premium modules." : "Buka SEMUA modul premium."}</div>
              <div style={{fontSize: 18, fontWeight: 900, color: "#fff"}}>Rp 69.000</div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL SIMULASI PEMBAYARAN QRIS */}
      {qrModal && (
        <div style={{position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", zIndex: 1000, display: "flex", justifyContent: "center", alignItems: "center"}}>
          <div style={{background:"var(--bg-card)", width: "85%", maxWidth: 360, borderRadius: 24, padding: 24, textAlign: "center", animation: "fadeUp .3s ease", position: "relative"}}>
            <button className="tap" onClick={() => setQrModal(null)} style={{position: "absolute", top: 12, right: 12, background: "transparent", border: "none", fontSize: 20, color: "#94A3B8", cursor: "pointer"}}>✕</button>
            
            <h3 style={{fontFamily: "Exo 2", fontWeight: 900, fontSize: 20, color: "#1E2A45", marginBottom: 8}}>{isEn ? "Complete Payment" : "Selesaikan Pembayaran"}</h3>
            <p style={{fontSize: 13, color: "#64748B", marginBottom: 20}}>{isEn ? "You are buying:" : "Anda membeli:"} <b>{qrModal.title}</b></p>
            
            {paymentSuccess ? (
              <div style={{padding: "40px 0", animation: "fadeUp .5s ease"}}>
                <div style={{fontSize: 60, marginBottom: 16}}>✅</div>
                <div style={{fontSize: 18, fontWeight: 800, color: "#10B981"}}>{isEn ? "Payment Successful!" : "Pembayaran Berhasil!"}</div>
                <div style={{fontSize: 12, color: "#64748B", marginTop: 8}}>{isEn ? "Module successfully unlocked..." : "Modul berhasil dibuka..."}</div>
              </div>
            ) : (
              <>
                <div style={{background:"var(--bg-main)", padding: 16, borderRadius: 16, border: "2px dashed #CBD5E1", marginBottom: 16, display: "flex", flexDirection: "column", alignItems: "center"}}>
                  <div style={{width: 150, height: 150, background: "linear-gradient(45deg, #1E2A45 25%, transparent 25%, transparent 75%, #1E2A45 75%, #1E2A45), linear-gradient(45deg, #1E2A45 25%, transparent 25%, transparent 75%, #1E2A45 75%, #1E2A45)", backgroundSize: "20px 20px", backgroundPosition: "0 0, 10px 10px", marginBottom: 12, border: "8px solid #fff", borderRadius: 8}}></div>
                  <div style={{fontSize: 14, fontWeight: 900, fontFamily: "Exo 2", color: "#1E2A45"}}>{isEn ? "Or Transfer To:" : "Atau Transfer Ke:"}</div>
                  <div style={{fontSize: 12, color: "#64748B", marginTop: 4}}>DANA / GoPay: <b>085269236207</b></div>
                  <div style={{fontSize: 12, color: "#64748B"}}>{isEn ? "a.n. SumberAI Admin" : "a.n. Admin SumberAI"}</div>
                </div>

                <div style={{fontSize: 15, fontWeight: 800, color: "#1E2A45", marginBottom: 12}}>{isEn ? "Total Bill:" : "Total Tagihan:"} <span style={{color: "#2563EB"}}>{qrModal.price}</span></div>
                
                <button className="tap" onClick={() => window.open(`https://wa.me/6287841328189?text=Halo%20Admin%20SumberAI,%20saya%20sudah%20mentransfer%20${qrModal.price}%20untuk%20membeli%20${qrModal.title}.%20Berikut%20bukti%20pembayaran%20saya:`, "_blank")} style={{width: "100%", background: "#25D366", color: "#fff", border: "none", padding: 14, borderRadius: 12, fontSize: 14, fontWeight: 800, cursor: "pointer", display: "flex", justifyContent: "center", alignItems: "center", gap: 8, boxShadow: "0 4px 12px rgba(37,211,102,.3)"}}>
                  <span style={{fontSize: 18}}>💬</span> {isEn ? "Confirm via WhatsApp" : "Konfirmasi via WhatsApp"}
                </button>

                <button className="tap" onClick={handleSimulatePayment} style={{width: "100%", background: "transparent", color: "#94A3B8", border: "none", padding: 10, fontSize: 11, fontWeight: 700, cursor: "pointer", marginTop: 8, textDecoration: "underline"}}>
                  {isEn ? "(Demo) Simulate Paid Payment" : "(Demo) Simulasikan Pembayaran Lunas"}
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* MODAL BACA MATERI */}
      {readingModal && (
        <div style={{position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.8)", backdropFilter: "blur(4px)", zIndex: 2000, overflowY: "auto", display: "flex", justifyContent: "center", alignItems: "flex-start", padding: "0"}}>
          <div style={{background:"var(--bg-main)", width: "100%", maxWidth: 430, flex: 1, padding: "80px 20px 100px", animation: "fadeUp .3s ease", position: "relative"}}>
            <button className="tap" onClick={() => setReadingModal(null)} style={{position: "absolute", top: 20, right: 20, background: "rgba(0,0,0,0.05)", borderRadius: "50%", width: 36, height: 36, border: "none", fontSize: 18, color: "var(--text-main)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center"}}>✕</button>
            
            <Tag label={readingModal.isPremium ? "PRO MODUL" : (isEn ? "FREE MODUL" : "MODUL GRATIS")} color={readingModal.isPremium ? "#fff" : "#059669"} bg={readingModal.isPremium ? "#3B82F6" : "#D1FAE5"} />
            
            <h2 style={{fontFamily: "Exo 2", fontWeight: 900, fontSize: 28, color: "var(--text-main)", marginTop: 12, marginBottom: 8, lineHeight: 1.2}}>{readingModal.title}</h2>
            <div style={{fontSize: 14, color: "var(--text-sec)", marginBottom: 24, paddingBottom: 16, borderBottom: "1px solid var(--border-color)", lineHeight: 1.5}}>{isEn && readingModal.descEn ? readingModal.descEn : readingModal.desc}</div>
            
            <div style={{fontSize: 16, color: "var(--text-main)", lineHeight: 1.8}}>
              <p style={{marginBottom: 16, background: "var(--bg-main)", padding: 16, borderRadius: 16, borderLeft: "4px solid #3B82F6", whiteSpace: "pre-line"}}>{readingModal.content[readingPage]}</p>
            </div>

            <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 24, marginBottom: 16}}>
              <button disabled={readingPage === 0} onClick={() => setReadingPage(p => p - 1)} style={{padding: "10px 16px", borderRadius: 12, border: "none", background: readingPage === 0 ? "#E2E8F0" : "#DBEAFE", color: readingPage === 0 ? "#94A3B8" : "#2563EB", fontWeight: 700, cursor: readingPage === 0 ? "not-allowed" : "pointer", transition: "all .2s"}}>{isEn ? "Previous" : "Sebelumnya"}</button>
              <div style={{fontSize: 12, fontWeight: 800, color: "var(--text-sec)"}}>{isEn ? "Page" : "Halaman"} {readingPage + 1} / {readingModal.content.length}</div>
              {readingPage < readingModal.content.length - 1 ? (
                <button onClick={() => setReadingPage(p => p + 1)} style={{padding: "10px 16px", borderRadius: 12, border: "none", background: "#DBEAFE", color: "#2563EB", fontWeight: 700, cursor: "pointer", transition: "all .2s"}}>{isEn ? "Next" : "Selanjutnya"}</button>
              ) : (
                <div style={{width: 100}}></div>
              )}
            </div>

            {readingPage === readingModal.content.length - 1 && (
              <button className="tap" onClick={() => {
                const isPro = gs?.proStatus?.scholar;
                onXPEarned(readingModal.xp);
                const title = readingModal.title;
                const xp = readingModal.xp;
                setReadingModal(null);
                alert(isEn ? `Congratulations! You have completed the module "${title}".\n\nYour Rewards:\n+${xp} XP` : `Selamat! Anda telah menyelesaikan modul "${title}".\n\nHadiah Anda:\n+${xp} XP`);
              }} style={{width: "100%", background: "linear-gradient(135deg, #10B981, #34D399)", color: "#fff", border: "none", padding: "16px", borderRadius: 16, fontSize: 16, fontWeight: 800, marginTop: 16, cursor: "pointer", boxShadow: "0 4px 12px rgba(16,185,129,.3)", display: "flex", justifyContent: "center", alignItems: "center", gap: 8, animation: "fadeUp .3s ease"}}>
                <span>✅</span> {isEn ? "Complete & Claim Reward" : "Selesaikan & Klaim Hadiah"}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
