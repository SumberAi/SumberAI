import React from 'react';

export default function ArenaScreen({ gs, onNav }) {
  return (
    <div style={{padding:"80px 16px 100px",background:`linear-gradient(180deg,#FEF2F2 0%,#EEF4FF 100%)`,minHeight:"100vh", position:"relative"}}>
      
      <div style={{background:"linear-gradient(135deg,#DC2626,#F87171,#FBBF24)",borderRadius:22,padding:"20px 18px",marginBottom:20,boxShadow:"0 8px 32px rgba(220,38,38,.2)",animation:"fadeUp .3s ease"}}>
        <div style={{display: "flex", alignItems: "center", marginBottom: 12}}>
          <button className="tap" onClick={() => onNav('home')} style={{background: "rgba(255,255,255,0.2)", border: "none", padding: "6px 12px", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 13, fontWeight: 800, color: "#fff"}}>
            ← Kembali
          </button>
        </div>
        <div style={{fontFamily:"Exo 2",fontWeight:900,fontSize:22,color:"#fff",marginBottom:2}}>🎮 GAMY ARENA</div>
        <div style={{fontSize:12,color:"rgba(255,255,255,.85)"}}>Tempat berkumpulnya game-game seru!</div>
      </div>

      <div style={{display:"flex", flexDirection:"column", gap:16}}>
        {/* Card Petualangan Jambi GAMY */}
        <div className="tap" onClick={()=>window.open('/petualangan.html', '_blank')} style={{background:"linear-gradient(135deg,#0a1628 0%,#1D4ED8 40%,#1565c0 70%,#42a5f5 100%)",borderRadius:22,padding:"18px 18px",boxShadow:"0 8px 28px rgba(13,71,161,.35)",animation:"fadeUp .4s ease",overflow:"hidden",position:"relative"}}>
          <div style={{position:"absolute",top:-20,right:-20,width:100,height:100,borderRadius:"50%",background:"rgba(255,255,255,.06)"}}/>
          <div style={{position:"absolute",bottom:-15,left:40,width:70,height:70,borderRadius:"50%",background:"rgba(255,255,255,.04)"}}/>
          <div style={{display:"flex",gap:14,alignItems:"center",position:"relative"}}>
            <div style={{width:60,height:60,borderRadius:20,background:"rgba(255,255,255,.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:30,flexShrink:0,border:"2px solid rgba(255,255,255,.2)"}}>🏝️</div>
            <div style={{flex:1}}>
              <div style={{display:"flex",flexWrap:"wrap",gap:6,alignItems:"center",marginBottom:6}}>
                <span style={{background:"rgba(251,191,36,.25)",border:"1px solid rgba(251,191,36,.5)",color:"#FCD34D",fontSize:10,fontWeight:800,padding:"2px 9px",borderRadius:99,letterSpacing:.3}}>PLATFORMER GAME</span>
                <span style={{background:"rgba(52,211,153,.2)",border:"1px solid rgba(52,211,153,.4)",color:"#6EE7B7",fontSize:10,fontWeight:800,padding:"2px 9px",borderRadius:99}}>9 LEVEL</span>
                <span style={{background:"rgba(59,130,246,.2)",border:"1px solid rgba(59,130,246,.4)",color:"#93C5FD",fontSize:10,fontWeight:800,padding:"2px 9px",borderRadius:99}}>+SmartCoin</span>
              </div>
              <div style={{fontFamily:"Exo 2",fontWeight:900,fontSize:17,color:"#fff",marginBottom:2}}>Petualangan Jambi</div>
              <div style={{fontSize:11,color:"rgba(255,255,255,.75)"}}>Jelajahi 9 Kab/Kota · Quiz Bahasa Inggris · Kumpulkan Pinang!</div>
            </div>
            <div style={{background:"rgba(255,255,255,.2)",borderRadius:14,padding:"10px 14px",color:"#fff",fontSize:14,fontWeight:800,flexShrink:0}}>▶ MAIN</div>
          </div>
        </div>

        {/* Card SAIGAMY */}
        <div className="tap" onClick={()=>window.open('/pou-jump-blue.html', '_blank')} style={{background:"linear-gradient(135deg,#020d1f 0%,#001a4d 40%,#003fa3 80%,#00aaff 100%)",borderRadius:22,padding:"16px 18px",boxShadow:"0 8px 28px rgba(0,100,255,.3)",animation:"fadeUp .5s ease",overflow:"hidden",position:"relative"}}>
          <div style={{position:"absolute",top:-20,right:-20,width:90,height:90,borderRadius:"50%",background:"rgba(0,200,255,.08)"}}/>
          <div style={{position:"absolute",bottom:-15,left:60,width:60,height:60,borderRadius:"50%",background:"rgba(0,150,255,.06)"}}/>
          <div style={{display:"flex",gap:14,alignItems:"center",position:"relative"}}>
            <div style={{width:56,height:56,borderRadius:20,background:"rgba(0,200,255,.15)",border:"2px solid rgba(0,200,255,.3)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,flexShrink:0}}>💙</div>
            <div style={{flex:1}}>
              <div style={{display:"flex",flexWrap:"wrap",gap:6,alignItems:"center",marginBottom:6}}>
                <span style={{background:"rgba(0,229,255,.2)",border:"1px solid rgba(0,229,255,.4)",color:"#00e5ff",fontSize:10,fontWeight:800,padding:"2px 9px",borderRadius:99,letterSpacing:.3}}>JUMP GAME</span>
                <span style={{background:"rgba(123,47,255,.25)",border:"1px solid rgba(123,47,255,.4)",color:"#a78bfa",fontSize:10,fontWeight:800,padding:"2px 9px",borderRadius:99}}>HIGH SCORE</span>
              </div>
              <div style={{fontFamily:"Exo 2",fontWeight:900,fontSize:17,color:"#fff",marginBottom:2}}>SAIGAMY</div>
              <div style={{fontSize:11,color:"rgba(0,200,255,.75)"}}>Lompat setinggi mungkin! ⚡ Platform super · ✦ Kristal bonus</div>
            </div>
            <div style={{background:"rgba(0,229,255,.2)",border:"1px solid rgba(0,229,255,.4)",borderRadius:14,padding:"10px 14px",color:"#00e5ff",fontSize:14,fontWeight:900,fontFamily:"Exo 2",flexShrink:0}}>▶ MAIN</div>
          </div>
        </div>

        {/* Card Vocab Defender GAMY */}
        <div className="tap" onClick={()=>onNav("typing")} style={{background:"linear-gradient(135deg,#0f172a 0%,#1e1b4b 50%,#4c1d95 100%)",borderRadius:22,padding:"16px 18px",boxShadow:"0 8px 28px rgba(76,29,149,.4)",animation:"fadeUp .6s ease",overflow:"hidden",position:"relative"}}>
          <div style={{position:"absolute",top:-30,right:-10,width:120,height:120,borderRadius:"50%",background:"rgba(167,139,250,.1)"}}/>
          <div style={{position:"absolute",bottom:-20,left:50,width:80,height:80,borderRadius:"50%",background:"rgba(139,92,246,.15)"}}/>
          <div style={{display:"flex",gap:14,alignItems:"center",position:"relative"}}>
            <div style={{width:56,height:56,borderRadius:20,background:"rgba(167,139,250,.2)",border:"2px solid rgba(167,139,250,.4)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,flexShrink:0}}>🚀</div>
            <div style={{flex:1}}>
              <div style={{display:"flex",flexWrap:"wrap",gap:6,alignItems:"center",marginBottom:6}}>
                <span style={{background:"rgba(244,114,182,.2)",border:"1px solid rgba(244,114,182,.4)",color:"#f472b6",fontSize:10,fontWeight:800,padding:"2px 9px",borderRadius:99,letterSpacing:.3}}>TYPING SHOOTER</span>
                <span style={{background:"rgba(52,211,153,.2)",border:"1px solid rgba(52,211,153,.4)",color:"#6ee7b7",fontSize:10,fontWeight:800,padding:"2px 9px",borderRadius:99}}>BOSS FIGHT</span>
                <span style={{background:"rgba(59,130,246,.2)",border:"1px solid rgba(59,130,246,.4)",color:"#93C5FD",fontSize:10,fontWeight:800,padding:"2px 9px",borderRadius:99}}>+SmartCoin</span>
              </div>
              <div style={{fontFamily:"Exo 2",fontWeight:900,fontSize:17,color:"#fff",marginBottom:2}}>Vocab Defender</div>
              <div style={{fontSize:11,color:"rgba(196,181,253,.8)"}}>Ketik kosakata & hancurkan alien! Kumpulkan koin <img src="/coin.png" style={{width:"1.1em", height:"1.1em", verticalAlign:"middle", margin:"0 2px", position:"relative", top:"-2px", borderRadius:"50%", objectFit:"cover"}} alt="coin"/></div>
            </div>
            <div style={{background:"rgba(167,139,250,.2)",border:"1px solid rgba(167,139,250,.5)",borderRadius:14,padding:"10px 14px",color:"#c4b5fd",fontSize:14,fontWeight:900,fontFamily:"Exo 2",flexShrink:0}}>▶ MAIN</div>
          </div>
        </div>

        {/* Card Ular Tangga Pintar */}
        <div className="tap" onClick={()=>onNav("board")} style={{background:"linear-gradient(135deg,#064e3b 0%,#059669 50%,#34d399 100%)",borderRadius:22,padding:"16px 18px",boxShadow:"0 8px 28px rgba(5,150,105,.4)",animation:"fadeUp .7s ease",overflow:"hidden",position:"relative"}}>
          <div style={{position:"absolute",top:-30,right:-10,width:120,height:120,borderRadius:"50%",background:"rgba(16,185,129,.1)"}}/>
          <div style={{position:"absolute",bottom:-20,left:50,width:80,height:80,borderRadius:"50%",background:"rgba(52,211,153,.15)"}}/>
          <div style={{display:"flex",gap:14,alignItems:"center",position:"relative"}}>
            <div style={{width:56,height:56,borderRadius:20,background:"rgba(16,185,129,.2)",border:"2px solid rgba(16,185,129,.4)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,flexShrink:0}}>🐍</div>
            <div style={{flex:1}}>
              <div style={{display:"flex",flexWrap:"wrap",gap:6,alignItems:"center",marginBottom:6}}>
                <span style={{background:"rgba(252,211,77,.2)",border:"1px solid rgba(252,211,77,.4)",color:"#fcd34d",fontSize:10,fontWeight:800,padding:"2px 9px",borderRadius:99,letterSpacing:.3}}>MULTIPLAYER</span>
                <span style={{background:"rgba(52,211,153,.2)",border:"1px solid rgba(52,211,153,.4)",color:"#6ee7b7",fontSize:10,fontWeight:800,padding:"2px 9px",borderRadius:99}}>PASS & PLAY</span>
              </div>
              <div style={{fontFamily:"Exo 2",fontWeight:900,fontSize:17,color:"#fff",marginBottom:2}}>Ular Tangga Pintar</div>
              <div style={{fontSize:11,color:"rgba(167,243,208,.8)"}}>Mabar 1 HP! Kuis benar maju, salah mundur.</div>
            </div>
            <div style={{background:"rgba(16,185,129,.2)",border:"1px solid rgba(16,185,129,.5)",borderRadius:14,padding:"10px 14px",color:"#a7f3d0",fontSize:14,fontWeight:900,fontFamily:"Exo 2",flexShrink:0}}>▶ MAIN</div>
          </div>
        </div>

        {/* Card Memory Match */}
        <div className="tap" onClick={()=>onNav("memory")} style={{background:"linear-gradient(135deg,#9333ea 0%,#a855f7 50%,#d8b4fe 100%)",borderRadius:22,padding:"16px 18px",boxShadow:"0 8px 28px rgba(168,85,247,.4)",animation:"fadeUp .8s ease",overflow:"hidden",position:"relative"}}>
          <div style={{position:"absolute",top:-30,right:-10,width:120,height:120,borderRadius:"50%",background:"rgba(216,180,254,.2)"}}/>
          <div style={{position:"absolute",bottom:-20,left:50,width:80,height:80,borderRadius:"50%",background:"rgba(233,213,255,.25)"}}/>
          <div style={{display:"flex",gap:14,alignItems:"center",position:"relative"}}>
            <div style={{width:56,height:56,borderRadius:20,background:"rgba(216,180,254,.3)",border:"2px solid rgba(216,180,254,.5)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,flexShrink:0}}>🧠</div>
            <div style={{flex:1}}>
              <div style={{display:"flex",flexWrap:"wrap",gap:6,alignItems:"center",marginBottom:6}}>
                <span style={{background:"rgba(253,230,138,.3)",border:"1px solid rgba(253,230,138,.5)",color:"#fde68a",fontSize:10,fontWeight:800,padding:"2px 9px",borderRadius:99,letterSpacing:.3}}>ASAH OTAK</span>
                <span style={{background:"rgba(216,180,254,.3)",border:"1px solid rgba(216,180,254,.5)",color:"#f3e8ff",fontSize:10,fontWeight:800,padding:"2px 9px",borderRadius:99}}>PUZZLE</span>
                <span style={{background:"rgba(59,130,246,.2)",border:"1px solid rgba(59,130,246,.4)",color:"#93C5FD",fontSize:10,fontWeight:800,padding:"2px 9px",borderRadius:99}}>+SmartCoin</span>
              </div>
              <div style={{fontFamily:"Exo 2",fontWeight:900,fontSize:17,color:"#fff",marginBottom:2}}>Kartu Memori AI</div>
              <div style={{fontSize:11,color:"rgba(243,232,255,.9)"}}>Cocokkan pasangan ikon teknologi dengan cepat!</div>
            </div>
            <div style={{background:"rgba(216,180,254,.3)",border:"1px solid rgba(216,180,254,.6)",borderRadius:14,padding:"10px 14px",color:"#fae8ff",fontSize:14,fontWeight:900,fontFamily:"Exo 2",flexShrink:0}}>▶ MAIN</div>
          </div>
        </div>

      </div>
    </div>
  );
}
