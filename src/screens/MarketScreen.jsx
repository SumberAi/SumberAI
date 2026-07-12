import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import QRCode from 'react-qr-code';
import { C } from '../data/mockData';

export default function MarketScreen({ gs, spendCoins, onNav, userUid }) {
  const [showModal, setShowModal] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedItemTitle, setSelectedItemTitle] = useState('');
  
  // State untuk Verifikasi Sandi
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [pendingPurchase, setPendingPurchase] = useState(null);
  const [passwordError, setPasswordError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // State untuk Voucher Aktif
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [activeVouchers, setActiveVouchers] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const fetchActiveVouchers = async () => {
    if (!userUid) return;
    setIsLoadingHistory(true);
    setShowHistoryModal(true);
    try {
      const q = query(
        collection(db, "vouchers"),
        where("userId", "==", userUid),
        where("isUsed", "==", false)
      );
      const querySnapshot = await getDocs(q);
      const now = Date.now();
      const vouchers = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.expiresAt > now) {
          vouchers.push({ id: doc.id, ...data });
        }
      });
      // Sort by newest first
      vouchers.sort((a, b) => b.createdAt - a.createdAt);
      setActiveVouchers(vouchers);
    } catch (e) {
      console.error("Gagal mengambil riwayat voucher", e);
      alert("Gagal mengambil data voucher.");
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const stores = [
    {
      id: "m1",
      brand: "Aneka Minuman Segar",
      address: "Minuman Dingin & Segar",
      mapLink: "https://maps.app.goo.gl/iniDV3UDw89NNAGB9",
      icon: "logo_fernandi.jpeg",
      items: [
        { 
          id: 1, 
          title: "Es Jeruk", 
          titleEn: "Fresh Orange Juice", 
          desc: "Diskon 100%", 
          descEn: "Discount 100%", 
          price: 1000, 
          image: "./es_jeruk.jpg", 
          originalPriceRp: 5000,
          finalPriceRp: 0,
          isReady: true 
        }
      ]
    },
    {
      id: "m2",
      brand: "Maugi Oleh-Oleh Khas Jambi",
      address: "Sambal Tempoyak Jambi",
      mapLink: "https://maps.app.goo.gl/TSxjeU3CLcGJjmCB8",
      icon: "logo_maugi.jpeg",
      items: [
        { 
          id: 2, 
          title: "Sambal Tempoyak", 
          titleEn: "Tempoyak Chili Paste", 
          desc: "Diskon -+58,4%", 
          descEn: "Discount -+58.4%", 
          price: 2800, 
          image: "./sambal_tempoyak.jpg",
          originalPriceRp: 24000,
          finalPriceRp: 10000,
          isReady: true 
        },
        { 
          id: 3, 
          title: "Keripik Durian", 
          titleEn: "Durian Chips", 
          desc: "Diskon 50%", 
          descEn: "Discount 50%", 
          price: 2000, 
          image: "./keripik_durian.jpg",
          originalPriceRp: 20000,
          finalPriceRp: 10000,
          isReady: true 
        }
      ]
    },
    {
      id: "m3",
      brand: "Ancua Harmoni",
      address: "Kopi & Minuman",
      mapLink: "https://maps.app.goo.gl/DHFCLnba1MZxaUbU8",
      icon: "logo_ancua.jpg",
      items: [
        { 
          id: 4, 
          title: "Kopi Susu Ancua Jambi", 
          titleEn: "Ancua Milk Coffee Jambi", 
          desc: "Diskon -+45%", 
          descEn: "Discount -+45%", 
          price: 2000, 
          image: "./kopisusu_ancua.jpg",
          originalPriceRp: 22000,
          finalPriceRp: 12000,
          isReady: true 
        },
        { 
          id: 5, 
          title: "Americano Lemon Jambi", 
          titleEn: "Lemon Americano Jambi", 
          desc: "Diskon -+47,4%", 
          descEn: "Discount -+47.4%", 
          price: 1800, 
          image: "./americano_lemon.jpeg",
          imageScale: 1.5,
          originalPriceRp: 19000,
          finalPriceRp: 10000,
          isReady: true 
        }
      ]
    },
    {
      id: "m4",
      brand: "Royal Chicken",
      address: "Ayam Geprek & Minuman",
      mapLink: "https://maps.app.goo.gl/cWeP2KJ63sStGPfe9",
      icon: "logo_geprek.jpeg",
      items: [
        { 
          id: 6, 
          title: "Ayam Geprek", 
          titleEn: "Smashed Fried Chicken", 
          desc: "Diskon -+58%", 
          descEn: "Discount -+58%", 
          price: 1400, 
          image: "./ayam_geprek.jpeg",
          originalPriceRp: 12000,
          finalPriceRp: 5000,
          isReady: true 
        },
        { 
          id: 7, 
          title: "Cappucino Cincau", 
          titleEn: "Cappucino Grass Jelly", 
          desc: "Diskon 100%", 
          descEn: "Discount 100%", 
          price: 1200, 
          image: "./cappucino_cincau.jpeg",
          originalPriceRp: 6000,
          finalPriceRp: 0,
          isReady: true 
        }
      ]
    },
    {
      id: "m5",
      brand: "Your Coffee Official",
      address: "Depan Universitas Jambi",
      mapLink: "",
      icon: "logo_yourcoffe.jpg",
      items: [
        { 
          id: 8, 
          title: "Candy Berry Jambi", 
          titleEn: "Candy Berry Jambi", 
          desc: "Diskon 50%", 
          descEn: "Discount 50%", 
          price: 1000, 
          image: "./candy_berry.jpg",
          originalPriceRp: 10000,
          finalPriceRp: 5000,
          isReady: true 
        },
        { 
          id: 9, 
          title: "Surya Tenggelam Jambi", 
          titleEn: "Surya Tenggelam Jambi", 
          desc: "Diskon 50%", 
          descEn: "Discount 50%", 
          price: 1000, 
          image: "./surya_tenggelam.jpg",
          originalPriceRp: 10000,
          finalPriceRp: 5000,
          isReady: true 
        },
        { 
          id: 10, 
          title: "Butterpop Jambi", 
          titleEn: "Butterpop Jambi", 
          desc: "Diskon 50%", 
          descEn: "Discount 50%", 
          price: 1200, 
          image: "./butterpop.jpg",
          originalPriceRp: 12000,
          finalPriceRp: 6000,
          isReady: true 
        }
      ]
    },
    {
      id: "m6",
      brand: "Kopi Kalcer",
      address: "Depan Universitas Jambi",
      mapLink: "",
      icon: "logo_kalcer.jpg",
      items: [
        { 
          id: 11, 
          title: "Matcha Latte Jambi", 
          titleEn: "Matcha Latte Jambi", 
          desc: "Diskon 50%", 
          descEn: "Discount 50%", 
          price: 1000, 
          image: "./matcha_latte.png",
          originalPriceRp: 10000,
          finalPriceRp: 5000,
          isReady: true 
        },
        { 
          id: 12, 
          title: "Butterscotch Latte Jambi", 
          titleEn: "Butterscotch Latte Jambi", 
          desc: "Diskon 50%", 
          descEn: "Discount 50%", 
          price: 1000, 
          image: "./butterscotch_latte.png",
          originalPriceRp: 10000,
          finalPriceRp: 5000,
          isReady: true 
        }
      ]
    },
    {
      id: "m7",
      brand: "3 Queen’s Batik",
      address: "Jambi",
      mapLink: "https://maps.app.goo.gl/iQDdTYtRt6kkuoxv7",
      icon: "logo_batik.jpg",
      items: [
        { 
          id: 13, 
          title: "Batik Tulis Jambi", 
          titleEn: "Hand-Drawn Batik Jambi", 
          desc: "Diskon Rp 100.000", 
          descEn: "Discount Rp 100.000", 
          price: 20000, 
          image: "./batik_tulis.jpg",
          originalPriceRp: 1000000,
          finalPriceRp: 900000,
          isReady: true 
        },
        { 
          id: 14, 
          title: "Batik Cap Jambi", 
          titleEn: "Stamped Batik Jambi", 
          desc: "Diskon Rp 50.000", 
          descEn: "Discount Rp 50.000", 
          price: 10000, 
          image: "./batik_cap.jpg",
          originalPriceRp: 250000,
          finalPriceRp: 200000,
          isReady: true 
        }
      ]
    },
    {
      id: "m8",
      brand: "Black Garlic Tunggal",
      address: "Jambi",
      mapLink: "https://maps.app.goo.gl/oLh1g5ZCMiyHvFkX9",
      icon: "logo_garlic.jpeg",
      items: [
        { 
          id: 15, 
          title: "Black Garlic", 
          titleEn: "Black Garlic", 
          desc: "Diskon ±10,5%", 
          descEn: "Discount ±10.5%", 
          price: 2000, 
          image: "./black_garlic.jpg",
          originalPriceRp: 95000,
          finalPriceRp: 85000,
          isReady: true 
        }
      ]
    },
    {
      id: "m9",
      brand: "Alen Bakery",
      address: "Jambi",
      mapLink: "https://maps.app.goo.gl/KeeaCMr1chhjuvYa7",
      icon: "logo_alen.jpg",
      items: [
        { 
          id: 16, 
          title: "Nastar", 
          titleEn: "Pineapple Tart", 
          desc: "Diskon ±16,6%", 
          descEn: "Discount ±16.6%", 
          price: 2000, 
          image: "./nastar.png",
          originalPriceRp: 60000,
          finalPriceRp: 50000,
          isReady: true 
        },
        { 
          id: 17, 
          title: "Molen Coklat Keju", 
          titleEn: "Chocolate Cheese Molen", 
          desc: "Diskon 50%", 
          descEn: "Discount 50%", 
          price: 2000, 
          image: "./molen_coklat_keju.png",
          originalPriceRp: 20000,
          finalPriceRp: 10000,
          isReady: true 
        },
        { 
          id: 18, 
          title: "Mixed Fruit & Snack", 
          titleEn: "Mixed Fruit & Snack", 
          desc: "Diskon 25%", 
          descEn: "Discount 25%", 
          price: 2000, 
          image: "./mixed_fruit_snack.png",
          originalPriceRp: 40000,
          finalPriceRp: 30000,
          isReady: true 
        }
      ]
    },
    {
      id: "m15",
      brand: "Snack R&R",
      address: "Jambi",
      mapLink: "https://maps.app.goo.gl/bMhJje3Fq6Ri7QWr7",
      icon: "logo_snack_rr.jpeg",
      items: [
        { 
          id: 29, 
          title: "Kembang Tahu “R&R”", 
          titleEn: "Tofu Skin “R&R”", 
          desc: "Diskon ±41%", 
          descEn: "Discount ±41%", 
          price: 1400, 
          image: "./kembang_tahu.jpg",
          originalPriceRp: 17000,
          finalPriceRp: 10000,
          isReady: true 
        },
        { 
          id: 30, 
          title: "Keripik Labu “R&R”", 
          titleEn: "Pumpkin Chips “R&R”", 
          desc: "Diskon ±28,5%", 
          descEn: "Discount ±28.5%", 
          price: 800, 
          image: "./keripik_labu.jpg",
          originalPriceRp: 14000,
          finalPriceRp: 10000,
          isReady: true 
        },
        { 
          id: 31, 
          title: "Opak Kiribon", 
          titleEn: "Opak Kiribon", 
          desc: "Diskon ±28,5%", 
          descEn: "Discount ±28.5%", 
          price: 800, 
          image: "./opak_kiribon.jpg",
          originalPriceRp: 14000,
          finalPriceRp: 10000,
          isReady: true 
        },
        { 
          id: 32, 
          title: "Keripik Sayur “R&R”", 
          titleEn: "Vegetable Chips “R&R”", 
          desc: "Diskon ±28,5%", 
          descEn: "Discount ±28.5%", 
          price: 800, 
          image: "./keripik_sayur.jpg",
          originalPriceRp: 14000,
          finalPriceRp: 10000,
          isReady: true 
        },
        { 
          id: 33, 
          title: "Rempeyek Kiribon", 
          titleEn: "Kiribon Rempeyek", 
          desc: "Diskon ±28,5%", 
          descEn: "Discount ±28.5%", 
          price: 800, 
          image: "./rempeyek_kiribon.jpg",
          originalPriceRp: 14000,
          finalPriceRp: 10000,
          isReady: true 
        }
      ]
    },
    {
      id: "m10",
      brand: "Bolu Jadoel SR Bakery",
      address: "Jambi",
      mapLink: "https://maps.app.goo.gl/6MUT7Mm3kuu2opS78",
      icon: "logo_bolu.jpeg",
      items: [
        { 
          id: 19, 
          title: "Bolu Kecil", 
          titleEn: "Small Sponge Cake", 
          desc: "Diskon 50%", 
          descEn: "Discount 50%", 
          price: 1000, 
          image: "./bolu_kecil.jpg",
          originalPriceRp: 10000,
          finalPriceRp: 5000,
          isReady: true 
        },
        { 
          id: 20, 
          title: "Bolu Besar", 
          titleEn: "Large Sponge Cake", 
          desc: "Diskon 40%", 
          descEn: "Discount 40%", 
          price: 2000, 
          image: "./bolu_besar.jpg",
          originalPriceRp: 25000,
          finalPriceRp: 15000,
          isReady: true 
        },
        { 
          id: 21, 
          title: "Brownies", 
          titleEn: "Brownies", 
          desc: "Diskon 50%", 
          descEn: "Discount 50%", 
          price: 2000, 
          image: "./brownies.jpg",
          originalPriceRp: 20000,
          finalPriceRp: 10000,
          isReady: true 
        }
      ]
    },
    {
      id: "m11",
      brand: "J.A. Seafood",
      address: "Jambi",
      mapLink: "https://maps.app.goo.gl/AiWjKRUAu3jK6F7z5",
      icon: "logo_ja.jpg",
      items: [
        { 
          id: 22, 
          title: "Seafood Tumpah", 
          titleEn: "Mixed Seafood", 
          desc: "Diskon ±18,2%", 
          descEn: "Discount ±18.2%", 
          price: 2000, 
          image: "./seafood_tumpah.jpg",
          originalPriceRp: 55000,
          finalPriceRp: 45000,
          isReady: true 
        }
      ]
    },
    {
      id: "m12",
      brand: "Ars Snack",
      address: "Jambi",
      mapLink: "https://maps.app.goo.gl/Nr3cEYx2bDd3qkLQA",
      icon: "logo_ars.jpg",
      items: [
        { 
          id: 23, 
          title: "Pangsit Ubi Ungu", 
          titleEn: "Purple Sweet Potato Wonton", 
          desc: "Diskon ±41%", 
          descEn: "Discount ±41%", 
          price: 1400, 
          image: "./pangsit_ubi_ungu.jpg",
          originalPriceRp: 17000,
          finalPriceRp: 10000,
          isReady: true 
        },
        { 
          id: 24, 
          title: "Emping Jagung", 
          titleEn: "Corn Emping", 
          desc: "Diskon ±41%", 
          descEn: "Discount ±41%", 
          price: 1400, 
          image: "./emping_jagung.jpg",
          originalPriceRp: 17000,
          finalPriceRp: 10000,
          isReady: true 
        },
        { 
          id: 25, 
          title: "Kerichiz", 
          titleEn: "Kerichiz", 
          desc: "Diskon ±41%", 
          descEn: "Discount ±41%", 
          price: 1400, 
          image: "./kerichiz.jpg",
          originalPriceRp: 17000,
          finalPriceRp: 10000,
          isReady: true 
        },
        { 
          id: 26, 
          title: "Stick Kacang Kedelai", 
          titleEn: "Soybean Stick", 
          desc: "Diskon ±41%", 
          descEn: "Discount ±41%", 
          price: 1400, 
          image: "./stick_kacang_kedelai.jpg",
          originalPriceRp: 17000,
          finalPriceRp: 10000,
          isReady: true 
        }
      ]
    },
    {
      id: "m13",
      brand: "Juice Palanta",
      address: "Jambi",
      mapLink: "https://maps.app.goo.gl/4zwYRfnTuqJF9STG6",
      icon: "logo_juice.jpg",
      items: [
        { 
          id: 27, 
          title: "Aneka Jus Buah", 
          titleEn: "Various Fruit Juices", 
          desc: "Diskon 100%", 
          descEn: "Discount 100%", 
          price: 1000, 
          image: "./aneka_jus_buah.jpg",
          originalPriceRp: 5000,
          finalPriceRp: 0,
          isReady: true 
        }
      ]
    },
    {
      id: "m14",
      brand: "Iqola",
      address: "Jambi",
      mapLink: "https://maps.app.goo.gl/svCiZxEgM2tUino69",
      icon: "logo_iqola.jpg",
      items: [
        { 
          id: 28, 
          title: "Molen (kemasan kotakan)", 
          titleEn: "Molen (Box Packaging)", 
          desc: "Diskon 25%", 
          descEn: "Discount 25%", 
          price: 2000, 
          image: "./molen.jpeg",
          originalPriceRp: 40000,
          finalPriceRp: 30000,
          isReady: true 
        }
      ]
    }
  ];

  const handleCopyLink = (link) => {
    navigator.clipboard.writeText(link);
    alert('Link Maps berhasil disalin! Silakan paste di browser atau aplikasi ojol Anda.');
  };

  const isEn = gs?.lang === 'en';

  const handleBuy = (price, title, storeName, desc, originalPriceRp, finalPriceRp) => {
    if (gs.coins >= price && userUid) {
      
      const confirmMsg = isEn 
        ? "⚠️ ATTENTION!\n\nThis voucher is only valid for 24 HOURS after redemption. Please ensure the store is OPEN today before proceeding.\n\nAre you sure you want to redeem your coins now?" 
        : "⚠️ PERHATIAN!\n\nVoucher diskon HANYA BERLAKU 24 JAM setelah ditukarkan. Pastikan toko mitra sedang BUKA hari ini sebelum Anda menukar koin.\n\nApakah Anda yakin ingin menukar koin sekarang?";
        
      if (!window.confirm(confirmMsg)) {
        return; 
      }

      // Alih-alih langsung memproses, kita simpan data pembelian dan tampilkan modal sandi
      setPendingPurchase({ price, title, storeName, desc, originalPriceRp, finalPriceRp });
      setPasswordInput('');
      setPasswordError('');
      setShowPasswordModal(true);
      
    } else if (!userUid) {
      alert('Harap login terlebih dahulu untuk menukar kupon.');
    }
  };

  const handleConfirmPassword = async () => {
    if (!passwordInput) {
      setPasswordError('Sandi tidak boleh kosong');
      return;
    }
    
    setIsVerifying(true);
    setPasswordError('');
    
    try {
      const user = auth.currentUser;
      if (!user || !user.email) {
        throw new Error("Sesi pengguna tidak valid.");
      }
      
      // Verifikasi Sandi
      const credential = EmailAuthProvider.credential(user.email, passwordInput);
      await reauthenticateWithCredential(user, credential);
      
      // Jika sandi benar, proses penukaran voucher
      setShowPasswordModal(false);
      setIsGenerating(true);
      
      const { price, title, storeName, desc, originalPriceRp, finalPriceRp } = pendingPurchase;
      setSelectedItemTitle(`${title} (${storeName})`);
      
      spendCoins(price);
      const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
      const code = `UMKM-${randomStr}`;
      
      // Deteksi otomatis apakah ini produk Gratis atau Diskon
      const isFree = desc.toLowerCase().includes("gratis") || desc.toLowerCase().includes("free");
      let benefitText = isFree ? "GRATIS" : `Diskon (Tukar ${price} Koin)`;
      if (typeof finalPriceRp === 'number' && typeof originalPriceRp === 'number') {
        benefitText = finalPriceRp === 0 
          ? "GRATIS" 
          : `Tagih Rp ${finalPriceRp.toLocaleString('id-ID')} (Dari Rp ${originalPriceRp.toLocaleString('id-ID')})`;
      }

      // 1. Simpan ke Database
      await addDoc(collection(db, "vouchers"), {
        code: code,
        userId: userUid,
        title: title,
        store: storeName,
        benefit: benefitText,
        originalPriceRp: typeof originalPriceRp === 'number' ? originalPriceRp : null,
        finalPriceRp: typeof finalPriceRp === 'number' ? finalPriceRp : null,
        desc: desc,
        isUsed: false,
        createdAt: Date.now(),
        expiresAt: Date.now() + (24 * 60 * 60 * 1000)
      });

      // 2. Kirim Notifikasi ke Telegram Admin
      const botToken = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
      const chatId = import.meta.env.VITE_TELEGRAM_CHAT_ID;
      
      if (botToken && chatId) {
        const message = `📢 *PENUKARAN VOUCHER BARU!*\n\n🏪 *Toko:* ${storeName}\n🛍️ *Produk:* ${title}\n🎁 *Keuntungan:* ${benefitText}\n🎟️ *KODE:* \`${code}\`\n\n🕒 *Waktu:* ${new Date().toLocaleString('id-ID')}\n_Siap-siap pelanggan akan datang menukarkan kode ini dalam waktu 24 jam!_`;
        
        try {
          const url = `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(message)}&parse_mode=Markdown`;
          await fetch(url, { mode: 'no-cors' });
        } catch (telegramErr) {
          console.error("Gagal mengirim notifikasi Telegram:", telegramErr);
        }
      }

      setGeneratedCode(code);
      setShowModal(true);
      
    } catch (error) {
      console.error("Gagal verifikasi sandi:", error);
      if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        setPasswordError('Sandi salah. Silakan coba lagi.');
      } else if (error.code === 'auth/too-many-requests') {
        setPasswordError('Terlalu banyak percobaan. Coba lagi nanti.');
      } else {
        setPasswordError('Gagal memverifikasi sandi. Pastikan Anda login dengan Email dan Sandi.');
      }
    } finally {
      setIsVerifying(false);
      setIsGenerating(false);
    }
  };

  return (
    <div style={{paddingTop: 80, paddingBottom: 24, flex: 1, background:"var(--bg-main)", position: "relative"}}>
      <div style={{padding: "0 16px"}}>
        <div style={{display: "flex", flexDirection: "column", gap: 16, marginBottom: 24}}>
          <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
            <button className="tap" onClick={() => onNav('home')} style={{background: "#fff", border: "1px solid #E2E8F0", padding: "8px 16px", borderRadius: "99px", display: "flex", alignItems: "center", gap: 6, cursor: "pointer", boxShadow: "0 4px 12px rgba(0,0,0,0.04)", color: "#1E293B", fontWeight: 800, fontSize: 13}}>
              ⬅️ {isEn ? "BACK" : "KEMBALI"}
            </button>
            <button className="tap" onClick={fetchActiveVouchers} style={{background: "linear-gradient(135deg, #F59E0B, #D97706)", border: "none", padding: "10px 16px", borderRadius: "99px", display: "flex", alignItems: "center", gap: 6, cursor: "pointer", boxShadow: "0 4px 12px rgba(245,158,11,0.3)", color: "#FFF", fontWeight: 800, fontSize: 12}}>
              🎟️ {isEn ? "MY VOUCHERS" : "VOUCHER AKTIF"}
            </button>
          </div>
          <div>
            <h2 style={{fontFamily: "Exo 2", fontWeight: 900, fontSize: 28, color: C.text, margin: 0}}>Mitra UMKM 🛍️</h2>
            <p style={{fontSize: 14, color: C.textSec, margin: "4px 0 0 0"}}>{isEn ? "Exchange your SmartCoins for real local products!" : "Tukarkan SmartCoins dengan voucher produk lokal Jambi!"}</p>
          </div>
        </div>

        <div style={{display: "flex", flexDirection: "column", gap: 24}}>
          {[...stores].sort((a, b) => {
            const maxA = Math.max(...a.items.map(i => i.originalPriceRp || i.price || 0));
            const maxB = Math.max(...b.items.map(i => i.originalPriceRp || i.price || 0));
            return maxB - maxA;
          }).map((store, storeIdx) => (
            <div key={store.id} style={{background: "#fff", borderRadius: 24, padding: 20, boxShadow: "0 12px 30px rgba(0,0,0,0.06)", border: "1px solid rgba(0,0,0,0.04)", animation: `fadeUp ${.3 + storeIdx * .15}s ease both`}}>
              {/* Header Toko / Brand */}
              <div style={{display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 16, paddingBottom: 16, borderBottom: "1px solid #F1F5F9"}}>
                <div style={{display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 200}}>
                  <div style={{fontSize: 32, display: "flex", alignItems: "center"}}>
                    {store.icon.includes('.') ? (
                      <img src={`./${store.icon}`} alt="logo" style={{width: 40, height: 40, objectFit: 'contain', borderRadius: 8}} />
                    ) : (
                      store.icon
                    )}
                  </div>
                  <div style={{flex: 1}}>
                    <div style={{fontFamily: "Exo 2", fontWeight: 900, fontSize: 18, color: "#1E293B"}}>{store.brand}</div>
                    <div style={{fontSize: 12, color: "#64748B", marginTop: 4, display: "flex", alignItems: "flex-start", gap: 4}}>
                      <span>📍</span> <span>{store.address}</span>
                    </div>
                  </div>
                </div>
                {store.mapLink && (
                  <button className="tap" onClick={() => handleCopyLink(store.mapLink)} style={{background: "#EFF6FF", border: "1px solid #BFDBFE", color: "#1D4ED8", padding: "6px 12px", borderRadius: "99px", fontSize: 11, fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", gap: 4, flexShrink: 0}}>
                    📋 Salin Link Maps
                  </button>
                )}
              </div>

              {/* Grid Produk Dalam Toko */}
              <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12}}>
                {[...store.items].sort((a, b) => (b.originalPriceRp || b.price) - (a.originalPriceRp || a.price)).map((itm, i) => {
                  const canBuy = gs.coins >= itm.price;
                  return (
                    <div key={itm.id} style={{background:"var(--bg-card)", borderRadius: 20, padding: 16, boxShadow: "0 4px 12px rgba(0,0,0,0.03)", display: "flex", flexDirection: "column", border: "1px solid rgba(0,0,0,0.04)", filter: !itm.isReady ? "grayscale(80%) opacity(0.85)" : "none"}}>
                      <div 
                        onClick={() => itm.image ? setSelectedImage(itm.image) : null}
                        style={{width: 48, height: 48, borderRadius: 14, background: itm.bg || "#F1F5F9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, marginBottom: 16, boxShadow: "0 4px 10px rgba(0,0,0,0.1)", overflow: "hidden", cursor: itm.image ? "pointer" : "default"}}
                      >
                        {itm.image ? <img src={itm.image} alt={itm.title} style={{width: "100%", height: "100%", objectFit: "cover", transform: itm.imageScale ? `scale(${itm.imageScale})` : "none"}} /> : (itm.icon || "🎁")}
                      </div>
                      <div style={{fontFamily: "Exo 2", fontWeight: 900, fontSize: 14, color: C.text, marginBottom: 6, minHeight: 42, lineHeight: 1.3}}>{isEn ? itm.titleEn : itm.title}</div>
                      <div style={{fontSize: 11, color: C.textSec, lineHeight: 1.5, marginBottom: 16, flex: 1}}>{isEn ? itm.descEn : itm.desc}</div>
                      
                      <div style={{background: "rgba(245,158,11,0.1)", borderRadius: 12, padding: "6px 10px", display: "inline-flex", alignItems: "center", width: "fit-content", marginBottom: 12}}>
                        <span style={{fontWeight: 900, fontSize: 14, color: C.gold}}>{itm.price.toLocaleString("id-ID")}</span>
                        <img src="/coin.png" style={{width:"1.2em", height:"1.2em", marginLeft: 4, objectFit:"cover", borderRadius:"50%"}} alt="coin"/>
                      </div>
                      
                      {typeof itm.originalPriceRp === 'number' && typeof itm.finalPriceRp === 'number' && (
                        <div style={{marginBottom: 16, background: "#FEF2F2", padding: "8px 12px", borderRadius: 12, border: "1px dashed #FCA5A5"}}>
                          <div style={{fontSize: 11, color: "#94A3B8", textDecoration: "line-through"}}>
                            Rp {itm.originalPriceRp.toLocaleString("id-ID")}
                          </div>
                          <div style={{fontSize: 12, fontWeight: 900, color: "#EF4444", marginTop: 2}}>
                            {itm.finalPriceRp === 0
                              ? (isEn ? "FREE at cashier!" : "GRATIS di Kasir!")
                              : (isEn ? `Pay only Rp ${itm.finalPriceRp.toLocaleString("id-ID")} at cashier!` : `Cukup bayar Rp ${itm.finalPriceRp.toLocaleString("id-ID")} di Kasir!`)
                            }
                          </div>
                        </div>
                      )}
                      
                      {!itm.isReady ? (
                        <button disabled style={{width: "100%", background: "transparent", color: "#94A3B8", border: "2px dashed #CBD5E1", padding: "10px", borderRadius: 12, fontSize: 12, fontWeight: 800, cursor: "not-allowed", letterSpacing: 0.5}}>
                          🔒 {isEn ? "COMING SOON" : "SEGERA"}
                        </button>
                      ) : (
                        <button className="tap" disabled={!canBuy || isGenerating} onClick={() => handleBuy(itm.price, isEn ? itm.titleEn : itm.title, store.brand, isEn ? itm.descEn : itm.desc, itm.originalPriceRp, itm.finalPriceRp)} style={{width: "100%", background: canBuy ? "linear-gradient(135deg, #10B981, #059669)" : "#E2E8F0", color: canBuy ? "#FFF" : "#94A3B8", border: "none", padding: "10px", borderRadius: 12, fontSize: 12, fontWeight: 800, cursor: canBuy ? "pointer" : "not-allowed", letterSpacing: 0.5, boxShadow: canBuy ? "0 4px 12px rgba(16,185,129,.3)" : "none", transition: "all 0.2s"}}>
                          {isGenerating ? "..." : (canBuy ? (isEn ? "REDEEM" : "TUKAR") : (isEn ? "NEED COINS" : "KOIN KURANG"))}
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Voucher Aktif (Riwayat) */}
      {showHistoryModal && (
        <div style={{position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(15,23,42,0.8)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 999, padding: 24, backdropFilter: "blur(4px)", animation: "fadeIn .2s ease"}}>
          <div style={{background: "#F8FAFC", borderRadius: 24, padding: 24, width: "100%", maxWidth: 400, boxShadow: "0 24px 50px rgba(0,0,0,0.2)", animation: "scaleUp .3s cubic-bezier(0.175, 0.885, 0.32, 1.275)", maxHeight: "80vh", display: "flex", flexDirection: "column"}}>
            
            <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20}}>
              <h3 style={{fontFamily: "Exo 2", fontWeight: 900, fontSize: 20, color: "#1E293B", margin: 0}}>
                🎟️ {isEn ? "Active Vouchers" : "Voucher Aktif"}
              </h3>
              <button className="tap" onClick={() => setShowHistoryModal(false)} style={{background: "#F1F5F9", border: "none", width: 32, height: 32, borderRadius: 16, fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748B"}}>
                ✕
              </button>
            </div>

            <div style={{overflowY: "auto", flex: 1, paddingRight: 4, display: "flex", flexDirection: "column", gap: 12}}>
              {isLoadingHistory ? (
                <div style={{textAlign: "center", padding: "40px 0", color: "#94A3B8", fontWeight: 700}}>
                  ⏳ {isEn ? "Loading vouchers..." : "Memuat data voucher..."}
                </div>
              ) : activeVouchers.length === 0 ? (
                <div style={{textAlign: "center", padding: "40px 0", color: "#94A3B8"}}>
                  <div style={{fontSize: 48, marginBottom: 12}}>📭</div>
                  <div style={{fontWeight: 700}}>{isEn ? "No active vouchers found." : "Belum ada voucher aktif."}</div>
                  <div style={{fontSize: 12, marginTop: 4}}>{isEn ? "Redeem coins to get discounts!" : "Tukarkan koinmu dengan diskon menarik!"}</div>
                </div>
              ) : (
                activeVouchers.map(v => {
                  const timeLeft = Math.max(0, Math.floor((v.expiresAt - Date.now()) / (1000 * 60 * 60)));
                  return (
                    <div key={v.id} style={{background: "#FFF", borderRadius: 16, padding: 16, border: "2px dashed #E2E8F0"}}>
                      <div style={{fontSize: 13, color: "#64748B", fontWeight: 600, marginBottom: 4}}>{v.title}</div>
                      <div style={{fontSize: 11, color: "#94A3B8", marginBottom: 12}}>📍 {v.store}</div>
                      
                      <div style={{background: "rgba(59,130,246,0.1)", color: "#2563EB", padding: "10px", borderRadius: 12, textAlign: "center", fontFamily: "monospace", fontSize: 22, fontWeight: 900, letterSpacing: 3, marginBottom: 12}}>
                        <div style={{ background: 'white', padding: '8px', borderRadius: '8px', width: 'fit-content', margin: '0 auto 8px auto' }}>
                          <QRCode value={v.code} size={120} />
                        </div>
                        {v.code}
                      </div>
                      
                      <div style={{display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 11, fontWeight: 700}}>
                        <span style={{color: timeLeft < 2 ? "#EF4444" : "#F59E0B"}}>⏳ Sisa waktu: {timeLeft} jam</span>
                        <span style={{background: "#ECFDF5", color: "#10B981", padding: "4px 8px", borderRadius: 8}}>🟢 Aktif</span>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal Verifikasi Sandi */}
      {showPasswordModal && (
        <div style={{position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(15,23,42,0.8)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 999, padding: 24, backdropFilter: "blur(4px)", animation: "fadeIn .2s ease"}}>
          <div style={{background: "#fff", borderRadius: 24, padding: 32, width: "100%", maxWidth: 360, textAlign: "center", boxShadow: "0 24px 50px rgba(0,0,0,0.2)", animation: "scaleUp .3s cubic-bezier(0.175, 0.885, 0.32, 1.275)"}}>
            <div style={{fontSize: 48, marginBottom: 16}}>🔒</div>
            <h3 style={{fontFamily: "Exo 2", fontWeight: 900, fontSize: 20, color: "#1E293B", margin: "0 0 8px 0"}}>
              {isEn ? "Verify Password" : "Verifikasi Sandi"}
            </h3>
            <p style={{fontSize: 13, color: "#64748B", marginBottom: 24, lineHeight: 1.5}}>
              {isEn ? "Please enter your account password to confirm this redemption." : "Masukkan sandi akun Anda untuk mengonfirmasi penukaran ini demi keamanan."}
            </p>

            <div style={{position: "relative", marginBottom: 8}}>
              <input 
                type={showPassword ? "text" : "password"} 
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder={isEn ? "Enter your password" : "Ketik sandi Anda"}
                style={{
                  width: "100%", padding: "14px 44px 14px 16px", borderRadius: 14, 
                  border: passwordError ? "2px solid #EF4444" : "2px solid #E2E8F0", 
                  fontSize: 15, fontFamily: "inherit", outline: "none",
                  background: "#F8FAFC", boxSizing: "border-box"
                }}
                onKeyDown={(e) => e.key === 'Enter' && handleConfirmPassword()}
              />
              <div 
                className="tap"
                onClick={() => setShowPassword(!showPassword)}
                style={{position: "absolute", right: 14, top: 14, cursor: "pointer", fontSize: 18, filter: showPassword ? "none" : "grayscale(100%) opacity(0.5)"}}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </div>
            </div>
            {passwordError && (
              <div style={{color: "#EF4444", fontSize: 12, fontWeight: 700, marginBottom: 16, textAlign: "left", paddingLeft: 4}}>
                {passwordError}
              </div>
            )}
            {!passwordError && <div style={{height: 16, marginBottom: 16}}></div>}

            <div style={{display: "flex", gap: 12}}>
              <button 
                onClick={() => { setShowPasswordModal(false); setPasswordInput(''); setPasswordError(''); setShowPassword(false); }}
                disabled={isVerifying}
                style={{flex: 1, padding: "14px 0", borderRadius: 14, border: "none", background: "#F1F5F9", color: "#64748B", fontWeight: 800, cursor: isVerifying ? "not-allowed" : "pointer"}}
              >
                {isEn ? "CANCEL" : "BATAL"}
              </button>
              <button 
                onClick={handleConfirmPassword}
                disabled={isVerifying}
                style={{flex: 1, padding: "14px 0", borderRadius: 14, border: "none", background: "linear-gradient(135deg, #10B981, #059669)", color: "#FFF", fontWeight: 800, cursor: isVerifying ? "not-allowed" : "pointer", boxShadow: "0 4px 12px rgba(16,185,129,0.3)"}}
              >
                {isVerifying ? "..." : (isEn ? "CONFIRM" : "KONFIRMASI")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Voucher */}
      {showModal && (
        <div style={{position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(15,23,42,0.8)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 999, padding: 24, backdropFilter: "blur(4px)", animation: "fadeIn .2s ease"}}>
          <div style={{background: "#fff", padding: 32, borderRadius: 24, width: "100%", maxWidth: 340, textAlign: "center", position: "relative", animation: "popIn .3s cubic-bezier(0.34, 1.56, 0.64, 1)"}}>
            <button onClick={() => setShowModal(false)} style={{position: "absolute", top: 16, right: 16, background: "#F1F5F9", border: "none", width: 32, height: 32, borderRadius: "50%", fontWeight: "bold", color: "#64748B", cursor: "pointer"}}>✕</button>
            <div style={{fontSize: 50, marginBottom: 8}}>🎉</div>
            <h3 style={{margin: "0 0 8px 0", color: "#1E293B", fontSize: 20, fontWeight: 900}}>Penukaran Berhasil!</h3>
            <p style={{margin: "0 0 24px 0", color: "#64748B", fontSize: 14}}>{selectedItemTitle}</p>
            
            <div style={{background: "#F8FAFC", border: "2px dashed #CBD5E1", borderRadius: 16, padding: 20, marginBottom: 24}}>
              <p style={{margin: "0 0 8px 0", fontSize: 12, fontWeight: "bold", color: "#94A3B8"}}>KODE VOUCHER ANDA:</p>
              <div style={{ background: 'white', padding: '12px', borderRadius: '12px', width: 'fit-content', margin: '0 auto 16px auto', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                <QRCode value={generatedCode} size={160} />
              </div>
              <div style={{fontSize: 32, fontWeight: 900, color: "#2563EB", letterSpacing: 4}}>{generatedCode}</div>
            </div>

            <div style={{background: "#FEF3C7", color: "#92400E", padding: 12, borderRadius: 12, fontSize: 12, fontWeight: "bold", display: "flex", alignItems: "center", gap: 8, textAlign: "left"}}>
              <span style={{fontSize: 20}}>⚠️</span> Tunjukkan kode ini ke Kasir UMKM. Voucher akan hangus dalam 24 Jam.
            </div>
            
          </div>
        </div>
      )}

      {/* Modal Zoom Gambar */}
      {selectedImage && (
        <div style={{position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.8)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000, padding: 24, backdropFilter: "blur(5px)", animation: "fadeIn .2s ease"}} onClick={() => setSelectedImage(null)}>
          <div style={{position: "relative", maxWidth: "100%", maxHeight: "100%"}}>
            <button onClick={() => setSelectedImage(null)} style={{position: "absolute", top: -40, right: 0, background: "transparent", border: "none", color: "#FFF", fontSize: 32, cursor: "pointer"}}>✕</button>
            <img src={selectedImage} alt="Zoomed" style={{maxWidth: "100%", maxHeight: "80vh", borderRadius: 16, objectFit: "contain", boxShadow: "0 10px 30px rgba(0,0,0,0.5)", animation: "popIn .3s cubic-bezier(0.34, 1.56, 0.64, 1)"}} />
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes popIn { from { transform: scale(0.9); opacity: 0 } to { transform: scale(1); opacity: 1 } }
      `}</style>
    </div>
  );
}
