import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import midtransClient from 'midtrans-client'
import fs from 'fs'

const midtransPlugin = () => {
  return {
    name: 'midtrans-api-mock',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url.includes('/api/payment/token')) {
          return next();
        }
        
        console.log(`[API MOCK] Hitting payment token endpoint! Method: ${req.method}`);
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end(JSON.stringify({ message: 'Method Not Allowed' }));
          return;
        }

        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', async () => {
          try {
            console.log(`[API MOCK] Received body: ${body}`);
            const data = JSON.parse(body);
            let serverKey = 'SB-Mid-server-DUMMY_KEY';
            let clientKey = 'SB-Mid-client-DUMMY_KEY';
            try {
              const envFile = fs.readFileSync('.env', 'utf-8');
              const envLines = envFile.split('\n');
              envLines.forEach(line => {
                if (line.startsWith('MIDTRANS_SERVER_KEY=')) {
                  serverKey = line.split('=')[1].trim();
                }
                if (line.startsWith('VITE_MIDTRANS_CLIENT_KEY=')) {
                  clientKey = line.split('=')[1].trim();
                }
              });
            } catch (e) {
              console.error('Failed to read .env file', e);
            }

            const snap = new midtransClient.Snap({
              isProduction: false,
              serverKey: serverKey,
              clientKey: clientKey
            });
            console.log(`[API MOCK] Using Server Key: [${serverKey}]`);

            const parameter = {
              transaction_details: {
                order_id: data.order_id || `ORDER-${Date.now()}`,
                gross_amount: data.gross_amount
              },
              customer_details: {
                first_name: data.first_name || "User",
                email: data.email || "user@sumberai.com"
              },
              item_details: [
                {
                  id: `ITEM-${Date.now()}`,
                  price: data.gross_amount,
                  quantity: 1,
                  name: data.item_name || "Berlangganan PRO SumberAI"
                }
              ]
            };

            const transaction = await snap.createTransaction(parameter);
            
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(JSON.stringify({
              token: transaction.token,
              redirect_url: transaction.redirect_url
            }));
          } catch (err) {
            console.error('Midtrans Error:', err);
            res.statusCode = 500;
            res.end(JSON.stringify({ message: 'Failed to create transaction', error: err.message }));
          }
        });
      });
    }
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), midtransPlugin()],
  base: './', // <-- Sangat penting agar bisa di-hosting di GitHub Pages tanpa error blank
})
