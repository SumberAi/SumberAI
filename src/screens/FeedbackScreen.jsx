import React, { useState } from 'react';
import { db, auth } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { C } from '../data/mockData';

export default function FeedbackScreen({ gs, onNav }) {
  const isEn = gs.lang === 'en';
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!rating || !text.trim()) {
      alert(isEn ? "Please provide a rating and your feedback." : "Mohon berikan rating dan tuliskan masukanmu.");
      return;
    }
    setLoading(true);
    try {
      const uid = auth.currentUser?.uid;
      if (!uid) throw new Error("Not logged in");
      
      const feedbackId = "fb_" + Date.now().toString();
      await setDoc(doc(db, "users", uid), {
        userFeedbacks: {
          [feedbackId]: {
            rating,
            text,
            date: new Date().toISOString()
          }
        }
      }, { merge: true });
      
      setSubmitted(true);
    } catch (e) {
      console.error(e);
      alert(isEn ? "Failed to send feedback. Please try again." : "Gagal mengirim masukan. Silakan coba lagi.");
    }
    setLoading(false);
  };

  return (
    <div style={{paddingTop: "calc(64px + env(safe-area-inset-top))",paddingBottom:24,flex:1,background:"var(--bg-main)",display:"flex",flexDirection:"column"}}>
      <div style={{padding:"20px 16px",flex:1,display:"flex",flexDirection:"column"}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:24}}>
          <div className="tap" onClick={() => onNav("profile")} style={{width:40,height:40,borderRadius:"50%",background:"var(--bg-card)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:C.shadowCard}}>
            <span style={{fontSize:20,color:"var(--text-main)"}}>←</span>
          </div>
          <h1 style={{fontFamily:"Exo 2",fontWeight:900,fontSize:22,color:"var(--text-main)",margin:0}}>
            {isEn ? "App Feedback" : "Masukan Aplikasi"}
          </h1>
        </div>

        {submitted ? (
          <div style={{background:"var(--bg-card)",borderRadius:24,padding:"40px 20px",boxShadow:C.shadowCard,textAlign:"center",animation:"fadeUp .4s ease"}}>
            <div style={{fontSize:60,marginBottom:16}}>💖</div>
            <h2 style={{fontFamily:"Exo 2",fontWeight:900,fontSize:22,color:"#10B981",marginBottom:12}}>
              {isEn ? "Thank You!" : "Terima Kasih!"}
            </h2>
            <p style={{color:"var(--text-sec)",lineHeight:1.6,marginBottom:24}}>
              {isEn ? "Your feedback has been received and helps us improve the app." : "Masukanmu telah diterima dan sangat membantu kami dalam mengembangkan aplikasi ini."}
            </p>
            <button className="tap" onClick={() => onNav("home")} style={{background:"#10B981",color:"#fff",border:"none",padding:"14px 24px",borderRadius:16,fontWeight:800}}>
              {isEn ? "Back to Home" : "Kembali ke Beranda"}
            </button>
          </div>
        ) : (
          <div style={{background:"var(--bg-card)",borderRadius:24,padding:"24px 20px",boxShadow:C.shadowCard,flex:1,animation:"fadeUp .4s ease"}}>
            <p style={{color:"var(--text-sec)",lineHeight:1.6,marginBottom:24,fontSize:14}}>
              {isEn ? "Have suggestions, found a bug, or just want to say hi? Let us know below!" : "Punya saran, menemukan error, atau sekadar ingin menyapa? Beritahu kami di bawah ini!"}
            </p>

            <div style={{marginBottom:24,textAlign:"center"}}>
              <div style={{fontSize:13,fontWeight:800,color:"var(--text-sec)",marginBottom:12}}>
                {isEn ? "How would you rate this app?" : "Berapa rating untuk aplikasi ini?"}
              </div>
              <div style={{display:"flex",justifyContent:"center",gap:8}}>
                {[1,2,3,4,5].map(star => (
                  <div key={star} onClick={() => setRating(star)} className="tap" style={{fontSize:32,color:star<=rating?"#FBBF24":"var(--border-color)",cursor:"pointer",transition:"all 0.2s",filter:star<=rating?"drop-shadow(0 4px 8px rgba(251,191,36,0.4))":"none"}}>
                    ★
                  </div>
                ))}
              </div>
            </div>

            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={isEn ? "Tell us your thoughts..." : "Ceritakan masukanmu..."}
              style={{width:"100%",height:150,borderRadius:16,padding:16,border:"1px solid var(--border-color)",background:"var(--bg-main)",color:"var(--text-main)",fontFamily:"inherit",fontSize:14,resize:"none",marginBottom:24,outline:"none"}}
            />

            <button className="tap" onClick={handleSubmit} disabled={loading} style={{background:C.blue,color:"#fff",border:"none",width:"100%",padding:"16px",borderRadius:16,fontSize:16,fontWeight:900,boxShadow:`0 8px 24px ${C.blueLt}`,opacity:loading?0.7:1}}>
              {loading ? (isEn ? "Sending..." : "Mengirim...") : (isEn ? "SEND FEEDBACK" : "KIRIM MASUKAN")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
