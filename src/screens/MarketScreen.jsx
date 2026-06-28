import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { C } from '../data/mockData';

export default function MarketScreen({ gs, spendCoins, onNav, userUid }) {
  const [showModal, setShowModal] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedItemTitle, setSelectedItemTitle] = useState('');

  // Sesuai request: Buat gambaran kasarnya dulu yaitu 10 persen semua produk.
  // 1 Koin = Rp 5. Anggap nilai diskon ini setara dengan 1000 Koin (Rp 5.000 diskon) atau 500 Koin. 
  // Kita buat harganya terjangkau untuk testing.
  const items = [
    { id: 1, title: "Diskon 10% Kopi AA", titleEn: "10% Off AA Coffee", desc: "Nikmati potongan 10% untuk semua varian kopi Jambi.", descEn: "Enjoy 10% off for all Jambi coffee variants.", price: 500, icon: "☕", isReady: true },
    { id: 2, title: "Diskon 10% Ayam Geprek", titleEn: "10% Off Smashed Chicken", desc: "Voucher diskon 10% makan siang ayam geprek nampol.", descEn: "10% discount voucher for spicy smashed chicken.", price: 500, icon: "🍗", isReady: true },
    { id: 3, title: "Diskon 10% Cuci Sepatu", titleEn: "10% Off Shoe Wash", desc: "Bikin sepatu kamu kinclong dengan diskon 10%.", descEn: "Make your shoes shine with 10% discount.", price: 500, icon: "👟", isReady: true },
    { id: 4, title: "Diskon 10% Keripik Tempoyak", titleEn: "10% Off Tempoyak Chips", desc: "Potongan harga 10% untuk oleh-oleh keripik khas.", descEn: "10% off for signature chips souvenir.", price: 500, icon: "🥔", isReady: true },
    { id: 5, title: "Diskon 10% Cuci Motor", titleEn: "10% Off Motorbike Wash", desc: "Voucher diskon 10% untuk cuci motor salju.", descEn: "10% off voucher for snow motorbike wash.", price: 500, icon: "🏍️", isReady: false },
    { id: 6, title: "Diskon 10% Barbershop", titleEn: "10% Off Barbershop", desc: "Tampil ganteng maksimal dengan potongan 10%.", descEn: "Look your best with a 10% haircut discount.", price: 500, icon: "✂️", isReady: false }
  ];

  const isEn = gs?.lang === 'en';

  const handleBuy = async (price, title) => {
    if (gs.coins >= price && userUid) {
      setIsGenerating(true);
      setSelectedItemTitle(title);
      
      try {
        // 1. Potong Koin
        spendCoins(price);

        // 2. Buat Kode Unik (Contoh: SBR-A8X9)
        const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
        const code = `SBR-${randomStr}`;

        // 3. Hitung Nilai Diskon dalam Rupiah (1 Koin = Rp 5)
        const discountValue = price * 5; 

        // 4. Simpan ke Firebase Database
        await addDoc(collection(db, "vouchers"), {
          code: code,
          userId: userUid,
          title: title,
          amount: discountValue,
          isUsed: false,
          createdAt: Date.now(),
          expiresAt: Date.now() + (24 * 60 * 60 * 1000) // Hangus dalam 24 Jam
        });

        // 5. Tampilkan Modal
        setGeneratedCode(code);
        setShowModal(true);
      } catch (e) {
        console.error(e);
        alert('Gagal memproses penukaran. Cek koneksi Anda.');
      } finally {
        setIsGenerating(false);
      }
    } else if (!userUid) {
      alert('Harap login terlebih dahulu untuk menukar kupon.');
    }
  };

  return (
    <div style={{paddingTop: 80, paddingBottom: 100, minHeight: "100vh", background:"var(--bg-main)", position: "relative"}}>
      <div style={{padding: "0 16px"}}>
        <div style={{display: "flex", alignItems: "center", marginBottom: 24}}>
          <button className="tap" onClick={() => onNav('home')} style={{background: "#fff", border: "1px solid #E2E8F0", padding: "8px 16px", borderRadius: "99px", display: "flex", alignItems: "center", gap: 6, cursor: "pointer", marginRight: 16, boxShadow: "0 4px 12px rgba(0,0,0,0.04)", flexShrink: 0, color: "#1E293B", fontWeight: 800, fontSize: 13}}>
            ⬅️ {isEn ? "BACK" : "KEMBALI"}
          </button>
          <div style={{flex: 1}}>
            <h2 style={{fontFamily: "Exo 2", fontWeight: 900, fontSize: 24, color: C.text, margin: 0}}>UMKM Market 🛍️</h2>
            <p style={{fontSize: 13, color: C.textSec, margin: "4px 0 0 0"}}>{isEn ? "Exchange your SmartCoins for real discounts!" : "Tukarkan SmartCoins hasil belajar Anda dengan Voucher Diskon!"}</p>
          </div>
        </div>

        <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12}}>
          {items.map((itm, i) => {
            const canBuy = gs.coins >= itm.price;
            return (
            <div key={itm.id} style={{background:"var(--bg-card)", borderRadius: 18, padding: 16, boxShadow: C.shadowCard, display: "flex", flexDirection: "column", animation: `fadeUp ${.3 + i * .1}s ease both`, filter: !itm.isReady ? "grayscale(80%) opacity(0.85)" : "none"}}>
              <div style={{fontSize: 32, marginBottom: 12}}>{itm.icon}</div>
              <div style={{fontFamily: "Exo 2", fontWeight: 800, fontSize: 14, color: C.text, marginBottom: 4, minHeight: 40}}>{isEn ? itm.titleEn : itm.title}</div>
              <div style={{fontSize: 11, color: C.textSec, lineHeight: 1.4, marginBottom: 12, flex: 1}}>{isEn ? itm.descEn : itm.desc}</div>
              <div style={{fontWeight: 900, fontSize: 16, color: C.gold, marginBottom: 12}}>{itm.price.toLocaleString("id-ID")} <img src="/coin.png" style={{width:"1.1em", height:"1.1em", verticalAlign:"middle", margin:"0 2px", position:"relative", top:"-2px", borderRadius:"50%", objectFit:"cover"}} alt="coin"/></div>
              
              {!itm.isReady ? (
                <button disabled style={{width: "100%", background: "transparent", color: "#94A3B8", border: "2px dashed #CBD5E1", padding: "12px", borderRadius: 14, fontSize: 13, fontWeight: 800, cursor: "not-allowed", letterSpacing: 0.5}}>
                  🔒 {isEn ? "COMING SOON" : "SEGERA HADIR"}
                </button>
              ) : (
                <button className="tap" disabled={!canBuy || isGenerating} onClick={() => handleBuy(itm.price, isEn ? itm.titleEn : itm.title)} style={{width: "100%", background: canBuy ? "linear-gradient(135deg, #F59E0B, #FCD34D)" : "#E2E8F0", color: canBuy ? "#78350F" : "#94A3B8", border: "none", padding: "12px", borderRadius: 14, fontSize: 13, fontWeight: 800, cursor: canBuy ? "pointer" : "not-allowed", letterSpacing: 0.5, boxShadow: canBuy ? "0 4px 12px rgba(245,158,11,.3)" : "none"}}>
                  {isGenerating ? "..." : (canBuy ? (isEn ? "REDEEM" : "TUKAR") : (isEn ? "NOT ENOUGH COINS" : "KOIN KURANG"))}
                </button>
              )}
            </div>
          )})}
        </div>
      </div>

      {/* Modal Voucher */}
      {showModal && (
        <div style={{position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(15,23,42,0.8)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 999, padding: 24, backdropFilter: "blur(4px)", animation: "fadeIn .2s ease"}}>
          <div style={{background: "#fff", padding: 32, borderRadius: 24, width: "100%", maxWidth: 340, textAlign: "center", position: "relative", animation: "popIn .3s cubic-bezier(0.34, 1.56, 0.64, 1)"}}>
            <button onClick={() => setShowModal(false)} style={{position: "absolute", top: 16, right: 16, background: "#F1F5F9", border: "none", width: 32, height: 32, borderRadius: "50%", fontWeight: "bold", color: "#64748B", cursor: "pointer"}}>✕</button>
            <div style={{fontSize: 50, marginBottom: 8}}>🎉</div>
            <h3 style={{margin: "0 0 8px 0", color: "#1E293B", fontSize: 20, fontWeight: 900}}>Penukaran Berhasil!</h3>
            <p style={{margin: "0 0 24px 0", color: "#64748B", fontSize: 14}}>{selectedItemTitle}</p>
            
            <div style={{background: "#F8FAFC", border: "2px dashed #CBD5E1", borderRadius: 16, padding: 20, marginBottom: 24}}>
              <p style={{margin: "0 0 8px 0", fontSize: 12, fontWeight: "bold", color: "#94A3B8"}}>KODE VOUCHER ANDA:</p>
              <div style={{fontSize: 32, fontWeight: 900, color: "#2563EB", letterSpacing: 4}}>{generatedCode}</div>
            </div>

            <div style={{background: "#FEF3C7", color: "#92400E", padding: 12, borderRadius: 12, fontSize: 12, fontWeight: "bold", display: "flex", alignItems: "center", gap: 8, textAlign: "left"}}>
              <span style={{fontSize: 20}}>⚠️</span> Tunjukkan kode ini ke Kasir UMKM. Voucher akan hangus dalam 24 Jam.
            </div>
            
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes popIn { from { transform: scale(0.9); opacity: 0 } to { transform: scale(1); opacity: 1 } }
      `}</style>
    </div>
  );
}
