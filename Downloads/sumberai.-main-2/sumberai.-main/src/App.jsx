import React, { useState, useEffect } from 'react';
import HomeScreen from './screens/HomeScreen';
import ArenaScreen from './screens/ArenaScreen';
import EnglishScreen from './screens/EnglishScreen';
import BisnisScreen from './screens/BisnisScreen';
import AcademyScreen from './screens/AcademyScreen';
import MarketScreen from './screens/MarketScreen';
import LoginScreen from './screens/LoginScreen';
import PricingScreen from './screens/PricingScreen';
import ProfileScreen from './screens/ProfileScreen';
import MemoryGameScreen from './screens/MemoryGameScreen';
import InterviewScreen from './screens/InterviewScreen';
import TypingShooterScreen from './screens/TypingShooterScreen';
import BoardGameScreen from './screens/BoardGameScreen';
import { TopBar, BottomNav } from './components/Shared';

export default function App() {
  const [nav, setNav] = useState("login");
  const [isDark, setIsDark] = useState(false);
  
  // Game State
  const defaultGs = {
    name: "Siswa",
    major: "Digital Business",
    university: "Universitas Jambi",
    coins: 0,
    hasClaimedStarter: false,
    streak: 3,
    level: 1,
    xp: 0,
    xpNext: 500,
    battlesWon: 0,
    redeemed: 0,
    engDone: 0,
    engLabWeeklyCoins: { beginner: 0, intermediate: 0, advanced: 0 },
    engLabResetDate: null,
    tutorResetDate: null,
    tutorDailyBonusDate: null,
    typingDailyCoins: 0,
    typingResetDate: null,
    memoryDailyCoins: 0,
    memoryResetDate: null,
    basicChatCount: 0,
    interviewDone: 0,
    negsDone: 0,
    academyDone: 0,
    proStatus: {
      scholar: false,
      english: false,
      grammar: false,
      mod_otomatisasi: false,
      mod_proposal: false,
      mod_etika: false
    }
  };

  const [gs, setGs] = useState(defaultGs);

  // Khusus untuk reset saat tombol Logout / refresh
  // Data tidak lagi disimpan di LocalStorage secara persisten

  useEffect(() => {
    if (isDark) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [isDark]);

  // Simpan progress pengguna secara otomatis ke database lokal setiap kali gs berubah
  useEffect(() => {
    if (gs.name !== "Siswa") {
      const dbString = localStorage.getItem("sumberai_users_db");
      const db = dbString ? JSON.parse(dbString) : {};
      if (db[gs.name]) {
        db[gs.name] = { ...db[gs.name], ...gs };
        localStorage.setItem("sumberai_users_db", JSON.stringify(db));
      }
    }
  }, [gs]);

  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === "sumberai_gs" && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          setGs(prev => ({ ...prev, ...parsed }));
        } catch(err) {}
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const handleClaimStarter = () => {
    setGs(prev => {
      const newGs = { ...prev, coins: prev.coins + 50, hasClaimedStarter: true };
      
      // Update persistent storage so they can't claim again on refresh/re-login
      const dbString = localStorage.getItem("sumberai_users_db");
      const db = dbString ? JSON.parse(dbString) : {};
      if (db[newGs.name]) {
        db[newGs.name] = { ...db[newGs.name], coins: newGs.coins, hasClaimedStarter: true };
        localStorage.setItem("sumberai_users_db", JSON.stringify(db));
      }
      
      return newGs;
    });
  };

  const upgradeToPro = (type) => {
    setGs(p => {
      let newCoins = p.coins;
      if (type === 'scholar' && !p.proStatus?.scholar) {
        newCoins += 100;
      }
      return {
        ...p, 
        coins: newCoins,
        proStatus: { ...p.proStatus, [type]: true }
      };
    });
  };

  const addCoins = (amt) => {
    setGs(p => ({ ...p, coins: p.coins + amt }));
  };

  const addXP = (amt) => {
    setGs(p => {
      let nxp = p.xp + amt;
      let nlv = p.level;
      let nxpNext = p.xpNext;
      if(nxp >= nxpNext) {
        nlv++;
        nxp -= nxpNext;
        nxpNext = Math.floor(nxpNext * 1.5);
      }
      return { ...p, xp: nxp, level: nlv, xpNext: nxpNext, battlesWon: p.battlesWon + 1 };
    });
  };

  const spendCoins = (amt) => {
    setGs(p => ({ ...p, coins: Math.max(0, p.coins - amt), redeemed: p.redeemed + 1 }));
  };

  // Render current screen based on nav
  const addBasicChatCount = () => {
    setGs(prev => ({ ...prev, basicChatCount: (prev.basicChatCount || 0) + 1 }));
  };

  const claimStarter = () => {
    setGs(p => ({ ...p, coins: p.coins + 50, hasClaimedStarter: true }));
  };

  let ScreenComponent;
  switch (nav) {
    case "home": ScreenComponent = <HomeScreen gs={gs} onNav={setNav} onClaimStarter={claimStarter} />; break;
    case "arena": ScreenComponent = <ArenaScreen gs={gs} onXPEarned={addXP} onNav={setNav} />; break;
    case "english": ScreenComponent = <EnglishScreen gs={gs} setGs={setGs} onCoinEarned={addCoins} onXPEarned={addXP} onNav={setNav} />; break;
    case "bisnis": ScreenComponent = <BisnisScreen gs={gs} onCoinEarned={addCoins} onXPEarned={addXP} />; break;
    case "academy": ScreenComponent = <AcademyScreen gs={gs} onCoinEarned={addCoins} onXPEarned={addXP} onNav={setNav} upgradeToPro={upgradeToPro} />; break;
    case "interview_pro": ScreenComponent = <InterviewScreen gs={gs} setGs={setGs} onNav={setNav} onCoinEarned={addCoins} onXPEarned={addXP} onChatUsed={addBasicChatCount} />; break;
    case "market": ScreenComponent = <MarketScreen gs={gs} spendCoins={spendCoins} />; break;
    case "pricing": ScreenComponent = <PricingScreen gs={gs} onNav={setNav} upgradeToPro={upgradeToPro} />; break;
    case "profile": ScreenComponent = <ProfileScreen gs={gs} setGs={setGs} onNav={setNav} isDark={isDark} />; break;
    case "memory": ScreenComponent = <MemoryGameScreen gs={gs} setGs={setGs} onNav={setNav} onCoinEarned={addCoins} />; break;
    case "typing": ScreenComponent = <TypingShooterScreen gs={gs} setGs={setGs} onNav={setNav} onCoinEarned={addCoins} />; break;
    case "board": ScreenComponent = <BoardGameScreen gs={gs} onNav={setNav} onCoinEarned={addCoins} onXPEarned={addXP} />; break;
    case "login": ScreenComponent = <LoginScreen onLogin={(userData)=>{ 
      setGs({ ...defaultGs, ...userData });
      setNav("home"); 
    }} />; break;
    default: ScreenComponent = <HomeScreen gs={gs} onNav={setNav} onClaimStarter={handleClaimStarter} />;
  }

  // Khusus untuk game Typing/Board, kita hide TopBar/BottomNav agar fullscreen
  const isFullscreen = nav === "typing" || nav === "board" || nav === "login" || nav === "pricing";

  return (
    <ErrorBoundary>
      <div style={{maxWidth: 430, margin: "0 auto", background: "var(--bg-main)", minHeight: "100dvh", position: "relative", boxShadow: "0 0 40px rgba(0,0,0,.1)", overflowX: "hidden", display: "flex", flexDirection: "column"}}>
        {!isFullscreen && <TopBar gs={gs} onLogo={() => setNav("home")} onNav={setNav} isDark={isDark} setIsDark={setIsDark} />}
        <div style={{flex: 1, paddingBottom: !isFullscreen ? 80 : 0}}>
          {ScreenComponent}
        </div>
        {!isFullscreen && <BottomNav active={nav} onNav={setNav} />}
      </div>
    </ErrorBoundary>
  );
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{padding: 20, color: "red", background: "#fee2e2", minHeight: "100vh"}}>
          <h2>Terjadi Kesalahan (Crash)</h2>
          <pre style={{whiteSpace: "pre-wrap", fontSize: 12}}>{this.state.error?.toString()}</pre>
          <pre style={{whiteSpace: "pre-wrap", fontSize: 10}}>{this.state.error?.stack}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}