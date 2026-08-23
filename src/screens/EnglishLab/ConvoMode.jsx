import React, { useState, useRef, useEffect } from 'react';
import { C } from '../../data/mockData';
import { CoinBadge, CoinPopup } from '../../components/Shared';

export default function ConvoMode({ onBack, onEarn }) {
  const [msgs, setMsgs] = useState([{
    role: "assistant",
    content: "Hello! I'm SAGA, your English coach! 🌟<br/><br/>You earn <strong>SmartCoin</strong> for every message you send in English. Let's practice!<br/><br/><strong>Tell me:</strong> Introduce yourself in English — your name, major, and one dream you have! 💭",
    note: "✅ Welcome! Start talking and I'll give you grammar tips!"
  }]);
  const [inp, setInp] = useState("");
  const [loading, setLoading] = useState(false);
  const [coinTrig, setCoinTrig] = useState(0);
  const [lastC, setLastC] = useState(0);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);

  const mockReplies = [
    { text: "That's wonderful to hear! Keep up the good work. 🚀", note: "Great sentence structure!" },
    { text: "I completely agree with you. What else do you think about it?", note: "Try using more complex adjectives." },
    { text: "Interesting perspective! Could you explain more?", note: "Your grammar is improving!" },
    { text: "Wow, that sounds amazing! Jambi is beautiful.", note: "Remember to use proper capitalization." },
  ];

  const send = (text) => {
    if (!text.trim() || loading) return;
    setInp("");
    setMsgs(m => [...m, { role: "user", content: text }]);
    setLoading(true);

    setTimeout(() => {
      const reply = mockReplies[Math.floor(Math.random() * mockReplies.length)];
      setMsgs(m => [...m, { role: "assistant", content: reply.text, note: reply.note }]);
      onEarn(5, 8);
      setLastC(5);
      setCoinTrig(t => t + 1);
      setLoading(false);
    }, 1000);
  };

  const starters = ["Tell me about Jambi!", "What's your dream job?", "Talk about AI to me!", "How's your day going?"];

  return (
    <div style={{display:"flex",flexDirection:"column",height:"100vh",background:"#EEF4FF"}}>
      <CoinPopup coins={lastC} trigger={coinTrig}/>
      <div style={{background:"linear-gradient(135deg,#7C3AED,#A78BFA)",padding:"56px 18px 12px",flexShrink:0,boxShadow:"0 4px 20px rgba(124,58,237,.2)"}}>
        <div style={{display:"flex",gap:10,alignItems:"center"}}>
          <button className="tap" onClick={onBack} style={{background:"rgba(255,255,255,.2)",border:"none",color:"#fff",borderRadius:12,padding:"6px 12px",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"Nunito"}}>←</button>
          <div style={{flex:1}}>
            <div style={{fontFamily:"Exo 2",fontWeight:900,color:"#fff",fontSize:16}}>AI Conversation (Mock)</div>
            <div style={{fontSize:11,color:"rgba(255,255,255,.8)"}}>+5 <img src="/coin.png" style={{width:"1.1em", height:"1.1em", verticalAlign:"middle", margin:"0 2px", position:"relative", top:"-2px", borderRadius:"50%", objectFit:"cover"}} alt="coin"/> per pesan Bahasa Inggris</div>
          </div>
          <CoinBadge size="sm" amount="💬"/>
        </div>
      </div>
      <div style={{background:"#fff",borderBottom:"1px solid #DBEAFE",padding:"8px 14px",flexShrink:0}}>
        <div style={{display:"flex",gap:7,overflowX:"auto",paddingBottom:2}}>
          {starters.map((s,i)=>(
            <button key={i} className="tap" onClick={()=>send(s)} style={{flexShrink:0,background:"#EFF6FF",border:"1.5px solid #DBEAFE",borderRadius:99,padding:"6px 12px",fontSize:11,color:C.blue,fontWeight:700,cursor:"pointer",fontFamily:"Nunito"}}>{s}</button>
          ))}
        </div>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"14px"}}>
        {msgs.map((m,i) => (
          <div key={i} style={{marginBottom:12,animation:"fadeUp .25s ease"}}>
            <div style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start"}}>
              {m.role==="assistant"&&<div style={{width:30,height:30,borderRadius:10,background:"linear-gradient(135deg,#7C3AED,#A78BFA)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,marginRight:8,flexShrink:0,alignSelf:"flex-end"}}>🤖</div>}
              <div style={{maxWidth:"78%",padding:"12px 14px",borderRadius:m.role==="user"?"18px 18px 4px 18px":"18px 18px 18px 4px",background:m.role==="user"?"linear-gradient(135deg,#7C3AED,#A78BFA)":"#fff",color:m.role==="user"?"#fff":C.text,fontSize:13,lineHeight:1.6,fontWeight:600,boxShadow:m.role==="user"?"0 4px 14px rgba(124,58,237,.3)":C.shadowCard,border:m.role==="assistant"?"1.5px solid #EDE9FE":"none"}} dangerouslySetInnerHTML={{__html:m.content}}/>
            </div>
            {m.role==="assistant"&&m.note&&<div style={{marginLeft:38,marginTop:5,background:C.greenLt,borderRadius:12,padding:"7px 12px",border:"1.5px solid #BBF7D0",fontSize:11,color:C.green,maxWidth:"78%",fontWeight:600}}>{m.note}</div>}
          </div>
        ))}
        {loading&&<div style={{display:"flex",marginBottom:12}}>
          <div style={{width:30,height:30,borderRadius:10,background:"linear-gradient(135deg,#7C3AED,#A78BFA)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,marginRight:8}}>🤖</div>
          <div style={{background:"#fff",borderRadius:"18px 18px 18px 4px",padding:"12px 14px",border:"1.5px solid #EDE9FE"}}>
            <div style={{display:"flex",gap:4}}>{[0,1,2].map(i=><div key={i} style={{width:7,height:7,borderRadius:"50%",background:C.purple,animation:`bounce 1s ${i*.18}s infinite`}}/>)}</div>
          </div>
        </div>}
        <div ref={bottomRef}/>
      </div>
      <div style={{padding:"10px 14px",background:"#fff",borderTop:"1px solid #DBEAFE",paddingBottom:86}}>
        <div style={{display:"flex",gap:8}}>
          <input value={inp} onChange={e=>setInp(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send(inp)} placeholder="Type in English... earn coins per message!"
            style={{flex:1,padding:"12px 14px",background:"#F8FAFF",border:"2px solid #DBEAFE",borderRadius:14,fontSize:13,fontFamily:"Nunito",outline:"none",color:C.text}}/>
          <button className="tap" onClick={()=>send(inp)} disabled={!inp.trim()||loading} style={{width:46,height:46,borderRadius:14,background:inp.trim()&&!loading?"linear-gradient(135deg,#7C3AED,#A78BFA)":"#E2E8F0",border:"none",color:inp.trim()&&!loading?"#fff":C.textMute,fontSize:18,cursor:inp.trim()&&!loading?"pointer":"default",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all .2s"}}>➤</button>
        </div>
      </div>
    </div>
  );
}
