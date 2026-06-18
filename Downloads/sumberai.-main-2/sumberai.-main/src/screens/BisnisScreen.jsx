import React, { useState, useRef, useEffect } from 'react';
import { C, NEG_SCENARIOS } from '../data/mockData';
import { CoinBadge, CoinPopup, Tag } from '../components/Shared';

export default function BisnisScreen({ gs, onCoinEarned, onXPEarned }) {
  const [scenario,setScenario]=useState(null);
  const [msgs,setMsgs]=useState([]);
  const [inp,setInp]=useState("");
  const [loading,setLoading]=useState(false);
  const [turn,setTurn]=useState(0);
  const [scoring,setScoring]=useState(false);
  const [finalScore,setFinalScore]=useState(null);
  const [coinTrig,setCoinTrig]=useState(0);
  const [lastC,setLastC]=useState(0);
  const bottomRef=useRef(null);

  useEffect(()=>{ bottomRef.current?.scrollIntoView({behavior:"smooth"}); },[msgs]);

  const startScenario=(s)=>{
    setScenario(s); setTurn(0); setFinalScore(null); setInp("");
    const buyerName=s.id==="n1"?"James Mitchell":s.id==="n2"?"Sarah Tan":"Budi Santoso";
    setMsgs([{role:"assistant",content:`Hello! I'm ${buyerName}. I understand you'd like to discuss a business opportunity.\n\nPlease go ahead and make your opening proposal. I'm listening. 🤝\n\n*(Negotiate in English — 6 turns, then AI scores your negotiation!)*`}]);
  };

  const sendMsg=async(text)=>{
    if(!text.trim()||loading) return;
    setInp(""); const nm=[...msgs,{role:"user",content:text}]; setMsgs(nm); setLoading(true);
    const newTurn=turn+1; setTurn(newTurn);

    if(newTurn>=6){
      setScoring(true);
      setTimeout(()=>{
        // MOCK SCORING
        const sc = 85;
        const coins=Math.floor(scenario.coins*sc/100);
        const textResult = `**Overall Score: ${sc}/100**<br/>**Confidence & Assertiveness: 22/25**<br/>**Price Negotiation: 20/25**<br/>**Professional English: 21/25**<br/>**Business Awareness: 22/25**<br/><br/>**✅ Strengths:**<br/>• Good opening proposal.<br/>• Kept a professional tone.<br/><br/>**💡 Improve:**<br/>• Be more firm on your pricing threshold.<br/><br/>**🤝 Deal Result:** Deal reached successfully with slight compromises.`;
        setFinalScore({text:textResult,score:sc,coins});
        onCoinEarned(coins); onXPEarned(20); setLastC(coins); setCoinTrig(t=>t+1);
        setLoading(false); setScoring(false);
      }, 1500);
      return;
    }

    setTimeout(()=>{
      // MOCK BOT RESPONSE
      const reply = "I see your point. However, my budget is a bit tight. Can we negotiate a 10% discount if I increase the order volume?";
      setMsgs(m=>[...m,{role:"assistant",content:reply}]);
      setLoading(false);
    }, 1000);
  };

  if(finalScore) return (
    <div style={{paddingTop:56,paddingBottom:100,minHeight:"100vh",background:`linear-gradient(180deg,#FFFBEB,#EEF4FF)`}}>
      <CoinPopup coins={lastC} trigger={coinTrig}/>
      <div style={{padding:"20px 16px 0"}}>
        <div style={{background:C.goldGrad,borderRadius:26,padding:28,textAlign:"center",boxShadow:"0 12px 40px rgba(217,119,6,.25)",marginBottom:16,animation:"scaleIn .4s ease"}}>
          <div style={{fontSize:52,marginBottom:8}}>{finalScore.score>=80?"🏆":finalScore.score>=60?"🎯":"💪"}</div>
          <h2 style={{fontFamily:"Exo 2",fontWeight:900,fontSize:22,color:"#fff",marginBottom:4}}>Negosiasi Selesai!</h2>
          <div style={{fontFamily:"Exo 2",fontWeight:900,fontSize:36,color:"#fff",marginBottom:4}}>{finalScore.score}<span style={{fontSize:18,opacity:.7}}>/100</span></div>
          <div style={{background:"rgba(255,255,255,.25)",borderRadius:16,padding:"12px 20px",display:"inline-block"}}>
            <div style={{fontFamily:"Exo 2",fontWeight:900,fontSize:20,color:"#fff"}}><img src="/coin.png" style={{width:"1.1em", height:"1.1em", verticalAlign:"middle", margin:"0 2px", position:"relative", top:"-2px", borderRadius:"50%", objectFit:"cover"}} alt="coin"/> +{finalScore.coins} SmartCoin!</div>
          </div>
        </div>
        <div style={{background:"var(--bg-card)",borderRadius:20,padding:18,marginBottom:14,boxShadow:C.shadowCard,border:"1.5px solid #FCD34D"}}>
          <div style={{fontSize:12,fontWeight:800,color:C.gold,marginBottom:8}}>📊 Penilaian AI Coach (Mock)</div>
          <div style={{fontSize:13,color:C.text,lineHeight:1.8}} dangerouslySetInnerHTML={{__html:finalScore.text.replace(/\*\*(.*?)\*\*/g,"<strong style='color:#D97706'>$1</strong>").replace(/\n/g,"<br/>")}}/>
        </div>
        <div style={{display:"flex",gap:10}}>
          <button className="tap" onClick={()=>{setScenario(null);setFinalScore(null);}} style={{flex:1,padding:14,background:"#EFF6FF",border:"2px solid #DBEAFE",borderRadius:16,fontWeight:800,fontSize:14,color:C.blue,cursor:"pointer",fontFamily:"Nunito"}}>Skenario Lain</button>
          <button className="tap" onClick={()=>startScenario(scenario)} style={{flex:1,padding:14,background:C.goldGrad,border:"none",borderRadius:16,fontWeight:800,fontSize:14,color:"#fff",cursor:"pointer",fontFamily:"Nunito",boxShadow:"0 6px 16px rgba(217,119,6,.25)"}}>Ulangi</button>
        </div>
      </div>
    </div>
  );

  if(!scenario) return (
    <div style={{paddingTop:56,paddingBottom:100,minHeight:"100vh",background:`linear-gradient(180deg,#FFFBEB,#EEF4FF)`}}>
      <CoinPopup coins={lastC} trigger={coinTrig}/>
      <div style={{background:"linear-gradient(135deg,#D97706,#F59E0B,#FCD34D)",padding:"24px 18px 22px",borderRadius:"0 0 28px 28px",boxShadow:"0 8px 32px rgba(217,119,6,.22)"}}>
        <div style={{display:"flex",gap:12,alignItems:"center",marginBottom:14}}>
          <div style={{width:50,height:50,borderRadius:18,background:"rgba(255,255,255,.25)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24}}>💼</div>
          <div>
            <div style={{fontFamily:"Exo 2",fontWeight:900,fontSize:21,color:"#fff"}}>GLOBAL NEGOTIATOR</div>
            <div style={{fontSize:12,color:"rgba(255,255,255,.85)"}}>Level 3 PRO · Simulasi Bisnis · Heavy SmartCoin</div>
          </div>
        </div>
        <div style={{background:"rgba(255,255,255,.2)",borderRadius:14,padding:"10px 14px",fontSize:12,color:"rgba(255,255,255,.9)",fontWeight:600,lineHeight:1.7}}>
          Negosiasikan bisnis nyata dalam <strong>Bahasa Inggris</strong>. Setelah <strong>6 exchange</strong>, AI menilai skill negosiasimu dan memberikan SmartCoin proporsional!
        </div>
      </div>
      <div style={{padding:"16px"}}>
        <div style={{fontFamily:"Exo 2",fontWeight:900,fontSize:12,color:C.textMute,letterSpacing:1,marginBottom:12}}>PILIH SKENARIO BISNIS JAMBI</div>
        {NEG_SCENARIOS.map((s,i)=>(
          <div key={s.id} className="tap" onClick={()=>startScenario(s)} style={{background:"var(--bg-card)",borderRadius:22,marginBottom:12,overflow:"hidden",boxShadow:C.shadowCard,animation:`fadeUp ${.3+i*.1}s ease both`,border:"1.5px solid #FCD34D"}}>
            <div style={{height:4,background:C.goldGrad}}/>
            <div style={{padding:"16px 18px"}}>
              <div style={{display:"flex",gap:12,alignItems:"flex-start"}}>
                <div style={{width:52,height:52,borderRadius:18,background:C.goldGrad,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,flexShrink:0,boxShadow:"0 4px 14px rgba(217,119,6,.25)"}}>{s.icon}</div>
                <div style={{flex:1}}>
                  <div style={{fontFamily:"Exo 2",fontWeight:900,fontSize:15,color:C.text,marginBottom:2}}>{s.title}</div>
                  <div style={{fontSize:11,color:C.textMute,marginBottom:8}}>{s.subtitle}</div>
                  <div style={{fontSize:11,color:C.textSec,lineHeight:1.5}}>{s.context.slice(0,90)}...</div>
                </div>
              </div>
              <div style={{marginTop:12,display:"flex",justifyContent:"space-between",background:"#FFFBEB",borderRadius:12,padding:"8px 14px",alignItems:"center",border:"1px solid #FCD34D"}}>
                <span style={{fontSize:11,color:C.textSec,fontWeight:600}}>Nilai proporsional dengan skor</span>
                <Tag label={<>Up to {s.coins} <img src="/coin.png" style={{width:"1.1em", height:"1.1em", verticalAlign:"middle", margin:"0 2px", position:"relative", top:"-2px", borderRadius:"50%", objectFit:"cover"}} alt="coin"/></>} color={C.gold} bg={C.goldLt}/>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{display:"flex",flexDirection:"column",height:"100vh",background:"#FFFBEB"}}>
      <CoinPopup coins={lastC} trigger={coinTrig}/>
      <div style={{background:"linear-gradient(135deg,#D97706,#F59E0B)",padding:"56px 16px 12px",flexShrink:0,boxShadow:"0 4px 20px rgba(217,119,6,.2)"}}>
        <div style={{display:"flex",gap:10,alignItems:"center"}}>
          <button className="tap" onClick={()=>setScenario(null)} style={{background:"rgba(255,255,255,.25)",border:"none",color:"#fff",borderRadius:12,padding:"6px 12px",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"Nunito"}}>←</button>
          <div style={{flex:1}}>
            <div style={{fontFamily:"Exo 2",fontWeight:900,color:"#fff",fontSize:14}}>{scenario.title}</div>
            <div style={{fontSize:11,color:"rgba(255,255,255,.85)"}}>Turn {turn}/6 · {Math.max(0,6-turn)} left</div>
          </div>
        </div>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"16px",paddingBottom:80}}>
        <div style={{background:"var(--bg-card)",borderRadius:16,padding:"14px 16px",marginBottom:20,border:"1.5px solid #FCD34D",boxShadow:C.shadowCard}}>
          <div style={{fontSize:11,color:C.gold,fontWeight:800,marginBottom:6}}>Konteks Bisnis:</div>
          <div style={{fontSize:12,color:C.text,lineHeight:1.6}}>{scenario.context}</div>
        </div>
        {msgs.map((m,i)=>(
          <div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start",marginBottom:14,animation:"fadeUp .25s ease"}}>
            {m.role==="assistant"&&<div style={{width:32,height:32,borderRadius:12,background:C.goldGrad,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,marginRight:10,flexShrink:0,boxShadow:"0 4px 10px rgba(217,119,6,.25)"}}>{scenario.icon}</div>}
            <div style={{maxWidth:"80%",padding:"12px 16px",borderRadius:m.role==="user"?"18px 18px 4px 18px":"18px 18px 18px 4px",background:m.role==="user"?C.goldGrad:"#fff",color:m.role==="user"?"#fff":C.text,fontSize:13,lineHeight:1.6,fontWeight:600,boxShadow:C.shadowCard,border:m.role==="assistant"?"1.5px solid #FEF3C7":"none"}} dangerouslySetInnerHTML={{__html:m.content.replace(/\n/g,"<br/>")}}/>
          </div>
        ))}
        {loading&&<div style={{display:"flex",marginBottom:14}}>
          <div style={{width:32,height:32,borderRadius:12,background:C.goldGrad,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,marginRight:10}}>💼</div>
          <div style={{background:"var(--bg-card)",borderRadius:"18px 18px 18px 4px",padding:"14px 16px",border:"1.5px solid #FEF3C7"}}>
            <div style={{display:"flex",gap:4}}>{[0,1,2].map(i=><div key={i} style={{width:8,height:8,borderRadius:"50%",background:C.gold,animation:`bounce 1s ${i*.18}s infinite`}}/>)}</div>
          </div>
        </div>}
        <div ref={bottomRef}/>
      </div>
      <div style={{padding:"12px 16px",background:"var(--bg-card)",borderTop:"1px solid #FEF3C7"}}>
        <div style={{display:"flex",gap:10}}>
          <input value={inp} onChange={e=>setInp(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendMsg(inp)} placeholder="Type negotiation in English..."
            style={{flex:1,padding:"14px 16px",background:"#FFFBEB",border:"2px solid #FCD34D",borderRadius:16,fontSize:13,fontFamily:"Nunito",outline:"none",color:C.text}}/>
          <button className="tap" onClick={()=>sendMsg(inp)} disabled={!inp.trim()||loading} style={{width:50,height:50,borderRadius:16,background:inp.trim()&&!loading?C.goldGrad:"#E2E8F0",border:"none",color:inp.trim()&&!loading?"#fff":C.textMute,fontSize:20,cursor:inp.trim()&&!loading?"pointer":"default",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all .2s"}}>➤</button>
        </div>
      </div>
    </div>
  );
}

