import React from 'react';
import { C } from '../data/mockData';

export function Logo({ size=30 }) {
  return (
    <div style={{display:"flex",alignItems:"center",gap:9}}>
      <img src="/logo.webp" alt="SumberAI Logo" style={{width: size * 1.2, height: size * 1.2, borderRadius: "50%", objectFit: "cover", boxShadow: "0 4px 12px rgba(6, 182, 212, 0.4)"}} />
      <div style={{lineHeight:1.1}}>
        <div style={{fontFamily:"Exo 2",fontWeight:900,fontSize:size*.5, color:"var(--text-main)", letterSpacing:-.3}}>
          SumberAI
        </div>
        <div style={{fontSize:size*.22,color:"#9CA3AF",fontWeight:700,letterSpacing:.4}}>
          GAMIFIED LEARNING
        </div>
      </div>
    </div>
  );
}

export function XPBar({ xp, max, level }) {
  const pct = Math.min((xp / max) * 100, 100);
  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",fontSize:10,fontWeight:700,color:"rgba(255,255,255,.8)",marginBottom:4}}>
        <span>XP {xp}/{max}</span>
        <span>LEVEL {level}</span>
      </div>
      <div style={{background:"rgba(255,255,255,.2)",height:8,borderRadius:4,overflow:"hidden"}}>
        <div style={{width:`${pct}%`,height:"100%",background:"#fff",borderRadius:4,transition:"width .5s ease"}}/>
      </div>
    </div>
  );
}

export function HPBar({ hp, max }) {
  const pct = Math.max(0, Math.min((hp / max) * 100, 100));
  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",fontSize:10,fontWeight:700,color:"rgba(0,0,0,.6)",marginBottom:4}}>
        <span>HP</span>
        <span>{hp}/{max}</span>
      </div>
      <div style={{background:"#FEE2E2",height:8,borderRadius:4,overflow:"hidden"}}>
        <div style={{width:`${pct}%`,height:"100%",background:pct>20?"#EF4444":"#B91C1C",borderRadius:4,transition:"width .3s ease"}}/>
      </div>
    </div>
  );
}

export function Tag({ label, color, bg }) {
  return (
    <span style={{background:bg, color:color, padding:"2px 8px", borderRadius:99, fontSize:9, fontWeight:800, letterSpacing:.5}}>
      {label}
    </span>
  );
}

export function CoinBadge({ amount }) {
  return (
    <div style={{background:"#FEF3C7",border:"1px solid #FCD34D",padding:"4px 10px",borderRadius:99,display:"flex",alignItems:"center",gap:6,fontWeight:800,fontSize:13,color:"#D97706",boxShadow:"0 2px 8px rgba(217,119,6,.15)"}}>
      <span><img src="/coin.png" style={{width:"1.1em", height:"1.1em", verticalAlign:"middle", margin:"0 2px", position:"relative", top:"-2px", borderRadius:"50%", objectFit:"cover"}} alt="coin"/></span> {amount}
    </div>
  );
}

export function CoinPopup({ amount, x, y }) {
  return (
    <div style={{position:"absolute",left:x,top:y,pointerEvents:"none",animation:"coinFloat 1s ease-out forwards",fontSize:24,fontWeight:900,color:"#F59E0B",textShadow:"0 2px 10px rgba(245,158,11,.4)",zIndex:100}}>
      +{amount} <img src="/coin.png" style={{width:"1.1em", height:"1.1em", verticalAlign:"middle", margin:"0 2px", position:"relative", top:"-2px", borderRadius:"50%", objectFit:"cover"}} alt="coin"/>
    </div>
  );
}

export function TopBar({ gs, onLogo, onNav, isDark, setIsDark }) {
  return (
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 16px",background:"var(--bg-card)",backdropFilter:"blur(12px)",borderBottom:"1px solid var(--border-color)",position:"fixed",top:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:430,zIndex:100}}>
      <div className="tap" onClick={onLogo}><Logo size={32}/></div>
      <div style={{display:"flex",gap:8,alignItems:"center"}}>
        <div className="tap" onClick={() => setIsDark(!isDark)} style={{fontSize: 18, background: isDark ? "#334155" : "#F1F5F9", width: 34, height: 34, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center"}}>
          {isDark ? "🌙" : "☀️"}
        </div>
        {(() => {
          const s = gs.proStatus?.scholar;
          const e = gs.proStatus?.english;
          let label = "👑 PRO";
          let bg = "linear-gradient(135deg,#1E3A8A,#3B82F6)";
          let color = "#fff";
          let shadow = "0 2px 8px rgba(37,99,235,.3)";
          
          if (s && e) {
            label = "👑 MAX";
            bg = "linear-gradient(135deg,#8B5CF6,#D946EF)";
            shadow = "0 2px 8px rgba(217,70,239,.4)";
          } else if (s) {
            label = "✨ ACA PRO";
            bg = "linear-gradient(135deg,#F59E0B,#FCD34D)";
            color = "#78350F";
            shadow = "0 2px 8px rgba(245,158,11,.4)";
          } else if (e) {
            label = "🇬🇧 ENG PRO";
            bg = "linear-gradient(135deg,#059669,#34D399)";
            shadow = "0 2px 8px rgba(16,185,129,.4)";
          }

          return (
            <div className="tap" onClick={() => onNav && onNav("pricing")} style={{background: bg, color: color, padding:"4px 8px", borderRadius:8, fontSize:10, fontWeight:900, boxShadow: shadow, display:"flex", alignItems:"center", gap:4, cursor:"pointer"}}>
              {label}
            </div>
          );
        })()}
        <div style={{background:"#FEF3C7",border:"1px solid #FCD34D",padding:"4px 8px",borderRadius:99,display:"flex",alignItems:"center",gap:4,fontWeight:800,fontSize:12,color:"#D97706",boxShadow:"0 2px 8px rgba(217,119,6,.15)"}}>
          <span><img src="/coin.png" style={{width:"1.1em", height:"1.1em", verticalAlign:"middle", margin:"0 2px", position:"relative", top:"-2px", borderRadius:"50%", objectFit:"cover"}} alt="coin"/></span> {gs.coins}
        </div>
        <div style={{width:30,height:30,borderRadius:"50%",background:"linear-gradient(135deg,#2563EB,#60A5FA)",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:12,boxShadow:"0 4px 12px rgba(37,99,235,.2)"}}>
          {gs.name.charAt(0).toUpperCase()}
        </div>
      </div>
    </div>
  );
}

export function BottomNav({ gs, active, onNav }) {
  const isEn = gs?.lang === 'en';
  const menus = [
    {id:"home",icon:"🏠",label:isEn ? "Home" : "Beranda"},
    {id:"arena",icon:"⚔️",label:"Arena"},
    {id:"academy",icon:"🎓",label:"Academy"},
    {id:"market",icon:"🛒",label:"Market"},
    {id:"profile",icon:"👤",label:isEn ? "Profile" : "Profil"}
  ];
  return (
    <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:430,background:"var(--bg-card)",borderTop:"1px solid rgba(0,0,0,.05)",display:"flex",justifyContent:"space-around",padding:"12px 10px 24px",zIndex:100,boxShadow:"0 -10px 30px rgba(0,0,0,.04)"}}>
      {menus.map(m=>{
        const isAct = active === m.id;
        return (
          <div key={m.id} className="tap" onClick={()=>onNav(m.id)} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4,opacity:isAct?1:.5,transition:"all .2s"}}>
            <div style={{fontSize:isAct?22:20,filter:isAct?"drop-shadow(0 4px 8px rgba(37,99,235,.3))":"none",transform:isAct?"translateY(-2px)":"none",transition:"all .3s ease"}}>{m.icon}</div>
            <div style={{fontSize:10,fontWeight:isAct?800:600,color:isAct?"#2563EB":"var(--text-sec)"}}>{m.label}</div>
          </div>
        );
      })}
    </div>
  );
}

export function CoinAnnouncement({ show, onClose, title, rules, isEn }) {
  if (!show) return null;
  return (
    <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(15,23,42,0.8)",zIndex:9999,display:"flex",justifyContent:"center",alignItems:"center",backdropFilter:"blur(4px)",padding:20}}>
      <div style={{background:"var(--bg-card)",borderRadius:24,padding:24,width:"100%",maxWidth:360,boxShadow:"0 20px 40px rgba(0,0,0,0.3)",animation:"popIn .3s cubic-bezier(0.175, 0.885, 0.32, 1.275)"}}>
        <div style={{fontSize:40,marginBottom:12,textAlign:"center"}}>ℹ️</div>
        <h3 style={{fontFamily:"Exo 2",fontSize:22,fontWeight:900,color:"var(--text-main)",marginBottom:16,textAlign:"center"}}>{title}</h3>
        <div style={{background:"var(--bg-main)",padding:16,borderRadius:16,marginBottom:24}}>
          <h4 style={{fontSize:13,fontWeight:800,color:"var(--blue)",marginBottom:12}}>{isEn ? "HOW TO EARN COINS:" : "CARA MENDAPATKAN KOIN:"}</h4>
          <ul style={{margin:0,paddingLeft:20,color:"var(--text-sec)",fontSize:13,lineHeight:1.6}}>
            {rules.map((rule, idx) => (
              <li key={idx} style={{marginBottom:8}}>
                <span dangerouslySetInnerHTML={{__html: rule}} />
              </li>
            ))}
          </ul>
        </div>
        <button className="tap" onClick={onClose} style={{width:"100%",background:"linear-gradient(135deg, #3B82F6, #2563EB)",color:"#fff",border:"none",padding:16,borderRadius:16,fontSize:15,fontWeight:800,boxShadow:"0 8px 24px rgba(37,99,235,0.3)"}}>
          {isEn ? "GOT IT!" : "MENGERTI!"}
        </button>
      </div>
    </div>
  );
}