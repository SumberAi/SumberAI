import React, { useState } from 'react';
import { C, SPEAKING_CHALLENGES } from '../../data/mockData';
import { CoinBadge, CoinPopup, Tag } from '../../components/Shared';

export default function VocabMode({ onBack, onEarn }) {
  const [lesson, setLesson] = useState(null);
  const [phase, setPhase] = useState("pick");
  const [cardIdx, setCardIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [quizIdx, setQuizIdx] = useState(0);
  const [sel, setSel] = useState(null);
  const [correct, setCorrect] = useState(0);
  const [coinTrig, setCoinTrig] = useState(0);
  const [lastC, setLastC] = useState(0);

  const startLesson = (l)=>{ setLesson(l); setCardIdx(0); setFlipped(false); setPhase("learn"); };
  const startQuiz=()=>{ setQuizIdx(0); setSel(null); setCorrect(0); setPhase("quiz"); };

  const handleAnswer=(opt,ch)=>{
    if(sel!==null) return;
    setSel(opt);
    const isRight = opt===ch.q.slice(0,40)+"...";
    if(isRight){ const c=Math.floor(lesson.coins/lesson.challenges.length); onEarn(c,8); setLastC(c); setCoinTrig(t=>t+1); setCorrect(n=>n+1); }
    setTimeout(()=>{
      if(quizIdx+1<lesson.challenges.length){ setQuizIdx(q=>q+1); setSel(null); }
      else setPhase("result");
    },1200);
  };

  if(phase==="pick") return (
    <div style={{paddingTop: "calc(56px + env(safe-area-inset-top))",paddingBottom:24,background:`linear-gradient(180deg,#EFF6FF,#EEF4FF)`,flex:1}}>
      <CoinPopup coins={lastC} trigger={coinTrig}/>
      <div style={{background:"linear-gradient(135deg,#2563EB,#60A5FA,#06B6D4)",padding:"24px 18px 18px",borderRadius:"0 0 24px 24px",boxShadow:"0 8px 24px rgba(37,99,235,.2)"}}>
        <button className="tap" onClick={onBack} style={{background: "#fff", border: "1px solid #E2E8F0", width: 44, height: 44, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", marginBottom: 16, boxShadow: "0 4px 12px rgba(0,0,0,0.04)", flexShrink: 0}}>
          <span style={{fontSize: 20}}>⬅️</span>
        </button>
        <div style={{fontFamily:"Exo 2",fontWeight:900,fontSize:20,color:"#fff"}}>📖 Vocabulary Quiz</div>
        <div style={{fontSize:12,color:"rgba(255,255,255,.8)"}}>Pilih topik untuk mulai belajar</div>
      </div>
      <div style={{padding:"16px"}}>
        {SPEAKING_CHALLENGES.map((l,i)=>(
          <div key={l.id} className="tap" onClick={()=>startLesson(l)} style={{background:"#fff",borderRadius:20,padding:"16px 18px",marginBottom:12,boxShadow:C.shadowCard,animation:`fadeUp ${.3+i*.1}s ease both`,display:"flex",alignItems:"center",gap:14,border:"1.5px solid #DBEAFE"}}>
            <div style={{width:50,height:50,borderRadius:16,background:`linear-gradient(135deg,#2563EB,#60A5FA)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{l.icon}</div>
            <div style={{flex:1}}>
              <div style={{fontFamily:"Exo 2",fontWeight:800,fontSize:14,color:C.text}}>{l.title}</div>
              <div style={{fontSize:11,color:C.textMute}}>{l.cat} · {l.challenges.length} soal · <strong style={{color:C.gold}}>+{l.coins} <img src="/coin.png" style={{width:"1.1em", height:"1.1em", verticalAlign:"middle", margin:"0 2px", position:"relative", top:"-2px", borderRadius:"50%", objectFit:"cover"}} alt="coin"/></strong></div>
            </div>
            <div style={{fontSize:20,color:C.textMute}}>›</div>
          </div>
        ))}
      </div>
    </div>
  );

  if(phase==="learn") {
    const ch = lesson.challenges[cardIdx];
    return (
      <div style={{paddingTop: "calc(56px + env(safe-area-inset-top))",paddingBottom:24,background:`linear-gradient(180deg,#EFF6FF,#EEF4FF)`,flex:1}}>
        <div style={{background:"linear-gradient(135deg,#2563EB,#60A5FA,#06B6D4)",padding:"20px 18px 18px",borderRadius:"0 0 24px 24px"}}>
        <button className="tap" onClick={()=>setPhase("pick")} style={{background: "#fff", border: "1px solid #E2E8F0", width: 44, height: 44, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", marginBottom: 16, boxShadow: "0 4px 12px rgba(0,0,0,0.04)", flexShrink: 0}}>
          <span style={{fontSize: 20}}>⬅️</span>
        </button>
          <div style={{fontFamily:"Exo 2",fontWeight:900,fontSize:18,color:"#fff"}}>{lesson.icon} {lesson.title}</div>
          <div style={{fontSize:11,color:"rgba(255,255,255,.75)"}}>Soal {cardIdx+1}/{lesson.challenges.length} · Klik kartu untuk lihat!</div>
        </div>
        <div style={{padding:"20px 16px"}}>
          <div className="tap" onClick={()=>setFlipped(f=>!f)} style={{background:flipped?"linear-gradient(135deg,#EFF6FF,#DBEAFE)":"#fff",borderRadius:24,padding:"28px 22px",textAlign:"center",border:`2px solid ${flipped?"#93C5FD":"#DBEAFE"}`,boxShadow:flipped?"0 8px 32px rgba(37,99,235,.15)":C.shadowCard,minHeight:180,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",marginBottom:20,transition:"all .3s"}}>
            {!flipped?(
              <>
                <div style={{fontSize:40,marginBottom:10}}>{lesson.icon}</div>
                <div style={{fontFamily:"Exo 2",fontWeight:900,fontSize:15,color:C.text,marginBottom:8,lineHeight:1.4}}>{ch.q}</div>
                <div style={{fontSize:12,color:C.textMute,marginTop:8}}>Klik untuk lihat tipe soal 👆</div>
              </>
            ):(
              <>
                <div style={{fontSize:32,marginBottom:8}}>💡</div>
                <Tag label={ch.type.toUpperCase()} color={C.blue} bg={C.blueLt}/>
                <div style={{fontSize:13,color:C.blue,fontWeight:700,marginTop:12,lineHeight:1.6,textAlign:"center"}}>
                  {ch.type==="fillin"&&ch.ans?`Jawaban: ${ch.ans.join(", ")}`:ch.type==="translate"?"Terjemahkan kalimat ini ke Bahasa Inggris!":"Tulis jawabanmu dalam Bahasa Inggris!"}
                </div>
              </>
            )}
          </div>
          <div style={{display:"flex",gap:10}}>
            <button className="tap" onClick={()=>{setCardIdx(c=>Math.max(0,c-1));setFlipped(false);}} disabled={cardIdx===0} style={{flex:1,padding:13,background:cardIdx===0?"#F1F5F9":"#EFF6FF",border:`2px solid ${cardIdx===0?"#E2E8F0":"#DBEAFE"}`,borderRadius:16,fontWeight:800,fontSize:13,color:cardIdx===0?C.textMute:C.blue,cursor:cardIdx===0?"default":"pointer",fontFamily:"Nunito"}}>← Sebelumnya</button>
            {cardIdx<lesson.challenges.length-1
              ?<button className="tap" onClick={()=>{setCardIdx(c=>c+1);setFlipped(false);}} style={{flex:1,padding:13,background:C.blueGrad,border:"none",borderRadius:16,fontWeight:800,fontSize:13,color:"#fff",cursor:"pointer",fontFamily:"Nunito",boxShadow:"0 6px 16px rgba(37,99,235,.25)"}}>Selanjutnya →</button>
              :<button className="tap" onClick={startQuiz} style={{flex:1,padding:13,background:"linear-gradient(135deg,#059669,#34D399)",border:"none",borderRadius:16,fontWeight:800,fontSize:13,color:"#fff",cursor:"pointer",fontFamily:"Nunito",boxShadow:"0 6px 16px rgba(5,150,105,.25)"}}>Mulai Quiz! 🎯</button>
            }
          </div>
        </div>
      </div>
    );
  }

  if(phase==="quiz") {
    const ch = lesson.challenges[quizIdx];
    const opts = [ch.q.slice(0,40)+"...",...SPEAKING_CHALLENGES.filter(l=>l!==lesson).flatMap(l=>l.challenges).sort(()=>Math.random()-.5).slice(0,3).map(c=>c.q.slice(0,40)+"...")].sort(()=>Math.random()-.5);
    return (
      <div style={{paddingTop: "calc(56px + env(safe-area-inset-top))",paddingBottom:24,background:`linear-gradient(180deg,#EFF6FF,#EEF4FF)`,flex:1}}>
        <CoinPopup coins={lastC} trigger={coinTrig}/>
        <div style={{background:"linear-gradient(135deg,#2563EB,#60A5FA)",padding:"20px 18px 16px",borderRadius:"0 0 24px 24px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
            <button className="tap" onClick={()=>setPhase("pick")} style={{background:"rgba(255,255,255,.2)",border:"none",color:"#fff",borderRadius:12,padding:"6px 12px",fontSize:13,cursor:"pointer",fontWeight:700}}>✕</button>
            <span style={{fontFamily:"Exo 2",fontWeight:800,fontSize:13,color:"#fff"}}>{quizIdx+1}/{lesson.challenges.length}</span>
            <CoinBadge amount={correct*Math.floor(lesson.coins/lesson.challenges.length)} size="sm"/>
          </div>
          <div style={{background:"rgba(255,255,255,.2)",borderRadius:99,height:6,overflow:"hidden"}}>
            <div style={{width:`${((quizIdx+1)/lesson.challenges.length)*100}%`,height:"100%",background:"#fff",borderRadius:99,transition:"width .4s"}}/>
          </div>
        </div>
        <div style={{padding:"16px"}}>
          <div style={{background:"#fff",borderRadius:20,padding:"18px 16px",marginBottom:14,boxShadow:C.shadowCard,border:"1.5px solid #DBEAFE"}}>
            <div style={{fontSize:11,fontWeight:800,color:C.blue,marginBottom:8,letterSpacing:.5}}>IDENTIFIKASI JENIS SOAL INI:</div>
            <p style={{fontFamily:"Exo 2",fontWeight:800,fontSize:14,color:C.text,lineHeight:1.5}}>{ch.q.slice(0,100)+"..."}</p>
          </div>
          {opts.map((opt,i)=>{
            const isCorrect=opt===ch.q.slice(0,40)+"...";
            let bg="#fff",border="#DBEAFE",tc=C.text;
            if(sel!==null){
              if(isCorrect){bg=C.greenPale;border=C.green;tc="#065F46";}
              else if(opt===sel&&!isCorrect){bg=C.redPale;border=C.red;tc="#991B1B";}
            }
            return (
              <button key={i} className="tap" onClick={()=>handleAnswer(opt,ch)} disabled={sel!==null} style={{width:"100%",textAlign:"left",padding:"14px 16px",background:bg,border:`2px solid ${border}`,borderRadius:14,cursor:sel!==null?"default":"pointer",fontWeight:700,fontSize:12,color:tc,transition:"all .25s",fontFamily:"Nunito",display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                <span style={{width:28,height:28,borderRadius:"50%",background:C.blueLt,display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,color:C.blue,flexShrink:0}}>{"ABCD"[i]}</span>
                {opt}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  const pct=Math.round((correct/lesson.challenges.length)*100);
  return (
    <div style={{padding:"80px 16px 24px",background:`linear-gradient(180deg,#EFF6FF,#EEF4FF)`,flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
      <div style={{background:"linear-gradient(135deg,#2563EB,#60A5FA,#06B6D4)",borderRadius:26,padding:28,textAlign:"center",color:"#fff",marginBottom:16,width:"100%",boxShadow:"0 12px 40px rgba(37,99,235,.25)",animation:"scaleIn .4s ease"}}>
        <div style={{fontSize:52,marginBottom:8}}>{pct>=80?"🏆":pct>=60?"🎉":"💪"}</div>
        <h2 style={{fontFamily:"Exo 2",fontWeight:900,fontSize:22,marginBottom:4}}>{pct>=80?"Sempurna!":pct>=60?"Bagus!":"Terus Berlatih!"}</h2>
        <p style={{opacity:.85,marginBottom:16}}>Benar {correct}/{lesson.challenges.length} ({pct}%)</p>
        <div style={{background:"rgba(255,255,255,.2)",borderRadius:16,padding:"12px 20px",display:"inline-block"}}>
          <div style={{fontFamily:"Exo 2",fontWeight:900,fontSize:22}}><img src="/coin.png" style={{width:"1.1em", height:"1.1em", verticalAlign:"middle", margin:"0 2px", position:"relative", top:"-2px", borderRadius:"50%", objectFit:"cover"}} alt="coin"/> +{correct*Math.floor(lesson.coins/lesson.challenges.length)} SmartCoin!</div>
        </div>
      </div>
      <div style={{display:"flex",gap:10,width:"100%"}}>
        <button className="tap" onClick={()=>startLesson(lesson)} style={{flex:1,padding:14,background:"#EFF6FF",border:"2px solid #DBEAFE",borderRadius:16,fontWeight:800,fontSize:14,color:C.blue,cursor:"pointer",fontFamily:"Nunito"}}>Ulangi</button>
        <button className="tap" onClick={()=>setPhase("pick")} style={{flex:1,padding:14,background:C.blueGrad,border:"none",borderRadius:16,fontWeight:800,fontSize:14,color:"#fff",cursor:"pointer",fontFamily:"Nunito",boxShadow:"0 6px 16px rgba(37,99,235,.25)"}}>Topik Lain</button>
      </div>
    </div>
  );
}
