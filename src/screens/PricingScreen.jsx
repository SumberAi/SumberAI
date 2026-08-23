import React, { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { Purchases } from '@revenuecat/purchases-capacitor';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase'; // verify path if needed, usually '../firebase/config' or '../firebase' is exported

export default function PricingScreen({ gs, onNav, upgradeToPro }) {
  const [loadingPayment, setLoadingPayment] = useState(false);
  const lang = gs.lang || 'id';

  useEffect(() => {
    // Inisialisasi RevenueCat untuk iOS dan Android
    if (Capacitor.isNativePlatform() && gs?.uid) {
      Purchases.setLogLevel({ level: "DEBUG" });
      if (Capacitor.getPlatform() === 'ios') {
        // GANTI STRING INI dengan Public API Key Apple dari RevenueCat Anda:
        Purchases.configure({ apiKey: "appl_gamCCOdshRPHSKjOlEvaVRqvezt", appUserID: gs.uid });
      } else if (Capacitor.getPlatform() === 'android') {
        // GANTI STRING INI dengan Public API Key Google dari RevenueCat Anda:
        Purchases.configure({ apiKey: "goog_oSHvIMunUPGLptPYmKINvnyXbGi", appUserID: gs.uid });
      }
    }
  }, [gs?.uid]);

  const handlePurchase = async (planKey) => {
    if (!gs?.uid) {
      alert(lang === 'id' ? "Silakan masuk (login) atau daftar akun terlebih dahulu untuk mulai berlangganan." : "Please log in or register first to subscribe.");
      onNav("login");
      return;
    }
    // Trigger Google Ads Conversion Tracking Event
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'conversion', {
        'send_to': 'AW-17600263727/eDPSCJ_H5KEbEK_sushB',
        'value': 1.0,
        'currency': 'IDR'
      });
    }

    if (Capacitor.isNativePlatform()) {
      try {
        setLoadingPayment(true);
        let productId = "";
        if (planKey === 'grammar') productId = "sumberai_grammar_sub";
        else if (planKey === 'english') productId = "sumberai_english_sub";
        else if (planKey === 'full') productId = "sumberai_full_sub";
        
        // Google Play Billing v5+ (RevenueCat v13+) mewajibkan format: subscriptionId:basePlanId
        let fetchId = productId;
        if (Capacitor.getPlatform() === 'android') {
            fetchId = productId + ":bulanan";
        } else if (Capacitor.getPlatform() === 'ios') {
            // Mapping ID Apple yang baru dibuat di App Store Connect
            if (planKey === 'grammar') fetchId = "sumberai_grammar_pro";
            else if (planKey === 'english') fetchId = "sumberai_english_pro";
            else if (planKey === 'full') fetchId = "sumberai_full_bundle";
        }
        
        const { products } = await Purchases.getProducts({ 
          productIdentifiers: [fetchId]
        });
        if (!products || products.length === 0) {
          throw new Error("Product not found di Google Play");
        }
        const { customerInfo } = await Purchases.purchaseStoreProduct({ product: products[0] });
        
        // Asumsi berhasil jika sampai baris ini tanpa error lemparan
        const now = new Date().getTime();
        const thirtyDaysFromNow = now + (30 * 24 * 60 * 60 * 1000);
        
        const updateObj = {};
        if (planKey === 'grammar') {
            updateObj["proStatus.grammar"] = true;
            updateObj["proStatus.grammarExpiresAt"] = thirtyDaysFromNow;
        }
        if (planKey === 'english') {
            updateObj["proStatus.english"] = true;
            updateObj["proStatus.englishExpiresAt"] = thirtyDaysFromNow;
        }
        if (planKey === 'full') {
          updateObj["proStatus.scholar"] = true;
          updateObj["proStatus.english"] = true;
          updateObj["proStatus.englishExpiresAt"] = thirtyDaysFromNow;
          updateObj["proStatus.grammar"] = true;
          updateObj["proStatus.grammarExpiresAt"] = thirtyDaysFromNow;
        }
        await updateDoc(doc(db, "users", gs.uid), updateObj);
        
        if (upgradeToPro) upgradeToPro(planKey);
        alert(lang === 'id' ? "Upgrade PRO Berhasil!" : "PRO Upgrade Successful!");
      } catch (e) {
        if (!e.userCancelled) {
          alert("Error purchasing: " + e.message);
        }
      } finally {
        setLoadingPayment(false);
      }
    } else {
      let url = "";
      if (planKey === 'grammar') {
        url = "https://sumberai.myr.id/pl/english-lab";
      } else if (planKey === 'english') {
        url = "https://sumberai.myr.id/pl/ai-english-tutor";
      } else if (planKey === 'full') {
        url = "https://sumberai.myr.id/pl/paket-full-bundle";
      }
      
      if (url) {
         // Membuka link Mayar dan menitipkan UID Firebase pengguna sebagai ext_id dan planKey sebagai pkg
         window.open(`${url}?ext_id=${gs.uid}&pkg=${planKey}`, '_blank');
      }
    }
  };

  const handleRestore = async () => {
    if (!gs?.uid) {
      alert(lang === 'id' ? "Silakan masuk (login) terlebih dahulu untuk memulihkan pembelian Anda." : "Please log in first to restore your purchases.");
      onNav("login");
      return;
    }

    if (Capacitor.isNativePlatform()) {
      try {
        setLoadingPayment(true);
        const { customerInfo } = await Purchases.restorePurchases();
        
        let hasActivePro = false;
        const updateObj = {};
        
        const now = new Date().getTime();
        const thirtyDaysFromNow = now + (30 * 24 * 60 * 60 * 1000);
        
        // Deteksi langganan aktif dari array activeSubscriptions (format id)
        if (customerInfo.activeSubscriptions.length > 0) {
           customerInfo.activeSubscriptions.forEach(sub => {
             if (sub.includes("grammar")) { 
                 updateObj["proStatus.grammar"] = true; 
                 updateObj["proStatus.grammarExpiresAt"] = thirtyDaysFromNow;
                 hasActivePro = true; 
             }
             if (sub.includes("english")) { 
                 updateObj["proStatus.english"] = true; 
                 updateObj["proStatus.englishExpiresAt"] = thirtyDaysFromNow;
                 hasActivePro = true; 
             }
             if (sub.includes("full") || sub.includes("bundle")) { 
                updateObj["proStatus.scholar"] = true;
                updateObj["proStatus.english"] = true;
                updateObj["proStatus.englishExpiresAt"] = thirtyDaysFromNow;
                updateObj["proStatus.grammar"] = true;
                updateObj["proStatus.grammarExpiresAt"] = thirtyDaysFromNow;
                hasActivePro = true;
             }
           });
        }

        if (hasActivePro) {
          if (gs.uid) {
            await updateDoc(doc(db, "users", gs.uid), updateObj);
          }
          alert(lang === 'id' ? "Pembelian berhasil dipulihkan!" : "Purchases restored successfully!");
          onNav("home");
        } else {
          alert(lang === 'id' ? "Tidak ditemukan pembelian aktif yang bisa dipulihkan. Pastikan Anda masuk dengan Apple ID yang benar." : "No active purchases found to restore.");
        }
      } catch (e) {
        alert("Error restoring purchases: " + e.message);
      } finally {
        setLoadingPayment(false);
      }
    } else {
      alert("Restore purchase is only available on the mobile app.");
    }
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
    <div style={{paddingTop: "calc(72px + env(safe-area-inset-top))", paddingBottom: 24, flex: 1, background:"var(--bg-main)", position: "relative"}}>
      <div style={{padding: "0 16px"}}>
        <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24}}>
          <h2 style={{fontFamily: "Exo 2", fontWeight: 900, fontSize: 24, color: "var(--text-color)", margin: 0}}>{t.title}</h2>
          <div style={{display: "flex", gap: 12, alignItems: "center"}}>
            <button className="tap" onClick={() => onNav("home")} style={{background: "#E2E8F0", color: "#475569", border: "none", borderRadius: "50%", width: 32, height: 32, fontWeight: "bold", cursor: "pointer"}}>✕</button>
          </div>
        </div>
        
        <p style={{fontSize: 14, color: "#64748B", marginBottom: 24, lineHeight: 1.5}}>
          {t.desc}
        </p>

        <div style={{display: "flex", flexDirection: "column", gap: 16, animation: "fadeUp .4s ease"}}>
          <div style={{background:"var(--bg-card)", borderRadius: 24, padding: 24, border: "2px solid #E2E8F0", position: "relative"}}>
            <div style={{fontFamily: "Exo 2", fontWeight: 900, fontSize: 20, color: "#64748B"}}>{t.freeTitle}</div>
              <div style={{fontSize: 28, fontWeight: 800, color: "var(--text-color)", margin: "8px 0"}}>{t.freePrice}</div>
              <div style={{fontSize: 13, color: "#64748B", marginBottom: 16}}>{t.freeDesc}</div>
              
              <ul style={{listStyle: "none", padding: 0, margin: 0, fontSize: 13, color: "#475569", lineHeight: 2}}>
                <li>✔️ {t.f1}</li>
                <li>✔️ {t.f2}</li>
                <li>❌ <span style={{opacity: 0.5}}>{t.f3}</span></li>
                <li>❌ <span style={{opacity: 0.5}}>{t.f4}</span></li>
              </ul>
            </div>

            <div style={{background: "linear-gradient(135deg, #7C3AED 0%, #8B5CF6 100%)", borderRadius: 24, padding: "2px", boxShadow: "0 12px 32px rgba(124,58,237,.2)", animation: "fadeUp .45s ease", position: "relative"}}>
              <div style={{background:"var(--bg-card)", borderRadius: 22, padding: 24, border: "1px solid #C4B5FD"}}>
                <div style={{fontFamily: "Exo 2", fontWeight: 900, fontSize: 20, color: "#7C3AED"}}>ENGLISH LAB (SIMULASI GRAMMAR) 📖</div>
                <div style={{fontSize: 32, fontWeight: 900, color: "var(--text-color)", margin: "8px 0"}}>
                  <span style={{textDecoration: "line-through", color: "#94A3B8", fontSize: 18, marginRight: 8, fontWeight: 600}}>Rp 79.000</span>Rp 49.000<span style={{fontSize: 14, fontWeight: 600, color: "#94A3B8"}}>{t.proPrice}</span>
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
                  <button className="tap hover-card" onClick={() => handlePurchase("grammar")} disabled={loadingPayment} style={{width: "100%", background: "#8B5CF6", color: "#fff", border: "none", padding: 16, borderRadius: 16, fontSize: 15, fontWeight: 900, cursor: loadingPayment ? "wait" : "pointer", boxShadow: "0 8px 20px rgba(139,92,246,.3)"}}>
                    {loadingPayment ? "..." : t.subBtn}
                  </button>
                )}
              </div>
            </div>

            <div style={{background: "linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%)", borderRadius: 24, padding: "2px", boxShadow: "0 12px 32px rgba(37,99,235,.3)", animation: "fadeUp .45s ease", position: "relative"}}>
              <div style={{position: "absolute", top: -12, right: 20, background: "linear-gradient(135deg, #F59E0B, #FCD34D)", color: "#fff", padding: "4px 12px", borderRadius: 99, fontSize: 11, fontWeight: 900, boxShadow: "0 4px 10px rgba(245,158,11,.4)"}}>{t.popular}</div>
              <div style={{background: "linear-gradient(135deg, #0F172A 0%, #1E3A8A 100%)", borderRadius: 22, padding: 24}}>
                <div style={{fontFamily: "Exo 2", fontWeight: 900, fontSize: 20, color: "#93C5FD"}}>{t.engTitle}</div>
                <div style={{fontSize: 32, fontWeight: 900, color: "#fff", margin: "8px 0"}}>
                  <span style={{textDecoration: "line-through", color: "#94A3B8", fontSize: 18, marginRight: 8, fontWeight: 600}}>Rp 109.000</span>Rp 69.000<span style={{fontSize: 14, fontWeight: 600, color: "#94A3B8"}}>{t.proPrice}</span>
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
                  <button className="tap hover-card" onClick={() => handlePurchase("english")} disabled={loadingPayment} style={{width: "100%", background: "linear-gradient(135deg, #F59E0B, #FCD34D)", color: "#78350F", border: "none", padding: 16, borderRadius: 16, fontSize: 15, fontWeight: 900, cursor: loadingPayment ? "wait" : "pointer", boxShadow: "0 8px 20px rgba(245,158,11,.4)"}}>
                    {loadingPayment ? "..." : t.subBtn}
                  </button>
                )}
              </div>
            </div>

            <div style={{background: "linear-gradient(135deg, #FCD34D 0%, #F59E0B 100%)", borderRadius: 24, padding: "2px", boxShadow: "0 12px 32px rgba(245,158,11,.3)", animation: "fadeUp .6s ease", position: "relative"}}>
              <div style={{position: "absolute", top: -12, right: 20, background: "#EF4444", color: "#fff", padding: "4px 12px", borderRadius: 99, fontSize: 11, fontWeight: 900, boxShadow: "0 4px 10px rgba(239,68,68,.4)"}}>BEST DEAL 🔥</div>
              <div style={{background:"var(--bg-card)", borderRadius: 22, padding: 24, border: "1px solid #FDE68A"}}>
                <div style={{fontFamily: "Exo 2", fontWeight: 900, fontSize: 20, color: "#D97706"}}>PAKET FULL BUNDLE 🌟</div>
                <div style={{fontSize: 32, fontWeight: 900, color: "var(--text-color)", margin: "8px 0"}}>
                  Rp 99.000<span style={{fontSize: 14, fontWeight: 600, color: "#94A3B8"}}>{t.proPrice}</span>
                </div>
                <div style={{fontSize: 13, color: "#64748B", marginBottom: 20}}>{lang === 'en' ? "English Lab + AI English Tutor (All Premium Features!)" : "English Lab + AI English Tutor (Semua Fitur Premium!)"}</div>
                
                <ul style={{listStyle: "none", padding: 0, margin: 0, fontSize: 13, color: "#475569", lineHeight: 2, marginBottom: 24}}>
                  <li>✔️ <b>{lang === 'en' ? "Access All English Lab Levels" : "Akses Semua Level English Lab"}</b></li>
                  <li>✔️ <b>{lang === 'en' ? "Access All AI Tutor Modes" : "Akses Semua Mode AI Tutor"}</b></li>
                </ul>

                {(gs.proStatus?.grammar && gs.proStatus?.english) ? (
                  <div style={{width: "100%", background: "#D97706", color: "#fff", padding: 16, borderRadius: 16, fontSize: 15, fontWeight: 900, textAlign: "center", opacity: 0.8}}>
                    ✅ {lang === 'en' ? "ACTIVE" : "AKTIF"}
                  </div>
                ) : (
                  <button className="tap hover-card" onClick={() => handlePurchase("full")} disabled={loadingPayment} style={{width: "100%", background: "linear-gradient(135deg, #F59E0B, #FCD34D)", color: "#78350F", border: "none", padding: 16, borderRadius: 16, fontSize: 15, fontWeight: 900, cursor: loadingPayment ? "wait" : "pointer", boxShadow: "0 8px 20px rgba(245,158,11,.4)"}}>
                    {loadingPayment ? "..." : t.subBtn}
                  </button>
                )}
              </div>
            </div>
          </div>
          
          {/* Legal & Restore Section (Wajib Apple Guideline 3.1.2 & 3.1.1) */}
          <div style={{marginTop: 32, textAlign: "center", animation: "fadeUp .8s ease"}}>
            <div style={{fontSize: 12, color: "#94A3B8", marginBottom: 16}}>
              {lang === 'id' ? "Dengan berlangganan, Anda menyetujui" : "By subscribing, you agree to our"}
              <br/>
              <a href="https://www.apple.com/legal/internet-services/itunes/dev/stdeula/" target="_blank" rel="noopener noreferrer" style={{color: "#3B82F6", textDecoration: "none", margin: "0 4px", fontWeight: "bold"}}>
                {lang === 'id' ? "Syarat Ketentuan (EULA)" : "Terms of Use (EULA)"}
              </a>
              {lang === 'id' ? "serta" : "and"}
              <span className="tap" onClick={() => onNav("privacy")} style={{color: "#3B82F6", textDecoration: "none", margin: "0 4px", fontWeight: "bold", cursor: "pointer"}}>
                {lang === 'id' ? "Kebijakan Privasi" : "Privacy Policy"}
              </span>
              kami.
            </div>
            
            <button 
              onClick={handleRestore}
              disabled={loadingPayment}
              className="tap"
              style={{background: "transparent", border: "1px solid #CBD5E1", color: "#64748B", padding: "10px 24px", borderRadius: 99, fontSize: 13, fontWeight: 700, cursor: loadingPayment ? "wait" : "pointer"}}
            >
              {loadingPayment ? "..." : (lang === 'id' ? "Pulihkan Pembelian (Restore)" : "Restore Purchases")}
            </button>
          </div>

        </div>
      </div>
  );
}
