import React, { useState, useEffect } from 'react';

export default function OnboardingScreen({ onComplete }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const slides = [
    {
      title: "Selamat Datang di SumberAI",
      description: "Platform belajar Bahasa Inggris revolusioner yang ditenagai oleh kecerdasan buatan (AI) terdepan.",
      image: "/sumberai.png",
      color: "from-blue-500 to-cyan-400"
    },
    {
      title: "Tutor Pribadi 24/7",
      description: "Latih kemampuan bicaramu (Speaking) dan menulismu langsung dengan Tutor AI. Tanpa tekanan, tanpa rasa malu.",
      image: "/sumberai.png",
      color: "from-indigo-500 to-purple-500"
    },
    {
      title: "Belajar & Belanja!",
      description: "Selesaikan misi belajar, kumpulkan koin, dan tukarkan koinmu secara nyata dengan berbagai produk UMKM lokal favoritmu!",
      image: "/sumberai.png",
      color: "from-amber-400 to-orange-500"
    }
  ];

  const handleNext = () => {
    if (isAnimating) return;
    if (currentSlide === slides.length - 1) {
      onComplete();
    } else {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentSlide(prev => prev + 1);
        setIsAnimating(false);
      }, 300);
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  return (
    <div style={{
      minHeight: "100dvh",
      background: "#0f172a",
      display: "flex",
      flexDirection: "column",
      position: "relative",
      overflow: "hidden",
      fontFamily: "'Exo 2', sans-serif"
    }}>
      {/* Dynamic Background Elements */}
      <div style={{
        position: "absolute", top: "-10%", left: "-20%", width: "70%", height: "50%",
        background: currentSlide === 0 ? "radial-gradient(circle, rgba(56,189,248,0.15) 0%, transparent 70%)" : 
                    currentSlide === 1 ? "radial-gradient(circle, rgba(167,139,250,0.15) 0%, transparent 70%)" : 
                    "radial-gradient(circle, rgba(251,191,36,0.15) 0%, transparent 70%)",
        transition: "background 1s ease",
        borderRadius: "50%", filter: "blur(60px)", zIndex: 0
      }} />
      <div style={{
        position: "absolute", bottom: "-10%", right: "-20%", width: "80%", height: "60%",
        background: currentSlide === 0 ? "radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)" : 
                    currentSlide === 1 ? "radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)" : 
                    "radial-gradient(circle, rgba(245,158,11,0.1) 0%, transparent 70%)",
        transition: "background 1s ease",
        borderRadius: "50%", filter: "blur(60px)", zIndex: 0
      }} />

      {/* Top Bar / Skip */}
      <div style={{ display: "flex", justifyContent: "flex-end", padding: "16px 24px", zIndex: 10 }}>
        {currentSlide < slides.length - 1 ? (
          <button 
            onClick={handleSkip}
            className="tap"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              backdropFilter: "blur(10px)",
              color: "#cbd5e1",
              fontWeight: 700,
              fontSize: 14,
              padding: "8px 16px",
              borderRadius: 99,
              cursor: "pointer",
              transition: "all 0.3s"
            }}
          >
            Lewati
          </button>
        ) : (
          <div style={{ height: 36 }}></div>
        )}
      </div>

      {/* Image Area - Flexible and Centered in remaining space */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10, padding: "0 24px" }}>
        <div 
          style={{
            width: "100%", maxWidth: 260, aspectRatio: "1/1",
            position: "relative",
            transform: isAnimating ? "scale(0.95) translateY(20px)" : "scale(1) translateY(0)",
            opacity: isAnimating ? 0 : 1,
            transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
          }}
        >
          {/* Decorative Rings */}
          <div style={{ position: "absolute", inset: -15, border: "1px solid rgba(255,255,255,0.1)", borderRadius: "50%", animation: "spin 15s linear infinite" }} />
          <div style={{ position: "absolute", inset: 15, border: "1px dashed rgba(255,255,255,0.05)", borderRadius: "50%", animation: "spin 20s linear infinite reverse" }} />
          
          <img 
            src={slides[currentSlide].image} 
            alt="Onboarding" 
            style={{ 
              width: "100%", height: "100%", objectFit: "contain", 
              position: "relative", zIndex: 2,
              filter: "drop-shadow(0 20px 30px rgba(0,0,0,0.5))"
            }}
          />
        </div>
      </div>
        
      {/* Bottom Content Area (Text, Dots, Button) */}
      <div style={{ padding: "0 24px 40px", zIndex: 10, display: "flex", flexDirection: "column" }}>
        
        {/* Text Container */}
        <div style={{
          textAlign: "center",
          marginBottom: 32,
          transform: isAnimating ? "translateY(20px)" : "translateY(0)",
          opacity: isAnimating ? 0 : 1,
          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1) 0.1s"
        }}>
          <h2 style={{ 
            color: "#ffffff", fontSize: 26, fontWeight: 900, marginBottom: 12, lineHeight: 1.3,
            background: "linear-gradient(180deg, #ffffff 0%, #cbd5e1 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}>
            {slides[currentSlide].title}
          </h2>
          
          <p style={{ color: "#94a3b8", fontSize: 15, lineHeight: 1.5, maxWidth: 300, margin: "0 auto", fontWeight: 500 }}>
            {slides[currentSlide].description}
          </p>
        </div>

        {/* Pagination Dots */}
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 32 }}>
          {slides.map((_, index) => (
            <div 
              key={index}
              style={{
                width: index === currentSlide ? 32 : 8,
                height: 8,
                borderRadius: 4,
                background: index === currentSlide ? "#3b82f6" : "rgba(255,255,255,0.1)",
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
              }}
            />
          ))}
        </div>

        {/* Action Button */}
        <button
          onClick={handleNext}
          className="tap"
          style={{
            width: "100%",
            background: currentSlide === 0 ? "linear-gradient(135deg, #0ea5e9, #3b82f6)" : 
                        currentSlide === 1 ? "linear-gradient(135deg, #8b5cf6, #6366f1)" : 
                        "linear-gradient(135deg, #f59e0b, #ea580c)",
            color: "white",
            border: "none",
            borderRadius: 20,
            padding: "18px",
            fontSize: 18,
            fontWeight: 800,
            cursor: "pointer",
            boxShadow: currentSlide === 0 ? "0 10px 30px -10px rgba(59, 130, 246, 0.8)" : 
                       currentSlide === 1 ? "0 10px 30px -10px rgba(139, 92, 246, 0.8)" : 
                       "0 10px 30px -10px rgba(245, 158, 11, 0.8)",
            transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
            position: "relative",
            overflow: "hidden"
          }}
        >
          <span style={{ position: "relative", zIndex: 1 }}>
            {currentSlide === slides.length - 1 ? "Mulai Belajar 🚀" : "Selanjutnya"}
          </span>
          <div style={{ position: "absolute", top: 0, left: "-100%", width: "50%", height: "100%", background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)", animation: "shine 3s infinite" }} />
        </button>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes shine {
          0% { left: -100%; }
          20% { left: 200%; }
          100% { left: 200%; }
        }
      `}</style>
    </div>
  );
}
