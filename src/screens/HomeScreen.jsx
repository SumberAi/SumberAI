import React from 'react';
import { C } from '../data/mockData';
import { XPBar, Tag } from '../components/Shared';

export default function HomeScreen({ gs, setGs, onNav, onClaimStarter }) {
  const isEn = gs.lang === 'en';
  const hr = new Date().getHours();
  const greet = hr<12 ? (isEn ? "Good Morning 🌅" : "Selamat Pagi 🌅") : hr<17 ? (isEn ? "Good Afternoon ☀️" : "Selamat Siang ☀️") : (isEn ? "Good Evening 🌙" : "Selamat Malam 🌙");

  const toggleLang = () => setGs(p => ({ ...p, lang: p.lang === 'en' ? 'id' : 'en' }));

  const levels = [
    {id:"arena",num:1,icon:<img src="./gamy_arena.jpeg" alt="Gamy Arena" style={{ width: 56, height: 56, borderRadius: 18, objectFit: "cover" }} />,name:"GAMY ARENA",sub:isEn ? "Arcade & Action Games" : "Kumpulan Game Arcade • Petualangan & Aksi",tag:isEn ? "FREE • +SmartCoin" : "FREE • +SmartCoin",
     grad:"linear-gradient(135deg,#DC2626,#F87171,#FBBF24)",glow:"rgba(220,38,38,.2)", isPremium: false},
    {id:"english",num:2,icon:<img src="./english_lab.jpeg" alt="English Lab" style={{ width: 56, height: 56, borderRadius: 18, objectFit: "cover" }} />,name:"ENGLISH LAB",sub:isEn ? "GRAMMAR Simulation" : "Simulasi GRAMMAR",tag:"+SmartCoin",
     grad:"linear-gradient(135deg,#2563EB,#60A5FA,#06B6D4)",glow:"rgba(37,99,235,.2)", isPremium: false},
    {id:"interview_pro",num:3,icon:<div style={{width: 56, height: 56, borderRadius: 18, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden"}}><img src="./sumberai.png" alt="Sumber AI" style={{ width: 52, height: 52, objectFit: "contain", filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))" }} /></div>,name:"AI ENGLISH TUTOR",sub:"AI Conversation",tag:"Freemium • +SmartCoin",
     grad:"linear-gradient(135deg,#059669,#10B981,#34D399)",glow:"rgba(16,185,129,.2)", isPremium: false}
  ];

  return (
    <div style={{paddingTop:56,paddingBottom:100,minHeight:"100vh",background:"var(--bg-main)"}}>
      
      {/* Starter Claim Modal */}
      {gs.hasClaimedStarter === false && (
        <div style={{position:"fixed", inset:0, background:"rgba(15,23,42,0.85)", backdropFilter:"blur(8px)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", zIndex:9999, padding:20, textAlign:"center", animation:"fadeUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)"}}>
          
          <div style={{background:"linear-gradient(135deg, #1E293B 0%, #0F172A 100%)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:32, padding:"40px 24px", maxWidth:360, width:"100%", position:"relative", overflow:"hidden", boxShadow:"0 20px 50px rgba(0,0,0,0.5)"}}>
            
            {/* Glowing effect behind coin */}
            <div style={{position:"absolute", top:"25%", left:"50%", transform:"translate(-50%, -50%)", width:150, height:150, background:"rgba(251,191,36,0.2)", filter:"blur(40px)", borderRadius:"50%", pointerEvents:"none"}}></div>
            
            <h2 style={{fontFamily:"Exo 2", fontWeight:900, fontSize:26, color:"#fff", marginBottom:8, position:"relative", zIndex:10}}>
              <span style={{color:"#FBBF24"}}>SELAMAT DATANG</span> DI GAMY!
            </h2>
            <p style={{color:"#94A3B8", fontSize:14, marginBottom:30, position:"relative", zIndex:10, lineHeight:1.5}}>
              Klaim modal awalmu untuk mulai berpetualang dan rasakan serunya belajar di sini.
            </p>
            
            <div style={{position:"relative", zIndex:10, marginBottom:32, display:"inline-flex", flexDirection:"column", alignItems:"center"}}>
              <div style={{padding: "16px", background: "rgba(255,255,255,0.05)", borderRadius: "50%", marginBottom: 16, border: "1px solid rgba(255,255,255,0.1)", boxShadow: "inset 0 4px 20px rgba(0,0,0,0.5)"}}>
                 <img src="/coin.png" style={{width:"70px", height:"70px", borderRadius:"50%", objectFit:"cover", filter:"drop-shadow(0 10px 15px rgba(245,158,11,0.5))"}} alt="coin"/>
              </div>
              <div style={{fontSize:42, color:"#FCD34D", fontWeight:900, fontFamily:"Exo 2", textShadow:"0 4px 10px rgba(245,158,11,0.3)"}}>
                50 Koin
              </div>
            </div>
            
            <button className="tap" onClick={onClaimStarter} style={{background:"linear-gradient(135deg, #F59E0B, #FCD34D)", border:"none", padding:"16px 0", width:"100%", borderRadius:16, color:"#78350F", fontSize:17, fontWeight:900, cursor:"pointer", boxShadow:"0 8px 25px rgba(245,158,11,0.4)", position:"relative", zIndex:10, letterSpacing:0.5}}>
              KLAIM SEKARANG
            </button>
          </div>

        </div>
      )}

      <div style={{padding:"20px 16px 0"}}>
        <div style={{borderRadius:26,overflow:"hidden",boxShadow:"0 8px 40px rgba(37,99,235,.18)",marginBottom:16,animation:"fadeUp .4s ease"}}>
          <div style={{background:C.heroGrad,padding:"24px 22px 22px",position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",top:-40,right:-40,width:150,height:150,borderRadius:"50%",background:"rgba(255,255,255,.07)"}}/>
            <div style={{position:"absolute",bottom:-30,left:60,width:90,height:90,borderRadius:"50%",background:"rgba(255,255,255,.05)"}}/>
            <div style={{position:"absolute",top:20,right:20,width:60,height:60,borderRadius:"50%",background:"rgba(255,255,255,.06)"}}/>
            <div style={{position:"relative", display:"flex", alignItems:"center", gap: 16}}>
              <div style={{flex: 1}}>
                <div style={{display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4}}>
                  <p style={{color:"rgba(255,255,255,.8)",fontSize:13,margin:0}}>{greet}</p>
                  <div style={{display: "flex", background: "rgba(0,0,0,0.3)", borderRadius: 99, padding: 4, backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.4)", boxShadow: "0 4px 12px rgba(0,0,0,0.2)"}}>
                    <div className="tap" onClick={() => setGs(p => ({...p, lang: 'id'}))} style={{padding: "6px 16px", background: !isEn ? "#fff" : "transparent", color: !isEn ? "#2563EB" : "#E2E8F0", borderRadius: 99, fontSize: 14, fontWeight: 900, cursor: "pointer", transition: "all 0.2s"}}>ID</div>
                    <div className="tap" onClick={() => setGs(p => ({...p, lang: 'en'}))} style={{padding: "6px 16px", background: isEn ? "#fff" : "transparent", color: isEn ? "#2563EB" : "#E2E8F0", borderRadius: 99, fontSize: 14, fontWeight: 900, cursor: "pointer", transition: "all 0.2s"}}>EN</div>
                  </div>
                </div>
                <h1 style={{fontFamily:"Exo 2",fontWeight:900,fontSize:26,color:"#fff",marginBottom:16}}>{gs.name}</h1>
                <XPBar xp={gs.xp} max={gs.xpNext} level={gs.level}/>
              </div>
              <div className="tap" onClick={() => onNav('profile')} style={{width: 72, height: 72, borderRadius: "50%", background: "rgba(255,255,255,0.2)", overflow: "hidden", border: "3px solid rgba(255,255,255,0.9)", flexShrink: 0, boxShadow: "0 8px 16px rgba(0,0,0,0.2)", position: "relative", zIndex: 10, alignSelf: "flex-start", cursor: "pointer"}}>
                <img src={gs.customAvatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${gs.name}&backgroundColor=b6e3f4`} style={{width: "100%", height: "100%", objectFit: "cover"}} alt="Avatar"/>
              </div>
            </div>
          </div>
          <div style={{background:"var(--bg-card)",display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",borderTop:"none"}}>
            {[
              {l:"Coins",v:gs.coins,i:<img src="/coin.png" style={{width:"1.1em", height:"1.1em", verticalAlign:"middle", margin:"0 2px", position:"relative", top:"-2px", borderRadius:"50%", objectFit:"cover"}} alt="coin"/>,c:"#D97706",bg:"#FFFBEB"},
              {l:"Streak",v:`${gs.streak}d`,i:"🔥",c:C.orange,bg:"#FFF7ED"},
              {l:"Battles",v:gs.battlesWon,i:"⚔️",c:C.red,bg:"#FEF2F2"},
              {l:isEn ? "Redeemed" : "Ditukar",v:gs.redeemed,i:"🎁",c:C.green,bg:C.greenLt},
            ].map((s,i)=>(
              <div key={i} style={{padding:"12px 8px",textAlign:"center",background:s.bg,borderRight:i<3?"1px solid #F1F5F9":"none"}}>
                <div style={{fontSize:16,marginBottom:3}}>{s.i}</div>
                <div style={{fontFamily:"Exo 2",fontWeight:900,fontSize:15,color:s.c}}>{s.v}</div>
                <div style={{fontSize:10,color:C.textMute,fontWeight:700}}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{background:"linear-gradient(135deg,#FFFBEB,#FEF3C7)",border:"1.5px solid #FCD34D",borderRadius:18,padding:"12px 16px",marginBottom:18,display:"flex",gap:12,alignItems:"center",animation:"fadeUp .45s ease"}}>
          <span style={{fontSize:26}}><img src="/coin.png" style={{width:"1.1em", height:"1.1em", verticalAlign:"middle", margin:"0 2px", position:"relative", top:"-2px", borderRadius:"50%", objectFit:"cover"}} alt="coin"/></span>
          <div>
            <div style={{fontFamily:"Exo 2",fontWeight:800,fontSize:13,color:"#D97706"}}>{isEn ? "SmartCoin Ecosystem" : "Ekosistem SmartCoin"}</div>
            <div style={{fontSize:11,color:"#78350F",lineHeight:1.6,fontWeight:500}}>
              {isEn ? 
                "Earn coins from English Lab, AI Tutor daily bonus, and Arena games. Collect hundreds of coins every month!" : 
                "Dapatkan koin dari English Lab, bonus harian AI Tutor, serta game di Game Arena. Kumpulkan hingga ratusan koin tiap bulan!"
              }
            </div>
          </div>
        </div>

        <div style={{fontFamily:"Exo 2",fontWeight:900,fontSize:13,color:C.textMute,letterSpacing:1,marginBottom:12}}>
          {isEn ? "START ADVENTURE" : "MULAI PETUALANGAN"}
        </div>
        {levels.map((lv,i)=>{
          const isLocked = lv.isPremium && !gs.proStatus?.english;
          return (
          <div key={lv.id} style={{display:"flex",flexDirection:"column",alignItems:"center",marginBottom: i<levels.length-1?14:14}}>
            <div className="tap hover-card" onClick={()=>{ if(isLocked) onNav("pricing"); else onNav(lv.id); }} style={{width:"100%",borderRadius:22,overflow:"hidden",boxShadow:`0 6px 24px ${lv.glow}`,animation:`fadeUp ${.35+i*.12}s ease both`,background:"var(--bg-card)", filter: isLocked ? "grayscale(100%) opacity(0.8)" : "none", position:"relative"}}>
              <div style={{background:lv.grad,padding:"2px 0"}}/>
              <div style={{padding:"16px 18px",display:"flex",gap:14,alignItems:"center"}}>
                <div style={{width:56,height:56,borderRadius:18,background:lv.grad,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,flexShrink:0,boxShadow:`0 4px 16px ${lv.glow}`}}>
                  {isLocked ? "🔒" : lv.icon}
                </div>
                <div style={{flex:1}}>
                  <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:3}}>
                    <span style={{fontFamily:"Exo 2",fontWeight:900,fontSize:10,backgroundImage:lv.grad,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>LEVEL {lv.num}</span>
                    <Tag label={lv.tag} color={C.blue} bg={C.blueLt}/>
                  </div>
                  <div style={{fontFamily:"Exo 2",fontWeight:900,fontSize:15,color:C.text,marginBottom:2}}>{lv.name}</div>
                  <div style={{fontSize:11,color:C.textMute}}>{lv.sub}</div>
                </div>
                <div style={{fontSize:22,color:C.textMute}}>›</div>
              </div>
            </div>
            {i<levels.length-1&&<div style={{width:3,height:18,background:`linear-gradient(${levels[i].grad.match(/#[A-Fa-f0-9]{6}/g)?.[0]||C.blue},${levels[i+1].grad.match(/#[A-Fa-f0-9]{6}/g)?.[0]||C.purple})`,borderRadius:99,opacity:.5}}/>}
          </div>
        )})}

        {/* Features Grid: Academy & Market */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginTop:4,marginBottom:12}}>
          <div className="tap hover-card" onClick={()=>onNav("academy")} style={{background:"linear-gradient(135deg,#7C3AED,#A78BFA)",borderRadius:20,padding:"16px 14px",boxShadow:"0 6px 20px rgba(124,58,237,.2)",color:"#fff",animation:"fadeUp .6s ease"}}>
            <div style={{fontSize:26,marginBottom:6}}>📚</div>
            <div style={{fontFamily:"Exo 2",fontWeight:900,fontSize:14}}>AI Academy</div>
            <div style={{fontSize:11,opacity:.8}}>Kursus AI interaktif</div>
          </div>
          <div className="tap hover-card" onClick={()=>onNav("market")} style={{background:C.goldGrad,borderRadius:20,padding:"16px 14px",boxShadow:"0 6px 20px rgba(217,119,6,.2)",color:"#fff",animation:"fadeUp .65s ease"}}>
            <div style={{fontSize:26,marginBottom:6}}>🛍️</div>
            <div style={{fontFamily:"Exo 2",fontWeight:900,fontSize:14}}>UMKM Market</div>
            <div style={{fontSize:11,opacity:.9}}>Tukar SmartCoin</div>
          </div>
        </div>


      </div>
    </div>
  );
}

