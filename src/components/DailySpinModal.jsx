import React, { useState } from 'react';

const ITEMS = [
  { label: "ZONK", type: "zonk", color: "#EF4444" },
  { label: "5 KOIN", type: "coin", val: 5, color: "#F59E0B" },
  { label: "10 KOIN", type: "coin", val: 10, color: "#10B981" },
  { label: "20 KOIN", type: "coin", val: 20, color: "#3B82F6" },
  { label: "50 KOIN", type: "coin", val: 50, color: "#8B5CF6" },
  { label: "100 KOIN", type: "coin", val: 100, color: "#EC4899" }
];

export default function DailySpinModal({ onClose, onWin, isDark }) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState(null);

  const getSpinResult = () => {
    const rand = Math.random() * 100;
    if (rand < 0.2) return 5; // 0.2% for 100 Coins
    if (rand < 1.5) return 4; // 1.3% for 50 Coins
    if (rand < 10) return 3; // 8.5% for 20 Coins
    if (rand < 30) return 2; // 20% for 10 Coins
    if (rand < 65) return 1; // 35% for 5 Coins
    return 0; // 35% for Zonk
  };

  const spin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setResult(null);

    const winningIndex = getSpinResult();
    const extraSpins = 5 * 360; // 5 full rotations
    // The conic-gradient starts shifted by -30deg so index 0 is centered at top (0deg).
    // To land on index i, we rotate backwards by (i * 60) degrees.
    // Adding a slight random offset so it doesn't land exactly in the dead center every time.
    const randomOffset = Math.floor(Math.random() * 40) - 20; // -20 to +20 degrees
    const finalRotation = rotation + extraSpins + (360 - (winningIndex * 60)) + randomOffset;

    setRotation(finalRotation);

    setTimeout(() => {
      setIsSpinning(false);
      setResult(ITEMS[winningIndex]);
      // Give time for user to see the result, then trigger onWin
      setTimeout(() => {
        onWin(ITEMS[winningIndex]);
      }, 1500);
    }, 4000); // 4 seconds spin duration
  };

  // Generate conic gradient string
  const gradient = `conic-gradient(from -30deg, ${ITEMS.map((item, i) => `${item.color} ${i * 60}deg ${(i + 1) * 60}deg`).join(', ')})`;

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 100000, 
      background: "rgba(15,23,42,0.9)", backdropFilter: "blur(10px)", 
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 20
    }}>
      
      <div style={{
        background: isDark ? "#1E293B" : "#FFFFFF", 
        padding: "30px 20px", borderRadius: 24, width: "100%", maxWidth: 360, 
        textAlign: "center", boxShadow: "0 20px 50px rgba(0,0,0,0.5)", 
        position: "relative", overflow: "hidden"
      }}>
        {/* Close button */}
        {!isSpinning && (
          <button onClick={onClose} style={{
            position: "absolute", top: 16, right: 16, background: "rgba(148,163,184,0.2)", 
            border: "none", width: 32, height: 32, borderRadius: 16, 
            color: isDark ? "#FFF" : "#000", fontWeight: "bold", cursor: "pointer"
          }}>
            ✕
          </button>
        )}

        <h2 style={{fontFamily:"Exo 2", fontWeight:900, marginBottom:8, color: isDark ? "#FFF" : "#0F172A"}}>
          Roda Keberuntungan
        </h2>
        <p style={{fontSize:13, color: "#64748B", marginBottom:30}}>
          Putar roda dan menangkan hingga 100 SmartCoin setiap hari!
        </p>

        {/* Wheel Container */}
        <div style={{position: "relative", width: 260, height: 260, margin: "0 auto 30px"}}>
          {/* Pointer */}
          <div style={{
            position: "absolute", top: -15, left: "50%", transform: "translateX(-50%)",
            width: 0, height: 0, borderLeft: "15px solid transparent", borderRight: "15px solid transparent",
            borderTop: "25px solid #0F172A", zIndex: 10, filter: "drop-shadow(0 4px 4px rgba(0,0,0,0.3))"
          }} />

          {/* The Wheel */}
          <div style={{
            width: "100%", height: "100%", borderRadius: "50%",
            background: gradient,
            transform: `rotate(${rotation}deg)`,
            transition: "transform 4s cubic-bezier(0.1, 0.7, 0.1, 1)",
            boxShadow: "0 0 0 8px rgba(255,255,255,0.2) inset, 0 10px 30px rgba(0,0,0,0.3)",
            position: "relative",
            overflow: "hidden"
          }}>
            {/* Inner center dot */}
            <div style={{
              position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
              width: 50, height: 50, borderRadius: "50%", background: "#FFF",
              boxShadow: "0 4px 10px rgba(0,0,0,0.3)", zIndex: 5,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "Exo 2", fontWeight: 900, fontSize: 18, color: "#0F172A"
            }}>
              SPIN
            </div>

            {/* Labels */}
            {ITEMS.map((item, i) => {
              const rotateAngle = i * 60;
              return (
                <div key={i} style={{
                  position: "absolute", top: 0, left: "50%",
                  transform: `translateX(-50%) rotate(${rotateAngle}deg)`,
                  transformOrigin: "50% 130px", /* 130px is half of 260px (center) */
                  height: 130, width: 80,
                  display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 16,
                  color: "#FFF", fontFamily: "Exo 2", fontWeight: 800, fontSize: 14,
                  textShadow: "0 2px 4px rgba(0,0,0,0.5)", zIndex: 2
                }}>
                  {item.label}
                  {item.type === "coin" && (
                    <img src="/coin.png" style={{width: 24, height: 24, marginTop: 4, borderRadius:"50%", objectFit:"cover"}} alt="coin" />
                  )}
                  {item.type === "zonk" && <span style={{fontSize: 20, marginTop: 4}}>😢</span>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Button */}
        {result ? (
          <div style={{animation: "popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)"}}>
            <h3 style={{fontFamily:"Exo 2", fontWeight:900, color: result.type === 'zonk' ? '#EF4444' : '#10B981', fontSize: 22, margin: 0, display: "flex", alignItems: "center", justifyContent: "center"}}>
              {result.type === 'zonk' ? 'Yahh Zonk!' : (
                <>
                  Selamat! +{result.val} <img src="/coin.png" style={{width: 24, height: 24, marginLeft: 6, borderRadius:"50%", objectFit:"cover"}} alt="coin" />
                </>
              )}
            </h3>
            <p style={{fontSize: 13, color: "#64748B", marginTop: 4}}>
              {result.type === 'zonk' ? 'Coba lagi keberuntunganmu besok.' : 'Koin telah ditambahkan ke dompetmu.'}
            </p>
          </div>
        ) : (
          <button 
            className="tap"
            onClick={spin}
            disabled={isSpinning}
            style={{
              width: "100%", padding: 16, borderRadius: 16, 
              background: isSpinning ? "#94A3B8" : "linear-gradient(135deg, #F59E0B, #FCD34D)", 
              color: isSpinning ? "#FFF" : "#78350F", border: "none", 
              fontWeight: 900, fontSize: 16, letterSpacing: 1,
              cursor: isSpinning ? "not-allowed" : "pointer",
              boxShadow: isSpinning ? "none" : "0 8px 25px rgba(245,158,11,0.4)"
            }}
          >
            {isSpinning ? "MEMUTAR..." : "PUTAR SEKARANG"}
          </button>
        )}
      </div>
    </div>
  );
}
