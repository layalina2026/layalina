import { useState, useEffect } from "react";

// ═══════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════
const WA = "201000000000";
const ADMIN_PASS = "Layalina@2025";

const CATS = [
  { id:1,  name:"قاعات الأفراح", icon:"🏛️", color:"#C084FC", img:"https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400&q=80" },
  { id:2,  name:"تصوير",         icon:"📸", color:"#34D399", img:"https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=400&q=80" },
  { id:3,  name:"كوافير حريمي", icon:"💄", color:"#F472B6", img:"https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&q=80" },
  { id:4,  name:"كوافير رجالي", icon:"✂️", color:"#60A5FA", img:"https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&q=80" },
  { id:5,  name:"مأذون",         icon:"📜", color:"#FBBF24", img:"https://images.unsplash.com/photo-1606800052052-a08af7148866?w=400&q=80" },
  { id:6,  name:"محلات ورد",     icon:"🌹", color:"#FB7185", img:"https://images.unsplash.com/photo-1487530811015-780b2c7a4f94?w=400&q=80" },
  { id:7,  name:"حلويات",        icon:"🎂", color:"#F59E0B", img:"https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=400&q=80" },
  { id:8,  name:"فنادق",         icon:"🏨", color:"#818CF8", img:"https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400&q=80" },
  { id:9,  name:"شهر العسل",     icon:"✈️", color:"#2DD4BF", img:"https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&q=80" },
  { id:10, name:"تشطيب شقق",     icon:"🏠", color:"#A78BFA", img:"https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=400&q=80" },
  { id:11, name:"عفش العريس",    icon:"🛋️", color:"#FCD34D", img:"https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80" },
  { id:12, name:"إيجار سيارات",  icon:"🚗", color:"#38BDF8", img:"https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&q=80" },
  { id:13, name:"أول بيبي",      icon:"👶", color:"#6EE7B7", img:"https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400&q=80" },
];

const INIT_SERVICES = [
  { id:101, cat:1,  name:"قاعة النيل الكبرى",        price:15000, unit:"ليلة",   rating:4.9, reviews:[], badge:"الأكثر حجزاً",    provider:"مجمع النيل للأفراح",    desc:"قاعة فاخرة تسع 500 شخص مع ديكور ملكي",          verified:true,  sponsored:true,  providerEmail:"nile@test.com" },
  { id:102, cat:1,  name:"قاعة الأميرة",              price:8000,  unit:"ليلة",   rating:4.7, reviews:[], badge:null,              provider:"قصر الأفراح",            desc:"قاعة أنيقة تسع 250 شخص",                          verified:true,  sponsored:false, providerEmail:"princess@test.com" },
  { id:103, cat:1,  name:"قاعة الزمرد",               price:12000, unit:"ليلة",   rating:4.8, reviews:[], badge:"جديد",            provider:"فيلا الزمرد",            desc:"قاعة حديثة تسع 350 شخص",                          verified:true,  sponsored:false, providerEmail:"zomrod@test.com" },
  { id:201, cat:2,  name:"باقة التصوير الكاملة",      price:5000,  unit:"يوم",    rating:5.0, reviews:[], badge:"مميز",            provider:"استوديو لحظة",          desc:"تصوير + فيديو + كليب + ألبوم",                    verified:true,  sponsored:true,  providerEmail:"lahza@test.com" },
  { id:202, cat:2,  name:"باقة التصوير الأساسية",     price:2500,  unit:"يوم",    rating:4.6, reviews:[], badge:null,              provider:"فريق الذكريات",          desc:"تصوير فوتوغرافي احترافي",                          verified:false, sponsored:false, providerEmail:"zekrayat@test.com" },
  { id:301, cat:3,  name:"باقة العروسة الملكية",      price:3500,  unit:"يوم",    rating:4.8, reviews:[], badge:"الأعلى تقييماً", provider:"صالون لمسة نور",         desc:"مكياج + كوافير + باديكير + مانيكير",              verified:true,  sponsored:true,  providerEmail:"lamsa@test.com" },
  { id:302, cat:3,  name:"مكياج العروسة فقط",         price:1500,  unit:"جلسة",   rating:4.5, reviews:[], badge:null,              provider:"بيوتي لاين",             desc:"مكياج احترافي",                                    verified:false, sponsored:false, providerEmail:"beauty@test.com" },
  { id:401, cat:4,  name:"باقة العريس VIP",           price:800,   unit:"جلسة",   rating:4.7, reviews:[], badge:null,              provider:"باربر كينج",             desc:"حلاقة + لحية + عناية بالبشرة",                    verified:true,  sponsored:false, providerEmail:"barber@test.com" },
  { id:501, cat:5,  name:"توثيق عقد الزواج",          price:500,   unit:"عقد",    rating:4.9, reviews:[], badge:null,              provider:"مأذون معتمد",            desc:"توثيق رسمي + حضور لموقع الفرح",                   verified:true,  sponsored:false, providerEmail:"mazoon@test.com" },
  { id:601, cat:6,  name:"باقة زهور الفرح الكاملة",  price:3000,  unit:"حفل",    rating:4.8, reviews:[], badge:"مميز",            provider:"فلاور هاوس",             desc:"تزيين القاعة + باقة العروسة",                      verified:true,  sponsored:false, providerEmail:"flower@test.com" },
  { id:602, cat:6,  name:"باقة ورد العروسة",          price:600,   unit:"باقة",   rating:4.6, reviews:[], badge:null,              provider:"روز لاند",               desc:"باقة ورد طازجة",                                   verified:false, sponsored:false, providerEmail:"rose@test.com" },
  { id:701, cat:7,  name:"تورتة الزفاف الملكية",      price:2500,  unit:"تورتة",  rating:4.9, reviews:[], badge:"الأكثر طلباً",   provider:"باتيسري سويت دريم",      desc:"5 طوابق - تصميم مخصص",                            verified:true,  sponsored:true,  providerEmail:"sweet@test.com" },
  { id:702, cat:7,  name:"حلوى الفرح",                price:1200,  unit:"كيلو",   rating:4.7, reviews:[], badge:null,              provider:"حلويات السعادة",         desc:"تشكيلة فاخرة",                                     verified:false, sponsored:false, providerEmail:"halawa@test.com" },
  { id:801, cat:8,  name:"جناح العرسان الملكي",       price:4500,  unit:"ليلة",   rating:5.0, reviews:[], badge:"5 نجوم",          provider:"فندق النيل هيلتون",      desc:"جناح فاخر مع إطلالة على النيل",                   verified:true,  sponsored:false, providerEmail:"hilton@test.com" },
  { id:901, cat:9,  name:"باقة المالديف 7 ليالي",     price:45000, unit:"باقة",   rating:4.9, reviews:[], badge:"الأكثر حجزاً",   provider:"سنباك تورز",             desc:"طيران + فندق 5 نجوم + جولات",                     verified:true,  sponsored:false, providerEmail:"sunback@test.com" },
  { id:902, cat:9,  name:"باقة تركيا 5 ليالي",        price:18000, unit:"باقة",   rating:4.7, reviews:[], badge:null,              provider:"دريم ترافيل",            desc:"اسطنبول + فندق + جولات",                           verified:false, sponsored:false, providerEmail:"dream@test.com" },
  { id:1001,cat:10, name:"تشطيب سوبر لوكس",           price:35000, unit:"شقة",    rating:4.8, reviews:[], badge:null,              provider:"ديكور برستيج",           desc:"تشطيب كامل مع الديكور",                            verified:true,  sponsored:false, providerEmail:"prestige@test.com" },
  { id:1101,cat:11, name:"غرفة نوم كاملة فاخرة",      price:25000, unit:"طقم",    rating:4.6, reviews:[], badge:null,              provider:"هوم كلاسيك",             desc:"غرفة نوم بخشب طبيعي",                              verified:false, sponsored:false, providerEmail:"home@test.com" },
  { id:1201,cat:12, name:"ليموزين الزفاف الفاخرة",    price:2000,  unit:"يوم",    rating:4.9, reviews:[], badge:"مميز",            provider:"رويال ليموزين",          desc:"سيارة زفاف فاخرة مع سائق",                        verified:true,  sponsored:false, providerEmail:"royal@test.com" },
  { id:1202,cat:12, name:"موكب 5 سيارات",              price:5000,  unit:"يوم",    rating:4.8, reviews:[], badge:null,              provider:"إليت كارز",              desc:"موكب سيارات فاخرة",                                verified:false, sponsored:false, providerEmail:"elite@test.com" },
  { id:1301,cat:13, name:"باقة استقبال المولود",       price:3500,  unit:"باقة",   rating:4.9, reviews:[], badge:"جديد",            provider:"بيبي وورلد",             desc:"تصوير + ديكور + هدايا",                            verified:true,  sponsored:false, providerEmail:"baby@test.com" },
];

const INIT_BANNERS = [
  { id:1, title:"قاعة النيل الكبرى",    sub:"احجز ليلة فرحك بأفضل الأسعار", img:"https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80", active:true },
  { id:2, title:"استوديو لحظة",         sub:"باقات VIP للتصوير والفيديو",    img:"https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=800&q=80", active:true },
  { id:3, title:"رويال ليموزين",        sub:"موكب زفاف لا يُنسى",            img:"https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80", active:true },
];

const INIT_PROVIDERS = [
  { id:"p1", name:"مجمع النيل للأفراح", email:"nile@test.com",     pass:"1234", phone:"0100", cat:1,  status:"active",  wallet:0, serviceIds:[101] },
  { id:"p2", name:"استوديو لحظة",       email:"lahza@test.com",    pass:"1234", phone:"0101", cat:2,  status:"active",  wallet:0, serviceIds:[201] },
  { id:"p3", name:"صالون لمسة نور",     email:"lamsa@test.com",    pass:"1234", phone:"0102", cat:3,  status:"active",  wallet:0, serviceIds:[301] },
  { id:"p4", name:"باتيسري سويت دريم", email:"sweet@test.com",    pass:"1234", phone:"0103", cat:7,  status:"active",  wallet:0, serviceIds:[701] },
  { id:"p5", name:"رويال ليموزين",      email:"royal@test.com",    pass:"1234", phone:"0104", cat:12, status:"active",  wallet:0, serviceIds:[1201] },
];

const C = {
  bg:"#080810", card:"#10101C", border:"#1E1E35",
  primary:"#7C3AED", secondary:"#EC4899",
  gold:"#F59E0B", text:"#F1F5F9", sub:"#94A3B8", muted:"#475569",
  success:"#10B981", danger:"#F43F5E", warn:"#F59E0B",
  grad:"linear-gradient(135deg,#7C3AED,#EC4899)",
  gradG:"linear-gradient(135deg,#F59E0B,#EF4444)",
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;800;900&display=swap');
  *{box-sizing:border-box;margin:0;padding:0}
  body{background:#080810;color:#F1F5F9;font-family:'Cairo',sans-serif;direction:rtl}
  ::-webkit-scrollbar{width:3px}
  ::-webkit-scrollbar-thumb{background:#7C3AED;border-radius:4px}
  @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
`;

// ═══════════════════════════════════════
// SMALL COMPONENTS
// ═══════════════════════════════════════
function Stars({r, size=11}) {
  return <span style={{color:"#F59E0B",fontSize:size}}>{"★".repeat(Math.floor(r))}{"☆".repeat(5-Math.floor(r))}<span style={{color:"#94A3B8",fontSize:size-1,marginRight:2}}>{r}</span></span>;
}

function Sheet({children, onClose, title}) {
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",backdropFilter:"blur(8px)",zIndex:400,display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={{background:C.card,borderRadius:"20px 20px 0 0",width:"100%",maxWidth:520,maxHeight:"92vh",overflowY:"auto",border:"1px solid "+C.border,borderBottom:"none"}}>
        {title&&<div style={{padding:"12px 16px 8px",borderBottom:"1px solid "+C.border,display:"flex",justifyContent:"space-between",alignItems:"center",position:"sticky",top:0,background:C.card,zIndex:1}}><div style={{fontSize:13,fontWeight:800,color:C.text}}>{title}</div><button onClick={onClose} style={{background:C.bg,border:"1px solid "+C.border,color:C.sub,width:25,height:25,borderRadius:6,cursor:"pointer",fontSize:14}}>×</button></div>}
        <div style={{padding:"12px 16px 28px"}}>{children}</div>
      </div>
    </div>
  );
}

function Inp({placeholder, value, onChange, type="text", style={}}) {
  return <input type={type} placeholder={placeholder} value={value} onChange={onChange} style={{width:"100%",background:C.bg,border:"1px solid "+C.border,borderRadius:10,padding:"10px 12px",fontSize:12,color:C.text,fontFamily:"inherit",outline:"none",boxSizing:"border-box",marginBottom:8,...style}}/>;
}

// ═══════════════════════════════════════
// BANNER SLIDER
// ═══════════════════════════════════════
function BannerSlider({banners}) {
  const active = banners.filter(b=>b.active);
  const [cur,setCur] = useState(0);
  useEffect(()=>{
    if(active.length<2) return;
    const t=setInterval(()=>setCur(p=>(p+1)%active.length),5000);
    return ()=>clearInterval(t);
  },[active.length]);
  if(!active.length) return null;
  const b=active[cur%active.length];
  return (
    <div style={{position:"relative",height:200,overflow:"hidden"}}>
      <img src={b.img} alt={b.title} style={{width:"100%",height:"100%",objectFit:"cover",filter:"brightness(0.4)"}}/>
      <div style={{position:"absolute",inset:0,background:"linear-gradient(to top,rgba(8,8,16,0.95) 0%,transparent 55%)"}}/>
      <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",justifyContent:"flex-end",padding:"0 16px 16px"}}>
        <div style={{fontSize:20,fontWeight:900,color:"#fff",marginBottom:3}}>{b.title}</div>
        <div style={{fontSize:11,color:"rgba(255,255,255,0.65)"}}>{b.sub}</div>
      </div>
      {active.length>1&&<div style={{position:"absolute",bottom:10,left:"50%",transform:"translateX(-50%)",display:"flex",gap:4}}>{active.map((_,i)=><div key={i} onClick={()=>setCur(i)} style={{width:i===cur?16:5,height:5,borderRadius:3,background:i===cur?C.primary:"rgba(255,255,255,0.25)",cursor:"pointer",transition:"all .3s"}}/>)}</div>}
    </div>
  );
}

// ═══════════════════════════════════════
// AUTH MODAL
// ═══════════════════════════════════════
function AuthModal({onClose, onLogin}) {
  const [mode,setMode] = useState("login");
  const [form,setForm] = useState({name:"",email:"",phone:"",pass:"",pass2:""});
  const [users,setUsers] = useState(JSON.parse(localStorage.getItem("ly_users")||"[]"));
  const [err,setErr] = useState("");

  const submit = () => {
    if(!form.email||!form.pass) return setErr("يرجى ملء الحقول المطلوبة");
    if(mode==="register") {
      if(!form.name) return setErr("يرجى إدخال الاسم");
      if(form.pass!==form.pass2) return setErr("كلمة المرور غير متطابقة");
      if(users.find(u=>u.email===form.email)) return setErr("الإيميل مسجل بالفعل");
      const newUser = {id:Date.now(),name:form.name,email:form.email,phone:form.phone,pass:form.pass,favs:[],createdAt:new Date().toLocaleDateString("ar-EG")};
      const updated = [...users,newUser];
      localStorage.setItem("ly_users",JSON.stringify(updated));
      setUsers(updated);
      onLogin(newUser);
    } else {
      const u = users.find(u=>u.email===form.email&&u.pass===form.pass);
      if(!u) return setErr("بيانات الدخول غلط");
      onLogin(u);
    }
    onClose();
  };

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.92)",backdropFilter:"blur(12px)",zIndex:500,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div style={{background:C.card,borderRadius:20,padding:22,width:"100%",maxWidth:320,border:"1px solid "+C.border,maxHeight:"90vh",overflowY:"auto"}}>
        <div style={{textAlign:"center",marginBottom:16}}>
          <div style={{fontSize:28,fontWeight:900,background:C.grad,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",marginBottom:4}}>ليالينا 🌙</div>
          <div style={{fontSize:13,fontWeight:800,color:C.text}}>{mode==="login"?"تسجيل الدخول":"إنشاء حساب"}</div>
        </div>
        {mode==="register"&&<Inp placeholder="الاسم الكامل *" value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))}/>}
        <Inp placeholder="البريد الإلكتروني *" type="email" value={form.email} onChange={e=>setForm(p=>({...p,email:e.target.value}))}/>
        {mode==="register"&&<Inp placeholder="رقم الهاتف" value={form.phone} onChange={e=>setForm(p=>({...p,phone:e.target.value}))}/>}
        <Inp placeholder="كلمة المرور *" type="password" value={form.pass} onChange={e=>setForm(p=>({...p,pass:e.target.value}))}/>
        {mode==="register"&&<Inp placeholder="تأكيد كلمة المرور *" type="password" value={form.pass2} onChange={e=>setForm(p=>({...p,pass2:e.target.value}))}/>}
        {err&&<div style={{color:C.danger,fontSize:11,textAlign:"center",marginBottom:8,background:"rgba(244,63,94,0.1)",padding:"6px 10px",borderRadius:8}}>{err}</div>}
        <button onClick={submit} style={{width:"100%",background:C.grad,color:"#fff",border:"none",padding:"12px 0",borderRadius:11,fontSize:13,fontWeight:800,cursor:"pointer",fontFamily:"inherit",marginBottom:10}}>{mode==="login"?"🔐 دخول":"✨ إنشاء الحساب"}</button>
        <div style={{textAlign:"center",fontSize:11,color:C.sub}}>
          {mode==="login"?"مش عندك حساب؟ ":"عندك حساب؟ "}
          <span onClick={()=>{setMode(mode==="login"?"register":"login");setErr("");}} style={{color:C.primary,cursor:"pointer",fontWeight:700}}>{mode==="login"?"سجل دلوقتي":"سجل الدخول"}</span>
        </div>
        <div style={{textAlign:"center",marginTop:10}}>
          <button onClick={onClose} style={{background:"none",border:"none",color:C.sub,fontSize:11,cursor:"pointer",fontFamily:"inherit"}}>إلغاء</button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// PROFILE SHEET
// ═══════════════════════════════════════
function ProfileSheet({user, onClose, onSignOut}) {
  const refCode = user.id.toString().slice(-6).toUpperCase();
  const [copied,setCopied] = useState(false);
  const copy = () => { navigator.clipboard.writeText(refCode); setCopied(true); setTimeout(()=>setCopied(false),2000); };
  return (
    <Sheet title="👤 حسابي" onClose={onClose}>
      <div style={{display:"flex",alignItems:"center",gap:12,background:C.bg,border:"1px solid "+C.border,borderRadius:14,padding:14,marginBottom:14}}>
        <div style={{width:48,height:48,borderRadius:"50%",background:C.grad,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,fontWeight:900,color:"#fff",flexShrink:0}}>{user.name[0]}</div>
        <div style={{flex:1}}>
          <div style={{fontSize:14,fontWeight:800,color:C.text}}>{user.name}</div>
          <div style={{fontSize:11,color:C.sub}}>{user.email}</div>
          {user.phone&&<div style={{fontSize:11,color:C.sub}}>📞 {user.phone}</div>}
        </div>
      </div>
      <div style={{background:"rgba(124,58,237,0.08)",border:"1px solid rgba(124,58,237,0.2)",borderRadius:12,padding:12,marginBottom:14}}>
        <div style={{fontSize:12,fontWeight:700,color:C.text,marginBottom:6}}>🎁 كود الدعوة الخاص بك</div>
        <div style={{fontSize:10,color:C.sub,marginBottom:8,lineHeight:1.6}}>شارك كودك مع أصدقاءك — لما يسجلوا هيحصلوا على خصم 5%!</div>
        <div style={{background:C.bg,border:"1px solid "+C.border,borderRadius:8,padding:"8px 12px",display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
          <span style={{fontSize:14,fontWeight:900,color:C.primary,letterSpacing:2}}>{refCode}</span>
          <button onClick={copy} style={{background:copied?"rgba(16,185,129,0.15)":C.grad,color:"#fff",border:"none",borderRadius:7,padding:"4px 10px",cursor:"pointer",fontSize:10,fontWeight:700,fontFamily:"inherit"}}>{copied?"✓ تم":"نسخ"}</button>
        </div>
        <button onClick={()=>{const msg=encodeURIComponent("🌙 انضم لليالينا واحصل على خصم 5%!\nكود الدعوة: "+refCode+"\nhttps://layalina-gamma.vercel.app");window.open("https://wa.me/?text="+msg,"_blank");}} style={{width:"100%",background:"rgba(37,211,102,0.12)",color:"#25D366",border:"1px solid rgba(37,211,102,0.25)",padding:"9px 0",borderRadius:10,cursor:"pointer",fontSize:11,fontWeight:700,fontFamily:"inherit"}}>📱 شارك على واتساب</button>
      </div>
      <button onClick={onSignOut} style={{width:"100%",background:"rgba(244,63,94,0.1)",color:C.danger,border:"1px solid rgba(244,63,94,0.2)",padding:"11px 0",borderRadius:11,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>🚪 تسجيل الخروج</button>
    </Sheet>
  );
}

// ═══════════════════════════════════════
// SERVICE CARD
// ═══════════════════════════════════════
function Card({item, cat, inCart, isFav, onBook, onDetail, onFav}) {
  return (
    <div style={{background:C.card,border:"1px solid "+(inCart?C.primary:C.border),borderRadius:14,overflow:"hidden",animation:"fadeUp .3s ease"}}>
      <div style={{display:"flex"}}>
        <div style={{width:85,flexShrink:0,position:"relative"}}>
          <img src={cat.img} alt={item.name} style={{width:"100%",height:"100%",objectFit:"cover",filter:"brightness(0.65)",minHeight:95}}/>
          {item.sponsored&&<div style={{position:"absolute",top:5,right:5,background:C.gradG,color:"#fff",fontSize:7,fontWeight:800,padding:"1px 5px",borderRadius:7}}>⭐</div>}
        </div>
        <div style={{flex:1,padding:"9px 11px",display:"flex",flexDirection:"column",gap:3}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
            <div style={{flex:1}}>
              <div style={{fontSize:12,fontWeight:800,color:C.text,lineHeight:1.3}}>{item.name}</div>
              <div style={{fontSize:10,color:C.sub}}>{item.provider}{item.verified&&<span style={{color:C.success}}> ✓</span>}</div>
            </div>
            <button onClick={()=>onFav(item.id)} style={{background:"none",border:"none",cursor:"pointer",fontSize:14,color:isFav?"#F43F5E":"#475569",padding:"0 0 0 3px",flexShrink:0}}>{isFav?"❤️":"🤍"}</button>
          </div>
          <Stars r={item.rating}/>
          {item.reviews&&item.reviews.length>0&&<div style={{fontSize:9,color:C.sub}}>{item.reviews.length} تقييم</div>}
          <div style={{fontSize:10,color:C.sub,lineHeight:1.4}}>{item.desc.length>55?item.desc.slice(0,55)+"...":item.desc}</div>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:2}}>
            <div><span style={{fontSize:14,fontWeight:900,color:cat.color}}>{item.price.toLocaleString()}</span><span style={{fontSize:9,color:C.sub}}> ج/{item.unit}</span></div>
            <div style={{display:"flex",gap:4}}>
              <button onClick={()=>onDetail(item,cat)} style={{background:"rgba(255,255,255,0.05)",color:C.sub,border:"1px solid "+C.border,padding:"4px 8px",borderRadius:7,fontSize:10,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>تفاصيل</button>
              <button onClick={()=>onBook(item)} style={{background:inCart?"rgba(124,58,237,0.15)":C.grad,color:inCart?C.primary:"#fff",border:inCart?"1px solid "+C.primary:"none",padding:"4px 9px",borderRadius:7,fontSize:10,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>{inCart?"✓":"احجز"}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// DETAIL SHEET
// ═══════════════════════════════════════
function DetailSheet({item, cat, inCart, onAdd, onClose, user, onReview, setServices}) {
  const [rev,setRev] = useState({rating:5,comment:""});
  const [showRevForm,setShowRevForm] = useState(false);
  const hasReviewed = item.reviews?.find(r=>r.userId===user?.id);

  const submitReview = () => {
    if(!user) return;
    if(!rev.comment) return;
    const newReview = {id:Date.now(),userId:user.id,userName:user.name,rating:rev.rating,comment:rev.comment,date:new Date().toLocaleDateString("ar-EG")};
    setServices(p=>p.map(s=>s.id===item.id?{...s,reviews:[...s.reviews,newReview],rating:parseFloat(((s.reviews.reduce((a,r)=>a+r.rating,0)+rev.rating)/(s.reviews.length+1)).toFixed(1))}:s));
    setShowRevForm(false);
    setRev({rating:5,comment:""});
  };

  return (
    <Sheet title={item.name} onClose={onClose}>
      <img src={cat.img} alt={item.name} style={{width:"100%",height:150,objectFit:"cover",borderRadius:12,marginBottom:12,filter:"brightness(0.75)"}}/>
      <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:8}}>
        <Stars r={item.rating}/>
        {item.verified&&<span style={{background:"rgba(16,185,129,0.1)",color:C.success,fontSize:9,padding:"2px 7px",borderRadius:8,fontWeight:700}}>✓ موثق</span>}
        {item.badge&&<span style={{background:"rgba(124,58,237,0.1)",color:C.primary,fontSize:9,padding:"2px 7px",borderRadius:8,fontWeight:700}}>{item.badge}</span>}
        {item.reviews&&item.reviews.length>0&&<span style={{background:"rgba(245,158,11,0.1)",color:C.gold,fontSize:9,padding:"2px 7px",borderRadius:8}}>{item.reviews.length} تقييم</span>}
      </div>
      <div style={{fontSize:11,color:C.sub,marginBottom:5}}>{item.provider}</div>
      <div style={{fontSize:12,color:C.text,lineHeight:1.7,marginBottom:11}}>{item.desc}</div>
      <div style={{background:"rgba(124,58,237,0.07)",border:"1px solid rgba(124,58,237,0.15)",borderRadius:12,padding:12,marginBottom:12}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div><div style={{fontSize:9,color:C.sub}}>السعر</div><div style={{fontSize:20,fontWeight:900,color:cat.color}}>{item.price.toLocaleString()} ج</div><div style={{fontSize:9,color:C.sub}}>/ {item.unit}</div></div><div><div style={{fontSize:9,color:C.sub}}>30% المقدم</div><div style={{fontSize:16,fontWeight:800,color:C.secondary}}>{Math.round(item.price*0.3).toLocaleString()} ج</div></div>
        </div>
      </div>

      {item.reviews&&item.reviews.length>0&&(
        <div style={{marginBottom:12}}>
          <div style={{fontSize:12,fontWeight:700,color:C.text,marginBottom:8}}>⭐ آراء العملاء</div>
          {item.reviews.slice(0,3).map(r=>(
            <div key={r.id} style={{background:C.bg,border:"1px solid "+C.border,borderRadius:10,padding:10,marginBottom:6}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                <div style={{fontSize:11,fontWeight:700,color:C.text}}>{r.userName}</div>
                <Stars r={r.rating} size={9}/>
              </div>
              <div style={{fontSize:10,color:C.sub}}>{r.comment}</div>
            </div>
          ))}
        </div>
      )}

      {user&&!hasReviewed&&(
        <div style={{marginBottom:12}}>
          {!showRevForm?(
            <button onClick={()=>setShowRevForm(true)} style={{width:"100%",background:"rgba(245,158,11,0.1)",color:C.gold,border:"1px solid rgba(245,158,11,0.2)",padding:"9px 0",borderRadius:10,cursor:"pointer",fontSize:11,fontWeight:700,fontFamily:"inherit"}}>⭐ أضف تقييمك</button>
          ):(
            <div style={{background:C.bg,border:"1px solid "+C.border,borderRadius:12,padding:12}}>
              <div style={{fontSize:12,fontWeight:700,color:C.text,marginBottom:8}}>تقييمك</div>
              <div style={{display:"flex",gap:6,marginBottom:8}}>
                {[1,2,3,4,5].map(n=><button key={n} onClick={()=>setRev(p=>({...p,rating:n}))} style={{flex:1,background:rev.rating>=n?"rgba(245,158,11,0.2)":"rgba(255,255,255,0.05)",border:"none",borderRadius:7,padding:"6px 0",cursor:"pointer",fontSize:16}}>{rev.rating>=n?"★":"☆"}</button>)}
              </div>
              <Inp placeholder="اكتب تعليقك..." value={rev.comment} onChange={e=>setRev(p=>({...p,comment:e.target.value}))}/>
              <div style={{display:"flex",gap:6}}>
                <button onClick={()=>setShowRevForm(false)} style={{flex:1,background:"rgba(255,255,255,0.04)",color:C.sub,border:"1px solid "+C.border,padding:"8px 0",borderRadius:9,cursor:"pointer",fontSize:11,fontFamily:"inherit"}}>إلغاء</button>
                <button onClick={submitReview} style={{flex:2,background:C.grad,color:"#fff",border:"none",padding:"8px 0",borderRadius:9,cursor:"pointer",fontSize:11,fontWeight:700,fontFamily:"inherit"}}>إرسال</button>
              </div>
            </div>
          )}
        </div>
      )}

      <div style={{background:"rgba(16,185,129,0.07)",borderRadius:9,padding:9,marginBottom:11,fontSize:10,color:C.success}}>🔒 الدفع آمن — مبلغك محفوظ حتى تأكيد الخدمة</div>
      <button onClick={()=>{onAdd(item);onClose();}} style={{width:"100%",background:inCart?"rgba(124,58,237,0.15)":C.grad,color:inCart?C.primary:"#fff",border:inCart?"1px solid "+C.primary:"none",padding:"12px 0",borderRadius:11,fontSize:13,fontWeight:800,cursor:"pointer",fontFamily:"inherit"}}>
        {inCart?"✅ في السلة":"🛒 أضف للسلة"}
      </button>
    </Sheet>
  );
}

// ═══════════════════════════════════════
// CART SHEET
// ═══════════════════════════════════════
function CartSheet({cart, setCart, onClose, onCheckout, user}) {
  const total = cart.reduce((s,c)=>s+c.price*c.qty,0);
  const deposit = Math.round(total*0.3);
  if(!cart.length) return <Sheet title="🛒 سلة الخدمات" onClose={onClose}><div style={{textAlign:"center",padding:"40px 0",color:C.sub}}><div style={{fontSize:36,marginBottom:8}}>🛒</div><div>السلة فارغة</div></div></Sheet>;
  return (
    <Sheet title="🛒 سلة الخدمات" onClose={onClose}>
      <div style={{display:"flex",flexDirection:"column",gap:7,marginBottom:12}}>
        {cart.map(item=>(
          <div key={item.id} style={{display:"flex",gap:8,alignItems:"center",background:C.bg,border:"1px solid "+C.border,borderRadius:11,padding:10}}>
            <div style={{flex:1}}>
              <div style={{fontSize:12,fontWeight:700,color:C.text}}>{item.name}</div>
              <div style={{fontSize:11,fontWeight:800,color:C.primary}}>{(item.price*item.qty).toLocaleString()} ج</div>
              {item.note&&<div style={{fontSize:9,color:C.sub,marginTop:2}}>📝 {item.note}</div>}
            </div>
            <div style={{display:"flex",alignItems:"center",gap:5}}>
              <button onClick={()=>setCart(p=>p.map(c=>c.id===item.id?{...c,qty:Math.max(1,c.qty-1)}:c))} style={{width:24,height:24,border:"1px solid "+C.border,borderRadius:6,background:C.card,cursor:"pointer",fontSize:13,color:C.text,display:"flex",alignItems:"center",justifyContent:"center"}}>−</button>
              <span style={{fontSize:12,fontWeight:700,color:C.text,minWidth:16,textAlign:"center"}}>{item.qty}</span>
              <button onClick={()=>setCart(p=>p.map(c=>c.id===item.id?{...c,qty:c.qty+1}:c))} style={{width:24,height:24,border:"1px solid "+C.border,borderRadius:6,background:C.card,cursor:"pointer",fontSize:13,color:C.text,display:"flex",alignItems:"center",justifyContent:"center"}}>+</button>
            </div>
            <button onClick={()=>setCart(p=>p.filter(c=>c.id!==item.id))} style={{background:"rgba(244,63,94,.08)",border:"none",color:C.danger,width:24,height:24,borderRadius:6,cursor:"pointer",fontSize:12}}>×</button>
          </div>
        ))}
      </div>
      <div style={{background:"rgba(124,58,237,0.07)",border:"1px solid rgba(124,58,237,0.15)",borderRadius:11,padding:12,marginBottom:12}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{fontSize:11,color:C.sub}}>الإجمالي</span><span style={{fontSize:13,fontWeight:800,color:C.text}}>{total.toLocaleString()} ج</span></div>
        <div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:11,color:C.sub}}>المقدم (30%)</span><span style={{fontSize:13,fontWeight:700,color:C.primary}}>{deposit.toLocaleString()} ج</span></div>
      </div>
      <button onClick={()=>onCheckout(cart,total,deposit)} style={{width:"100%",background:C.grad,color:"#fff",border:"none",padding:"12px 0",borderRadius:12,fontSize:13,fontWeight:800,cursor:"pointer",fontFamily:"inherit"}}>✅ تأكيد الحجز</button>
    </Sheet>
  );
}

// ═══════════════════════════════════════
// CHECKOUT SHEET
// ═══════════════════════════════════════
function CheckoutSheet({cart, total, deposit, onClose, onDone, user}) {
  const [form,setForm] = useState({name:user?.name||"",phone:user?.phone||"",date:"",notes:"",pay:"whatsapp"});
  const [done,setDone] = useState(false);

  const submit = () => {
    if(!form.name||!form.phone) return;
    const order = {id:Date.now(),client:form.name,phone:form.phone,date:form.date,notes:form.notes,items:cart.map(c=>({id:c.id,name:c.name,price:c.price,qty:c.qty,provider:c.provider,cat:c.cat})),total,deposit,status:"pending",pay:form.pay,userId:user?.id||"guest",createdAt:new Date().toLocaleDateString("ar-EG")};
    onDone(order); setDone(true);
    const msg = encodeURIComponent("حجز جديد من ليالينا 🌙\nالاسم: "+form.name+"\nالهاتف: "+form.phone+"\nتاريخ الفرح: "+(form.date||"لم يحدد")+"\nالخدمات:\n"+cart.map(c=>"- "+c.name).join("\n")+"\nالإجمالي: "+total.toLocaleString()+" ج\nالمقدم: "+deposit.toLocaleString()+" ج\nطريقة الدفع: "+form.pay);
    setTimeout(()=>window.open("https://wa.me/"+WA+"?text="+msg,"_blank"),600);
  };

  if(done) return <Sheet title="" onClose={onClose}><div style={{textAlign:"center",padding:"30px 0"}}><div style={{fontSize:50,marginBottom:10}}>🎉</div><div style={{fontSize:18,fontWeight:900,color:C.primary,marginBottom:6}}>تم الحجز بنجاح!</div><div style={{fontSize:11,color:C.sub,marginBottom:6}}>سيتواصل معك فريق ليالينا قريباً</div><div style={{fontSize:10,color:C.success,background:"rgba(16,185,129,0.1)",borderRadius:8,padding:"6px 14px",marginBottom:16}}>🔒 مبلغك محفوظ ومؤمن</div><button onClick={onClose} style={{background:C.grad,color:"#fff",border:"none",padding:"10px 26px",borderRadius:10,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>رائع! 🌟</button></div></Sheet>;

  return (
    <Sheet title="📝 بيانات الحجز" onClose={onClose}>
      <Inp placeholder="الاسم الكامل *" value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))}/>
      <Inp placeholder="رقم الهاتف *" value={form.phone} onChange={e=>setForm(p=>({...p,phone:e.target.value}))}/>
      <Inp type="date" placeholder="تاريخ الفرح" value={form.date} onChange={e=>setForm(p=>({...p,date:e.target.value}))}/>
      <textarea placeholder="ملاحظات..." value={form.notes} onChange={e=>setForm(p=>({...p,notes:e.target.value}))} style={{width:"100%",background:C.bg,border:"1px solid "+C.border,borderRadius:10,padding:"10px 12px",fontSize:12,color:C.text,fontFamily:"inherit",outline:"none",boxSizing:"border-box",marginBottom:8,resize:"none",height:60}}/>
      <div style={{marginBottom:12}}>
        <div style={{fontSize:12,fontWeight:700,color:C.text,marginBottom:8}}>💳 طريقة الدفع</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6}}>
          {[["whatsapp","💬 واتساب"],["visa","💳 فيزا"],["cash","💵 كاش"]].map(([v,l])=>(
            <button key={v} onClick={()=>setForm(p=>({...p,pay:v}))} style={{background:form.pay===v?"rgba(124,58,237,0.2)":C.bg,color:form.pay===v?C.primary:C.sub,border:"1px solid "+(form.pay===v?C.primary:C.border),padding:"8px 4px",borderRadius:9,cursor:"pointer",fontSize:10,fontWeight:700,fontFamily:"inherit"}}>{l}</button>
          ))}
        </div>
      </div>
      <div style={{background:"rgba(124,58,237,0.07)",border:"1px solid rgba(124,58,237,0.15)",borderRadius:11,padding:11,marginBottom:11}}>
        {cart.map(c=><div key={c.id} style={{display:"flex",justifyContent:"space-between",fontSize:11,marginBottom:3}}><span style={{color:C.sub}}>{c.name}</span><span style={{color:C.text,fontWeight:700}}>{(c.price*c.qty).toLocaleString()} ج</span></div>)}
        <div style={{borderTop:"1px solid "+C.border,marginTop:7,paddingTop:7,display:"flex",justifyContent:"space-between"}}><span style={{fontSize:12,fontWeight:800,color:C.text}}>المقدم</span><span style={{fontSize:13,fontWeight:900,color:C.primary}}>{deposit.toLocaleString()} ج</span></div>
      </div>
      <button onClick={submit} disabled={!form.name||!form.phone} style={{width:"100%",background:form.name&&form.phone?C.grad:"#222",color:"#fff",border:"none",padding:"12px 0",borderRadius:12,fontSize:13,fontWeight:800,cursor:"pointer",fontFamily:"inherit"}}>📲 تأكيد الحجز</button>
    </Sheet>
  );
}

// ═══════════════════════════════════════
// JOIN SHEET
// ═══════════════════════════════════════
function JoinSheet({onClose, onDone}) {
  const [form,setForm] = useState({name:"",phone:"",email:"",cat:"",service:"",desc:"",price:"",pass:""});
  const [done,setDone] = useState(false);

  const submit = () => {
    if(!form.name||!form.phone||!form.cat||!form.service||!form.pass) return;
    onDone({...form,id:"p"+Date.now(),status:"pending",wallet:0,serviceIds:[]});
    setDone(true);
    const msg = encodeURIComponent("طلب انضمام جديد - ليالينا 🌙\nالاسم: "+form.name+"\nالهاتف: "+form.phone+"\nالإيميل: "+form.email+"\nالتصنيف: "+form.cat+"\nالخدمة: "+form.service+(form.price?"\nالسعر: "+form.price+" ج":""));
    setTimeout(()=>window.open("https://wa.me/"+WA+"?text="+msg,"_blank"),600);
  };

  if(done) return <Sheet title="" onClose={onClose}><div style={{textAlign:"center",padding:"30px 0"}}><div style={{fontSize:50,marginBottom:10}}>✅</div><div style={{fontSize:16,fontWeight:900,color:C.primary,marginBottom:8}}>تم إرسال طلبك!</div><div style={{fontSize:11,color:C.sub}}>سيراجع فريق ليالينا طلبك ويرد عليك قريباً</div></div></Sheet>;

  return (
    <Sheet title="🤝 انضم كمزود خدمة" onClose={onClose}>
      <div style={{background:"rgba(124,58,237,0.07)",borderRadius:11,padding:11,marginBottom:12,fontSize:11,color:C.sub,lineHeight:1.7}}>بعد مراجعة طلبك ستُضاف خدمتك وستحصل على لوحة تحكم خاصة 📋</div>
      <Inp placeholder="الاسم الكامل *" value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))}/>
      <Inp placeholder="رقم الهاتف *" value={form.phone} onChange={e=>setForm(p=>({...p,phone:e.target.value}))}/>
      <Inp type="email" placeholder="الإيميل *" value={form.email} onChange={e=>setForm(p=>({...p,email:e.target.value}))}/>
      <select value={form.cat} onChange={e=>setForm(p=>({...p,cat:e.target.value}))} style={{width:"100%",background:C.bg,border:"1px solid "+C.border,borderRadius:10,padding:"10px 12px",fontSize:12,color:C.text,fontFamily:"inherit",outline:"none",boxSizing:"border-box",marginBottom:8}}>
        <option value="">اختر نوع الخدمة *</option>
        {CATS.map(c=><option key={c.id} value={c.name}>{c.icon} {c.name}</option>)}
      </select>
      <Inp placeholder="اسم الخدمة *" value={form.service} onChange={e=>setForm(p=>({...p,service:e.target.value}))}/>
      <Inp type="number" placeholder="السعر التقريبي (اختياري)" value={form.price} onChange={e=>setForm(p=>({...p,price:e.target.value}))}/>
      <textarea placeholder="وصف الخدمة..." value={form.desc} onChange={e=>setForm(p=>({...p,desc:e.target.value}))} style={{width:"100%",background:C.bg,border:"1px solid "+C.border,borderRadius:10,padding:"10px 12px",fontSize:12,color:C.text,fontFamily:"inherit",outline:"none",boxSizing:"border-box",marginBottom:8,resize:"none",height:60}}/>
      <Inp type="password" placeholder="كلمة مرور لحسابك *" value={form.pass} onChange={e=>setForm(p=>({...p,pass:e.target.value}))}/>
      <button onClick={submit} disabled={!form.name||!form.phone||!form.cat||!form.service||!form.pass} style={{width:"100%",background:form.name&&form.phone&&form.cat&&form.service&&form.pass?C.grad:"#222",color:"#fff",border:"none",padding:"12px 0",borderRadius:12,fontSize:13,fontWeight:800,cursor:"pointer",fontFamily:"inherit"}}>📲 إرسال الطلب</button>
    </Sheet>
  );
}

// ═══════════════════════════════════════
// PROVIDER DASHBOARD
// ═══════════════════════════════════════
function ProviderLogin({providers, onLogin, onClose}) {
  const [form,setForm] = useState({email:"",pass:""});
  const [err,setErr] = useState("");
  const submit = () => {
    const p = providers.find(p=>p.email===form.email&&p.pass===form.pass&&p.status==="active");
    if(!p) return setErr("بيانات الدخول غلط أو الحساب غير مفعل");
    onLogin(p); onClose();
  };
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.92)",backdropFilter:"blur(12px)",zIndex:500,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div style={{background:C.card,borderRadius:20,padding:22,width:"100%",maxWidth:300,border:"1px solid "+C.border}}>
        <div style={{textAlign:"center",marginBottom:16}}><div style={{fontSize:28,marginBottom:4}}>🏪</div><div style={{fontSize:13,fontWeight:800,color:C.text}}>دخول المورد</div></div>
        <Inp type="email" placeholder="الإيميل *" value={form.email} onChange={e=>setForm(p=>({...p,email:e.target.value}))}/>
        <Inp type="password" placeholder="كلمة المرور *" value={form.pass} onChange={e=>setForm(p=>({...p,pass:e.target.value}))} style={{marginBottom:err?4:8}}/>
        {err&&<div style={{color:C.danger,fontSize:10,textAlign:"center",marginBottom:8}}>{err}</div>}
        <div style={{display:"flex",gap:6}}>
          <button onClick={onClose} style={{flex:1,background:"rgba(255,255,255,0.04)",border:"1px solid "+C.border,color:C.sub,padding:"9px 0",borderRadius:9,cursor:"pointer",fontSize:11,fontFamily:"inherit"}}>إلغاء</button>
          <button onClick={submit} style={{flex:2,background:C.grad,color:"#fff",border:"none",padding:"9px 0",borderRadius:9,cursor:"pointer",fontSize:11,fontWeight:700,fontFamily:"inherit"}}>دخول</button>
        </div>
      </div>
    </div>
  );
}

function ProviderDashboard({provider, services, orders, onClose, onLogout}) {
  const myServices = services.filter(s=>provider.serviceIds?.includes(s.id)||s.providerEmail===provider.email);
  const myOrders = orders.filter(o=>o.items?.some(i=>myServices.find(s=>s.id===i.id)));
  const myRevenue = myOrders.filter(o=>o.status==="confirmed").reduce((s,o)=>s+o.items.filter(i=>myServices.find(s=>s.id===i.id)).reduce((a,i)=>a+i.price*i.qty,0),0);
  const commission = Math.round(myRevenue*0.1);
  const myWallet = myRevenue - commission;
  const allReviews = myServices.flatMap(s=>(s.reviews||[]).map(r=>({...r,serviceName:s.name})));
  const [tab,setTab] = useState("dash");
  const tabs=[["dash","📊 لوحة"],["orders","📋 أوردرات"],["reviews","⭐ تقييمات"]];

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.93)",backdropFilter:"blur(14px)",zIndex:500,display:"flex",alignItems:"center",justifyContent:"center",padding:8}}>
      <div style={{background:C.card,borderRadius:20,width:"100%",maxWidth:600,height:"92vh",display:"flex",flexDirection:"column",border:"1px solid "+C.border,overflow:"hidden"}}>
        <div style={{background:C.grad,padding:"12px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
          <div><div style={{fontSize:13,fontWeight:900,color:"#fff"}}>🏪 {provider.name}</div><div style={{fontSize:9,color:"rgba(255,255,255,0.7)"}}>لوحة تحكم المورد</div></div>
          <div style={{display:"flex",gap:6}}>
            <button onClick={onLogout} style={{background:"rgba(255,255,255,0.15)",border:"none",color:"#fff",padding:"4px 10px",borderRadius:7,cursor:"pointer",fontSize:10,fontFamily:"inherit"}}>خروج</button>
            <button onClick={onClose} style={{background:"rgba(255,255,255,0.2)",border:"none",color:"#fff",width:26,height:26,borderRadius:6,cursor:"pointer",fontSize:14}}>×</button>
          </div>
        </div>
        <div style={{display:"flex",borderBottom:"1px solid "+C.border,background:C.bg,flexShrink:0}}>
          {tabs.map(([k,l])=><button key={k} onClick={()=>setTab(k)} style={{flex:1,background:tab===k?"rgba(124,58,237,0.15)":"transparent",color:tab===k?C.primary:C.sub,border:"none",borderBottom:tab===k?"2px solid "+C.primary:"2px solid transparent",padding:"10px 0",cursor:"pointer",fontSize:11,fontWeight:tab===k?800:400,fontFamily:"inherit"}}>{l}</button>)}
        </div>
        <div style={{flex:1,overflowY:"auto",padding:14}}>
          {tab==="dash"&&(
            <>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9,marginBottom:14}}>
                {[["📦",myOrders.length,"أوردراتي",C.primary],["💰",myWallet.toLocaleString()+" ج","محفظتي",C.success],["✂️",commission.toLocaleString()+" ج","عمولة المنصة (10%)","#aaa"],["⭐",allReviews.length,"تقييمات",C.gold]].map(([ic,val,lab,col])=>(
                  <div key={lab} style={{background:C.bg,border:"1px solid "+C.border,borderRadius:12,padding:12}}><div style={{fontSize:18,marginBottom:4}}>{ic}</div><div style={{fontSize:15,fontWeight:900,color:col}}>{val}</div><div style={{fontSize:9,color:C.sub}}>{lab}</div></div>
                ))}
              </div>
              <div style={{background:"rgba(124,58,237,0.07)",border:"1px solid rgba(124,58,237,0.15)",borderRadius:12,padding:12}}>
                <div style={{fontSize:12,fontWeight:700,color:C.text,marginBottom:8}}>خدماتي المعتمدة</div>
                {myServices.length===0&&<div style={{fontSize:11,color:C.sub}}>لا يوجد خدمات بعد</div>}
                {myServices.map(s=>(
                  <div key={s.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6,paddingBottom:6,borderBottom:"1px solid "+C.border}}>
                    <div><div style={{fontSize:11,fontWeight:700,color:C.text}}>{s.name}</div><div style={{fontSize:9,color:C.sub}}>{s.price.toLocaleString()} ج / {s.unit}</div></div>
                    <div style={{display:"flex",gap:4,alignItems:"center"}}>
                      <Stars r={s.rating} size={9}/>
                      {s.verified?<span style={{fontSize:8,color:C.success,background:"rgba(16,185,129,0.1)",padding:"1px 5px",borderRadius:5}}>✓ موثق</span>:<span style={{fontSize:8,color:C.warn,background:"rgba(245,158,11,0.1)",padding:"1px 5px",borderRadius:5}}>⏳ مراجعة</span>}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
          {tab==="orders"&&(
            <>
              {!myOrders.length&&<div style={{textAlign:"center",padding:"40px 0",color:C.sub}}><div style={{fontSize:32,marginBottom:7}}>📋</div><div>لا يوجد أوردرات</div></div>}
              {myOrders.map(o=>(
                <div key={o.id} style={{background:C.bg,border:"1px solid "+C.border,borderRadius:12,padding:12,marginBottom:8}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}><div style={{fontSize:12,fontWeight:800,color:C.text}}>{o.client}</div><span style={{fontSize:9,padding:"2px 8px",borderRadius:8,fontWeight:700,background:o.status==="confirmed"?"rgba(16,185,129,0.12)":o.status==="cancelled"?"rgba(244,63,94,0.12)":"rgba(245,158,11,0.12)",color:o.status==="confirmed"?C.success:o.status==="cancelled"?C.danger:C.warn}}>{o.status==="confirmed"?"✓ مؤكد":o.status==="cancelled"?"✗ ملغي":"⏳ معلق"}</span></div>
                  <div style={{fontSize:10,color:C.sub}}>📞 {o.phone} · 📅 {o.date||"غير محدد"}</div>
                  <div style={{fontSize:10,color:C.text,marginTop:4}}>{o.items?.filter(i=>myServices.find(s=>s.id===i.id)).map(i=>i.name).join(" · ")}</div>
                </div>
              ))}
            </>
          )}
          {tab==="reviews"&&(
            <>
              {!allReviews.length&&<div style={{textAlign:"center",padding:"40px 0",color:C.sub}}><div style={{fontSize:32,marginBottom:7}}>⭐</div><div>لا يوجد تقييمات بعد</div></div>}
              {allReviews.map(r=>(
                <div key={r.id} style={{background:C.bg,border:"1px solid "+C.border,borderRadius:12,padding:12,marginBottom:8}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                    <div style={{fontSize:11,fontWeight:700,color:C.text}}>{r.userName}</div>
                    <Stars r={r.rating} size={10}/>
                  </div>
                  <div style={{fontSize:9,color:C.accent,marginBottom:4}}>📌 {r.serviceName}</div>
                  <div style={{fontSize:11,color:C.sub}}>{r.comment}</div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// ADMIN PANEL
// ═══════════════════════════════════════
function AdminPanel({services, setServices, banners, setBanners, orders, setOrders, joins, setJoins, providers, setProviders, onClose}) {
  const [tab,setTab] = useState("dash");
  const [saved,setSaved] = useState("");
  const [ni,setNi] = useState({cat:1,name:"",price:"",unit:"",provider:"",desc:""});
  const [editPrice,setEditPrice] = useState({id:null,val:""});
  const ok = msg=>{setSaved(msg);setTimeout(()=>setSaved(""),2500);};

  const addItem = () => {
    if(!ni.name||!ni.price) return;
    setServices(p=>[...p,{id:Date.now(),cat:Number(ni.cat),name:ni.name,price:Number(ni.price),unit:ni.unit||"وحدة",rating:5.0,reviews:[],badge:null,provider:ni.provider,desc:ni.desc,verified:false,sponsored:false,providerEmail:""}]);
    setNi({cat:1,name:"",price:"",unit:"",provider:"",desc:""});
    ok("✅ تم إضافة الخدمة");
  };
  const updatePrice = (id) => { setServices(p=>p.map(s=>s.id===id?{...s,price:Number(editPrice.val)}:s)); setEditPrice({id:null,val:""}); ok("✅ تم تحديث السعر"); };
  const toggleV = id=>setServices(p=>p.map(s=>s.id===id?{...s,verified:!s.verified}:s));
  const toggleS = id=>setServices(p=>p.map(s=>s.id===id?{...s,sponsored:!s.sponsored}:s));
  const delItem = id=>setServices(p=>p.filter(s=>s.id!==id));
  const togBanner = id=>setBanners(p=>p.map(b=>b.id===id?{...b,active:!b.active}:b));
  const updOrder = (id,st)=>setOrders(p=>p.map(o=>o.id===id?{...o,status:st}:o));
  const approveJoin = j=>{
    const catObj = CATS.find(c=>c.name===j.cat);
    const newService = {id:Date.now(),cat:catObj?.id||1,name:j.service,price:Number(j.price)||0,unit:"وحدة",rating:5.0,reviews:[],badge:"جديد",provider:j.name,desc:j.desc||"",verified:true,sponsored:false,providerEmail:j.email||""};
    setServices(p=>[...p,newService]);
    setProviders(p=>[...p,{id:j.id,name:j.name,email:j.email||"",pass:j.pass||"1234",phone:j.phone,cat:catObj?.id||1,status:"active",wallet:0,serviceIds:[newService.id]}]);
    setJoins(p=>p.map(r=>r.id===j.id?{...r,status:"approved"}:r));
    ok("✅ تمت الموافقة وإنشاء حساب المورد");
  };
  const rejectJoin = id=>setJoins(p=>p.map(r=>r.id===id?{...r,status:"rejected"}:r));
  const blockJoin = id=>setJoins(p=>p.map(r=>r.id===id?{...r,status:"blocked"}:r));
  const blockProvider = id=>setProviders(p=>p.map(pr=>pr.id===id?{...pr,status:"blocked"}:pr));
  const unblockProvider = id=>setProviders(p=>p.map(pr=>pr.id===id?{...pr,status:"active"}:pr));

  const pending = joins.filter(r=>r.status==="pending").length;
  const totalRev = orders.reduce((s,o)=>s+(o.total||0),0);
  const commission = Math.round(totalRev*0.1);
  const tabs=[["dash","📊 لوحة"],["joins","🤝"+(pending?" ("+pending+")":"")],["providers","🏪 موردين"],["services","🛠️ خدمات"],["orders","📋 أوردرات"],["banners","🖼️ بانرات"],["reports","💰 تقارير"]];

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.93)",backdropFilter:"blur(14px)",zIndex:500,display:"flex",alignItems:"center",justifyContent:"center",padding:8}}>
      <div style={{background:C.card,borderRadius:20,width:"100%",maxWidth:800,height:"95vh",display:"flex",flexDirection:"column",border:"1px solid "+C.border,overflow:"hidden"}}>
        <div style={{background:C.grad,padding:"12px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
          <div style={{fontSize:14,fontWeight:900,color:"#fff"}}>🛠️ لوحة تحكم ليالينا</div>
          <button onClick={onClose} style={{background:"rgba(255,255,255,0.2)",border:"none",color:"#fff",width:28,height:28,borderRadius:7,cursor:"pointer",fontSize:15}}>×</button>
          </div>
        <div style={{display:"flex",overflowX:"auto",flexShrink:0,borderBottom:"1px solid "+C.border,background:C.bg}}>
          {tabs.map(([k,l])=><button key={k} onClick={()=>setTab(k)} style={{flex:"0 0 auto",background:tab===k?"rgba(124,58,237,0.15)":"transparent",color:tab===k?C.primary:C.sub,border:"none",borderBottom:tab===k?"2px solid "+C.primary:"2px solid transparent",padding:"10px 12px",cursor:"pointer",fontSize:10,fontWeight:tab===k?800:400,fontFamily:"inherit",whiteSpace:"nowrap"}}>{l}</button>)}
        </div>
        {saved&&<div style={{background:"rgba(16,185,129,0.12)",color:C.success,padding:"6px 16px",fontSize:11,fontWeight:700,textAlign:"center"}}>{saved}</div>}
        <div style={{flex:1,overflowY:"auto",padding:14}}>

          {tab==="dash"&&(
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(120px,1fr))",gap:9}}>
              {[["📦",orders.length,"الأوردرات",C.primary],["💰",totalRev.toLocaleString()+" ج","الإيرادات",C.success],["✂️",commission.toLocaleString()+" ج","العمولات (10%)","#06B6D4"],["🤝",pending,"طلبات معلقة",C.secondary],["🏪",providers.filter(p=>p.status==="active").length,"موردين نشطين","#A78BFA"],["🛎️",services.length,"الخدمات",C.primary],["👥",orders.map(o=>o.userId).filter((v,i,a)=>a.indexOf(v)===i).length,"العملاء",C.warn],["🖼️",banners.filter(b=>b.active).length,"بانرات نشطة","#38BDF8"]].map(([ic,val,lab,col])=>(
                <div key={lab} style={{background:C.bg,border:"1px solid "+C.border,borderRadius:12,padding:12}}><div style={{fontSize:18,marginBottom:4}}>{ic}</div><div style={{fontSize:14,fontWeight:900,color:col}}>{val}</div><div style={{fontSize:9,color:C.sub}}>{lab}</div></div>
              ))}
            </div>
          )}

          {tab==="joins"&&(
            <>
              {!joins.length&&<div style={{textAlign:"center",padding:"40px 0",color:C.sub}}><div style={{fontSize:32,marginBottom:7}}>🤝</div><div>لا يوجد طلبات</div></div>}
              {joins.map(r=>(
                <div key={r.id} style={{background:C.bg,border:"1px solid "+(r.status==="pending"?C.warn:r.status==="approved"?C.success:"#555"),borderRadius:12,padding:12,marginBottom:8}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><div style={{fontSize:12,fontWeight:800,color:C.text}}>{r.name}</div><span style={{fontSize:9,padding:"2px 8px",borderRadius:8,fontWeight:700,background:r.status==="pending"?"rgba(245,158,11,0.12)":r.status==="approved"?"rgba(16,185,129,0.12)":"rgba(100,100,100,0.12)",color:r.status==="pending"?C.warn:r.status==="approved"?C.success:"#aaa"}}>{r.status==="pending"?"⏳ معلق":r.status==="approved"?"✅ موافق":r.status==="blocked"?"🚫 محظور":"❌ مرفوض"}</span></div>
                  <div style={{fontSize:10,color:C.sub,marginBottom:3}}>📞 {r.phone}{r.email?" · "+r.email:""}</div>
                  <div style={{fontSize:10,color:C.sub,marginBottom:3}}>🏷️ {r.cat} · {r.service}{r.price?" · "+Number(r.price).toLocaleString()+" ج":""}</div>
                  {r.status==="pending"&&<div style={{display:"flex",gap:6,marginTop:8}}><button onClick={()=>approveJoin(r)} style={{flex:1,background:"rgba(16,185,129,0.08)",color:C.success,border:"1px solid rgba(16,185,129,0.2)",borderRadius:7,padding:"6px 0",cursor:"pointer",fontSize:10,fontFamily:"inherit"}}>✅ موافقة</button><button onClick={()=>rejectJoin(r.id)} style={{flex:1,background:"rgba(244,63,94,0.08)",color:C.danger,border:"1px solid rgba(244,63,94,0.2)",borderRadius:7,padding:"6px 0",cursor:"pointer",fontSize:10,fontFamily:"inherit"}}>❌ رفض</button><button onClick={()=>blockJoin(r.id)} style={{flex:1,background:"rgba(100,100,100,0.08)",color:"#aaa",border:"1px solid rgba(100,100,100,0.2)",borderRadius:7,padding:"6px 0",cursor:"pointer",fontSize:10,fontFamily:"inherit"}}>🚫 حظر</button></div>}
                </div>
              ))}
            </>
          )}

          {tab==="providers"&&(
            <>
              {providers.map(pr=>(
                <div key={pr.id} style={{background:C.bg,border:"1px solid "+(pr.status==="active"?C.success:"#555"),borderRadius:12,padding:12,marginBottom:8}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}><div style={{fontSize:12,fontWeight:800,color:C.text}}>{pr.name}</div><span style={{fontSize:9,padding:"2px 8px",borderRadius:8,fontWeight:700,background:pr.status==="active"?"rgba(16,185,129,0.12)":"rgba(100,100,100,0.12)",color:pr.status==="active"?C.success:"#aaa"}}>{pr.status==="active"?"✅ نشط":"🚫 محظور"}</span></div>
                  <div style={{fontSize:10,color:C.sub,marginBottom:3}}>📞 {pr.phone}{pr.email?" · "+pr.email:""}</div>
                  <div style={{fontSize:10,color:C.sub,marginBottom:8}}>🏷️ {CATS.find(c=>c.id===pr.cat)?.name||"غير محدد"} · {pr.serviceIds?.length||0} خدمة</div>
                  <div style={{display:"flex",gap:6}}>
                    {pr.status==="active"?<button onClick={()=>blockProvider(pr.id)} style={{flex:1,background:"rgba(244,63,94,0.08)",color:C.danger,border:"1px solid rgba(244,63,94,0.2)",borderRadius:7,padding:"5px 0",cursor:"pointer",fontSize:10,fontFamily:"inherit"}}>🚫 حظر</button>:<button onClick={()=>unblockProvider(pr.id)} style={{flex:1,background:"rgba(16,185,129,0.08)",color:C.success,border:"1px solid rgba(16,185,129,0.2)",borderRadius:7,padding:"5px 0",cursor:"pointer",fontSize:10,fontFamily:"inherit"}}>✅ تفعيل</button>}
                  </div>
                </div>
              ))}
            </>
          )}

          {tab==="services"&&(
            <>
              <div style={{background:C.bg,borderRadius:12,padding:12,marginBottom:12,border:"1px solid "+C.border}}>
                <div style={{fontSize:12,fontWeight:700,color:C.text,marginBottom:8}}>➕ خدمة جديدة</div>
                <select value={ni.cat} onChange={e=>setNi(p=>({...p,cat:e.target.value}))} style={{width:"100%",background:C.bg,border:"1px solid "+C.border,borderRadius:9,padding:"9px 11px",color:C.text,fontSize:12,fontFamily:"inherit",outline:"none",boxSizing:"border-box",marginBottom:7}}>{CATS.map(c=><option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}</select>
                <Inp placeholder="اسم الخدمة *" value={ni.name} onChange={e=>setNi(p=>({...p,name:e.target.value}))} style={{marginBottom:7}}/>
                <div style={{display:"flex",gap:6,marginBottom:7}}>
                  <Inp type="number" placeholder="السعر *" value={ni.price} onChange={e=>setNi(p=>({...p,price:e.target.value}))} style={{marginBottom:0,flex:1}}/>
                  <Inp placeholder="الوحدة" value={ni.unit} onChange={e=>setNi(p=>({...p,unit:e.target.value}))} style={{marginBottom:0,width:80}}/>
                </div>
                <Inp placeholder="اسم المزود" value={ni.provider} onChange={e=>setNi(p=>({...p,provider:e.target.value}))} style={{marginBottom:7}}/>
                <textarea placeholder="وصف" value={ni.desc} onChange={e=>setNi(p=>({...p,desc:e.target.value}))} style={{width:"100%",background:C.bg,border:"1px solid "+C.border,borderRadius:9,padding:"9px 11px",color:C.text,fontSize:12,fontFamily:"inherit",outline:"none",boxSizing:"border-box",marginBottom:7,resize:"none",height:50}}/>
                <button onClick={addItem} style={{background:C.grad,color:"#fff",border:"none",padding:"8px 14px",borderRadius:8,cursor:"pointer",fontSize:11,fontWeight:700,fontFamily:"inherit"}}>➕ إضافة</button>
              </div>
              {CATS.map(cat=>{
                const items=services.filter(s=>s.cat===cat.id);
                if(!items.length) return null;
                return (
                  <div key={cat.id} style={{marginBottom:10,border:"1px solid "+C.border,borderRadius:12,overflow:"hidden"}}>
                    <div style={{background:"rgba(124,58,237,0.08)",padding:"8px 12px",fontSize:12,fontWeight:800,color:C.text}}>{cat.icon} {cat.name} <span style={{color:C.sub,fontWeight:400}}>({items.length})</span></div>
                    {items.map(it=>(
                      <div key={it.id} style={{padding:"8px 12px",borderTop:"1px solid "+C.border}}>
                        <div style={{display:"flex",gap:7,alignItems:"center"}}>
                          <div style={{flex:1}}>
                            <div style={{fontSize:11,fontWeight:700,color:C.text}}>{it.name}</div>
                            {editPrice.id===it.id?(
                              <div style={{display:"flex",gap:4,marginTop:4}}>
                                <input type="number" value={editPrice.val} onChange={e=>setEditPrice(p=>({...p,val:e.target.value}))} style={{width:80,background:C.bg,border:"1px solid "+C.border,borderRadius:6,padding:"3px 6px",fontSize:11,color:C.text,outline:"none"}}/>
                                <button onClick={()=>updatePrice(it.id)} style={{background:"rgba(16,185,129,0.1)",color:C.success,border:"none",borderRadius:6,padding:"3px 7px",cursor:"pointer",fontSize:10,fontFamily:"inherit"}}>حفظ</button>
                                <button onClick={()=>setEditPrice({id:null,val:""})} style={{background:"rgba(244,63,94,0.1)",color:C.danger,border:"none",borderRadius:6,padding:"3px 7px",cursor:"pointer",fontSize:10,fontFamily:"inherit"}}>إلغاء</button>
                              </div>
                            ):(
                              <div style={{display:"flex",alignItems:"center",gap:4,marginTop:2}}>
                                <span style={{fontSize:10,color:C.sub}}>{it.price.toLocaleString()} ج</span>
                                <button onClick={()=>setEditPrice({id:it.id,val:it.price})} style={{background:"rgba(124,58,237,0.1)",color:C.primary,border:"none",borderRadius:5,padding:"1px 5px",cursor:"pointer",fontSize:8,fontFamily:"inherit"}}>تعديل السعر</button>
                              </div>
                            )}
                          </div>
                          <button onClick={()=>toggleV(it.id)} style={{background:it.verified?"rgba(16,185,129,0.08)":"rgba(100,116,139,0.08)",color:it.verified?C.success:C.sub,border:"none",borderRadius:5,padding:"2px 5px",cursor:"pointer",fontSize:9,fontFamily:"inherit"}}>{it.verified?"✓":"توثيق"}</button>
                          <button onClick={()=>toggleS(it.id)} style={{background:it.sponsored?"rgba(245,158,11,0.08)":"rgba(100,116,139,0.08)",color:it.sponsored?C.gold:C.sub,border:"none",borderRadius:5,padding:"2px 5px",cursor:"pointer",fontSize:9,fontFamily:"inherit"}}>{it.sponsored?"⭐":"دعم"}</button>
                          <button onClick={()=>delItem(it.id)} style={{background:"rgba(244,63,94,0.08)",border:"none",color:C.danger,width:20,height:20,borderRadius:4,cursor:"pointer",fontSize:10}}>×</button>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </>
          )}

          {tab==="orders"&&(
            <>
              {!orders.length&&<div style={{textAlign:"center",padding:"40px 0",color:C.sub}}><div style={{fontSize:32,marginBottom:7}}>📋</div><div>لا يوجد أوردرات</div></div>}
              {orders.map(o=>(
                <div key={o.id} style={{background:C.bg,border:"1px solid "+C.border,borderRadius:12,padding:12,marginBottom:8}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}><div style={{fontSize:12,fontWeight:800,color:C.text}}>{o.client}</div><span style={{fontSize:9,padding:"2px 8px",borderRadius:8,fontWeight:700,background:o.status==="confirmed"?"rgba(16,185,129,0.12)":o.status==="cancelled"?"rgba(244,63,94,0.12)":"rgba(245,158,11,0.12)",color:o.status==="confirmed"?C.success:o.status==="cancelled"?C.danger:C.warn}}>{o.status==="confirmed"?"✓ مؤكد":o.status==="cancelled"?"✗ ملغي":"⏳ معلق"}</span></div>
                  <div style={{fontSize:10,color:C.sub,marginBottom:4}}>📞 {o.phone} · 📅 {o.date||"غير محدد"} · 💳 {o.pay}</div>
                  <div style={{fontSize:10,color:C.text,marginBottom:6}}>{o.items?.map(i=>i.name).join(" · ")}</div>
                  <div style={{display:"flex",justifyContent:"space-between",background:"rgba(124,58,237,0.07)",borderRadius:7,padding:"6px 10px",marginBottom:o.status==="pending"?6:0}}><span style={{fontSize:10,color:C.sub}}>الإجمالي</span><span style={{fontSize:12,fontWeight:900,color:C.primary}}>{o.total?.toLocaleString()} ج</span></div>
                  {o.status==="pending"&&<div style={{display:"flex",gap:6}}><button onClick={()=>updOrder(o.id,"confirmed")} style={{flex:1,background:"rgba(16,185,129,0.08)",color:C.success,border:"1px solid rgba(16,185,129,0.2)",borderRadius:7,padding:"5px 0",cursor:"pointer",fontSize:10,fontFamily:"inherit"}}>✅ تأكيد</button><button onClick={()=>updOrder(o.id,"cancelled")} style={{flex:1,background:"rgba(244,63,94,0.08)",color:C.danger,border:"1px solid rgba(244,63,94,0.2)",borderRadius:7,padding:"5px 0",cursor:"pointer",fontSize:10,fontFamily:"inherit"}}>❌ إلغاء</button></div>}
                </div>
              ))}
            </>
          )}

          {tab==="banners"&&(
            <>
              {banners.map(b=>(
                <div key={b.id} style={{display:"flex",gap:8,alignItems:"center",background:C.bg,border:"1px solid "+C.border,borderRadius:10,padding:9,marginBottom:6}}>
                  <img src={b.img} alt={b.title} style={{width:44,height:32,objectFit:"cover",borderRadius:5,filter:"brightness(0.7)"}}/>
                  <div style={{flex:1}}><div style={{fontSize:11,fontWeight:700,color:C.text}}>{b.title}</div></div>
                  <button onClick={()=>togBanner(b.id)} style={{background:b.active?"rgba(16,185,129,0.08)":"rgba(100,116,139,0.08)",color:b.active?C.success:C.sub,border:"none",borderRadius:5,padding:"2px 6px",cursor:"pointer",fontSize:9,fontFamily:"inherit"}}>{b.active?"نشط":"مخفي"}</button>
                </div>
              ))}
            </>
          )}

          {tab==="reports"&&(
            <div>
              <div style={{background:"rgba(124,58,237,0.07)",border:"1px solid rgba(124,58,237,0.15)",borderRadius:12,padding:14,marginBottom:12}}>
                <div style={{fontSize:13,fontWeight:700,color:C.text,marginBottom:10}}>💰 التقرير المالي</div>
                {[["إجمالي الإيرادات",totalRev.toLocaleString()+" ج",C.success],["عمولة المنصة (10%)",commission.toLocaleString()+" ج",C.primary],["إجمالي الديبوزتات",orders.reduce((s,o)=>s+(o.deposit||0),0).toLocaleString()+" ج","#06B6D4"],["متوسط قيمة الأوردر",orders.length?Math.round(totalRev/orders.length).toLocaleString()+" ج":"0 ج",C.gold]].map(([lab,val,col])=>(
                  <div key={lab} style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8,paddingBottom:8,borderBottom:"1px solid "+C.border}}>
                    <span style={{fontSize:11,color:C.sub}}>{lab}</span>
                    <span style={{fontSize:13,fontWeight:800,color:col}}>{val}</span>
                  </div>
                ))}
              </div>
              <div style={{background:"rgba(16,185,129,0.07)",border:"1px solid rgba(16,185,129,0.15)",borderRadius:12,padding:14}}>
                <div style={{fontSize:13,fontWeight:700,color:C.text,marginBottom:10}}>📊 إحصائيات</div>
                {[["الأوردرات المؤكدة",orders.filter(o=>o.status==="confirmed").length,C.success],["الأوردرات المعلقة",orders.filter(o=>o.status==="pending").length,C.warn],["الأوردرات الملغية",orders.filter(o=>o.status==="cancelled").length,C.danger],["الموردين النشطين",providers.filter(p=>p.status==="active").length,C.primary]].map(([lab,val,col])=>(
                  <div key={lab} style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                    <span style={{fontSize:11,color:C.sub}}>{lab}</span>
                    <span style={{fontSize:13,fontWeight:800,color:col}}>{val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════
function loadLS(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
}

export default function App() {
  const [services,  setServices]  = useState(()=>loadLS("ly_services", INIT_SERVICES));
  const [banners,   setBanners]   = useState(()=>loadLS("ly_banners", INIT_BANNERS));
  const [orders,    setOrders]    = useState(()=>loadLS("ly_orders", []));
  const [joins,     setJoins]     = useState(()=>loadLS("ly_joins", []));
  const [providers, setProviders] = useState(()=>loadLS("ly_providers", INIT_PROVIDERS));
  const [cart,      setCart]      = useState(()=>loadLS("ly_cart", []));
  const [favs,      setFavs]      = useState([]);
  const [user,      setUser]      = useState(null);
  const [provider,  setProvider]  = useState(null);
  const [search,    setSearch]    = useState("");
  const [selCat,    setSelCat]    = useState(null);
  const [tab,       setTab]       = useState("home");

  useEffect(()=>{ localStorage.setItem("ly_services", JSON.stringify(services)); },[services]);
  useEffect(()=>{ localStorage.setItem("ly_banners", JSON.stringify(banners)); },[banners]);
  useEffect(()=>{ localStorage.setItem("ly_orders", JSON.stringify(orders)); },[orders]);
  useEffect(()=>{ localStorage.setItem("ly_joins", JSON.stringify(joins)); },[joins]);
  useEffect(()=>{ localStorage.setItem("ly_providers", JSON.stringify(providers)); },[providers]);
  useEffect(()=>{ localStorage.setItem("ly_cart", JSON.stringify(cart)); },[cart]);

  useEffect(()=>{
    const savedUser = loadLS("ly_current_user", null);
    if(savedUser) { setUser(savedUser); setFavs(savedUser.favs||[]); }
  },[]);

  const [showCart,      setShowCart]      = useState(false);
  const [showOut,       setShowOut]       = useState(false);
  const [outData,       setOutData]       = useState(null);
  const [showAdmin,     setShowAdmin]     = useState(false);
  const [showAdminL,    setShowAdminL]    = useState(false);
  const [showJoin,      setShowJoin]      = useState(false);
  const [showAuth,      setShowAuth]      = useState(false);
  const [showProfile,   setShowProfile]   = useState(false);
  const [showProvLogin, setShowProvLogin] = useState(false);
  const [showProvDash,  setShowProvDash]  = useState(false);
  const [detail,        setDetail]        = useState(null);
  const [detailCat,     setDetailCat]     = useState(null);
  const [adminPass,     setAdminPass]     = useState("");
  const [adminErr,      setAdminErr]      = useState("");

  const addToCart   = item => setCart(p=>p.find(c=>c.id===item.id)?p:[...p,{...item,qty:1}]);
  const toggleFav   = id => {
    const newFavs = favs.includes(id)?favs.filter(f=>f!==id):[...favs,id];
    setFavs(newFavs);
    if(user) {
      const users = JSON.parse(localStorage.getItem("ly_users")||"[]");
      const updatedUsers = users.map(u=>u.id===user.id?{...u,favs:newFavs}:u);
      localStorage.setItem("ly_users",JSON.stringify(updatedUsers));
      const updatedUser = {...user, favs:newFavs};
      localStorage.setItem("ly_current_user", JSON.stringify(updatedUser));
    }
  };
  const handleLogin     = u => { setUser(u); setFavs(u.favs||[]); localStorage.setItem("ly_current_user", JSON.stringify(u)); };
  const handleSignOut   = () => { setUser(null); setFavs([]); setShowProfile(false); localStorage.removeItem("ly_current_user"); };
  const handleCheckout  = (c,t,d) => { if(!user){setShowAuth(true);return;} setOutData({cart:c,total:t,deposit:d}); setShowCart(false); setShowOut(true); };
  const handleOrderDone = o => { setOrders(p=>[o,...p]); setCart([]); };
  const tryAdmin        = () => { if(adminPass===ADMIN_PASS){setShowAdmin(true);setShowAdminL(false);setAdminPass("");setAdminErr("");}else setAdminErr("كلمة السر غلط!"); };

  const cartCount = cart.reduce((s,c)=>s+c.qty,0);
  const pending   = joins.filter(r=>r.status==="pending").length;

  const filtered  = services.filter(s=>
    (!search||s.name.includes(search)||s.provider.includes(search)||(CATS.find(c=>c.id===s.cat)?.name||"").includes(search))&&
    (!selCat||s.cat===selCat)
  );
  const byCat = CATS.map(cat=>({...cat,items:[...filtered.filter(s=>s.cat===cat.id&&s.sponsored),...filtered.filter(s=>s.cat===cat.id&&!s.sponsored)]})).filter(c=>c.items.length>0);

  return (
    <div dir="rtl" style={{fontFamily:"'Cairo',Tahoma,sans-serif",background:C.bg,minHeight:"100vh",width:"100%",paddingBottom:72}}>
      <style>{css}</style>

      <div style={{background:"rgba(8,8,16,0.96)",backdropFilter:"blur(20px)",padding:"10px 13px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:100,borderBottom:"1px solid "+C.border}}>
        <div>
          <div style={{fontSize:20,fontWeight:900,background:C.grad,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>ليالينا 🌙</div>
          <div style={{fontSize:8,color:C.muted}}>كل احتياجات الزفاف في مكان واحد</div>
        </div>
        <div style={{display:"flex",gap:6,alignItems:"center"}}>
          <button onClick={()=>setShowJoin(true)} style={{background:"rgba(236,72,153,0.1)",border:"1px solid rgba(236,72,153,0.2)",color:C.secondary,padding:"5px 9px",borderRadius:8,cursor:"pointer",fontSize:9,fontWeight:700,fontFamily:"inherit"}}>انضم مورد</button>
          {user?(
            <button onClick={()=>setShowProfile(true)} style={{background:"rgba(124,58,237,0.15)",border:"1px solid "+C.primary,color:C.primary,width:30,height:30,borderRadius:8,cursor:"pointer",fontSize:12,fontWeight:900}}>{user.name[0]}</button>
          ):(
            <button onClick={()=>setShowAuth(true)} style={{background:C.grad,color:"#fff",border:"none",padding:"5px 10px",borderRadius:8,cursor:"pointer",fontSize:9,fontWeight:700,fontFamily:"inherit"}}>دخول</button>
          )}
          <button onClick={()=>setShowAdminL(true)} style={{background:"rgba(255,255,255,0.04)",border:"1px solid "+C.border,color:C.muted,width:30,height:30,borderRadius:7,cursor:"pointer",fontSize:13}}>⚙️</button>
          <button onClick={()=>setShowCart(true)} style={{background:"rgba(255,255,255,0.04)",border:"1px solid "+C.border,color:C.muted,width:30,height:30,borderRadius:7,cursor:"pointer",fontSize:13,position:"relative"}}>
            🛒{cartCount>0&&<span style={{position:"absolute",top:-4,left:-4,background:C.danger,color:"#fff",width:15,height:15,borderRadius:"50%",fontSize:8,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center"}}>{cartCount}</span>}
          </button>
        </div>
      </div>

      <div style={{padding:"9px 12px 5px"}}>
        <input style={{width:"100%",background:C.card,border:"1px solid "+C.border,borderRadius:11,padding:"9px 13px",fontSize:12,color:C.text,fontFamily:"inherit",outline:"none",boxSizing:"border-box"}} placeholder="🔍 ابحث عن خدمة..." value={search} onChange={e=>{setSearch(e.target.value);setSelCat(null);}}/>
      </div>

      {tab==="home"&&(
        <>
          <BannerSlider banners={banners}/>
          <div style={{padding:"10px 12px 5px",display:"flex",gap:6,overflowX:"auto"}}>
            <button onClick={()=>setSelCat(null)} style={{flex:"0 0 auto",background:!selCat?C.grad:"rgba(255,255,255,0.04)",color:!selCat?"#fff":C.sub,border:"1px solid "+(!selCat?C.primary:C.border),borderRadius:16,padding:"4px 11px",fontSize:10,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>الكل</button>
            {CATS.map(c=><button key={c.id} onClick={()=>setSelCat(selCat===c.id?null:c.id)} style={{flex:"0 0 auto",background:selCat===c.id?c.color+"20":"rgba(255,255,255,0.04)",color:selCat===c.id?c.color:C.sub,border:"1px solid "+(selCat===c.id?c.color:C.border),borderRadius:16,padding:"4px 11px",fontSize:10,fontWeight:700,cursor:"pointer",fontFamily:"inherit",whiteSpace:"nowrap"}}>{c.icon} {c.name}</button>)}
          </div>
          <div style={{padding:"4px 12px"}}>
            {byCat.map(cat=>(
              <div key={cat.id} style={{marginBottom:18}}>
                <div style={{background:C.card,border:"1px solid "+C.border,borderRadius:13,overflow:"hidden",marginBottom:8}}>
                  <img src={cat.img} alt={cat.name} style={{width:"100%",height:110,objectFit:"cover",filter:"brightness(0.5)"}}/>
                  <div style={{padding:"8px 12px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                    <div style={{display:"flex",alignItems:"center",gap:7}}>
                      <div style={{width:26,height:26,borderRadius:7,background:cat.color+"20",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13}}>{cat.icon}</div>
                      <div style={{fontSize:13,fontWeight:900,color:C.text}}>{cat.name}</div>
                    </div>
                    <div style={{fontSize:9,color:C.muted}}>{cat.items.length} مزود</div>
                  </div>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                  {cat.items.map(item=><Card key={item.id} item={item} cat={cat} inCart={!!cart.find(c=>c.id===item.id)} isFav={favs.includes(item.id)} onFav={toggleFav} onBook={addToCart} onDetail={(it,c)=>{setDetail(it);setDetailCat(c);}}/>)}
                </div>
              </div>
            ))}
            {byCat.length===0&&<div style={{textAlign:"center",padding:"50px 0",color:C.sub}}><div style={{fontSize:32,marginBottom:7}}>🔍</div><div>لا توجد نتائج</div></div>}
          </div>
        </>
      )}

      {tab==="favs"&&(
        <div style={{padding:12}}>
          <div style={{fontSize:14,fontWeight:800,color:C.text,marginBottom:12}}>❤️ المفضلة</div>
          {favs.length===0&&<div style={{textAlign:"center",padding:"50px 0",color:C.sub}}><div style={{fontSize:36,marginBottom:8}}>🤍</div><div>لا يوجد مفضلات</div></div>}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            {services.filter(s=>favs.includes(s.id)).map(item=>{const cat=CATS.find(c=>c.id===item.cat)||CATS[0];return <Card key={item.id} item={item} cat={cat} inCart={!!cart.find(c=>c.id===item.id)} isFav={true} onFav={toggleFav} onBook={addToCart} onDetail={(it,c)=>{setDetail(it);setDetailCat(c);}}/>;})}
          </div>
        </div>
      )}

      {tab==="orders"&&(
        <div style={{padding:12}}>
          <div style={{fontSize:14,fontWeight:800,color:C.text,marginBottom:12}}>📋 حجوزاتي</div>
          {!user&&<div style={{textAlign:"center",padding:"40px 0",color:C.sub}}><div style={{fontSize:36,marginBottom:8}}>🔐</div><div style={{marginBottom:12}}>سجل الدخول لتشوف حجوزاتك</div><button onClick={()=>setShowAuth(true)} style={{background:C.grad,color:"#fff",border:"none",padding:"9px 20px",borderRadius:9,cursor:"pointer",fontSize:11,fontWeight:700,fontFamily:"inherit"}}>سجل الدخول</button></div>}
          {user&&!orders.filter(o=>o.userId===user.id).length&&<div style={{textAlign:"center",padding:"50px 0",color:C.sub}}><div style={{fontSize:36,marginBottom:8}}>📋</div><div style={{marginBottom:12}}>لا يوجد حجوزات</div><button onClick={()=>setTab("home")} style={{background:C.grad,color:"#fff",border:"none",padding:"9px 20px",borderRadius:9,cursor:"pointer",fontSize:11,fontWeight:700,fontFamily:"inherit"}}>ابدأ الحجز</button></div>}
          {user&&orders.filter(o=>o.userId===user.id).map(o=>(
            <div key={o.id} style={{background:C.card,border:"1px solid "+C.border,borderRadius:14,padding:12,marginBottom:8}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}><div style={{fontSize:12,fontWeight:800,color:C.text}}>{o.client}</div><span style={{fontSize:9,padding:"2px 8px",borderRadius:8,fontWeight:700,background:o.status==="confirmed"?"rgba(16,185,129,0.12)":o.status==="cancelled"?"rgba(244,63,94,0.12)":"rgba(245,158,11,0.12)",color:o.status==="confirmed"?C.success:o.status==="cancelled"?C.danger:C.warn}}>{o.status==="confirmed"?"✓ مؤكد":o.status==="cancelled"?"✗ ملغي":"⏳ معلق"}</span></div>
              <div style={{fontSize:10,color:C.sub,marginBottom:5}}>📅 {o.date||"غير محدد"} · 💳 {o.pay} · {o.createdAt}</div>
              <div style={{fontSize:10,color:C.text,marginBottom:6}}>{o.items?.map(i=>i.name).join(" · ")}</div>
              <div style={{display:"flex",justifyContent:"space-between",background:"rgba(124,58,237,0.07)",borderRadius:8,padding:"6px 10px",marginBottom:o.status==="pending"?6:0}}><span style={{fontSize:10,color:C.sub}}>الإجمالي</span><span style={{fontSize:12,fontWeight:900,color:C.primary}}>{o.total?.toLocaleString()} ج</span></div>
              {o.status==="pending"&&<button onClick={()=>setOrders(p=>p.map(x=>x.id===o.id?{...x,status:"cancelled"}:x))} style={{width:"100%",background:"rgba(244,63,94,0.08)",color:C.danger,border:"1px solid rgba(244,63,94,0.2)",padding:"6px 0",borderRadius:8,cursor:"pointer",fontSize:10,fontFamily:"inherit"}}>❌ إلغاء الحجز</button>}
            </div>
          ))}
        </div>
      )}

      <div style={{position:"fixed",bottom:0,left:0,right:0,background:"rgba(8,8,16,0.97)",backdropFilter:"blur(20px)",borderTop:"1px solid "+C.border,display:"flex",zIndex:100}}>
        {[["home","🏠","الرئيسية"],["favs","❤️","المفضلة"],["orders","📋","حجوزاتي"]].map(([k,ic,lb])=>(
          <button key={k} onClick={()=>setTab(k)} style={{flex:1,background:"none",border:"none",padding:"9px 0",cursor:"pointer",fontFamily:"inherit",display:"flex",flexDirection:"column",alignItems:"center",gap:1}}>
            <span style={{fontSize:18}}>{ic}</span>
            <span style={{fontSize:9,fontWeight:tab===k?800:400,color:tab===k?C.primary:C.sub}}>{lb}</span>
            {tab===k&&<div style={{width:16,height:2,background:C.grad,borderRadius:2,marginTop:1}}/>}
          </button>
        ))}
        <button onClick={()=>setShowProvLogin(true)} style={{flex:1,background:"none",border:"none",padding:"9px 0",cursor:"pointer",fontFamily:"inherit",display:"flex",flexDirection:"column",alignItems:"center",gap:1}}>
          <span style={{fontSize:18}}>🏪</span>
          <span style={{fontSize:9,color:C.sub}}>المورد</span>
        </button>
      </div>

      {showAuth&&<AuthModal onClose={()=>setShowAuth(false)} onLogin={handleLogin}/>}
      {showProfile&&user&&<ProfileSheet user={user} onClose={()=>setShowProfile(false)} onSignOut={handleSignOut}/>}
      {showCart&&<CartSheet cart={cart} setCart={setCart} onClose={()=>setShowCart(false)} onCheckout={handleCheckout} user={user}/>}
      {showOut&&outData&&<CheckoutSheet {...outData} onClose={()=>setShowOut(false)} onDone={handleOrderDone} user={user}/>}
      {showJoin&&<JoinSheet onClose={()=>setShowJoin(false)} onDone={j=>setJoins(p=>[j,...p])}/>}
      {detail&&detailCat&&<DetailSheet item={detail} cat={detailCat} inCart={!!cart.find(c=>c.id===detail.id)} onAdd={addToCart} onClose={()=>setDetail(null)} user={user} setServices={setServices}/>}
      {showProvLogin&&<ProviderLogin providers={providers} onLogin={p=>{setProvider(p);setShowProvDash(true);}} onClose={()=>setShowProvLogin(false)}/>}
      {showProvDash&&provider&&<ProviderDashboard provider={provider} services={services} orders={orders} onClose={()=>setShowProvDash(false)} onLogout={()=>{setProvider(null);setShowProvDash(false);}}/>}

      {showAdminL&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.92)",backdropFilter:"blur(12px)",zIndex:500,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
          <div style={{background:C.card,borderRadius:18,padding:22,width:"100%",maxWidth:270,border:"1px solid "+C.border}}>
            <div style={{textAlign:"center",marginBottom:14}}><div style={{fontSize:28,marginBottom:4}}>🔐</div><div style={{fontSize:13,fontWeight:800,color:C.text}}>لوحة التحكم</div>{pending>0&&<div style={{background:"rgba(245,158,11,0.08)",borderRadius:8,padding:"5px 10px",marginTop:7,fontSize:10,color:C.warn}}>⏳ {pending} طلب انضمام</div>}</div>
            <input type="password" placeholder="كلمة السر" value={adminPass} onChange={e=>{setAdminPass(e.target.value);setAdminErr("");}} onKeyDown={e=>e.key==="Enter"&&tryAdmin()} style={{width:"100%",background:C.bg,border:"1px solid "+(adminErr?C.danger:C.border),borderRadius:9,padding:"10px 12px",fontSize:12,color:C.text,fontFamily:"inherit",outline:"none",boxSizing:"border-box",marginBottom:7,textAlign:"center"}}/>
            {adminErr&&<div style={{color:C.danger,fontSize:10,textAlign:"center",marginBottom:7}}>{adminErr}</div>}
            <div style={{display:"flex",gap:6}}>
              <button onClick={()=>{setShowAdminL(false);setAdminPass("");setAdminErr("");}} style={{flex:1,background:"rgba(255,255,255,0.04)",border:"1px solid "+C.border,color:C.sub,padding:"9px 0",borderRadius:9,cursor:"pointer",fontSize:11,fontFamily:"inherit"}}>إلغاء</button>
              <button onClick={tryAdmin} style={{flex:2,background:C.grad,color:"#fff",border:"none",padding:"9px 0",borderRadius:9,cursor:"pointer",fontSize:11,fontWeight:700,fontFamily:"inherit"}}>دخول</button>
            </div>
          </div>
        </div>
      )}

      {showAdmin&&<AdminPanel services={services} setServices={setServices} banners={banners} setBanners={setBanners} orders={orders} setOrders={setOrders} joins={joins} setJoins={setJoins} providers={providers} setProviders={setProviders} onClose={()=>setShowAdmin(false)}/>}
    </div>
  );
}