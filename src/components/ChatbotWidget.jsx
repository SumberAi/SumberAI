import React, { useState, useEffect, useRef } from 'react';

export default function ChatbotWidget({ gs, isDark }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Initialize first message from Gamy
  useEffect(() => {
    if (messages.length === 0 && gs?.name) {
      setMessages([
        {
          role: "model",
          text: `Halo kak **${gs.name}**! 👋\nAku **Gamy**, robot asisten resmi Sumber AI.\nAda yang bisa aku bantu hari ini? Ceritakan saja kebutuhan atau pertanyaanmu di sini ya!`
        }
      ]);
    }
  }, [gs?.name, messages.length]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    const newMessages = [...messages, { role: "user", text: userText }];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_CS_API_KEY;
      if (!apiKey) {
        throw new Error("API Key tidak ditemukan di pengaturan sistem.");
      }

      // Convert messages to Gemini format
      const contents = newMessages.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.text }]
      }));

      const systemInstruction = `Kamu adalah Gamy, robot asisten yang sangat imut, ceria, empati, dan ramah untuk aplikasi "Sumber AI Edu".
Pengguna saat ini login dengan nama akun ${gs?.name}. Jika ia memperkenalkan diri dengan nama aslinya, panggillah dengan nama aslinya tersebut.
Gaya Bicaramu:
- Selalu gunakan sapaan "Kak" agar akrab.
- Gunakan bahasa Indonesia santai, gaul, tapi tetap sopan (aku-kamu).
- Jangan kaku seperti mesin. Bersikaplah seperti teman yang siap membantu dengan ceria (gunakan emoji lucu secukupnya).
- Jawab HANYA sesuai dengan apa yang ditanyakan pengguna. Jangan pernah membeberkan semua fitur aplikasi jika tidak ditanya.
Pengetahuanmu:
Sumber AI Edu adalah aplikasi seru untuk belajar sambil bermain. Fiturnya: Gamy Arena (Game), English Lab (Grammar), AI English Tutor (Tutor Inggris), AI Academy (Kursus interaktif), dan UMKM Market (Tukar Koin dengan barang).`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: {
            parts: { text: systemInstruction }
          },
          contents: contents
        })
      });

      const data = await response.json();
      
      if (data.error) {
        if (data.error.message.toLowerCase().includes("high demand") || data.error.message.includes("503") || data.error.message.includes("quota")) {
          throw new Error("Maaf banget kak, server Gamy lagi super antre melayani banyak orang nih. 🥺 Boleh coba ketik pesannya lagi dalam beberapa detik ya!");
        }
        throw new Error("Aduh, kepala Gamy lagi pusing sedikit memproses datanya nih. Coba kirim ulang ya kak! 🤖💦");
      }

      const botReply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Maaf, Gamy kurang paham maksud kakak. Boleh diulangi? 🤔";
      
      setMessages([...newMessages, { role: "model", text: botReply }]);

    } catch (error) {
      console.error("Chatbot Error:", error);
      const errMsg = error.message.includes("Failed to fetch") 
        ? "Wah, sepertinya koneksi internet kakak lagi ngambek nih. Coba cek sinyalnya ya! 📡" 
        : error.message;
      setMessages([...newMessages, { role: "model", text: errMsg }]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderText = (text) => {
    // Simple bold markdown parser for UI
    return text.split('**').map((chunk, i) => i % 2 === 1 ? <strong key={i}>{chunk}</strong> : chunk);
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          className="tap"
          onClick={() => setIsOpen(true)}
          style={{
            position: "fixed",
            bottom: 100,
            left: "max(20px, calc(50vw - 380px))",
            background: "linear-gradient(135deg, #10B981, #059669)",
            color: "#fff",
            width: 60,
            height: 60,
            borderRadius: 30,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "none",
            boxShadow: "0 8px 24px rgba(16,185,129,0.4)",
            zIndex: 9999,
            animation: "fadeUp 0.5s ease"
          }}
        >
          <div style={{width: 44, height: 44, borderRadius: 22, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden"}}>
            <img src="/sumberai.png" alt="Gamy" style={{width: 36, height: 36, objectFit: "contain"}} />
          </div>
          
          {/* Notification Badge */}
          {messages.length === 1 && (
            <div style={{position: "absolute", top: -2, right: -2, background: "#EF4444", width: 18, height: 18, borderRadius: 9, border: "2px solid #fff", animation: "pulse 2s infinite"}} />
          )}
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div style={{
          position: "fixed",
          bottom: 100,
          left: "max(20px, calc(50vw - 380px))",
          width: "calc(100% - 40px)",
          maxWidth: 360,
          height: 500,
          maxHeight: "calc(100vh - 40px)",
          background: isDark ? "var(--bg-card)" : "#fff",
          borderRadius: 24,
          boxShadow: "0 20px 50px rgba(0,0,0,0.2)",
          display: "flex",
          flexDirection: "column",
          zIndex: 10000,
          overflow: "hidden",
          animation: "scaleIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
        }}>
          {/* Header */}
          <div style={{
            background: "linear-gradient(135deg, #10B981, #059669)",
            padding: "16px 20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "#fff"
          }}>
            <div style={{display: "flex", alignItems: "center", gap: 12}}>
              <div style={{width: 40, height: 40, borderRadius: 20, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden"}}>
                <img src="/sumberai.png" alt="Gamy" style={{width: 32, height: 32, objectFit: "contain"}} />
              </div>
              <div>
                <div style={{fontFamily: "Exo 2", fontWeight: 800, fontSize: 16}}>Gamy AI</div>
                <div style={{fontSize: 11, opacity: 0.9}}>Customer Service</div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} style={{background: "transparent", border: "none", color: "#fff", fontSize: 24, cursor: "pointer", opacity: 0.8}}>&times;</button>
          </div>

          {/* Messages Area */}
          <div style={{
            flex: 1,
            overflowY: "auto",
            padding: 20,
            display: "flex",
            flexDirection: "column",
            gap: 16,
            background: isDark ? "var(--bg-main)" : "#F8FAFC"
          }}>
            {messages.map((msg, i) => (
              <div key={i} style={{
                alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                maxWidth: "85%",
                background: msg.role === "user" ? "#3B82F6" : (isDark ? "#334155" : "#fff"),
                color: msg.role === "user" ? "#fff" : "var(--text-main)",
                padding: "12px 16px",
                borderRadius: 20,
                borderBottomRightRadius: msg.role === "user" ? 4 : 20,
                borderBottomLeftRadius: msg.role === "model" ? 4 : 20,
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                fontSize: 14,
                lineHeight: 1.5,
                whiteSpace: "pre-wrap"
              }}>
                {renderText(msg.text)}
              </div>
            ))}
            
            {isLoading && (
              <div style={{alignSelf: "flex-start", background: isDark ? "#334155" : "#fff", padding: "12px 16px", borderRadius: 20, borderBottomLeftRadius: 4, boxShadow: "0 2px 8px rgba(0,0,0,0.05)", fontSize: 14, color: "var(--text-sec)"}}>
                <span style={{animation: "pulse 1s infinite inline-block"}}>Gamy sedang mengetik...</span>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div style={{
            padding: "12px 16px",
            background: isDark ? "var(--bg-card)" : "#fff",
            borderTop: "1px solid var(--border-color)",
            display: "flex",
            gap: 8
          }}>
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Tulis pesan..."
              disabled={isLoading}
              style={{
                flex: 1,
                background: isDark ? "var(--bg-main)" : "#F1F5F9",
                border: "none",
                padding: "12px 16px",
                borderRadius: 20,
                outline: "none",
                color: "var(--text-main)",
                fontSize: 14
              }}
            />
            <button 
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                background: input.trim() && !isLoading ? "#3B82F6" : (isDark ? "#334155" : "#E2E8F0"),
                color: "#fff",
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: input.trim() && !isLoading ? "pointer" : "default",
                transition: "all 0.2s"
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
