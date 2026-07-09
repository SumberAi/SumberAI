// vite.config.js
import { defineConfig, loadEnv } from "file:///C:/Users/ACER/Documents/antigravity/agitated-euclid/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/ACER/Documents/antigravity/agitated-euclid/node_modules/@vitejs/plugin-react/dist/index.js";
import midtransClient from "file:///C:/Users/ACER/Documents/antigravity/agitated-euclid/node_modules/midtrans-client/index.js";
import fs from "fs";
var midtransPlugin = () => {
  return {
    name: "midtrans-api-mock",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url.includes("/api/payment/token")) {
          return next();
        }
        console.log(`[API MOCK] Hitting payment token endpoint! Method: ${req.method}`);
        if (req.method !== "POST") {
          res.statusCode = 405;
          res.end(JSON.stringify({ message: "Method Not Allowed" }));
          return;
        }
        let body = "";
        req.on("data", (chunk) => {
          body += chunk.toString();
        });
        req.on("end", async () => {
          try {
            console.log(`[API MOCK] Received body: ${body}`);
            const data = JSON.parse(body);
            let serverKey = "SB-Mid-server-DUMMY_KEY";
            let clientKey = "SB-Mid-client-DUMMY_KEY";
            try {
              const envFile = fs.readFileSync(".env", "utf-8");
              const envLines = envFile.split("\n");
              envLines.forEach((line) => {
                if (line.startsWith("MIDTRANS_SERVER_KEY=")) {
                  serverKey = line.split("=")[1].trim();
                }
                if (line.startsWith("VITE_MIDTRANS_CLIENT_KEY=")) {
                  clientKey = line.split("=")[1].trim();
                }
              });
            } catch (e) {
              console.error("Failed to read .env file", e);
            }
            const snap = new midtransClient.Snap({
              isProduction: false,
              serverKey,
              clientKey
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
            res.setHeader("Content-Type", "application/json");
            res.statusCode = 200;
            res.end(JSON.stringify({
              token: transaction.token,
              redirect_url: transaction.redirect_url
            }));
          } catch (err) {
            console.error("Midtrans Error:", err);
            res.statusCode = 500;
            res.end(JSON.stringify({ message: "Failed to create transaction", error: err.message }));
          }
        });
      });
    }
  };
};
var vite_config_default = defineConfig({
  plugins: [react(), midtransPlugin()],
  base: "./"
  // <-- Sangat penting agar bisa di-hosting di GitHub Pages tanpa error blank
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxBQ0VSXFxcXERvY3VtZW50c1xcXFxhbnRpZ3Jhdml0eVxcXFxhZ2l0YXRlZC1ldWNsaWRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXEFDRVJcXFxcRG9jdW1lbnRzXFxcXGFudGlncmF2aXR5XFxcXGFnaXRhdGVkLWV1Y2xpZFxcXFx2aXRlLmNvbmZpZy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvQUNFUi9Eb2N1bWVudHMvYW50aWdyYXZpdHkvYWdpdGF0ZWQtZXVjbGlkL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnLCBsb2FkRW52IH0gZnJvbSAndml0ZSdcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCdcbmltcG9ydCBtaWR0cmFuc0NsaWVudCBmcm9tICdtaWR0cmFucy1jbGllbnQnXG5pbXBvcnQgZnMgZnJvbSAnZnMnXG5cbmNvbnN0IG1pZHRyYW5zUGx1Z2luID0gKCkgPT4ge1xuICByZXR1cm4ge1xuICAgIG5hbWU6ICdtaWR0cmFucy1hcGktbW9jaycsXG4gICAgY29uZmlndXJlU2VydmVyKHNlcnZlcikge1xuICAgICAgc2VydmVyLm1pZGRsZXdhcmVzLnVzZSgocmVxLCByZXMsIG5leHQpID0+IHtcbiAgICAgICAgaWYgKCFyZXEudXJsLmluY2x1ZGVzKCcvYXBpL3BheW1lbnQvdG9rZW4nKSkge1xuICAgICAgICAgIHJldHVybiBuZXh0KCk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGNvbnNvbGUubG9nKGBbQVBJIE1PQ0tdIEhpdHRpbmcgcGF5bWVudCB0b2tlbiBlbmRwb2ludCEgTWV0aG9kOiAke3JlcS5tZXRob2R9YCk7XG4gICAgICAgIGlmIChyZXEubWV0aG9kICE9PSAnUE9TVCcpIHtcbiAgICAgICAgICByZXMuc3RhdHVzQ29kZSA9IDQwNTtcbiAgICAgICAgICByZXMuZW5kKEpTT04uc3RyaW5naWZ5KHsgbWVzc2FnZTogJ01ldGhvZCBOb3QgQWxsb3dlZCcgfSkpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBib2R5ID0gJyc7XG4gICAgICAgIHJlcS5vbignZGF0YScsIGNodW5rID0+IHsgYm9keSArPSBjaHVuay50b1N0cmluZygpOyB9KTtcbiAgICAgICAgcmVxLm9uKCdlbmQnLCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGBbQVBJIE1PQ0tdIFJlY2VpdmVkIGJvZHk6ICR7Ym9keX1gKTtcbiAgICAgICAgICAgIGNvbnN0IGRhdGEgPSBKU09OLnBhcnNlKGJvZHkpO1xuICAgICAgICAgICAgbGV0IHNlcnZlcktleSA9ICdTQi1NaWQtc2VydmVyLURVTU1ZX0tFWSc7XG4gICAgICAgICAgICBsZXQgY2xpZW50S2V5ID0gJ1NCLU1pZC1jbGllbnQtRFVNTVlfS0VZJztcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgIGNvbnN0IGVudkZpbGUgPSBmcy5yZWFkRmlsZVN5bmMoJy5lbnYnLCAndXRmLTgnKTtcbiAgICAgICAgICAgICAgY29uc3QgZW52TGluZXMgPSBlbnZGaWxlLnNwbGl0KCdcXG4nKTtcbiAgICAgICAgICAgICAgZW52TGluZXMuZm9yRWFjaChsaW5lID0+IHtcbiAgICAgICAgICAgICAgICBpZiAobGluZS5zdGFydHNXaXRoKCdNSURUUkFOU19TRVJWRVJfS0VZPScpKSB7XG4gICAgICAgICAgICAgICAgICBzZXJ2ZXJLZXkgPSBsaW5lLnNwbGl0KCc9JylbMV0udHJpbSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAobGluZS5zdGFydHNXaXRoKCdWSVRFX01JRFRSQU5TX0NMSUVOVF9LRVk9JykpIHtcbiAgICAgICAgICAgICAgICAgIGNsaWVudEtleSA9IGxpbmUuc3BsaXQoJz0nKVsxXS50cmltKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignRmFpbGVkIHRvIHJlYWQgLmVudiBmaWxlJywgZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IHNuYXAgPSBuZXcgbWlkdHJhbnNDbGllbnQuU25hcCh7XG4gICAgICAgICAgICAgIGlzUHJvZHVjdGlvbjogZmFsc2UsXG4gICAgICAgICAgICAgIHNlcnZlcktleTogc2VydmVyS2V5LFxuICAgICAgICAgICAgICBjbGllbnRLZXk6IGNsaWVudEtleVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgW0FQSSBNT0NLXSBVc2luZyBTZXJ2ZXIgS2V5OiBbJHtzZXJ2ZXJLZXl9XWApO1xuXG4gICAgICAgICAgICBjb25zdCBwYXJhbWV0ZXIgPSB7XG4gICAgICAgICAgICAgIHRyYW5zYWN0aW9uX2RldGFpbHM6IHtcbiAgICAgICAgICAgICAgICBvcmRlcl9pZDogZGF0YS5vcmRlcl9pZCB8fCBgT1JERVItJHtEYXRlLm5vdygpfWAsXG4gICAgICAgICAgICAgICAgZ3Jvc3NfYW1vdW50OiBkYXRhLmdyb3NzX2Ftb3VudFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBjdXN0b21lcl9kZXRhaWxzOiB7XG4gICAgICAgICAgICAgICAgZmlyc3RfbmFtZTogZGF0YS5maXJzdF9uYW1lIHx8IFwiVXNlclwiLFxuICAgICAgICAgICAgICAgIGVtYWlsOiBkYXRhLmVtYWlsIHx8IFwidXNlckBzdW1iZXJhaS5jb21cIlxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBpdGVtX2RldGFpbHM6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBpZDogYElURU0tJHtEYXRlLm5vdygpfWAsXG4gICAgICAgICAgICAgICAgICBwcmljZTogZGF0YS5ncm9zc19hbW91bnQsXG4gICAgICAgICAgICAgICAgICBxdWFudGl0eTogMSxcbiAgICAgICAgICAgICAgICAgIG5hbWU6IGRhdGEuaXRlbV9uYW1lIHx8IFwiQmVybGFuZ2dhbmFuIFBSTyBTdW1iZXJBSVwiXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBdXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBjb25zdCB0cmFuc2FjdGlvbiA9IGF3YWl0IHNuYXAuY3JlYXRlVHJhbnNhY3Rpb24ocGFyYW1ldGVyKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgcmVzLnNldEhlYWRlcignQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL2pzb24nKTtcbiAgICAgICAgICAgIHJlcy5zdGF0dXNDb2RlID0gMjAwO1xuICAgICAgICAgICAgcmVzLmVuZChKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICAgIHRva2VuOiB0cmFuc2FjdGlvbi50b2tlbixcbiAgICAgICAgICAgICAgcmVkaXJlY3RfdXJsOiB0cmFuc2FjdGlvbi5yZWRpcmVjdF91cmxcbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ01pZHRyYW5zIEVycm9yOicsIGVycik7XG4gICAgICAgICAgICByZXMuc3RhdHVzQ29kZSA9IDUwMDtcbiAgICAgICAgICAgIHJlcy5lbmQoSlNPTi5zdHJpbmdpZnkoeyBtZXNzYWdlOiAnRmFpbGVkIHRvIGNyZWF0ZSB0cmFuc2FjdGlvbicsIGVycm9yOiBlcnIubWVzc2FnZSB9KSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufVxuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW3JlYWN0KCksIG1pZHRyYW5zUGx1Z2luKCldLFxuICBiYXNlOiAnLi8nLCAvLyA8LS0gU2FuZ2F0IHBlbnRpbmcgYWdhciBiaXNhIGRpLWhvc3RpbmcgZGkgR2l0SHViIFBhZ2VzIHRhbnBhIGVycm9yIGJsYW5rXG59KVxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUF1VixTQUFTLGNBQWMsZUFBZTtBQUM3WCxPQUFPLFdBQVc7QUFDbEIsT0FBTyxvQkFBb0I7QUFDM0IsT0FBTyxRQUFRO0FBRWYsSUFBTSxpQkFBaUIsTUFBTTtBQUMzQixTQUFPO0FBQUEsSUFDTCxNQUFNO0FBQUEsSUFDTixnQkFBZ0IsUUFBUTtBQUN0QixhQUFPLFlBQVksSUFBSSxDQUFDLEtBQUssS0FBSyxTQUFTO0FBQ3pDLFlBQUksQ0FBQyxJQUFJLElBQUksU0FBUyxvQkFBb0IsR0FBRztBQUMzQyxpQkFBTyxLQUFLO0FBQUEsUUFDZDtBQUVBLGdCQUFRLElBQUksc0RBQXNELElBQUksTUFBTSxFQUFFO0FBQzlFLFlBQUksSUFBSSxXQUFXLFFBQVE7QUFDekIsY0FBSSxhQUFhO0FBQ2pCLGNBQUksSUFBSSxLQUFLLFVBQVUsRUFBRSxTQUFTLHFCQUFxQixDQUFDLENBQUM7QUFDekQ7QUFBQSxRQUNGO0FBRUEsWUFBSSxPQUFPO0FBQ1gsWUFBSSxHQUFHLFFBQVEsV0FBUztBQUFFLGtCQUFRLE1BQU0sU0FBUztBQUFBLFFBQUcsQ0FBQztBQUNyRCxZQUFJLEdBQUcsT0FBTyxZQUFZO0FBQ3hCLGNBQUk7QUFDRixvQkFBUSxJQUFJLDZCQUE2QixJQUFJLEVBQUU7QUFDL0Msa0JBQU0sT0FBTyxLQUFLLE1BQU0sSUFBSTtBQUM1QixnQkFBSSxZQUFZO0FBQ2hCLGdCQUFJLFlBQVk7QUFDaEIsZ0JBQUk7QUFDRixvQkFBTSxVQUFVLEdBQUcsYUFBYSxRQUFRLE9BQU87QUFDL0Msb0JBQU0sV0FBVyxRQUFRLE1BQU0sSUFBSTtBQUNuQyx1QkFBUyxRQUFRLFVBQVE7QUFDdkIsb0JBQUksS0FBSyxXQUFXLHNCQUFzQixHQUFHO0FBQzNDLDhCQUFZLEtBQUssTUFBTSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEtBQUs7QUFBQSxnQkFDdEM7QUFDQSxvQkFBSSxLQUFLLFdBQVcsMkJBQTJCLEdBQUc7QUFDaEQsOEJBQVksS0FBSyxNQUFNLEdBQUcsRUFBRSxDQUFDLEVBQUUsS0FBSztBQUFBLGdCQUN0QztBQUFBLGNBQ0YsQ0FBQztBQUFBLFlBQ0gsU0FBUyxHQUFHO0FBQ1Ysc0JBQVEsTUFBTSw0QkFBNEIsQ0FBQztBQUFBLFlBQzdDO0FBRUEsa0JBQU0sT0FBTyxJQUFJLGVBQWUsS0FBSztBQUFBLGNBQ25DLGNBQWM7QUFBQSxjQUNkO0FBQUEsY0FDQTtBQUFBLFlBQ0YsQ0FBQztBQUNELG9CQUFRLElBQUksaUNBQWlDLFNBQVMsR0FBRztBQUV6RCxrQkFBTSxZQUFZO0FBQUEsY0FDaEIscUJBQXFCO0FBQUEsZ0JBQ25CLFVBQVUsS0FBSyxZQUFZLFNBQVMsS0FBSyxJQUFJLENBQUM7QUFBQSxnQkFDOUMsY0FBYyxLQUFLO0FBQUEsY0FDckI7QUFBQSxjQUNBLGtCQUFrQjtBQUFBLGdCQUNoQixZQUFZLEtBQUssY0FBYztBQUFBLGdCQUMvQixPQUFPLEtBQUssU0FBUztBQUFBLGNBQ3ZCO0FBQUEsY0FDQSxjQUFjO0FBQUEsZ0JBQ1o7QUFBQSxrQkFDRSxJQUFJLFFBQVEsS0FBSyxJQUFJLENBQUM7QUFBQSxrQkFDdEIsT0FBTyxLQUFLO0FBQUEsa0JBQ1osVUFBVTtBQUFBLGtCQUNWLE1BQU0sS0FBSyxhQUFhO0FBQUEsZ0JBQzFCO0FBQUEsY0FDRjtBQUFBLFlBQ0Y7QUFFQSxrQkFBTSxjQUFjLE1BQU0sS0FBSyxrQkFBa0IsU0FBUztBQUUxRCxnQkFBSSxVQUFVLGdCQUFnQixrQkFBa0I7QUFDaEQsZ0JBQUksYUFBYTtBQUNqQixnQkFBSSxJQUFJLEtBQUssVUFBVTtBQUFBLGNBQ3JCLE9BQU8sWUFBWTtBQUFBLGNBQ25CLGNBQWMsWUFBWTtBQUFBLFlBQzVCLENBQUMsQ0FBQztBQUFBLFVBQ0osU0FBUyxLQUFLO0FBQ1osb0JBQVEsTUFBTSxtQkFBbUIsR0FBRztBQUNwQyxnQkFBSSxhQUFhO0FBQ2pCLGdCQUFJLElBQUksS0FBSyxVQUFVLEVBQUUsU0FBUyxnQ0FBZ0MsT0FBTyxJQUFJLFFBQVEsQ0FBQyxDQUFDO0FBQUEsVUFDekY7QUFBQSxRQUNGLENBQUM7QUFBQSxNQUNILENBQUM7QUFBQSxJQUNIO0FBQUEsRUFDRjtBQUNGO0FBR0EsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUyxDQUFDLE1BQU0sR0FBRyxlQUFlLENBQUM7QUFBQSxFQUNuQyxNQUFNO0FBQUE7QUFDUixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
