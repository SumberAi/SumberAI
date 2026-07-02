export const C = {
  bg:"var(--bg-main)", bgWhite:"var(--bg-card)", bgCard:"var(--bg-card)",
  blue:"#2563EB", blueMid:"#3B82F6", blueLt:"#EFF6FF", bluePale:"#DBEAFE",
  blueGrad:"linear-gradient(135deg,#1D4ED8,#3B82F6,#06B6D4)",
  blueGrad2:"linear-gradient(135deg,#2563EB,#60A5FA)",
  cyan:"#0891B2", cyanLt:"#ECFEFF",
  purple:"#7C3AED", purpleLt:"#EDE9FE", purpleMid:"#8B5CF6",
  purpleGrad:"linear-gradient(135deg,#7C3AED,#A78BFA)",
  pink:"#DB2777", pinkLt:"#FDF2F8",
  orange:"#EA580C", orangeLt:"#FFF7ED",
  gold:"#D97706", goldBr:"#F59E0B", goldLt:"#FFFBEB", goldPale:"#FEF3C7",
  goldGrad:"linear-gradient(135deg,#D97706,#F59E0B,#FCD34D)",
  green:"#059669", greenLt:"#ECFDF5", greenPale:"#D1FAE5",
  greenGrad:"linear-gradient(135deg,#059669,#34D399)",
  red:"#DC2626", redLt:"#FEF2F2", redPale:"#FEE2E2",
  text:"var(--text-main)", textSec:"var(--text-sec)", textMute:"var(--text-mute)",
  border:"var(--border-color)", borderColor:"var(--border-color)",
  shadowBlue:"0 8px 32px rgba(37,99,235,.15)", shadowCard:"var(--shadow-card)",
  rainbow:"linear-gradient(135deg,#2563EB,#7C3AED,#DB2777,#EA580C,#D97706)",
  rainbowBlue:"linear-gradient(135deg,#1D4ED8 0%,#3B82F6 30%,#06B6D4 60%,#7C3AED 100%)",
  heroGrad:"linear-gradient(145deg,#1D4ED8 0%,#2563EB 40%,#7C3AED 75%,#06B6D4 100%)",
};



export const SPEAKING_CHALLENGES = [
  {id:"s1",cat:"Daily English",icon:"💬",title:"Greetings & Introductions",coins:15,
   challenges:[
    {q:"Terjemahkan: 'Nama saya dari Jambi, saya mahasiswa Digital Business yang tertarik di bidang teknologi dan kewirausahaan.'",type:"translate"},
    {q:"Fill in the blank: 'Nice to ____ you! I hope we can _______ together on this project.'",type:"fillin",ans:["meet","collaborate"]},
    {q:"Tulis 2 kalimat bahasa Inggris yang sopan untuk mengakhiri percakapan profesional.",type:"open"},
   ]},
  {id:"s2",cat:"Professional English",icon:"💼",title:"Workplace & Business",coins:20,
   challenges:[
    {q:"Terjemahkan: 'Saya ingin mempresentasikan ide bisnis baru yang dapat meningkatkan penjualan UMKM Jambi secara digital.'",type:"translate"},
    {q:"Fill in: 'Could you please _____ the deadline? I need more time to _____ the report.'",type:"fillin",ans:["extend","finalize"]},
    {q:"Tulis subject email profesional untuk: meminta jadwal meeting dengan calon investor.",type:"open"},
   ]},
  {id:"s3",cat:"AI & Tech",icon:"🤖",title:"AI & Technology English",coins:25,
   challenges:[
    {q:"Terjemahkan: 'Kecerdasan buatan dapat membantu UMKM kecil bersaing di pasar global melalui otomatisasi dan analisis data.'",type:"translate"},
    {q:"Fill in: 'This machine learning _____ was trained on millions of data _____ to improve accuracy.'",type:"fillin",ans:["model","points"]},
    {q:"Jelaskan dalam 2 kalimat Bahasa Inggris: Mengapa prompt engineering penting bagi mahasiswa di era AI?",type:"open"},
   ]},
];

export const INTERVIEW_QS = [
  {q:"Tell me about yourself.",tips:"Sebutkan latar belakang, skill, dan tujuan karir.",coins:15},
  {q:"What are your greatest strengths?",tips:"Berikan contoh konkret beserta hasil nyata.",coins:15},
  {q:"Why do you want to work here?",tips:"Riset perusahaan dan selaraskan dengan nilai mereka.",coins:15},
  {q:"Where do you see yourself in 5 years?",tips:"Tunjukkan ambisi tapi juga komitmen.",coins:20},
  {q:"Describe a challenge you overcame.",tips:"Gunakan metode STAR: Situation, Task, Action, Result.",coins:20},
  {q:"What are your weaknesses?",tips:"Tunjukkan self-awareness dan langkah perbaikannya.",coins:15},
  {q:"Why should we hire you?",tips:"Ringkas unique value proposition kamu.",coins:20},
];
