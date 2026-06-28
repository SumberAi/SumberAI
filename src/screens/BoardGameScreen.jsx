import React, { useState, useEffect, useRef } from 'react';
import { C } from '../data/mockData';
import { BOARD_GAME_QUESTIONS } from '../data/boardGameQuestions';
import { playSfx, toggleMute, getMuteState, playBgm, stopBgm } from '../utils/audio';
const BOARD_SIZE = 100;
const COLS = 10;
const ROWS = 10;
const LADDERS = { 4: 14, 12: 31, 28: 43, 46: 65, 72: 88 };
const SNAKES = { 24: 5, 41: 19, 55: 34, 74: 53, 89: 51, 95: 38, 98: 15, 99: 80 };
const AVATAR_OPTIONS = ["🐉", "🧙‍♂️", "🛡️", "🔥", "🔮", "🦄", "🦅", "🦁", "🐢", "🦊", "🐶", "🐼", "🐸", "🚀", "🛸", "💎", "👻", "🤖", "🤡", "👹"];

// Helper untuk posisi petak zigzag 100 kotak
function getGridPos(pos) {
  const index = pos - 1;
  const rowIdx = Math.floor(index / COLS);
  const gridRow = ROWS - rowIdx;
  // Jika rowIdx genap (0, 2, 4 -> baris bawah), urutan Kiri ke Kanan
  const colIdx = rowIdx % 2 === 0 ? (index % COLS) : (COLS - 1 - (index % COLS));
  const gridColumn = colIdx + 1;
  return { gridRow, gridColumn, row: gridRow, col: gridColumn };
}

export default function BoardGameScreen({ gs, onNav, onCoinEarned, onXPEarned }) {
  const [setupMode, setSetupMode] = useState(true);
  const [playerCount, setPlayerCount] = useState(2);
  const [players, setPlayers] = useState([]);
  const [winner, setWinner] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [muted, setMuted] = useState(false);

  const questionDeck = useRef([]);
  const getNextQuestion = () => {
    if (questionDeck.current.length === 0) {
      const shuffled = [...BOARD_GAME_QUESTIONS].sort(() => 0.5 - Math.random());
      questionDeck.current = shuffled;
    }
    return questionDeck.current.pop();
  };

  useEffect(() => {
    setMuted(getMuteState());
    return () => stopBgm();
  }, []);

  useEffect(() => {
    const isEn = gs?.lang === 'en';
    const initialPlayers = Array(playerCount).fill(0).map((_, i) => ({
      id: i,
      name: isEn ? `Player ${i + 1}` : `Pemain ${i + 1}`,
      avatar: AVATAR_OPTIONS[i],
      position: 1,
      streak: 0,
      targetId: null,
      attackMessage: null,
      lastRoll: 0,
      currentQuestion: getNextQuestion(),
      status: 'playing'
    }));
    setPlayers(initialPlayers);
  }, [playerCount]);

  const handleNameChange = (index, name) => {
    const newPlayers = [...players];
    newPlayers[index].name = name;
    setPlayers(newPlayers);
  };

  const handleAvatarChange = (index, avatar) => {
    const newPlayers = [...players];
    newPlayers[index].avatar = avatar;
    setPlayers(newPlayers);
  };

  const startGame = () => {
    setSetupMode(false);
    playBgm('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3');
  };

  const handleSetTarget = (playerIndex, targetId) => {
    setPlayers(currentPlayers => {
      const cp = [...currentPlayers];
      cp[playerIndex].targetId = targetId;
      return cp;
    });
  };

  const toggleMusic = () => {
    setMuted(toggleMute());
  };

  const handleAnswer = (playerIndex, selectedAnsIdx) => {
    const p = players[playerIndex];
    if (p.status !== 'playing' || winner) return;
    
    const isCorrect = selectedAnsIdx === p.currentQuestion.ans;
    const stepsRolled = isCorrect && p.targetId === null ? Math.floor(Math.random() * 6) + 1 : 0;
    
    if (isCorrect) playSfx('correct');
    else playSfx('wrong');

    let newPlayers = [...players];
    newPlayers[playerIndex].status = isCorrect ? 'correct' : 'wrong';
    newPlayers[playerIndex].lastRoll = stepsRolled;
    setPlayers(newPlayers);
    
    const isAttackingNow = players[playerIndex].targetId !== null;
    let turnDelay = isCorrect ? 400 : 1500;
    if (!isCorrect && isAttackingNow) turnDelay = 5000; // Jeda 5 detik untuk penyerang yang gagal

    setTimeout(() => {
      setPlayers(currentPlayers => {
        const cp = currentPlayers.map(p => ({...p})); // Deep clone semua pemain!
        let currentPos = cp[playerIndex].position;
        const isAttacking = cp[playerIndex].targetId !== null;
        
        if (isCorrect) {
          cp[playerIndex].streak += 1;
          if (isAttacking) {
            const targetIndex = cp.findIndex(x => x.id === cp[playerIndex].targetId);
            const isEn = gs?.lang === 'en';
            if (targetIndex !== -1) {
              cp[targetIndex].position = Math.max(1, cp[targetIndex].position - 1);
              cp[targetIndex].attackMessage = isEn ? `💥 Attacked!` : `💥 Diserang!`;
              setTimeout(() => {
                setPlayers(prev => {
                  const cp2 = [...prev];
                  if (cp2[targetIndex]) cp2[targetIndex].attackMessage = null;
                  return cp2;
                });
              }, 5000); // Korban dijeda 5 detik
            }
          } else {
            currentPos += cp[playerIndex].lastRoll;
          }
        } else {
          cp[playerIndex].streak = 0;
          if (isAttacking) {
            currentPos = Math.max(1, currentPos - 1); // Penyerang gagal, mundur 1 langkah
          }
        }
        
        if (currentPos >= BOARD_SIZE) currentPos = BOARD_SIZE;
        
        let finalPos = currentPos;
        let isSnakeOrLadder = false;
        let delayMsg = "";
        const isEn = gs?.lang === 'en';

        if (LADDERS[currentPos]) {
          finalPos = LADDERS[currentPos];
          isSnakeOrLadder = true;
          delayMsg = isEn ? "🪜 LADDER UP!" : "🪜 NAIK TANGGA!";
        } else if (SNAKES[currentPos]) {
          finalPos = SNAKES[currentPos];
          isSnakeOrLadder = true;
          delayMsg = isEn ? "🐍 SNAKE DOWN!" : "🐍 KENA ULAR!";
        }

        if (isSnakeOrLadder) {
           playSfx(LADDERS[currentPos] ? 'climb' : 'slide');
           cp[playerIndex].position = currentPos;
           cp[playerIndex].status = "cooldown";
           cp[playerIndex].attackMessage = delayMsg;
           
           setTimeout(() => {
             setPlayers(prev => {
                const cp2 = [...prev];
                if (cp2[playerIndex]) {
                   playSfx('move');
                   cp2[playerIndex].position = finalPos;
                   cp2[playerIndex].attackMessage = null;
                   cp2[playerIndex].currentQuestion = getNextQuestion();
                   cp2[playerIndex].status = 'playing';
                   cp2[playerIndex].targetId = null;
                   if (finalPos === BOARD_SIZE && !winner) {
                     setWinner(cp2[playerIndex]);
                     playSfx('win');
                     stopBgm();
                   }
                }
                return cp2;
             });
           }, 1500);
        } else {
           playSfx('move');
           cp[playerIndex].position = finalPos;
           cp[playerIndex].currentQuestion = getNextQuestion();
           cp[playerIndex].status = 'playing';
           cp[playerIndex].targetId = null;
           
           if (finalPos === BOARD_SIZE && !winner) {
             setWinner(cp[playerIndex]);
             playSfx('win');
             stopBgm();
           }
        }
        
        return cp;
      });
    }, turnDelay);
  };

  const getTileColor = (pos) => {
    const {row, col} = getGridPos(pos);
    return (row + col) % 2 === 0 ? "#CCFBF1" : "#FEF08A";
  };

  const renderSVG = () => {
    const lines = [];
    const getCenter = (pos) => {
      const {row, col} = getGridPos(pos);
      return { x: ((col - 1) * 10) + 5, y: ((row - 1) * 10) + 5 };
    };

    Object.entries(LADDERS).forEach(([start, end], idx) => {
      const p1 = getCenter(parseInt(start));
      const p2 = getCenter(parseInt(end));
      
      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      const len = Math.sqrt(dx*dx + dy*dy);
      const nx = -dy / len;
      const ny = dx / len;
      const width = 1.8;
      
      const r1x1 = p1.x + nx * width; const r1y1 = p1.y + ny * width;
      const r1x2 = p2.x + nx * width; const r1y2 = p2.y + ny * width;
      const r2x1 = p1.x - nx * width; const r2y1 = p1.y - ny * width;
      const r2x2 = p2.x - nx * width; const r2y2 = p2.y - ny * width;

      lines.push(<line key={`l-r1bg-${idx}`} x1={r1x1} y1={r1y1} x2={r1x2} y2={r1y2} stroke="#451A03" strokeWidth="1.5" strokeLinecap="round" />);
      lines.push(<line key={`l-r1fg-${idx}`} x1={r1x1} y1={r1y1} x2={r1x2} y2={r1y2} stroke="#92400E" strokeWidth="0.8" strokeLinecap="round" />);
      lines.push(<line key={`l-r2bg-${idx}`} x1={r2x1} y1={r2y1} x2={r2x2} y2={r2y2} stroke="#451A03" strokeWidth="1.5" strokeLinecap="round" />);
      lines.push(<line key={`l-r2fg-${idx}`} x1={r2x1} y1={r2y1} x2={r2x2} y2={r2y2} stroke="#92400E" strokeWidth="0.8" strokeLinecap="round" />);

      const numRungs = Math.floor(len / 4);
      for (let i = 1; i <= numRungs; i++) {
        const t = i / (numRungs + 1);
        const rx = p1.x + dx * t;
        const ry = p1.y + dy * t;
        const rungX1 = rx + nx * width; const rungY1 = ry + ny * width;
        const rungX2 = rx - nx * width; const rungY2 = ry - ny * width;
        lines.push(<line key={`l-rungbg-${idx}-${i}`} x1={rungX1} y1={rungY1} x2={rungX2} y2={rungY2} stroke="#451A03" strokeWidth="1.2" />);
        lines.push(<line key={`l-rungfg-${idx}-${i}`} x1={rungX1} y1={rungY1} x2={rungX2} y2={rungY2} stroke="#B45309" strokeWidth="0.6" />);
      }
    });

    Object.entries(SNAKES).forEach(([head, tail], idx) => {
      const p1 = getCenter(parseInt(head));
      const p2 = getCenter(parseInt(tail));
      
      const cx = (p1.x + p2.x) / 2 + ((idx % 2 === 0) ? 15 : -15);
      const cy = (p1.y + p2.y) / 2 + ((idx % 3 === 0) ? 15 : -15);
      
      lines.push(<path key={`s-body-${idx}`} d={`M ${p1.x} ${p1.y} Q ${cx} ${cy} ${p2.x} ${p2.y}`} fill="transparent" stroke="#10B981" strokeWidth="4" strokeLinecap="round" strokeOpacity="0.95" />);
      lines.push(<path key={`s-pattern-${idx}`} d={`M ${p1.x} ${p1.y} Q ${cx} ${cy} ${p2.x} ${p2.y}`} fill="transparent" stroke="#047857" strokeWidth="1.5" strokeDasharray="1,2.5" strokeOpacity="0.8" />);
      
      const angle = Math.atan2(p1.y - cy, p1.x - cx) * 180 / Math.PI;

      lines.push(
        <g key={`s-headg-${idx}`} transform={`translate(${p1.x}, ${p1.y}) rotate(${angle})`}>
          <path d="M 0 0 L 4 0 L 5 -1 M 4 0 L 5 1" fill="transparent" stroke="#EF4444" strokeWidth="0.5" />
          <ellipse cx="0" cy="0" rx="3.5" ry="2.2" fill="#10B981" />
          <circle cx="1.5" cy="-1.2" r="0.6" fill="#fff" />
          <circle cx="1.5" cy="1.2" r="0.6" fill="#fff" />
          <circle cx="1.8" cy="-1.2" r="0.3" fill="#000" />
          <circle cx="1.8" cy="1.2" r="0.3" fill="#000" />
        </g>
      );
    });

    return <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 5, filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.4))"}}>{lines}</svg>;
  };

  const isEn = gs?.lang === 'en';

  if (setupMode) {
    return (
      <div style={{paddingTop: 40, paddingBottom: 100, minHeight: "100vh", background:"var(--bg-main)", paddingLeft: 16, paddingRight: 16}}>
        <h2 style={{fontFamily: "Exo 2", fontWeight: 900, fontSize: 24, color: C.text, marginBottom: 8, textAlign: "center"}}>{isEn ? "🐉 Smart Snakes & Ladders" : "🐉 Ular Tangga Pintar"}</h2>
        <div style={{background: "var(--bg-card)", borderRadius: 20, padding: 20, boxShadow: C.shadowCard}}>
          <label style={{fontSize: 13, fontWeight: 800, color: C.text, display: "block", marginBottom: 8}}>{isEn ? "Number of Players:" : "Jumlah Pemain:"}</label>
          <div style={{display: "flex", gap: 8, marginBottom: 20}}>
            {[2,3,4,5].map(num => (
              <button key={num} onClick={() => setPlayerCount(num)} style={{flex: 1, padding: "10px", borderRadius: 12, border: playerCount === num ? `2px solid ${C.blue}` : "2px solid transparent", background: playerCount === num ? C.blueLt : "#F1F5F9", fontWeight: 800, cursor: "pointer"}}>{num}</button>
            ))}
          </div>
          
          <div style={{marginBottom: 24}}>
            {players.map((p, idx) => (
              <div key={p.id} style={{background: "#F8FAFC", borderRadius: 16, padding: 12, marginBottom: 12, border: "1px solid #E2E8F0"}}>
                <label style={{fontSize: 12, fontWeight: 800, color: "#475569", marginBottom: 4, display: "block"}}>{isEn ? `Player ${idx + 1} Name` : `Nama Pemain ${idx + 1}`}</label>
                <input 
                  type="text" 
                  value={p.name} 
                  onChange={(e) => handleNameChange(idx, e.target.value)}
                  style={{width: "100%", padding: "8px 12px", borderRadius: 12, border: "1px solid #CBD5E1", fontSize: 14, fontWeight: 700, color: "#1E293B", marginBottom: 10}}
                />
                <label style={{fontSize: 12, fontWeight: 800, color: "#475569", marginBottom: 4, display: "block"}}>{isEn ? "Choose Token" : "Pilih Pion"}</label>
                <div style={{display: "flex", gap: 8, overflowX: "auto", paddingBottom: 8}}>
                  {AVATAR_OPTIONS.map(av => (
                    <div 
                      key={av} 
                      onClick={() => handleAvatarChange(idx, av)}
                      style={{fontSize: 24, cursor: "pointer", background: p.avatar === av ? C.blueLt : "transparent", padding: 4, borderRadius: 8, border: p.avatar === av ? `2px solid ${C.blue}` : "2px solid transparent", transition: "all 0.2s"}}
                    >
                      {av}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <button className="tap" onClick={startGame} style={{width: "100%", background: "linear-gradient(135deg, #10B981, #34D399)", color: "#fff", border: "none", padding: "14px", borderRadius: 16, fontSize: 16, fontWeight: 900, cursor: "pointer"}}>{isEn ? "START RACE!" : "MULAI BALAPAN!"}</button>
          <button className="tap" onClick={() => onNav('arena')} style={{width: "100%", background: "#F1F5F9", color: "#64748B", border: "none", padding: "14px", borderRadius: 16, fontSize: 14, fontWeight: 800, cursor: "pointer", marginTop: 12}}>{isEn ? "BACK TO ARENA" : "KEMBALI KE ARENA"}</button>
        </div>
      </div>
    );
  }

  const tiles = [];
  for (let i = 1; i <= BOARD_SIZE; i++) {
    const { gridRow, gridColumn } = getGridPos(i);
    tiles.push(
      <div key={i} style={{gridRow, gridColumn, background: getTileColor(i), position: "relative", border: "0.1px solid rgba(0,0,0,0.05)", overflow: "hidden"}}>
        <span style={{position: "absolute", top: 2, left: 4, fontSize: 10, fontWeight: 900, color: "rgba(0,0,0,0.3)"}}>{i}</span>
      </div>
    );
  }

  return (
    <div style={{display: "flex", flexDirection: "column", position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "#F8FAFC", zIndex: 9999, height: "100dvh", overflow: "hidden"}}>
      
      {/* Header Info */}
      <div style={{background: "#fff", padding: "16px", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 2px 10px rgba(0,0,0,0.05)", zIndex: 10, flexShrink: 0}}>
        <button className="tap" onClick={() => { stopBgm(); onNav('arena'); }} style={{background: "#fff", border: "1px solid #E2E8F0", width: 44, height: 44, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 4px 12px rgba(0,0,0,0.04)", flexShrink: 0}}>
          <span style={{fontSize: 20}}>⬅️</span>
        </button>
        <div style={{display: "flex", alignItems: "center", gap: 10}}>
          <div style={{fontSize: 14, fontWeight: 900, color: C.blue, textTransform: "uppercase", letterSpacing: 1}}>
            {isEn ? "SNAKES & LADDERS" : "ULAR TANGGA"}
          </div>
        </div>
        <div style={{display: "flex", gap: 6}}>
          <button className="tap" onClick={() => setIsPaused(true)} style={{background: "#F1F5F9", border: "none", padding: "8px 10px", borderRadius: 12, cursor: "pointer", fontSize: 13}}>
            ⏸
          </button>
          <button className="tap" onClick={toggleMusic} style={{background: !muted ? "#D1FAE5" : "#F1F5F9", border: "none", padding: "8px 10px", borderRadius: 12, cursor: "pointer", fontSize: 13}}>
            {!muted ? "🔊" : "🔇"}
          </button> 
        </div>
      </div>

      <div style={{flex: 1, display: "flex", flexDirection: "column", overflow: "hidden"}}>
        
        <div style={{background: "#fff", borderBottomLeftRadius: 24, borderBottomRightRadius: 24, padding: "6px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", zIndex: 5, flexShrink: 0}}>
          <div style={{display: "grid", gridTemplateColumns: `repeat(${COLS}, 1fr)`, gridTemplateRows: `repeat(${ROWS}, 1fr)`, gap: 1, position: "relative", width: "100%", maxWidth: players.length > 3 ? 340 : 450, margin: "0 auto", aspectRatio: "1/1", maxHeight: players.length > 3 ? "35vh" : "50vh"}}>
            {renderSVG()}
            {tiles}
            
            {players.map((p, i) => {
              const { gridRow, gridColumn } = getGridPos(p.position);
              return (
                <div key={p.id} style={{
                  gridRow, gridColumn, 
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 14, zIndex: 10 + i,
                  transform: `translate(${(i%2)*15 - 7}%, ${(Math.floor(i/2))*15 - 7}%)`,
                  transition: "all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)"
                }}>
                  <div style={{background: "#fff", borderRadius: "50%", padding: 1, boxShadow: "0 2px 4px rgba(0,0,0,0.2)"}}>
                    {p.avatar}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {!winner ? (
          <div style={{flex: 1, overflow: "hidden", padding: players.length > 4 ? "4px" : "6px 8px", background: "#F8FAFC", display: "flex", flexDirection: "column"}}>
            <div style={{display: "grid", gridTemplateColumns: players.length > 4 ? "repeat(3, 1fr)" : "1fr 1fr", gap: players.length > 4 ? 4 : 6, flex: 1, alignContent: "start"}}>
              {players.map((p, i) => {
                let cardBg = "#fff";
                let borderColor = "transparent";
                if (p.status === 'correct') { cardBg = "#D1FAE5"; borderColor = "#10B981"; }
                if (p.status === 'wrong') { cardBg = "#FEE2E2"; borderColor = "#EF4444"; }
                
                return (
                  <div key={p.id} style={{position: "relative", background: cardBg, borderRadius: 10, padding: 6, boxShadow: "0 2px 6px rgba(0,0,0,0.05)", display: "flex", flexDirection: "column", border: `2px solid ${borderColor}`, transition: "background 0.2s", opacity: p.status === 'wrong' ? 0.7 : 1, overflow: "hidden", minHeight: 0}}>
                    
                    {p.attackMessage && (
                       <div style={{position: "absolute", inset: 0, background: "rgba(239, 68, 68, 0.95)", color: "#fff", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 13, zIndex: 10, textAlign: "center", padding: 8}}>
                          <span style={{fontSize: 24, marginBottom: 2}}>💥</span>
                          <span style={{lineHeight: 1.1}}>{p.attackMessage}</span>
                          <span style={{fontSize: 10, marginTop: 4, fontWeight: 700}}>{isEn ? "Move Back 1 Step!" : "Mundur 1 Langkah!"}</span>
                       </div>
                    )}

                    <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4}}>
                      <div style={{display: "flex", alignItems: "center", gap: 3}}>
                        <span style={{fontSize: 12}}>{p.avatar}</span>
                        <div style={{display: "flex", flexDirection: "column"}}>
                          <span style={{fontFamily: "Exo 2", fontWeight: 800, fontSize: 9, color: "#1E293B", maxWidth: 45, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"}}>{p.name}</span>
                          {p.streak > 1 && (
                            <span style={{fontSize: 7, fontWeight: 900, color: p.streak >= 5 ? "#EF4444" : "#F59E0B"}}>
                              🔥 St {p.streak}
                            </span>
                          )}
                        </div>
                      </div>
                      <span style={{fontSize: 8, fontWeight: 900, color: "#fff", background: C.blue, padding: "2px 4px", borderRadius: 4}}>K {p.position}</span>
                    </div>
                    
                    {p.status === 'wrong' ? (
                      <div style={{flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#EF4444", fontWeight: 800, fontSize: 10}}>
                        {isEn ? "❌ PENALTY" : "❌ PENALTI"}
                      </div>
                    ) : p.status === 'correct' ? (
                      <div style={{flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#10B981", fontWeight: 800, fontSize: 10}}>
                        {p.targetId !== null ? (isEn ? `🎯 SUCCESS!` : `🎯 SUKSES!`) : (isEn ? `✔️ MOVE ${p.lastRoll} STEPS` : `✔️ MAJU ${p.lastRoll}`)}
                      </div>
                    ) : p.status === 'cooldown' ? (
                      <div style={{flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#F59E0B", fontWeight: 800, fontSize: 10}}>
                        {isEn ? "⏳ SLIDING" : "⏳ LUNCUR"}
                      </div>
                    ) : (
                      <>
                        <div style={{display: "flex", gap: players.length > 4 ? 2 : 4, marginBottom: players.length > 4 ? 4 : 8, overflowX: "hidden", paddingBottom: 2, flexWrap: "wrap", justifyContent: "center"}}>
                          <button 
                            onClick={() => handleSetTarget(i, null)}
                            style={{background: p.targetId === null ? C.blue : "#F1F5F9", color: p.targetId === null ? "#fff" : "#64748B", border: "none", padding: players.length > 4 ? "4px 6px" : "6px 10px", borderRadius: 6, fontSize: players.length > 4 ? 8 : 11, fontWeight: 800, cursor: "pointer", whiteSpace: "nowrap"}}
                          >
                            🚀 {isEn ? "Fwd" : "Maju"}
                          </button>
                          {players.map(opp => opp.id !== p.id && (
                            <button 
                              key={opp.id}
                              onClick={() => handleSetTarget(i, opp.id)}
                              style={{background: p.targetId === opp.id ? "#EF4444" : "#F1F5F9", color: p.targetId === opp.id ? "#fff" : "#64748B", border: "none", padding: players.length > 4 ? "4px 6px" : "6px 10px", borderRadius: 6, fontSize: players.length > 4 ? 8 : 11, fontWeight: 800, cursor: "pointer", whiteSpace: "nowrap"}}
                            >
                              🎯 {opp.avatar}
                            </button>
                          ))}
                        </div>

                        <div style={{fontSize: players.length > 4 ? 9 : players.length > 3 ? 11 : 13, fontWeight: 800, color: "#334155", marginBottom: players.length > 4 ? 4 : 8, lineHeight: 1.2, flex: 1}}>
                          {p.currentQuestion.q}
                        </div>
                        <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: players.length > 4 ? 2 : 6}}>
                          {p.currentQuestion.opts.map((opt, optIdx) => (
                            <button 
                              key={optIdx} 
                              onClick={() => handleAnswer(i, optIdx)}
                              style={{
                                background: "#F1F5F9", border: "1px solid #E2E8F0", borderRadius: 6, 
                                padding: players.length > 4 ? "4px 2px" : "8px 4px", fontSize: players.length > 4 ? 8 : players.length > 3 ? 9 : 11, fontWeight: 700, color: "#475569",
                                cursor: "pointer", wordBreak: "break-word"
                              }}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          <div style={{flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 20}}>
            <div style={{background: "linear-gradient(135deg, #F59E0B, #FCD34D)", borderRadius: 24, padding: 30, textAlign: "center", boxShadow: "0 10px 30px rgba(245,158,11,0.3)", animation: "fadeUp 0.5s ease", width: "100%"}}>
              <div style={{fontSize: 60, marginBottom: 10}}>🏆</div>
              <h2 style={{fontFamily: "Exo 2", fontWeight: 900, fontSize: 24, color: "#78350F", marginBottom: 8}}>{isEn ? "WE HAVE A WINNER!" : "KITA PUNYA PEMENANG!"}</h2>
              <div style={{fontSize: 20, fontWeight: 800, color: "#92400E", marginBottom: 20}}>
                {winner.avatar} {winner.name}
              </div>
              <p style={{fontSize: 14, color: "#B45309", marginBottom: 24, fontWeight: 600}}>
                {isEn ? "Successfully reached the finish line first. The host gets +20 Coins & +100 XP!" : "Berhasil mencapai garis finish terlebih dahulu. Tuan rumah mendapatkan +20 Koin & +100 XP!"}
              </p>
              <button className="tap" onClick={() => onNav('arena')} style={{background: "#78350F", color: "#fff", border: "none", padding: "14px 24px", borderRadius: 14, fontSize: 15, fontWeight: 900, cursor: "pointer", width: "100%", boxShadow: "0 4px 12px rgba(120,53,15,0.3)"}}>
                {isEn ? "BACK TO ARENA" : "KEMBALI KE ARENA"}
              </button>
            </div>
          </div>
        )}

        {/* Pause Overlay */}
        {isPaused && (
          <div style={{position: "fixed", inset: 0, background: "rgba(15,23,42,0.9)", zIndex: 10000, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)"}}>
            <div style={{fontSize: 60, marginBottom: 10, animation: "pulse 2s infinite"}}>⏸️</div>
            <h2 style={{fontFamily: "Exo 2", fontWeight: 900, fontSize: 32, color: "#fff", marginBottom: 30, letterSpacing: 2}}>{isEn ? "PAUSED" : "DIPAUSE"}</h2>
            <button className="tap" onClick={() => setIsPaused(false)} style={{background: C.blue, color: "#fff", border: "none", padding: "16px 40px", borderRadius: 16, fontSize: 18, fontWeight: 900, cursor: "pointer", boxShadow: "0 4px 20px rgba(59, 130, 246, 0.4)"}}>
              {isEn ? "▶️ RESUME" : "▶️ LANJUTKAN"}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
