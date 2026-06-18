import React, { useState } from 'react';
import { C } from '../data/mockData';
import { Tag } from '../components/Shared';
import { GRAMMAR_QUESTIONS } from '../data/grammarData';

export default function EnglishScreen({ gs, setGs, onCoinEarned, onXPEarned, onNav }) {
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [qIdx, setQIdx] = useState(0);
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [isFinished, setIsFinished] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);
  const [selectedAnsIdx, setSelectedAnsIdx] = useState(null);
  const [isPaywalled, setIsPaywalled] = useState(false);

  const isPro = gs?.proStatus?.grammar;

  const startQuiz = (level) => {
    if (!isPro && level !== 'beginner') {
      onNav("pricing");
      return;
    }
    
    const db = GRAMMAR_QUESTIONS;
    const limit = !isPro && level === 'beginner' ? 20 : 50;
    const shuffled = [...db[level]].sort(() => Math.random() - 0.5).slice(0, limit);
    setShuffledQuestions(shuffled);
    setQIdx(0);
    setIsFinished(false);
    setShowExplanation(false);
    setIsAnswered(false);
    setSelectedAnsIdx(null);
    setCorrectCount(0);
    setIsPaywalled(false);
    setSelectedLevel(level);
  };

  const handleAnswer = (idx) => {
    if (isAnswered) return; // Hanya boleh 1x jawab
    setIsAnswered(true);
    setSelectedAnsIdx(idx);

    const now = new Date().getTime();
    const ONE_WEEK = 7 * 24 * 60 * 60 * 1000;
    
    let weeklyObj = typeof gs?.engLabWeeklyCoins === 'object' && gs?.engLabWeeklyCoins !== null 
      ? { ...gs.engLabWeeklyCoins } 
      : { beginner: 0, intermediate: 0, advanced: 0 };
    let resetDate = gs?.engLabResetDate;

    if (!resetDate || now > resetDate + ONE_WEEK) {
      weeklyObj = { beginner: 0, intermediate: 0, advanced: 0 };
      resetDate = now;
    }

    if(idx === shuffledQuestions[qIdx].ans) {
      setShowExplanation(false); // Jangan munculkan penjelasan jika benar
      let message = "Benar!";
      const levelLimit = isPro ? 70 : 40; 
      let currentLevelCoins = weeklyObj[selectedLevel] || 0;

      if (currentLevelCoins < levelLimit) {
        weeklyObj[selectedLevel] = currentLevelCoins + 2;
        onCoinEarned(2);
        message = "Benar! +2 Koin";
      } else {
        message = "Benar! (Batas koin mingguan penuh)";
      }
      
      if (setGs) {
        setGs(prev => ({
          ...prev,
          engLabWeeklyCoins: weeklyObj,
          engLabResetDate: resetDate
        }));
      }

      setCorrectCount(prev => prev + 1);
    } else {
      setShowExplanation(true); // Munculkan penjelasan karena salah
    }
  };

  const goToNextQuestion = () => {
    setIsAnswered(false);
    setSelectedAnsIdx(null);
    setShowExplanation(false);

    if(qIdx < shuffledQuestions.length - 1) {
      setQIdx(qIdx + 1);
    } else {
      setIsFinished(true);
    }
  };

  const resetSelection = () => {
    setSelectedLevel(null);
  };

  return (
    <div style={{paddingTop: 80, paddingBottom: 100, minHeight: "100vh", background:"var(--bg-main)"}}>
      <div style={{padding: "0 16px"}}>
        <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8}}>
          <div style={{display: "flex", alignItems: "center", gap: 12}}>
            <button className="tap" onClick={() => onNav('home')} style={{background: "var(--bg-card)", border: "none", padding: "8px 12px", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 13, fontWeight: 800, color: "#64748B", boxShadow: C.shadowCard}}>
              ← Kembali
            </button>
            <h2 style={{fontFamily: "Exo 2", fontWeight: 900, fontSize: 24, color: C.text, margin: 0}}>ENGLISH LAB 📖</h2>
          </div>
          <Tag label="Level 2" color={C.blue} bg={C.blueLt} />
        </div>
        <p style={{fontSize: 13, color: C.textSec, marginBottom: 24}}>Pilih kategori dan tingkat kesulitan untuk memulai ujian Anda!</p>

        {!selectedLevel ? (
          <>
            <div style={{display: "flex", flexDirection: "column", gap: 16, animation: "fadeUp .4s ease"}}>
              <div className="tap" onClick={() => startQuiz('beginner')} style={{background: "var(--bg-card)", borderRadius: 20, padding: 20, boxShadow: C.shadowCard, borderLeft: "6px solid #10B981"}}>
                <h3 style={{fontFamily: "Exo 2", fontWeight: 900, fontSize: 18, color: C.text, marginBottom: 4}}>Pemula (Beginner)</h3>
                <p style={{fontSize: 12, color: C.textSec}}>Soal dasar tata bahasa dan struktur kalimat bahasa Inggris. Cocok untuk pemanasan.</p>
                {!isPro && <div style={{fontSize: 11, color: "#10B981", fontWeight: 700, marginTop: 8}}>Gratis Terbuka</div>}
              </div>
              <div className="tap" onClick={() => startQuiz('intermediate')} style={{background: "var(--bg-card)", borderRadius: 20, padding: 20, boxShadow: C.shadowCard, borderLeft: "6px solid #F59E0B", opacity: isPro ? 1 : 0.6}}>
                <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                  <h3 style={{fontFamily: "Exo 2", fontWeight: 900, fontSize: 18, color: C.text, marginBottom: 4}}>Menengah (Intermediate)</h3>
                  {!isPro && <span style={{fontSize: 18}}>🔒</span>}
                </div>
                <p style={{fontSize: 12, color: C.textSec}}>Penguasaan Tenses kompleks, klausa bersyarat, dan pengecualian aturan dasar.</p>
                {!isPro && <div style={{fontSize: 11, color: "#F59E0B", fontWeight: 700, marginTop: 8}}>Eksklusif Pelanggan PRO</div>}
              </div>
              <div className="tap" onClick={() => startQuiz('advanced')} style={{background: "var(--bg-card)", borderRadius: 20, padding: 20, boxShadow: C.shadowCard, borderLeft: "6px solid #EF4444", opacity: isPro ? 1 : 0.6}}>
                <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                  <h3 style={{fontFamily: "Exo 2", fontWeight: 900, fontSize: 18, color: C.text, marginBottom: 4}}>Mahir (Advanced)</h3>
                  {!isPro && <span style={{fontSize: 18}}>🔒</span>}
                </div>
                <p style={{fontSize: 12, color: C.textSec}}>Soal tingkat lanjut dengan Inversi, Subjunctive, dan struktur kompleks lainnya.</p>
                {!isPro && <div style={{fontSize: 11, color: "#EF4444", fontWeight: 700, marginTop: 8}}>Eksklusif Pelanggan PRO</div>}
              </div>
            </div>
          </>
        ) : (
          <>
            {isFinished ? (
              <div style={{background:"var(--bg-card)", borderRadius: 20, padding: 30, textAlign: "center", boxShadow: C.shadowCard, animation: "fadeUp .4s ease"}}>
                <div style={{fontSize: 50, marginBottom: 16}}>✅</div>
                <h3 style={{fontFamily: "Exo 2", fontWeight: 900, fontSize: 20, color: C.text, marginBottom: 8}}>Sesi Selesai!</h3>
                <p style={{fontSize: 13, color: C.textSec, marginBottom: 24}}>Anda telah menyelesaikan {shuffledQuestions.length} soal.</p>
                
                <div style={{background: "#F8FAFC", padding: 16, borderRadius: 16, marginBottom: 24}}>
                  <div style={{fontSize: 12, fontWeight: 800, color: C.blue, marginBottom: 8}}>INFO KOIN MINGGUAN ({selectedLevel.toUpperCase()})</div>
                  <div style={{fontSize: 24, fontWeight: 900, color: "#F59E0B", marginBottom: 8}}>
                    {(typeof gs?.engLabWeeklyCoins === 'object' ? gs.engLabWeeklyCoins[selectedLevel] : 0) || 0} / {isPro ? 70 : 40} Koin
                  </div>
                  
                  {isPro && (
                    <div style={{fontSize: 12, fontWeight: 700, color: "#475569", marginBottom: 12}}>
                      Total Koin Semua Level: {Object.values(gs?.engLabWeeklyCoins || {}).reduce((a, b) => a + (Number(b) || 0), 0)} / 210
                    </div>
                  )}

                  {((typeof gs?.engLabWeeklyCoins === 'object' ? gs.engLabWeeklyCoins[selectedLevel] : 0) >= (isPro ? 70 : 40)) && gs?.engLabResetDate ? (
                    <div style={{fontSize: 12, color: "#64748B", fontWeight: 600}}>
                      Koin level ini akan direset pada:<br/>
                      <span style={{color: C.text, fontWeight: 800}}>
                        {new Date(gs.engLabResetDate + (7 * 24 * 60 * 60 * 1000)).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ) : (
                    <div style={{fontSize: 12, color: "#64748B", fontWeight: 600}}>Masih ada sisa koin di level ini minggu ini! Main lagi untuk mengumpulkannya.</div>
                  )}
                </div>

                <div style={{display: "flex", flexDirection: "column", gap: 12}}>
                  <button className="tap" onClick={() => startQuiz(selectedLevel)} style={{background: "linear-gradient(135deg, #3B82F6, #1E3A8A)", color: "#fff", border: "none", padding: "14px 24px", borderRadius: 14, fontSize: 14, fontWeight: 800, cursor: "pointer", width: "100%", boxShadow: "0 8px 24px rgba(37,99,235,.3)"}}>
                    🔄 Main Lagi (Latihan)
                  </button>
                  <button className="tap" onClick={resetSelection} style={{background: "transparent", color: "#64748B", border: "2px solid #E2E8F0", padding: "14px 24px", borderRadius: 14, fontSize: 14, fontWeight: 800, cursor: "pointer", width: "100%"}}>
                    Kembali ke Menu
                  </button>
                </div>
              </div>
            ) : (
              <div style={{background:"var(--bg-card)", borderRadius: 20, padding: 24, boxShadow: C.shadowCard, animation: "fadeUp .4s ease"}}>
                <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12}}>
                  <div style={{fontSize: 12, fontWeight: 700, color: C.blue}}>PERTANYAAN {qIdx + 1} DARI {shuffledQuestions.length}</div>
                  <button className="tap" onClick={resetSelection} style={{background: "#FEE2E2", color: "#DC2626", border: "none", padding: "4px 10px", borderRadius: 8, fontSize: 11, fontWeight: 800, cursor: "pointer"}}>Keluar</button>
                </div>
                
                <h3 style={{fontFamily: "Exo 2", fontWeight: 800, fontSize: 18, color: C.text, marginBottom: showExplanation ? 8 : 16, lineHeight: 1.4, whiteSpace: "pre-line"}}>
                  {shuffledQuestions[qIdx].q}
                </h3>
                 {showExplanation && (
                  <div style={{fontSize: 14, color: C.textSec, fontStyle: "italic", marginBottom: 16, padding: "12px 16px", background: "#FEF2F2", borderRadius: 12, borderLeft: "4px solid #EF4444", animation: "fadeUp .3s ease"}}>
                    <div style={{fontWeight: 800, color: "#DC2626", marginBottom: 4}}>Jawaban Salah. Berikut penjelasannya:</div>
                    {shuffledQuestions[qIdx].exp}
                  </div>
                )}

                <div style={{display: "flex", flexDirection: "column", gap: 12}}>
                  {shuffledQuestions[qIdx].opts.map((opt, i) => {
                    const isCorrect = isAnswered && i === shuffledQuestions[qIdx].ans;
                    const isSelected = isAnswered && i === selectedAnsIdx;
                    const isWrong = isSelected && !isCorrect;
                    const opacity = isAnswered && !isCorrect && !isSelected ? 0.5 : 1;

                    return (
                      <button 
                        key={i} 
                        className="tap" 
                        onClick={() => handleAnswer(i)}
                        disabled={isAnswered}
                        style={{
                          background: isCorrect ? "#D1FAE5" : isWrong ? "#FEE2E2" : "var(--bg-main)", 
                          border: isCorrect ? `2px solid #10B981` : isWrong ? `2px solid #EF4444` : `2px solid #E2E8F0`, 
                          padding: "16px", 
                          borderRadius: 14, fontSize: 15, fontWeight: 700, 
                          color: isCorrect ? "#065F46" : isWrong ? "#991B1B" : C.text, 
                          textAlign: "left", cursor: isAnswered ? "default" : "pointer", transition: "all .2s",
                          opacity: opacity
                        }}
                      >
                        {opt} {isCorrect && "✅"} {isWrong && "❌"}
                      </button>
                    );
                  })}
                </div>

                {isAnswered && (
                  <button className="tap" onClick={goToNextQuestion} style={{background: "linear-gradient(135deg, #10B981, #059669)", color: "#fff", border: "none", padding: "16px 24px", borderRadius: 16, fontSize: 15, fontWeight: 800, cursor: "pointer", width: "100%", marginTop: 24, boxShadow: "0 8px 24px rgba(16,185,129,.3)", animation: "fadeUp .3s ease"}}>
                    Lanjut ke Soal Berikutnya ➔
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
