import React, { useState, useEffect, useRef } from 'react';
import { C } from '../data/mockData';
import { Tag } from '../components/Shared';

const SYSTEM_PROMPTS = {
  basic: `You are a friendly and encouraging English conversation buddy named Sumber AI. Your goal is to help the user practice casual daily English speaking. Keep your responses short (1-3 sentences). Always ask a follow-up question. Be very supportive. Do not break character.`,
  grammar: `You are a strict but helpful English grammar tutor named Sumber AI. Your goal is to improve the user's grammar. You should: 1) Point out any grammatical mistakes they made and correct them. 2) Provide a new incorrect sentence for them to fix. Keep responses concise.`,
  interview: `You are a professional HR Manager conducting a job interview for a vocational school (SMK) graduate applying for an entry-level technical position. Act professionally. Ask one interview question at a time. Probe their technical skills, internship experience (PKL), and work ethic. Do not break character. Keep responses concise.`
};

const INITIAL_MESSAGES = {
  basic: "Hello there! I am Sumber AI, your English practice buddy. What did you do today?",
  grammar: "Hello, I am Sumber AI. Let's practice grammar. Can you fix this sentence: 'She don't like apples.'?",
  interview: "Welcome. I am the HR Manager. Please introduce yourself and tell me about your vocational major."
};

export default function InterviewScreen({ gs, setGs, onNav, onCoinEarned, onXPEarned, onChatUsed }) {
  const [mode, setMode] = useState(null); // null, 'basic', 'grammar', 'interview'
  const [messages, setMessages] = useState([]); // Array of {role: 'user'|'assistant', content: string}
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isWaitingForAI, setIsWaitingForAI] = useState(false);
  const chatEndRef = useRef(null);

  const isPro = gs?.proStatus?.english;

  useEffect(() => {
    const now = new Date().getTime();
    const ONE_DAY = 24 * 60 * 60 * 1000;
    let lastReset = gs?.tutorResetDate;
    if (setGs && (!lastReset || now > lastReset + ONE_DAY)) {
      setGs(prev => ({ ...prev, basicChatCount: 0, tutorResetDate: now }));
    }
  }, [gs?.tutorResetDate, setGs]);

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, transcript, isWaitingForAI]);

  // Handle Speech Recognition setup
  useEffect(() => {
    if (!recognition) return;
    
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => {
      setIsListening(false);
    };
    recognition.onerror = (e) => {
      console.error(e);
      setIsListening(false);
    };
    recognition.onresult = (event) => {
      let currentTrans = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        currentTrans += event.results[i][0].transcript;
      }
      setTranscript(currentTrans);
      
      if (event.results[0].isFinal) {
        handleUserMessage(currentTrans);
        setTranscript('');
      }
    };
  }, [recognition, mode]);

  const speakText = (text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.95; // Sedikit lebih cepat agar natural
    utterance.pitch = 1.0;

    // Coba mencari suara bahasa Inggris wanita yang bagus
    const voices = window.speechSynthesis.getVoices();
    const engVoices = voices.filter(v => v.lang.startsWith('en'));
    const preferredVoice = engVoices.find(v => v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Zira')) || engVoices[0];
    if (preferredVoice) utterance.voice = preferredVoice;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    
    window.speechSynthesis.speak(utterance);
  };

  const startMode = (selectedMode) => {
    if (!gs?.proStatus?.english && selectedMode !== 'basic') {
      onNav("pricing");
      return;
    }

    if (!gs?.proStatus?.english && selectedMode === 'basic' && (gs?.basicChatCount || 0) >= 5) {
      alert("Limit Percakapan Gratis Habis! Anda telah mencoba 5 kali interaksi gratis. Untuk membuka fitur secara penuh, silakan berlangganan AI ENGLISH TUTOR PRO.");
      onNav("pricing");
      return;
    }

    if (!SpeechRecognition) {
      alert("Maaf, browser Anda tidak mendukung fitur Voice Recognition. Gunakan Google Chrome versi terbaru.");
      return;
    }

    // Daily 20-Coin Bonus for PRO
    if (isPro && setGs) {
      const now = new Date().getTime();
      const today = new Date().toLocaleDateString('id-ID');
      const lastBonusDay = gs?.tutorDailyBonusDate ? new Date(gs.tutorDailyBonusDate).toLocaleDateString('id-ID') : null;

      if (today !== lastBonusDay) {
        setGs(prev => ({ ...prev, tutorDailyBonusDate: now }));
        onCoinEarned(20);
        alert("🎉 BONUS HARIAN PRO! 🎉\n\nAnda mendapatkan +20 Koin karena telah membuka AI English Tutor hari ini!");
      }
    }

    setMode(selectedMode);
    const firstMsg = INITIAL_MESSAGES[selectedMode];
    setMessages([{ role: 'assistant', content: firstMsg }]);
    speakText(firstMsg);
  };

  const exitMode = () => {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    if (recognition && isListening) recognition.stop();
    setMode(null);
    setMessages([]);
    setIsWaitingForAI(false);
  };

  const handleUserMessage = async (text) => {
    if (!text.trim() || isWaitingForAI) return;

    // Check freemium limits before answering
    if (!gs?.proStatus?.english && mode === 'basic') {
       if ((gs?.basicChatCount || 0) >= 5) {
          exitMode();
          onNav("pricing");
          return;
       }
       if (onChatUsed) onChatUsed();
    }

    // Add user message
    const newMessages = [...messages, { role: 'user', content: text }];
    setMessages(newMessages);
    
    // Reward user for speaking (Only for PRO users)
    if (isPro) {
      onCoinEarned(2);
    }
    onXPEarned(5);
    
    setIsWaitingForAI(true);
    
    const lowerText = text.toLowerCase();
    if (lowerText.includes('goodbye') || lowerText.includes('done') || lowerText.includes('finish') || lowerText === 'exit' || lowerText.includes('quit')) {
        const endMsg = "Alright, let's wrap up our session. Scoring... You did great" + (isPro ? "! +10 Bonus Coins!" : "!");
        setMessages(prev => [...prev, { role: 'assistant', content: endMsg }]);
        speakText(endMsg);
        if (isPro) {
          onCoinEarned(10);
        }
        setIsWaitingForAI(false);
        return;
    }

    setTimeout(() => {
      let aiText = "That's interesting! Tell me more about it.";
      
      if (mode === 'grammar') {
        aiText = "Good try! A better way to say that might be: 'I am practicing my English.' Can you fix this one: 'He go to school yesterday' ?";
      } else if (mode === 'interview') {
        if (messages.length < 2) {
          aiText = "Can you tell me about a challenge you faced during your internship and how you overcame it?";
        } else {
          aiText = "Interesting approach. How do you handle working under tight deadlines?";
        }
      }

      setMessages(prev => [...prev, { role: 'assistant', content: aiText }]);
      speakText(aiText);
      setIsWaitingForAI(false);
    }, 1500);
  };

  const toggleListen = () => {
    if (isListening) {
      recognition.stop();
    } else {
      if (isSpeaking) window.speechSynthesis.cancel();
      setTranscript('');
      recognition.start();
    }
  };



  if (!mode) {
    return (
      <div style={{paddingTop: 80, paddingBottom: 100, minHeight: "100vh", background:"var(--bg-main)", paddingLeft: 16, paddingRight: 16}}>
        <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8}}>
          <div style={{display: "flex", alignItems: "center", gap: 12}}>
            <button className="tap" onClick={() => onNav('home')} style={{background: "var(--bg-card)", border: "none", padding: "8px 12px", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 13, fontWeight: 800, color: "#64748B", boxShadow: C.shadowCard}}>
              ← Kembali
            </button>
            <h2 style={{fontFamily: "Exo 2", fontWeight: 900, fontSize: 22, color: C.text, margin: 0}}>AI ENGLISH TUTOR 🤖</h2>
          </div>
          <Tag label="Level 3" color={C.blue} bg={C.blueLt} />
        </div>
        <p style={{fontSize: 13, color: C.textSec, marginBottom: 24, marginTop: 12}}>Pilih mode percakapan untuk berlatih *Speaking* langsung bersama asisten AI.</p>
        
        <div style={{display: "flex", flexDirection: "column", gap: 16, animation: "fadeUp .4s ease"}}>
          {/* Mode Basic Conversation */}
          <div className="tap" onClick={() => startMode('basic')} style={{background: "var(--bg-card)", borderRadius: 20, padding: 20, boxShadow: C.shadowCard, borderLeft: "6px solid #3B82F6", position: "relative"}}>
            <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
              <h3 style={{fontFamily: "Exo 2", fontWeight: 900, fontSize: 18, color: C.text, marginBottom: 4}}>🗣️ Basic Conversation</h3>
              {(!gs?.proStatus?.english && (gs?.basicChatCount || 0) >= 5) ? <span style={{fontSize: 18}}>🔒</span> : <span style={{fontSize: 12, background: "#FEF3C7", color: "#F59E0B", padding: "2px 8px", borderRadius: 10, fontWeight: 800}}>Free</span>}
            </div>
            <p style={{fontSize: 12, color: C.textSec}}>Latihan mengobrol santai sehari-hari untuk melancarkan pelafalan Anda.</p>
            {!gs?.proStatus?.english && <p style={{fontSize: 10, color: "#EF4444", marginTop: 8, fontWeight: 700}}>Sisa Kuota Gratis: {5 - (gs?.basicChatCount || 0)}/5</p>}
          </div>

          {/* Mode Grammar Fixer */}
          <div className="tap" onClick={() => startMode('grammar')} style={{background: "var(--bg-card)", borderRadius: 20, padding: 20, boxShadow: C.shadowCard, borderLeft: "6px solid #8B5CF6", position: "relative"}}>
            <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
              <h3 style={{fontFamily: "Exo 2", fontWeight: 900, fontSize: 18, color: C.text, marginBottom: 4}}>✍️ Grammar Correction</h3>
              {!gs?.proStatus?.english && <span style={{fontSize: 18}}>🔒</span>}
            </div>
            <p style={{fontSize: 12, color: C.textSec}}>Dengarkan kalimat yang salah secara tata bahasa, dan ucapkan perbaikannya!</p>
          </div>

          {/* Mode Wawancara SMK */}
          <div className="tap" onClick={() => startMode('interview')} style={{background: "var(--bg-card)", borderRadius: 20, padding: 20, boxShadow: C.shadowCard, borderLeft: "6px solid #F59E0B", position: "relative"}}>
            <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
              <h3 style={{fontFamily: "Exo 2", fontWeight: 900, fontSize: 18, color: C.text, marginBottom: 4}}>💼 Simulasi Interview SMK</h3>
              {!gs?.proStatus?.english && <span style={{fontSize: 18}}>🔒</span>}
            </div>
            <p style={{fontSize: 12, color: C.textSec}}>Latihan wawancara HRD berbahasa Inggris khusus lulusan SMK (membahas PKL & keahlian teknis).</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{display: "flex", flexDirection: "column", position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "#F1F5F9", zIndex: 9999, height: "100dvh", overflow: "hidden"}}>
      {/* Header */}
      <div style={{background: "#fff", padding: "16px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 2px 10px rgba(0,0,0,0.05)", zIndex: 10}}>
        <div style={{display: "flex", alignItems: "center", gap: 12}}>
          <button className="tap" onClick={exitMode} style={{background: "#F1F5F9", border: "none", padding: "8px 12px", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 13, fontWeight: 800, color: "#64748B"}}>
            ← Kembali
          </button>
          <div>
            <div style={{fontFamily: "Exo 2", fontWeight: 900, fontSize: 16, color: "#1E293B"}}>
              {mode === 'basic' ? 'Basic Tutor' : mode === 'grammar' ? 'Grammar Bot' : 'HR Interviewer'}
            </div>
            <div style={{fontSize: 11, color: isSpeaking ? "#10B981" : "#64748B", fontWeight: 600}}>
              {isSpeaking ? 'Sedang berbicara...' : 'Online'}
            </div>
          </div>
        </div>
        {isPro && (
          <div style={{fontSize: 12, fontWeight: 800, color: "#F59E0B", background: "#FEF3C7", padding: "4px 8px", borderRadius: 8}}>
            +2 🪙 / voice
          </div>
        )}
      </div>

      {/* Chat Area */}
      <div style={{flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 12}}>
        <div style={{textAlign: "center", fontSize: 11, color: "#94A3B8", marginBottom: 8}}>
          Chat started. Tap the mic below and speak in English.
        </div>
        
        {messages.map((m, i) => {
          const isUser = m.role === 'user';
          return (
            <div key={i} style={{display: "flex", flexDirection: "column", alignItems: isUser ? "flex-end" : "flex-start", animation: "fadeUp .3s ease"}}>
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
          <div style={{display: "flex", flexDirection: "column", alignItems: "flex-start", animation: "fadeUp .3s ease"}}>
            <div style={{background: "#fff", color: "#64748B", padding: "12px 16px", borderRadius: 20, fontStyle: "italic", fontSize: 13}}>
              Claude is typing...
            </div>
          </div>
        )}

        {/* Live Transcript Preview */}
        {isListening && transcript && (
          <div style={{display: "flex", flexDirection: "column", alignItems: "flex-end", opacity: 0.6}}>
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
      <div style={{background: "#fff", paddingTop: 16, paddingBottom: "max(24px, env(safe-area-inset-bottom, 24px))", paddingLeft: 16, paddingRight: 16, borderTop: "1px solid #E2E8F0", display: "flex", flexDirection: "column", alignItems: "center", gap: 12}}>
        
        {/* Visualizer text */}
        <div style={{fontSize: 12, fontWeight: 700, color: isListening ? "#EF4444" : "#94A3B8", height: 16}}>
          {isListening ? "🎙️ Mendengarkan..." : "Tap mic untuk berbicara"}
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
