import midtransClient from 'midtrans-client';
// import admin from 'firebase-admin'; // TODO: Uncomment when Firebase Service Account is ready

// Inisialisasi Midtrans Core (untuk validasi signature key)
const coreApi = new midtransClient.CoreApi({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY || 'SB-Mid-server-DUMMY_KEY',
  clientKey: process.env.VITE_MIDTRANS_CLIENT_KEY || 'SB-Mid-client-DUMMY_KEY'
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const notificationJson = req.body;
    
    // Validasi notifikasi resmi dari Midtrans
    const statusResponse = await coreApi.transaction.notification(notificationJson);
    
    const orderId = statusResponse.order_id;
    const transactionStatus = statusResponse.transaction_status;
    const fraudStatus = statusResponse.fraud_status;

    console.log(`Transaction notification received. Order ID: ${orderId}. Transaction status: ${transactionStatus}. Fraud status: ${fraudStatus}`);

    let isSuccess = false;

    // Logika persetujuan pembayaran Midtrans
    if (transactionStatus == 'capture') {
      if (fraudStatus == 'challenge') {
        // Pembayaran butuh verifikasi manual
        isSuccess = false;
      } else if (fraudStatus == 'accept') {
        isSuccess = true;
      }
    } else if (transactionStatus == 'settlement') {
      // Pembayaran sukses (QRIS, GoPay, Transfer Bank yang sudah lunas)
      isSuccess = true;
    } else if (transactionStatus == 'cancel' || transactionStatus == 'deny' || transactionStatus == 'expire') {
      // Pembayaran gagal/kadaluarsa
      isSuccess = false;
    } else if (transactionStatus == 'pending') {
      // Menunggu pembayaran
      isSuccess = false;
    }

    if (isSuccess) {
      // TODO: Update status user di database Firebase Firestore
      // Contoh:
      // const userId = orderId.split('-')[1]; // Asumsi orderId = ORDER-{userId}-{timestamp}
      // await admin.firestore().collection('users').doc(userId).update({ proStatus: true });
      console.log(`✅ SUCCESS: Order ${orderId} is paid. User should be upgraded to PRO.`);
    }

    // Midtrans membutuhkan balasan 200 OK agar tidak mengirim ulang webhook
    res.status(200).json({ status: 'OK' });

  } catch (error) {
    console.error('Error handling Midtrans webhook:', error);
    res.status(500).json({ message: 'Failed to process webhook', error: error.message });
  }
}
