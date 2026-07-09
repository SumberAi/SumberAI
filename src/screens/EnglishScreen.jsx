import React, { useState } from 'react';
import { C } from '../data/mockData';
import { Tag, CoinAnnouncement } from '../components/Shared';
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
  const [showCoinInfo, setShowCoinInfo] = useState(false);

  const isPro = gs?.proStatus?.grammar;
  const isEn = gs?.lang === 'en';

  const startQuiz = (level) => {
    if (!isPro && level !== 'beginner') {
      onNav("pricing");
      return;
    }
    
    const db = GRAMMAR_QUESTIONS;
    const limit = !isPro && level === 'beginner' ? 20 : 35;
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
      let message = isEn ? "Correct!" : "Benar!";
      const levelLimit = isPro ? 140 : 40; 
      const coinsToGive = isPro ? 4 : 2;
      let currentLevelCoins = weeklyObj[selectedLevel] || 0;

      if (currentLevelCoins < levelLimit) {
        weeklyObj[selectedLevel] = currentLevelCoins + coinsToGive;
        onCoinEarned(coinsToGive);
        message = isEn ? `Correct! +${coinsToGive} Coins` : `Benar! +${coinsToGive} Koin`;
      } else {
        message = isEn ? "Correct! (Weekly coin limit reached)" : "Benar! (Batas koin mingguan penuh)";
      }
      
      alert(message);
      
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
          
          {/* Header Premium */}
          <div style={{display: "flex", alignItems: "center", marginBottom: 32}}>
            <button className="tap" onClick={() => onNav('home')} style={{background: "#fff", border: "1px solid #E2E8F0", padding: "8px 16px", borderRadius: "99px", display: "flex", alignItems: "center", gap: 6, cursor: "pointer", marginRight: 16, boxShadow: "0 4px 12px rgba(0,0,0,0.04)", flexShrink: 0, color: "#1E293B", fontWeight: 800, fontSize: 13}}>
              ◀ {isEn ? "BACK" : "KEMBALI"}
            </button>
            <div style={{flex: 1}}>
              <div style={{display: "flex", alignItems: "center", gap: 8}}>
                <img src="./english_lab.jpeg" alt="English Lab" style={{ width: 32, height: 32, borderRadius: 10, objectFit: "cover" }} />
                <h2 style={{fontFamily: "Exo 2", fontWeight: 900, fontSize: 24, color: "#1E293B", margin: 0, letterSpacing: -0.5}}>ENGLISH LAB</h2>
              </div>
              <p style={{fontSize: 13, color: "#64748B", margin: "4px 0 0 0", lineHeight: 1.4}}>{isEn ? "Test your grammar comprehension!" : "Uji pemahaman tata bahasa Anda!"}</p>
            </div>
            <div style={{background: "#EFF6FF", color: "#2563EB", padding: "6px 12px", borderRadius: 12, fontWeight: 800, fontSize: 12, boxShadow: "0 4px 10px rgba(37,99,235,0.15)"}}>Lvl 2</div>
          </div>

        {!selectedLevel ? (
          <>
            <div style={{display: "flex", flexDirection: "column", gap: 16, animation: "fadeUp .4s ease"}}>
              {/* Beginner */}
              <div className="tap" onClick={() => startQuiz('beginner')} style={{background: "#fff", borderRadius: 24, padding: "20px", boxShadow: "0 12px 32px rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.15)", position: "relative", overflow: "hidden"}}>
                <div style={{position: "absolute", top: 0, left: 0, width: "100%", height: 5, background: "linear-gradient(90deg, #059669, #34D399)"}}></div>
                <div style={{display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8}}>
                  <div style={{display: "flex", alignItems: "center", gap: 12}}>
                    <div style={{width: 40, height: 40, background: "#ECFDF5", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20}}>🌱</div>
                    <h3 style={{fontFamily: "Exo 2", fontWeight: 900, fontSize: 18, color: "#1E293B", margin: 0}}>Beginner</h3>
                  </div>
                  {!isPro && <span style={{fontSize: 11, background: "#FEF3C7", color: "#F59E0B", padding: "4px 10px", borderRadius: 99, fontWeight: 800}}>Free</span>}
                </div>
                <p style={{fontSize: 13, color: "#64748B", margin: 0, lineHeight: 1.5}}>{isEn ? "Basic grammar questions and sentence structures. Perfect for warmup." : "Soal dasar tata bahasa dan struktur kalimat. Cocok untuk pemanasan."}</p>
              </div>

              {/* Intermediate */}
              <div className="tap" onClick={() => startQuiz('intermediate')} style={{background: "#fff", borderRadius: 24, padding: "20px", boxShadow: "0 12px 32px rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.15)", position: "relative", overflow: "hidden", opacity: isPro ? 1 : 0.6}}>
                <div style={{position: "absolute", top: 0, left: 0, width: "100%", height: 5, background: "linear-gradient(90deg, #D97706, #FCD34D)"}}></div>
                <div style={{display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8}}>
                  <div style={{display: "flex", alignItems: "center", gap: 12}}>
                    <div style={{width: 40, height: 40, background: "#FFFBEB", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20}}>🚀</div>
                    <h3 style={{fontFamily: "Exo 2", fontWeight: 900, fontSize: 18, color: "#1E293B", margin: 0}}>Intermediate</h3>
                  </div>
                  {!isPro && <span style={{fontSize: 18}}>🔒</span>}
                </div>
                <p style={{fontSize: 13, color: "#64748B", margin: "0 0 12px 0", lineHeight: 1.5}}>{isEn ? "Mastery of complex Tenses, conditional clauses, and exceptions." : "Penguasaan Tenses kompleks, klausa bersyarat, dan pengecualian."}</p>
                {!isPro && <div style={{background: "#FEF2F2", color: "#EF4444", fontSize: 11, fontWeight: 700, padding: "6px 12px", borderRadius: 8, display: "inline-block"}}>{isEn ? "Exclusive for PRO Users" : "Eksklusif Pelanggan PRO"}</div>}
              </div>

              {/* Advanced */}
              <div className="tap" onClick={() => startQuiz('advanced')} style={{background: "#fff", borderRadius: 24, padding: "20px", boxShadow: "0 12px 32px rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.15)", position: "relative", overflow: "hidden", opacity: isPro ? 1 : 0.6}}>
                <div style={{position: "absolute", top: 0, left: 0, width: "100%", height: 5, background: "linear-gradient(90deg, #DC2626, #F87171)"}}></div>
                <div style={{display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8}}>
                  <div style={{display: "flex", alignItems: "center", gap: 12}}>
                    <div style={{width: 40, height: 40, background: "#FEF2F2", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20}}>🔥</div>
                    <h3 style={{fontFamily: "Exo 2", fontWeight: 900, fontSize: 18, color: "#1E293B", margin: 0}}>Advanced</h3>
                  </div>
                  {!isPro && <span style={{fontSize: 18}}>🔒</span>}
                </div>
                <p style={{fontSize: 13, color: "#64748B", margin: "0 0 12px 0", lineHeight: 1.5}}>{isEn ? "Advanced questions featuring Inversions, Subjunctives, and complex structures." : "Soal tingkat lanjut dengan Inversi, Subjunctive, dan struktur kompleks."}</p>
                {!isPro && <div style={{background: "#FEF2F2", color: "#EF4444", fontSize: 11, fontWeight: 700, padding: "6px 12px", borderRadius: 8, display: "inline-block"}}>{isEn ? "Exclusive for PRO Users" : "Eksklusif Pelanggan PRO"}</div>}
              </div>
            </div>
          </>
        ) : (
          <>
            {isFinished ? (
              <div style={{background:"var(--bg-card)", borderRadius: 20, padding: 30, textAlign: "center", boxShadow: C.shadowCard, animation: "fadeUp .4s ease"}}>
                <div style={{fontSize: 50, marginBottom: 16}}>✅</div>
                <h3 style={{fontFamily: "Exo 2", fontWeight: 900, fontSize: 20, color: C.text, marginBottom: 8}}>{isEn ? "Session Completed!" : "Sesi Selesai!"}</h3>
                <p style={{fontSize: 13, color: C.textSec, marginBottom: 24}}>{isEn ? `You have completed ${shuffledQuestions.length} questions.` : `Anda telah menyelesaikan ${shuffledQuestions.length} soal.`}</p>
                
                <div style={{background: "#F8FAFC", padding: 16, borderRadius: 16, marginBottom: 24}}>
                  <div style={{fontSize: 12, fontWeight: 800, color: C.blue, marginBottom: 8}}>{isEn ? `WEEKLY COIN INFO (${selectedLevel.toUpperCase()})` : `INFO KOIN MINGGUAN (${selectedLevel.toUpperCase()})`}</div>
                  <div style={{fontSize: 24, fontWeight: 900, color: "#F59E0B", marginBottom: 8}}>
                    {(typeof gs?.engLabWeeklyCoins === 'object' ? gs.engLabWeeklyCoins[selectedLevel] : 0) || 0} / {isPro ? 70 : 40} {isEn ? "Coins" : "Koin"}
                  </div>
                  
                  {isPro && (
                    <div style={{fontSize: 12, fontWeight: 700, color: "#475569", marginBottom: 12}}>
                      {isEn ? "Total Coins All Levels:" : "Total Koin Semua Level:"} {Object.values(gs?.engLabWeeklyCoins || {}).reduce((a, b) => a + (Number(b) || 0), 0)} / 210
                    </div>
                  )}

                  {((typeof gs?.engLabWeeklyCoins === 'object' ? gs.engLabWeeklyCoins[selectedLevel] : 0) >= (isPro ? 70 : 40)) && gs?.engLabResetDate ? (
                    <div style={{fontSize: 12, color: "#64748B", fontWeight: 600}}>
                      {isEn ? "Coins for this level will reset on:" : "Koin level ini akan direset pada:"}<br/>
                      <span style={{color: C.text, fontWeight: 800}}>
                        {new Date(gs.engLabResetDate + (7 * 24 * 60 * 60 * 1000)).toLocaleDateString(isEn ? 'en-US' : 'id-ID', { weekday: 'long', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ) : (
                    <div style={{fontSize: 12, color: "#64748B", fontWeight: 600}}>{isEn ? "There are still coins left to earn this week! Play again to collect them." : "Masih ada sisa koin di level ini minggu ini! Main lagi untuk mengumpulkannya."}</div>
                  )}
                </div>

                <div style={{display: "flex", flexDirection: "column", gap: 12}}>
                  <button className="tap" onClick={() => startQuiz(selectedLevel)} style={{background: "linear-gradient(135deg, #3B82F6, #1E3A8A)", color: "#fff", border: "none", padding: "14px 24px", borderRadius: 14, fontSize: 14, fontWeight: 800, cursor: "pointer", width: "100%", boxShadow: "0 8px 24px rgba(37,99,235,.3)"}}>
                    🔄 {isEn ? "Play Again (Practice)" : "Main Lagi (Latihan)"}
                  </button>
                  <button className="tap" onClick={resetSelection} style={{background: "transparent", color: "#64748B", border: "2px solid #E2E8F0", padding: "14px 24px", borderRadius: 14, fontSize: 14, fontWeight: 800, cursor: "pointer", width: "100%"}}>
                    {isEn ? "Back to Menu" : "Kembali ke Menu"}
                  </button>
                </div>
              </div>
            ) : (
              <div style={{background:"var(--bg-card)", borderRadius: 20, padding: 24, boxShadow: C.shadowCard, animation: "fadeUp .4s ease"}}>
                <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12}}>
                  <div style={{fontSize: 12, fontWeight: 700, color: C.blue}}>{isEn ? `QUESTION ${qIdx + 1} OF ${shuffledQuestions.length}` : `PERTANYAAN ${qIdx + 1} DARI ${shuffledQuestions.length}`}</div>
                  <button className="tap" onClick={resetSelection} style={{background: "#FEE2E2", color: "#DC2626", border: "none", padding: "4px 10px", borderRadius: 8, fontSize: 11, fontWeight: 800, cursor: "pointer"}}>{isEn ? "Exit" : "Keluar"}</button>
                </div>
                
                <h3 style={{fontFamily: "Exo 2", fontWeight: 800, fontSize: 18, color: C.text, marginBottom: showExplanation ? 8 : 16, lineHeight: 1.4, whiteSpace: "pre-line"}}>
                  {shuffledQuestions[qIdx].q}
                </h3>
                 {showExplanation && (
                  <div style={{fontSize: 14, color: C.textSec, fontStyle: "italic", marginBottom: 16, padding: "12px 16px", background: "#FEF2F2", borderRadius: 12, borderLeft: "4px solid #EF4444", animation: "fadeUp .3s ease"}}>
                    <div style={{fontWeight: 800, color: "#DC2626", marginBottom: 4}}>{isEn ? "Incorrect Answer. Here is the explanation:" : "Jawaban Salah. Berikut penjelasannya:"}</div>
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
                    {isEn ? "Next Question ➔" : "Lanjut ke Soal Berikutnya ➔"}
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
