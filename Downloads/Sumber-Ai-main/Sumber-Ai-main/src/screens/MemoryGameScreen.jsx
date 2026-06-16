import React, { useState, useEffect } from 'react';
import { C } from '../data/mockData';

const ALL_ICONS = ['🤖','💻','🚀','🧠','🌐','📱','💡','🎮','🔋','📡','🔬','⚙️','💾','🖥️','🕹️','🎧'];

export default function MemoryGameScreen({ gs, onNav, onCoinEarned }) {
  const [level, setLevel] = useState(1);
  const [cards, setCards] = useState([]);
  const [flippedIndex, setFlippedIndex] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [moves, setMoves] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(null); // null, 'win', 'lose', 'all_clear'
  const [coinsWon, setCoinsWon] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);

  const getLevelConfig = (lvl) => {
    let pairs = 2;
    let maxMoves = 0; // 0 means infinite
    let timeLimit = 0; // 0 means infinite

    if (lvl === 1) pairs = 2; // 4 cards
    else if (lvl === 2) pairs = 3; // 6 cards
    else if (lvl === 3) pairs = 4; // 8 cards
    else if (lvl === 4) pairs = 5; // 10 cards
    else if (lvl === 5) pairs = 6; // 12 cards
    else if (lvl === 6) pairs = 8; // 16 cards
    else if (lvl === 7) pairs = 10; // 20 cards
    else if (lvl === 8) pairs = 12; // 24 cards
    else if (lvl === 9) pairs = 14; // 28 cards
    else if (lvl === 10) pairs = 16; // 32 cards
    else if (lvl === 11) { pairs = 10; maxMoves = 25; }
    else if (lvl === 12) { pairs = 12; maxMoves = 28; }
    else if (lvl === 13) { pairs = 14; maxMoves = 30; }
    else if (lvl === 14) { pairs = 16; maxMoves = 35; }
    else if (lvl === 15) { pairs = 16; maxMoves = 30; }
    else if (lvl === 16) { pairs = 10; timeLimit = 60; }
    else if (lvl === 17) { pairs = 12; timeLimit = 60; }
    else if (lvl === 18) { pairs = 14; timeLimit = 60; }
    else if (lvl === 19) { pairs = 16; timeLimit = 60; }
    else if (lvl >= 20) { pairs = 16; timeLimit = 50; maxMoves = 35; }
    
    return { pairs, maxMoves, timeLimit };
  };
  
  const initGame = (targetLevel) => {
    // Check energy only on level 1 or retry
    if ((targetLevel === 1 || gameOver === 'lose') && !gs.proStatus?.scholar && gs.engDone >= 10) {
      alert("Energi habis! Tunggu besok atau Upgrade ke PRO!");
      return;
    }
    
    const config = getLevelConfig(targetLevel);
    const selectedIcons = ALL_ICONS.slice(0, config.pairs);
    
    // Create deck
    const deck = [...selectedIcons, ...selectedIcons]
      .map(val => ({ val, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(obj => obj.val);
      
    setLevel(targetLevel);
    setCards(deck);
    setFlippedIndex([]);
    setMatchedPairs([]);
    setMoves(0);
    setTimeLeft(config.timeLimit);
    setGameOver(null);
    setIsPlaying(true);
  };
  
  const handleCardClick = (index) => {
    if (!isPlaying || flippedIndex.length === 2 || flippedIndex.includes(index) || matchedPairs.includes(cards[index])) {
      return;
    }
    
    const newFlipped = [...flippedIndex, index];
    setFlippedIndex(newFlipped);
    
    if (newFlipped.length === 2) {
      const currentMoves = moves + 1;
      setMoves(currentMoves);
      const match = cards[newFlipped[0]] === cards[newFlipped[1]];
      
      const config = getLevelConfig(level);
      
      if (match) {
        setMatchedPairs(prev => {
          const newPairs = [...prev, cards[newFlipped[0]]];
          if (newPairs.length === config.pairs) {
             handleWin();
          }
          return newPairs;
        });
        setFlippedIndex([]);
      } else {
        setTimeout(() => setFlippedIndex([]), 800);
      }

      // Check max moves fail condition
      if (config.maxMoves > 0 && currentMoves >= config.maxMoves && !match) {
         setTimeout(() => handleLose(), 800);
      }
    }
  };

  const handleWin = () => {
    setIsPlaying(false);
    
    // Very strict coin economy
    let reward = 0;
    if (level >= 6 && level <= 10) reward = 1;
    else if (level >= 11 && level <= 15) reward = 2;
    else if (level >= 16 && level <= 19) reward = 5;
    else if (level === 20) reward = 20; // smaller jackpot
    
    setCoinsWon(reward);
    if (onCoinEarned && reward > 0) onCoinEarned(reward);
    
    if (level >= 20) {
      setGameOver('all_clear');
    } else {
      setGameOver('win');
    }
  };

  const handleLose = () => {
    setIsPlaying(false);
    setGameOver('lose');
  };
  
  // Autoscroll ke atas saat layar dibuka
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Timer effect
  useEffect(() => {
    let timer;
    if (isPlaying && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            handleLose();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, timeLeft]);

  const config = getLevelConfig(level);
  
  // Calculate grid columns based on card count to make it responsive
  let cols = 4;
  if (cards.length === 4) cols = 2;
  else if (cards.length === 6) cols = 3;
  else if (cards.length >= 20) cols = 4; // up to 8 rows
  else if (cards.length >= 10) cols = 4;

  return (
    <div style={{minHeight:"100vh",background:"var(--bg-main)",paddingBottom:80}}>
      {/* Header */}
      <div style={{background:"linear-gradient(135deg,#6366F1,#8B5CF6)",padding:"80px 20px 40px",borderBottomLeftRadius:30,borderBottomRightRadius:30,boxShadow:C.shadowCard,position:"relative"}}>
        <button className="tap" onClick={()=>onNav('arena')} style={{background:"rgba(255,255,255,.2)",border:"none",color:"#fff",padding:"8px 16px",borderRadius:99,fontSize:14,fontWeight:700,marginBottom:16,display:"flex",alignItems:"center",gap:8,backdropFilter:"blur(4px)"}}>
          <span>←</span> Kembali
        </button>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <h1 style={{fontFamily:"Exo 2",fontWeight:900,fontSize:28,color:"#fff",margin:0,textShadow:"0 2px 4px rgba(0,0,0,.2)"}}>Asah Otak</h1>
            <p style={{color:"rgba(255,255,255,.9)",fontSize:14,margin:"4px 0 0"}}>Level {level} / 20</p>
          </div>
        </div>
      </div>
      
      <div style={{padding:"0 20px",marginTop:-20}}>
        {!isPlaying && !gameOver && (
          <div style={{background:"var(--bg-card)",borderRadius:24,padding:24,boxShadow:C.shadowCard,textAlign:"center",animation:"fadeUp .4s ease"}}>
            <div style={{fontSize:50,marginBottom:16}}>🧠</div>
            <h2 style={{fontFamily:"Exo 2",fontSize:22,fontWeight:900,color:"var(--text-main)",marginBottom:8}}>Uji Daya Ingatmu</h2>
            <p style={{color:"var(--text-sec)",fontSize:13,lineHeight:1.6,marginBottom:24}}>
              Terdapat 20 tingkatan level! Semakin tinggi levelmu, jumlah kartu akan semakin banyak dan mode waktu akan terbuka.
            </p>
            <button className="tap" onClick={()=>initGame(1)} style={{width:"100%",background:"linear-gradient(135deg,#6366F1,#8B5CF6)",color:"#fff",border:"none",padding:16,borderRadius:16,fontSize:16,fontWeight:900,boxShadow:"0 8px 20px rgba(99,102,241,.3)"}}>
              MULAI DARI LEVEL 1 (-1 Energi)
            </button>
          </div>
        )}
        
        {isPlaying && (
          <div style={{animation:"fadeUp .4s ease"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20,padding:"0 5px",gap:10}}>
              {config.maxMoves > 0 ? (
                <div style={{background:"var(--bg-card)",padding:"8px 12px",borderRadius:12,boxShadow:C.shadowCard,flex:1,textAlign:"center"}}>
                  <span style={{color:"var(--text-sec)",fontSize:10,fontWeight:700,display:"block"}}>SISA LANGKAH</span>
                  <span style={{color:(config.maxMoves - moves) <= 5 ? "#DC2626" : "var(--text-main)",fontSize:16,fontWeight:900}}>{config.maxMoves - moves}</span>
                </div>
              ) : (
                <div style={{background:"var(--bg-card)",padding:"8px 12px",borderRadius:12,boxShadow:C.shadowCard,flex:1,textAlign:"center"}}>
                  <span style={{color:"var(--text-sec)",fontSize:10,fontWeight:700,display:"block"}}>LANGKAH</span>
                  <span style={{color:"var(--text-main)",fontSize:16,fontWeight:900}}>{moves}</span>
                </div>
              )}
              
              <div style={{background:"var(--bg-card)",padding:"8px 12px",borderRadius:12,boxShadow:C.shadowCard,flex:1,textAlign:"center"}}>
                <span style={{color:"var(--text-sec)",fontSize:10,fontWeight:700,display:"block"}}>PASANGAN</span>
                <span style={{color:"#10B981",fontSize:16,fontWeight:900}}>{matchedPairs.length} / {config.pairs}</span>
              </div>

              {config.timeLimit > 0 && (
                <div style={{background:"var(--bg-card)",padding:"8px 12px",borderRadius:12,boxShadow:C.shadowCard,flex:1,textAlign:"center"}}>
                  <span style={{color:"var(--text-sec)",fontSize:10,fontWeight:700,display:"block"}}>WAKTU</span>
                  <span style={{color:timeLeft <= 10 ? "#DC2626" : "#F59E0B",fontSize:16,fontWeight:900}}>{timeLeft}s</span>
                </div>
              )}
            </div>
            
            <div style={{display:"grid",gridTemplateColumns:`repeat(${cols}, 1fr)`,gap:8}}>
              {cards.map((card, index) => {
                const isFlipped = flippedIndex.includes(index) || matchedPairs.includes(card);
                return (
                  <div 
                    key={index} 
                    className="tap"
                    onClick={() => handleCardClick(index)}
                    style={{
                      aspectRatio: cards.length > 20 ? "auto" : "1/1",
                      height: cards.length > 20 ? 70 : "auto",
                      perspective: "1000px",
                      cursor: "pointer"
                    }}
                  >
                    <div style={{
                      width: "100%",
                      height: "100%",
                      position: "relative",
                      transition: "transform 0.3s",
                      transformStyle: "preserve-3d",
                      transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)"
                    }}>
                      {/* Back of card (hidden) */}
                      <div style={{
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        backfaceVisibility: "hidden",
                        background: "linear-gradient(135deg, #1E3A8A, #3B82F6)",
                        borderRadius: 8,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: C.shadowCard,
                        border: "1.5px solid #60A5FA"
                      }}>
                        <div style={{width: 14, height: 14, background: "rgba(255,255,255,0.2)", borderRadius: "50%"}} />
                      </div>
                      
                      {/* Front of card (revealed) */}
                      <div style={{
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        backfaceVisibility: "hidden",
                        background: "var(--bg-card)",
                        borderRadius: 8,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: cards.length > 20 ? 24 : 30,
                        transform: "rotateY(180deg)",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                        border: matchedPairs.includes(card) ? "2px solid #10B981" : "2px solid var(--border-color)",
                        opacity: matchedPairs.includes(card) ? 0.6 : 1
                      }}>
                        {card}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <button className="tap" onClick={()=>{setIsPlaying(false); setGameOver('lose');}} style={{marginTop:24,background:"rgba(220,38,38,.1)",color:"#DC2626",border:"none",padding:14,borderRadius:16,width:"100%",fontWeight:800}}>
              Nyerah (Keluar)
            </button>
          </div>
        )}
        
        {gameOver === 'win' && (
          <div style={{background:"var(--bg-card)",borderRadius:24,padding:32,boxShadow:C.shadowCard,textAlign:"center",animation:"fadeUp .5s ease"}}>
            <div style={{fontSize:60,marginBottom:16,animation:"bounce .5s ease infinite alternate"}}>🎉</div>
            <h2 style={{fontFamily:"Exo 2",fontSize:24,fontWeight:900,color:"var(--text-main)",marginBottom:8}}>Level {level} Selesai!</h2>
            <p style={{color:"var(--text-sec)",fontSize:14,marginBottom:24}}>
              Hebat! Bersiaplah untuk tantangan yang lebih sulit di level berikutnya.
            </p>
            
            {coinsWon > 0 && (
              <div style={{background:"linear-gradient(135deg, #FFFBEB, #FEF3C7)",border:"1px solid #FCD34D",padding:20,borderRadius:20,marginBottom:24}}>
                <div style={{color:"#D97706",fontSize:12,fontWeight:800,marginBottom:8}}>HADIAH KEMENANGAN</div>
                <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,fontSize:32,fontWeight:900,color:"#B45309",fontFamily:"Exo 2"}}>
                  <span>+{coinsWon}</span>
                  <img src="/coin.png" style={{width: 32, height: 32, borderRadius: "50%"}} alt="coin"/>
                </div>
              </div>
            )}
            
            <button className="tap" onClick={()=>initGame(level + 1)} style={{width:"100%",background:"linear-gradient(135deg,#6366F1,#8B5CF6)",color:"#fff",border:"none",padding:16,borderRadius:16,fontSize:16,fontWeight:900,marginBottom:12}}>
              LANJUT LEVEL {level + 1}
            </button>
            <button className="tap" onClick={()=>onNav('arena')} style={{width:"100%",background:"var(--bg-main)",color:"var(--text-sec)",border:"none",padding:16,borderRadius:16,fontSize:14,fontWeight:800}}>
              KEMBALI KE ARENA
            </button>
          </div>
        )}

        {gameOver === 'lose' && (
          <div style={{background:"var(--bg-card)",borderRadius:24,padding:32,boxShadow:C.shadowCard,textAlign:"center",animation:"fadeUp .5s ease"}}>
            <div style={{fontSize:60,marginBottom:16}}>💀</div>
            <h2 style={{fontFamily:"Exo 2",fontSize:24,fontWeight:900,color:"#DC2626",marginBottom:8}}>Gagal!</h2>
            <p style={{color:"var(--text-sec)",fontSize:14,marginBottom:24}}>
              Kamu kehabisan waktu atau melebihi batas langkah maksimal. Ingatanmu perlu di-upgrade!
            </p>
            
            <button className="tap" onClick={()=>initGame(level)} style={{width:"100%",background:"linear-gradient(135deg,#DC2626,#EF4444)",color:"#fff",border:"none",padding:16,borderRadius:16,fontSize:16,fontWeight:900,marginBottom:12}}>
              ULANGI LEVEL {level} (-1 Energi)
            </button>
            <button className="tap" onClick={()=>onNav('arena')} style={{width:"100%",background:"var(--bg-main)",color:"var(--text-sec)",border:"none",padding:16,borderRadius:16,fontSize:14,fontWeight:800}}>
              KEMBALI KE ARENA
            </button>
          </div>
        )}

        {gameOver === 'all_clear' && (
          <div style={{background:"var(--bg-card)",borderRadius:24,padding:32,boxShadow:C.shadowCard,textAlign:"center",animation:"fadeUp .5s ease"}}>
            <div style={{fontSize:60,marginBottom:16,animation:"bounce .5s ease infinite alternate"}}>🏆</div>
            <h2 style={{fontFamily:"Exo 2",fontSize:26,fontWeight:900,color:"#D97706",marginBottom:8}}>GRAND MASTER!</h2>
            <p style={{color:"var(--text-sec)",fontSize:14,marginBottom:24}}>
              Kamu telah menaklukkan seluruh 20 Level Kartu Memori AI! Ini pencapaian yang sangat langka.
            </p>
            
            <div style={{background:"linear-gradient(135deg, #FFFBEB, #FEF3C7)",border:"1px solid #FCD34D",padding:20,borderRadius:20,marginBottom:24}}>
              <div style={{color:"#D97706",fontSize:12,fontWeight:800,marginBottom:8}}>JACKPOT AKHIR</div>
              <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,fontSize:40,fontWeight:900,color:"#B45309",fontFamily:"Exo 2"}}>
                <span>+{coinsWon}</span>
                <img src="/coin.png" style={{width: 40, height: 40, borderRadius: "50%"}} alt="coin"/>
              </div>
            </div>
            
            <button className="tap" onClick={()=>onNav('arena')} style={{width:"100%",background:"var(--bg-main)",color:"var(--text-sec)",border:"none",padding:16,borderRadius:16,fontSize:14,fontWeight:800}}>
              KEMBALI KE ARENA
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
