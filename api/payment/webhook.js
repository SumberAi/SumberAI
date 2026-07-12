import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';

// 1. Inisialisasi Firebase Admin menggunakan Kunci Rahasia dari Environment Variable Vercel
if (admin.getApps().length === 0) {
  try {
    // Kita akan meminta Vercel untuk membaca rahasia dari variabel FIREBASE_SERVICE_ACCOUNT
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log("Firebase Admin initialized successfully.");
  } catch (error) {
    console.error("Gagal menginisialisasi Firebase Admin. Pastikan FIREBASE_SERVICE_ACCOUNT valid JSON di Vercel.", error.message);
  }
}

export default async function handler(req, res) {
  // Hanya menerima metode POST dari Mayar
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const payload = req.body;
    console.log("Webhook Mayar diterima:", JSON.stringify(payload, null, 2));

    // 2. Mengecek status pembayaran dari Mayar
    // Mayar bisa menaruh status di payload.status atau payload.data.status
    const status = payload.data?.status || payload.status;
    const isSuccess = (status === 'SETTLED' || status === 'SUCCESS' || status === 'paid' || status === 'success');
    
    if (isSuccess) {
       // 3. Mencari UID pengguna (ext_id) yang kita titipkan di link pembayaran
       let extId = payload.data?.ext_id || payload.ext_id || payload.customer?.ext_id;
       
       // JIKA Mayar tidak mengirimkan ext_id, kita cari berdasarkan Email pembeli!
       if (!extId) {
         const customerEmail = payload.data?.customer?.email || payload.customer?.email;
         if (customerEmail) {
           console.log(`Mencari pengguna dengan email: ${customerEmail}`);
           const usersRef = getFirestore().collection('users');
           const snapshot = await usersRef.where('email', '==', customerEmail).get();
           if (!snapshot.empty) {
             extId = snapshot.docs[0].id; // Menggunakan UID dari dokumen yang ditemukan
             console.log(`Ditemukan! UID pengguna: ${extId}`);
           }
         }
       }

       if (!extId) {
         console.error("❌ Gagal: Tidak ada ext_id (UID) maupun Email di dalam webhook Mayar. Tidak tahu harus meng-upgrade siapa.");
         return res.status(200).json({ status: 'OK', message: 'No ext_id found' });
       }

       // 4. Mencari paket apa yang dibeli (pkg)
       let pkg = payload.data?.pkg || payload.pkg || payload.customer?.pkg;
       
       // JIKA Mayar juga membuang 'pkg', kita akan tebak dari NAMA PRODUK yang dibeli!
       if (!pkg) {
         const productName = (payload.data?.product?.name || payload.data?.link?.name || payload.data?.title || payload.title || payload.data?.name || payload.name || "").toLowerCase();
         console.log(`Parameter 'pkg' hilang. Mencoba mendeteksi dari nama produk Mayar: "${productName}"`);
         
         if (productName.includes('lab') || productName.includes('grammar')) {
           pkg = 'grammar';
         } else if (productName.includes('tutor') || productName.includes('english tutor')) {
           pkg = 'english';
         } else if (productName.includes('full') || productName.includes('bundle')) {
           pkg = 'full';
         }
       }

       const updateData = {};
       
       if (pkg === 'grammar') {
         updateData['proStatus.grammar'] = true;
         console.log("➡️ Membuka kunci: English Lab (Grammar)");
       } else if (pkg === 'english') {
         updateData['proStatus.english'] = true;
         console.log("➡️ Membuka kunci: AI English Tutor");
       } else if (pkg === 'full') {
         updateData['proStatus.grammar'] = true;
         updateData['proStatus.english'] = true;
         console.log("➡️ Membuka kunci: FULL BUNDLE (Semua Fitur)");
       } else {
         console.warn(`⚠️ Nama produk tidak dikenali: "${pkg}". Mengaktifkan Full Bundle sebagai cadangan.`);
         updateData['proStatus.grammar'] = true;
         updateData['proStatus.english'] = true;
       }

       // 5. Mengubah data di Firebase Firestore
       console.log(`🔄 Memproses Upgrade PRO untuk User UID: ${extId}`, updateData);
       await getFirestore().collection('users').doc(extId).update(updateData);
       console.log("✅ SUKSES: Akun berhasil di-upgrade ke PRO!");
       
    } else {
       console.log(`ℹ️ Status pembayaran belum lunas atau kedaluwarsa: ${status}`);
    }

    // Selalu balas 200 OK ke Mayar agar mereka tidak mencoba mengirim ulang terus-menerus
    res.status(200).json({ status: 'OK' });

  } catch (error) {
    console.error("🔥 Error saat memproses webhook:", error);
    res.status(500).json({ error: error.message });
  }
}
