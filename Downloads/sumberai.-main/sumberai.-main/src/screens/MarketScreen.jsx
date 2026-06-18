import React, { useState } from 'react';
import { C } from '../data/mockData';

export default function MarketScreen({ gs, spendCoins }) {
  const items = [
    { id: 1, title: "Kopi AA", desc: "Kopi khas Jambi dengan aroma yang kuat dan mantap.", price: 2600, icon: "☕", isReady: true },
    { id: 2, title: "Sambal Tempoyak", desc: "Sambal pedas khas Jambi dari fermentasi durian.", price: 2600, icon: "🌶️", isReady: true },
    { id: 3, title: "Ayam Geprek", desc: "Ayam geprek krispi pedas nampol.", price: 2600, icon: "🍗", isReady: true },
    { id: 4, title: "Batik Tulis Jambi", desc: "Motif Angso Duo khas Jambi buatan pengrajin lokal.", price: 2600, icon: "👕", isReady: false },
    { id: 5, title: "Madu Sialang Hutan", desc: "Madu asli hasil panen lebah dari hutan Jambi.", price: 2600, icon: "🍯", isReady: false },
    { id: 6, title: "Keripik Tempoyak", desc: "Camilan gurih dengan cita rasa durian fermentasi.", price: 2600, icon: "🍘", isReady: false },
    { id: 7, title: "Tas Rotan Anyam", desc: "Kerajinan tangan otentik dari Sungai Bahar.", price: 2600, icon: "👜", isReady: false },
    { id: 8, title: "Dodol Durian Jambi", desc: "Lempok durian manis dan legit dari bahan asli.", price: 2600, icon: "🍬", isReady: false },
    { id: 9, title: "Songket Jambi", desc: "Kain tenun Songket Jambi yang elegan dan premium.", price: 2600, icon: "🧶", isReady: false },
    { id: 10, title: "Gelang Sebelik Sumpah", desc: "Aksesoris tradisional Suku Anak Dalam Jambi.", price: 2600, icon: "📿", isReady: false },
    { id: 11, title: "Voucher Free Fire", desc: "Top-up diamond Free Fire langsung cair ke ID akun.", price: 2400, icon: "🔫", isReady: false },
    { id: 12, title: "Voucher Mobile Legends", desc: "Top-up diamond MLBB untuk mabar yang lebih seru!", price: 2400, icon: "⚔️", isReady: false }
  ];

  const handleBuy = (price, title) => {
    if (gs.coins >= price) {
      spendCoins(price);
      alert(`Berhasil menukar ${price} koin dengan ${title}! Hubungi kantin/admin untuk pengambilan.`);
    }
  };

  return (
    <div style={{paddingTop: 80, paddingBottom: 100, minHeight: "100vh", background:"var(--bg-main)"}}>
      <div style={{padding: "0 16px"}}>
        <h2 style={{fontFamily: "Exo 2", fontWeight: 900, fontSize: 24, color: C.text, marginBottom: 8}}>UMKM Market 🛍️</h2>
        <p style={{fontSize: 13, color: C.textSec, marginBottom: 24}}>Tukarkan SmartCoins hasil belajar Anda dengan hadiah nyata!</p>

        <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12}}>
          {items.map((itm, i) => {
            const canBuy = gs.coins >= itm.price;
            return (
            <div key={itm.id} style={{background:"var(--bg-card)", borderRadius: 18, padding: 16, boxShadow: C.shadowCard, display: "flex", flexDirection: "column", animation: `fadeUp ${.3 + i * .1}s ease both`, filter: !itm.isReady ? "grayscale(80%) opacity(0.85)" : "none"}}>
              <div style={{fontSize: 32, marginBottom: 12}}>{itm.icon}</div>
              <div style={{fontFamily: "Exo 2", fontWeight: 800, fontSize: 14, color: C.text, marginBottom: 4, minHeight: 40}}>{itm.title}</div>
              <div style={{fontSize: 11, color: C.textSec, lineHeight: 1.4, marginBottom: 12, flex: 1}}>{itm.desc}</div>
              <div style={{fontWeight: 900, fontSize: 16, color: C.gold, marginBottom: 12}}>{itm.price.toLocaleString("id-ID")} <img src="/coin.png" style={{width:"1.1em", height:"1.1em", verticalAlign:"middle", margin:"0 2px", position:"relative", top:"-2px", borderRadius:"50%", objectFit:"cover"}} alt="coin"/></div>
              
              {!itm.isReady ? (
                <button disabled style={{width: "100%", background: "transparent", color: "#94A3B8", border: "2px dashed #CBD5E1", padding: "12px", borderRadius: 14, fontSize: 13, fontWeight: 800, cursor: "not-allowed", letterSpacing: 0.5}}>
                  🔒 SEGERA HADIR
                </button>
              ) : (
                <button className="tap" disabled={!canBuy} onClick={() => handleBuy(itm.price, itm.title)} style={{width: "100%", background: canBuy ? "linear-gradient(135deg, #F59E0B, #FCD34D)" : "#E2E8F0", color: canBuy ? "#78350F" : "#94A3B8", border: "none", padding: "12px", borderRadius: 14, fontSize: 13, fontWeight: 800, cursor: canBuy ? "pointer" : "not-allowed", letterSpacing: 0.5, boxShadow: canBuy ? "0 4px 12px rgba(245,158,11,.3)" : "none"}}>
                  {canBuy ? "TUKAR" : "KOIN KURANG"}
                </button>
              )}
            </div>
          )})}
        </div>
      </div>
    </div>
  );
}
