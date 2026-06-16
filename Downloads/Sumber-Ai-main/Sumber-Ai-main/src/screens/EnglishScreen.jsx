import React, { useState } from 'react';
import { C } from '../data/mockData';
import { Tag } from '../components/Shared';
import { GRAMMAR_QUESTIONS } from '../data/grammarData';

export default function EnglishScreen({ gs, onCoinEarned, onXPEarned, onNav }) {
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [qIdx, setQIdx] = useState(0);
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [isFinished, setIsFinished] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [isPaywalled, setIsPaywalled] = useState(false);

  const isPro = gs?.proStatus?.grammar;

  const startQuiz = (level) => {
    if (!isPro && level !== 'beginner') {
      onNav("pricing");
      return;
    }
    
    const db = GRAMMAR_QUESTIONS;
    const shuffled = [...db[level]].sort(() => Math.random() - 0.5).slice(0, 50);
    setShuffledQuestions(shuffled);
    setQIdx(0);
    setIsFinished(false);
    setShowExplanation(false);
    setShowAnswer(false);
    setCorrectCount(0);
    setIsPaywalled(false);
    setSelectedLevel(level);
  };

  const handleAnswer = (idx) => {
    if(idx === shuffledQuestions[qIdx].ans) {
      setCorrectCount(prev => {
        const next = prev + 1;
        if(next % 5 === 0) {
          onCoinEarned(4);
          onXPEarned(20);
          alert("Benar! Anda telah menjawab 5 soal dengan benar. +4 SmartCoins | +20 XP");
        } else {
          alert("Benar!");
        }
        return next;
      });

      goToNextQuestion();
    } else {
      alert("Salah, coba lagi!");
    }
  };

  const goToNextQuestion = () => {
    if (!isPro && selectedLevel === 'beginner' && qIdx === 19) {
      setIsPaywalled(true);
      return;
    }

    if(qIdx < shuffledQuestions.length - 1) {
      setQIdx(qIdx + 1);
      setShowExplanation(false);
      setShowAnswer(false);
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
            {isPaywalled ? (
              <div style={{background:"var(--bg-card)", borderRadius: 20, padding: 30, textAlign: "center", boxShadow: C.shadowCard, animation: "fadeUp .4s ease"}}>
                <div style={{fontSize: 50, marginBottom: 16}}>🔒</div>
                <h3 style={{fontFamily: "Exo 2", fontWeight: 900, fontSize: 20, color: C.text, marginBottom: 8}}>Batas Kuota Gratis Tercapai</h3>
                <p style={{fontSize: 13, color: C.textSec, marginBottom: 24}}>Anda telah menyelesaikan soal gratis di level Beginner. Berlangganan <b>ENGLISH LAB (SIMULASI GRAMMAR)</b> untuk membuka semua level dan kombinasi soal lainnya!</p>
                
                <div style={{display: "flex", flexDirection: "column", gap: 12}}>
                  <button className="tap" onClick={resetSelection} style={{background: "transparent", color: "#64748B", border: "2px solid #E2E8F0", padding: "14px 24px", borderRadius: 14, fontSize: 14, fontWeight: 800, cursor: "pointer", width: "100%"}}>
                    Kembali ke Menu
                  </button>
                </div>
              </div>
            ) : isFinished ? (
              <div style={{background:"var(--bg-card)", borderRadius: 20, padding: 30, textAlign: "center", boxShadow: C.shadowCard, animation: "fadeUp .4s ease"}}>
                <div style={{fontSize: 50, marginBottom: 16}}>🎉</div>
                <h3 style={{fontFamily: "Exo 2", fontWeight: 900, fontSize: 20, color: C.text, marginBottom: 8}}>Simulasi Selesai!</h3>
                <p style={{fontSize: 13, color: C.textSec, marginBottom: 24}}>Anda telah menguasai tingkat ini dengan sangat baik.</p>
                <button className="tap" onClick={resetSelection} style={{background: "linear-gradient(135deg, #3B82F6, #1E3A8A)", color: "#fff", border: "none", padding: "14px 24px", borderRadius: 14, fontSize: 14, fontWeight: 800, cursor: "pointer", width: "100%", boxShadow: "0 8px 24px rgba(37,99,235,.3)"}}>
                  🔙 Kembali ke Menu Level
                </button>
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
                  <div style={{fontSize: 14, color: C.textSec, fontStyle: "italic", marginBottom: 16, padding: "8px 12px", background: "#FEF2F2", borderRadius: 8, borderLeft: "3px solid #EF4444"}}>
                    💡 Pembahasan: "{shuffledQuestions[qIdx].explanation}"
                  </div>
                )}

                <div style={{display: "flex", gap: 12, marginBottom: 24}}>
                  <button className="tap" onClick={() => setShowExplanation(!showExplanation)} style={{background: "transparent", border: "1px dashed #94A3B8", color: "#64748B", padding: "6px 12px", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6}}>
                    🌍 {showExplanation ? "Sembunyikan Pembahasan" : "Lihat Pembahasan/Petunjuk"}
                  </button>
                  <button className="tap" onClick={() => setShowAnswer(true)} style={{background: "transparent", border: "1px solid #10B981", color: "#10B981", padding: "6px 12px", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6}}>
                    👁️ Lihat Jawaban
                  </button>
                </div>

                <div style={{display: "flex", flexDirection: "column", gap: 12}}>
                  {shuffledQuestions[qIdx].opts.map((opt, i) => {
                    const isCorrect = showAnswer && i === shuffledQuestions[qIdx].ans;
                    return (
                      <button 
                        key={i} 
                        className="tap" 
                        onClick={() => handleAnswer(i)}
                        style={{
                          background: isCorrect ? "#D1FAE5" : "var(--bg-main)", 
                          border: isCorrect ? `2px solid #10B981` : `2px solid #E2E8F0`, 
                          padding: "14px", 
                          borderRadius: 14, fontSize: 14, fontWeight: 700, 
                          color: isCorrect ? "#065F46" : C.text, 
                          textAlign: "left", cursor: "pointer", transition: "all .2s"
                        }}
                      >
                        {opt} {isCorrect && "✅"}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
