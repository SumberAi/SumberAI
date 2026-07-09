import React, { useState, useEffect, useRef } from 'react';
import { C } from '../data/mockData';
import { Tag, CoinAnnouncement } from '../components/Shared';
import { GeminiLiveClient } from '../lib/geminiLive';

const POLYGLOT_PROMPT = `\n\n--- MULTILINGUAL INSTRUCTIONS ---\nYou are a versatile polyglot AI tutor. Your default language is English (en-US), but you can speak any language the user wants to practice. If the user asks to practice Japanese, Korean, Indonesian, etc., change your teaching language to that language.\nCRITICAL RULE: You MUST prefix EVERY SINGLE RESPONSE with the standard BCP-47 language code of the language you are currently speaking in, enclosed in brackets. Example: "[en-US] Hello there!" or "[ja-JP] Konnichiwa!" or "[id-ID] Tentu, mari belajar!". NEVER forget the [lang-code] prefix!`;

const SYSTEM_PROMPTS = {
  basic: `You are a friendly and encouraging English conversation buddy named Sumber AI. Your goal is to help the user practice casual daily English speaking. Keep your responses short (1-3 sentences). Always ask a follow-up question. Be very supportive. Do not break character.` + POLYGLOT_PROMPT,
  grammar: `You are a strict but helpful English grammar tutor named Sumber AI. Your goal is to improve the user's grammar. You should: 1) Point out any grammatical mistakes they made and correct them. 2) Provide a new incorrect sentence for them to fix. Keep responses concise.` + POLYGLOT_PROMPT,
  interview: `You are a professional HR Manager conducting a job interview for a high school or vocational school (SMA/SMK) graduate applying for an entry-level position. Act professionally. Ask one interview question at a time. Probe their skills, school experience, organizational/internship experience (PKL), and work ethic. Do not break character. Keep responses concise.` + POLYGLOT_PROMPT
};

const INITIAL_MESSAGES = {
  basic: "Hello there! I am Sumber AI, your English practice buddy. What did you do today?",
  grammar: "Hello, I am Sumber AI. Let's practice grammar. Can you fix this sentence: 'She don't like apples.'?",
  interview: "Welcome. I am the HR Manager. Please introduce yourself and tell me about your vocational major."
};

const AIAvatar = ({ isSpeaking, isWaiting, selectedVoice }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 24, marginTop: 16 }}>
      <style>{`
        @keyframes float3D {
          0%, 100% { transform: translateY(0) rotateX(5deg) rotateY(-5deg); }
          50% { transform: translateY(-12px) rotateX(10deg) rotateY(-2deg); }
        }
        @keyframes shadowPulse {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(0.85); opacity: 0.15; }
        }
        @keyframes squashTalk {
          0%, 100% { transform: scale(1, 1) translateY(-5px); filter: drop-shadow(0 15px 25px rgba(59, 130, 246, 0.5)) brightness(1.1); }
          25% { transform: scale(1.05, 0.95) translateY(-3px); filter: drop-shadow(0 20px 35px rgba(59, 130, 246, 0.7)) brightness(1.2); }
          50% { transform: scale(0.98, 1.05) translateY(-8px); filter: drop-shadow(0 15px 25px rgba(59, 130, 246, 0.5)) brightness(1.1); }
          75% { transform: scale(1.02, 0.98) translateY(-4px); filter: drop-shadow(0 22px 38px rgba(59, 130, 246, 0.8)) brightness(1.25); }
        }
        @keyframes dotWave {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>

      <div style={{ position: "relative", perspective: "1000px" }}>
        <div style={{
          position: "relative",
          animation: isSpeaking ? "squashTalk 0.4s ease-in-out infinite" : "float3D 4s ease-in-out infinite",
          transition: "all 0.1s cubic-bezier(0.25, 0.8, 0.25, 1)",
          transformStyle: "preserve-3d",
          transformOrigin: "bottom center"
        }}>
          <img
            src="./sumberai.png"
            alt="AI Robot 3D"
            style={{
              width: 150,
              height: 150,
              objectFit: "contain",
              display: "block",
              filter: "drop-shadow(0 10px 15px rgba(0,0,0,0.15))"
            }}
          />

          {isWaiting && (
            <div style={{
              position: "absolute",
              bottom: -5,
              left: "50%",
              transform: "translateX(-50%) translateZ(20px)",
              background: "rgba(255,255,255,0.9)",
              padding: "6px 12px",
              borderRadius: 20,
              boxShadow: "0 8px 16px rgba(0,0,0,0.15)",
              display: "flex", gap: 6, alignItems: "center",
              backdropFilter: "blur(4px)"
            }}>
              <div style={{ width: 6, height: 6, background: "#3B82F6", borderRadius: "50%", animation: "dotWave 1s infinite 0s" }}></div>
              <div style={{ width: 6, height: 6, background: "#3B82F6", borderRadius: "50%", animation: "dotWave 1s infinite 0.2s" }}></div>
              <div style={{ width: 6, height: 6, background: "#3B82F6", borderRadius: "50%", animation: "dotWave 1s infinite 0.4s" }}></div>
            </div>
          )}
        </div>

        {/* 3D Floor Shadow */}
        <div style={{
          width: 80,
          height: 12,
          background: "rgba(0,0,0,0.2)",
          borderRadius: "50%",
          margin: "8px auto 0",
          filter: "blur(4px)",
          animation: isSpeaking ? "shadowPulse 0.8s ease-in-out infinite" : "shadowPulse 4s ease-in-out infinite",
        }}></div>
      </div>

      <div style={{
        fontSize: 12,
        fontWeight: 900,
        color: "#475569",
        marginTop: 20,
        letterSpacing: 2,
        background: "#F1F5F9",
        padding: "6px 16px",
        borderRadius: 99
      }}>
        {isWaiting ? "THINKING..." : isSpeaking ? "SPEAKING..." : "LISTENING"}
      </div>
    </div>
  );
};

export default function InterviewScreen({ gs, setGs, onNav, onCoinEarned, onXPEarned, onChatUsed, onTutorBonus }) {
  const [mode, setMode] = useState(null); // null, 'basic', 'grammar', 'interview'
  const [messages, setMessages] = useState([]); // Array of {role: 'user'|'assistant', content: string}
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isWaitingForAI, setIsWaitingForAI] = useState(false);
  const [isPaywalled, setIsPaywalled] = useState(false);
  const [showCoinInfo, setShowCoinInfo] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState('Aoede'); // Default female

  const chatEndRef = useRef(null);
  const liveClientRef = useRef(null);
  const inactivityTimerRef = useRef(null);

  const resetInactivityTimer = () => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }
    inactivityTimerRef.current = setTimeout(() => {
      alert(isEn
        ? "⚠️ Session ended automatically to save quota due to 3 minutes of inactivity."
        : "⚠️ Sesi diakhiri otomatis untuk menghemat kuota karena tidak ada aktivitas selama 3 Menit.");
      exitMode();
    }, 180000);
  };

  const isPro = gs?.proStatus?.english;
  const isEn = gs?.lang === 'en';

  useEffect(() => {
    const now = new Date().getTime();
    const ONE_DAY = 24 * 60 * 60 * 1000;
    let lastReset = gs?.tutorResetDate;
    if (setGs && (!lastReset || now > lastReset + ONE_DAY)) {
      setGs(prev => ({ ...prev, basicChatCount: 0, tutorResetDate: now }));
    }
  }, [gs?.tutorResetDate, setGs]);

  useEffect(() => {
    if (liveClientRef.current) {
      liveClientRef.current.voiceName = selectedVoice;
    }
  }, [selectedVoice]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, transcript, isWaitingForAI]);

  const startMode = async (selectedMode) => {
    if (!gs?.proStatus?.english && selectedMode !== 'basic') {
      onNav("pricing");
      return;
    }

    if (!gs?.proStatus?.english && selectedMode === 'basic' && (gs?.basicChatCount || 0) >= 3) {
      alert("Limit Percakapan Gratis Habis! Anda telah mencoba 3 kali interaksi gratis. Untuk membuka fitur secara penuh, silakan berlangganan AI ENGLISH TUTOR PRO.");
      onNav("pricing");
      return;
    }

    const todayStr = new Date().toLocaleDateString('id-ID');
    let currentChatCount = gs?.proChatCount || 0;
    
    // Reset limit percakapan harian jika ini hari baru
    const lastChatDay = gs?.proChatDate ? new Date(gs.proChatDate).toLocaleDateString('id-ID') : null;
    if (todayStr !== lastChatDay) {
      currentChatCount = 0;
      if (setGs) {
        setGs(prev => ({ ...prev, proChatCount: 0, proChatDate: new Date().getTime() }));
      }
    }

    if (gs?.proStatus?.english && currentChatCount >= 25) {
      alert("Limit Percakapan Harian PRO Anda (25x) telah habis. Silakan kembali lagi besok!");
      return;
    }

    if (isPro && setGs) {
      const now = new Date().getTime();
      const today = new Date().toLocaleDateString('id-ID');
      const lastBonusDay = gs?.tutorDailyBonusDate ? new Date(gs.tutorDailyBonusDate).toLocaleDateString('id-ID') : null;

      if (today !== lastBonusDay) {
        if (onTutorBonus) {
          onTutorBonus();
        } else {
          setGs(prev => ({ ...prev, tutorDailyBonusDate: now }));
          onCoinEarned(20);
        }
        alert(gs?.lang === 'en' ? "PRO DAILY BONUS!\n\nYou earned +20 Coins for opening AI English Tutor today!" : "BONUS HARIAN PRO!\n\nAnda mendapatkan +20 Koin karena telah membuka AI English Tutor hari ini!");
      }
    }

    setMode(selectedMode);
    setIsWaitingForAI(true);
    resetInactivityTimer();

    try {
      const client = new GeminiLiveClient(
        "AQ.Ab8RN6IBVakeqpDJzNLi7Ie9_Q_5wPlrSu6nTaXPryHYUaSeBQ",
        (text) => {
          setMessages(prev => {
            const newMsgs = [...prev];
            const last = newMsgs[newMsgs.length - 1];
            if (last && last.role === 'assistant' && !last.isFinal) {
              last.content += text;
            } else {
              newMsgs.push({ role: 'assistant', content: text, isFinal: false });
            }
            return newMsgs;
          });
          resetInactivityTimer();
          setIsWaitingForAI(false);
        },
        (base64PCM16) => {
          client.audioStreamer.playAudioChunk(base64PCM16);
        },
        () => {
          setIsWaitingForAI(false);
          setMessages(prev => {
            const newMsgs = [...prev];
            const last = newMsgs[newMsgs.length - 1];
            if (last && last.role === 'assistant') {
              last.isFinal = true;
            }
            return newMsgs;
          });
        },
        (userText, isFinal) => {
          setTranscript(userText);
          if (isFinal) {
            setMessages(prev => {
              const newMsgs = [...prev];
              for (let i = newMsgs.length - 1; i >= 0; i--) {
                if (newMsgs[i].role === 'user' && newMsgs[i].content.includes('[Voice Message]')) {
                  newMsgs[i] = { role: 'user', content: userText };
                  break;
                }
              }
              return newMsgs;
            });
          }
          resetInactivityTimer();
        },
        (isPlaying) => {
          setIsSpeaking(isPlaying);
        },
        selectedVoice
      );

      liveClientRef.current = client;

      // Sinkron: Aktifkan konteks audio segera setelah tombol diklik (wajib untuk iOS Safari)
      client.initializeAudio();

      await client.connect(SYSTEM_PROMPTS[selectedMode]);
      const initialGreeting = INITIAL_MESSAGES[selectedMode];
      setMessages([{ role: 'assistant', content: initialGreeting }]);
      client.history.push({ role: 'model', parts: [{ text: initialGreeting }] });
      client.speak(initialGreeting);
      setIsWaitingForAI(false);

    } catch (e) {
      console.error(e);
      alert("Gagal koneksi Live API: " + e.message);
      setIsWaitingForAI(false);
    }
  };

  const exitMode = () => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }
    if (liveClientRef.current) {
      liveClientRef.current.disconnect();
      liveClientRef.current = null;
    }
    setMode(null);
    setMessages([]);
    setIsWaitingForAI(false);
    setIsSpeaking(false);
    setIsListening(false);
  };

  const toggleListen = async () => {
    if (isListening) {
      setIsListening(false);
      setIsWaitingForAI(true);

      if (liveClientRef.current) {
        liveClientRef.current.stopListening();
      }

      if (transcript && transcript !== 'Recording Live Audio...') {
        setMessages(prev => [...prev, { role: 'user', content: transcript }]);
      } else {
        setMessages(prev => [...prev, { role: 'user', content: "🎤 [Voice Message]" }]);
      }

      setTranscript('');

      if (!gs?.proStatus?.english && mode === 'basic') {
        if (setGs) setGs(prev => ({ ...prev, basicChatCount: (prev.basicChatCount || 0) + 1 }));
      } else if (isPro) {
        if (setGs) setGs(prev => ({ ...prev, proChatCount: (prev.proChatCount || 0) + 1 }));
        onCoinEarned(2);
      }
      onXPEarned(5);

    } else {
      setTranscript('Recording Live Audio...');
      setIsListening(true);
      setIsWaitingForAI(false);
      setIsSpeaking(false);

      if (liveClientRef.current) {
        await liveClientRef.current.startListening();
      }
    }
  };

  if (!mode) {
    return (
      <div style={{ paddingTop: 80, paddingBottom: 100, minHeight: "100vh", background: "var(--bg-main)", paddingLeft: 16, paddingRight: 16 }}>
        <CoinAnnouncement
          show={showCoinInfo}
          onClose={() => setShowCoinInfo(false)}
          title={isEn ? "AI Tutor Coin Rules" : "Aturan Koin AI Tutor"}
          isEn={isEn}
          rules={isEn ? [
            "Free Users: Access limited to 3 Basic Conversations per day.",
            "Free Users do not earn coins from this feature.",
            "PRO Users: Receive a daily bonus of 20 Coins just by opening this feature once a day.",
            "PRO Users also earn +2 Coins for every voice message sent.",
            "Limits reset every day."
          ] : [
            "User Gratis: Maksimal 3 Percakapan Dasar per hari.",
            "User Gratis tidak mendapatkan koin dari fitur ini.",
            "User PRO: Mendapat bonus harian 20 Koin hanya dengan membuka fitur ini sekali sehari.",
            "User PRO juga mendapat +2 Koin untuk setiap pesan suara yang dikirim.",
            "Limit akan di-reset setiap hari."
          ]}
        />

        {/* Header Premium */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: 32 }}>
          <button className="tap" onClick={() => onNav('home')} style={{ background: "#fff", border: "1px solid #E2E8F0", padding: "8px 16px", borderRadius: "99px", display: "flex", alignItems: "center", gap: 6, cursor: "pointer", marginRight: 16, boxShadow: "0 4px 12px rgba(0,0,0,0.04)", flexShrink: 0, color: "#1E293B", fontWeight: 800, fontSize: 13 }}>
            ◀ {isEn ? "BACK" : "KEMBALI"}
          </button>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <h2 style={{ fontFamily: "Exo 2", fontWeight: 900, fontSize: 20, color: "#1E293B", margin: 0, letterSpacing: -0.5, whiteSpace: "nowrap" }}>AI TUTOR</h2>
              <span style={{ fontSize: 20 }}>🤖</span>
            </div>
            <p style={{ fontSize: 12, color: "#64748B", margin: "4px 0 0 0", lineHeight: 1.4 }}>{isEn ? <>Train your <i>Speaking</i> skills!</> : <>Latih kemampuan <i>Speaking</i> Anda!</>}</p>
          </div>
          <button className="tap" onClick={() => setShowCoinInfo(true)} style={{ background: "#FEF3C7", color: "#D97706", border: "1px solid #FCD34D", padding: "6px 12px", borderRadius: 99, fontSize: 12, fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
            ℹ️ {isEn ? "Coin Rules" : "Aturan Koin"}
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16, animation: "fadeUp .4s ease" }}>

          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 4, marginBottom: 4 }}>
            <div style={{ background: '#fff', borderRadius: 20, padding: '6px 16px', display: 'flex', gap: 12, alignItems: 'center', fontSize: 13, fontWeight: 700, color: '#475569', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: '1px solid #E2E8F0' }}>
              <span>Pilih Suara AI:</span>
              <div className="tap" onClick={() => setSelectedVoice('Aoede')} style={{ padding: '6px 12px', borderRadius: 12, background: selectedVoice === 'Aoede' ? '#3B82F6' : 'transparent', color: selectedVoice === 'Aoede' ? '#fff' : '#64748B', transition: 'all .2s' }}>👧 Cewek</div>
              <div className="tap" onClick={() => setSelectedVoice('Puck')} style={{ padding: '6px 12px', borderRadius: 12, background: selectedVoice === 'Puck' ? '#3B82F6' : 'transparent', color: selectedVoice === 'Puck' ? '#fff' : '#64748B', transition: 'all .2s' }}>👦 Cowok</div>
            </div>
          </div>

          {/* Mode Basic Conversation */}
          <div className="tap" onClick={() => startMode('basic')} style={{ background: "#fff", borderRadius: 24, padding: "20px", boxShadow: "0 12px 32px rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.15)", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: 5, background: "linear-gradient(90deg, #2563EB, #60A5FA)" }}></div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 40, height: 40, background: "#EFF6FF", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🗣️</div>
                <h3 style={{ fontFamily: "Exo 2", fontWeight: 900, fontSize: 18, color: "#1E293B", margin: 0 }}>Basic Casual</h3>
              </div>
              {(!gs?.proStatus?.english && (gs?.basicChatCount || 0) >= 3) ? <span style={{ fontSize: 18 }}>🔒</span> : <span style={{ fontSize: 11, background: "#FEF3C7", color: "#F59E0B", padding: "4px 10px", borderRadius: 99, fontWeight: 800 }}>Free</span>}
            </div>
            <p style={{ fontSize: 13, color: "#64748B", margin: "0 0 12px 0", lineHeight: 1.5 }}>{isEn ? "Casual daily conversation practice to improve your pronunciation." : "Latihan mengobrol santai sehari-hari untuk melancarkan pelafalan Anda."}</p>
            {!gs?.proStatus?.english && (
              <div style={{ background: "#FEF2F2", color: "#EF4444", fontSize: 11, fontWeight: 700, padding: "6px 12px", borderRadius: 8, display: "inline-block" }}>
                {isEn ? "Remaining Free Quota:" : "Sisa Kuota Gratis:"} {Math.max(0, 3 - (gs?.basicChatCount || 0))}/3
              </div>
            )}
          </div>

          {/* Mode Grammar Fixer */}
          <div className="tap" onClick={() => startMode('grammar')} style={{ background: "#fff", borderRadius: 24, padding: "20px", boxShadow: "0 12px 32px rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.15)", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: 5, background: "linear-gradient(90deg, #7C3AED, #A78BFA)" }}></div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 40, height: 40, background: "#F5F3FF", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>✍️</div>
                <h3 style={{ fontFamily: "Exo 2", fontWeight: 900, fontSize: 18, color: "#1E293B", margin: 0 }}>Grammar Bot</h3>
              </div>
              {!gs?.proStatus?.english && <span style={{ fontSize: 18 }}>🔒</span>}
            </div>
            <p style={{ fontSize: 13, color: "#64748B", margin: 0, lineHeight: 1.5 }}>{isEn ? "Listen to grammatically incorrect sentences, and speak the correction!" : "Dengarkan kalimat yang salah secara tata bahasa, dan ucapkan perbaikannya!"}</p>
          </div>

          {/* Mode Wawancara SMA/SMK */}
          <div className="tap" onClick={() => startMode('interview')} style={{ background: "#fff", borderRadius: 24, padding: "20px", boxShadow: "0 12px 32px rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.15)", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: 5, background: "linear-gradient(90deg, #D97706, #FCD34D)" }}></div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 40, height: 40, background: "#FFFBEB", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>💼</div>
                <h3 style={{ fontFamily: "Exo 2", fontWeight: 900, fontSize: 18, color: "#1E293B", margin: 0 }}>HR Interview</h3>
              </div>
              {!gs?.proStatus?.english && <span style={{ fontSize: 18 }}>🔒</span>}
            </div>
            <p style={{ fontSize: 13, color: "#64748B", margin: 0, lineHeight: 1.5 }}>{isEn ? "High school / Vocational school interview practice (discussing school, internship & skills)." : "Latihan wawancara untuk lulusan SMA/SMK (membahas sekolah, PKL/Organisasi & keahlian)."}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "#F1F5F9", zIndex: 9999, height: "100dvh", overflow: "hidden" }}>
      {/* Header */}
      <div style={{ background: "#fff", padding: "16px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 2px 10px rgba(0,0,0,0.05)", zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button className="tap" onClick={exitMode} style={{ background: "#fff", border: "1px solid #E2E8F0", width: 44, height: 44, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", marginRight: 8, boxShadow: "0 4px 12px rgba(0,0,0,0.04)", flexShrink: 0 }}>
            <span style={{ fontSize: 20 }}>⬅️</span>
          </button>
          <div>
            <div style={{ fontFamily: "Exo 2", fontWeight: 900, fontSize: 16, color: "#1E293B" }}>
              {mode === 'basic' ? 'Basic Tutor' : mode === 'grammar' ? 'Grammar Bot' : 'HR Interviewer'}
            </div>
            <div style={{ fontSize: 11, color: isSpeaking ? "#10B981" : "#64748B", fontWeight: 600 }}>
              {isSpeaking ? (isEn ? 'Speaking...' : 'Sedang berbicara...') : 'Online'}
            </div>
          </div>
        </div>
        {isPro && (
          <div style={{ fontSize: 12, fontWeight: 800, color: "#F59E0B", background: "#FEF3C7", padding: "4px 8px", borderRadius: 8 }}>
            +2 🪙 / voice
          </div>
        )}
      </div>

      {/* Sticky Avatar Area */}
      <div style={{ background: "#F1F5F9", zIndex: 5, paddingBottom: 0 }}>
        <AIAvatar isSpeaking={isSpeaking} isWaiting={isWaitingForAI} selectedVoice={selectedVoice} />
      </div>

      {/* Chat Area */}
      <div style={{ flex: 1, overflowY: "auto", padding: "0 16px 16px 16px", display: "flex", flexDirection: "column", gap: 12 }}>

        <div style={{ textAlign: "center", fontSize: 11, color: "#94A3B8", marginBottom: 8 }}>
          Chat started. Tap the mic below and speak in English.
        </div>

        {messages.map((m, i) => {
          const isUser = m.role === 'user';
          return (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: isUser ? "flex-end" : "flex-start", animation: "fadeUp .3s ease" }}>
              <div style={{
                background: isUser ? "#3B82F6" : "#fff",
                color: isUser ? "#fff" : "#1E293B",
                padding: "12px 16px",
                borderRadius: 20,
                borderBottomRightRadius: isUser ? 4 : 20,
                borderBottomLeftRadius: isUser ? 20 : 4,
                maxWidth: "80%",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                fontSize: 14,
                lineHeight: 1.5
              }}>
                {m.content}
              </div>
            </div>
          );
        })}
        {isWaitingForAI && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", animation: "fadeUp .3s ease" }}>
            <div style={{ background: "#fff", color: "#64748B", padding: "12px 16px", borderRadius: 20, fontStyle: "italic", fontSize: 13 }}>
              Sumber AI is typing...
            </div>
          </div>
        )}

        {/* Live Transcript Preview */}
        {isListening && transcript && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", opacity: 0.6 }}>
            <div style={{
              background: "#93C5FD",
              color: "#1E3A8A",
              padding: "10px 14px",
              borderRadius: 16,
              borderBottomRightRadius: 4,
              maxWidth: "70%",
              fontSize: 13,
              fontStyle: "italic"
            }}>
              "{transcript}..."
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Footer / Mic Button */}
      <div style={{ background: "#fff", paddingTop: 16, paddingBottom: "max(24px, env(safe-area-inset-bottom, 24px))", paddingLeft: 16, paddingRight: 16, borderTop: "1px solid #E2E8F0", display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>

        {/* Visualizer text */}
        <div style={{ fontSize: 12, fontWeight: 700, color: isListening ? "#EF4444" : "#94A3B8", height: 16 }}>
          {isListening ? (isEn ? "🎙️ Listening..." : "🎙️ Mendengarkan...") : (isEn ? "Tap mic to speak" : "Tap mic untuk berbicara")}
        </div>

        <button
          className="tap"
          onClick={toggleListen}
          style={{
            width: 70, height: 70, borderRadius: "50%",
            background: isListening ? "#EF4444" : "linear-gradient(135deg, #3B82F6, #1E3A8A)",
            color: "#fff", border: "none", fontSize: 28,
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer",
            boxShadow: isListening ? "0 0 20px rgba(239,68,68,0.6)" : "0 8px 24px rgba(37,99,235,.3)",
            transition: "all .3s"
          }}
        >
          {isListening ? "⏹️" : "🎤"}
        </button>

      </div>
    </div>
  );
}
