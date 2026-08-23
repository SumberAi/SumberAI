import React from 'react';

export default function PrivacyScreen({ onNav, gs }) {
  const isEn = gs?.lang === 'en';
  
  return (
    <div style={{paddingTop: "calc(64px + env(safe-area-inset-top))", paddingBottom: 24, minHeight: "100vh", background: "var(--bg-main)", color: "var(--text-main)"}}>
      <div style={{padding: "20px 16px"}}>
        
        <div style={{display:"flex", alignItems:"center", gap:16, marginBottom:24}}>
          <div className="tap" onClick={() => onNav('pricing')} style={{width:40,height:40,borderRadius:"50%",background:"var(--bg-card)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 12px rgba(0,0,0,0.1)",cursor:"pointer",fontSize:20,border:"1px solid var(--border-color)"}}>
            <span style={{position:"relative",left:-1}}>←</span>
          </div>
          <h1 style={{fontFamily:"Exo 2", fontWeight:900, fontSize:22, margin:0}}>
            {isEn ? "Privacy Policy" : "Kebijakan Privasi"}
          </h1>
        </div>

        <div style={{background: "var(--bg-card)", borderRadius: 24, padding: "24px 20px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)"}}>
          <p style={{fontSize: 14, color: "var(--text-sec)", marginBottom: 16}}>
            Last updated: August 2026
          </p>
          
          <h2 style={{fontFamily:"Exo 2", fontWeight:800, fontSize:18, marginTop: 24, marginBottom: 12}}>1. Information We Collect</h2>
          <p style={{fontSize: 14, lineHeight: 1.6, color: "var(--text-sec)", marginBottom: 16}}>
            When you use SumberAI, we collect minimal information necessary to provide our services, such as your email address for authentication and basic profile data (name, avatar, learning progress). We do not collect sensitive financial information, as payments are handled securely by Apple or our designated payment processors.
          </p>
          
          <h2 style={{fontFamily:"Exo 2", fontWeight:800, fontSize:18, marginTop: 24, marginBottom: 12}}>2. How We Use Your Data</h2>
          <p style={{fontSize: 14, lineHeight: 1.6, color: "var(--text-sec)", marginBottom: 16}}>
            Your data is used strictly to enhance your learning experience, track your progress in English Lab and AI Academy, and provide personalized AI tutoring. We do not sell your personal data to third parties.
          </p>
          
          <h2 style={{fontFamily:"Exo 2", fontWeight:800, fontSize:18, marginTop: 24, marginBottom: 12}}>3. Subscriptions (In-App Purchases)</h2>
          <p style={{fontSize: 14, lineHeight: 1.6, color: "var(--text-sec)", marginBottom: 16}}>
            Our app offers auto-renewing subscriptions (e.g., Premium bundles). Payment will be charged to your Apple ID account at the confirmation of purchase. Subscription automatically renews unless it is canceled at least 24 hours before the end of the current period. Your account will be charged for renewal within 24 hours prior to the end of the current period. You can manage and cancel your subscriptions by going to your account settings on the App Store after purchase.
          </p>
          
          <h2 style={{fontFamily:"Exo 2", fontWeight:800, fontSize:18, marginTop: 24, marginBottom: 12}}>4. Camera and Photo Library Access</h2>
          <p style={{fontSize: 14, lineHeight: 1.6, color: "var(--text-sec)", marginBottom: 16}}>
            Our app requests access to your device's camera and photo library solely for the purpose of allowing you to upload a custom profile avatar. These images are stored securely on our servers and are not shared publicly.
          </p>

          <h2 style={{fontFamily:"Exo 2", fontWeight:800, fontSize:18, marginTop: 24, marginBottom: 12}}>5. Contact Us</h2>
          <p style={{fontSize: 14, lineHeight: 1.6, color: "var(--text-sec)", marginBottom: 16}}>
            If you have any questions regarding this privacy policy or your data, please contact us at: sumberai.unja@gmail.com
          </p>
        </div>

      </div>
    </div>
  );
}
