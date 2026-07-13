import React, { useState, useEffect, useRef } from 'react';
import { C } from '../data/mockData';
import { playSfx, toggleMute, getMuteState, playBgm, stopBgm } from '../utils/audio';
import { CoinAnnouncement } from '../components/Shared';

const BossShip = React.memo(({ isTarget }) => (
  <svg width="120" height="120" viewBox="0 0 100 100" fill="none" style={{animation: "elasticBoss 2s infinite ease-in-out", transformOrigin:"top center"}}>
    <defs>
      <radialGradient id="bossGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#EF4444" stopOpacity="1"/>
        <stop offset="100%" stopColor="#7F1D1D" stopOpacity="0"/>
      </radialGradient>
      <linearGradient id="bossArmor" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3F3F46"/>
        <stop offset="50%" stopColor="#18181B"/>
        <stop offset="100%" stopColor="#09090B"/>
      </linearGradient>
      <linearGradient id="bossGold" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#B45309"/>
        <stop offset="100%" stopColor="#FBBF24"/>
      </linearGradient>
    </defs>
    <path d="M10 40 L50 10 L90 40 L80 80 L50 60 L20 80 Z" fill="url(#bossArmor)" stroke={isTarget ? "#EF4444" : "url(#bossGold)"} strokeWidth="2" />
    <path d="M25 45 L50 25 L75 45 L65 70 L50 55 L35 70 Z" fill="url(#bossArmor)" stroke="#52525B" strokeWidth="1.5" />
    <path d="M50 10 L10 40 L25 45 L50 25 Z" fill="#71717A" opacity="0.4"/>
    <g style={{animation:"wingFlap 1.5s infinite ease-in-out", transformOrigin:"center"}}>
      <circle cx="50" cy="50" r="18" fill="url(#bossGlow)" />
      <circle cx="50" cy="50" r="8" fill="#FFFFFF" opacity="0.9" />
    </g>
    <circle cx="20" cy="70" r="6" fill="#EF4444" filter="drop-shadow(0 0 8px #EF4444)" />
    <circle cx="80" cy="70" r="6" fill="#EF4444" filter="drop-shadow(0 0 8px #EF4444)" />
  </svg>
));

const FastShip = React.memo(({ isTarget }) => (
  <svg width="70" height="70" viewBox="0 0 100 100" fill="none" style={{animation: "elasticFast 0.8s infinite ease-in-out", transformOrigin:"center"}}>
    <defs>
      <linearGradient id="fastArmor" x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stopColor="#52525B"/>
        <stop offset="100%" stopColor="#18181B"/>
      </linearGradient>
      <linearGradient id="fastTrim" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#F59E0B"/>
        <stop offset="100%" stopColor="#EA580C"/>
      </linearGradient>
    </defs>
    <g style={{animation:"wingFlap 0.4s infinite ease-in-out", transformOrigin:"center"}}>
      <path d="M50 90 L10 20 L50 40 L90 20 Z" fill="url(#fastArmor)" stroke={isTarget ? "#FBBF24" : "url(#fastTrim)"} strokeWidth="3" strokeLinejoin="round" />
    </g>
    <path d="M50 80 L40 50 L50 45 L60 50 Z" fill="#FCD34D" opacity="0.9" />
    <circle cx="50" cy="30" r="8" fill="#F97316" filter="blur(2px)" />
  </svg>
));

const NormalShip = React.memo(({ isTarget }) => (
  <svg width="80" height="80" viewBox="0 0 100 100" fill="none" style={{animation: "elasticBob 1.2s infinite ease-in-out", transformOrigin:"center"}}>
    <defs>
      <radialGradient id="ufoDome" cx="50%" cy="30%" r="50%">
        <stop offset="0%" stopColor="#6EE7B7"/>
        <stop offset="100%" stopColor="#059669"/>
      </radialGradient>
      <linearGradient id="ufoMetal" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#94A3B8"/>
        <stop offset="50%" stopColor="#475569"/>
        <stop offset="100%" stopColor="#1E293B"/>
      </linearGradient>
    </defs>
    <ellipse cx="50" cy="40" rx="20" ry="25" fill="url(#ufoDome)" filter={isTarget ? "drop-shadow(0 0 15px #EF4444)" : "none"} />
    <ellipse cx="50" cy="25" rx="8" ry="4" fill="#FFFFFF" opacity="0.6" />
    <g style={{animation:"wingFlap 0.8s infinite ease-in-out", transformOrigin:"center"}}>
      <ellipse cx="50" cy="60" rx="45" ry="15" fill="url(#ufoMetal)" />
      <ellipse cx="50" cy="58" rx="42" ry="12" fill="none" stroke={isTarget ? "#EF4444" : "#CBD5E1"} strokeWidth="2" opacity="0.5" />
      <circle cx="15" cy="60" r="4" fill={isTarget ? "#EF4444" : "#10B981"} />
      <circle cx="35" cy="65" r="4" fill={isTarget ? "#EF4444" : "#10B981"} />
      <circle cx="65" cy="65" r="4" fill={isTarget ? "#EF4444" : "#10B981"} />
      <circle cx="85" cy="60" r="4" fill={isTarget ? "#EF4444" : "#10B981"} />
    </g>
  </svg>
));

const WORD_LISTS = {
  3: ["CAT", "DOG", "PEN", "CUP", "BUS", "CAR", "SKY", "BOX", "HAT", "MUG", "SUN", "AIR", "NET", "WEB"],
  4: ["BOOK", "DESK", "DOOR", "BIRD", "FISH", "TREE", "MOON", "STAR", "ROAD", "TIME", "DATA", "FUND", "IDEA"],
  5: ["CHAIR", "GLASS", "MONEY", "HOUSE", "WATER", "PLANT", "PHONE", "TRAIN", "PAPER", "VALUE", "BRAND", "ASSET"],
  6: ["PROFIT", "MARKET", "PLANET", "SYSTEM", "DESIGN", "ACTION", "TARGET", "BUDGET", "INCOME", "GROWTH"],
  7: ["REVENUE", "PROJECT", "COMPANY", "PRODUCT", "CAPITAL", "NETWORK", "ECONOMY", "SUCCESS", "MEETING"],
  8: ["BUSINESS", "CUSTOMER", "INVESTOR", "ANALYSIS", "INDUSTRY", "STRATEGY", "SOFTWARE", "PLATFORM"],
  9: ["MARKETING", "ECONOMICS", "EMPLOYEES", "KNOWLEDGE", "RESOURCES", "PORTFOLIO", "VALUATION"],
  10: ["INVESTMENT", "MANAGEMENT", "INNOVATION", "TECHNOLOGY", "OPERATIONS", "LEADERSHIP"],
  11: ["DEVELOPMENT", "PARTNERSHIP", "PERFORMANCE", "COMPETITION", "PROFITABLE"],
  12: ["ENTREPRENEUR", "CORPORATION", "PRODUCTIVITY", "ORGANIZATION", "SHAREHOLDERS"]
};

const BOSS_PHRASES = [
  "YOU CANNOT DEFEAT ME",
  "YOUR STARTUP WILL FAIL",
  "I AM THE MARKET CRASH",
  "PREPARE FOR BANKRUPTCY",
  "NO INVESTOR WILL SAVE YOU",
  "YOUR REVENUE IS ZERO",
  "THE ECONOMY IS COLLAPSING",
  "GIVE UP ON YOUR DREAMS",
  "I WILL DESTROY YOUR COMPANY"
];

const DICTIONARY = {
  CAT:"Kucing", DOG:"Anjing", PEN:"Pena", CUP:"Cangkir", BUS:"Bis", CAR:"Mobil", SKY:"Langit", BOX:"Kotak", HAT:"Topi", MUG:"Gelas", SUN:"Matahari", AIR:"Udara", NET:"Jaring", WEB:"Web",
  BOOK:"Buku", DESK:"Meja", DOOR:"Pintu", BIRD:"Burung", FISH:"Ikan", TREE:"Pohon", MOON:"Bulan", STAR:"Bintang", ROAD:"Jalan", TIME:"Waktu", DATA:"Data", FUND:"Dana", IDEA:"Ide",
  CHAIR:"Kursi", GLASS:"Kaca/Gelas", MONEY:"Uang", HOUSE:"Rumah", WATER:"Air", PLANT:"Tanaman", PHONE:"Telepon", TRAIN:"Kereta", PAPER:"Kertas", VALUE:"Nilai", BRAND:"Merek", ASSET:"Aset",
  PROFIT:"Keuntungan", MARKET:"Pasar", PLANET:"Planet", SYSTEM:"Sistem", DESIGN:"Desain", ACTION:"Aksi", TARGET:"Target", BUDGET:"Anggaran", INCOME:"Pendapatan", GROWTH:"Pertumbuhan",
  REVENUE:"Pendapatan", PROJECT:"Proyek", COMPANY:"Perusahaan", PRODUCT:"Produk", CAPITAL:"Modal", NETWORK:"Jaringan", ECONOMY:"Ekonomi", SUCCESS:"Sukses", MEETING:"Rapat",
  BUSINESS:"Bisnis", CUSTOMER:"Pelanggan", INVESTOR:"Investor", ANALYSIS:"Analisis", INDUSTRY:"Industri", STRATEGY:"Strategi", SOFTWARE:"Perangkat Lunak", PLATFORM:"Platform",
  MARKETING:"Pemasaran", ECONOMICS:"Ilmu Ekonomi", EMPLOYEES:"Karyawan", KNOWLEDGE:"Pengetahuan", RESOURCES:"Sumber Daya", PORTFOLIO:"Portofolio", VALUATION:"Penilaian",
  INVESTMENT:"Investasi", MANAGEMENT:"Manajemen", INNOVATION:"Inovasi", TECHNOLOGY:"Teknologi", OPERATIONS:"Operasi", LEADERSHIP:"Kepemimpinan",
  DEVELOPMENT:"Pengembangan", PARTNERSHIP:"Kemitraan", PERFORMANCE:"Kinerja", COMPETITION:"Kompetisi", PROFITABLE:"Menguntungkan",
  ENTREPRENEUR:"Pengusaha", CORPORATION:"Korporasi", PRODUCTIVITY:"Produktivitas", ORGANIZATION:"Organisasi", SHAREHOLDERS:"Pemegang Saham",
  "YOU CANNOT DEFEAT ME":"Kau tak bisa mengalahkanku",
  "YOUR STARTUP WILL FAIL":"Startup-mu akan gagal",
  "I AM THE MARKET CRASH":"Akulah kehancuran pasar",
  "PREPARE FOR BANKRUPTCY":"Bersiaplah untuk bangkrut",
  "NO INVESTOR WILL SAVE YOU":"Tak ada investor yang menyelamatkanmu",
  "YOUR REVENUE IS ZERO":"Pendapatanmu nol",
  "THE ECONOMY IS COLLAPSING":"Ekonomi sedang runtuh",
  "GIVE UP ON YOUR DREAMS":"Menyerahlah pada mimpimu",
  "I WILL DESTROY YOUR COMPANY":"Aku akan hancurkan perusahaanmu"
};


const getLevel = (score) => {
  let lvl = 1;
  let required = 150;
  let currentCost = 150;
  while (score >= required && lvl < 21) {
    lvl++;
    currentCost += 50;
    required += currentCost;
  }
  return lvl;
};

export default function TypingShooterScreen({ gs, setGs, onNav, onCoinEarned }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [hp, setHp] = useState(5);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [enemies, setEnemies] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    const now = new Date().getTime();
    const today = new Date().toLocaleDateString('id-ID');
    const lastReset = gs?.typingResetDate ? new Date(gs.typingResetDate).toLocaleDateString('id-ID') : null;
    
    if (setGs && today !== lastReset) {
      setGs(prev => ({ ...prev, typingDailyCoins: 0, typingResetDate: now }));
    }
  }, [gs?.typingResetDate, setGs]);

  useEffect(() => {
    setMuted(getMuteState());
    return () => stopBgm();
  }, []);

  const [lasers, setLasers] = useState([]);
  const [bossHp, setBossHp] = useState(0);
  const [recoil, setRecoil] = useState(false);
  const [mobileInput, setMobileInput] = useState("");
  const [translations, setTranslations] = useState([]);
  const [isPaused, setIsPaused] = useState(false);
  const [levelUpMsg, setLevelUpMsg] = useState(false);
  const [showCoinInfo, setShowCoinInfo] = useState(false);
  const [viewportHeight, setViewportHeight] = useState('100vh');

  useEffect(() => {
    if (!window.visualViewport) return;
    const handleResize = () => {
      setViewportHeight(`${window.visualViewport.height}px`);
    };
    handleResize();
    window.visualViewport.addEventListener('resize', handleResize);
    window.visualViewport.addEventListener('scroll', handleResize);
    return () => {
      window.visualViewport.removeEventListener('resize', handleResize);
      window.visualViewport.removeEventListener('scroll', handleResize);
    };
  }, []);

  useEffect(() => {
    if (level > 1 && level < 21) {
      setLevelUpMsg(true);
      const timer = setTimeout(() => setLevelUpMsg(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [level]);

  const inputRef = useRef(null);

  // Refs for game loop state
  const stateRef = useRef({ hp: 5, score: 0, level: 1, enemies: [], activeId: null, lastSpawn: 0, isBossSpawned: false, bossHp: 0 });

  // Sync state to ref for fast loop access
  useEffect(() => {
    stateRef.current.hp = hp;
    stateRef.current.score = score;
    stateRef.current.level = level;
    stateRef.current.enemies = enemies;
    stateRef.current.activeId = activeId;
    stateRef.current.bossHp = bossHp;
    stateRef.current.isPaused = isPaused;
  }, [hp, score, level, enemies, activeId, bossHp, isPaused]);

  // Start game
  const startGame = () => {
    setIsPlaying(true);
    setGameOver(false);
    setHp(5);
    setScore(0);
    setLevel(1);
    setEnemies([]);
    setActiveId(null);
    setLasers([]);
    setBossHp(0);
    setTranslations([]);
    setIsPaused(false);
    playBgm('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3');
    stateRef.current = { hp: 5, score: 0, level: 1, enemies: [], activeId: null, lastSpawn: Date.now(), isBossSpawned: false, bossHp: 0, isPaused: false };
  };

  // Keyboard / Mobile Input logic
  const handleChar = (char) => {
    if (stateRef.current.isPaused) return;
    const key = char.toUpperCase();
    if (!/^[A-Z ]$/.test(key)) return;

    const { enemies: curEnemies, activeId: curActiveId, level: curLevel, bossHp: curBossHp } = stateRef.current;
    let newEnemies = [...curEnemies];
    let newActiveId = curActiveId;
    let hit = false;
    let destroyed = false;
    let targetEnemy = null;

    if (!newActiveId) {
      targetEnemy = newEnemies.find(en => en.word[0] === key);
      if (targetEnemy) {
        newActiveId = targetEnemy.id;
        targetEnemy.typed = 1;
        hit = true;
        if (targetEnemy.typed === targetEnemy.word.length) destroyed = true;
      }
    } else {
      const idx = newEnemies.findIndex(en => en.id === newActiveId);
      if (idx > -1) {
        targetEnemy = newEnemies[idx];
        if (targetEnemy.word[targetEnemy.typed] === key) {
          targetEnemy.typed++;
          hit = true;
          if (targetEnemy.typed === targetEnemy.word.length) destroyed = true;
        }
      } else {
        newActiveId = null;
      }
    }

    if (hit && targetEnemy) {
      if (destroyed) playSfx('correct');
      else playSfx('shoot');
      const newLaser = { id: Date.now(), x: targetEnemy.x, yStart: 85, yEnd: targetEnemy.y };
      setLasers(prev => [...prev, newLaser]);
      setTimeout(() => {
        setLasers(prev => prev.filter(l => l.id !== newLaser.id));
      }, 150);

      if (destroyed) {
        const mean = DICTIONARY[targetEnemy.word] || targetEnemy.word;
        const newTrans = { id: Date.now() + Math.random(), text: `${targetEnemy.word} = ${mean}`, x: targetEnemy.x, y: targetEnemy.y };
        setTranslations(prev => [...prev, newTrans]);
        setTimeout(() => {
          setTranslations(prev => prev.filter(t => t.id !== newTrans.id));
        }, 2000);

        if (targetEnemy.isBoss) {
          const nextBossHp = curBossHp - 1;
          setBossHp(nextBossHp);
          setScore(s => s + 50);
          
          if (nextBossHp <= 0) {
            newEnemies = newEnemies.filter(en => en.id !== targetEnemy.id);
            setScore(s => s + 500);
            setRecoil(true);
            setTimeout(() => setRecoil(false), 250);
          } else {
            targetEnemy.word = BOSS_PHRASES[Math.floor(Math.random() * BOSS_PHRASES.length)];
            targetEnemy.typed = 0;
            setRecoil(true);
            setTimeout(() => setRecoil(false), 200);
          }
        } else {
          newEnemies = newEnemies.filter(en => en.id !== targetEnemy.id);
          setScore(s => s + targetEnemy.word.length * 10);
          setRecoil(true);
          setTimeout(() => setRecoil(false), 250);
        }
        newActiveId = null;
      }

      setEnemies(newEnemies);
      setActiveId(newActiveId);
    }
  };

  useEffect(() => {
    if (!isPlaying || gameOver) return;
    const handleKeyDown = (e) => {
      // Ignored for mobile compatibility if using the hidden input, but useful for PC
      if (e.key === "Unidentified") return; 
      handleChar(e.key);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, gameOver]);

  // Main Game Loop
  useEffect(() => {
    if (!isPlaying || gameOver) return;

    const loop = setInterval(() => {
      const st = stateRef.current;
      if (st.isPaused) return;
      const now = Date.now();
      let curEnemies = [...st.enemies];
      let newHp = st.hp;
      let newActiveId = st.activeId;

      // Update positions & check collisions
      curEnemies = curEnemies.map(en => {
        if (en.isBoss) {
          const nextX = en.x + en.dir * 0.3;
          let ndir = en.dir;
          if (nextX > 65) ndir = -1;
          if (nextX < 35) ndir = 1;
          return { ...en, x: nextX, dir: ndir };
        } else {
          const nextY = en.y + en.speed;
          if (nextY > 85) {
            en.dead = true;
            playSfx('error');
            newHp -= 1;
            if (en.id === newActiveId) newActiveId = null;
          }
          return { ...en, y: nextY };
        }
      });

      const aliveEnemies = curEnemies.filter(en => !en.dead);
      if (newHp !== st.hp) {
        setHp(newHp);
        if (newHp <= 0) {
          playSfx('gameover');
          stopBgm();
          setGameOver(true);
          setIsPlaying(false);
          
          let coinsEarned = Math.floor(st.score / 500);
          if (coinsEarned > 0) {
             const currentDaily = gs?.typingDailyCoins || 0;
             const isEn = gs?.lang === 'en';
             if (currentDaily >= 3) {
               alert(isEn ? "NO ADDITIONAL COINS\n\nThe maximum daily coins from Vocab Defender (3 Coins) has been reached. Coins will be reset tomorrow!" : "TIDAK ADA KOIN TAMBAHAN\n\nMaksimal koin harian dari game Vocab Defender (3 Koin) telah tercapai. Koin akan direset besok!");
             } else {
               const allowedCoins = Math.min(coinsEarned, 3 - currentDaily);
               if (setGs) setGs(prev => ({ ...prev, typingDailyCoins: (prev.typingDailyCoins || 0) + allowedCoins }));
               onCoinEarned(allowedCoins);
               if (currentDaily + allowedCoins >= 3) {
                 setTimeout(() => alert(isEn ? `🎉 You earned ${allowedCoins} Coins!\n\nYou have reached the maximum daily limit of 3 coins from Vocab Defender today!` : `🎉 Anda mendapatkan ${allowedCoins} Koin!\n\nAnda telah mencapai batas maksimal 3 koin harian dari Vocab Defender hari ini!`), 500);
               } else {
                 setTimeout(() => alert(isEn ? `🎉 You earned ${allowedCoins} Coins from Vocab Defender!` : `🎉 Anda mendapatkan ${allowedCoins} Koin dari Vocab Defender!`), 500);
               }
             }
          }
        }
      }

      // Check level progression
      let curLevel = getLevel(st.score);
      if (curLevel !== st.level) setLevel(curLevel);

      // Spawning logic
      let spawnRate = Math.max(800, 3000 - (curLevel * 100));
      if (curLevel === 21) spawnRate = 999999; 

      if (curLevel === 21 && !st.isBossSpawned) {
        st.isBossSpawned = true;
        setBossHp(10);
        aliveEnemies.push({
          id: 'BOSS',
          word: BOSS_PHRASES[Math.floor(Math.random() * BOSS_PHRASES.length)],
          typed: 0,
          x: 50,
          y: 20,
          speed: 0,
          isBoss: true,
          dir: 1
        });
      } else if (curLevel < 21 && now - st.lastSpawn > spawnRate) {
        st.lastSpawn = now;
        const wordLen = Math.min(12, Math.floor((curLevel - 1) / 2) + 3);
        const bank = WORD_LISTS[wordLen] || WORD_LISTS[3];
        const w = bank[Math.floor(Math.random() * bank.length)];
        
        const activeFirstLetters = aliveEnemies.map(en => en.word[0]);
        if (!activeFirstLetters.includes(w[0])) {
           const isFast = Math.random() > 0.7 && curLevel > 1;
           
           let newX;
           let attempts = 0;
           do {
             newX = 10 + Math.random() * 70;
             attempts++;
           } while (attempts < 10 && aliveEnemies.some(en => Math.abs(en.x - newX) < 16)); // Avoid horizontal stacking
           
           aliveEnemies.push({
            id: now.toString(),
            word: w,
            typed: 0,
            x: newX,
            y: -10,
            speed: isFast ? (0.3 + (curLevel * 0.08)) : (0.2 + (curLevel * 0.05)),
            isBoss: false,
            isFast: isFast
          });
        }
      }

      setEnemies(aliveEnemies);
      setActiveId(newActiveId);

      // Win condition: Boss dead
      if (st.isBossSpawned && st.bossHp <= 0 && st.hp > 0) {
        playSfx('win');
        stopBgm();
        setGameOver(true);
        setIsPlaying(false);
        let coinsEarned = Math.floor(st.score / 500); 
        
        if (coinsEarned > 0) {
           const currentDaily = gs?.typingDailyCoins || 0;
           const isEn = gs?.lang === 'en';
           if (currentDaily >= 3) {
             alert(isEn ? "NO ADDITIONAL COINS\n\nThe maximum daily coins from Vocab Defender (3 Coins) has been reached. Coins will be reset tomorrow!" : "TIDAK ADA KOIN TAMBAHAN\n\nMaksimal koin harian dari game Vocab Defender (3 Koin) telah tercapai. Koin akan direset besok!");
           } else {
             const allowedCoins = Math.min(coinsEarned, 3 - currentDaily);
             if (setGs) setGs(prev => ({ ...prev, typingDailyCoins: (prev.typingDailyCoins || 0) + allowedCoins }));
             onCoinEarned(allowedCoins);
             if (currentDaily + allowedCoins >= 3) {
               setTimeout(() => alert(isEn ? `🪙 You earned ${allowedCoins} Coins!\n\nYou have reached the maximum daily limit of 3 coins from Vocab Defender today!` : `🪙 Anda mendapatkan ${allowedCoins} Koin!\n\nAnda telah mencapai batas maksimal 3 koin harian dari Vocab Defender hari ini!`), 500);
             } else {
               setTimeout(() => alert(isEn ? `🪙 You earned ${allowedCoins} Coins from Vocab Defender!` : `🪙 Anda mendapatkan ${allowedCoins} Koin dari Vocab Defender!`), 500);
             }
           }
        }
      }

    }, 50);

    return () => clearInterval(loop);
  }, [isPlaying, gameOver]);

  return (
    <div 
      onClick={() => isPlaying && inputRef.current && inputRef.current.focus()}
      style={{height: viewportHeight, transition: "height 0.25s cubic-bezier(0.2, 0.8, 0.2, 1)", background:"linear-gradient(135deg, #050B14 0%, #111827 50%, #030712 100%)",color:"#fff",position:"relative",overflow:"hidden",fontFamily:"'Exo 2', sans-serif"}}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Exo+2:wght@400;700;900&family=Space+Mono:wght@400;700&display=swap');
        
        .stars {
          position: absolute;
          top: -50%; left: -50%; width: 200%; height: 200%;
          background: transparent url('https://www.transparenttextures.com/patterns/stardust.png') repeat top center;
          animation: starScroll 100s linear infinite;
          opacity: 0.3;
          z-index: 0;
          pointer-events: none;
        }
        @keyframes starScroll {
          from { transform: translateY(0); }
          to { transform: translateY(50%); }
        }
        @keyframes flamePulse {
          0% { transform: scaleY(1); opacity: 0.8; }
          100% { transform: scaleY(1.8); opacity: 1; filter: blur(2px); }
        }
        @keyframes shipHover {
          0% { transform: translateY(0px) scale(1, 1); }
          50% { transform: translateY(-8px) scale(0.95, 1.05); }
          100% { transform: translateY(0px) scale(1, 1); }
        }
        @keyframes elasticBob {
          0% { transform: translateY(0px) scale(1, 1); }
          33% { transform: translateY(-6px) scale(0.9, 1.1); }
          66% { transform: translateY(6px) scale(1.1, 0.9); }
          100% { transform: translateY(0px) scale(1, 1); }
        }
        @keyframes elasticBoss {
          0% { transform: translateY(0px) scale(1.5, 1.5); }
          50% { transform: translateY(8px) scale(1.55, 1.45); }
          100% { transform: translateY(0px) scale(1.5, 1.5); }
        }
        @keyframes elasticFast {
          0% { transform: scale(1, 1) rotate(180deg); }
          50% { transform: scale(0.85, 1.15) rotate(180deg); }
          100% { transform: scale(1, 1) rotate(180deg); }
        }
        @keyframes wingFlap {
          0%, 100% { transform: scaleX(1); }
          50% { transform: scaleX(0.8); }
        }
        @keyframes floatUpFade {
          0% { transform: translate(-50%, 0) scale(0.8); opacity: 1; }
          100% { transform: translate(-50%, -60px) scale(1.2); opacity: 0; }
        }
        @keyframes levelUpAnim {
          0% { transform: translate(-50%, -20px) scale(0.5); opacity: 0; }
          20% { transform: translate(-50%, -50%) scale(1.2); opacity: 1; filter: drop-shadow(0 0 20px rgba(251,191,36,0.8)); }
          80% { transform: translate(-50%, -50%) scale(1); opacity: 1; filter: drop-shadow(0 0 10px rgba(251,191,36,0.5)); }
          100% { transform: translate(-50%, -80px) scale(0.8); opacity: 0; }
        }
        .glass-panel {
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
        }
        .mobile-input-only {
          position: absolute;
          opacity: 0;
          width: 1px;
          height: 1px;
          top: 30%;
          left: 50%;
          z-index: -1;
          pointer-events: none;
        }
      `}</style>
      <div className="stars"></div>
      
      {/* Header Info */}
      <div style={{padding:"20px",display:"flex",justifyContent:"space-between",alignItems:"flex-start",position:"relative",zIndex:30,gap:"10px"}}>
        <div style={{display:"flex",gap:8,flexWrap:"wrap",maxWidth:"75%"}}>
          <button className="tap" onClick={() => { stopBgm(); onNav("arena"); }} style={{background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.3)", padding: "8px 12px", borderRadius: "99px", display: "flex", alignItems: "center", gap: 6, cursor: "pointer", boxShadow: "0 4px 12px rgba(0,0,0,0.04)", flexShrink: 0, color: "#fff", fontWeight: 800, fontSize: 13}}>
            ◀ {gs?.lang === 'en' ? "BACK" : "KEMBALI"}
          </button>
          <button className="tap" onClick={() => { setMuted(toggleMute()); }} style={{background:"rgba(255,255,255,.1)",border:"none",color:"#fff",width:36,height:36,borderRadius:"50%",display:"flex",justifyContent:"center",alignItems:"center",fontSize:16}}>
            {muted ? "🔇" : "🔊"}
          </button>
          {isPlaying && !gameOver && (
            <button className="tap" onClick={() => setIsPaused(!isPaused)} style={{background: isPaused ? "#10B981" : "rgba(255,255,255,.1)",border:"none",color:"#fff",width:36,height:36,borderRadius:"50%",display:"flex",justifyContent:"center",alignItems:"center",fontSize:16}}>
              {isPaused ? "▶" : "⏸"}
            </button>
          )}
        </div>
        <div style={{textAlign:"right", flexShrink:0}}>
          <div style={{fontSize:12,color:"#94A3B8"}}>LEVEL {level}</div>
          <div style={{fontSize:20,fontWeight:900,color:"#38BDF8"}}>SCORE: {score}</div>
        </div>
      </div>

      {!isPlaying && !gameOver && (
        <div style={{position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, zIndex: 20}}>
          <CoinAnnouncement 
            show={showCoinInfo} 
            onClose={() => setShowCoinInfo(false)} 
            title={gs?.lang === 'en' ? "Vocab Defender Coin Rules" : "Aturan Koin Vocab Defender"} 
            isEn={gs?.lang === 'en'}
            rules={gs?.lang === 'en' ? [
              "1 Coin is earned for every 500 points scored.",
              "The maximum coins you can earn per day from this game is 3 Coins.",
              "Limits reset every day."
            ] : [
              "1 Koin didapatkan untuk setiap kelipatan 500 Poin.",
              "Batas maksimal koin yang bisa didapatkan dari game ini adalah 3 Koin per hari.",
              "Limit akan di-reset setiap hari."
            ]} 
          />
          <div className="glass-panel" style={{width: "100%", maxWidth: 400, textAlign: "center", padding: "40px 20px", borderRadius: 24, animation: "fadeUp 0.5s ease-out"}}>
            <div style={{marginBottom:16, display:"inline-block", position:"relative"}}>
              <svg width="100" height="100" viewBox="0 0 100 100" fill="none" style={{animation:"elasticBob 2s infinite ease-in-out", transformOrigin:"center"}}>
                <defs>
                  <radialGradient id="ufoDomeStart" cx="50%" cy="30%" r="50%">
                    <stop offset="0%" stopColor="#6EE7B7"/>
                    <stop offset="100%" stopColor="#059669"/>
                  </radialGradient>
                  <linearGradient id="ufoMetalStart" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#94A3B8"/>
                    <stop offset="50%" stopColor="#475569"/>
                    <stop offset="100%" stopColor="#1E293B"/>
                  </linearGradient>
                </defs>
                <ellipse cx="50" cy="40" rx="25" ry="30" fill="url(#ufoDomeStart)" filter="drop-shadow(0 0 15px rgba(16,185,129,0.5))" />
                <ellipse cx="50" cy="25" rx="10" ry="5" fill="#FFFFFF" opacity="0.6" />
                <g style={{animation:"wingFlap 1s infinite ease-in-out", transformOrigin:"center"}}>
                  <ellipse cx="50" cy="60" rx="45" ry="15" fill="url(#ufoMetalStart)" />
                  <ellipse cx="50" cy="58" rx="42" ry="12" fill="none" stroke="#CBD5E1" strokeWidth="2" opacity="0.5" />
                  <circle cx="20" cy="60" r="4" fill="#10B981" filter="drop-shadow(0 0 5px #10B981)" />
                  <circle cx="40" cy="65" r="4" fill="#10B981" filter="drop-shadow(0 0 5px #10B981)" />
                  <circle cx="60" cy="65" r="4" fill="#10B981" filter="drop-shadow(0 0 5px #10B981)" />
                  <circle cx="80" cy="60" r="4" fill="#10B981" filter="drop-shadow(0 0 5px #10B981)" />
                </g>
              </svg>
            </div>
            <h1 style={{fontSize:36,fontWeight:900,color:"#38BDF8",marginBottom:16,letterSpacing:2,textShadow:"0 0 20px rgba(56,189,248,0.5)"}}>VOCAB DEFENDER</h1>
            <p style={{fontSize:16,color:"#94A3B8",lineHeight:1.6,marginBottom:32}}>
              {gs?.lang === 'en' ? "Type English vocabularies as fast as possible to shoot down enemy ships!" : "Ketik kosakata bahasa Inggris secepat mungkin untuk menembak jatuh pesawat musuh!"}
            </p>
            <div style={{background:"rgba(0,0,0,0.3)",padding:"16px",borderRadius:16,marginBottom:32}}>
              <div style={{fontSize:13,color:"#CBD5E1",marginBottom:8}}>{gs?.lang === 'en' ? "Starting level:" : "Level awal:"} <b>{gs?.lang === 'en' ? "Daily Vocabulary" : "Kosakata Keseharian"}</b></div>
              <div style={{fontSize:13,color:"#CBD5E1",marginBottom:16}}>{gs?.lang === 'en' ? "Final level:" : "Level akhir:"} <b>{gs?.lang === 'en' ? "Business & Startup Vocabulary" : "Kosakata Bisnis & Startup"}</b></div>
              <button className="tap" onClick={() => setShowCoinInfo(true)} style={{background: "#FEF3C7", color: "#D97706", border: "none", padding: "6px 14px", borderRadius: 99, fontSize: 12, fontWeight: 800, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6}}>
                ℹ️ {gs?.lang === 'en' ? "View Coin Rules" : "Lihat Aturan Koin"}
              </button>
            </div>
            <button className="tap" onClick={startGame} style={{background:"linear-gradient(135deg, #38BDF8, #0EA5E9)",color:"#0F172A",border:"none",padding:"16px 40px",borderRadius:99,fontSize:20,fontWeight:900,boxShadow:"0 10px 25px rgba(56,189,248,0.5)",transition:"all 0.2s"}}>
              START GAME 🚀
            </button>
          </div>
        </div>
      )}

      {gameOver && (
        <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",textAlign:"center",width:"90%",background:"var(--bg-card)",padding:30,borderRadius:24,boxShadow:"0 10px 40px rgba(0,0,0,.5)",zIndex:50}}>
          <div style={{fontSize:50,marginBottom:10}}>{hp <= 0 ? "💥" : "🏆"}</div>
          <h2 style={{fontSize:24,fontWeight:900,color:hp <= 0 ? "#EF4444" : "#10B981",marginBottom:10,fontFamily:"Exo 2"}}>
            {hp <= 0 ? "MISSION FAILED" : "BOSS DEFEATED!"}
          </h2>
          <div style={{fontSize:18,color:"var(--text-main)",marginBottom:8}}>Final Score: <b>{score}</b></div>
          <div style={{fontSize:14,color:"#F59E0B",fontWeight:800,marginBottom:24}}>+{Math.floor(score/500)} SmartCoins <img src="/coin.png" style={{width:"1.1em", height:"1.1em", verticalAlign:"middle", margin:"0 2px", position:"relative", top:"-2px", borderRadius:"50%", objectFit:"cover"}} alt="coin"/></div>
          
          <button className="tap" onClick={startGame} style={{background:"#38BDF8",color:"#0F172A",border:"none",width:"100%",padding:"14px",borderRadius:16,fontSize:16,fontWeight:900,marginBottom:12}}>{gs?.lang === 'en' ? "PLAY AGAIN" : "MAIN LAGI"}</button>
          <button className="tap" onClick={()=>onNav("arena")} style={{background:"rgba(255,255,255,.1)",color:"var(--text-main)",border:"none",width:"100%",padding:"14px",borderRadius:16,fontSize:14,fontWeight:800}}>{gs?.lang === 'en' ? "BACK TO ARENA" : "KEMBALI KE ARENA"}</button>
        </div>
      )}

      {/* Game Area */}
      {isPlaying && (
        <div 
          className="game-area-wrapper"
          style={{position:"absolute",top:80,bottom:0,left:0,right:0}}
          onClick={() => inputRef.current && inputRef.current.focus()}
        >
          
          {/* Hearts / HP */}
          <div style={{position:"absolute",top:0,left:20,display:"flex",gap:4,fontSize:20}}>
            {Array.from({length: 5}).map((_, i) => (
              <span key={i} style={{opacity: i < hp ? 1 : 0.2, filter: i < hp ? "none" : "grayscale(1)"}}>❤️</span>
            ))}
          </div>

          {/* Level Up Notification */}
          {levelUpMsg && (
            <div style={{
              position:"absolute",top:"40%",left:"50%",
              zIndex: 45, textAlign:"center", animation:"levelUpAnim 2s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards",
              pointerEvents:"none"
            }}>
              <div style={{fontSize:48, fontWeight:900, color:"#FBBF24", textShadow:"0 0 20px rgba(251,191,36,1)", fontFamily:"Exo 2"}}>
                LEVEL {level}!
              </div>
              <div style={{fontSize:16, fontWeight:800, color:"#fff", textShadow:"0 2px 4px rgba(0,0,0,0.8)", letterSpacing:2}}>SPEED UP 🚀</div>
            </div>
          )}

          {/* Pause Overlay */}
          {isPaused && (
            <div style={{position:"absolute",top:0,left:0,right:0,bottom:0,background:"rgba(15,23,42,0.8)",zIndex:50,display:"flex",justifyContent:"center",alignItems:"center",backdropFilter:"blur(4px)"}}>
              <div style={{textAlign:"center"}}>
                <div style={{fontSize:60,marginBottom:10}}>⏸</div>
                <h2 style={{fontSize:32,fontWeight:900,color:"#fff",fontFamily:"Exo 2",letterSpacing:4}}>PAUSED</h2>
                <button className="tap" onClick={() => setIsPaused(false)} style={{marginTop:20,background:"#38BDF8",color:"#0F172A",border:"none",padding:"12px 32px",borderRadius:99,fontSize:16,fontWeight:900}}>{gs?.lang === 'en' ? "RESUME" : "LANJUTKAN"}</button>
              </div>
            </div>
          )}

          {/* Boss HP Bar */}
          {level === 21 && bossHp > 0 && (
            <div style={{position:"absolute",top:30,left:"50%",transform:"translateX(-50%)",width:"60%",textAlign:"center"}}>
              <div style={{fontSize:10,fontWeight:800,color:"#EF4444",marginBottom:4}}>{gs?.lang === 'en' ? "ALIEN BOSS HP" : "BOSS ALIEN HP"}</div>
              <div style={{height:8,background:"rgba(255,255,255,.1)",borderRadius:99,overflow:"hidden"}}>
                <div style={{width:`${(bossHp/10)*100}%`,height:"100%",background:"#EF4444",transition:"width .2s"}}/>
              </div>
            </div>
          )}

          {/* Target HUD (Current Typed Word) */}
          {activeId && (
            <div style={{position:"absolute",bottom:110,left:"50%",transform:"translateX(-50%)",textAlign:"center",zIndex:30}}>
              {(() => {
                const target = enemies.find(e => e.id === activeId);
                if (!target) return null;
                return (
                  <div className="glass-panel" style={{
                    fontSize: 28,
                    fontWeight: 900,
                    letterSpacing: 4,
                    padding: "10px 24px",
                    borderRadius: 20,
                    border: "2px solid #EF4444",
                    boxShadow: "0 8px 32px rgba(239,68,68,0.5)",
                    animation: "fadeUp 0.2s ease"
                  }}>
                    <span style={{color:"#fff",textShadow:"0 0 15px #fff"}}>{target.word.substring(0, target.typed)}</span>
                    <span style={{color:"#475569"}}>{target.word.substring(target.typed)}</span>
                  </div>
                );
              })()}
            </div>
          )}

          {/* Player Ship */}
          {(() => {
            let targetX = 50;
            if (activeId) {
              const t = enemies.find(e => e.id === activeId);
              if (t) targetX = t.x;
            }
            return (
              <div style={{
                position:"absolute",
                bottom: recoil ? 75 : 85,
                left:`${targetX}%`,
                transform:`translateX(-50%) scale(${recoil ? 1.15 : 1})`,
                display:"flex",
                flexDirection:"column",
                alignItems:"center",
                zIndex:20,
                transition: "left 0.15s ease-out, bottom 0.15s ease-out, transform 0.15s ease-out"
              }}>
                <div style={{
                  marginBottom:-8,
                  zIndex: 2,
                  display: "flex",
                  justifyContent: "center"
                }}>
                  <svg width="90" height="90" viewBox="0 0 100 100" fill="none" style={{
                    animation: recoil ? "none" : "shipHover 1.5s infinite ease-in-out",
                    transformOrigin: "bottom center",
                    transform: recoil ? "scale(1.15, 0.85) translateY(10px)" : "scale(1, 1) translateY(0px)",
                    transition: "transform 0.1s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
                  }}>
                    <defs>
                      <linearGradient id="metal" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#E2E8F0" />
                        <stop offset="50%" stopColor="#94A3B8" />
                        <stop offset="100%" stopColor="#475569" />
                      </linearGradient>
                      <linearGradient id="darkMetal" x1="100%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#334155" />
                        <stop offset="100%" stopColor="#0F172A" />
                      </linearGradient>
                      <radialGradient id="cyanGlow" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#38BDF8" stopOpacity="1" />
                        <stop offset="100%" stopColor="#0284C7" stopOpacity="0" />
                      </radialGradient>
                      <linearGradient id="glass" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#7DD3FC" />
                        <stop offset="100%" stopColor="#0284C7" />
                      </linearGradient>
                    </defs>
                    <circle cx="35" cy="80" r="15" fill="url(#cyanGlow)" />
                    <circle cx="65" cy="80" r="15" fill="url(#cyanGlow)" />
                    <path d="M50 15 L25 55 L20 85 L50 75 L80 85 L75 55 Z" fill="#000" opacity="0.5" filter="blur(4px)" />
                    <g style={{animation:"wingFlap 0.5s infinite ease-in-out", transformOrigin:"center"}}>
                      <path d="M50 15 L15 65 L20 85 L50 70 L80 85 L85 65 Z" fill="url(#darkMetal)" />
                      <path d="M50 15 L20 60 L15 65 L50 25 Z" fill="#F8FAFC" opacity="0.6" />
                    </g>
                    <path d="M50 10 L35 50 L30 80 L50 75 L70 80 L65 50 Z" fill="url(#metal)" stroke="#F8FAFC" strokeWidth="1" />
                    <path d="M50 10 L45 50 L50 75 L55 50 Z" fill="url(#darkMetal)" />
                    <path d="M50 10 L48 50 L50 75 Z" fill="#F8FAFC" opacity="0.8" />
                    <ellipse cx="50" cy="45" rx="8" ry="18" fill="url(#glass)" stroke="#38BDF8" strokeWidth="1.5" />
                    <ellipse cx="50" cy="35" rx="3" ry="6" fill="#FFFFFF" opacity="0.8" />
                    <rect x="30" y="75" width="10" height="12" rx="2" fill="url(#darkMetal)" />
                    <rect x="60" y="75" width="10" height="12" rx="2" fill="url(#darkMetal)" />
                  </svg>
                </div>
                
                {/* Engine Flame Core */}
                <div style={{
                  width:14,height:30,
                  background:"linear-gradient(to bottom, #FFFFFF, #FBBF24, #EF4444, transparent)",
                  borderRadius:"50%",
                  animation:"flamePulse .15s infinite alternate",
                  boxShadow: "0 5px 15px rgba(239,68,68,0.8)",
                  zIndex: 1
                }}/>
                
                {/* Glow under ship */}
                <div style={{width:40,height:12,background:"rgba(56,189,248,0.5)",borderRadius:"50%",marginTop:-10,filter:"blur(6px)",zIndex:0}}/>
              </div>
            );
          })()}

          {/* Lasers / Bullets */}
          {lasers.map(l => (
            <React.Fragment key={l.id}>
              <style>{`
                @keyframes shoot-${l.id} {
                  0% { top: 85%; opacity: 1; transform: translateX(-50%) scaleY(1); }
                  100% { top: ${l.yEnd}%; opacity: 0.2; transform: translateX(-50%) scaleY(1.5); }
                }
              `}</style>
              <div style={{
                position:"absolute",
                left:`${l.x}%`,
                width:8,
                height:28,
                background:"linear-gradient(to top, #38BDF8, #E0F2FE)",
                borderRadius:"50% 50% 4px 4px",
                boxShadow:"0 0 12px #38BDF8, 0 0 24px rgba(255,255,255,0.8)",
                zIndex:15,
                animation: `shoot-${l.id} 0.15s ease-out forwards`
              }}/>
            </React.Fragment>
          ))}

          {/* Translations Floating Text */}
          {translations.map(t => (
            <div key={t.id} style={{
              position:"absolute", left:`${t.x}%`, top:`${t.y}%`, transform:"translate(-50%, -100%)",
              color:"#10B981", fontWeight:900, fontSize: 16, textShadow:"0 2px 10px rgba(0,0,0,0.8)",
              background: "rgba(15,23,42,0.8)", padding: "4px 12px", borderRadius: 12, border: "1px solid #10B981",
              animation: "floatUpFade 2s ease-out forwards", zIndex: 40, pointerEvents: "none", whiteSpace: "nowrap"
            }}>
              {t.text}
            </div>
          ))}

          {/* Enemies */}
          {enemies.map(en => {
            const isTarget = en.id === activeId;
            return (
              <div key={en.id} style={{
                position:"absolute",
                left:`${en.x}%`,
                top:`${en.y}%`,
                transform:"translateX(-50%)",
                textAlign:"center",
                transition: en.isBoss ? "left 50ms linear" : "none", // Sync with 50ms game loop to prevent rubberbanding
                zIndex:10
              }}>
                <div style={{
                  filter: isTarget ? "drop-shadow(0 0 16px #EF4444)" : "drop-shadow(0 4px 6px rgba(0,0,0,.6))", 
                  transform: isTarget ? "scale(1.15)" : "scale(1)", 
                  transition: "all .2s cubic-bezier(0.34, 1.56, 0.64, 1)",
                  display: "flex",
                  justifyContent: "center"
                }}>
                  {en.isBoss ? (
                    <BossShip isTarget={isTarget} />
                  ) : en.isFast ? (
                    <FastShip isTarget={isTarget} />
                  ) : (
                    <NormalShip isTarget={isTarget} />
                  )}
                </div>
                {/* Alien thrust/beam */}
                {!en.isBoss && <div style={{width:8,height:8,background: en.isFast ? "rgba(245,158,11,.6)" : "rgba(16,185,129,.4)",borderRadius:"50%",margin:"-8px auto 4px",filter:"blur(2px)"}}/>}
                
                <div style={{
                  background: isTarget ? "linear-gradient(135deg, rgba(239,68,68,.3), rgba(185,28,28,.5))" : "linear-gradient(135deg, rgba(30,41,59,.8), rgba(15,23,42,.95))",
                  border: isTarget ? "1.5px solid #F87171" : "1px solid rgba(148,163,184,.3)",
                  padding:"6px 12px",
                  borderRadius:12,
                  marginTop:2,
                  fontSize: en.isBoss ? 16 : 14,
                  fontWeight:900,
                  letterSpacing:2,
                  boxShadow: isTarget ? "0 8px 20px rgba(239,68,68,.4)" : "0 4px 12px rgba(0,0,0,.4)",
                  backdropFilter: "blur(6px)",
                  transition: "all .2s ease",
                  whiteSpace: en.isBoss ? "pre-wrap" : "nowrap",
                  maxWidth: en.isBoss ? "250px" : "none",
                  wordBreak: "break-word"
                }}>
                  <span style={{color: isTarget ? "#fff" : "#10B981", textShadow: isTarget ? "0 0 8px #fff" : "none"}}>{en.word.substring(0, en.typed)}</span>
                  <span style={{color: isTarget ? "rgba(255,255,255,.9)" : "#94A3B8"}}>{en.word.substring(en.typed)}</span>
                </div>
              </div>
            );
          })}

        </div>
      )}

      {/* Input capture helper (for mobile keyboards) */}
      {isPlaying && (
        <input 
          ref={inputRef}
          className="mobile-input-only"
          value={mobileInput}
          onChange={(e) => {
            const val = e.target.value;
            if (val.length > 0) {
              handleChar(val[val.length - 1]);
              setMobileInput(""); // Reset input immediately
            }
          }}
          autoFocus 
          autoComplete="off" 
          autoCorrect="off" 
          spellCheck="false" 
        />
      )}
    </div>
  );
}
