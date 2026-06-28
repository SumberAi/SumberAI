import React from 'react';
import { C } from '../data/mockData';
import { XPBar } from '../components/Shared';
import { auth, db } from '../firebase';
import { signOut } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export default function ProfileScreen({ gs, setGs, onNav, isDark }) {
  const isEn = gs.lang === 'en';
  const fileInputRef = React.useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Kompres gambar menggunakan Canvas agar tidak melebihi batas 1MB Firestore
        const img = new Image();
        img.onload = async () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 200;
          const MAX_HEIGHT = 200;
          let width = img.width;
          let height = img.height;
          
          if (width > height) {
            if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; }
          } else {
            if (height > MAX_HEIGHT) { width *= MAX_HEIGHT / height; height = MAX_HEIGHT; }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.8);
          
          if(setGs) {
            setGs(prev => ({ ...prev, customAvatar: compressedBase64 }));
            try {
              if(auth.currentUser) {
                await setDoc(doc(db, "users", auth.currentUser.uid), { customAvatar: compressedBase64 }, { merge: true });
              }
            } catch(err) {
              console.error("Gagal menyimpan avatar:", err);
            }
          }
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const avatarSrc = gs.customAvatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${gs.name}&backgroundColor=b6e3f4`;

  const achs = [
    {icon:"🔥", title:"Streak Master", sub:isEn ? "Login 3 days in a row" : "Login 3 hari berturut-turut", done: gs.streak >= 3},
    {icon:"🎓", title:isEn ? "AI Scholar" : "Sarjana AI", sub:isEn ? "Read 10 AI Academy modules" : "Baca 10 modul AI Academy", done: gs.academyDone >= 10},
    {icon:"🤖", title:"Bilingual", sub:isEn ? "Complete 20 English Lab questions" : "Selesaikan 20 soal English Lab", done: gs.engDone >= 20},
    {icon:"💼", title:"HRD Favorite", sub:isEn ? "Complete 5 Interview Simulation sessions" : "Jalani 5 sesi Simulasi Interview", done: gs.interviewDone >= 5},
    {icon:"👑", title:isEn ? "Coin Mogul" : "Sultan Koin", sub:isEn ? "Redeem SmartCoin at UMKM Market" : "Tukar SmartCoin di UMKM Market", done: gs.redeemed >= 1},
  ];

  return (
    <div style={{paddingTop:64,paddingBottom:100,minHeight:"100vh",background:"var(--bg-main)"}}>
      <div style={{padding:"20px 16px"}}>
        {/* Header Profile */}
        <div style={{background:"var(--bg-card)",borderRadius:24,padding:"24px 20px",boxShadow:C.shadowCard,textAlign:"center",position:"relative",overflow:"hidden",marginBottom:16,animation:"fadeUp .4s ease"}}>
          <div style={{position:"absolute",top:0,left:0,right:0,height:80,background:"linear-gradient(135deg,#3B82F6,#10B981)",zIndex:0}}/>
          
          <div style={{width:84,height:84,borderRadius:"50%",background:"#fff",margin:"0 auto 12px",position:"relative",zIndex:1,border:"4px solid var(--bg-card)",boxShadow:"0 4px 12px rgba(16,185,129,.3)",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <div style={{width:"100%",height:"100%",borderRadius:"50%",overflow:"hidden",cursor:"pointer"}} onClick={() => fileInputRef.current?.click()}>
              <img src={avatarSrc} alt="Profile Avatar" style={{width:"100%",height:"100%",objectFit:"cover"}} />
            </div>
            
            <div className="tap" onClick={() => fileInputRef.current?.click()} style={{position:"absolute",bottom:0,right:0,width:26,height:26,background:"#3B82F6",borderRadius:"50%",border:"2px solid var(--bg-card)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",boxShadow:"0 2px 4px rgba(0,0,0,0.2)",zIndex:2}}>
              <span style={{fontSize:12,color:"#fff"}}>📷</span>
            </div>
            <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" style={{display:"none"}} />
          </div>
          
          <div style={{position:"relative",zIndex:1}}>
            <h2 style={{fontFamily:"Exo 2",fontWeight:900,fontSize:22,color:"var(--text-main)",marginBottom:16}}>{gs.name}</h2>
            
            <div style={{background:"var(--bg-main)",borderRadius:16,padding:"14px",textAlign:"left"}}>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:11,fontWeight:800,color:"var(--text-sec)",marginBottom:6}}>
                <span>XP {gs.xp}/{gs.xpNext}</span>
                <span style={{color:"#3B82F6"}}>LEVEL {gs.level}</span>
              </div>
              <div style={{background:"rgba(0,0,0,0.05)",height:8,borderRadius:4,overflow:"hidden"}}>
                <div style={{width:`${Math.min((gs.xp/gs.xpNext)*100, 100)}%`,height:"100%",background:"linear-gradient(90deg,#3B82F6,#60A5FA)",borderRadius:4,transition:"width .5s ease"}}/>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Belajar */}
        <div style={{background:"var(--bg-card)",borderRadius:24,padding:"20px",boxShadow:C.shadowCard,marginBottom:16,animation:"fadeUp .45s ease"}}>
          <div style={{fontFamily:"Exo 2",fontWeight:900,fontSize:14,color:"var(--text-main)",marginBottom:14}}>🚀 {isEn ? "LEARNING PROGRESS" : "PROGRESS BELAJAR"}</div>
          {[
            {label:isEn ? "AI Academy Modules" : "Modul AI Academy",val:gs.academyDone || 0,max:20,grad:"linear-gradient(90deg,#059669,#10B981)"},
            {label:"English Lab",val:gs.engDone || 0,max:50,grad:"linear-gradient(90deg,#2563EB,#60A5FA)"},
            {label:isEn ? "Interview Simulation" : "Simulasi Interview",val:gs.interviewDone || 0,max:10,grad:"linear-gradient(90deg,#D97706,#FBBF24)"}
          ].map((p,i)=>(
            <div key={i} style={{marginBottom:i<2?14:0}}>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:12,fontWeight:700,color:"var(--text-sec)",marginBottom:6}}>
                <span>{p.label}</span><span style={{color:"#2563EB",fontFamily:"Exo 2"}}>{p.val}/{p.max}</span>
              </div>
              <div style={{background:"var(--bg-main)",borderRadius:99,height:8,overflow:"hidden",border:"1px solid var(--border-color)"}}>
                <div style={{width:`${Math.min((p.val/p.max)*100,100)}%`,height:"100%",background:p.grad,borderRadius:99,transition:"width .6s"}}/>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Grid */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16,animation:"fadeUp .5s ease"}}>
          <div style={{background:"var(--bg-card)",borderRadius:20,padding:16,boxShadow:C.shadowCard,display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:40,height:40,borderRadius:12,background:"rgba(16,185,129,.1)",color:"#10B981",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>⭐</div>
            <div>
              <div style={{fontFamily:"Exo 2",fontWeight:900,fontSize:18,color:"var(--text-main)"}}>{gs.xp.toLocaleString("id-ID")}</div>
              <div style={{fontSize:10,fontWeight:700,color:"var(--text-sec)"}}>TOTAL XP</div>
            </div>
          </div>
          <div style={{background:"var(--bg-card)",borderRadius:20,padding:16,boxShadow:C.shadowCard,display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:40,height:40,borderRadius:12,background:"rgba(245,158,11,.1)",color:"#F59E0B",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}><img src="/coin.png" style={{width:"1.1em", height:"1.1em", verticalAlign:"middle", margin:"0 2px", position:"relative", top:"-2px", borderRadius:"50%", objectFit:"cover"}} alt="coin"/></div>
            <div>
              <div style={{fontFamily:"Exo 2",fontWeight:900,fontSize:18,color:"var(--text-main)"}}>{gs.coins.toLocaleString("id-ID")}</div>
              <div style={{fontSize:10,fontWeight:700,color:"var(--text-sec)"}}>SMARTCOINS</div>
            </div>
          </div>
        </div>

        {/* Subscription Status */}
        <div style={{background:"linear-gradient(135deg,#FFFBEB,#FEF3C7)",border:"1px solid #FCD34D",borderRadius:20,padding:"16px",marginBottom:16,display:"flex",justifyContent:"space-between",alignItems:"center",animation:"fadeUp .6s ease"}}>
          <div>
            <div style={{fontFamily:"Exo 2",fontWeight:900,fontSize:14,color:"#D97706",marginBottom:2}}>{isEn ? "License Status" : "Status Lisensi"}</div>
            <div style={{fontSize:12,color:"#92400E",fontWeight:600}}>
              {gs.proStatus?.scholar && gs.proStatus?.english ? "👑 FULL BUNDLE PRO" :
               gs.proStatus?.scholar ? "🎓 AI ACADEMY PRO" :
               gs.proStatus?.english ? "🤖 AI ENGLISH TUTOR PRO" : (isEn ? "Free Basic" : "Bebas (Gratis)")}
            </div>
          </div>
          <div className="tap" onClick={()=>onNav("pricing")} style={{background:"#D97706",color:"#fff",padding:"8px 16px",borderRadius:99,fontSize:12,fontWeight:800}}>Upgrade</div>
        </div>

        {/* Achievements */}
        <div style={{background:"var(--bg-card)",borderRadius:24,padding:"20px",boxShadow:C.shadowCard,animation:"fadeUp .7s ease"}}>
          <div style={{fontFamily:"Exo 2",fontWeight:900,fontSize:14,color:"var(--text-main)",marginBottom:14}}>🏆 {isEn ? "ACHIEVEMENTS" : "PENCAPAIAN"}</div>
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            {achs.map((a,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:12,opacity:a.done?1:0.5,filter:a.done?"none":"grayscale(1)"}}>
                <div style={{width:46,height:46,borderRadius:14,background:a.done?"rgba(16,185,129,.1)":"var(--bg-main)",border:a.done?"2px solid rgba(16,185,129,.3)":"2px dashed var(--border-color)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24}}>
                  {a.icon}
                </div>
                <div style={{flex:1}}>
                  <div style={{fontFamily:"Exo 2",fontWeight:800,fontSize:13,color:"var(--text-main)",marginBottom:2}}>{a.title}</div>
                  <div style={{fontSize:10,color:"var(--text-sec)"}}>{a.sub}</div>
                </div>
                {a.done && <div style={{color:"#10B981",fontSize:18}}>✅</div>}
              </div>
            ))}
          </div>
        </div>
        
        {/* Logout */}
        <div className="tap" onClick={async () => {
          try {
            await signOut(auth);
          } catch(e) {
            console.error(e);
          }
        }} style={{marginTop:24,background:"rgba(220,38,38,.1)",color:"#DC2626",textAlign:"center",padding:14,borderRadius:16,fontWeight:800,fontSize:14}}>
          {isEn ? "Sign Out" : "Keluar (Logout)"}
        </div>

      </div>
    </div>
  );
}
