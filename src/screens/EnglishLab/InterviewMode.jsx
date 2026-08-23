import React, { useState } from 'react';
import { C, INTERVIEW_QS } from '../../data/mockData';
import { CoinBadge, CoinPopup, Spinner } from '../../components/Shared';

export default function InterviewMode({ onBack, onEarn }) {
  const [qIdx, setQIdx] = useState(0);
  const [ans, setAns] = useState("");
  const [fb, setFb] = useState(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [total, setTotal] = useState(0);
  const [coinTrig, setCoinTrig] = useState(0);
  const [lastC, setLastC] = useState(0);

  const submit = async () => {
    if (!ans.trim() || loading) return;
    setLoading(true);
    
    // MOCK AI FEEDBACK
    setTimeout(() => {
      const mockFeedback = `⭐ Score: 8.5/10<br/><br/>✅ <strong>Strengths:</strong><br/>• Good effort in expressing your ideas.<br/>• Relevant to the context.<br/><br/>💡 <strong>Improve:</strong><br/>• Try to use more professional vocabulary.<br/><br/>📝 <strong>Model Answer:</strong><br/>"Thank you for the question. I believe my strongest asset is my adaptability and eagerness to learn."`;
      setFb(mockFeedback);
      const c = INTERVIEW_QS[qIdx].coins; 
      onEarn(c, 15); 
      setLastC(c); 
      setCoinTrig(t => t + 1); 
      setTotal(p => p + c);
      setLoading(false);
    }, 1200);
  };

  const next = () => {
    if (qIdx + 1 >= INTERVIEW_QS.length) { setDone(true); return; }
    setQIdx(q => q + 1); setAns(""); setFb(null);
  };

  if (done) return (
    <div style={{padding:"80px 16px 24px",background:`linear-gradient(180deg,#ECFDF5,#EEF4FF)`,flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
      <div style={{background:"linear-gradient(135deg,#059669,#34D399)",borderRadius:26,padding:28,textAlign:"center",width:"100%",boxShadow:"0 12px 40px rgba(5,150,105,.25)"}}>
        <div style={{fontSize:52,marginBottom:8}}>🎙️🏆</div>
        <h2 style={{fontFamily:"Exo 2",fontWeight:900,fontSize:22,color:"#fff",marginBottom:4}}>Interview Selesai!</h2>
        <p style={{color:"rgba(255,255,255,.85)",marginBottom:16}}>Semua {INTERVIEW_QS.length} pertanyaan dijawab!</p>
        <div style={{background:"rgba(255,255,255,.2)",borderRadius:16,padding:"12px 20px",display:"inline-block"}}>
          <div style={{fontFamily:"Exo 2",fontWeight:900,fontSize:22,color:"#fff"}}><img src="/coin.png" style={{width:"1.1em", height:"1.1em", verticalAlign:"middle", margin:"0 2px", position:"relative", top:"-2px", borderRadius:"50%", objectFit:"cover"}} alt="coin"/> +{total} SmartCoin!</div>
        </div>
      </div>
      <button className="tap" onClick={onBack} style={{width:"100%",padding:15,marginTop:14,background:C.blueGrad,border:"none",borderRadius:16,fontWeight:800,fontSize:15,color:"#fff",cursor:"pointer",fontFamily:"Nunito",boxShadow:"0 6px 16px rgba(37,99,235,.25)"}}>← Kembali</button>
    </div>
  );

  const q = INTERVIEW_QS[qIdx];
  return (
    <div style={{paddingTop: "calc(56px + env(safe-area-inset-top))",paddingBottom:24,background:`linear-gradient(180deg,#ECFDF5,#EEF4FF)`,flex:1}}>
      <CoinPopup coins={lastC} trigger={coinTrig}/>
      <div style={{background:"linear-gradient(135deg,#059669,#34D399)",padding:"20px 18px 16px",borderRadius:"0 0 24px 24px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
          <button className="tap" onClick={onBack} style={{background:"rgba(255,255,255,.2)",border:"none",color:"#fff",borderRadius:12,padding:"6px 14px",fontSize:13,cursor:"pointer",fontWeight:700}}>← Exit</button>
          <span style={{fontFamily:"Exo 2",fontWeight:800,fontSize:13,color:"#fff"}}>Q{qIdx+1}/{INTERVIEW_QS.length}</span>
          <CoinBadge amount={total} size="sm"/>
        </div>
        <div style={{background:"rgba(255,255,255,.2)",borderRadius:99,height:6,overflow:"hidden"}}>
          <div style={{width:`${((qIdx+1)/INTERVIEW_QS.length)*100}%`,height:"100%",background:"#fff",borderRadius:99,transition:"width .4s"}}/>
        </div>
      </div>
      <div style={{padding:"16px"}}>
        <div style={{background:"#fff",borderRadius:20,padding:"18px 16px",marginBottom:14,boxShadow:C.shadowCard,border:"1.5px solid #BBF7D0"}}>
          <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:10}}>
            <div style={{width:36,height:36,borderRadius:12,background:"linear-gradient(135deg,#059669,#34D399)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>🎙️</div>
            <div>
              <div style={{fontSize:11,color:C.textMute,fontWeight:700}}>INTERVIEW QUESTION</div>
              <div style={{fontSize:11,color:C.green,fontWeight:800}}>+{q.coins} <img src="/coin.png" style={{width:"1.1em", height:"1.1em", verticalAlign:"middle", margin:"0 2px", position:"relative", top:"-2px", borderRadius:"50%", objectFit:"cover"}} alt="coin"/> untuk jawaban ini</div>
            </div>
          </div>
          <p style={{fontFamily:"Exo 2",fontWeight:800,fontSize:16,color:C.text,lineHeight:1.5}}>"{q.q}"</p>
          <div style={{marginTop:10,background:"#ECFDF5",borderRadius:12,padding:"8px 12px",fontSize:12,color:C.green,fontWeight:600}}>💡 {q.tips}</div>
        </div>
        {!fb?(
          <>
            <textarea value={ans} onChange={e=>setAns(e.target.value)} placeholder="Type your answer in English here..."
              style={{width:"100%",minHeight:110,padding:"14px 16px",border:"2px solid #BBF7D0",borderRadius:16,fontSize:13,fontFamily:"Nunito",outline:"none",background:"#fff",color:C.text,resize:"none",lineHeight:1.6,marginBottom:12}}/>
            <button className="tap" onClick={submit} disabled={!ans.trim()||loading} style={{width:"100%",padding:15,background:ans.trim()&&!loading?"linear-gradient(135deg,#059669,#34D399)":"#E2E8F0",border:"none",borderRadius:16,fontWeight:800,fontSize:15,color:ans.trim()&&!loading?"#fff":C.textMute,cursor:ans.trim()&&!loading?"pointer":"default",fontFamily:"Nunito",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
              {loading?<Spinner/>:"Get AI Feedback 🎯"}
            </button>
          </>
        ):(
          <div style={{animation:"fadeUp .35s ease"}}>
            <div style={{background:"#fff",borderRadius:20,padding:16,marginBottom:12,border:"2px solid #BBF7D0",boxShadow:C.shadowCard}}>
              <div style={{fontSize:12,fontWeight:800,color:C.green,marginBottom:8}}>✅ Coach Feedback (Mock)</div>
              <div style={{fontSize:13,color:C.text,lineHeight:1.8}} dangerouslySetInnerHTML={{__html:fb}}/>
            </div>
            <button className="tap" onClick={next} style={{width:"100%",padding:15,background:C.blueGrad,border:"none",borderRadius:16,fontWeight:800,fontSize:15,color:"#fff",cursor:"pointer",fontFamily:"Nunito",boxShadow:"0 6px 16px rgba(37,99,235,.25)"}}>
              {qIdx+1<INTERVIEW_QS.length?"Pertanyaan Berikutnya →":"Selesai! 🎉"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
