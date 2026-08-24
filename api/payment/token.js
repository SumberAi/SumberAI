import midtransClient from 'midtrans-client';

// Inisialisasi Midtrans Snap
const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY || 'SB-Mid-server-DUMMY_KEY',
  clientKey: process.env.VITE_MIDTRANS_CLIENT_KEY || 'SB-Mid-client-DUMMY_KEY'
});

export default async function handler(req, res) {
  // Hanya menerima metode POST
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { order_id, gross_amount, first_name, email, item_name } = req.body;

    const parameter = {
      transaction_details: {
        order_id: order_id || `ORDER-${Date.now()}`,
        gross_amount: gross_amount
      },
      customer_details: {
        first_name: first_name || "User",
        email: email || "user@sumberai.com"
      },
      item_details: [
        {
          id: `ITEM-${Date.now()}`,
          price: gross_amount,
          quantity: 1,
          name: item_name || "Berlangganan PRO SumberAI"
        }
      ]
    };

    const transaction = await snap.createTransaction(parameter);
    
    // Mengembalikan token dan redirect URL
    res.status(200).json({
      token: transaction.token,
      redirect_url: transaction.redirect_url
    });

  } catch (error) {
    console.error('Error creating Midtrans transaction:', error);
    res.status(500).json({ message: 'Failed to create transaction', error: error.message });
  }
}
