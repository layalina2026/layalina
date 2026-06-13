import { useState, useEffect, useRef } from "react";
import { auth, db, googleProvider } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile
} from "firebase/auth";
import {
  doc, setDoc, getDoc, collection,
  addDoc, query, where, getDocs, onSnapshot, updateDoc
} from "firebase/firestore";

// ═══════════════════════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════════════════════
const SERVICES_DATA = [
  { id:1, category:"قاعات الأفراح", icon:"🏛️", color:"#C084FC",
    imgs:["https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400&q=80","https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400&q=80","https://images.unsplash.com/photo-1478146059778-26028b07395a?w=400&q=80"],
    items:[
      { id:101, name:"قاعة النيل الكبرى", price:15000, unit:"ليلة", rating:4.9, badge:"الأكثر حجزاً", provider:"مجمع النيل للأفراح", desc:"قاعة فاخرة تسع 500 شخص مع ديكور ملكي", area:"القاهرة", district:"مدينة نصر", verified:true, sponsored:true, img:"https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400&q=80" },
      { id:102, name:"قاعة الأميرة", price:8000, unit:"ليلة", rating:4.7, badge:null, provider:"قصر الأفراح", desc:"قاعة أنيقة تسع 250 شخص", area:"الجيزة", district:"الدقي", verified:true, sponsored:false, img:"https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400&q=80" },
      { id:103, name:"قاعة الزمرد", price:12000, unit:"ليلة", rating:4.8, badge:"جديد", provider:"فيلا الزمرد", desc:"قاعة حديثة بتصميم عصري تسع 350 شخص", area:"القاهرة", district:"التجمع الخامس", verified:true, sponsored:false, img:"https://images.unsplash.com/photo-1478146059778-26028b07395a?w=400&q=80" },
    ]},
  { id:2, category:"تصوير", icon:"📸", color:"#34D399",
    imgs:["https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=400&q=80","https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=400&q=80"],
    items:[
      { id:201, name:"باقة التصوير الكاملة", price:5000, unit:"يوم", rating:5.0, badge:"مميز", provider:"استوديو لحظة", desc:"تصوير + فيديو + كليب + ألبوم فاخر", area:"القاهرة", district:"مدينة نصر", verified:true, sponsored:true, img:"https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=400&q=80" },
      { id:202, name:"باقة التصوير الأساسية", price:2500, unit:"يوم", rating:4.6, badge:null, provider:"فريق الذكريات", desc:"تصوير فوتوغرافي احترافي", area:"الجيزة", district:"العجوزة", verified:false, sponsored:false, img:"https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=400&q=80" },
    ]},
  { id:3, category:"كوافير حريمي", icon:"💄", color:"#F472B6",
    imgs:["https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&q=80","https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&q=80"],
    items:[
      { id:301, name:"باقة العروسة الملكية", price:3500, unit:"يوم", rating:4.8, badge:"الأعلى تقييماً", provider:"صالون لمسة نور", desc:"مكياج + كوافير + باديكير + مانيكير", area:"القاهرة", district:"مصر الجديدة", verified:true, sponsored:true, img:"https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&q=80" },
      { id:302, name:"مكياج العروسة فقط", price:1500, unit:"جلسة", rating:4.5, badge:null, provider:"بيوتي لاين", desc:"مكياج احترافي بأحدث تقنيات", area:"الجيزة", district:"الدقي", verified:false, sponsored:false, img:"https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&q=80" },
    ]},
  { id:4, category:"كوافير رجالي", icon:"✂️", color:"#60A5FA",
    imgs:["https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&q=80"],
    items:[
      { id:401, name:"باقة العريس VIP", price:800, unit:"جلسة", rating:4.7, badge:null, provider:"باربر كينج", desc:"حلاقة + لحية + عناية بالبشرة", area:"القاهرة", district:"مدينة نصر", verified:true, sponsored:false, img:"https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&q=80" },
    ]},
  { id:5, category:"مأذون", icon:"📜", color:"#FBBF24",
    imgs:["https://images.unsplash.com/photo-1606800052052-a08af7148866?w=400&q=80"],
    items:[
      { id:501, name:"توثيق عقد الزواج", price:500, unit:"عقد", rating:4.9, badge:null, provider:"مأذون معتمد", desc:"توثيق رسمي + حضور لموقع الفرح", area:"القاهرة والجيزة", district:"الكل", verified:true, sponsored:false, img:"https://images.unsplash.com/photo-1606800052052-a08af7148866?w=400&q=80" },
    ]},
  { id:6, category:"محلات ورد", icon:"🌹", color:"#FB7185",
    imgs:["https://images.unsplash.com/photo-1487530811015-780b2c7a4f94?w=400&q=80","https://images.unsplash.com/photo-1490750967868-88df5691cc95?w=400&q=80"],
    items:[
      { id:601, name:"باقة زهور الفرح الكاملة", price:3000, unit:"حفل", rating:4.8, badge:"مميز", provider:"فلاور هاوس", desc:"تزيين القاعة + باقة العروسة + بوتونيير", area:"القاهرة", district:"مصر الجديدة", verified:true, sponsored:false, img:"https://images.unsplash.com/photo-1487530811015-780b2c7a4f94?w=400&q=80" },
      { id:602, name:"باقة ورد العروسة", price:600, unit:"باقة", rating:4.6, badge:null, provider:"روز لاند", desc:"باقة ورد طازجة مخصصة للعروسة", area:"الجيزة", district:"العجوزة", verified:false, sponsored:false, img:"https://images.unsplash.com/photo-1490750967868-88df5691cc95?w=400&q=80" },
    ]},
  { id:7, category:"حلويات", icon:"🎂", color:"#F59E0B",
    imgs:["https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=400&q=80","https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=400&q=80"],
    items:[
      { id:701, name:"تورتة الزفاف الملكية", price:2500, unit:"تورتة", rating:4.9, badge:"الأكثر طلباً", provider:"باتيسري سويت دريم", desc:"5 طوابق - تصميم مخصص", area:"القاهرة", district:"مدينة نصر", verified:true, sponsored:true, img:"https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=400&q=80" },
      { id:702, name:"حلوى الفرح المتنوعة", price:1200, unit:"كيلو", rating:4.7, badge:null, provider:"حلويات السعادة", desc:"تشكيلة فاخرة من الحلوى", area:"الجيزة", district:"الدقي", verified:false, sponsored:false, img:"https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=400&q=80" },
    ]},
  { id:8, category:"فنادق", icon:"🏨", color:"#818CF8",
    imgs:["https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400&q=80"],
    items:[
      { id:801, name:"جناح العرسان الملكي", price:4500, unit:"ليلة", rating:5.0, badge:"5 نجوم", provider:"فندق النيل هيلتون", desc:"جناح فاخر مع إطلالة على النيل", area:"القاهرة", district:"وسط البلد", verified:true, sponsored:false, img:"https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400&q=80" },
    ]},
  { id:9, category:"شهر العسل", icon:"✈️", color:"#2DD4BF",
    imgs:["https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&q=80","https://images.unsplash.com/photo-1530521954074-e64f6810b32d?w=400&q=80"],
    items:[
      { id:901, name:"باقة المالديف 7 ليالي", price:45000, unit:"باقة", rating:4.9, badge:"الأكثر حجزاً", provider:"سنباك تورز", desc:"طيران + فندق 5 نجوم + جولات", area:"القاهرة", district:"مصر الجديدة", verified:true, sponsored:false, img:"https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&q=80" },
      { id:902, name:"باقة تركيا 5 ليالي", price:18000, unit:"باقة", rating:4.7, badge:null, provider:"دريم ترافيل", desc:"اسطنبول + فندق + جولات", area:"الجيزة", district:"الدقي", verified:false, sponsored:false, img:"https://images.unsplash.com/photo-1530521954074-e64f6810b32d?w=400&q=80" },
    ]},
  { id:10, category:"تشطيب شقق", icon:"🏠", color:"#A78BFA",
    imgs:["https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=400&q=80"],
    items:[
      { id:1001, name:"تشطيب سوبر لوكس", price:35000, unit:"شقة", rating:4.8, badge:null, provider:"ديكور برستيج", desc:"تشطيب كامل مع الديكور والإضاءة", area:"القاهرة والجيزة", district:"الكل", verified:true, sponsored:false, img:"https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=400&q=80" },
    ]},
  { id:11, category:"عفش العريس", icon:"🛋️", color:"#FCD34D",
    imgs:["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80"],
    items:[
      { id:1101, name:"غرفة نوم كاملة فاخرة", price:25000, unit:"طقم", rating:4.6, badge:null, provider:"هوم كلاسيك", desc:"غرفة نوم كاملة بخشب طبيعي", area:"الجيزة", district:"العجوزة", verified:false, sponsored:false, img:"https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80" },
    ]},
  { id:12, category:"إيجار سيارات", icon:"🚗", color:"#38BDF8",
    imgs:["https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&q=80","https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=400&q=80"],
    items:[
      { id:1201, name:"ليموزين الزفاف الفاخرة", price:2000, unit:"يوم", rating:4.9, badge:"مميز", provider:"رويال ليموزين", desc:"سيارة زفاف فاخرة مزينة مع سائق", area:"القاهرة", district:"مدينة نصر", verified:true, sponsored:false, img:"https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&q=80" },
      { id:1202, name:"موكب سيارات (5 سيارات)", price:5000, unit:"يوم", rating:4.8, badge:null, provider:"إليت كارز", desc:"موكب 5 سيارات فاخرة مزينة", area:"الجيزة", district:"الدقي", verified:false, sponsored:false, img:"https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=400&q=80" },
    ]},
  { id:13, category:"أول بيبي", icon:"👶", color:"#6EE7B7",
    imgs:["https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400&q=80"],
    items:[
      { id:1301, name:"باقة استقبال المولود", price:3500, unit:"باقة", rating:4.9, badge:"جديد", provider:"بيبي وورلد", desc:"تصوير + ديكور + هدايا استقبال", area:"القاهرة", district:"مصر الجديدة", verified:true, sponsored:false, img:"https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400&q=80" },
    ]},
];

const BANNERS_INIT = [
  { id:1, title:"قاعة النيل الكبرى", sub:"احجز ليلة فرحك بأفضل الأسعار", img:"https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80", active:true, sponsored:true },
  { id:2, title:"استوديو لحظة للتصوير", sub:"باقات VIP للتصوير والفيديو", img:"https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=800&q=80", active:true, sponsored:true },
  { id:3, title:"رويال ليموزين", sub:"موكب زفاف لا يُنسى", img:"https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80", active:true, sponsored:false },
];

const WHATSAPP_NUMBER = "201000000000";
const ADMIN_PASSWORD  = "Layalina@2025#Secure";
const REFERRAL_DISCOUNT = 5;

const C = {
  bg:"#080810", card:"#10101C", border:"#1E1E35", borderHi:"#7C3AED",
  primary:"#7C3AED", secondary:"#EC4899", accent:"#06B6D4",
  gold:"#F59E0B", text:"#F1F5F9", sub:"#94A3B8", muted:"#475569",
  success:"#10B981", danger:"#F43F5E", warn:"#F59E0B",
  grad:"linear-gradient(135deg,#7C3AED,#EC4899)",
  gradG:"linear-gradient(135deg,#F59E0B,#EF4444)",
  glow:"0 0 30px rgba(124,58,237,0.25)",
};

const glb = `
  @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&display=swap');
  *{box-sizing:border-box;margin:0;padding:0}
  body{background:#080810;color:#F1F5F9;font-family:'Cairo',sans-serif;direction:rtl}
  ::-webkit-scrollbar{width:3px}
  ::-webkit-scrollbar-thumb{background:#7C3AED;border-radius:4px}
  @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}
`;

// ─── Helpers ──────────────────────────────────────────────
function Stars({ r }) {
  return (
    <span style={{color:"#F59E0B",fontSize:11}}>
      {"★".repeat(Math.floor(r))}{"☆".repeat(5-Math.floor(r))}
      <span style={{color:"#94A3B8",fontSize:10,marginRight:3}}>{r}</span>
    </span>
  );
}

function BottomSheet({ children, onClose, title }) {
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.88)",backdropFilter:"blur(8px)",zIndex:400,display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={{background:C.card,borderRadius:"20px 20px 0 0",width:"100%",maxWidth:520,maxHeight:"92vh",overflowY:"auto",border:`1px solid ${C.border}`,borderBottom:"none"}}>
        {title&&(
          <div style={{padding:"13px 16px 9px",borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center",position:"sticky",top:0,background:C.card,zIndex:1}}>
            <div style={{fontSize:13,fontWeight:800,color:C.text}}>{title}</div>
            <button onClick={onClose} style={{background:C.bg,border:`1px solid ${C.border}`,color:C.sub,width:26,height:26,borderRadius:6,cursor:"pointer",fontSize:15}}>×</button>
          </div>
        )}
        <div style={{padding:"13px 16px 28px"}}>{children}</div>
      </div>
    </div>
  );
}

// ─── Auth Modal ───────────────────────────────────────────
function AuthModal({ onClose, onSuccess }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({name:"",email:"",phone:"",password:"",referral:""});
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const inp = {width:"100%",background:C.bg,border:`1px solid ${C.border}`,borderRadius:10,padding:"10px 13px",fontSize:12,color:C.text,fontFamily:"inherit",outline:"none",boxSizing:"border-box",marginBottom:8};

  const handleEmail = async() => {
    if(!form.email||!form.password) return setErr("يرجى ملء الحقول المطلوبة");
    if(mode==="register"&&!form.name) return setErr("يرجى إدخال الاسم");
    setLoading(true); setErr("");
    try {
      if(mode==="register") {
        const cred = await createUserWithEmailAndPassword(auth, form.email, form.password);
        await updateProfile(cred.user, {displayName: form.name});
        await setDoc(doc(db,"users",cred.user.uid), {
          name:form.name, email:form.email, phone:form.phone||"",
          referralCode: cred.user.uid.slice(0,8).toUpperCase(),
          referredBy: form.referral||"", discount:form.referral?REFERRAL_DISCOUNT:0,
          createdAt: new Date().toISOString(), favs:[], points:0
        });
        if(form.referral) {
          const q = query(collection(db,"users"), where("referralCode","==",form.referral));
          const snap = await getDocs(q);
          if(!snap.empty) {
            const refDoc = snap.docs[0];
            await updateDoc(doc(db,"users",refDoc.id), {points: (refDoc.data().points||0)+100});
          }
        }
      } else {
        await signInWithEmailAndPassword(auth, form.email, form.password);
      }
      onSuccess();
    } catch(e) {
      setErr(e.code==="auth/email-already-in-use"?"الإيميل مسجل بالفعل":e.code==="auth/wrong-password"?"كلمة المرور غلط":e.code==="auth/user-not-found"?"المستخدم غير موجود":"حدث خطأ، حاول مرة أخرى");
    }
    setLoading(false);
  };

  const handleGoogle = async() => {
    setLoading(true); setErr("");
    try {
      const cred = await signInWithPopup(auth, googleProvider);
      const userDoc = await getDoc(doc(db,"users",cred.user.uid));
      if(!userDoc.exists()) {
        await setDoc(doc(db,"users",cred.user.uid), {
          name:cred.user.displayName||"", email:cred.user.email||"",
          phone:"", referralCode: cred.user.uid.slice(0,8).toUpperCase(),
          referredBy:"", discount:0, createdAt:new Date().toISOString(), favs:[], points:0
        });
      }
      onSuccess();
    } catch(e) { setErr("فشل تسجيل الدخول بجوجل"); }
    setLoading(false);
  };

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.92)",backdropFilter:"blur(12px)",zIndex:500,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div style={{background:C.card,borderRadius:20,padding:22,width:"100%",maxWidth:340,border:`1px solid ${C.border}`,boxShadow:C.glow,maxHeight:"90vh",overflowY:"auto"}}>
        <div style={{textAlign:"center",marginBottom:16}}>
          <div style={{fontSize:28,fontWeight:900,background:C.grad,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",marginBottom:4}}>ليالينا 🌙</div>
          <div style={{fontSize:13,fontWeight:800,color:C.text}}>{mode==="login"?"تسجيل الدخول":"إنشاء حساب جديد"}</div>
        </div>

        {mode==="register"&&<input style={inp} placeholder="الاسم الكامل *" value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))}/>}
        <input style={inp} placeholder="البريد الإلكتروني *" type="email" value={form.email} onChange={e=>setForm(p=>({...p,email:e.target.value}))}/>
        {mode==="register"&&<input style={inp} placeholder="رقم الهاتف" value={form.phone} onChange={e=>setForm(p=>({...p,phone:e.target.value}))}/>}
        <input style={inp} placeholder="كلمة المرور *" type="password" value={form.password} onChange={e=>setForm(p=>({...p,password:e.target.value}))}/>
        {mode==="register"&&(
          <div>
            <input style={inp} placeholder="كود الدعوة (اختياري - للحصول على خصم 5%)" value={form.referral} onChange={e=>setForm(p=>({...p,referral:e.target.value.toUpperCase()}))}/>
            <div style={{fontSize:10,color:C.accent,marginBottom:8,marginTop:-4}}>💡 أدخل كود دعوة صديق واحصل على خصم {REFERRAL_DISCOUNT}%</div>
          </div>
        )}

        {err&&<div style={{color:C.danger,fontSize:11,textAlign:"center",marginBottom:8,background:"rgba(244,63,94,0.1)",padding:"6px 10px",borderRadius:8}}>{err}</div>}

        <button onClick={handleEmail} disabled={loading} style={{width:"100%",background:loading?"#333":C.grad,color:"#fff",border:"none",padding:"12px 0",borderRadius:11,fontSize:13,fontWeight:800,cursor:"pointer",fontFamily:"inherit",marginBottom:10}}>
          {loading?"⏳ جاري...":mode==="login"?"🔐 تسجيل الدخول":"✨ إنشاء الحساب"}
        </button>

        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
          <div style={{flex:1,height:1,background:C.border}}/>
          <span style={{fontSize:10,color:C.muted}}>أو</span>
          <div style={{flex:1,height:1,background:C.border}}/>
        </div>

        <button onClick={handleGoogle} disabled={loading} style={{width:"100%",background:"rgba(255,255,255,0.06)",color:C.text,border:`1px solid ${C.border}`,padding:"11px 0",borderRadius:11,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit",marginBottom:14,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
          <span style={{fontSize:16}}>🔵</span> الدخول بحساب Google
        </button>

        <div style={{textAlign:"center",fontSize:11,color:C.sub}}>
          {mode==="login"?"مش عندك حساب؟ ":"عندك حساب؟ "}
          <span onClick={()=>{ setMode(mode==="login"?"register":"login"); setErr(""); }} style={{color:C.primary,cursor:"pointer",fontWeight:700}}>
            {mode==="login"?"سجل دلوقتي":"سجل الدخول"}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Profile Modal ────────────────────────────────────────
function ProfileModal({ user, userData, onClose, onSignOut }) {
  const [copied, setCopied] = useState(false);
  const refCode = userData?.referralCode || "";
  const refLink = `https://layalina.vercel.app?ref=${refCode}`;

  const copyRef = () => {
    navigator.clipboard.writeText(refLink);
    setCopied(true);
    setTimeout(()=>setCopied(false),2000);
  };

  const shareWhatsApp = () => {
    const msg = encodeURIComponent(`🌙 انضم لليالينا - أفضل منصة لخدمات الزفاف!\nاستخدم كود الدعوة الخاص بي واحصل على خصم ${REFERRAL_DISCOUNT}%\nالكود: ${refCode}\nالرابط: ${refLink}`);
    window.open(`https://wa.me/?text=${msg}`,"_blank");
  };

  return (
    <BottomSheet title="👤 حسابي" onClose={onClose}>
      <div style={{display:"flex",alignItems:"center",gap:12,background:C.bg,border:`1px solid ${C.border}`,borderRadius:14,padding:14,marginBottom:14}}>
        <div style={{width:48,height:48,borderRadius:"50%",background:C.grad,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,fontWeight:900,color:"#fff",flexShrink:0}}>
          {user?.displayName?.[0]||user?.email?.[0]||"؟"}
        </div>
        <div style={{flex:1}}>
          <div style={{fontSize:14,fontWeight:800,color:C.text}}>{user?.displayName||"مستخدم"}</div>
          <div style={{fontSize:11,color:C.sub}}>{user?.email}</div>
          {userData?.phone&&<div style={{fontSize:11,color:C.sub}}>📞 {userData.phone}</div>}
        </div>
      </div>

      {userData?.discount>0&&(
        <div style={{background:"rgba(16,185,129,0.1)",border:`1px solid rgba(16,185,129,0.2)`,borderRadius:12,padding:12,marginBottom:12,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div><div style={{fontSize:12,fontWeight:700,color:C.success}}>🎉 خصم الدعوة</div><div style={{fontSize:10,color:C.sub}}>على حجزك القادم</div></div>
          <div style={{fontSize:20,fontWeight:900,color:C.success}}>{userData.discount}%</div>
        </div>
      )}

      <div style={{background:"rgba(124,58,237,0.08)",border:`1px solid rgba(124,58,237,0.15)`,borderRadius:12,padding:12,marginBottom:14}}>
        <div style={{fontSize:12,fontWeight:700,color:C.text,marginBottom:6}}>🎁 ادعو أصدقاءك واكسب</div>
        <div style={{fontSize:10,color:C.sub,marginBottom:10,lineHeight:1.6}}>
          شارك كودك مع أصدقاءك — لما أي حد يسجل بكودك هيحصل على خصم {REFERRAL_DISCOUNT}% وأنت بتكسب نقاط هدايا! 🎉
        </div>
        <div style={{background:C.bg,border:`1px solid ${C.border}`,borderRadius:8,padding:"8px 12px",marginBottom:8,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span style={{fontSize:13,fontWeight:900,color:C.primary,letterSpacing:2}}>{refCode}</span>
          <button onClick={copyRef} style={{background:copied?"rgba(16,185,129,0.15)":C.grad,color:"#fff",border:"none",borderRadius:7,padding:"4px 10px",cursor:"pointer",fontSize:10,fontWeight:700,fontFamily:"inherit"}}>{copied?"✓ نسخ":"نسخ"}</button>
        </div>
        <div style={{display:"flex",gap:7}}>
          <button onClick={shareWhatsApp} style={{flex:1,background:"rgba(37,211,102,0.12)",color:"#25D366",border:`1px solid rgba(37,211,102,0.25)`,padding:"8px 0",borderRadius:9,cursor:"pointer",fontSize:11,fontWeight:700,fontFamily:"inherit"}}>📱 واتساب</button>
          <button onClick={()=>{ const msg=encodeURIComponent(`🌙 انضم لليالينا! كود الدعوة: ${refCode} - رابط: ${refLink}`); window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(refLink)}`,"_blank"); }} style={{flex:1,background:"rgba(59,89,152,0.12)",color:"#4267B2",border:`1px solid rgba(59,89,152,0.25)`,padding:"8px 0",borderRadius:9,cursor:"pointer",fontSize:11,fontWeight:700,fontFamily:"inherit"}}>📘 فيسبوك</button>
        </div>
      </div>

      {userData?.points>0&&(
        <div style={{background:"rgba(245,158,11,0.08)",border:`1px solid rgba(245,158,11,0.15)`,borderRadius:12,padding:12,marginBottom:14,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div><div style={{fontSize:12,fontWeight:700,color:C.gold}}>🏆 نقاطي</div><div style={{fontSize:10,color:C.sub}}>من دعوة الأصدقاء</div></div>
          <div style={{fontSize:20,fontWeight:900,color:C.gold}}>{userData.points}</div>
        </div>
      )}

      <button onClick={onSignOut} style={{width:"100%",background:"rgba(244,63,94,0.1)",color:C.danger,border:`1px solid rgba(244,63,94,0.2)`,padding:"11px 0",borderRadius:11,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
        🚪 تسجيل الخروج
      </button>
    </BottomSheet>
  );
}

// ─── Invite Card Modal ────────────────────────────────────
function InviteModal({ user, userData, order, onClose }) {
  const refCode = userData?.referralCode||"";
  const msg = encodeURIComponent(`🌙 دعوة لحضور فرحنا!\n\nيشرفنا حضوركم في حفل زفافنا\n\nوللحجز في ليالينا واحصل على خصم ${REFERRAL_DISCOUNT}%\nاستخدم كود: ${refCode}`);

  return (
    <BottomSheet title="💌 كارت الدعوة" onClose={onClose}>
      <div style={{background:"linear-gradient(135deg,#1a0a2e,#0d1b3e)",border:`1px solid rgba(124,58,237,0.3)`,borderRadius:20,padding:24,marginBottom:14,textAlign:"center",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:-20,right:-20,width:100,height:100,borderRadius:"50%",background:"rgba(124,58,237,0.1)"}}/>
        <div style={{position:"absolute",bottom:-20,left:-20,width:80,height:80,borderRadius:"50%",background:"rgba(236,72,153,0.1)"}}/>
        <div style={{fontSize:30,marginBottom:8}}>🌙💍</div>
        <div style={{fontSize:18,fontWeight:900,background:C.grad,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",marginBottom:6}}>دعوة زفاف</div>
        <div style={{fontSize:14,color:C.text,fontWeight:700,marginBottom:4}}>{user?.displayName||"العروسين"}</div>
        {order?.date&&<div style={{fontSize:12,color:C.sub,marginBottom:10}}>📅 {order.date}</div>}
        <div style={{fontSize:11,color:C.sub,lineHeight:1.7,marginBottom:10}}>يشرفنا حضوركم في حفل زفافنا السعيد</div>
        <div style={{background:"rgba(255,255,255,0.05)",borderRadius:10,padding:"8px 14px",fontSize:10,color:C.accent}}>
          🎁 احجز خدمات فرحك من ليالينا واحصل على خصم {REFERRAL_DISCOUNT}%<br/>
          كود الدعوة: <strong style={{color:C.primary}}>{refCode}</strong>
        </div>
      </div>

      <div style={{fontSize:12,fontWeight:700,color:C.text,marginBottom:10}}>شارك الدعوة عبر:</div>
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        <button onClick={()=>window.open(`https://wa.me/?text=${msg}`,"_blank")} style={{background:"rgba(37,211,102,0.12)",color:"#25D366",border:`1px solid rgba(37,211,102,0.25)`,padding:"12px 0",borderRadius:11,cursor:"pointer",fontSize:12,fontWeight:700,fontFamily:"inherit"}}>
          📱 مشاركة عبر واتساب
        </button>
        <button onClick={()=>window.open(`https://www.facebook.com/sharer/sharer.php?u=https://layalina.vercel.app`,"_blank")} style={{background:"rgba(59,89,152,0.12)",color:"#4267B2",border:`1px solid rgba(59,89,152,0.25)`,padding:"12px 0",borderRadius:11,cursor:"pointer",fontSize:12,fontWeight:700,fontFamily:"inherit"}}>
          📘 مشاركة عبر فيسبوك
        </button>
        <button onClick={()=>{ const sms=`sms:?body=${msg}`; window.open(sms); }} style={{background:"rgba(124,58,237,0.12)",color:C.primary,border:`1px solid rgba(124,58,237,0.25)`,padding:"12px 0",borderRadius:11,cursor:"pointer",fontSize:12,fontWeight:700,fontFamily:"inherit"}}>
          💬 مشاركة عبر SMS
        </button>
      </div>
    </BottomSheet>
  );
}

// ─── Banner Slider ────────────────────────────────────────
function BannerSlider({ banners }) {
  const active = banners.filter(b=>b.active);
  const [cur, setCur] = useState(0);
  useEffect(()=>{
    if(active.length<2) return;
    const t=setInterval(()=>setCur(p=>(p+1)%active.length),5000);
    return ()=>clearInterval(t);
  },[active.length]);
  if(!active.length) return null;
  const b=active[cur%active.length];
  return (
    <div style={{position:"relative",height:210,overflow:"hidden"}}>
      <img src={b.img} alt={b.title} style={{width:"100%",height:"100%",objectFit:"cover",filter:"brightness(0.4)"}}/>
      <div style={{position:"absolute",inset:0,background:"linear-gradient(to top,rgba(8,8,16,0.98) 0%,transparent 55%)"}}/>
      <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",justifyContent:"flex-end",padding:"0 16px 16px"}}>
        {b.sponsored&&<div style={{background:C.gradG,color:"#fff",padding:"2px 9px",borderRadius:18,fontSize:9,fontWeight:800,width:"fit-content",marginBottom:5}}>⭐ إعلان مدفوع</div>}
        <div style={{fontSize:20,fontWeight:900,color:"#fff",marginBottom:3}}>{b.title}</div>
        <div style={{fontSize:11,color:"rgba(255,255,255,0.65)"}}>{b.sub}</div>
      </div>
      {active.length>1&&(
        <div style={{position:"absolute",bottom:12,left:"50%",transform:"translateX(-50%)",display:"flex",gap:4}}>
          {active.map((_,i)=>(
            <div key={i} onClick={()=>setCur(i)} style={{width:i===cur?16:5,height:5,borderRadius:3,background:i===cur?C.primary:"rgba(255,255,255,0.25)",cursor:"pointer",transition:"all .3s"}}/>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Category Images ──────────────────────────────────────
function CatImages({ imgs }) {
  const [cur, setCur] = useState(0);
  useEffect(()=>{
    if(!imgs||imgs.length<2) return;
    const t=setInterval(()=>setCur(p=>(p+1)%imgs.length),3500);
    return ()=>clearInterval(t);
  },[imgs]);
  if(!imgs||!imgs.length) return null;
  return (
    <div style={{position:"relative",height:120,overflow:"hidden",borderRadius:"12px 12px 0 0"}}>
      <img src={imgs[cur]} alt="" style={{width:"100%",height:"100%",objectFit:"cover",filter:"brightness(0.55)"}}/>
      <div style={{position:"absolute",inset:0,background:"linear-gradient(to bottom,transparent 40%,rgba(8,8,16,0.9))"}}/>
    </div>
  );
}

// ─── Service Card ─────────────────────────────────────────
function ServiceCard({ item, catColor, onBook, onDetail, inCart, onFav, isFav }) {
  return (
    <div style={{background:C.card,border:`1px solid ${inCart?C.primary:C.border}`,borderRadius:14,overflow:"hidden",animation:"fadeUp .3s ease"}}>
      <div style={{display:"flex"}}>
        <div style={{width:85,flexShrink:0,position:"relative"}}>
          <img src={item.img} alt={item.name} style={{width:"100%",height:"100%",objectFit:"cover",filter:"brightness(0.65)",minHeight:95}}/>
          {item.sponsored&&<div style={{position:"absolute",top:5,right:5,background:C.gradG,color:"#fff",fontSize:7,fontWeight:800,padding:"1px 5px",borderRadius:7}}>⭐</div>}
        </div>
        <div style={{flex:1,padding:"9px 11px",display:"flex",flexDirection:"column",gap:3}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
            <div style={{flex:1}}>
              <div style={{fontSize:12,fontWeight:800,color:C.text,lineHeight:1.3}}>{item.name}</div>
              <div style={{fontSize:10,color:C.sub}}>{item.provider} {item.verified&&<span style={{color:C.success}}>✓</span>}</div>
            </div>
            <button onClick={()=>onFav(item.id)} style={{background:"none",border:"none",cursor:"pointer",fontSize:15,color:isFav?"#F43F5E":"#475569",padding:"0 0 0 3px",flexShrink:0}}>{isFav?"❤️":"🤍"}</button>
          </div>
          <Stars r={item.rating}/>
          <div style={{fontSize:10,color:C.sub,lineHeight:1.4}}>{item.desc.length>55?item.desc.slice(0,55)+"...":item.desc}</div>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:2}}>
            <div>
              <span style={{fontSize:14,fontWeight:900,color:catColor}}>{item.price.toLocaleString()}</span>
              <span style={{fontSize:9,color:C.sub}}> ج/{item.unit}</span>
            </div>
            <div style={{display:"flex",gap:4}}>
              <button onClick={()=>onDetail(item)} style={{background:"rgba(255,255,255,0.05)",color:C.sub,border:`1px solid ${C.border}`,padding:"4px 8px",borderRadius:7,fontSize:10,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>تفاصيل</button>
              <button onClick={()=>onBook(item)} style={{background:inCart?"rgba(124,58,237,0.15)":C.grad,color:inCart?C.primary:"#fff",border:inCart?`1px solid ${C.primary}`:"none",padding:"4px 9px",borderRadius:7,fontSize:10,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
                {inCart?"✓":"+ احجز"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ChatBot ──────────────────────────────────────────────
function ChatBot({ onClose, services }) {
  const [msgs, setMsgs] = useState([{from:"bot",text:"أهلاً! أنا عمر 🌙 مساعدك في ليالينا.\nاسألني عن أي خدمة أو سعر!"}]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);
  useEffect(()=>{ endRef.current?.scrollIntoView({behavior:"smooth"}); },[msgs]);
  const send = async()=>{
    if(!input.trim()||loading) return;
    const txt=input.trim(); setInput("");
    setMsgs(p=>[...p,{from:"user",text:txt}]);
    setLoading(true);
    const summary=services.map(s=>`${s.category}: ${s.items.map(i=>`${i.name}(${i.price.toLocaleString()}ج)`).join(", ")}`).join("\n");
    try {
      const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:400,system:`أنت "عمر" مساعد ليالينا. الخدمات:\n${summary}\nرد بعربي مختصر ومفيد. كل التواصل من خلال المنصة فقط.`,messages:[{role:"user",content:txt}]})});
      const d=await r.json();
      setMsgs(p=>[...p,{from:"bot",text:d.content?.[0]?.text||"حاول تاني 🙏"}]);
    } catch { setMsgs(p=>[...p,{from:"bot",text:"في مشكلة في الاتصال 🙏"}]); }
    setLoading(false);
  };
  return (
    <div style={{position:"fixed",bottom:80,left:12,width:285,background:C.card,border:`1px solid ${C.borderHi}`,borderRadius:18,zIndex:300,display:"flex",flexDirection:"column",boxShadow:C.glow,overflow:"hidden",maxHeight:400}}>
      <div style={{background:C.grad,padding:"10px 12px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{display:"flex",alignItems:"center",gap:7}}>
          <div style={{width:28,height:28,borderRadius:"50%",background:"rgba(255,255,255,0.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13}}>🌙</div>
          <div><div style={{fontWeight:800,fontSize:11,color:"#fff"}}>السفير عمر</div><div style={{fontSize:8,color:"rgba(255,255,255,0.7)"}}>● متصل</div></div>
        </div>
        <button onClick={onClose} style={{background:"rgba(255,255,255,0.15)",border:"none",color:"#fff",width:22,height:22,borderRadius:5,cursor:"pointer",fontSize:12}}>×</button>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:9,display:"flex",flexDirection:"column",gap:5,background:C.bg}}>
        {msgs.map((m,i)=>(
          <div key={i} style={{display:"flex",justifyContent:m.from==="user"?"flex-start":"flex-end"}}>
            <div style={{maxWidth:"82%",padding:"6px 10px",borderRadius:m.from==="user"?"10px 10px 10px 2px":"10px 10px 2px 10px",background:m.from==="user"?C.card:C.grad,border:m.from==="user"?`1px solid ${C.border}`:"none",fontSize:11,lineHeight:1.5,color:C.text,whiteSpace:"pre-wrap"}}>{m.text}</div>
          </div>
        ))}
        {loading&&<div style={{display:"flex",justifyContent:"flex-end"}}><div style={{background:C.grad,borderRadius:"10px 10px 2px 10px",padding:"6px 10px",fontSize:11,color:"#fff"}}>يكتب...</div></div>}
        <div ref={endRef}/>
      </div>
      <div style={{padding:"7px 9px",borderTop:`1px solid ${C.border}`,display:"flex",gap:5,background:C.card}}>
        <input style={{flex:1,background:C.bg,border:`1px solid ${C.border}`,borderRadius:9,padding:"6px 10px",color:C.text,fontSize:11,fontFamily:"inherit",outline:"none"}} placeholder="اكتب سؤالك..." value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()}/>
        <button onClick={send} disabled={loading} style={{background:C.grad,color:"#fff",border:"none",borderRadius:9,width:28,height:28,cursor:"pointer",fontSize:12,flexShrink:0}}>↑</button>
      </div>
    </div>
  );
}

// ─── Cart Modal ───────────────────────────────────────────
function CartModal({ cart, setCart, onClose, onCheckout, userData }) {
  const total = cart.reduce((s,c)=>s+c.price*c.qty,0);
  const discount = userData?.discount||0;
  const discountAmt = Math.round(total*discount/100);
  const finalTotal = total - discountAmt;
  const deposit = Math.round(finalTotal*0.3);

  if(!cart.length) return (
    <BottomSheet title="🛒 سلة الخدمات" onClose={onClose}>
      <div style={{textAlign:"center",padding:"40px 0",color:C.sub}}><div style={{fontSize:38,marginBottom:8}}>🛒</div><div>السلة فارغة</div></div>
    </BottomSheet>
  );
  return (
    <BottomSheet title="🛒 سلة الخدمات" onClose={onClose}>
      <div style={{display:"flex",flexDirection:"column",gap:7,marginBottom:12}}>
        {cart.map(item=>(
          <div key={item.id} style={{display:"flex",gap:8,alignItems:"center",background:C.bg,border:`1px solid ${C.border}`,borderRadius:11,padding:10}}>
            <img src={item.img} alt={item.name} style={{width:38,height:38,objectFit:"cover",borderRadius:7,flexShrink:0,filter:"brightness(0.7)"}}/>
            <div style={{flex:1}}>
              <div style={{fontSize:12,fontWeight:700,color:C.text}}>{item.name}</div>
              <div style={{fontSize:11,fontWeight:800,color:C.primary}}>{(item.price*item.qty).toLocaleString()} ج</div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:5}}>
              <button onClick={()=>setCart(p=>p.map(c=>c.id===item.id?{...c,qty:Math.max(1,c.qty-1)}:c))} style={{width:24,height:24,border:`1px solid ${C.border}`,borderRadius:6,background:C.card,cursor:"pointer",fontSize:13,color:C.text,display:"flex",alignItems:"center",justifyContent:"center"}}>−</button>
              <span style={{fontSize:12,fontWeight:700,color:C.text,minWidth:16,textAlign:"center"}}>{item.qty}</span>
              <button onClick={()=>setCart(p=>p.map(c=>c.id===item.id?{...c,qty:c.qty+1}:c))} style={{width:24,height:24,border:`1px solid ${C.border}`,borderRadius:6,background:C.card,cursor:"pointer",fontSize:13,color:C.text,display:"flex",alignItems:"center",justifyContent:"center"}}>+</button>
            </div>
            <button onClick={()=>setCart(p=>p.filter(c=>c.id!==item.id))} style={{background:"rgba(244,63,94,.08)",border:"none",color:C.danger,width:24,height:24,borderRadius:6,cursor:"pointer",fontSize:12}}>×</button>
          </div>
        ))}
      </div>
      <div style={{background:"rgba(124,58,237,0.07)",border:`1px solid rgba(124,58,237,0.15)`,borderRadius:11,padding:12,marginBottom:12}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{fontSize:11,color:C.sub}}>الإجمالي</span><span style={{fontSize:13,fontWeight:800,color:C.text}}>{total.toLocaleString()} ج</span></div>
        {discount>0&&<div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{fontSize:11,color:C.success}}>خصم الدعوة ({discount}%)</span><span style={{fontSize:12,fontWeight:700,color:C.success}}>-{discountAmt.toLocaleString()} ج</span></div>}
        <div style={{display:"flex",justifyContent:"space-between",borderTop:`1px solid ${C.border}`,paddingTop:6,marginTop:4}}><span style={{fontSize:11,color:C.sub}}>المقدم (30%)</span><span style={{fontSize:13,fontWeight:700,color:C.primary}}>{deposit.toLocaleString()} ج</span></div>
      </div>
      <button onClick={()=>onCheckout(cart,finalTotal,deposit)} style={{width:"100%",background:C.grad,color:"#fff",border:"none",padding:"12px 0",borderRadius:12,fontSize:13,fontWeight:800,cursor:"pointer",fontFamily:"inherit"}}>✅ تأكيد الحجز</button>
    </BottomSheet>
  );
}

// ─── Checkout Modal ───────────────────────────────────────
function CheckoutModal({ cart, total, deposit, onClose, onDone, user, userData }) {
  const [form,setForm]=useState({name:user?.displayName||"",phone:userData?.phone||"",date:"",notes:""});
  const [done,setDone]=useState(false);
  const [loading,setLoading]=useState(false);
  const inp={width:"100%",background:C.bg,border:`1px solid ${C.border}`,borderRadius:10,padding:"10px 12px",fontSize:12,color:C.text,fontFamily:"inherit",outline:"none",boxSizing:"border-box",marginBottom:8};

  const submit = async() => {
    if(!form.name||!form.phone) return;
    setLoading(true);
    const order={client:form.name,phone:form.phone,date:form.date,notes:form.notes,items:cart.map(c=>({id:c.id,name:c.name,price:c.price,qty:c.qty,provider:c.provider})),total,deposit,status:"pending",createdAt:new Date().toISOString(),userId:user?.uid||"guest"};
    try {
      await addDoc(collection(db,"orders"),order);
      if(user) await updateDoc(doc(db,"users",user.uid),{discount:0});
    } catch(e) { console.log(e); }
    onDone(order); setDone(true);
    const msg=encodeURIComponent(`حجز جديد من ليالينا 🌙\nالاسم: ${form.name}\nالهاتف: ${form.phone}\nتاريخ الفرح: ${form.date||"لم يحدد"}\nالخدمات:\n${cart.map(c=>`- ${c.name}`).join("\n")}\nالإجمالي: ${total.toLocaleString()} ج\nالمقدم: ${deposit.toLocaleString()} ج`);
    setTimeout(()=>window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`,"_blank"),600);
    setLoading(false);
  };

  if(done) return (
    <BottomSheet title="" onClose={onClose}>
      <div style={{textAlign:"center",padding:"30px 0"}}><div style={{fontSize:50,marginBottom:10}}>🎉</div><div style={{fontSize:18,fontWeight:900,color:C.primary,marginBottom:6}}>تم الحجز بنجاح!</div><div style={{fontSize:11,color:C.sub,marginBottom:6}}>سيتواصل معك فريق ليالينا قريباً</div><div style={{fontSize:10,color:C.success,background:"rgba(16,185,129,0.1)",borderRadius:8,padding:"6px 14px",marginBottom:16}}>🔒 مبلغك محفوظ ومؤمن</div><button onClick={onClose} style={{background:C.grad,color:"#fff",border:"none",padding:"10px 26px",borderRadius:10,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>رائع! 🌟</button></div>
    </BottomSheet>
  );
  return (
    <BottomSheet title="📝 بيانات الحجز" onClose={onClose}>
      <input style={inp} placeholder="الاسم الكامل *" value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))}/>
      <input style={inp} placeholder="رقم الهاتف *" value={form.phone} onChange={e=>setForm(p=>({...p,phone:e.target.value}))}/>
      <input style={inp} type="date" value={form.date} onChange={e=>setForm(p=>({...p,date:e.target.value}))}/>
      <textarea style={{...inp,resize:"none",height:65}} placeholder="ملاحظات..." value={form.notes} onChange={e=>setForm(p=>({...p,notes:e.target.value}))}/>
      <div style={{background:"rgba(124,58,237,0.07)",border:`1px solid rgba(124,58,237,0.15)`,borderRadius:11,padding:11,marginBottom:11}}>
        {cart.map(c=><div key={c.id} style={{display:"flex",justifyContent:"space-between",fontSize:11,marginBottom:3}}><span style={{color:C.sub}}>{c.name}</span><span style={{color:C.text,fontWeight:700}}>{(c.price*c.qty).toLocaleString()} ج</span></div>)}
        <div style={{borderTop:`1px solid ${C.border}`,marginTop:7,paddingTop:7,display:"flex",justifyContent:"space-between"}}><span style={{fontSize:12,fontWeight:800,color:C.text}}>المقدم</span><span style={{fontSize:13,fontWeight:900,color:C.primary}}>{deposit.toLocaleString()} ج</span></div>
      </div>
      <div style={{background:"rgba(16,185,129,0.07)",borderRadius:9,padding:9,marginBottom:11,fontSize:10,color:C.success}}>🔒 الدفع آمن — مبلغك محفوظ حتى تأكيد الخدمة</div>
      <button onClick={submit} disabled={!form.name||!form.phone||loading} style={{width:"100%",background:form.name&&form.phone?C.grad:"#222",color:"#fff",border:"none",padding:"12px 0",borderRadius:12,fontSize:13,fontWeight:800,cursor:"pointer",fontFamily:"inherit"}}>
        {loading?"⏳ جاري...":"📲 تأكيد وإرسال على واتساب"}
      </button>
    </BottomSheet>
  );
}

// ─── Join Modal ───────────────────────────────────────────
function JoinModal({ onClose, services, onRequest }) {
  const [form,setForm]=useState({name:"",phone:"",email:"",catId:"",serviceName:"",desc:"",price:""});
  const [done,setDone]=useState(false);
  const [loading,setLoading]=useState(false);
  const inp={width:"100%",background:C.bg,border:`1px solid ${C.border}`,borderRadius:10,padding:"10px 12px",fontSize:12,color:C.text,fontFamily:"inherit",outline:"none",boxSizing:"border-box",marginBottom:8};

  const submit = async() => {
    if(!form.name||!form.phone||!form.catId||!form.serviceName) return;
    setLoading(true);
    const req={...form,status:"pending",createdAt:new Date().toISOString()};
    try { await addDoc(collection(db,"joinRequests"),req); } catch(e){}
    onRequest(req); setDone(true);
    const msg=encodeURIComponent(`طلب انضمام جديد - ليالينا 🌙\nالاسم: ${form.name}\nالهاتف: ${form.phone}${form.email?"\nالإيميل: "+form.email:""}\nالتصنيف: ${services.find(s=>s.id===Number(form.catId))?.category||""}\nالخدمة: ${form.serviceName}${form.price?"\nالسعر: "+form.price+" ج":""}\nالوصف: ${form.desc}`);
    setTimeout(()=>window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`,"_blank"),600);
    setLoading(false);
  };

  if(done) return (
    <BottomSheet title="" onClose={onClose}>
      <div style={{textAlign:"center",padding:"30px 0"}}><div style={{fontSize:50,marginBottom:10}}>✅</div><div style={{fontSize:16,fontWeight:900,color:C.primary,marginBottom:8}}>تم إرسال طلبك!</div><div style={{fontSize:11,color:C.sub}}>سيراجع فريق ليالينا طلبك ويرد عليك قريباً</div></div>
    </BottomSheet>
  );
  return (
    <BottomSheet title="🤝 انضم كمزود خدمة" onClose={onClose}>
      <div style={{background:"rgba(124,58,237,0.07)",borderRadius:11,padding:11,marginBottom:12,fontSize:11,color:C.sub,lineHeight:1.7}}>📋 بعد مراجعة طلبك وموافقتنا ستُضاف خدمتك للمنصة</div>
      <input style={inp} placeholder="الاسم الكامل *" value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))}/>
      <input style={inp} placeholder="رقم الهاتف *" value={form.phone} onChange={e=>setForm(p=>({...p,phone:e.target.value}))}/>
      <input style={inp} placeholder="الإيميل (اختياري)" value={form.email} onChange={e=>setForm(p=>({...p,email:e.target.value}))}/>
      <select style={inp} value={form.catId} onChange={e=>setForm(p=>({...p,catId:e.target.value}))}>
        <option value="">اختر نوع الخدمة *</option>
        {services.map(s=><option key={s.id} value={s.id}>{s.icon} {s.category}</option>)}
      </select>
      <input style={inp} placeholder="اسم الخدمة *" value={form.serviceName} onChange={e=>setForm(p=>({...p,serviceName:e.target.value}))}/>
      <input style={inp} placeholder="السعر التقريبي (اختياري)" type="number" value={form.price} onChange={e=>setForm(p=>({...p,price:e.target.value}))}/>
      <textarea style={{...inp,resize:"none",height:65}} placeholder="وصف الخدمة..." value={form.desc} onChange={e=>setForm(p=>({...p,desc:e.target.value}))}/>
      <button onClick={submit} disabled={!form.name||!form.phone||!form.catId||!form.serviceName||loading} style={{width:"100%",background:form.name&&form.phone&&form.catId&&form.serviceName?C.grad:"#222",color:"#fff",border:"none",padding:"12px 0",borderRadius:12,fontSize:13,fontWeight:800,cursor:"pointer",fontFamily:"inherit"}}>
        {loading?"⏳ جاري...":"📲 إرسال الطلب"}
      </button>
    </BottomSheet>
  );
}

// ─── Budget Planner ───────────────────────────────────────
function BudgetPlanner({ services, onClose, onAddToCart, cart }) {
  const [budget, setBudget] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const plan = async() => {
    if(!budget) return;
    setLoading(true);
    const allItems = services.flatMap(s=>s.items.map(i=>({...i,category:s.category})));
    const summary = allItems.map(i=>`${i.name} (${i.category}): ${i.price.toLocaleString()} ج`).join("\n");
    try {
      const r = await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:800,system:`أنت مخطط أفراح محترف في ليالينا. الخدمات:\n${summary}\nرد بـ JSON فقط:\n{"suggestions":[{"name":"اسم","price":السعر,"reason":"السبب"}],"total":الإجمالي,"saving":المتبقي,"tip":"نصيحة"}`,messages:[{role:"user",content:`ميزانيتي ${Number(budget).toLocaleString()} جنيه`}]})});
      const d = await r.json();
      const txt = d.content?.[0]?.text||"{}";
      setResult(JSON.parse(txt.replace(/```json|```/g,"").trim()));
    } catch { setResult(null); }
    setLoading(false);
  };

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.88)",backdropFilter:"blur(10px)",zIndex:450,display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={{background:C.card,borderRadius:"20px 20px 0 0",width:"100%",maxWidth:520,maxHeight:"88vh",overflowY:"auto",border:`1px solid ${C.border}`,borderBottom:"none"}}>
        <div style={{background:C.grad,padding:"12px 16px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div><div style={{fontSize:13,fontWeight:900,color:"#fff"}}>🧮 حاسبة ميزانية الزفاف</div><div style={{fontSize:9,color:"rgba(255,255,255,0.7)"}}>اكتب ميزانيتك وهنقترح الأفضل</div></div>
          <button onClick={onClose} style={{background:"rgba(255,255,255,0.2)",border:"none",color:"#fff",width:26,height:26,borderRadius:6,cursor:"pointer",fontSize:14}}>×</button>
        </div>
        <div style={{padding:16}}>
          <div style={{display:"flex",gap:7,marginBottom:14}}>
            <input style={{flex:1,background:C.bg,border:`1px solid ${C.border}`,borderRadius:11,padding:"11px 13px",fontSize:13,color:C.text,fontFamily:"inherit",outline:"none"}} placeholder="ميزانيتك بالجنيه..." type="number" value={budget} onChange={e=>setBudget(e.target.value)} onKeyDown={e=>e.key==="Enter"&&plan()}/>
            <button onClick={plan} disabled={!budget||loading} style={{background:budget&&!loading?C.grad:"#333",color:"#fff",border:"none",borderRadius:11,padding:"11px 14px",cursor:"pointer",fontSize:12,fontWeight:700,fontFamily:"inherit",minWidth:75}}>{loading?"⏳":"احسب 🔮"}</button>
          </div>
          {loading&&<div style={{textAlign:"center",padding:"30px 0",color:C.sub}}><div style={{fontSize:28,animation:"pulse 1s infinite"}}>🧮</div><div style={{fontSize:11,marginTop:7}}>بنحسب أفضل باقة...</div></div>}
          {result&&(
            <div style={{animation:"fadeUp .4s ease"}}>
              <div style={{display:"flex",gap:7,marginBottom:12}}>
                <div style={{flex:1,background:"rgba(124,58,237,0.08)",border:`1px solid rgba(124,58,237,0.15)`,borderRadius:11,padding:11,textAlign:"center"}}><div style={{fontSize:9,color:C.sub}}>الإجمالي</div><div style={{fontSize:15,fontWeight:900,color:C.primary}}>{result.total?.toLocaleString()} ج</div></div>
                <div style={{flex:1,background:"rgba(16,185,129,0.08)",border:`1px solid rgba(16,185,129,0.15)`,borderRadius:11,padding:11,textAlign:"center"}}><div style={{fontSize:9,color:C.sub}}>المتبقي</div><div style={{fontSize:15,fontWeight:900,color:C.success}}>{result.saving?.toLocaleString()} ج</div></div>
              </div>
              {result.suggestions?.map((s,i)=>(
                <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",background:C.bg,border:`1px solid ${C.border}`,borderRadius:9,padding:"9px 11px",marginBottom:6}}>
                  <div style={{flex:1}}><div style={{fontSize:11,fontWeight:700,color:C.text}}>{s.name}</div><div style={{fontSize:9,color:C.sub,marginTop:2}}>{s.reason}</div></div>
                  <div style={{fontSize:12,fontWeight:800,color:C.primary,marginRight:8}}>{s.price?.toLocaleString()} ج</div>
                </div>
              ))}
              {result.tip&&<div style={{background:"rgba(6,182,212,0.07)",border:`1px solid rgba(6,182,212,0.15)`,borderRadius:9,padding:11,marginBottom:12,fontSize:10,color:C.accent,lineHeight:1.6}}>💡 {result.tip}</div>}
              <div style={{display:"flex",gap:7}}>
                <button onClick={()=>{ result.suggestions?.forEach(s=>{ const found=services.flatMap(c=>c.items).find(i=>i.name===s.name); if(found&&!cart.find(c=>c.id===found.id)) onAddToCart(found); }); onClose(); }} style={{flex:2,background:C.grad,color:"#fff",border:"none",padding:"11px 0",borderRadius:10,cursor:"pointer",fontSize:11,fontWeight:700,fontFamily:"inherit"}}>🛒 أضف الباقة للسلة</button>
                <button onClick={()=>{ window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`ميزانيتي ${Number(budget).toLocaleString()} ج، محتاج مساعدة 🌙`)}`,"_blank"); }} style={{flex:1,background:"rgba(37,211,102,0.1)",color:"#25D366",border:`1px solid rgba(37,211,102,0.25)`,padding:"11px 0",borderRadius:10,cursor:"pointer",fontSize:10,fontWeight:700,fontFamily:"inherit"}}>واتساب</button>
              </div>
            </div>
          )}
          {!result&&!loading&&<div style={{textAlign:"center",padding:"20px 0",color:C.sub}}><div style={{fontSize:34,marginBottom:8}}>🎯</div><div style={{fontSize:11}}>اكتب ميزانيتك وهنقترح أفضل باقة</div></div>}
        </div>
      </div>
    </div>
  );
}

// ─── Admin Panel ──────────────────────────────────────────
function AdminPanel({ services, setServices, banners, setBanners, orders, setOrders, joinRequests, setJoinRequests, clients, onClose }) {
  const [tab,setTab]=useState("dash");
  const [saved,setSaved]=useState("");
  const [ni,setNi]=useState({catId:"",name:"",price:"",unit:"",provider:"",desc:"",area:"القاهرة",district:"مدينة نصر",img:""});
  const [nb,setNb]=useState({title:"",sub:"",img:"",sponsored:false});
  const ok=msg=>{ setSaved(msg); setTimeout(()=>setSaved(""),2500); };
  const inp={width:"100%",background:C.bg,border:`1px solid ${C.border}`,borderRadius:9,padding:"9px 11px",color:C.text,fontSize:12,fontFamily:"inherit",boxSizing:"border-box",outline:"none",marginBottom:7};
  const addItem=async()=>{
    if(!ni.catId||!ni.name||!ni.price) return;
    const newItem={id:Date.now(),name:ni.name,price:Number(ni.price),unit:ni.unit||"وحدة",rating:5.0,badge:null,provider:ni.provider,desc:ni.desc,area:ni.area,district:ni.district,verified:false,sponsored:false,img:ni.img||"https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400&q=80"};
    setServices(p=>p.map(s=>s.id===Number(ni.catId)?{...s,items:[...s.items,newItem]}:s));
    setNi({catId:"",name:"",price:"",unit:"",provider:"",desc:"",area:"القاهرة",district:"مدينة نصر",img:""});
    ok("✅ تم إضافة الخدمة");
  };
  const addBanner=()=>{ if(!nb.title||!nb.img) return; setBanners(p=>[...p,{id:Date.now(),...nb,active:true}]); setNb({title:"",sub:"",img:"",sponsored:false}); ok("✅ تم إضافة البانر"); };
  const toggleV=(cId,iId)=>setServices(p=>p.map(s=>s.id===cId?{...s,items:s.items.map(i=>i.id===iId?{...i,verified:!i.verified}:i)}:s));
  const toggleS=(cId,iId)=>setServices(p=>p.map(s=>s.id===cId?{...s,items:s.items.map(i=>i.id===iId?{...i,sponsored:!i.sponsored}:i)}:s));
  const delItem=(cId,iId)=>setServices(p=>p.map(s=>s.id===cId?{...s,items:s.items.filter(i=>i.id!==iId)}:s));
  const togBanner=id=>setBanners(p=>p.map(b=>b.id===id?{...b,active:!b.active}:b));
  const togBannerS=id=>setBanners(p=>p.map(b=>b.id===id?{...b,sponsored:!b.sponsored}:b));
  const delBanner=id=>setBanners(p=>p.filter(b=>b.id!==id));
  const updOrder=async(id,st)=>{ setOrders(p=>p.map(o=>o.id===id?{...o,status:st}:o)); try{ const q=query(collection(db,"orders"),where("__name__","==",id)); }catch(e){} };
  const approveJoin=async(req)=>{
    setJoinRequests(p=>p.map(r=>r.id===req.id?{...r,status:"approved"}:r));
    setServices(p=>p.map(s=>s.id===Number(req.catId)?{...s,items:[...s.items,{id:Date.now(),name:req.serviceName,price:Number(req.price)||0,unit:"وحدة",rating:5.0,badge:"جديد",provider:req.name,desc:req.desc||"",area:"القاهرة",district:"الكل",verified:true,sponsored:false,img:"https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400&q=80"}]}:s));
    ok("✅ تمت الموافقة");
  };
  const rejectJoin=id=>setJoinRequests(p=>p.map(r=>r.id===id?{...r,status:"rejected"}:r));
  const pendingJ=joinRequests.filter(r=>r.status==="pending").length;
  const totalRev=orders.reduce((s,o)=>s+(o.total||0),0);
  const tabs=[["dash","📊 لوحة"],["joins","🤝 انضمام"+(pendingJ?` (${pendingJ})`:"")],["banners","🖼️ بانر"],["services","🛠️ خدمات"],["orders","📋 أوردرات"],["clients","👥 عملاء"]];

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.93)",backdropFilter:"blur(14px)",zIndex:500,display:"flex",alignItems:"center",justifyContent:"center",padding:8}}>
      <div style={{background:C.card,borderRadius:20,width:"100%",maxWidth:800,height:"95vh",display:"flex",flexDirection:"column",border:`1px solid ${C.border}`,overflow:"hidden"}}>
        <div style={{background:C.grad,padding:"12px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
          <div style={{fontSize:14,fontWeight:900,color:"#fff"}}>🛠️ لوحة تحكم ليالينا</div>
          <button onClick={onClose} style={{background:"rgba(255,255,255,0.2)",border:"none",color:"#fff",width:28,height:28,borderRadius:7,cursor:"pointer",fontSize:15}}>×</button>
        </div>
        <div style={{display:"flex",overflowX:"auto",flexShrink:0,borderBottom:`1px solid ${C.border}`,background:C.bg}}>
          {tabs.map(([k,l])=>(
            <button key={k} onClick={()=>setTab(k)} style={{flex:"0 0 auto",background:tab===k?"rgba(124,58,237,0.15)":"transparent",color:tab===k?C.primary:C.sub,border:"none",borderBottom:tab===k?`2px solid ${C.primary}`:"2px solid transparent",padding:"10px 12px",cursor:"pointer",fontSize:10,fontWeight:tab===k?800:400,fontFamily:"inherit",whiteSpace:"nowrap"}}>{l}</button>
          ))}
        </div>
        {saved&&<div style={{background:"rgba(16,185,129,0.12)",color:C.success,padding:"6px 16px",fontSize:11,fontWeight:700,textAlign:"center"}}>{saved}</div>}
        <div style={{flex:1,overflowY:"auto",padding:14}}>

          {tab==="dash"&&(
            <>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(115px,1fr))",gap:8,marginBottom:12}}>
                {[["📦",orders.length,"الأوردرات",C.primary],["💰",totalRev.toLocaleString()+" ج","الإيرادات",C.success],["👥",clients.length,"العملاء",C.warn],["🤝",pendingJ,"طلبات معلقة",C.secondary],["🛎️",services.reduce((s,c)=>s+c.items.length,0),"الخدمات","#A78BFA"]].map(([ic,val,lab,col])=>(
                  <div key={lab} style={{background:C.bg,border:`1px solid ${C.border}`,borderRadius:11,padding:11}}><div style={{fontSize:18,marginBottom:4}}>{ic}</div><div style={{fontSize:14,fontWeight:900,color:col}}>{val}</div><div style={{fontSize:9,color:C.sub}}>{lab}</div></div>
                ))}
              </div>
              <div style={{background:"rgba(124,58,237,0.07)",border:`1px solid rgba(124,58,237,0.15)`,borderRadius:11,padding:12,fontSize:10,color:C.sub,lineHeight:2}}>
                📱 واتساب: {WHATSAPP_NUMBER}<br/>
                🖼️ بانرات نشطة: {banners.filter(b=>b.active).length} | مدفوعة: {banners.filter(b=>b.sponsored).length}<br/>
                ✓ موثقة: {services.reduce((s,c)=>s+c.items.filter(i=>i.verified).length,0)} | ⭐ مدعومة: {services.reduce((s,c)=>s+c.items.filter(i=>i.sponsored).length,0)}
              </div>
            </>
          )}

          {tab==="joins"&&(
            <>
              {!joinRequests.length&&<div style={{textAlign:"center",padding:"40px 0",color:C.sub}}><div style={{fontSize:32,marginBottom:7}}>🤝</div><div>لا يوجد طلبات</div></div>}
              {joinRequests.map(r=>(
                <div key={r.id} style={{background:C.bg,border:`1px solid ${r.status==="pending"?C.warn:r.status==="approved"?C.success:C.danger}`,borderRadius:12,padding:12,marginBottom:8}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><div style={{fontSize:12,fontWeight:800,color:C.text}}>{r.name}</div><span style={{fontSize:9,padding:"2px 8px",borderRadius:8,fontWeight:700,background:r.status==="pending"?"rgba(245,158,11,0.12)":r.status==="approved"?"rgba(16,185,129,0.12)":"rgba(244,63,94,0.12)",color:r.status==="pending"?C.warn:r.status==="approved"?C.success:C.danger}}>{r.status==="pending"?"⏳ معلق":r.status==="approved"?"✅ موافق":"❌ مرفوض"}</span></div>
                  <div style={{fontSize:10,color:C.sub,marginBottom:3}}>📞 {r.phone}{r.email?" · "+r.email:""}</div>
                  <div style={{fontSize:10,color:C.sub,marginBottom:3}}>🏷️ {services.find(s=>s.id===Number(r.catId))?.category} · {r.serviceName}</div>
                  {r.price&&<div style={{fontSize:11,color:C.primary,fontWeight:700,marginBottom:4}}>{Number(r.price).toLocaleString()} ج</div>}
                  {r.status==="pending"&&<div style={{display:"flex",gap:6}}><button onClick={()=>approveJoin(r)} style={{flex:1,background:"rgba(16,185,129,0.08)",color:C.success,border:`1px solid rg