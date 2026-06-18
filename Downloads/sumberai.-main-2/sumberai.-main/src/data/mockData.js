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

export const HEROES = [
  { id:"thaha", name:"Sultan Thaha Saifuddin", title:"The Defiant King", role:"Guardian",
    icon:"👑", gradColor:"#D97706", grad:"linear-gradient(135deg,#D97706,#F59E0B,#FCD34D)",
    rarity:"Legendary", hp:140, rarity_color:"#D97706",
    lore:"Pemimpin Kesultanan Jambi yang menolak tunduk pada penjajah VOC hingga akhir hayat.",
    skills:[
      {name:"Sabda Raja",icon:"📯",dmg:[20,28],heal:0,cd:0,type:"atk",desc:"Perintah keramat menghantam musuh"},
      {name:"Tameng Keraton",icon:"🛡️",dmg:[0,0],heal:30,cd:2,type:"heal",desc:"Benteng Jambi melindungimu"},
      {name:"Semangat Perlawanan",icon:"⚡",dmg:[38,52],heal:0,cd:3,type:"ultimate",desc:"Amarah sang raja meledak dahsyat"},
    ]},
  { id:"mattaher", name:"Raden Mattaher", title:"Blade of the Jungle", role:"Warrior",
    icon:"⚔️", gradColor:"#DC2626", grad:"linear-gradient(135deg,#DC2626,#F87171,#FBBF24)",
    rarity:"Epic", hp:110, rarity_color:"#7C3AED",
    lore:"Panglima perang Jambi yang menguasai seni berperang hutan rimba dan gerilya.",
    skills:[
      {name:"Pedang Rimba",icon:"🗡️",dmg:[26,36],heal:0,cd:0,type:"atk",desc:"Serangan cepat tak terduga"},
      {name:"Gerilya Hutan",icon:"🌿",dmg:[15,22],heal:12,cd:1,type:"mixed",desc:"Menghindar dan balik menyerang"},
      {name:"Pertempuran Terakhir",icon:"🔥",dmg:[50,65],heal:-8,cd:3,type:"ultimate",desc:"Serangan nekat penuh tenaga"},
    ]},
  { id:"sina", name:"Ratumas Sina", title:"Spirit of the River", role:"Mystic",
    icon:"🌊", gradColor:"#7C3AED", grad:"linear-gradient(135deg,#7C3AED,#A78BFA,#06B6D4)",
    rarity:"Epic", hp:95, rarity_color:"#7C3AED",
    lore:"Perempuan sakti penjaga Sungai Batanghari dengan ilmu kebatinan luar biasa.",
    skills:[
      {name:"Kutukan Batanghari",icon:"💧",dmg:[24,32],heal:0,cd:0,type:"atk",desc:"Sihir sungai melemahkan musuh"},
      {name:"Penawar Jiwa",icon:"✨",dmg:[0,0],heal:35,cd:2,type:"heal",desc:"Pulihkan semangat juang"},
      {name:"Sihir Leluhur",icon:"🌀",dmg:[44,58],heal:0,cd:3,type:"ultimate",desc:"Kekuatan leluhur menghancurkan"},
    ]},
];

export const ENEMIES = [
  {id:"e1",name:"Komisaris van Dijk",title:"VOC Tax Collector",icon:"🦅",hp:75,reward:50,
   difficulty:"Mudah",dColor:C.green,attacks:["Toeslagbevel","Koloniale Wet"],dmg:[10,16]},
  {id:"e2",name:"Mayor de Bruijne",title:"VOC Field Commander",icon:"⚔️",hp:100,reward:80,
   difficulty:"Menengah",dColor:C.orange,attacks:["Serangan Kavaleri","Formasi Infantri","Meriam VOC"],dmg:[16,25]},
  {id:"e3",name:"Jenderal Rochussen",title:"Governor-General",icon:"👹",hp:130,reward:120,
   difficulty:"Sulit",dColor:C.red,attacks:["Ultimatum Penjajah","Tembakan Salvo","Pengepungan Total"],dmg:[20,30]},
];

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

export const NEG_SCENARIOS = [
  {id:"n1",icon:"☕",title:"Ekspor Kopi Kerinci",subtitle:"Negosiasi dengan buyer dari Australia",coins:50,
   context:"Kamu eksportir Kopi Arabika Kerinci dari Jambi. Buyer Melbourne Australia tertarik beli 500kg/bulan. Harga awal: Rp180.000/kg. Negosiasikan harga, kualitas, dan syarat pengiriman dalam Bahasa Inggris.",
   aiRole:"You are James Mitchell, a specialty coffee buyer from Melbourne. Target: AUD 12/kg (~Rp120,000), min order 300kg/month, need quality certification. Be professional but firm in negotiation."},
  {id:"n2",icon:"🧣",title:"Pitch Batik Jambi ke Singapura",subtitle:"Presentasi ke retail Asia",coins:60,
   context:"Kamu mewakili Rumah Batik Angso Duo dari Jambi. Retail store di Orchard Road Singapore mau tampilkan batik Nusantara. Presentasikan nilai budaya dan bisnis batik Jambi dalam Bahasa Inggris.",
   aiRole:"You are Sarah Tan, buyer for a premium lifestyle store in Singapore. Budget: SGD 80-120/piece, MOQ questions, need cultural story. Ask professional questions and negotiate."},
  {id:"n3",icon:"🍯",title:"Distribusi Madu ke Jakarta",subtitle:"Deal dengan distributor nasional",coins:45,
   context:"Kamu mewakili Lebah Rimbo Asli, produsen Madu Sialang premium Sarolangun. Distributor besar Jakarta ingin 200 botol/bulan. Negosiasikan harga, eksklusivitas, dan syarat pembayaran dalam Bahasa Inggris.",
   aiRole:"You are Budi Santoso, procurement manager Jakarta. Want 20% discount, 60-day payment terms, exclusive Jakarta rights. Negotiate firmly but respectfully."},
];

export const ACADEMY_COURSES = [
  {id:"c1",icon:"🤖",title:"Pengenalan AI",sub:"Apa itu AI, ML, Deep Learning?",coins:30,level:"Pemula",
   grad:"linear-gradient(135deg,#2563EB,#60A5FA)",color:C.blue},
  {id:"c2",icon:"💡",title:"Prompt Engineering",sub:"Cara membuat prompt AI efektif",coins:40,level:"Menengah",
   grad:"linear-gradient(135deg,#7C3AED,#A78BFA)",color:C.purple},
  {id:"c3",icon:"📊",title:"AI untuk Bisnis UMKM",sub:"Implementasi AI di usaha kecil",coins:45,level:"Lanjutan",
   grad:"linear-gradient(135deg,#059669,#34D399)",color:C.green},
  {id:"c4",icon:"🎯",title:"Karir di Era AI",sub:"Profesi, skill, roadmap karir AI",coins:35,level:"Menengah",
   grad:"linear-gradient(135deg,#EA580C,#FBBF24)",color:C.orange},
];

export const UMKM_PRODUCTS = [
  {id:1,name:"Batik Tulis Jambi",umkm:"Rumah Batik Angso Duo",cat:"Fashion",price:150,img:"🧣",
   desc:"Batik tulis asli motif durian pecah khas Jambi, 100×200cm",sold:34,loc:"Kota Jambi",grad:"linear-gradient(135deg,#DB2777,#F472B6)"},
  {id:2,name:"Kopi Arabika Kerinci",umkm:"Kopi Gunung Tujuh",cat:"Kuliner",price:80,img:"☕",
   desc:"Kopi arabika single origin Kerinci, sangrai medium, 250g",sold:67,loc:"Kerinci",grad:"linear-gradient(135deg,#92400E,#D97706)"},
  {id:3,name:"Madu Sialang Hutan",umkm:"Lebah Rimbo Asli",cat:"Kesehatan",price:120,img:"🍯",
   desc:"Madu hutan asli dari lebah sialang, 500ml, tanpa pengawet",sold:21,loc:"Sarolangun",grad:"linear-gradient(135deg,#D97706,#FCD34D)"},
  {id:4,name:"Keripik Tempoyak",umkm:"Dapur Melayu Jambi",cat:"Kuliner",price:45,img:"🥟",
   desc:"Keripik rasa tempoyak khas Jambi, 150g",sold:112,loc:"Muaro Jambi",grad:"linear-gradient(135deg,#EA580C,#FB923C)"},
  {id:5,name:"Tas Rotan Anyam",umkm:"Kerajinan Sungai Bahar",cat:"Kerajinan",price:200,img:"👜",
   desc:"Tas anyaman rotan handmade motif Jambi, ukuran medium",sold:19,loc:"Batanghari",grad:"linear-gradient(135deg,#059669,#6EE7B7)"},
  {id:6,name:"Dodol Durian Jambi",umkm:"UMKM Manis Nusantara",cat:"Kuliner",price:60,img:"🍬",
   desc:"Dodol durian asli Jambi, 200g tanpa pengawet",sold:88,loc:"Tanjab Barat",grad:"linear-gradient(135deg,#7C3AED,#C4B5FD)"},
  {id:7,name:"Songket Jambi Mini",umkm:"Tenun Melayu Jambi",cat:"Fashion",price:180,img:"🎀",
   desc:"Kain songket motif bungo pacar, 60×90cm",sold:14,loc:"Kota Jambi",grad:"linear-gradient(135deg,#DB2777,#FBBF24)"},
  {id:8,name:"Sambal Tempoyak",umkm:"Bumbu Nusantara Jambi",cat:"Kuliner",price:35,img:"🌶️",
   desc:"Sambal tempoyak siap saji, botol 250ml",sold:76,loc:"Sungai Penuh",grad:"linear-gradient(135deg,#DC2626,#F97316)"},
];

export const MOCK_ACADEMY_QS = {
  c1: [
    {q:"Apa itu Artificial Intelligence (AI)?", emoji:"🤖", opts:["Kecerdasan buatan manusia", "Kecerdasan buatan komputer/mesin", "Kecerdasan alien", "Tidak ada yang benar"], correct:1, exp:"AI adalah simulasi kecerdasan manusia yang dimodelkan di dalam mesin."},
    {q:"Manakah yang termasuk contoh penerapan AI?", emoji:"📱", opts:["Kalkulator biasa", "Sistem rekomendasi YouTube", "Jam dinding", "Radio FM"], correct:1, exp:"YouTube menggunakan AI untuk merekomendasikan video sesuai minat pengguna."},
    {q:"Apa kepanjangan dari ML?", emoji:"🧠", opts:["Machine Learning", "Mega Learning", "Machine Language", "Micro Learning"], correct:0, exp:"ML adalah singkatan dari Machine Learning, sebuah cabang dari AI."},
    {q:"Deep Learning terinspirasi dari struktur apa?", emoji:"🧬", opts:["Struktur daun", "Jaringan saraf otak manusia (Neural Networks)", "Sistem tata surya", "Mesin mobil"], correct:1, exp:"Deep Learning menggunakan Artificial Neural Networks yang meniru otak manusia."},
    {q:"AI dapat membantu mahasiswa dalam...", emoji:"🎓", opts:["Mengerjakan ujian agar bisa menyontek", "Mempercepat riset dan analisis data", "Menggantikan dosen mengajar", "Membuat mahasiswa malas"], correct:1, exp:"AI sangat berguna untuk asisten riset dan meningkatkan efisiensi belajar."}
  ],
  c2: [
    {q:"Apa itu Prompt Engineering?", emoji:"⌨️", opts:["Seni merakit komputer", "Teknik mendesain instruksi untuk AI", "Bahasa pemrograman baru", "Cara membuat virus komputer"], correct:1, exp:"Prompt engineering adalah cara menulis instruksi yang tepat agar AI memberikan hasil terbaik."},
    {q:"Bagaimana contoh prompt yang baik?", emoji:"💡", opts:["'Tulis esai'", "'Buatkan esai 500 kata tentang ekonomi makro dengan gaya bahasa formal'", "'Tolong'", "'Apa saja'"], correct:1, exp:"Prompt yang baik harus spesifik, jelas, dan memberikan konteks (panjang, topik, gaya bahasa)."},
    {q:"Jika AI memberikan jawaban yang salah, apa yang harus dilakukan?", emoji:"🔄", opts:["Membuang komputernya", "Menerima saja", "Merevisi prompt agar lebih jelas dan spesifik", "Melaporkan ke polisi"], correct:2, exp:"Iterasi prompt sangat penting untuk mendapatkan hasil yang akurat."},
    {q:"Manakah dari ini yang merupakan 'Persona' dalam prompt?", emoji:"🎭", opts:["'Tuliskan resep kue'", "'Bertindaklah sebagai koki profesional dengan pengalaman 20 tahun'", "'Format jawaban sebagai tabel'", "'Apa itu AI?'"], correct:1, exp:"Persona memberikan peran/karakter tertentu pada AI untuk menyesuaikan gaya jawabannya."},
    {q:"Pentingkah memberikan batasan (constraints) pada prompt?", emoji:"📏", opts:["Sangat penting agar jawaban terarah", "Tidak penting", "Membingungkan AI", "Hanya buang-buang waktu"], correct:0, exp:"Batasan seperti 'maksimal 3 paragraf' atau 'jangan gunakan kata X' membantu memfokuskan hasil."}
  ],
  c3: [
    {q:"Bagaimana AI dapat membantu UMKM Jambi?", emoji:"🏪", opts:["Membuat UMKM bangkrut", "Mengotomatisasi balas pesan pelanggan dan analisis tren pasar", "Menggantikan semua pekerja manusia", "Tidak ada gunanya"], correct:1, exp:"Chatbot AI dan analisis data sangat membantu efisiensi operasional UMKM."},
    {q:"Contoh penggunaan AI untuk pemasaran (marketing) UMKM adalah...", emoji:"📈", opts:["Membuat desain poster otomatis", "Membuat kopi secara fisik", "Mengantarkan barang", "Mencetak struk belanja"], correct:0, exp:"Generative AI seperti Canva AI atau Midjourney bisa membantu membuat materi promosi visual."},
    {q:"Apa keuntungan menggunakan Chatbot AI bagi UMKM?", emoji:"💬", opts:["Pelanggan marah", "Layanan pelanggan 24/7 tanpa henti", "Biaya operasional membengkak", "Menghapus akun media sosial"], correct:1, exp:"Chatbot dapat melayani pertanyaan pelanggan kapan saja tanpa henti."},
    {q:"Apakah UMKM memerlukan modal milyaran untuk menggunakan AI saat ini?", emoji:"💰", opts:["Ya, AI sangat mahal", "Tidak, banyak tools AI yang terjangkau atau bahkan gratis (ChatGPT, Canva AI)", "Ya, harus membeli superkomputer", "Tidak tahu"], correct:1, exp:"Saat ini banyak solusi AI berbasis cloud (SaaS) yang ramah di kantong UMKM."},
    {q:"Data apa yang paling berguna untuk dianalisis oleh AI di sebuah UMKM kuliner?", emoji:"🍔", opts:["Warna cat dinding toko", "Pola pembelian pelanggan dan menu terlaris", "Nama hewan peliharaan pelanggan", "Merek sapu yang digunakan"], correct:1, exp:"Analisis pola pembelian dapat memprediksi stok barang dan promo yang efektif."}
  ],
  c4: [
    {q:"Apakah AI akan menggantikan SEMUA pekerjaan manusia?", emoji:"💼", opts:["Ya, kita semua akan menganggur", "Tidak, AI akan mengubah cara kerja dan memunculkan profesi baru", "AI hanya mitos", "Ya, dalam 1 tahun ke depan"], correct:1, exp:"AI bersifat augmentatif (membantu), bukan menggantikan sepenuhnya. Profesi baru akan terus bermunculan."},
    {q:"Profesi baru apa yang sangat populer berkat kehadiran Generative AI?", emoji:"👨‍💻", opts:["Tukang pos", "Prompt Engineer", "Tukang ketik mesin tik", "Pengantar koran"], correct:1, exp:"Prompt Engineer menjadi profesi yang dicari untuk memaksimalkan potensi AI model besar (LLMs)."},
    {q:"Skill apa yang paling penting dimiliki mahasiswa di era AI?", emoji:"🧠", opts:["Menghafal buku teks", "Kemampuan adaptasi, berpikir kritis, dan problem solving", "Mengetik cepat", "Tidak perlu skill, AI yang mengerjakan semuanya"], correct:1, exp:"Karena AI bisa mengerjakan tugas repetitif, pemikiran kritis manusia menjadi semakin berharga."},
    {q:"Apa itu 'AI Ethics' (Etika AI)?", emoji:"⚖️", opts:["Cara mematikan AI", "Panduan moral dalam mengembangkan dan menggunakan AI agar tidak bias dan membahayakan", "Nama perusahaan pembuat AI", "Bahasa pemrograman AI"], correct:1, exp:"Etika AI memastikan algoritma digunakan secara adil, aman, dan bertanggung jawab."},
    {q:"Mengapa belajar tentang AI penting terlepas dari apa jurusan kuliahmu?", emoji:"🎓", opts:["Karena diwajibkan", "Karena AI akan menjadi 'alat bantu universal' seperti internet di segala bidang kerja", "Hanya untuk gaya", "Supaya terlihat pintar"], correct:1, exp:"Sama seperti menggunakan komputer/internet, kemampuan menggunakan AI akan menjadi literasi dasar."}
  ]
};
