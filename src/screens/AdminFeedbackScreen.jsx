import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { C } from '../data/mockData';

export default function AdminFeedbackScreen({ onNav }) {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // onSnapshot akan secara otomatis memperbarui data (Realtime) jika ada perubahan di Firebase
    const unsubscribe = onSnapshot(collection(db, "users"), (snap) => {
      const allFeedbacks = [];
      
      snap.forEach(doc => {
        const data = doc.data();
        if (data.userFeedbacks) {
          Object.values(data.userFeedbacks).forEach(fb => {
            allFeedbacks.push({
              ...fb,
              userName: data.name || "Unknown",
              userEmail: data.email || "-",
              uid: doc.id
            });
          });
        }
      });
      
      // Urutkan dari yang terbaru
      allFeedbacks.sort((a, b) => new Date(b.date) - new Date(a.date));
      setFeedbacks(allFeedbacks);
      setLoading(false);
    }, (error) => {
      console.error("Gagal mengambil feedback realtime:", error);
      alert("Gagal mengambil data dari database. Pastikan koneksi internet bagus.");
      setLoading(false);
    });

    // Membersihkan listener ketika admin keluar dari halaman ini
    return () => unsubscribe();
  }, []);

  return (
    <div style={{paddingTop: "calc(64px + env(safe-area-inset-top))",paddingBottom:24,flex:1,background:"var(--bg-main)",display:"flex",flexDirection:"column"}}>
      <div style={{padding:"20px 16px"}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:24}}>
          <div className="tap" onClick={() => onNav("profile")} style={{width:40,height:40,borderRadius:"50%",background:"var(--bg-card)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:C.shadowCard}}>
            <span style={{fontSize:20,color:"var(--text-main)"}}>←</span>
          </div>
          <h1 style={{fontFamily:"Exo 2",fontWeight:900,fontSize:22,color:"var(--text-main)",margin:0}}>
            Admin: Semua Masukan
          </h1>
        </div>

        {loading ? (
          <div style={{textAlign:"center", padding:40, color:"var(--text-sec)"}}>Memuat data masukan pengguna...</div>
        ) : feedbacks.length === 0 ? (
          <div style={{textAlign:"center", padding:40, color:"var(--text-sec)"}}>Belum ada masukan dari pengguna.</div>
        ) : (
          <div style={{display:"flex", flexDirection:"column", gap:16}}>
            {feedbacks.map((fb, i) => (
              <div key={i} style={{background:"var(--bg-card)",borderRadius:20,padding:"16px",boxShadow:C.shadowCard,animation:`fadeUp ${0.3 + (i*0.05)}s ease`}}>
                <div style={{display:"flex", justifyContent:"space-between", marginBottom:8}}>
                  <div style={{fontWeight:800, fontSize:15, color:"var(--text-main)"}}>{fb.userName}</div>
                  <div style={{color:"#FBBF24", fontSize:14}}>{"★".repeat(fb.rating)}{"☆".repeat(5-fb.rating)}</div>
                </div>
                <div style={{fontSize:11, color:"var(--text-sec)", marginBottom:12}}>
                  {new Date(fb.date).toLocaleString('id-ID')} • {fb.userEmail}
                </div>
                <div style={{fontSize:14, color:"var(--text-main)", lineHeight:1.5, background:"var(--bg-main)", padding:12, borderRadius:12}}>
                  {fb.text}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
