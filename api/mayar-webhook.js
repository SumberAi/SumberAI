import admin from 'firebase-admin';

// Parse service account safely
let serviceAccount;
try {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  }
} catch (error) {
  console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT", error);
}

// Initialize Firebase Admin if not already initialized
if (serviceAccount && !admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

// Helper function to find a key recursively in a nested object
function deepSearchKey(obj, keyToFind) {
  if (obj === null || typeof obj !== 'object') {
    return null;
  }
  if (keyToFind in obj) {
    return obj[keyToFind];
  }
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const result = deepSearchKey(obj[key], keyToFind);
      if (result) {
        return result;
      }
    }
  }
  return null;
}

export default async function handler(req, res) {
  // Hanya menerima metode POST dari Mayar
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const payload = req.body;
    console.log("Mayar Webhook Payload:", JSON.stringify(payload, null, 2));

    // Mencari ext_id (UID Firebase) dan pkg (Paket) dari data Webhook Mayar
    // Sistem pencarian mendalam ini tahan banting terhadap perubahan struktur data Mayar
    let uid = deepSearchKey(payload, 'ext_id');
    let pkg = deepSearchKey(payload, 'pkg');

    if (!uid) {
      console.warn("Webhook diabaikan: Tidak ada ext_id (UID Firebase) ditemukan di data.");
      return res.status(200).json({ status: 'ignored', message: 'No ext_id found' });
    }

    if (!admin.apps.length) {
      console.error("Firebase Admin belum terinisialisasi. Periksa FIREBASE_SERVICE_ACCOUNT.");
      return res.status(500).json({ error: 'Server misconfiguration' });
    }

    // Eksekusi pemberian status PRO ke Firebase Firestore
    const db = admin.firestore();
    const userRef = db.collection('users').doc(uid);

    // Cek sisa waktu aktif jika ada
    const userSnap = await userRef.get();
    const userData = userSnap.data() || {};
    const currentProStatus = userData.proStatus || {};
    
    const now = Date.now();
    const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;
    
    // Fungsi untuk memperpanjang langganan jika masih ada sisa
    const getNewExpiry = (currentExpiry) => {
      if (currentExpiry && currentExpiry > now) {
        return currentExpiry + THIRTY_DAYS;
      }
      return now + THIRTY_DAYS;
    };

    // Default status PRO
    let updates = { isPro: true };

    // Buka gembok sesuai paket yang dibeli dan set kedaluwarsanya
    if (pkg === 'grammar') {
      updates['proStatus.grammar'] = true;
      updates['proStatus.grammarExpiresAt'] = getNewExpiry(currentProStatus.grammarExpiresAt);
    } else if (pkg === 'english') {
      updates['proStatus.english'] = true;
      updates['proStatus.englishExpiresAt'] = getNewExpiry(currentProStatus.englishExpiresAt);
    } else if (pkg === 'full') {
      updates['proStatus.grammar'] = true;
      updates['proStatus.grammarExpiresAt'] = getNewExpiry(currentProStatus.grammarExpiresAt);
      updates['proStatus.english'] = true;
      updates['proStatus.englishExpiresAt'] = getNewExpiry(currentProStatus.englishExpiresAt);
      updates['proStatus.scholar'] = true; 
    } else {
      // Jika paket tidak spesifik, buka paket utama
      updates['proStatus.grammar'] = true;
      updates['proStatus.grammarExpiresAt'] = getNewExpiry(currentProStatus.grammarExpiresAt);
      updates['proStatus.english'] = true;
      updates['proStatus.englishExpiresAt'] = getNewExpiry(currentProStatus.englishExpiresAt);
    }

    await userRef.set(updates, { merge: true });

    console.log(`SUKSES: User ${uid} telah diupgrade menjadi PRO (Paket: ${pkg})`);
    return res.status(200).json({ status: 'success', uid, pkg });

  } catch (error) {
    console.error("Webhook Error:", error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
