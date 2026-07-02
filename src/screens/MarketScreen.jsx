import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { C } from '../data/mockData';

export default function MarketScreen({ gs, spendCoins, onNav, userUid }) {
  const [showModal, setShowModal] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedItemTitle, setSelectedItemTitle] = useState('');

  const stores = [
    {
      id: "s1",
      brand: "Kopi Pak Hitam",
      address: "Kawasan Tugu Keris Siginjai, Kota Jambi",
      icon: "🏪",
      items: [
        { id: 1, title: "Voucher Kopi Liberika", titleEn: "Liberika Coffee Voucher", desc: "Voucher diskon Rp 25.000 Kopi Liberika Kerinci Premium.", descEn: "Rp 25.000 voucher for Premium Kerinci Liberika Coffee.", price: 150, icon: "☕", bg: "linear-gradient(135deg, #FDE68A, #D97706)", isReady: true },
        { id: 2, title: "Biji Kopi Robusta 250g", titleEn: "Robusta Coffee Beans 250g", desc: "Gratis 1 bungkus biji kopi Robusta Jambi asli.", descEn: "Free 1 pack of authentic Jambi Robusta beans.", price: 250, icon: "🫘", bg: "linear-gradient(135deg, #D6D3D1, #78716C)", isReady: true }
      ]
    },
    {
      id: "s2",
      brand: "Zhafirah Batik & Songket",
      address: "Jl. Kolonel Abunjani No.12, Sipin, Jambi",
      icon: "🏬",
      items: [
        { id: 3, title: "Potongan Batik Jambi", titleEn: "Jambi Batik Discount", desc: "Potongan eksklusif 20% kemeja Batik motif Batanghari.", descEn: "Exclusive 20% off for Batanghari motif Batik shirt.", price: 300, icon: "👘", bg: "linear-gradient(135deg, #FBCFE8, #DB2777)", isReady: true },
        { id: 4, title: "Kain Songket Mewah", titleEn: "Luxury Songket Fabric", desc: "Potongan harga Rp 100.000 pembelian kain Songket.", descEn: "Rp 100.000 discount for purchasing Jambi Songket fabric.", price: 800, icon: "✨", bg: "linear-gradient(135deg, #BFDBFE, #2563EB)", isReady: true }
      ]
    },
    {
      id: "s3",
      brand: "Pusat Oleh-Oleh Makmur",
      address: "Jl. Jendral Sudirman No. 8, Thehok, Jambi",
      icon: "🛍️",
      items: [
        { id: 5, title: "Lempok Durian Legit", titleEn: "Sweet Durian Lempok", desc: "1 kotak Lempok Durian khas Jambi gratis!", descEn: "Free 1 box of signature Jambi Durian Lempok!", price: 500, icon: "🍬", bg: "linear-gradient(135deg, #D9F99D, #65A30D)", isReady: true },
        { id: 6, title: "Gelang Sebelik Sumpah", titleEn: "Sebelik Sumpah Bracelet", desc: "Diskon 50% Aksesoris khas Suku Anak Dalam.", descEn: "50% discount for Indigenous tribe accessory.", price: 200, icon: "📿", bg: "linear-gradient(135deg, #E9D5FF, #9333EA)", isReady: true }
      ]
    }
  ];

  const isEn = gs?.lang === 'en';

  const handleBuy = async (price, title, storeName) => {
    if (gs.coins >= price && userUid) {
      setIsGenerating(true);
      setSelectedItemTitle(`${title} (${storeName})`);
      
      try {
        spendCoins(price);
        const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
        const code = `UMKM-${randomStr}`;
        const discountValue = price * 50; 

        await addDoc(collection(db, "vouchers"), {
          code: code,
          userId: userUid,
          title: title,
          store: storeName,
          amount: discountValue,
          isUsed: false,
          createdAt: Date.now(),
          expiresAt: Date.now() + (24 * 60 * 60 * 1000)
        });

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
            <h2 style={{fontFamily: "Exo 2", fontWeight: 900, fontSize: 24, color: C.text, margin: 0}}>Mitra UMKM 🛍️</h2>
            <p style={{fontSize: 13, color: C.textSec, margin: "4px 0 0 0"}}>{isEn ? "Exchange your SmartCoins for real local products!" : "Tukarkan SmartCoins dengan voucher produk lokal Jambi!"}</p>
          </div>
        </div>

        <div style={{display: "flex", flexDirection: "column", gap: 24}}>
          {stores.map((store, storeIdx) => (
            <div key={store.id} style={{background: "#fff", borderRadius: 24, padding: 20, boxShadow: "0 12px 30px rgba(0,0,0,0.06)", border: "1px solid rgba(0,0,0,0.04)", animation: `fadeUp ${.3 + storeIdx * .15}s ease both`}}>
              {/* Header Toko / Brand */}
              <div style={{display: "flex", alignItems: "center", gap: 12, marginBottom: 16, paddingBottom: 16, borderBottom: "1px solid #F1F5F9"}}>
                <div style={{fontSize: 32}}>{store.icon}</div>
                <div>
                  <div style={{fontFamily: "Exo 2", fontWeight: 900, fontSize: 18, color: "#1E293B"}}>{store.brand}</div>
                  <div style={{fontSize: 12, color: "#64748B", marginTop: 4, display: "flex", alignItems: "flex-start", gap: 4}}>
                    <span>📍</span> <span>{store.address}</span>
                  </div>
                </div>
              </div>

              {/* Grid Produk Dalam Toko */}
              <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12}}>
                {store.items.map((itm, i) => {
                  const canBuy = gs.coins >= itm.price;
                  return (
                    <div key={itm.id} style={{background:"var(--bg-card)", borderRadius: 20, padding: 16, boxShadow: "0 4px 12px rgba(0,0,0,0.03)", display: "flex", flexDirection: "column", border: "1px solid rgba(0,0,0,0.04)", filter: !itm.isReady ? "grayscale(80%) opacity(0.85)" : "none"}}>
                      <div style={{width: 48, height: 48, borderRadius: 14, background: itm.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, marginBottom: 16, boxShadow: "0 4px 10px rgba(0,0,0,0.1)"}}>
                        {itm.icon}
                      </div>
                      <div style={{fontFamily: "Exo 2", fontWeight: 900, fontSize: 14, color: C.text, marginBottom: 6, minHeight: 42, lineHeight: 1.3}}>{isEn ? itm.titleEn : itm.title}</div>
                      <div style={{fontSize: 11, color: C.textSec, lineHeight: 1.5, marginBottom: 16, flex: 1}}>{isEn ? itm.descEn : itm.desc}</div>
                      
                      <div style={{background: "rgba(245,158,11,0.1)", borderRadius: 12, padding: "6px 10px", display: "inline-flex", alignItems: "center", width: "fit-content", marginBottom: 16}}>
                        <span style={{fontWeight: 900, fontSize: 14, color: C.gold}}>{itm.price.toLocaleString("id-ID")}</span>
                        <img src="/coin.png" style={{width:"1.2em", height:"1.2em", marginLeft: 4, objectFit:"cover", borderRadius:"50%"}} alt="coin"/>
                      </div>
                      
                      {!itm.isReady ? (
                        <button disabled style={{width: "100%", background: "transparent", color: "#94A3B8", border: "2px dashed #CBD5E1", padding: "10px", borderRadius: 12, fontSize: 12, fontWeight: 800, cursor: "not-allowed", letterSpacing: 0.5}}>
                          🔒 {isEn ? "COMING SOON" : "SEGERA"}
                        </button>
                      ) : (
                        <button className="tap" disabled={!canBuy || isGenerating} onClick={() => handleBuy(itm.price, isEn ? itm.titleEn : itm.title, store.brand)} style={{width: "100%", background: canBuy ? "linear-gradient(135deg, #10B981, #059669)" : "#E2E8F0", color: canBuy ? "#FFF" : "#94A3B8", border: "none", padding: "10px", borderRadius: 12, fontSize: 12, fontWeight: 800, cursor: canBuy ? "pointer" : "not-allowed", letterSpacing: 0.5, boxShadow: canBuy ? "0 4px 12px rgba(16,185,129,.3)" : "none", transition: "all 0.2s"}}>
                          {isGenerating ? "..." : (canBuy ? (isEn ? "REDEEM" : "TUKAR") : (isEn ? "NEED COINS" : "KOIN KURANG"))}
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
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
