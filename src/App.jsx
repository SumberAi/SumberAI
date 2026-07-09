import React, { useState, useEffect } from 'react';
import { auth, db } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';

import HomeScreen from './screens/HomeScreen';
import ArenaScreen from './screens/ArenaScreen';
import EnglishScreen from './screens/EnglishScreen';
import AcademyScreen from './screens/AcademyScreen';
import MarketScreen from './screens/MarketScreen';
import LoginScreen from './screens/LoginScreen';
import PricingScreen from './screens/PricingScreen';
import ProfileScreen from './screens/ProfileScreen';
import MemoryGameScreen from './screens/MemoryGameScreen';
import InterviewScreen from './screens/InterviewScreen';
import TypingShooterScreen from './screens/TypingShooterScreen';
import BoardGameScreen from './screens/BoardGameScreen';
import MitraScreen from './screens/MitraScreen';
import { TopBar, BottomNav } from './components/Shared';

export default function App() {
  const [nav, setNav] = useState(() => {
    if (typeof window !== 'undefined' && window.location.search.includes('mitra')) {
      return 'mitra';
    }
    return 'login';
  });
  const [isDark, setIsDark] = useState(false);
  
  // Game State
  const defaultGs = {
    lang: "id",
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
    petualanganDailyCoins: 0,
    petualanganResetDate: null,
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
    },
    voiceLimit: 3,
    voiceResetDate: null,
    playtimeMinutes: 0
  };

  const [gs, setGs] = useState(defaultGs);
  const [userUid, setUserUid] = useState(null);
  const [isDbLoaded, setIsDbLoaded] = useState(false);

  // Pantau Status Login Firebase
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (typeof window !== 'undefined' && window.location.search.includes('mitra')) {
        return; // Biarkan kasir tetap di halaman mitra
      }
      if (user) {
        setUserUid(user.uid);
        // Do not setNav("home") here yet. Wait for DB.
        setNav("loading");
      } else {
        setUserUid(null);
        setGs(defaultGs); // Reset state on logout
        setIsDbLoaded(false);
        setNav("login");
      }
    });
    return () => unsubscribeAuth();
  }, []);

  // Pantau Database Firestore secara Realtime jika sudah Login
  useEffect(() => {
    if (!userUid) return;
    
    const userRef = doc(db, "users", userUid);
    const unsubscribeDb = onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        
        // Logika Reset Voice Limit Harian (Dilakukan secara otomatis saat data dimuat)
        const today = new Date().toLocaleDateString('id-ID');
        const lastReset = data.voiceResetDate ? new Date(data.voiceResetDate).toLocaleDateString('id-ID') : null;
        
        let updatedData = { ...data };
        let needsDbUpdate = false;
        const now = Date.now();

        // Cek Kedaluwarsa Langganan PRO (30 Hari)
        if (updatedData.proStatus) {
           let proChanged = false;
           if (updatedData.proStatus.grammarExpiresAt && now > updatedData.proStatus.grammarExpiresAt) {
               updatedData.proStatus.grammar = false;
               updatedData.proStatus.grammarExpiresAt = null;
               proChanged = true;
           }
           if (updatedData.proStatus.englishExpiresAt && now > updatedData.proStatus.englishExpiresAt) {
               updatedData.proStatus.english = false;
               updatedData.proStatus.englishExpiresAt = null;
               proChanged = true;
           }
           if (proChanged) {
               updatedData.isPro = updatedData.proStatus.scholar || updatedData.proStatus.english || updatedData.proStatus.grammar;
               needsDbUpdate = true;
           }
        }

        if (today !== lastReset) {
          const isPro = updatedData.proStatus?.scholar || updatedData.proStatus?.english || updatedData.proStatus?.grammar;
          updatedData.voiceLimit = isPro ? 25 : 3;
          updatedData.voiceResetDate = new Date().getTime();
          needsDbUpdate = true;
        }

        updatedData.uid = userUid;
        setGs(prev => ({ ...prev, ...updatedData }));
        
        setIsDbLoaded(true);
        setNav(currentNav => currentNav === "loading" ? "home" : currentNav);

        if (needsDbUpdate) {
          setDoc(userRef, { 
            voiceLimit: updatedData.voiceLimit, 
            voiceResetDate: updatedData.voiceResetDate,
            proStatus: updatedData.proStatus,
            isPro: updatedData.isPro
          }, { merge: true }).catch(console.error);
        }
      } else {
        // If doc doesn't exist, it means user is brand new.
        // We can safely go to home and they will get the modal.
        setGs(prev => ({ ...prev, uid: userUid }));
        setIsDbLoaded(true);
        setNav(currentNav => currentNav === "loading" ? "home" : currentNav);
      }
    });
    
    return () => unsubscribeDb();
  }, [userUid]);

  // Pelacak Durasi Aktif (Playtime Tracker)
  useEffect(() => {
    if (!userUid) return;

    let unsavedMinutes = 0;
    
    const interval = setInterval(() => {
      unsavedMinutes += 1;
      
      // Update state lokal setiap menit agar UI bisa bereaksi (opsional)
      setGs(prev => ({ ...prev, playtimeMinutes: (prev.playtimeMinutes || 0) + 1 }));

      // Simpan ke Firestore setiap 5 menit untuk menghemat kuota Write
      if (unsavedMinutes >= 5) {
        setGs(prev => {
          setDoc(doc(db, "users", userUid), { playtimeMinutes: prev.playtimeMinutes }, { merge: true });
          return prev;
        });
        unsavedMinutes = 0;
      }
    }, 60000); // 1 menit

    // Simpan sisa menit ke Firestore saat pengguna menutup Tab browser atau pindah aplikasi
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && unsavedMinutes > 0) {
        setGs(prev => {
          setDoc(doc(db, "users", userUid), { playtimeMinutes: prev.playtimeMinutes }, { merge: true });
          return prev;
        });
        unsavedMinutes = 0;
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (unsavedMinutes > 0) {
        setGs(prev => {
          setDoc(doc(db, "users", userUid), { playtimeMinutes: prev.playtimeMinutes }, { merge: true });
          return prev;
        });
      }
    };
  }, [userUid]);

  // Simpan progress secara otomatis ke Firestore setiap kali `gs` diubah lokal
  // (Debounce bisa ditambahkan nanti, untuk sekarang langsung tulis)
  useEffect(() => {
    if (userUid && gs.name !== "Siswa") {
      const saveToDb = async () => {
        try {
          await setDoc(doc(db, "users", userUid), gs, { merge: true });
        } catch (e) {
          console.error("Gagal menyimpan ke Firestore:", e);
        }
      };
      
      // Mencegah infinite loop dengan memastikan update tidak berasal dari onSnapshot langsung
      // Cara aman: kita tidak otomatis nge-save seluruh objek setiap ada re-render, 
      // tetapi fungsi helper di bawah ini (addCoins, addXP, dll) yang harus update state & db secara sadar.
    }
  }, [gs, userUid]);

  useEffect(() => {
    if (isDark) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [isDark]);

  // Fix scroll position saat pindah halaman
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [nav]);

  const updateDb = async (newData) => {
    if (!userUid) return;
    try {
      await setDoc(doc(db, "users", userUid), newData, { merge: true });
    } catch(e) {
      console.error(e);
    }
  };

  const handleClaimStarter = () => {
    setGs(prev => {
      const newGs = { ...prev, coins: prev.coins + 50, hasClaimedStarter: true };
      updateDb(newGs);
      return newGs;
    });
  };

  const upgradeToPro = (type) => {
    setGs(p => {
      let newCoins = p.coins;
      if (type === 'scholar' && !p.proStatus?.scholar) {
        newCoins += 1500;
        alert(p.lang === 'en' ? "Successfully upgraded to AI Academy PRO! You get a bonus of 1500 Coins." : "Berhasil langganan AI Academy PRO! Anda mendapatkan bonus 1500 Koin.");
      }
      const newGs = {
        ...p, 
        coins: newCoins,
        proStatus: { ...p.proStatus, [type]: true }
      };
      updateDb(newGs);
      return newGs;
    });
  };

  const addCoins = (amt) => {
    setGs(p => {
      const newGs = { ...p, coins: p.coins + amt };
      updateDb({ coins: newGs.coins });
      return newGs;
    });
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
      const newGs = { ...p, xp: nxp, level: nlv, xpNext: nxpNext, battlesWon: p.battlesWon + 1 };
      updateDb({ xp: nxp, level: nlv, xpNext: nxpNext, battlesWon: newGs.battlesWon });
      return newGs;
    });
  };

  const spendCoins = (amt) => {
    setGs(p => {
      const newGs = { ...p, coins: Math.max(0, p.coins - amt), redeemed: p.redeemed + 1 };
      updateDb({ coins: newGs.coins, redeemed: newGs.redeemed });
      return newGs;
    });
  };

  // Render current screen based on nav
  const addBasicChatCount = () => {
    setGs(prev => {
      const newGs = { ...prev, basicChatCount: (prev.basicChatCount || 0) + 1 };
      updateDb({ basicChatCount: newGs.basicChatCount });
      return newGs;
    });
  };

  const claimStarter = () => {
    setGs(p => {
      const newGs = { ...p, coins: p.coins + 50, hasClaimedStarter: true };
      updateDb({ coins: newGs.coins, hasClaimedStarter: true });
      return newGs;
    });
  };

  const handleTutorBonus = () => {
    setGs(p => {
      const now = new Date().getTime();
      const newGs = { ...p, coins: p.coins + 20, tutorDailyBonusDate: now };
      updateDb({ coins: newGs.coins, tutorDailyBonusDate: now });
      return newGs;
    });
  };

  // Fungsi proxy untuk mencegat setGs dari komponen anak
  // dan otomatis menyimpannya ke Firestore secara real-time
  const updateGameState = (updater) => {
    setGs(prev => {
      const nextState = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater };
      updateDb(nextState);
      return nextState;
    });
  };

  const handleNav = (target) => {
    if (target === "pricing") {
      // Deteksi apakah sedang berjalan di dalam APK/Native app
      const isNative = typeof window !== 'undefined' && window.Capacitor?.isNativePlatform?.();
      if (isNative) {
        alert(gs.lang === 'en' ? "Premium (PRO) purchases are currently only available through our official website in your browser (sumberai.com) in compliance with Google Play Store policies." : "Pembelian paket Premium (PRO) saat ini hanya tersedia melalui website resmi kami di browser (sumberai.com) sesuai dengan kebijakan Google Play Store.");
        return;
      }
    }
    setNav(target);
  };

  let ScreenComponent;
  switch (nav) {
    case "home": ScreenComponent = <HomeScreen gs={gs} setGs={updateGameState} onNav={handleNav} onClaimStarter={claimStarter} />; break;
    case "arena": ScreenComponent = <ArenaScreen gs={gs} onXPEarned={addXP} onNav={handleNav} />; break;
    case "english": ScreenComponent = <EnglishScreen gs={gs} setGs={updateGameState} onCoinEarned={addCoins} onXPEarned={addXP} onNav={handleNav} />; break;
    case "academy": ScreenComponent = <AcademyScreen gs={gs} onCoinEarned={addCoins} onXPEarned={addXP} onNav={handleNav} upgradeToPro={upgradeToPro} />; break;
    case "interview_pro": ScreenComponent = <InterviewScreen gs={gs} setGs={updateGameState} onNav={handleNav} onCoinEarned={addCoins} onXPEarned={addXP} onChatUsed={addBasicChatCount} onTutorBonus={handleTutorBonus} />; break;
    case "market": ScreenComponent = <MarketScreen gs={gs} spendCoins={spendCoins} onNav={handleNav} userUid={userUid} />; break;
    case "mitra": ScreenComponent = <MitraScreen />; break;
    case "pricing": ScreenComponent = <PricingScreen gs={gs} onNav={handleNav} upgradeToPro={upgradeToPro} />; break;
    case "profile": ScreenComponent = <ProfileScreen gs={gs} setGs={updateGameState} onNav={handleNav} isDark={isDark} />; break;
    case "memory": ScreenComponent = <MemoryGameScreen gs={gs} setGs={updateGameState} onNav={handleNav} onCoinEarned={addCoins} />; break;
    case "typing": ScreenComponent = <TypingShooterScreen gs={gs} setGs={updateGameState} onNav={handleNav} onCoinEarned={addCoins} />; break;
    case "board": ScreenComponent = <BoardGameScreen gs={gs} onNav={handleNav} onCoinEarned={addCoins} onXPEarned={addXP} />; break;
    case "login": ScreenComponent = <LoginScreen onLogin={(userData)=>{ 
      // Karena onAuthStateChanged otomatis memanggil setNav("home") dan update gs, kita kosongkan saja callback ini.
    }} />; break;
    case "loading": ScreenComponent = <div style={{height:"100vh", display:"flex", justifyContent:"center", alignItems:"center", color:"#fff"}}>Loading profile...</div>; break;
    default: ScreenComponent = <HomeScreen gs={gs} onNav={handleNav} onClaimStarter={handleClaimStarter} />;
  }

  // Khusus untuk game Typing/Board, kita hide TopBar/BottomNav agar fullscreen
  const isFullscreen = nav === "typing" || nav === "board" || nav === "login" || nav === "pricing" || nav === "mitra";

  return (
    <ErrorBoundary>
      <div style={{maxWidth: 430, margin: "0 auto", background: "var(--bg-main)", minHeight: "100dvh", position: "relative", boxShadow: "0 0 40px rgba(0,0,0,.1)", overflowX: "hidden", display: "flex", flexDirection: "column"}}>
        {!isFullscreen && <TopBar gs={gs} onLogo={() => setNav("home")} onNav={setNav} isDark={isDark} setIsDark={setIsDark} />}
        <div style={{flex: 1, paddingBottom: !isFullscreen ? 80 : 0}}>
          {ScreenComponent}
        </div>
        {!isFullscreen && <BottomNav gs={gs} active={nav} onNav={setNav} />}
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