import React, { useState, useEffect } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { db, auth } from '../firebase';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { signInAnonymously } from 'firebase/auth';

export default function MitraScreen() {
  const [pin, setPin] = useState('');
  const [isLogged, setIsLogged] = useState(false);
  const [voucherCode, setVoucherCode] = useState('');
  const [status, setStatus] = useState(null); // null, 'loading', 'success', 'error', 'used'
  const [message, setMessage] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    let html5QrCode;
    
    if (isScanning) {
      html5QrCode = new Html5Qrcode("reader");
      const config = { fps: 10, qrbox: { width: 250, height: 250 } };
      
      html5QrCode.start(
        { facingMode: "environment" },
        config,
        (decodedText) => {
          html5QrCode.stop().then(() => {
            setIsScanning(false);
            setVoucherCode(decodedText);
            processValidation(decodedText);
          }).catch(console.error);
        },
        (errorMessage) => {
          // ignore background errors
        }
      ).catch((err) => {
        console.error("Camera start error:", err);
        alert("Gagal mengakses kamera. Pastikan Anda telah memberikan izin kamera pada browser.");
        setIsScanning(false);
      });
    }

    return () => {
      if (html5QrCode && html5QrCode.isScanning) {
        html5QrCode.stop().catch(console.error);
      }
    };
  }, [isScanning]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (pin === '123456') {
      try {
        if (!auth.currentUser) {
          await signInAnonymously(auth);
        }
        setIsLogged(true);
      } catch (err) {
        alert("Gagal koneksi: " + err.message);
      }
    } else {
      alert('PIN Salah!');
    }
  };

  const processValidation = async (codeToProcess) => {
    if (!codeToProcess.trim()) return;
    
    setStatus('loading');
    setMessage('Mengecek database...');

    try {
      const q = query(collection(db, "vouchers"), where("code", "==", codeToProcess.trim().toUpperCase()));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setStatus('error');
        setMessage('Voucher tidak ditemukan atau kode salah!');
        return;
      }

      const docSnapshot = querySnapshot.docs[0];
      const voucherData = docSnapshot.data();

      if (voucherData.isUsed) {
        setStatus('used');
        setMessage('Voucher DITOLAK! Sudah pernah digunakan sebelumnya.');
        return;
      }

      // Check expiration if expiresAt exists
      if (voucherData.expiresAt && voucherData.expiresAt < Date.now()) {
        setStatus('error');
        setMessage('Voucher sudah kadaluarsa (melewati 24 jam).');
        return;
      }

      // Redeem successful
      await updateDoc(doc(db, "vouchers", docSnapshot.id), {
        isUsed: true,
        usedAt: Date.now()
      });

      let benefitMsg = voucherData.benefit || (voucherData.amount ? `Diskon Rp ${voucherData.amount.toLocaleString('id-ID')}` : 'GRATIS');
      
      let finalMessage = `BERHASIL! Keuntungan pelanggan: ${benefitMsg}`;
      if (benefitMsg.startsWith("Tagih")) {
        finalMessage = `BERHASIL! ${benefitMsg}`;
      }

      // 2nd Notification to Admin (Validasi Sukses)
      const botToken = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
      const chatId = import.meta.env.VITE_TELEGRAM_CHAT_ID;
      if (botToken && chatId) {
        const msg = `✅ *VOUCHER BERHASIL DIPROSES KASIR!*\n\n🎟️ *KODE:* \`${voucherData.code}\`\n🏪 *Toko:* ${voucherData.store}\n🛍️ *Produk:* ${voucherData.title}\n💵 *Aksi Kasir:* ${benefitMsg}\n\nStatus: Selesai Dilayani pelanggan.`;
        try {
          const url = `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(msg)}&parse_mode=Markdown`;
          await fetch(url, { mode: 'no-cors' });
        } catch (e) {
          console.error(e);
        }
      }

      setStatus('success');
      setMessage(finalMessage);

    } catch (err) {
      console.error(err);
      setStatus('error');
      setMessage(`Terjadi kesalahan: ${err.message || 'Jaringan/Koneksi gagal'}`);
    }
  };

  const handleValidate = async (e) => {
    e.preventDefault();
    processValidation(voucherCode);
  };

  const handleFileUpload = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const html5QrCode = new Html5Qrcode("hidden-reader");
      try {
        setStatus('loading');
        setMessage('Membaca gambar...');
        const decodedText = await html5QrCode.scanFile(file, true);
        setVoucherCode(decodedText);
        processValidation(decodedText);
      } catch (err) {
        setStatus(null);
        alert("Tidak dapat membaca QR Code dari gambar tersebut. Pastikan gambar jelas.");
      }
    }
  };

  const resetForm = () => {
    setStatus(null);
    setVoucherCode('');
    setMessage('');
    setIsScanning(false);
  };

  if (!isLogged) {
    return (
      <div style={{minHeight: "100vh", background: "#0F172A", display: "flex", justifyContent: "center", alignItems: "center", padding: 20}}>
        <form onSubmit={handleLogin} style={{background: "#1E293B", padding: 32, borderRadius: 24, width: "100%", maxWidth: 360, textAlign: "center", boxShadow: "0 20px 40px rgba(0,0,0,0.3)"}}>
          <h2 style={{color: "#fff", marginBottom: 8, fontSize: 24, fontWeight: 900}}>Mitra Portal</h2>
          <p style={{color: "#94A3B8", marginBottom: 24, fontSize: 14}}>Masukkan PIN Kasir</p>
          <input 
            type="password" 
            value={pin}
            onChange={e => setPin(e.target.value)}
            placeholder="***" 
            style={{width: "100%", padding: "16px", borderRadius: 12, border: "2px solid #334155", background: "#0F172A", color: "#fff", fontSize: 24, textAlign: "center", letterSpacing: 8, marginBottom: 24}}
          />
          <button type="submit" style={{width: "100%", background: "linear-gradient(135deg, #3B82F6, #2563EB)", color: "#fff", border: "none", padding: 16, borderRadius: 12, fontSize: 16, fontWeight: 800, cursor: "pointer"}}>
            MASUK
          </button>
        </form>
      </div>
    );
  }

  return (
    <div style={{minHeight: "100vh", background: "#F8FAFC", padding: 20, display: "flex", flexDirection: "column", alignItems: "center"}}>
      <div id="hidden-reader" style={{display: 'none'}}></div>
      <div style={{background: "#fff", padding: "24px", borderRadius: 24, width: "100%", maxWidth: 400, boxShadow: "0 10px 30px rgba(0,0,0,0.05)", marginTop: 40}}>
        
        <div style={{textAlign: "center", marginBottom: 24}}>
          <h2 style={{color: "#1E293B", margin: 0, fontSize: 22, fontWeight: 900}}>Validasi Kupon UMKM</h2>
          <p style={{color: "#64748B", margin: "4px 0 0 0", fontSize: 13}}>Ketik kode yang ada di HP pelanggan</p>
        </div>

        {status === 'success' && (
          <div style={{background: "#DCFCE7", border: "2px solid #22C55E", padding: 20, borderRadius: 16, textAlign: "center", marginBottom: 24, animation: "fadeUp .3s ease"}}>
            <div style={{fontSize: 40, marginBottom: 8}}>✅</div>
            <div style={{color: "#166534", fontWeight: 900, fontSize: 18, marginBottom: 8}}>KODE VALID</div>
            <div style={{color: "#15803D", fontSize: 15}}>{message}</div>
            <button onClick={resetForm} style={{marginTop: 16, background: "#22C55E", color: "#fff", border: "none", padding: "10px 20px", borderRadius: 10, fontWeight: "bold", cursor: "pointer"}}>Validasi Kupon Lain</button>
          </div>
        )}

        {status === 'used' && (
          <div style={{background: "#FEE2E2", border: "2px solid #EF4444", padding: 20, borderRadius: 16, textAlign: "center", marginBottom: 24, animation: "fadeUp .3s ease"}}>
            <div style={{fontSize: 40, marginBottom: 8}}>❌</div>
            <div style={{color: "#991B1B", fontWeight: 900, fontSize: 18, marginBottom: 8}}>DITOLAK</div>
            <div style={{color: "#B91C1C", fontSize: 15}}>{message}</div>
            <button onClick={resetForm} style={{marginTop: 16, background: "#EF4444", color: "#fff", border: "none", padding: "10px 20px", borderRadius: 10, fontWeight: "bold", cursor: "pointer"}}>Coba Lagi</button>
          </div>
        )}

        {status === 'error' && (
          <div style={{background: "#FEF3C7", border: "2px solid #F59E0B", padding: 20, borderRadius: 16, textAlign: "center", marginBottom: 24, animation: "fadeUp .3s ease"}}>
            <div style={{fontSize: 40, marginBottom: 8}}>⚠️</div>
            <div style={{color: "#92400E", fontWeight: 900, fontSize: 18, marginBottom: 8}}>TIDAK DITEMUKAN</div>
            <div style={{color: "#B45309", fontSize: 15}}>{message}</div>
            <button onClick={resetForm} style={{marginTop: 16, background: "#F59E0B", color: "#fff", border: "none", padding: "10px 20px", borderRadius: 10, fontWeight: "bold", cursor: "pointer"}}>Coba Lagi</button>
          </div>
        )}

        {status === 'loading' && (
          <div style={{textAlign: "center", padding: 30, color: "#64748B", fontWeight: "bold"}}>
            <div className="spinner" style={{marginBottom: 16}}>Memproses...</div>
            <div style={{fontSize: 14}}>{message}</div>
          </div>
        )}

        {status === null && !isScanning && (
          <>
            <div style={{display: 'flex', gap: 12, marginBottom: 16}}>
              <button onClick={() => setIsScanning(true)} style={{flex: 1, background: "#10B981", color: "#fff", border: "none", padding: "16px 8px", borderRadius: 16, fontSize: 14, fontWeight: 800, cursor: "pointer", boxShadow: "0 10px 20px rgba(16,185,129,.2)", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 8}}>
                <span style={{fontSize: 24}}>📷</span> Pakai Kamera
              </button>
              
              <input type="file" id="qr-upload" accept="image/*" style={{display: 'none'}} onChange={handleFileUpload} />
              <button onClick={() => document.getElementById('qr-upload').click()} style={{flex: 1, background: "#3B82F6", color: "#fff", border: "none", padding: "16px 8px", borderRadius: 16, fontSize: 14, fontWeight: 800, cursor: "pointer", boxShadow: "0 10px 20px rgba(59,130,246,.2)", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 8}}>
                <span style={{fontSize: 24}}>📁</span> Unggah Foto QR
              </button>
            </div>
            
            <div style={{textAlign: "center", color: "#94A3B8", fontWeight: "bold", marginBottom: 16, fontSize: 12}}>ATAU KETIK KODE MANUAL</div>
            <form onSubmit={handleValidate}>
              <input 
                type="text" 
                value={voucherCode}
                onChange={e => setVoucherCode(e.target.value.toUpperCase())}
                placeholder="Contoh: KOP-8B2X" 
                style={{width: "100%", padding: "16px", borderRadius: 16, border: "2px solid #E2E8F0", background: "#F8FAFC", color: "#1E293B", fontSize: 20, textAlign: "center", fontWeight: 800, textTransform: "uppercase", marginBottom: 16}}
              />
              <button type="submit" disabled={!voucherCode} style={{width: "100%", background: voucherCode ? "linear-gradient(135deg, #3B82F6, #2563EB)" : "#E2E8F0", color: voucherCode ? "#fff" : "#94A3B8", border: "none", padding: "16px", borderRadius: 16, fontSize: 16, fontWeight: 800, cursor: voucherCode ? "pointer" : "not-allowed", boxShadow: voucherCode ? "0 10px 20px rgba(37,99,235,.2)" : "none"}}>
                Cek Kode
              </button>
            </form>
          </>
        )}

        {isScanning && (
          <div style={{width: "100%"}}>
            <div id="reader" style={{width: "100%", overflow: "hidden", border: "2px solid #E2E8F0", marginBottom: 16, borderRadius: 16, boxShadow: "0 10px 25px rgba(0,0,0,0.05)", background: "#1E293B"}}></div>
            <button onClick={() => setIsScanning(false)} style={{width: "100%", background: "#EF4444", color: "#fff", border: "none", padding: "16px", borderRadius: 16, fontSize: 16, fontWeight: 800, cursor: "pointer", boxShadow: "0 10px 20px rgba(239,68,68,.2)"}}>
              Batal / Tutup Kamera
            </button>
          </div>
        )}
        
      </div>
      <div style={{marginTop: 24, fontSize: 12, color: "#94A3B8", fontWeight: "bold"}}>Aman dan Terenkripsi © SumberAI</div>
    </div>
  );
}
