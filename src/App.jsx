import { useState, useEffect, useRef } from "react";
import { supabase } from "./supabase";
import { subscribeToPush } from "./notifications";

const isPWA = typeof window !== "undefined" && (window.matchMedia("(display-mode: standalone)").matches || Boolean(window.navigator.standalone));

const C = {
  bg:"#FAF5F7",bgCard:"#FFFFFF",bgMuted:"#F5ECEF",
  primary:"#C07890",primaryGrad:"linear-gradient(135deg,#D898AC 0%,#A85A74 100%)",
  primaryLight:"#FAE8EF",primaryDark:"#7A3050",
  purple:"#A890C0",purpleLight:"#F3EEFB",
  text:"#2A1820",textMid:"#7A5868",textLight:"#B8A0AC",
  green:"#7A9E78",greenLight:"#EAF2E8",
  amber:"#C4A870",amberLight:"#FAF0DC",
  red:"#C46878",border:"#EEE0E6",shadow:"rgba(192,120,144,0.09)",
};
const fonts=`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap');`;
const css=`
*{box-sizing:border-box;margin:0;padding:0;}
body{background:${C.bg};}
.app{font-family:'DM Sans',sans-serif;background:${C.bg};min-height:100vh;max-width:390px;margin:0 auto;position:relative;color:${C.text};overflow-x:hidden;}
.serif{font-family:'Playfair Display',serif;}
.italic{font-style:italic;}
.btn-p{background:${C.primaryGrad};color:#fff;border:none;border-radius:100px;padding:16px 32px;font-size:15px;font-weight:700;font-family:'DM Sans',sans-serif;cursor:pointer;width:100%;transition:all .18s;box-shadow:0 4px 20px rgba(122,158,142,.30);touch-action:manipulation;-webkit-tap-highlight-color:transparent;letter-spacing:.2px;}
.btn-p:active{transform:scale(.97);}
.btn-o{background:${C.bgCard};color:${C.textMid};border:1.5px solid ${C.border};border-radius:100px;padding:15px 32px;font-size:15px;font-weight:600;font-family:'DM Sans',sans-serif;cursor:pointer;width:100%;touch-action:manipulation;-webkit-tap-highlight-color:transparent;}
.btn-g{background:transparent;color:${C.textMid};border:none;font-size:14px;font-family:'DM Sans',sans-serif;cursor:pointer;padding:6px;display:flex;align-items:center;gap:6px;font-weight:500;touch-action:manipulation;}
.card{background:${C.bgCard};border-radius:28px;box-shadow:0 4px 24px rgba(122,158,142,0.09);padding:20px;}
.chip{display:inline-flex;align-items:center;gap:6px;padding:8px 16px;border-radius:100px;border:1.5px solid ${C.border};background:${C.bgCard};font-size:13px;color:${C.textMid};cursor:pointer;transition:all .16s;font-family:'DM Sans',sans-serif;font-weight:600;}
.chip.on{border-color:${C.primary};background:${C.primaryLight};color:${C.primaryDark};}
.cr{display:block;width:100%;text-align:left;padding:15px 18px;border-radius:18px;border:1.5px solid ${C.border};background:${C.bgCard};font-size:15px;color:${C.textMid};cursor:pointer;font-family:'DM Sans',sans-serif;margin-bottom:8px;transition:all .16s;font-weight:500;}
.cr.on{border-color:${C.primary};background:${C.primaryLight};color:${C.primaryDark};font-weight:600;}
.inp{width:100%;padding:16px 20px;border-radius:18px;border:1.5px solid ${C.border};background:${C.bgCard};font-size:15px;font-family:'DM Sans',sans-serif;color:${C.text};outline:none;transition:all .18s;font-weight:500;}
.inp:focus{border-color:${C.primary};box-shadow:0 0 0 4px ${C.primaryLight};}
textarea.inp{resize:none;min-height:80px;line-height:1.65;}
.inp-el{width:100%;padding:15px 18px;border-radius:16px;border:none;background:#FAFAFA;box-shadow:0 0 0 1.5px rgba(192,120,144,.14),0 2px 10px rgba(192,120,144,.05);font-size:15px;font-family:'DM Sans',sans-serif;color:${C.text};outline:none;transition:all .2s;font-weight:500;}
.inp-el:focus{background:#fff;box-shadow:0 0 0 2px ${C.primary},0 4px 18px rgba(192,120,144,.12);}
.inp-el::placeholder{color:${C.textLight};}
.bnav{position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:100%;max-width:390px;background:rgba(255,255,255,.97);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border-top:1px solid ${C.border};border-radius:20px 20px 0 0;display:flex;z-index:100;padding:8px 4px env(safe-area-inset-bottom,10px);gap:0;}
.ni{display:flex;flex-direction:column;align-items:center;gap:3px;padding:8px 0;cursor:pointer;background:none;border:none;border-radius:14px;flex:1;transition:all .2s;}
.ni.active{background:${C.primaryLight};}
.tag{display:inline-block;padding:4px 11px;border-radius:100px;font-size:11px;font-weight:700;}
.fi{animation:fi .25s cubic-bezier(.4,0,.2,1);}
@keyframes fi{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
.pb{height:5px;background:${C.bgMuted};border-radius:100px;overflow:hidden;}
.pf{height:100%;background:${C.primaryGrad};border-radius:100px;transition:width .4s ease;}
.emb{background:${C.bgMuted};border:2px solid transparent;border-radius:20px;padding:14px 6px;cursor:pointer;transition:all .16s;text-align:center;flex:1;}
.emb.on{border-color:${C.primary};background:${C.primaryLight};}
.bbu{background:${C.primaryGrad};color:#fff;border-radius:20px 20px 4px 20px;padding:12px 16px;font-size:14px;line-height:1.65;max-width:78%;align-self:flex-end;box-shadow:0 4px 16px rgba(122,158,142,.25);font-weight:500;}
.bba{background:${C.bgCard};box-shadow:0 2px 12px ${C.shadow};color:${C.text};border-radius:20px 20px 20px 4px;padding:12px 16px;font-size:14px;line-height:1.65;max-width:84%;align-self:flex-start;font-weight:500;}
.inp-n{width:100%;padding:16px 20px;border-radius:18px;border:1.5px solid #E5E2DD;background:#FFFFFF;font-size:15px;font-family:'DM Sans',sans-serif;color:#1C1917;outline:none;transition:all .18s;font-weight:500;}
.inp-n:focus{border-color:#292524;box-shadow:0 0 0 4px #F0EDE8;}
.btn-dark{background:linear-gradient(135deg,#44403C 0%,#1C1917 100%);color:#fff;border:none;border-radius:100px;padding:16px 32px;font-size:15px;font-weight:700;font-family:'DM Sans',sans-serif;cursor:pointer;width:100%;transition:all .18s;touch-action:manipulation;-webkit-tap-highlight-color:transparent;}
.btn-dark:active{transform:scale(.97);}
.btn-n{background:#FFFFFF;color:#6B6862;border:1.5px solid #E5E2DD;border-radius:100px;padding:15px 32px;font-size:15px;font-weight:600;font-family:'DM Sans',sans-serif;cursor:pointer;width:100%;touch-action:manipulation;-webkit-tap-highlight-color:transparent;}
.typing{display:flex;gap:5px;padding:12px 16px;align-items:center;}
.dot{width:6px;height:6px;border-radius:50%;background:${C.textLight};animation:bounce 1.3s infinite;}
.dot:nth-child(2){animation-delay:.18s}.dot:nth-child(3){animation-delay:.36s}
@keyframes bounce{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-5px)}}
@keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(76,217,100,.5)}70%{box-shadow:0 0 0 6px rgba(76,217,100,0)}}
@keyframes sosPulse{0%,100%{box-shadow:0 0 0 0 rgba(192,120,144,.4),0 2px 10px rgba(192,120,144,.13)}60%{box-shadow:0 0 0 7px rgba(192,120,144,0),0 2px 10px rgba(192,120,144,.13)}}
.lbl{font-size:10px;font-weight:700;color:${C.textLight};letter-spacing:1px;text-transform:uppercase;display:block;margin-bottom:10px;}
@media(min-width:768px){
  .app{max-width:1100px;display:flex;flex-direction:row;min-height:100vh;}
  .bnav{display:none !important;}
  .fi{animation:none;}
}
`;

const Ico=({d,size=24,stroke=C.textLight,sw=1.7})=>(
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    {Array.isArray(d)?d.map((p,i)=><path key={i} d={p}/>):<path d={d}/>}
  </svg>
);
const I={
  home:["M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z","M9 21V12h6v9"],
  edit:"M17 3a2.83 2.83 0 014 4L7.5 20.5 2 22l1.5-5.5L17 3z",
  trash:["M3 6h18","M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6","M8 6V4a1 1 0 011-1h6a1 1 0 011 1v2"],
  journal:["M4 4h16v16H4z","M8 8h8","M8 12h8","M8 16h5"],
  chart:["M18 20V10","M12 20V4","M6 20v-6"],
  library:["M4 19.5A2.5 2.5 0 016.5 17H20","M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"],
  chat:"M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z",
  heart:"M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z",
  leaf:["M12 22V11","M12 11C12 11 5 9 5 3c4 0 7 3 7 8z","M12 11C12 11 19 9 19 3c-4 0-7 3-7 8z"],
  shield:"M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  zap:"M13 2L3 14h9l-1 8 10-12h-9l1-8z",
  send:["M22 2L11 13","M22 2L15 22l-4-9-9-4 22-7z"],
  plus:["M12 5v14","M5 12h14"],
  back:"M19 12H5 M12 19l-7-7 7-7",
  x:["M18 6L6 18","M6 6l12 12"],
  spark:"M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z",
  check:"M20 6L9 17l-5-5",
  chev:"M9 18l6-6-6-6",
  flame:"M12 2c0 0-5 5.5-5 10a5 5 0 0010 0c0-4.5-5-10-5-10z",
  trophy:["M8 21h8","M12 17v4","M5 3h14l-1 7a6 6 0 01-12 0L5 3z","M3 7h2","M19 7h2"],
  book:["M4 19.5A2.5 2.5 0 016.5 17H20","M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"],
  camera:["M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z","M12 17a4 4 0 100-8 4 4 0 000 8z"],
  target:["M12 22a10 10 0 100-20 10 10 0 000 20z","M12 16a4 4 0 100-8 4 4 0 000 8z","M12 12h.01"],
  wind:["M17.7 7.7a2.5 2.5 0 111.8 4.3H2","M9.6 4.6A2 2 0 1111 8H2","M12.6 19.4A2 2 0 1014 16H2"],
  search:["M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"],
  user:["M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2","M12 11a4 4 0 100-8 4 4 0 000 8z"],
  mail:["M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z","M22 6l-10 7L2 6"],
  lockIco:["M19 11H5a2 2 0 00-2 2v7a2 2 0 002 2h14a2 2 0 002-2v-7a2 2 0 00-2-2z","M17 11V7a5 5 0 00-10 0v4"],
};

const PORUKE_DANA=[
  "Svaki dan bez čačkanja je pobeda — čak i kada se čini mala.",
  "Tvoje ruke mogu naučiti nove navike. Strpljenje je ključ.",
  "Impuls prolazi. Ti ostaješ.",
  "Nije bitno koliko puta si pao, već koliko puta si ustao.",
  "Telo te nosi — daj mu malo ljubaznosti danas.",
  "Jedan trenutak odoljevanja gradi sledeći.",
  "Primetiti okidač je već polovina posla.",
  "Briga o sebi nije sebičnost — to je hrabrost.",
  "Progres nije linearan. I to je u redu.",
  "Tvoj mozak se menja svaki put kada odoluješ impulsu.",
  "Danas je novi dan, nova šansa.",
  "Ono što osećaš je stvarno. I proći će.",
  "Ne moraš biti savršen/a da bi napravio/la napredak.",
  "Traženje pomoći je snaga, ne slabost.",
  "Svaka vatrica je dokaz tvoje snage.",
  "Pauziranje pre reakcije — to je supermoć.",
  "Tvoje ruke zaslužuju nežnost.",
  "Malo bolje svaki dan — to je sve što treba.",
  "Okidači su informacije, ne presude.",
  "Prava promena se gradi u tihim trenucima.",
  "Ne boriš se sama/sam.",
  "Svaki impuls koji prođe slabi sledeći.",
  "Imaš više snage nego što misliš.",
  "Zaustavi se, udahni, izdrži.",
  "Danas možeš odabrati drugačije.",
  "Put ozdravljenja nije pravan — i to je normalno.",
  "Telo pamti brigu. Pokloni mu je danas.",
  "Jedna sekunda odoljevanja vodi drugu.",
  "Krenuo/la si. To je najteži korak.",
  "Nisi definisan/a navikom — ti je menjаš.",
];
const EMOCIJE=[["😰","Anksiozna"],["😢","Tužna"],["😤","Ljuta"],["😶","Utrnula"],["😴","Umorna"],["😐","Neutralna"],["😌","Mirna"],["😊","Dobro"]];
const LOK=["🛋️ Dnevna","🛁 Kupatilo","🍳 Kuhinja","🛏️ Spavaća","💼 Posao","🚗 Auto","🌳 Napolju","📱 Krevet"];
const OKI=["Stres","Umor","Ogledalo","Dosada","Ekrani","Tuga","Učenje","Jelo","Ostalo"];

const SAT="env(safe-area-inset-top,0px)";
const HDR_PT=isPWA?"max(64px,env(safe-area-inset-top,0px))":"max(16px,env(safe-area-inset-top,0px))";
function safeParseOk(v){if(!v)return[];try{const p=JSON.parse(v);return Array.isArray(p)?p:[v];}catch{return v?[v]:[];}}
function validEmail(e){return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);}

function calcStreak(entries, registeredAt){
  const todayMidnight=new Date();todayMidnight.setHours(0,0,0,0);
  const bad=entries.filter(e=>e.ts&&(e.ish==="try"||e.ish==="ep"));
  let refMidnight;
  if(bad.length>0){
    refMidnight=new Date(Math.max(...bad.map(e=>e.ts)));
  }else{
    refMidnight=registeredAt?new Date(registeredAt):new Date();
  }
  refMidnight.setHours(0,0,0,0);
  return Math.max(0,Math.floor((todayMidnight-refMidnight)/86400000));
}

const IcoField=({ico,children,err})=>(
  <div style={{position:"relative"}}>
    <div style={{position:"absolute",left:15,top:"50%",transform:"translateY(-50%)",pointerEvents:"none",display:"flex",zIndex:1}}>
      <Ico d={ico} size={16} stroke={err?C.red:C.primary} sw={1.7}/>
    </div>
    {children}
  </div>
);
const FldLabel=({children})=>(
  <span style={{fontSize:10,fontWeight:700,color:C.textLight,letterSpacing:2,textTransform:"uppercase",display:"block",marginBottom:8,paddingLeft:1}}>{children}</span>
);

const EyeBtn=({show,toggle})=>(
  <button type="button" onClick={toggle} style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:show?C.primary:C.textLight,padding:4,lineHeight:1,display:"flex",alignItems:"center",justifyContent:"center"}}>
    {show
      ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
      : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
    }
  </button>
);

function Auth({onDone}){
  const [mode,setMode]=useState("w");
  const [ime,setIme]=useState("");const [em,setEm]=useState("");const [loz,setLoz]=useState("");const [loz2,setLoz2]=useState("");
  const [pol,setPol]=useState("");
  const [errs,setErrs]=useState({});const [loading,setLoading]=useState(false);
  const [showLoz,setShowLoz]=useState(false);const [showLoz2,setShowLoz2]=useState(false);
  const [uspeh,setUspeh]=useState("");
  function reset(){setErrs({});setUspeh("");}

  if(mode==="w") return(
    <div className="fi" style={{height:"100dvh",background:C.bg,display:"flex",flexDirection:"column",overflow:"hidden"}}>
      <div style={{flex:1,minHeight:0,overflowY:"auto"}}>
        <div style={{minHeight:"100%",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center",paddingTop:`max(32px,${SAT})`,paddingLeft:28,paddingRight:28,paddingBottom:16}}>
          <div style={{width:52,height:52,borderRadius:16,background:C.primaryGrad,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 8px 24px rgba(192,120,144,.28)`,marginBottom:12,flexShrink:0}}>
            <Ico d={I.leaf} size={22} stroke="#fff" sw={1.8}/>
          </div>
          <p style={{fontSize:10,fontWeight:700,letterSpacing:3,textTransform:"uppercase",color:C.textLight,marginBottom:6}}>Unpick</p>
          <h1 style={{fontSize:24,lineHeight:1.3,marginBottom:6,letterSpacing:-0.2,color:C.text,fontFamily:"'DM Sans',sans-serif",fontWeight:700}}>
            Your skin<br/><span style={{color:C.primary,fontWeight:800}}>deserves kindness.</span>
          </h1>
          <p style={{fontSize:13,color:C.textMid,lineHeight:1.55,fontWeight:500,marginBottom:16}}>Prati obrasce, pronađi okidače, reaguj u kriznim trenucima.</p>
          <div style={{width:"100%",display:"flex",flexDirection:"column",gap:6,textAlign:"left"}}>
            {[[I.chart,"Praćenje epizoda","Beleži epizode i prati obrasce"],[I.wind,"SOS alat u krizi","Tehnike za smirenje u trenutku"],[I.chat,"Mia — AI podrška","Uvek dostupna, bez osude"]].map(([ico,t,sub])=>(
              <div key={t} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 14px",borderRadius:16,background:C.bgCard,border:`1.5px solid ${C.border}`,boxShadow:`0 2px 8px ${C.shadow}`}}>
                <div style={{width:36,height:36,borderRadius:11,background:C.primaryGrad,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  <Ico d={ico} size={16} stroke="#fff" sw={1.8}/>
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <p style={{fontWeight:700,fontSize:13,color:C.text,marginBottom:1}}>{t}</p>
                  <p style={{fontSize:11,color:C.textLight,fontWeight:500}}>{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{padding:"14px 28px calc(28px + env(safe-area-inset-bottom,0px))",display:"flex",flexDirection:"column",gap:10,flexShrink:0,background:C.bg}}>
        <button onClick={()=>{setMode("r");reset();}} className="btn-p">Počni</button>
        <button onClick={()=>{setMode("l");reset();}} className="btn-o">Već imam nalog</button>
      </div>
    </div>
  );

  const isL=mode==="l";

  function validate(){
    const e={};
    if(!isL&&!ime.trim()) e.ime="Ime je obavezno.";
    else if(!isL&&ime.trim().length<2) e.ime="Ime mora imati najmanje 2 karaktera.";
    if(!isL&&!pol) e.pol="Odaberi pol.";
    if(!em.trim()) e.em="Email adresa je obavezna.";
    else if(!validEmail(em)) e.em="Unesite ispravnu email adresu.";
    if(!loz) e.loz="Lozinka je obavezna.";
    else if(loz.length<6) e.loz="Lozinka mora imati najmanje 6 karaktera.";
    if(!isL&&loz&&loz2!==loz) e.loz2="Lozinke se ne poklapaju.";
    return e;
  }

  function prevErr(key,hint){
    if(errs[key]) return <p style={{color:C.red,fontSize:12,fontWeight:600,paddingLeft:4,marginTop:4}}>{errs[key]}</p>;
    if(hint) return <p style={{color:C.textLight,fontSize:12,fontWeight:500,paddingLeft:4,marginTop:4}}>{hint}</p>;
    return null;
  }

  async function handleSubmit(){
    const v=validate();
    if(Object.keys(v).length){setErrs(v);return;}
    setErrs({});setLoading(true);setUspeh("");
    try{
      if(isL){
        const {data,error}=await supabase.auth.signInWithPassword({email:em.trim(),password:loz});
        if(error){
          if(error.message.includes("Invalid login")) setErrs({general:"Pogrešan email ili lozinka. Pokušaj ponovo."});
          else if(error.message.includes("Email not confirmed")) setErrs({general:"Potvrdi email adresu pre prijave."});
          else setErrs({general:"Prijava nije uspela. Pokušaj ponovo."});
          return;
        }
        const {data:profile}=await supabase.from("profiles").select("ime").eq("id",data.user.id).single();
        onDone({ime:profile?.ime||data.user.user_metadata?.name||em,registeredAt:data.user.created_at,id:data.user.id});
      }else{
        const res=await supabase.auth.signUp({email:em.trim(),password:loz,options:{data:{name:ime.trim(),pol}}});
        const data=res.data;const error=res.error;
        if(error){
          const msg=error.message||"";
          if(msg.includes("already registered")||msg.includes("already exists")||msg.includes("User already registered")) setErrs({em:"Nalog sa ovim emailom već postoji."});
          else if(msg.includes("rate limit")||msg.includes("security purposes")) setErrs({general:"Sačekaj trenutak pa pokušaj ponovo."});
          else if(msg.includes("Password")) setErrs({loz:msg});
          else if(msg.includes("valid email")||msg.includes("email")) setErrs({em:msg});
          else setErrs({general:`Greška pri registraciji: ${msg}`});
          return;
        }
        const user=data?.user??null;
        const session=data?.session??null;
        if(user) supabase.from("profiles").upsert({id:user.id,ime:ime.trim()}).then(null,()=>{});
        if(session && user){
          onDone({ime:ime.trim(),registeredAt:user.created_at,id:user.id});
        }else{
          setUspeh("Proveri email i potvrdi nalog, pa se prijavi.");
          setTimeout(()=>{setMode("l");setUspeh("");setLoz("");setLoz2("");},4000);
        }
      }
    }catch(e){
      console.error("Auth error:",e);
      setErrs({general:`Greška: ${e?.message||String(e)}`});
    }finally{setLoading(false);}
  }

  const inpStyle=(key)=>({borderColor:errs[key]?"#C46878":undefined});
  const dis=loading||!!uspeh;

  return(
    <div className="fi" style={{height:"100dvh",background:"linear-gradient(160deg,#FFF8FA 0%,#FAE0EB 55%,#F2CCDA 100%)",display:"flex",flexDirection:"column",overflow:"hidden",position:"relative"}}>
      {/* Botanical decoration */}
      <svg viewBox="0 0 200 300" fill="none" style={{position:"absolute",top:0,right:-8,width:195,height:285,opacity:.16,pointerEvents:"none",zIndex:0}}>
        <path d="M115 8 C122 55 102 105 90 158 C78 210 84 258 76 298" stroke={C.primaryDark} strokeWidth="1.1" strokeLinecap="round"/>
        <ellipse cx="64" cy="88" rx="26" ry="12" transform="rotate(-33 64 88)" fill={C.primaryDark}/>
        <ellipse cx="122" cy="52" rx="22" ry="10" transform="rotate(26 122 52)" fill={C.primaryDark}/>
        <ellipse cx="132" cy="128" rx="24" ry="11" transform="rotate(-20 132 128)" fill={C.primaryDark}/>
        <ellipse cx="60" cy="170" rx="20" ry="9" transform="rotate(-45 60 170)" fill={C.primaryDark}/>
        <ellipse cx="95" cy="220" rx="18" ry="8" transform="rotate(16 95 220)" fill={C.primaryDark}/>
        <ellipse cx="80" cy="138" rx="14" ry="6" transform="rotate(38 80 138)" fill={C.primaryDark} opacity=".6"/>
        <circle cx="115" cy="8" r="2.5" fill={C.primaryDark}/>
      </svg>

      {/* Top branding */}
      <div style={{position:"relative",zIndex:1,paddingTop:isPWA?HDR_PT:"max(18px,env(safe-area-inset-top,0px))",paddingLeft:24,paddingRight:24,paddingBottom:22,flexShrink:0}}>
        <button type="button" onClick={()=>{setMode("w");reset();setIme("");setEm("");setLoz("");setLoz2("");setPol("");}} style={{background:"none",border:"none",cursor:"pointer",display:"flex",alignItems:"center",gap:6,color:C.textMid,fontSize:13,fontWeight:600,fontFamily:"'DM Sans',sans-serif",marginBottom:20,padding:0,touchAction:"manipulation",opacity:.75}}>
          <Ico d={I.back} size={15} stroke={C.textMid} sw={2}/> Nazad
        </button>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
          <div style={{width:38,height:38,borderRadius:12,background:C.primaryGrad,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 4px 14px rgba(192,120,144,.28)`,flexShrink:0}}>
            <Ico d={I.leaf} size={17} stroke="#fff" sw={1.8}/>
          </div>
          <span style={{fontSize:10,fontWeight:800,color:C.primaryDark,letterSpacing:3,textTransform:"uppercase",opacity:.6}}>Unpick</span>
        </div>
        <h2 className="serif" style={{fontSize:38,letterSpacing:-.5,color:C.text,marginBottom:5,fontWeight:400,lineHeight:1.15}}>{isL?"Dobrodošla\nnazad":"Napravi\nnalog"}</h2>
        <p style={{color:C.textMid,fontSize:13,fontWeight:500,opacity:.8}}>{isL?"Nastavi odakle si stala.":"Besplatno. Bez osude."}</p>
      </div>

      {/* White card */}
      <div style={{flex:1,position:"relative",zIndex:1,background:"#fff",borderRadius:"30px 30px 0 0",overflowY:"auto",padding:"26px 22px calc(40px + env(safe-area-inset-bottom,0px))"}}>
        <div style={{display:"flex",flexDirection:"column",gap:16}}>
          {errs.general&&<div style={{background:"#FEF2F2",borderRadius:14,padding:"12px 16px",border:"1px solid #FCA5A5"}}><p style={{color:"#991B1B",fontSize:13,fontWeight:600,textAlign:"center"}}>{errs.general}</p></div>}
          {uspeh&&<div style={{background:"#F0FDF4",borderRadius:14,padding:"12px 16px",border:"1px solid #86EFAC"}}><p style={{color:"#166534",fontSize:13,fontWeight:600,textAlign:"center"}}>{uspeh}</p></div>}

          {!isL&&<div>
            <FldLabel>Ime</FldLabel>
            <IcoField ico={I.user} err={!!errs.ime}>
              <input className="inp-el" placeholder="Tvoje ime" value={ime} onChange={e=>{setIme(e.target.value);if(errs.ime)setErrs(v=>({...v,ime:""}));}} style={{paddingLeft:46,...(errs.ime?{boxShadow:`0 0 0 2px ${C.red}`}:{})}} autoComplete="given-name"/>
            </IcoField>
            {prevErr("ime")}
          </div>}

          {!isL&&<div>
            <FldLabel>Pol</FldLabel>
            <div style={{display:"flex",background:"#F5EEF1",borderRadius:16,padding:4}}>
              {[["M","Muško","♂"],["Z","Žensko","♀"]].map(([v,l,sym])=>(
                <button key={v} type="button" onClick={()=>{setPol(v);if(errs.pol)setErrs(e=>({...e,pol:""}));}} style={{flex:1,padding:"11px 0",borderRadius:13,border:"none",background:pol===v?"#fff":"transparent",color:pol===v?C.primaryDark:C.textMid,fontWeight:pol===v?700:500,fontSize:13,display:"flex",flexDirection:"column",alignItems:"center",gap:3,cursor:"pointer",transition:"all .2s",fontFamily:"'DM Sans',sans-serif",boxShadow:pol===v?`0 2px 10px rgba(192,120,144,.15)`:undefined}}>
                  <span style={{fontSize:20,lineHeight:1}}>{sym}</span>
                  <span>{l}</span>
                </button>
              ))}
            </div>
            {prevErr("pol")}
          </div>}

          <div>
            <FldLabel>Email</FldLabel>
            <IcoField ico={I.mail} err={!!errs.em}>
              <input className="inp-el" placeholder="tvoj@email.com" value={em} onChange={e=>{setEm(e.target.value);if(errs.em)setErrs(v=>({...v,em:""}));}} type="email" autoComplete="email" inputMode="email" style={{paddingLeft:46,...(errs.em?{boxShadow:`0 0 0 2px ${C.red}`}:{})}}/>
            </IcoField>
            {prevErr("em")}
          </div>

          <div>
            <FldLabel>Lozinka</FldLabel>
            <IcoField ico={I.lockIco} err={!!errs.loz}>
              <input className="inp-el" type={showLoz?"text":"password"} placeholder="••••••••" value={loz} onChange={e=>{setLoz(e.target.value);if(errs.loz)setErrs(v=>({...v,loz:""}));}} autoComplete={isL?"current-password":"new-password"} style={{paddingLeft:46,paddingRight:44,...(errs.loz?{boxShadow:`0 0 0 2px ${C.red}`}:{})}}/>
              <EyeBtn show={showLoz} toggle={()=>setShowLoz(v=>!v)}/>
            </IcoField>
            {prevErr("loz",!isL?"Najmanje 6 karaktera":null)}
          </div>

          {!isL&&<div>
            <FldLabel>Ponovi lozinku</FldLabel>
            <IcoField ico={I.lockIco} err={!!errs.loz2}>
              <input className="inp-el" type={showLoz2?"text":"password"} placeholder="••••••••" value={loz2} onChange={e=>{setLoz2(e.target.value);if(errs.loz2)setErrs(v=>({...v,loz2:""}));}} autoComplete="new-password" style={{paddingLeft:46,paddingRight:44,...(errs.loz2?{boxShadow:`0 0 0 2px ${C.red}`}:{})}}/>
              <EyeBtn show={showLoz2} toggle={()=>setShowLoz2(v=>!v)}/>
            </IcoField>
            {prevErr("loz2")}
          </div>}

          <button type="button" disabled={dis} className="btn-p" style={{opacity:dis?0.55:1,cursor:dis?"default":"pointer",touchAction:"manipulation",marginTop:4,display:"flex",alignItems:"center",justifyContent:"center",gap:8}} onTouchStart={e=>{e.preventDefault();if(!dis)handleSubmit();}} onClick={()=>{if(!dis)handleSubmit();}}>
            {loading?"Molimo sačekajte...":(isL?"Prijavi se":"Registruj se")}
            {!loading&&<span style={{fontSize:18,lineHeight:1}}>→</span>}
          </button>

          <p style={{textAlign:"center",fontSize:14,color:C.textLight,fontWeight:500}}>
            {isL?"Nemaš nalog? ":"Već imaš nalog? "}
            <button type="button" onClick={()=>{setMode(isL?"r":"l");reset();setLoz("");setLoz2("");setPol("");}} style={{background:"none",border:"none",cursor:"pointer",color:C.primary,fontSize:14,fontWeight:700,fontFamily:"'DM Sans',sans-serif",padding:0,touchAction:"manipulation",textDecoration:"underline",textUnderlineOffset:3}}>
              {isL?"Registruj se":"Prijavi se"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}


function Mehurici({onDone}){
  const emojiji=["💗","🌸","✨","💜","🌺","💫","🦋","🌷","🍀","🌙","⭐","🌈"];
  const novi=()=>Array.from({length:12},(_,i)=>({id:i,e:emojiji[i],p:false}));
  const [ms,setMs]=useState(novi);
  const [n,setN]=useState(0);
  const svi=ms.every(m=>m.p);
  const pop=(id)=>{setMs(v=>v.map(x=>x.id===id?{...x,p:true}:x));setN(v=>v+1);};
  return(
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:20}}>
      <p style={{fontSize:14,color:C.textMid,fontWeight:500,textAlign:"center"}}>Pritisni svaki mehurić da ga prskneš! 🫧</p>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,width:"100%",padding:"20px",background:`linear-gradient(135deg,${C.primaryLight} 0%,${C.amberLight} 100%)`,borderRadius:28}}>
        {ms.map(m=>(
          <button key={m.id} onClick={()=>!m.p&&pop(m.id)} style={{aspectRatio:"1",borderRadius:"50%",background:m.p?"transparent":C.bgCard,border:m.p?"none":`2px solid ${C.primary}44`,fontSize:m.p?28:26,cursor:m.p?"default":"pointer",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:m.p?"none":`0 4px 14px rgba(192,120,144,.22)`,transition:"all .15s",transform:m.p?"scale(1.3)":"scale(1)",opacity:m.p?0.3:1}}>
            {m.e}
          </button>
        ))}
      </div>
      <div style={{display:"flex",alignItems:"center",gap:8}}>
        <span style={{fontSize:22,fontWeight:700,color:C.primary}}>{n}</span>
        <span style={{fontSize:14,color:C.textLight,fontWeight:500}}>/ {ms.length} prsnuto</span>
      </div>
      {svi?(
        <div style={{textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",gap:12}}>
          <span style={{fontSize:48}}>🎉</span>
          <p style={{fontWeight:700,color:C.primaryDark,fontSize:16}}>Sve si prsnula!</p>
          <button className="btn-p" style={{width:"auto",padding:"13px 36px"}} onClick={onDone}>Osećam se bolje ✨</button>
        </div>
      ):<button style={{background:"none",border:`1.5px solid ${C.border}`,borderRadius:100,padding:"10px 24px",fontSize:13,color:C.textMid,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}} onClick={()=>{setMs(novi());setN(0);}}>Još jednom 🔄</button>}
    </div>
  );
}

function Boje({onDone}){
  const PAR=[
    {id:0,c:"#C07890"},{id:1,c:"#7A9E78"},{id:2,c:"#C4A870"},
    {id:3,c:"#8BA7B8"},{id:4,c:"#B08878"},{id:5,c:"#D4A0A8"},
  ];
  const [karte]=useState(()=>[...PAR,...PAR].map((b,i)=>({...b,uid:i})).sort(()=>Math.random()-0.5));
  const [otkr,setOtkr]=useState([]);
  const [pogod,setPogod]=useState([]);
  const [blok,setBlok]=useState(false);
  const [potezi,setPotezi]=useState(0);
  const sve=pogod.length===PAR.length;

  function tap(uid){
    if(blok||otkr.includes(uid)||pogod.includes(karte.find(k=>k.uid===uid)?.id)) return;
    const nov=[...otkr,uid];
    setOtkr(nov);
    if(nov.length===2){
      setPotezi(v=>v+1);
      const [a,b]=nov.map(u=>karte.find(k=>k.uid===u));
      if(a.id===b.id){setPogod(v=>[...v,a.id]);setOtkr([]);}
      else{setBlok(true);setTimeout(()=>{setOtkr([]);setBlok(false);},700);}
    }
  }
  function isPog(uid){return pogod.includes(karte.find(k=>k.uid===uid)?.id);}
  function isVid(uid){return otkr.includes(uid)||isPog(uid);}

  return(
    <div style={{display:"flex",flexDirection:"column",gap:16}}>
      <p style={{fontSize:13,color:C.textMid,fontWeight:500,textAlign:"center"}}>Pronađi svaki par boja</p>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10}}>
        {karte.map(k=>{
          const vid=isVid(k.uid);const pog=isPog(k.uid);
          return(
            <button key={k.uid} onClick={()=>tap(k.uid)} style={{
              aspectRatio:"1",borderRadius:18,cursor:vid?"default":"pointer",
              background:vid?k.c:C.bgCard,
              border:`2px solid ${pog?k.c:vid?k.c+"99":C.border}`,
              boxShadow:pog?`0 4px 16px ${k.c}55`:vid?`0 2px 8px ${k.c}33`:`0 2px 6px ${C.shadow}`,
              transition:"all .25s",opacity:pog?0.65:1,
            }}/>
          );
        })}
      </div>
      <div style={{display:"flex",justifyContent:"space-between",padding:"0 2px"}}>
        <span style={{fontSize:13,color:C.textLight,fontWeight:500}}>Potezi: <span style={{color:C.primary,fontWeight:700}}>{potezi}</span></span>
        <span style={{fontSize:13,color:C.textLight,fontWeight:500}}>{pogod.length}/{PAR.length} parova</span>
      </div>
      {sve&&(
        <div style={{textAlign:"center",display:"flex",flexDirection:"column",gap:10}}>
          <p style={{fontSize:14,color:C.textMid,fontWeight:500}}>Pronašla si sve parove u <strong style={{color:C.primary}}>{potezi}</strong> {potezi===1?"potezu":"poteza"} 🌸</p>
          <button className="btn-p" onClick={onDone}>Osećam se bolje ✨</button>
        </div>
      )}
    </div>
  );
}

function SOS({onZatvori}){
  const [faza,setFaza]=useState("izb");const [alat,setAlat]=useState(null);
  const [ishod,setIshod]=useState(null);const [dk,setDk]=useState(0);const [tajmer,setTajmer]=useState(300);const [tAkt,setTAkt]=useState(false);
  const [disSek,setDisSek]=useState(4);
  const ref=useRef(null);const acRef=useRef(null);
  async function playBeep(freq,dur,vol){
    try{
      const ctx=acRef.current;if(!ctx)return;
      if(ctx.state==="suspended")await ctx.resume();
      const o=ctx.createOscillator();const g=ctx.createGain();
      o.connect(g);g.connect(ctx.destination);
      o.frequency.value=freq;
      g.gain.setValueAtTime(vol,ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+dur);
      o.start();o.stop(ctx.currentTime+dur);
    }catch{}
  }
  useEffect(()=>{
    if(tAkt&&tajmer>0)ref.current=setInterval(()=>setTajmer(t=>t-1),1000);
    if(tAkt&&tajmer===0){
      playBeep(520,0.15,0.35);
      setTimeout(()=>playBeep(660,0.15,0.35),150);
      setTimeout(()=>playBeep(520,0.5,0.35),300);
    }
    return()=>clearInterval(ref.current);
  },[tAkt,tajmer]);
  useEffect(()=>{
    if(!tAkt||tajmer<=0||tajmer>5)return;
    playBeep(660,0.08,0.2);
  },[tajmer]);
  useEffect(()=>{
    if(alat!=="dis"||faza!=="alat")return;
    const dur=[4,7,8][dk%3];setDisSek(dur);
    const id=setInterval(()=>setDisSek(s=>s-1),1000);
    return()=>clearInterval(id);
  },[dk,alat,faza]);
  useEffect(()=>{if(disSek<=0&&alat==="dis"&&faza==="alat")setDk(d=>d+1);},[disSek]);
  const fmt=s=>`${Math.floor(s/60)}:${String(s%60).padStart(2,"0")}`;
  const W=({ch})=><div style={{minHeight:"100vh",paddingTop:`max(32px,${SAT})`,paddingLeft:24,paddingRight:24,paddingBottom:48,background:C.bg}} className="fi">{ch}</div>;
  const XBtn=()=><div style={{display:"flex",justifyContent:"flex-end",marginBottom:24}}><button style={{background:C.bgMuted,border:"none",borderRadius:50,width:40,height:40,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}} onClick={onZatvori}><Ico d={I.x} size={16} stroke={C.textMid} sw={2}/></button></div>;
  const ALATI=[
    {id:"dis", emoji:"🫁", l:"Vežba disanja",   op:"4-7-8 tehnika",           c:C.primary,  bg:C.primaryLight},
    {id:"taj", emoji:"⏱️", l:"Čekaj 5 minuta",  op:"Impulsi prolaze",         c:C.amber,    bg:C.amberLight},
    {id:"uzem",emoji:"🌱", l:"Uzemljenje",       op:"5-4-3-2-1 tehnika",      c:C.green,    bg:C.greenLight},
    {id:"ruke",emoji:"🤲", l:"Zaposli ruke",     op:"Alternativne aktivnosti", c:C.amber,    bg:C.amberLight},
    {id:"meh", emoji:"🫧", l:"Prsni mehuriće",   op:"Igrica za distrakciju",  c:C.primary,  bg:C.primaryLight},
    {id:"boj", emoji:"🎨", l:"Igra boja",        op:"Igrica za distrakciju",  c:C.green,    bg:C.greenLight},
  ];

  if(faza==="izb") return(
    <div style={{minHeight:"100vh",background:C.bg}} className="fi">
      {/* Header */}
      <div style={{paddingTop:HDR_PT,paddingLeft:20,paddingRight:20,paddingBottom:16,display:"flex",alignItems:"center",gap:14,borderBottom:`1px solid ${C.border}`,background:C.bgCard,position:"sticky",top:0,zIndex:10}}>
        <div style={{width:40,height:40,borderRadius:14,background:C.primaryLight,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:20}}>🌿</div>
        <div style={{flex:1}}>
          <h2 style={{fontSize:18,fontWeight:700,color:C.text,letterSpacing:-0.3,fontFamily:"'DM Sans',sans-serif",lineHeight:1,marginBottom:2}}>Hajde, polako</h2>
          <p style={{fontSize:12,color:C.textLight,fontWeight:500}}>Odaberi šta ti pomaže sada</p>
        </div>
        <button style={{background:C.bgMuted,border:"none",borderRadius:50,width:36,height:36,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0}} onClick={onZatvori}>
          <Ico d={I.x} size={15} stroke={C.textMid} sw={2.5}/>
        </button>
      </div>

      <div style={{padding:"20px 20px 48px",display:"flex",flexDirection:"column",gap:10}}>
        <p style={{fontSize:11,fontWeight:800,color:C.textLight,letterSpacing:1.5,textTransform:"uppercase",marginBottom:4}}>Tehnike smirenja</p>
        {ALATI.slice(0,4).map(a=>(
          <button key={a.id} onClick={()=>{setAlat(a.id);setFaza("alat")}} style={{background:C.bgCard,border:`1.5px solid ${C.border}`,borderRadius:20,padding:"14px 16px",cursor:"pointer",display:"flex",alignItems:"center",gap:14,textAlign:"left",boxShadow:`0 2px 8px ${C.shadow}`,fontFamily:"inherit"}}>
            <div style={{width:48,height:48,borderRadius:16,background:a.bg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:22}}>{a.emoji}</div>
            <div style={{flex:1}}>
              <p style={{fontWeight:700,fontSize:15,color:C.text,marginBottom:2}}>{a.l}</p>
              <p style={{fontSize:12,color:C.textLight,fontWeight:500}}>{a.op}</p>
            </div>
            <Ico d={I.chev} size={16} stroke={C.textLight} sw={2}/>
          </button>
        ))}
        <p style={{fontSize:11,fontWeight:800,color:C.textLight,letterSpacing:1.5,textTransform:"uppercase",marginTop:10,marginBottom:4}}>Igrice za distrakciju</p>
        <div style={{display:"flex",gap:10}}>
          {ALATI.slice(4).map(a=>(
            <button key={a.id} onClick={()=>{setAlat(a.id);setFaza("alat")}} style={{flex:1,background:C.bgCard,border:`1.5px solid ${C.border}`,borderRadius:20,padding:"16px 12px",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:8,textAlign:"center",boxShadow:`0 2px 8px ${C.shadow}`,fontFamily:"inherit"}}>
              <div style={{width:52,height:52,borderRadius:16,background:a.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24}}>{a.emoji}</div>
              <p style={{fontWeight:700,fontSize:13,color:C.text,lineHeight:1.3}}>{a.l}</p>
              <p style={{fontSize:11,color:C.textLight,fontWeight:500}}>{a.op}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  if(faza==="alat"){
    const kor=[{l:"Udahni...",d:4,c:C.primary},{l:"Zadrži...",d:7,c:C.amber},{l:"Izdahni...",d:8,c:C.green}];
    const BackBtn=()=>(
      <button style={{display:"flex",alignItems:"center",gap:6,background:"none",border:"none",cursor:"pointer",color:C.textMid,fontSize:13,fontWeight:600,fontFamily:"inherit",padding:"0 0 8px"}} onClick={()=>setFaza("izb")}>
        <Ico d={I.back} size={16} stroke={C.textMid} sw={2}/> Nazad
      </button>
    );
    const ToolHdr=({emoji,title})=>(
      <div style={{paddingTop:HDR_PT,paddingLeft:20,paddingRight:20,paddingBottom:14,display:"flex",alignItems:"center",gap:12,borderBottom:`1px solid ${C.border}`,background:C.bgCard,position:"sticky",top:0,zIndex:10}}>
        <button style={{background:"none",border:"none",cursor:"pointer",padding:4,flexShrink:0}} onClick={()=>setFaza("izb")}><Ico d={I.back} size={20} stroke={C.textMid} sw={2}/></button>
        <span style={{fontSize:20,flexShrink:0}}>{emoji}</span>
        <h3 style={{fontSize:17,fontWeight:700,color:C.text,letterSpacing:-0.2,fontFamily:"'DM Sans',sans-serif",flex:1}}>{title}</h3>
      </div>
    );
    if(alat==="dis"){const cur=kor[dk%3];const prog=Math.max(0,disSek/cur.d);const r=76;const circ=2*Math.PI*r;return(
      <div style={{minHeight:"100vh",background:C.bg}} className="fi">
        <ToolHdr emoji="🫁" title="4 · 7 · 8 Disanje"/>
        <div style={{padding:"24px 20px 48px",display:"flex",flexDirection:"column",alignItems:"center",gap:20}}>
          <p style={{fontSize:13,color:C.textMid,fontWeight:500,textAlign:"center"}}>Prati krug i diši zajedno sa njim</p>
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:16}}>
            <div style={{position:"relative",width:200,height:200}}>
              <svg width={200} height={200} style={{position:"absolute",top:0,left:0,transform:"rotate(-90deg)"}}>
                <circle cx={100} cy={100} r={r} fill="none" stroke={cur.c+"22"} strokeWidth={8}/>
                <circle key={dk} cx={100} cy={100} r={r} fill="none" stroke={cur.c} strokeWidth={8} strokeLinecap="round"
                  strokeDasharray={circ} strokeDashoffset={circ*(1-prog)} style={{transition:"stroke-dashoffset 1s linear,stroke .4s"}}/>
              </svg>
              <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:4}}>
                <span style={{fontSize:52,fontWeight:300,color:cur.c,lineHeight:1}}>{Math.max(disSek,0)}</span>
                <span style={{fontWeight:700,color:cur.c,fontSize:12,letterSpacing:1,textTransform:"uppercase"}}>{cur.l}</span>
              </div>
            </div>
            <div style={{display:"flex",gap:8}}>{kor.map((_,i)=><div key={i} style={{width:8,height:8,borderRadius:"50%",background:i===dk%3?cur.c:C.border,transition:"all .3s"}}/>)}</div>
            <p style={{color:C.textLight,fontSize:12,fontWeight:600,letterSpacing:1}}>KRUG {Math.floor(dk/3)+1}</p>
          </div>
          <div style={{background:C.bgMuted,borderRadius:18,padding:"12px 16px",width:"100%"}}>
            {[["Udahni","4 sekunde","inhale"],["Zadrži","7 sekundi","hold"],["Izdahni","8 sekundi","exhale"]].map(([f,s],i)=>(
              <div key={f} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"6px 0",borderBottom:i<2?`1px solid ${C.border}`:"none"}}>
                <span style={{fontSize:13,fontWeight:dk%3===i?700:500,color:dk%3===i?C.primary:C.textMid}}>{f}</span>
                <span style={{fontSize:12,color:C.textLight,fontWeight:600}}>{s}</span>
              </div>
            ))}
          </div>
          {dk>=3&&<button className="btn-p" onClick={()=>onZatvori()}>Osećam se bolje ✨</button>}
        </div>
      </div>
    );}
    if(alat==="taj"){const TOTAL=300;const prog=tajmer/TOTAL;const r=76;const circ=2*Math.PI*r;const done=tAkt&&tajmer===0;return(
      <div style={{minHeight:"100vh",background:C.bg}} className="fi">
        <ToolHdr emoji="⏱️" title={done?"Uspela si!":"Čekaj malo"}/>
        <div style={{padding:"24px 20px 48px",display:"flex",flexDirection:"column",alignItems:"center",gap:20}}>
          <p style={{fontSize:13,color:C.textMid,fontWeight:500,textAlign:"center"}}>{done?"Impuls je prošao. Budi ponosna 💪":"Impulsi prolaze. Samo 5 minuta."}</p>
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:12}}>
            <div style={{position:"relative",width:200,height:200}}>
              <svg width={200} height={200} style={{position:"absolute",top:0,left:0,transform:"rotate(-90deg)"}}>
                <circle cx={100} cy={100} r={r} fill="none" stroke={done?C.green+"33":C.primary+"22"} strokeWidth={8}/>
                <circle cx={100} cy={100} r={r} fill="none" stroke={done?C.green:C.primary} strokeWidth={8} strokeLinecap="round"
                  strokeDasharray={circ} strokeDashoffset={circ*(1-prog)} style={{transition:"stroke-dashoffset 1s linear,stroke .5s"}}/>
              </svg>
              <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:4}}>
                {done
                  ?<span style={{fontSize:52}}>🌸</span>
                  :<><span style={{fontSize:44,fontWeight:300,color:C.primary,lineHeight:1,fontFamily:"-apple-system,sans-serif"}}>{fmt(tajmer)}</span><span style={{fontSize:11,color:C.textLight,fontWeight:700,letterSpacing:1}}>PREOSTALO</span></>
                }
              </div>
            </div>
            {tAkt&&!done&&<p style={{fontSize:13,color:C.textLight,fontWeight:500}}>Drži se, ide ti odlično 🌿</p>}
          </div>
          {!tAkt&&<button onTouchStart={e=>{e.preventDefault();try{acRef.current=new(window.AudioContext||window.webkitAudioContext)();}catch{}setTAkt(true);}} onClick={()=>{try{acRef.current=new(window.AudioContext||window.webkitAudioContext)();}catch{}setTAkt(true);}} style={{display:"flex",alignItems:"center",justifyContent:"center",gap:10,background:C.primaryGrad,border:"none",borderRadius:100,padding:"18px 48px",fontSize:15,fontWeight:700,color:"#fff",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",boxShadow:`0 6px 24px rgba(192,120,144,.35)`,letterSpacing:0.3}}>
            Pokreni tajmer
          </button>}
          {done&&<button className="btn-p" onTouchStart={e=>{e.preventDefault();onZatvori();}} onClick={()=>onZatvori()}>Nastavi →</button>}
        </div>
      </div>
    );}
    if(alat==="uzem") return(
      <div style={{minHeight:"100vh",background:C.bg}} className="fi">
        <ToolHdr emoji="🌱" title="5-4-3-2-1 Uzemljenje"/>
        <div style={{padding:"20px 20px 48px"}}>
          <p style={{fontSize:13,color:C.textMid,fontWeight:500,marginBottom:16,textAlign:"center"}}>Primeti šta je oko tebe, upravo sada</p>
          {[["👀","5","stvari koje vidiš"],["🤲","4","stvari koje dodiruješ"],["👂","3","zvuka koje čuješ"],["👃","2","mirisa koje osećaš"],["👅","1","ukus koji osetiš"]].map(([em,n,l])=>(
            <div key={l} style={{background:C.bgCard,border:`1.5px solid ${C.border}`,borderRadius:18,padding:"14px 16px",marginBottom:10,display:"flex",alignItems:"center",gap:14,boxShadow:`0 2px 8px ${C.shadow}`}}>
              <span style={{fontSize:24,flexShrink:0}}>{em}</span>
              <div><span style={{fontWeight:700,color:C.green,fontSize:22,fontFamily:"'Playfair Display',serif"}}>{n} </span><span style={{fontSize:13,color:C.textMid,fontWeight:500}}>{l}</span></div>
            </div>
          ))}
          <div style={{height:16}}/><button className="btn-p" onClick={()=>onZatvori()}>Završila sam ✓</button>
        </div>
      </div>
    );
    if(alat==="ruke") return(
      <div style={{minHeight:"100vh",background:C.bg}} className="fi">
        <ToolHdr emoji="🤲" title="Zaposli ruke"/>
        <div style={{padding:"20px 20px 48px"}}>
          <p style={{fontSize:13,color:C.textMid,fontWeight:500,marginBottom:16,textAlign:"center"}}>Probaj nešto od ovoga</p>
          {[["🧴","Nanesite kremu za ruke"],["🧊","Držite kocku leda"],["✊","Pritisnite nokte u dlan"],["🖊️","Klikćite hemijsku"],["🥁","Kuckajte prstima o sto"],["💆","Masirajte sopstvene ruke"]].map(([em,a])=>(
            <div key={a} style={{background:C.bgCard,border:`1.5px solid ${C.border}`,borderRadius:18,padding:"14px 16px",marginBottom:10,display:"flex",alignItems:"center",gap:14,boxShadow:`0 2px 8px ${C.shadow}`}}>
              <span style={{fontSize:22,flexShrink:0}}>{em}</span>
              <span style={{fontSize:14,fontWeight:500,color:C.text}}>{a}</span>
            </div>
          ))}
          <div style={{height:16}}/><button className="btn-p" onClick={()=>onZatvori()}>Probala sam ✓</button>
        </div>
      </div>
    );
    if(alat==="meh") return(
      <div style={{minHeight:"100vh",background:C.bg}} className="fi">
        <ToolHdr emoji="🫧" title="Prsni mehuriće"/>
        <div style={{padding:"20px 20px 48px"}}><Mehurici onDone={()=>onZatvori()}/></div>
      </div>
    );
    if(alat==="boj") return(
      <div style={{minHeight:"100vh",background:C.bg}} className="fi">
        <ToolHdr emoji="🎨" title="Igra boja"/>
        <div style={{padding:"20px 20px 48px"}}><Boje onDone={()=>onZatvori()}/></div>
      </div>
    );
  }

  return(
    <div style={{minHeight:"100vh",paddingTop:`max(40px,${SAT})`,paddingLeft:24,paddingRight:24,paddingBottom:48,background:C.bg,display:"flex",flexDirection:"column",alignItems:"center",gap:16}} className="fi">
      <div style={{textAlign:"center",marginBottom:8}}>
        <div style={{fontSize:44,marginBottom:12}}>💜</div>
        <h2 className="serif" style={{fontSize:28,letterSpacing:-0.3,marginBottom:6}}>Kako je prošlo?</h2>
        <p style={{color:C.textMid,fontSize:14,fontWeight:500}}>Nema pogrešnog odgovora</p>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:10,width:"100%"}}>
        {[["res","✅","Odolela sam impulsu","Neverovatno! Ta snaga je tvoja. 💪",C.green,C.greenLight],
          ["try","💛","Pokušala sam, ali teško","Pokušaj je napredak. Budi blaga prema sebi.",C.amber,C.amberLight],
          ["ep","🫂","Imala sam epizodu","U redu je. Potražila si pomoć — to je važno.",C.red,"#FAEAEA"]
        ].map(([v,em,l,poruka,c,bg])=>(
          <button key={v} onClick={()=>setIshod(v)} style={{width:"100%",padding:"16px 18px",borderRadius:18,border:`2px solid ${ishod===v?c:C.border}`,background:ishod===v?bg:C.bgCard,cursor:"pointer",display:"flex",alignItems:"center",gap:12,transition:"all .16s",boxShadow:ishod===v?`0 4px 16px ${c}25`:`0 2px 8px ${C.shadow}`,fontFamily:"inherit"}}>
            <span style={{fontSize:22,flexShrink:0}}>{em}</span>
            <span style={{fontSize:15,fontWeight:ishod===v?700:500,color:ishod===v?c:C.text}}>{l}</span>
          </button>
        ))}
      </div>
      {ishod&&(()=>{
        const poruke={res:"Neverovatno! Ta snaga je tvoja. 💪",try:"Pokušaj je napredak. Budi blaga prema sebi. 🌿",ep:"U redu je. Potražila si pomoć — to je važno. 🫂"};
        return(<>
          <div style={{background:C.primaryLight,borderRadius:18,padding:"14px 18px",width:"100%",textAlign:"center"}}>
            <p style={{fontSize:14,color:C.primaryDark,fontWeight:500,lineHeight:1.6}}>{poruke[ishod]}</p>
          </div>
          <button className="btn-p" style={{width:"auto",padding:"14px 44px"}} onClick={onZatvori}>Zatvori ✓</button>
        </>);
      })()}
    </div>
  );
}

function NoviUnos({onSacuvaj,onOtkazi,editData}){
  const [saving,setSaving]=useState(false);
  const [u,setU]=useState(editData?{ts:editData.ts||Date.now(),int:editData.int||5,ok:editData.ok||[],lok:editData.lok||"",epre:editData.epre||"",epost:editData.epost||"",ish:editData.ish||"",bel:editData.bel||"",slike:editData.slike||[]}:{ts:Date.now(),int:5,ok:[],lok:"",epre:"",epost:"",ish:"",bel:"",slike:[]});

  function toggleOk(o){
    if(o==="Ostalo"){setU(v=>({...v,ok:v.ok.includes("Ostalo")||v.ok.some(x=>x.startsWith("Ostalo:"))?v.ok.filter(x=>x!=="Ostalo"&&!x.startsWith("Ostalo:")):v.ok.includes("Ostalo")?v.ok:[...v.ok,"Ostalo"]}));return;}
    setU(v=>({...v,ok:v.ok.includes(o)?v.ok.filter(x=>x!==o):[...v.ok,o]}));
  }
  const ostaloAkt=u.ok.includes("Ostalo")||u.ok.some(x=>x.startsWith("Ostalo:"));
  const ostaloTekst=u.ok.find(x=>x.startsWith("Ostalo:"))?.slice(7)||"";

  const ishodi=[
    {v:"res",l:"Odolela/o",sub:"Impuls je prošao",c:C.green,bg:C.greenLight},
    {v:"try",l:"Pokušala/o",sub:"Bilo je teško",c:C.amber,bg:C.amberLight},
    {v:"ep", l:"Epizoda",   sub:"Desilo se",      c:C.red,  bg:C.red+"14"},
  ];

  return(
    <div style={{minHeight:"100vh",background:C.bg}} className="fi">
      {/* Header */}
      <div style={{paddingTop:`max(44px,${SAT})`,paddingLeft:20,paddingRight:20,paddingBottom:12,display:"flex",alignItems:"center",gap:14,borderBottom:`1px solid ${C.border}`,background:C.bg,position:"sticky",top:0,zIndex:10}}>
        <button className="btn-g" onClick={onOtkazi} style={{padding:0,flexShrink:0}}><Ico d={I.back} size={22} stroke={C.textMid}/></button>
        <h2 className="serif" style={{fontSize:22,letterSpacing:-0.3,flex:1}}>{editData?"Izmeni unos":"Novi unos"}</h2>
      </div>

      <div style={{padding:"16px 20px 40px",display:"flex",flexDirection:"column",gap:16,overflowY:"auto"}}>

        {/* Ishod — required */}
        <div>
          <span className="lbl">KAKAV JE BIO ISHOD?</span>
          <div style={{display:"flex",gap:8}}>
            {ishodi.map(({v,l,c,bg})=>(
              <button key={v} onClick={()=>setU(x=>({...x,ish:v}))} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:6,padding:"12px 8px",borderRadius:16,border:`2px solid ${u.ish===v?c:C.border}`,background:u.ish===v?bg:C.bgCard,cursor:"pointer",transition:"all .15s",fontFamily:"inherit"}}>
                <div style={{width:30,height:30,borderRadius:10,background:u.ish===v?c+"22":C.bgMuted,display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <Ico d={v==="res"?I.check:v==="try"?I.spark:I.x} size={14} stroke={u.ish===v?c:C.textLight} sw={2.5}/>
                </div>
                <p style={{fontWeight:700,fontSize:13,color:u.ish===v?c:C.text,lineHeight:1,textAlign:"center"}}>{l}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Intenzitet */}
        <div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:8}}>
            <span className="lbl" style={{marginBottom:0}}>JAK IMPULS</span>
            <span style={{fontSize:22,fontWeight:400,color:C.primary,fontFamily:"'Playfair Display',serif",lineHeight:1}}>{u.int}</span>
          </div>
          <input type="range" min={1} max={10} value={u.int} onChange={e=>setU(v=>({...v,int:+e.target.value}))} style={{width:"100%",accentColor:C.primary}}/>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:C.textLight,fontWeight:600,marginTop:3}}><span>Jedva primetno</span><span>Nepodnošljivo</span></div>
        </div>

        {/* Datum i vreme */}
        <div>
          <span className="lbl">DATUM I VREME</span>
          <div style={{display:"flex",gap:8}}>
            <input type="date" className="inp" value={new Date(u.ts-new Date(u.ts).getTimezoneOffset()*60000).toISOString().slice(0,10)} max={new Date(Date.now()-new Date().getTimezoneOffset()*60000).toISOString().slice(0,10)} onChange={e=>{if(!e.target.value)return;const[Y,M,D]=e.target.value.split("-");const d=new Date(u.ts);d.setFullYear(+Y,+M-1,+D);setU(v=>({...v,ts:d.getTime()}));}} style={{cursor:"pointer",flex:1,textAlign:"center"}}/>
            <input type="time" className="inp" value={new Date(u.ts).toTimeString().slice(0,5)} onChange={e=>{if(!e.target.value)return;const[h,m]=e.target.value.split(":");const d=new Date(u.ts);d.setHours(+h,+m);setU(v=>({...v,ts:d.getTime()}));}} style={{cursor:"pointer",width:100,textAlign:"center"}}/>
          </div>
        </div>

        {/* Okidači */}
        <div>
          <span className="lbl">OKIDAČI <span style={{fontWeight:400,textTransform:"none",letterSpacing:0,fontSize:10}}>(opciono)</span></span>
          <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:ostaloAkt?8:0}}>
            {OKI.map(o=><button key={o} className={`chip${(o==="Ostalo"?ostaloAkt:u.ok.includes(o))?" on":""}`} onClick={()=>toggleOk(o)}>{o}</button>)}
          </div>
          {ostaloAkt&&<input className="inp" placeholder="Opiši okidač..." value={ostaloTekst} onChange={e=>{const t=e.target.value;setU(v=>({...v,ok:[...v.ok.filter(x=>x!=="Ostalo"&&!x.startsWith("Ostalo:")),t?"Ostalo:"+t:"Ostalo"]}));}} style={{marginTop:6}}/>}
        </div>

        {/* Lokacija */}
        {(()=>{
          const lokOstaloAkt=u.lok==="Ostalo"||u.lok.startsWith("Ostalo:");
          const lokOstaloTekst=u.lok.startsWith("Ostalo:")?u.lok.slice(7):"";
          return(
            <div>
              <span className="lbl">LOKACIJA <span style={{fontWeight:400,textTransform:"none",letterSpacing:0,fontSize:10}}>(opciono)</span></span>
              <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:lokOstaloAkt?8:0}}>
                {LOK.map(l=><button key={l} className={`chip${u.lok===l?" on":""}`} onClick={()=>setU(v=>({...v,lok:v.lok===l?"":l}))} style={{fontSize:13}}>{l}</button>)}
                <button className={`chip${lokOstaloAkt?" on":""}`} onClick={()=>setU(v=>({...v,lok:lokOstaloAkt?"":"Ostalo"}))} style={{fontSize:13}}>Ostalo</button>
              </div>
              {lokOstaloAkt&&<input className="inp" placeholder="Gde si bio/la?" value={lokOstaloTekst} onChange={e=>{const t=e.target.value;setU(v=>({...v,lok:t?"Ostalo:"+t:"Ostalo"}));}}/>}
            </div>
          );
        })()}

        {/* Emocije */}
        <div>
          <span className="lbl">EMOCIJE <span style={{fontWeight:400,textTransform:"none",letterSpacing:0,fontSize:10}}>(opciono)</span></span>
          <div style={{display:"flex",gap:10}}>
            <div style={{flex:1}}>
              <p style={{fontSize:11,color:C.textLight,fontWeight:600,marginBottom:5}}>Pre</p>
              <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                {EMOCIJE.map(([e,l])=><button key={l} onClick={()=>setU(v=>({...v,epre:v.epre===l?"":l}))} style={{padding:"5px 8px",borderRadius:100,border:`1.5px solid ${u.epre===l?C.primary:C.border}`,background:u.epre===l?C.primaryLight:C.bgCard,fontSize:12,cursor:"pointer",fontFamily:"inherit",transition:"all .15s"}}>{e}</button>)}
              </div>
            </div>
            <div style={{flex:1}}>
              <p style={{fontSize:11,color:C.textLight,fontWeight:600,marginBottom:5}}>Posle</p>
              <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                {EMOCIJE.map(([e,l])=><button key={l+"p"} onClick={()=>setU(v=>({...v,epost:v.epost===l?"":l}))} style={{padding:"5px 8px",borderRadius:100,border:`1.5px solid ${u.epost===l?C.primary:C.border}`,background:u.epost===l?C.primaryLight:C.bgCard,fontSize:12,cursor:"pointer",fontFamily:"inherit",transition:"all .15s"}}>{e}</button>)}
              </div>
            </div>
          </div>
        </div>

        {/* Beleška + Fotografija */}
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          <span className="lbl" style={{marginBottom:0}}>BELEŠKA & FOTO <span style={{fontWeight:400,textTransform:"none",letterSpacing:0,fontSize:10}}>(opciono)</span></span>
          <textarea className="inp" placeholder="Šta se dešavalo?" value={u.bel} onChange={e=>setU(v=>({...v,bel:e.target.value}))} style={{minHeight:64}}/>
          <label style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:8,padding:"20px 14px",borderRadius:14,border:`1.5px dashed ${C.border}`,background:C.bgMuted,cursor:"pointer"}}>
            <input type="file" accept="image/*" multiple style={{display:"none"}} onChange={e=>{Promise.all(Array.from(e.target.files).map(f=>new Promise(res=>{const r=new FileReader();r.onload=ev=>res(ev.target.result);r.readAsDataURL(f)}))).then(urls=>setU(v=>({...v,slike:[...v.slike,...urls]})))}}/>
            <Ico d={I.camera} size={22} stroke={C.primary} sw={1.8}/>
            <p style={{fontWeight:600,fontSize:13,color:C.textMid}}>Dodaj fotografiju</p>
          </label>
          {u.slike.length>0&&<div style={{display:"flex",gap:8,flexWrap:"wrap"}}>{u.slike.map((s,i)=><div key={i} style={{position:"relative"}}><img src={s} alt="" style={{width:70,height:70,borderRadius:12,objectFit:"cover"}}/><button onClick={()=>setU(v=>({...v,slike:v.slike.filter((_,j)=>j!==i)}))} style={{position:"absolute",top:-6,right:-6,width:20,height:20,borderRadius:"50%",background:C.red,color:"#fff",border:"none",fontSize:10,cursor:"pointer",fontFamily:"inherit"}}>✕</button></div>)}</div>}
        </div>

        {/* Sačuvaj */}
        <button
          disabled={!u.ish||saving}
          onClick={()=>{if(!u.ish||saving)return;setSaving(true);onSacuvaj(u);}}
          style={{background:u.ish?C.primaryGrad:"#EEE0E6",color:u.ish?"#fff":C.textLight,border:"none",borderRadius:100,padding:"16px",fontSize:15,fontWeight:700,fontFamily:"'DM Sans',sans-serif",cursor:u.ish?"pointer":"default",transition:"all .2s",opacity:saving?0.6:1,width:"100%"}}
        >{saving?"Čuvam...":"Sačuvaj"}</button>

      </div>
    </div>
  );
}


function buildSys(ime,niz,unosi){
  const today=new Date();today.setHours(0,0,0,0);
  const sedmicaDana=Array.from({length:7},(_,i)=>{
    const d=new Date(today.getTime()-i*86400000);
    return(unosi||[]).filter(e=>e.ts&&e.ts>=d.getTime()&&e.ts<d.getTime()+86400000);
  }).flat();
  const ep=sedmicaDana.filter(e=>e.ish==="ep"||e.ish==="try").length;
  const res=sedmicaDana.filter(e=>e.ish==="res").length;
  const okFreq={};
  (unosi||[]).flatMap(e=>Array.isArray(e.ok)?e.ok:[e.ok]).filter(Boolean).forEach(o=>{okFreq[o]=(okFreq[o]||0)+1;});
  const topOk=Object.entries(okFreq).sort((a,b)=>b[1]-a[1]).slice(0,3).map(([k])=>k);
  const lokFreq={};(unosi||[]).forEach(e=>{if(e.lok)lokFreq[e.lok]=(lokFreq[e.lok]||0)+1;});
  const topLok=Object.entries(lokFreq).sort((a,b)=>b[1]-a[1]).slice(0,2).map(([k])=>k);
  const prosecniInt=unosi?.length?Math.round((unosi||[]).reduce((s,e)=>s+(e.int||0),0)/unosi.length):0;
  const total=(unosi||[]).length;

  const uvidi=[];
  if(topOk.length) uvidi.push(`Najčešći okidači: ${topOk.join(", ")}`);
  if(topLok.length) uvidi.push(`Kritična mesta: ${topLok.join(", ")}`);
  if(prosecniInt>=7) uvidi.push("Intenzitet impulsa je visok (prosek "+prosecniInt+"/10)");
  if(niz>=7) uvidi.push(`Ima ${niz} dana čistog niza — izuzetan napredak`);
  if(ep===0&&res>0) uvidi.push("Ova sedmica je bez epizoda — momentum koji treba čuvati");

  return `Ti si Mia — topla, pametna drugarica u aplikaciji Unpick za osobe sa dermatilomanijom. Znaš sve o korisnikovim podacima i koristiš ih aktivno.

JEZIK: Srpski, ekavica. Nikad: "tjedan","trenutačno","također","ukoliko","kako bi","draga/dragi".
DUŽINA: 2–4 rečenice po odgovoru. Kratko, toplo, konkretno.

PODACI O KORISNIKU:
- Niz čistih dana: ${niz}${niz>=7?" — više od sedmice, izvanredno!":niz>=3?" — svaki dan se računa!":niz===1?" — prvi dan je počelo!":""}
- Ova sedmica: ${ep} epizoda/pokušaja, ${res}× odolelo
- Ukupno unosa: ${total}${total>10?" — ozbiljna posvećenost":total>3?" — dobar početak":""}
${uvidi.length?uvidi.map(u=>"- "+u).join("\n"):""}

PRAVILA PONAŠANJA:

MOTIVACIJA — uvek je prisutna, ali nenametljiva:
- Ako ima niz (${niz} dana): prirodno ga pomeni. Npr: "Već imaš ${niz} dana — to znači da si prošao/la kroz teške trenutke pre. Ovo je još jedan takav trenutak."
- Ako nema niza: pohvali što je tu i razgovara. "Što si ovde i tražiš podršku — to JE napredak."
- Budi specifična: ne "super si" nego "Odoleti ${res}× ove sedmice znači da si naučio/la nešto novo o sebi."
- Svaki razgovor završi sa nečim što korisnika učvršćuje u napretku koji već ima.

ANALIZA OBRAZACA — najvažniji zadatak:
- Postavljaj pitanja da korisnik SAM/A otkrije uzrok: "Šta misliš, šta je pokrenulo impuls ovog puta?", "Primećuješ li neku sličnost sa prošli put?"
- Koristi podatke aktivno: "Primetila sam da se ${topOk[0]||"stres"} pojavljuje kod tebe često — je l' i ovog puta?"
- Kada korisnik opiše epizodu — pitaj redom: šta je prethodilo, kako se osećao/la, šta se desilo posle
- Pamti šta je rečeno ranije i vraćaj se na to
- Cilj: korisnik sam kaže "Ah, sad vidim zašto se dešava"

TEHNIKE — samo kad je pravo vreme:
- Jak impuls UPRAVO SAD: tehnika odmah — "Stisni šake čvrsto 30s, brojiš sa mnom? 1... 2..."
- Posle epizode: bez osude, zajedno istraži okidač
- Tehnike: disanje 4-7-8 | 5-4-3-2-1 | kocka leda | gumena narukvica | "samo 5 minuta"`;
}

function AIChat({ime,niz,unosi,userId,onSOS,isVisible}){
  const pocetna={id:0,ko:"ai",tekst:`Zdravo${ime?" "+ime:""}! Ja sam Mia — tu sam da te saslušam, bez osude i bez žurbe. Možeš mi reći šta te muči, kako se osećaš, ili šta ti je na umu. Šta se dešava kod tebe?`};
  const [poruke,setPoruke]=useState([pocetna]);
  const [unos,setUnos]=useState("");const [ucitava,setUcitava]=useState(false);const krajRef=useRef(null);const msgsRef=useRef(null);
  const porRef=useRef([pocetna]);

  const LS=`unpick_chat_${userId}`;

  function snimi(p){
    setPoruke(p);porRef.current=p;
    try{localStorage.setItem(LS,JSON.stringify(p));}catch{}
    if(userId){
      supabase.from("profiles").update({chat_history:p}).eq("id",userId).then(null,()=>{});
    }
  }

  useEffect(()=>{
    if(!userId)return;
    const lsData=()=>{try{return JSON.parse(localStorage.getItem(LS)||"[]");}catch{return [];}};
    supabase.from("profiles").select("chat_history").eq("id",userId).single().then(({data,error})=>{
      if(error) console.error("chat load:",error?.message);
      const sb=Array.isArray(data?.chat_history)?data.chat_history:[];
      const ls=lsData();
      // koristi koji ima više poruka
      const best=sb.length>=ls.length?sb:ls;
      if(best.length>1){setPoruke(best);porRef.current=best;localStorage.setItem(LS,JSON.stringify(best));}
    }).catch(()=>{
      const ls=lsData();
      if(ls.length>1){setPoruke(ls);porRef.current=ls;}
    });
  },[userId]);

  const scrollDno=()=>{if(msgsRef.current)msgsRef.current.scrollTop=msgsRef.current.scrollHeight;};
  useEffect(()=>{scrollDno();},[poruke,ucitava]);
  useEffect(()=>{if(isVisible)setTimeout(scrollDno,80);},[isVisible]);
  async function posalji(){
    const txt=unos.trim();if(!txt||ucitava)return;
    const np=[...poruke,{id:Date.now(),ko:"user",tekst:txt}];
    setPoruke(np);porRef.current=np;setUnos("");setUcitava(true);
    try{
      const msgs=[{role:"system",content:buildSys(ime,niz,unosi)},...np.filter(p=>p.id!==0).map(p=>({role:p.ko==="user"?"user":"assistant",content:p.tekst}))];
      const res=await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({messages:msgs})});
      if(!res.ok) throw new Error(`Server greška: ${res.status}`);
      const data=await res.json();
      if(data.error) throw new Error(data.error);
      const raw=data.choices?.[0]?.message?.content||"";
      if(!raw) throw new Error("prazan odgovor");
      // SOS detekcija na osnovu korisnikove poruke — bez AI markera
      const kriza=/čačkam|čačkanje|grebem|ne mogu da se zaustavim|ne mogu da prestanem|impuls je jak|ne mogu odoleti|hoću da počnem|moram da|ne mogu se zaustaviti/i;
      const hasSOS=kriza.test(txt);
      const aiTekst=raw.replace(/\[SOS\]/g,"").trim();
      snimi([...np,{id:Date.now()+1,ko:"ai",tekst:aiTekst,sos:hasSOS}]);
    }catch(e){console.error("posalji:",e?.message);snimi([...np,{id:Date.now()+1,ko:"ai",tekst:"Ups, Mia trenutno nije dostupna. Proveri internet konekciju ili pokušaj za koji minut. Ako te muči nešto hitno, koristi SOS dugme gore. 💙"}]);}
    finally{setUcitava(false);}
  }
  return(
    <div style={{display:"flex",flexDirection:"column",height:"100%",flex:1,minHeight:0}}>
      <div style={{paddingTop:HDR_PT,paddingBottom:14,paddingLeft:22,paddingRight:22,background:C.bgCard,borderBottom:`1px solid ${C.border}`,flexShrink:0,boxShadow:`0 2px 8px ${C.shadow}`}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end"}}>
          <div style={{display:"flex",alignItems:"flex-end",gap:12}}>
            <div style={{width:38,height:38,borderRadius:"50%",background:C.primaryGrad,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,position:"relative",boxShadow:`0 4px 10px ${C.primary}44`,marginBottom:2}}>
              <Ico d={I.heart} size={17} stroke="#fff" sw={1.8}/>
            </div>
            <div>
              <span style={{display:"inline-block",background:C.primaryLight,color:C.primary,fontSize:10,fontWeight:800,letterSpacing:1,textTransform:"uppercase",padding:"3px 10px",borderRadius:100,marginBottom:7}}>AI podrška</span>
              <h1 className="serif" style={{fontSize:24,lineHeight:1,letterSpacing:-0.3,color:C.text}}>Mia</h1>
            </div>
          </div>
          <button onClick={onSOS} style={{display:"flex",alignItems:"center",gap:6,padding:"9px 16px 9px 12px",borderRadius:100,background:C.red,border:"none",cursor:"pointer",flexShrink:0,boxShadow:`0 4px 12px ${C.red}55`}}>
            <Ico d={I.zap} size={15} stroke="#fff" sw={2.2}/>
            <span style={{fontSize:13,fontWeight:800,color:"#fff",letterSpacing:0.5}}>SOS</span>
          </button>
        </div>
      </div>
      <div ref={msgsRef} style={{flex:1,overflowY:"auto",padding:"20px 16px 10px",display:"flex",flexDirection:"column",gap:12,background:C.bg,minHeight:0}}>
        {poruke.map(p=>(
          <div key={p.id} style={{display:"flex",flexDirection:"column",alignItems:p.ko==="user"?"flex-end":"flex-start"}}>
            {p.ko==="ai"&&<div style={{display:"flex",alignItems:"flex-end",gap:8}}>
              <div style={{width:32,height:32,borderRadius:"50%",background:C.primaryLight,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginBottom:2}}><Ico d={I.heart} size={14} stroke={C.primary} sw={1.8}/></div>
              <div style={{display:"flex",flexDirection:"column",gap:8,maxWidth:"84%"}}>
                <div className="bba">{p.tekst}</div>
                {p.sos&&<button onClick={onSOS} style={{alignSelf:"flex-start",display:"flex",alignItems:"center",gap:8,padding:"9px 16px 9px 12px",borderRadius:100,background:C.red,border:"none",cursor:"pointer",boxShadow:`0 4px 12px ${C.red}55`}}>
                  <Ico d={I.zap} size={15} stroke="#fff" sw={2.2}/>
                  <span style={{fontSize:13,fontWeight:800,color:"#fff"}}>Otvori SOS tehnike</span>
                </button>}
              </div>
            </div>}
            {p.ko==="user"&&<div className="bbu">{p.tekst}</div>}
          </div>
        ))}
        {ucitava&&<div style={{display:"flex",alignItems:"flex-end",gap:8}}>
          <div style={{width:32,height:32,borderRadius:"50%",background:C.primaryLight,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Ico d={I.heart} size={14} stroke={C.primary} sw={1.8}/></div>
          <div className="bba"><div className="typing"><div className="dot"/><div className="dot"/><div className="dot"/></div></div>
        </div>}
        <div ref={krajRef}/>
      </div>
      {poruke.length===1&&<div style={{padding:"0 16px 10px",display:"flex",gap:8,overflowX:"auto",background:C.bg,flexShrink:0}}>
        {["Teško mi je danas","Imao/la sam epizodu","Kako da se smirim?","Napredovao/la sam!"].map(t=>(
          <button key={t} onClick={()=>setUnos(t)} style={{flexShrink:0,padding:"9px 16px",background:C.bgCard,border:`1.5px solid ${C.border}`,borderRadius:100,fontSize:13,color:C.textMid,cursor:"pointer",whiteSpace:"nowrap",fontWeight:600,fontFamily:"'DM Sans',sans-serif",boxShadow:`0 2px 8px ${C.shadow}`}}>{t}</button>
        ))}
      </div>}
      <div style={{padding:"10px 16px",paddingBottom:"calc(14px + env(safe-area-inset-bottom,0px))",background:"rgba(255,255,255,.92)",backdropFilter:"blur(20px)",borderTop:`1px solid ${C.border}`,display:"flex",gap:10,alignItems:"flex-end",flexShrink:0}}>
        <textarea className="inp" placeholder="Napiši poruku..." value={unos} onChange={e=>setUnos(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();posalji()}}} rows={1} style={{flex:1,minHeight:"auto",resize:"none",padding:"12px 14px",borderRadius:14,lineHeight:1.5}}/>
        <button onClick={posalji} disabled={!unos.trim()||ucitava} style={{width:46,height:46,borderRadius:"50%",background:unos.trim()&&!ucitava?C.primaryGrad:C.border,border:"none",display:"flex",alignItems:"center",justifyContent:"center",cursor:unos.trim()?"pointer":"default",flexShrink:0,transition:"all .2s",boxShadow:unos.trim()&&!ucitava?"0 4px 16px rgba(122,158,142,.30)":"none"}}>
          <Ico d={I.send} size={18} stroke="#fff" sw={2}/>
        </button>
      </div>
    </div>
  );
}

function Pocetna({ime,niz,onSOS,onNoviUnos,onLogout,unosi,registeredAt,kor,onNotif,notifStatus}){
  const [izvestaj,setIzvestaj]=useState(null);
  const [showProfil,setShowProfil]=useState(false);
  const [menjaLozinku,setMenjaLozinku]=useState(false);
  const [novaLoz,setNovaLoz]=useState("");
  const [potvrda,setPotvrda]=useState("");
  const [lozPoruka,setLozPoruka]=useState(null);
  const [lozLoading,setLozLoading]=useState(false);
  const initijali=(kor?.ime||"").split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase()||"🌸";

  async function promeniLozinku(){
    if(novaLoz!==potvrda){setLozPoruka({tip:"g",t:"Lozinke se ne podudaraju."});return;}
    if(novaLoz.length<6){setLozPoruka({tip:"g",t:"Minimum 6 karaktera."});return;}
    setLozLoading(true);
    const{error}=await supabase.auth.updateUser({password:novaLoz});
    setLozLoading(false);
    if(error){setLozPoruka({tip:"g",t:error.message});return;}
    setLozPoruka({tip:"ok",t:"Lozinka promenjena! 🎉"});
    setMenjaLozinku(false);setNovaLoz("");setPotvrda("");
  }
  const h=new Date().getHours();
  const pozdrav=h<12?"Dobro jutro":h<18?"Dobar dan":"Dobro veče";
  const prikazIme=ime&&!ime.includes("@")?ime:"";
  const dani=["P","U","S","Č","P","S","N"];
  const puniDani=["Ponedeljak","Utorak","Sreda","Četvrtak","Petak","Subota","Nedelja"];
  const danas=new Date();
  const dow=danas.getDay();
  const ponedeljak=new Date(danas);
  ponedeljak.setDate(danas.getDate()-(dow===0?6:dow-1));
  ponedeljak.setHours(0,0,0,0);
  const regTs=registeredAt?new Date(registeredAt).setHours(0,0,0,0):null;
  const weekData=Array.from({length:7},(_,i)=>{
    const d=new Date(ponedeljak.getTime()+i*86400000);
    const buduci=d.getTime()>danas.getTime();
    const preReg=regTs&&d.getTime()<regTs;
    const entries=(unosi||[]).filter(e=>e.ts&&e.ts>=d.getTime()&&e.ts<d.getTime()+86400000);
    let s=null;
    if(preReg) s="pre";
    else if(!buduci){
      if(entries.some(e=>e.ish==="ep")) s="c";
      else if(entries.some(e=>e.ish==="try")) s="ž";
      else s="z";
    }
    return{s,entries,datum:d,naziv:puniDani[i],preReg};
  });
  const now=new Date();
  const todayStart=new Date(now);todayStart.setHours(0,0,0,0);
  const badDanas=(unosi||[]).some(e=>e.ts&&e.ts>=todayStart.getTime()&&(e.ish==="ep"||e.ish==="try"));
  const minutesToday=now.getHours()*60+now.getMinutes();
  const pct=badDanas?0:Math.min((minutesToday/1440)*100,100);
  const faliMin=1440-minutesToday;
  const faliH=Math.floor(faliMin/60);
  const faliM=faliMin%60;
  const faliTekst=badDanas?"Resetovano":faliH>0?`${faliH}h ${faliM}m`:`${faliM}m`;
  const poruka=PORUKE_DANA[Math.floor((Date.now()-new Date(new Date().getFullYear(),0,0).getTime())/86400000)%PORUKE_DANA.length];
  const bc=o=>o==="res"?C.green:o==="try"?C.amber:C.red;
  const bl=o=>o==="res"?"Odolela/o":o==="try"?"Pokušala/o":"Epizoda";
  const nedZelene=weekData.filter(w=>w.s==="z").length;
  const nedAmber=weekData.filter(w=>w.s==="ž").length;
  const nedCrvene=weekData.filter(w=>w.s==="c").length;

  const r=72;const circ=2*Math.PI*r;
  const ringOffset=circ*(1-pct/100);

  return(
    <div style={{minHeight:"100vh",background:C.bg}} className="fi">
      {izvestaj!==null&&(
        <div style={{position:"fixed",inset:0,zIndex:200,display:"flex",flexDirection:"column",justifyContent:"flex-end"}} onClick={()=>setIzvestaj(null)}>
          <div style={{position:"absolute",inset:0,background:"rgba(42,24,32,.5)",backdropFilter:"blur(6px)"}}/>
          <div onClick={e=>e.stopPropagation()} style={{position:"relative",background:C.bg,borderRadius:"32px 32px 0 0",padding:"24px 24px 56px",maxHeight:"75vh",overflowY:"auto",boxShadow:"0 -12px 48px rgba(168,90,116,.18)"}} className="fi">
            <div style={{width:36,height:4,borderRadius:2,background:C.border,margin:"0 auto 20px"}}/>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
              <h3 className="serif" style={{fontSize:22,letterSpacing:-0.3}}>{weekData[izvestaj].naziv}</h3>
              <button onClick={()=>setIzvestaj(null)} style={{background:C.bgMuted,border:"none",borderRadius:50,width:34,height:34,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}><Ico d={I.x} size={14} stroke={C.textMid} sw={2}/></button>
            </div>
            <p style={{fontSize:13,color:C.textLight,fontWeight:600,marginBottom:20}}>{weekData[izvestaj].datum.toLocaleDateString("sr",{day:"numeric",month:"long"})} · {weekData[izvestaj].entries.length} unosa</p>
            {weekData[izvestaj].entries.length===0?(
              <div style={{textAlign:"center",padding:"24px 0"}}><div style={{fontSize:40,marginBottom:12}}>✨</div><p style={{fontWeight:700,color:C.green,fontSize:15,marginBottom:4}}>Čist dan!</p><p style={{fontSize:13,color:C.textLight,fontWeight:500}}>Ovog dana nije bilo epizoda.</p></div>
            ):(
              <div style={{display:"flex",flexDirection:"column",gap:12}}>
                {weekData[izvestaj].entries.map((u,idx)=>(
                  <div key={u.id||idx} style={{background:C.bgCard,borderRadius:18,padding:"16px",border:`1px solid ${C.border}`}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}><span style={{fontSize:12,color:C.textLight,fontWeight:600}}>{u.datum}</span><span className="tag" style={{background:bc(u.ish)+"20",color:bc(u.ish)}}>{bl(u.ish)}</span></div>
                    <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:u.bel?10:0}}>
                      <span className="tag" style={{background:C.bgMuted,color:C.textMid}}>⚡ {u.int}/10</span>
                      {(Array.isArray(u.ok)?u.ok:[u.ok]).filter(Boolean).map(o=><span key={o} className="tag" style={{background:C.primaryLight,color:C.primaryDark}}>{o}</span>)}
                      {u.lok&&<span className="tag" style={{background:C.bgMuted,color:C.textMid}}>{u.lok}</span>}
                    </div>
                    {u.bel&&<p style={{fontSize:13,color:C.textMid,lineHeight:1.65,fontWeight:500,fontStyle:"italic"}}>"{u.bel}"</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Profil popup */}
      {showProfil&&(
        <div style={{position:"fixed",inset:0,zIndex:300,display:"flex",flexDirection:"column",justifyContent:"flex-end"}} onClick={()=>{setShowProfil(false);setMenjaLozinku(false);setLozPoruka(null);}}>
          <div style={{position:"absolute",inset:0,background:"rgba(42,24,32,.52)",backdropFilter:"blur(8px)"}}/>
          <div onClick={e=>e.stopPropagation()} style={{position:"relative",background:C.bgCard,borderRadius:"32px 32px 0 0",paddingBottom:"calc(72px + env(safe-area-inset-bottom,0px))",maxHeight:"88vh",overflowY:"auto",boxShadow:"0 -16px 64px rgba(168,90,116,.22)"}} className="fi">

            {/* Drag handle */}
            <div style={{width:40,height:4,borderRadius:2,background:C.border,margin:"12px auto 0"}}/>

            {/* Hero header */}
            <div style={{padding:"22px 24px 24px",background:`linear-gradient(160deg,#FFF8FA 0%,#FAE0EB 55%,#F5D8E8 100%)`,textAlign:"center",borderBottom:`1px solid ${C.border}`}}>
              <div style={{width:68,height:68,borderRadius:22,background:C.primaryGrad,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px",boxShadow:`0 6px 20px rgba(168,90,116,.35)`}}>
                <span style={{fontSize:initijali.length>1?22:28,fontWeight:800,color:"#fff",fontFamily:"'DM Sans',sans-serif",letterSpacing:-1}}>{initijali}</span>
              </div>
              <p style={{fontWeight:800,fontSize:18,color:C.text,letterSpacing:-0.4,marginBottom:4}}>{kor?.ime||"Korisnik"}</p>
              <p style={{fontSize:13,color:C.textMid,fontWeight:500}}>{kor?.email||""}</p>
            </div>

            {/* Action rows */}
            <div style={{padding:"16px 20px",display:"flex",flexDirection:"column",gap:8}}>

              {/* Notifikacije */}
              {notifStatus!=="granted"?(
                <button onClick={isPWA?()=>{onNotif();setShowProfil(false);}:undefined}
                  style={{width:"100%",background:C.bg,border:`1.5px solid ${C.border}`,borderRadius:18,padding:"14px 16px",display:"flex",alignItems:"center",gap:14,cursor:isPWA?"pointer":"default",fontFamily:"inherit",textAlign:"left"}}>
                  <div style={{width:40,height:40,borderRadius:13,background:C.primaryLight,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    <Ico d={I.wind} size={18} stroke={C.primary} sw={1.8}/>
                  </div>
                  <div style={{flex:1}}>
                    <p style={{fontWeight:700,fontSize:14,color:C.text,marginBottom:2}}>Uključi podsetnik</p>
                    <p style={{fontSize:12,color:C.textLight,fontWeight:500}}>{isPWA?"Dnevna notifikacija u 13h":"Dodaj app na početni ekran"}</p>
                  </div>
                  {isPWA&&<Ico d={I.chev} size={14} stroke={C.textLight} sw={2}/>}
                </button>
              ):(
                <div style={{background:C.greenLight,border:`1.5px solid rgba(122,158,120,.25)`,borderRadius:18,padding:"14px 16px",display:"flex",alignItems:"center",gap:14}}>
                  <div style={{width:40,height:40,borderRadius:13,background:"rgba(122,158,120,.18)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    <Ico d={I.wind} size={18} stroke={C.green} sw={1.8}/>
                  </div>
                  <div style={{flex:1}}>
                    <p style={{fontWeight:700,fontSize:14,color:C.green,marginBottom:2}}>Podsetnik uključen</p>
                    <p style={{fontSize:12,color:C.green,opacity:.75,fontWeight:500}}>Svaki dan u 13h</p>
                  </div>
                  <div style={{width:9,height:9,borderRadius:"50%",background:C.green,boxShadow:`0 0 0 3px rgba(122,158,120,.2)`,flexShrink:0}}/>
                </div>
              )}

              {/* Promena lozinke */}
              <div style={{background:C.bg,border:`1.5px solid ${C.border}`,borderRadius:18,overflow:"hidden"}}>
                <button onClick={()=>{setMenjaLozinku(m=>!m);setLozPoruka(null);}}
                  style={{width:"100%",background:"none",border:"none",padding:"14px 16px",display:"flex",alignItems:"center",gap:14,cursor:"pointer",fontFamily:"inherit"}}>
                  <div style={{width:40,height:40,borderRadius:13,background:C.primaryLight,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    <Ico d={I.lockIco} size={18} stroke={C.primary} sw={1.8}/>
                  </div>
                  <p style={{fontWeight:700,fontSize:14,color:C.text,flex:1,textAlign:"left"}}>Promeni lozinku</p>
                  <Ico d={I.chev} size={14} stroke={C.textLight} sw={2}/>
                </button>
                {menjaLozinku&&(
                  <div style={{borderTop:`1px solid ${C.border}`,padding:"14px 16px 16px",display:"flex",flexDirection:"column",gap:10}}>
                    <input className="inp" type="password" placeholder="Nova lozinka" value={novaLoz} onChange={e=>setNovaLoz(e.target.value)}/>
                    <input className="inp" type="password" placeholder="Potvrdi lozinku" value={potvrda} onChange={e=>setPotvrda(e.target.value)}/>
                    {lozPoruka&&<p style={{fontSize:12,color:lozPoruka.tip==="ok"?C.green:C.red,fontWeight:600,textAlign:"center"}}>{lozPoruka.t}</p>}
                    <button onClick={promeniLozinku} disabled={lozLoading} className="btn-p" style={{borderRadius:14,padding:"13px"}}>
                      {lozLoading?"Čuvam...":"Sačuvaj lozinku"}
                    </button>
                  </div>
                )}
              </div>

              {/* Odjava */}
              <button onClick={onLogout}
                style={{width:"100%",background:"#FFF5F5",border:`1.5px solid rgba(196,104,120,.2)`,borderRadius:18,padding:"14px 16px",display:"flex",alignItems:"center",gap:14,cursor:"pointer",fontFamily:"inherit",marginTop:4}}>
                <div style={{width:40,height:40,borderRadius:13,background:"rgba(196,104,120,.1)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  <Ico d={I.back} size={18} stroke={C.red} sw={2}/>
                </div>
                <p style={{fontWeight:700,fontSize:14,color:C.red}}>Odjavi se</p>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── HEADER ── */}
      <div style={{position:"sticky",top:0,zIndex:10,background:C.bgCard,borderBottom:`1px solid ${C.border}`,boxShadow:`0 2px 8px ${C.shadow}`,paddingTop:HDR_PT,paddingLeft:20,paddingRight:20,paddingBottom:14}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:36,height:36,borderRadius:11,background:C.primaryGrad,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,boxShadow:`0 3px 10px rgba(168,90,116,.3)`}}>
              <Ico d={I.leaf} size={17} stroke="#fff" sw={2}/>
            </div>
            <span style={{fontSize:14,fontWeight:800,color:C.text,letterSpacing:2.5,textTransform:"uppercase"}}>Unpick</span>
          </div>
          <button onClick={()=>setShowProfil(true)} style={{width:38,height:38,borderRadius:12,background:C.bgMuted,border:`1px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0}}>
            <Ico d={I.user} size={18} stroke={C.textMid} sw={1.8}/>
          </button>
        </div>
      </div>

      {/* ── Streak ring ── */}
      <div style={{background:`linear-gradient(170deg,${C.primaryLight} 0%,#FDEEF4 40%,${C.bg} 75%)`,padding:"28px 22px 24px",display:"flex",flexDirection:"column",alignItems:"center"}}>
        <div style={{position:"relative",width:r*2+20,height:r*2+20,marginBottom:12}}>
          <svg width={r*2+20} height={r*2+20} style={{position:"absolute",inset:0,transform:"rotate(-90deg)"}}>
            <circle cx={r+10} cy={r+10} r={r} fill="none" stroke={C.primary+"18"} strokeWidth={6}/>
            <circle cx={r+10} cy={r+10} r={r} fill="none" stroke="url(#pg)" strokeWidth={6}
              strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={ringOffset}
              style={{transition:"stroke-dashoffset .6s ease"}}/>
            <defs>
              <linearGradient id="pg" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#D898AC"/>
                <stop offset="100%" stopColor="#A85A74"/>
              </linearGradient>
            </defs>
          </svg>
          <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:0}}>
            {niz===0?(
              <><Ico d={I.leaf} size={28} stroke={C.primary} sw={1.8}/><p style={{fontSize:12,fontWeight:700,color:C.textMid,marginTop:6,letterSpacing:1,textTransform:"uppercase"}}>Počni!</p></>
            ):(
              <>
                <div style={{display:"flex",alignItems:"center",gap:5}}>
                  <span style={{fontSize:44,fontWeight:300,color:C.text,fontFamily:"-apple-system,BlinkMacSystemFont,'SF Pro Display',sans-serif",lineHeight:1,letterSpacing:-2}}>{niz}</span>
                  <span style={{fontSize:24,lineHeight:1,marginTop:4}}>🔥</span>
                </div>
                <p style={{fontSize:10,fontWeight:800,color:C.textLight,letterSpacing:2,textTransform:"uppercase",marginTop:4}}>Dana u nizu</p>
              </>
            )}
          </div>
        </div>
        <p style={{fontSize:13,color:badDanas?C.red:C.textMid,fontWeight:600,letterSpacing:0.1}}>
          {badDanas?"Resetovano danas":`${faliTekst} do sledeće vatrice`}
        </p>
      </div>

      {/* ── BOTTOM SECTION: white panel ── */}
      <div style={{padding:"12px 20px 20px",display:"flex",flexDirection:"column",gap:12}}>

        {/* Week strip */}
        <div style={{background:C.bgCard,borderRadius:22,padding:"16px 18px",border:`1px solid ${C.border}`}}>
          <p style={{fontSize:10,fontWeight:700,color:C.textLight,letterSpacing:1.2,textTransform:"uppercase",marginBottom:14}}>Ova nedelja</p>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            {weekData.map(({s,preReg},i)=>(
              <div key={i} onClick={()=>s!==null&&s!=="pre"&&setIzvestaj(i)} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:6,cursor:s!==null&&s!=="pre"?"pointer":"default",opacity:preReg?0.35:1}}>
                <div style={{width:36,height:36,borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",
                  background:s==="z"?C.greenLight:s==="ž"?C.amberLight:s==="c"?C.red+"18":C.bgMuted,
                  boxShadow:izvestaj===i?`0 0 0 2px ${C.primary}`:"none",transition:"box-shadow .18s"}}>
                  {s==="z"&&<Ico d={I.check} size={14} stroke={C.green} sw={2.5}/>}
                  {s==="ž"&&<span style={{fontSize:12,color:C.amber,fontWeight:900}}>~</span>}
                  {s==="c"&&<Ico d={I.x} size={12} stroke={C.red} sw={2.5}/>}
                  {s==="pre"&&<span style={{fontSize:14,color:C.textLight,fontWeight:300}}>—</span>}
                  {s===null&&<span style={{width:5,height:5,borderRadius:"50%",background:C.border,display:"block"}}/>}
                </div>
                <span style={{fontSize:9,color:s==="z"?C.green:s==="c"?C.red:s==="ž"?C.amber:C.textLight,fontWeight:700}}>{dani[i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div style={{display:"flex",gap:12}}>
          <button onClick={onSOS} style={{flex:1,background:C.primaryGrad,border:"none",borderRadius:20,padding:"18px 16px",cursor:"pointer",display:"flex",alignItems:"center",gap:12,boxShadow:`0 8px 28px ${C.primary}44`,fontFamily:"'DM Sans',sans-serif",touchAction:"manipulation"}}>
            <div style={{width:38,height:38,borderRadius:12,background:"rgba(255,255,255,.2)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Ico d={I.zap} size={18} stroke="#fff" sw={2.2}/></div>
            <div style={{textAlign:"left"}}>
              <p style={{fontSize:15,fontWeight:700,color:"#fff",lineHeight:1}}>SOS</p>
              <p style={{fontSize:11,color:"rgba(255,255,255,.65)",fontWeight:600,marginTop:3}}>Smiri se</p>
            </div>
          </button>
          <button onClick={onNoviUnos} style={{flex:1,background:C.bgCard,border:`1.5px solid ${C.border}`,borderRadius:20,padding:"18px 16px",cursor:"pointer",display:"flex",alignItems:"center",gap:12,fontFamily:"'DM Sans',sans-serif",touchAction:"manipulation"}}>
            <div style={{width:38,height:38,borderRadius:12,background:C.primaryLight,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Ico d={I.plus} size={18} stroke={C.primary} sw={2.5}/></div>
            <div style={{textAlign:"left"}}>
              <p style={{fontSize:15,fontWeight:700,color:C.text,lineHeight:1}}>Upiši</p>
              <p style={{fontSize:11,color:C.textLight,fontWeight:600,marginTop:3}}>Novi unos</p>
            </div>
          </button>
        </div>

        {/* Quote — last element */}
        <div style={{background:`linear-gradient(135deg,#F7F2F5 0%,#F2EEF8 100%)`,borderRadius:22,padding:"22px 22px 20px",border:`1px solid ${C.border}`,position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",top:-18,right:10,fontSize:110,color:C.textLight,opacity:.09,fontFamily:"'Playfair Display',serif",lineHeight:1,pointerEvents:"none"}}>"</div>
          <span style={{display:"inline-block",background:"rgba(192,120,144,.12)",color:C.primary,fontSize:10,fontWeight:800,letterSpacing:1,textTransform:"uppercase",padding:"3px 10px",borderRadius:100,marginBottom:14}}>Poruka dana</span>
          <p className="serif" style={{fontSize:16,color:C.text,lineHeight:1.85,fontWeight:400}}>{poruka}</p>
        </div>
      </div>
    </div>
  );
}

function Dnevnik({noviUnosi,onDodaj,onIzmeni,onObrisi}){
  const [otvoren,setOtvoren]=useState(null);
  const [potvrda,setPotvrda]=useState(null);
  const [pretraga,setPretraga]=useState("");
  const [filIsh,setFilIsh]=useState("sve");
  const bc=o=>o==="res"?C.green:o==="try"?C.amber:C.red;
  const bl=o=>o==="res"?"Odolela/o":o==="try"?"Pokušala/o":"Epizoda";

  const todayMid=new Date();todayMid.setHours(0,0,0,0);
  const yesterMid=new Date(todayMid.getTime()-86400000);
  function dayLabel(ts){
    if(!ts) return "Ranije";
    const d=new Date(ts);d.setHours(0,0,0,0);
    if(d.getTime()===todayMid.getTime()) return "Danas";
    if(d.getTime()===yesterMid.getTime()) return "Juče";
    return new Date(ts).toLocaleDateString("sr",{day:"numeric",month:"long"});
  }

  const q=pretraga.toLowerCase().trim();
  const filtrirani=noviUnosi.filter(u=>{
    if(filIsh!=="sve"&&u.ish!==filIsh) return false;
    if(!q) return true;
    return [u.bel,u.lok,u.epre,u.epost,...(Array.isArray(u.ok)?u.ok:[u.ok||""])].some(v=>v&&v.toLowerCase().includes(q));
  });

  const groupMap=new Map();const groupOrder=[];
  filtrirani.forEach(u=>{
    const lbl=dayLabel(u.ts);
    if(!groupMap.has(lbl)){groupMap.set(lbl,[]);groupOrder.push(lbl);}
    groupMap.get(lbl).push(u);
  });

  const filteri=[{v:"sve",l:"Sve"},{v:"res",l:"Odolela/o"},{v:"try",l:"Pokušala/o"},{v:"ep",l:"Epizoda"}];

  return(
    <div style={{paddingBottom:20}} className="fi">
      <div style={{position:"sticky",top:0,zIndex:10,background:C.bgCard,borderBottom:`1px solid ${C.border}`,boxShadow:`0 2px 8px ${C.shadow}`,paddingTop:HDR_PT,paddingLeft:20,paddingRight:20,paddingBottom:12}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
          <div>
            <span style={{display:"inline-block",background:C.primaryLight,color:C.primary,fontSize:10,fontWeight:800,letterSpacing:1,textTransform:"uppercase",padding:"3px 10px",borderRadius:100,marginBottom:7}}>Moj dnevnik</span>
            <h1 className="serif" style={{fontSize:24,letterSpacing:-0.3,lineHeight:1}}>Unosi</h1>
          </div>
          <button onClick={onDodaj} style={{width:46,height:46,borderRadius:"50%",background:C.primaryGrad,border:"none",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",boxShadow:`0 4px 16px rgba(192,120,144,.35)`}}>
            <Ico d={I.plus} size={20} stroke="#fff" sw={2.5}/>
          </button>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8,background:C.bgMuted,borderRadius:14,padding:"8px 14px",marginBottom:10}}>
          <Ico d={I.search} size={15} stroke={C.textLight} sw={2}/>
          <input value={pretraga} onChange={e=>setPretraga(e.target.value)} placeholder="Pretraži unose..." style={{flex:1,border:"none",background:"transparent",fontSize:14,color:C.text,fontFamily:"'DM Sans',sans-serif",outline:"none"}}/>
          {pretraga&&<button onClick={()=>setPretraga("")} style={{border:"none",background:"none",cursor:"pointer",padding:0,color:C.textLight,fontSize:16,lineHeight:1}}>✕</button>}
        </div>
        <div style={{display:"flex",gap:6}}>
          {filteri.map(f=><button key={f.v} onClick={()=>setFilIsh(f.v)} style={{padding:"5px 12px",borderRadius:100,border:`1.5px solid ${filIsh===f.v?bc(f.v)||C.primary:C.border}`,background:filIsh===f.v?filIsh==="sve"?C.primaryLight:bc(f.v)+"18":C.bgCard,color:filIsh===f.v?filIsh==="sve"?C.primary:bc(f.v):C.textMid,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit",transition:"all .15s"}}>{f.l}</button>)}
        </div>
      </div>
      <div style={{padding:"16px 20px 0"}}>
        {noviUnosi.length===0?(
          <div style={{textAlign:"center",padding:"56px 24px"}}>
            <div style={{width:80,height:80,borderRadius:28,background:C.primaryLight,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px"}}><Ico d={I.journal} size={36} stroke={C.primary} sw={1.5}/></div>
            <h3 className="serif" style={{fontSize:24,marginBottom:8}}>Još nema unosa</h3>
            <p style={{fontSize:14,color:C.textLight,fontWeight:500,lineHeight:1.7,marginBottom:28}}>Svaki zabeleženi trenutak<br/>pomaže ti da razumeš svoje obrasce.</p>
            <button onClick={onDodaj} className="btn-p" style={{width:"auto",padding:"14px 36px"}}>Dodaj prvi unos →</button>
          </div>
        ):filtrirani.length===0?(
          <div style={{textAlign:"center",padding:"48px 24px"}}>
            <p style={{fontSize:32,marginBottom:12}}>🔍</p>
            <p style={{fontSize:15,fontWeight:600,color:C.textMid,marginBottom:6}}>Nema rezultata</p>
            <p style={{fontSize:13,color:C.textLight}}>Pokušaj drugi pojam ili ukloni filter.</p>
          </div>
        ):null}
        {groupOrder.map(lbl=>(
          <div key={lbl}>
            <p style={{fontSize:11,fontWeight:700,color:C.textLight,letterSpacing:1,textTransform:"uppercase",marginBottom:10,marginTop:16}}>{lbl}</p>
            {groupMap.get(lbl).map(u=>(
              <div key={u.id} className="fi" style={{background:C.bgCard,borderRadius:22,marginBottom:10,overflow:"hidden",cursor:"pointer",boxShadow:`0 2px 14px rgba(122,158,142,0.08)`,border:`1px solid ${C.border}`,borderLeft:`4px solid ${bc(u.ish)}`}} onClick={()=>setOtvoren(otvoren===u.id?null:u.id)}>
                <div style={{padding:"14px 18px 14px 16px"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <div style={{width:28,height:28,borderRadius:8,background:bc(u.ish)+"18",display:"flex",alignItems:"center",justifyContent:"center"}}>
                        <Ico d={u.ish==="res"?I.check:u.ish==="try"?I.spark:I.x} size={13} stroke={bc(u.ish)} sw={2.5}/>
                      </div>
                      <span style={{fontSize:13,fontWeight:700,color:bc(u.ish)}}>{bl(u.ish)}</span>
                    </div>
                    <span style={{fontSize:11,color:C.textLight,fontWeight:600}}>{u.datum}</span>
                  </div>
                  <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                    {(Array.isArray(u.ok)?u.ok:[u.ok]).filter(Boolean).map(o=><span key={o} className="tag" style={{background:C.primaryLight,color:C.primaryDark}}>{o}</span>)}
                    <span className="tag" style={{background:C.bgMuted,color:C.textMid}}>⚡ {u.int}/10</span>
                    {u.lok&&<span className="tag" style={{background:C.bgMuted,color:C.textMid}}>{u.lok}</span>}
                  </div>
                </div>
                {otvoren===u.id&&(
                  <div className="fi" style={{borderTop:`1px solid ${C.border}`,padding:"14px 18px 14px 16px"}}>
                    {u.epre&&<div style={{display:"flex",gap:10,marginBottom:10}}>
                      <span style={{fontSize:12,color:C.textLight,fontWeight:600}}>Pre: <span style={{color:C.textMid}}>{u.epre}</span></span>
                      {u.epost&&<span style={{fontSize:12,color:C.textLight,fontWeight:600}}>Posle: <span style={{color:C.textMid}}>{u.epost}</span></span>}
                    </div>}
                    {u.bel&&<p style={{fontSize:13,color:C.textMid,lineHeight:1.7,fontWeight:500,marginBottom:12,fontStyle:"italic"}}>"{u.bel}"</p>}
                    {u.slike?.length>0&&<div style={{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap"}}>{u.slike.map((s,i)=><img key={i} src={s} alt="" style={{width:76,height:76,borderRadius:14,objectFit:"cover"}}/>)}</div>}
                    <div style={{display:"flex",gap:8}}>
                      <button onClick={e=>{e.stopPropagation();onIzmeni(u);}} style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:6,padding:"11px 0",borderRadius:14,border:`1.5px solid ${C.border}`,background:C.bgMuted,color:C.textMid,fontWeight:600,fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>
                        <Ico d={I.edit} size={14} stroke={C.textMid} sw={2}/>Izmeni
                      </button>
                      {potvrda===u.id
                        ?<button onClick={e=>{e.stopPropagation();onObrisi(u.id);setPotvrda(null);setOtvoren(null);}} style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:6,padding:"11px 0",borderRadius:14,border:"none",background:C.red,color:"#fff",fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>
                            <Ico d={I.check} size={14} stroke="#fff" sw={2.5}/>Potvrdi
                          </button>
                        :<button onClick={e=>{e.stopPropagation();setPotvrda(u.id);}} style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:6,padding:"11px 0",borderRadius:14,border:`1.5px solid ${C.red}30`,background:`${C.red}08`,color:C.red,fontWeight:600,fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>
                            <Ico d={I.trash} size={14} stroke={C.red} sw={1.8}/>Obriši
                          </button>
                      }
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function Napredak({unosi,niz}){
  const OKI_BOJE=[C.primary,C.purple,C.amber,C.green,C.textLight];
  const total=unosi.length;

  // rekordni niz
  function calcBest(){
    const withTs=unosi.filter(e=>e.ts).sort((a,b)=>a.ts-b.ts);
    if(!withTs.length) return 0;
    const badSet=new Set(withTs.filter(e=>e.ish==="try"||e.ish==="ep").map(e=>{const d=new Date(e.ts);return`${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;}));
    const start=new Date(withTs[0].ts);const today=new Date();
    const tot=Math.floor((today-start)/86400000)+1;
    let best=0,cur=0;
    for(let i=0;i<tot;i++){
      const d=new Date(start.getTime()+i*86400000);
      const k=`${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      if(!badSet.has(k)){cur++;best=Math.max(best,cur);}else cur=0;
    }
    return best;
  }
  const best=calcBest();
  const resCount=unosi.filter(e=>e.ish==="res").length;
  const resP=total?Math.round(resCount/total*100):0;

  // 7-day calendar
  const dani=["ned","pon","uto","sre","čet","pet","sub"];
  const sedmica=Array.from({length:7},(_,i)=>{
    const d=new Date();d.setHours(0,0,0,0);d.setDate(d.getDate()-6+i);
    const du=unosi.filter(e=>e.ts&&new Date(e.ts).toDateString()===d.toDateString());
    const hasEp=du.some(e=>e.ish==="ep");
    const hasTry=du.some(e=>e.ish==="try");
    const hasRes=du.some(e=>e.ish==="res");
    const isToday=i===6;
    const isPast=!isToday;
    const status=hasEp?"ep":hasTry?"try":hasRes?"res":(isPast?"clean":"none");
    const epCount=du.filter(e=>e.ish==="ep").length;
    const tryCount=du.filter(e=>e.ish==="try").length;
    const resCount=du.filter(e=>e.ish==="res").length;
    return{dan:dani[d.getDay()],status,isToday,epCount,tryCount,resCount};
  });

  // this week vs last week (episodes+attempts)
  const now=Date.now();
  const thisWkEp=unosi.filter(e=>e.ts&&e.ts>=now-7*86400000&&(e.ish==="ep"||e.ish==="try")).length;
  const lastWkEp=unosi.filter(e=>e.ts&&e.ts>=now-14*86400000&&e.ts<now-7*86400000&&(e.ish==="ep"||e.ish==="try")).length;

  // 8-week bar chart (episodes per week)
  const sedmice=Array.from({length:8},(_,i)=>{
    const s=now-(8-i)*7*86400000,e2=now-(7-i)*7*86400000;
    const ep=unosi.filter(u=>u.ts&&u.ts>=s&&u.ts<e2&&(u.ish==="ep"||u.ish==="try")).length;
    const res=unosi.filter(u=>u.ts&&u.ts>=s&&u.ts<e2&&u.ish==="res").length;
    const d=new Date(s);
    return{ep,res,label:`${d.getDate()}.${d.getMonth()+1}`,isLast:i===7};
  });
  const maxSed=Math.max(...sedmice.map(s=>s.ep+s.res),1);

  // time of day for episodes
  const tod={jutro:0,popodne:0,vece:0,noc:0};
  unosi.filter(e=>e.ts&&(e.ish==="ep"||e.ish==="try")).forEach(e=>{
    const h=new Date(e.ts).getHours();
    if(h>=6&&h<12)tod.jutro++;else if(h>=12&&h<18)tod.popodne++;else if(h>=18&&h<22)tod.vece++;else tod.noc++;
  });
  const todTotal=Object.values(tod).reduce((a,b)=>a+b,0)||1;
  const todMax=Math.max(...Object.values(tod));
  const epTotal=unosi.filter(e=>e.ish==="ep"||e.ish==="try").length;

  // triggers
  const okCounts={};
  unosi.forEach(e=>{(Array.isArray(e.ok)?e.ok:[e.ok]).filter(Boolean).forEach(o=>{okCounts[o]=(okCounts[o]||0)+1;});});
  const totalOk=Object.values(okCounts).reduce((a,b)=>a+b,0)||1;
  const topOki=Object.entries(okCounts).sort((a,b)=>b[1]-a[1]).slice(0,5).map(([l,n],i)=>({l,p:Math.round(n/totalOk*100),c:OKI_BOJE[i]}));

  // dynamic insight message
  let insight,insightBg,insightC;
  if(thisWkEp===0&&total>0){insight="Bez epizoda ovog sedmica";insightBg=C.greenLight;insightC=C.green;}
  else if(thisWkEp<lastWkEp&&lastWkEp>0){const d=lastWkEp-thisWkEp;insight=`${d} manje epizod${d===1?"a":"a"} nego prošle sedmice`;insightBg=C.greenLight;insightC=C.green;}
  else if(niz>=7){insight=`${niz} dana niza — sjajno`;insightBg=C.greenLight;insightC=C.green;}
  else if(thisWkEp>lastWkEp&&lastWkEp>0){insight="Teža sedmica — svaki pokušaj se računa";insightBg=C.amberLight;insightC=C.amber;}
  else{insight="Pratiš sebe — to je već napredak";insightBg=C.primaryLight;insightC=C.primary;}

  if(total===0) return(
    <div style={{paddingBottom:90}} className="fi">
      <div style={{position:"sticky",top:0,zIndex:10,background:C.bgCard,borderBottom:`1px solid ${C.border}`,boxShadow:`0 2px 8px ${C.shadow}`,paddingTop:HDR_PT,paddingLeft:24,paddingRight:24,paddingBottom:14}}>
        <span style={{display:"inline-block",background:C.primaryLight,color:C.primary,fontSize:10,fontWeight:800,letterSpacing:1,textTransform:"uppercase",padding:"3px 10px",borderRadius:100,marginBottom:7}}>Napredak</span>
        <h1 className="serif" style={{fontSize:24,color:C.text,letterSpacing:-0.3}}>Tvoje statistike</h1>
      </div>
      <div style={{margin:"24px 20px 0",borderRadius:24,background:C.bgCard,padding:"40px 24px",textAlign:"center",border:`1px solid ${C.border}`}}>
        <div style={{width:60,height:60,borderRadius:18,background:C.primaryLight,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px"}}><Ico d={I.chart} size={26} stroke={C.primary} sw={1.8}/></div>
        <p style={{fontWeight:700,fontSize:17,color:C.text,marginBottom:8}}>Još nema podataka</p>
        <p style={{fontSize:14,color:C.textLight,lineHeight:1.7}}>Unesi prvu epizodu i pratićeš napredak ovde.</p>
      </div>
    </div>
  );

  return(
    <div style={{paddingBottom:90}} className="fi">

      {/* Header + insight */}
      <div style={{position:"sticky",top:0,zIndex:10,background:C.bgCard,borderBottom:`1px solid ${C.border}`,boxShadow:`0 2px 8px ${C.shadow}`,paddingTop:HDR_PT,paddingLeft:20,paddingRight:20,paddingBottom:14}}>
        <span style={{display:"inline-block",background:C.primaryLight,color:C.primary,fontSize:10,fontWeight:800,letterSpacing:1,textTransform:"uppercase",padding:"3px 10px",borderRadius:100,marginBottom:7}}>Napredak</span>
        <h1 className="serif" style={{fontSize:24,fontWeight:700,color:C.text,letterSpacing:-0.3,lineHeight:1}}>Tvoje statistike</h1>
        <div style={{marginTop:10,background:insightBg,borderRadius:14,padding:"9px 14px",display:"flex",alignItems:"center",gap:8}}>
          <div style={{width:7,height:7,borderRadius:"50%",background:insightC,flexShrink:0}}/>
          <span style={{fontSize:13,fontWeight:700,color:insightC,lineHeight:1.3}}>{insight}</span>
        </div>
      </div>

      {/* Sekcija 1 — 7-day calendar */}
      <div style={{margin:"16px 20px 10px",background:C.bgCard,borderRadius:24,padding:"18px",border:`1px solid ${C.border}`}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <p style={{fontSize:13,fontWeight:700,color:C.text}}>Ova nedelja</p>
          <div style={{display:"flex",gap:10}}>
            {[{c:C.red,l:"Epizoda"},{c:C.amber,l:"Pokušaj"},{c:C.green,l:"Odolelo"}].map(x=>(
              <div key={x.l} style={{display:"flex",alignItems:"center",gap:4}}>
                <div style={{width:6,height:6,borderRadius:"50%",background:x.c}}/>
                <span style={{fontSize:9,color:C.textLight,fontWeight:600}}>{x.l}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{display:"flex",gap:5}}>
          {sedmica.map((d,i)=>{
            const bg=d.status==="ep"?C.red:d.status==="try"?C.amber:(d.status==="res"||d.status==="clean")?C.greenLight:d.isToday?C.primaryLight:C.bgMuted;
            const fg=d.status==="ep"||d.status==="try"?"#fff":(d.status==="res"||d.status==="clean")?C.green:d.isToday?C.primary:C.textLight;
            const ico=d.status==="ep"?"✕":d.status==="try"?"∼":(d.status==="res"||d.status==="clean")?"✓":d.isToday?"·":"";
            return(
              <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:5}}>
                <div style={{width:"100%",aspectRatio:"1",borderRadius:10,background:bg,border:d.isToday&&d.status==="none"?`2px solid ${C.primary}`:"2px solid transparent",display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <span style={{fontSize:13,fontWeight:800,color:fg,lineHeight:1}}>{ico}</span>
                </div>
                <span style={{fontSize:9,fontWeight:d.isToday?800:500,color:d.isToday?C.primary:C.textLight,textTransform:"uppercase",letterSpacing:0.3}}>{d.dan}</span>
              </div>
            );
          })}
        </div>
        <div style={{display:"flex",marginTop:14,paddingTop:14,borderTop:`1px solid ${C.border}`}}>
          {[
            {l:"Epizoda",v:sedmica.reduce((s,d)=>s+d.epCount,0),c:C.red},
            {l:"Pokušaja",v:sedmica.reduce((s,d)=>s+d.tryCount,0),c:C.amber},
            {l:"Odolelo",v:sedmica.reduce((s,d)=>s+d.resCount,0)+sedmica.filter(d=>d.status==="clean").length,c:C.green},
          ].map((s,i)=>(
            <div key={s.l} style={{flex:1,textAlign:"center",borderRight:i<2?`1px solid ${C.border}`:"none"}}>
              <p style={{fontSize:22,fontWeight:900,color:s.v>0?s.c:C.textLight,lineHeight:1,marginBottom:3}}>{s.v}</p>
              <p style={{fontSize:9,fontWeight:600,color:C.textLight,textTransform:"uppercase",letterSpacing:0.4}}>{s.l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Sekcija 2 — 8-week bar trend */}
      <div style={{margin:"0 20px 10px",background:C.bgCard,borderRadius:24,padding:"18px",border:`1px solid ${C.border}`}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
          <div>
            <p style={{fontSize:13,fontWeight:700,color:C.text,marginBottom:2}}>Trend po nedeljama</p>
            <p style={{fontSize:11,color:C.textLight}}>poslednjih 8 sedmica</p>
          </div>
          <div style={{display:"flex",gap:10}}>
            <div style={{display:"flex",alignItems:"center",gap:4}}><div style={{width:8,height:8,borderRadius:2,background:C.red+"99"}}/><span style={{fontSize:9,color:C.textLight,fontWeight:600}}>Ep</span></div>
            <div style={{display:"flex",alignItems:"center",gap:4}}><div style={{width:8,height:8,borderRadius:2,background:C.green+"99"}}/><span style={{fontSize:9,color:C.textLight,fontWeight:600}}>Res</span></div>
          </div>
        </div>
        <div style={{display:"flex",gap:4,alignItems:"flex-end",height:80}}>
          {sedmice.map((s,i)=>{
            const hEp=s.ep>0?Math.max((s.ep/maxSed)*68,6):0;
            const hRes=s.res>0?Math.max((s.res/maxSed)*68,4):0;
            return(
              <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
                <div style={{width:"100%",display:"flex",flexDirection:"column",justifyContent:"flex-end",height:72,gap:1}}>
                  {s.ep>0&&<div style={{width:"100%",height:hEp,background:s.isLast?C.red:C.red+"66",borderRadius:"4px 4px 0 0"}}/>}
                  {s.res>0&&<div style={{width:"100%",height:hRes,background:s.isLast?C.green:C.green+"66",borderRadius:s.ep>0?"0 0 0 0":"4px 4px 0 0"}}/>}
                  {s.ep===0&&s.res===0&&<div style={{width:"100%",height:3,background:C.bgMuted,borderRadius:2}}/>}
                </div>
                <span style={{fontSize:8,fontWeight:s.isLast?700:400,color:s.isLast?C.primary:C.textLight}}>{s.isLast?"ova":s.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sekcija 3 — key numbers */}
      <div style={{margin:"0 20px 10px",display:"flex",gap:8}}>
        {[
          {v:String(niz),l:"Trenutni niz",sub:"dana",bg:C.primaryLight,c:C.primary},
          {v:String(best),l:"Rekord",sub:"dana",bg:C.amberLight,c:C.amber},
          {v:`${resP}%`,l:"Odolelo",sub:"ukupno",bg:C.greenLight,c:C.green},
        ].map(s=>(
          <div key={s.l} style={{flex:1,background:s.bg,borderRadius:20,padding:"14px 8px",textAlign:"center"}}>
            <p style={{fontSize:24,fontWeight:900,color:C.text,lineHeight:1,marginBottom:2}}>{s.v}</p>
            <p style={{fontSize:9,fontWeight:700,color:s.c,letterSpacing:0.5,textTransform:"uppercase",lineHeight:1.3}}>{s.l}</p>
          </div>
        ))}
      </div>

      {/* Sekcija 4 — doba dana (samo kad ima dovoljno podataka) */}
      {epTotal>=4&&(
        <div style={{margin:"0 20px 10px",background:C.bgCard,borderRadius:24,padding:"18px",border:`1px solid ${C.border}`}}>
          <p style={{fontSize:13,fontWeight:700,color:C.text,marginBottom:2}}>Kada se najčešće dešava</p>
          <p style={{fontSize:11,color:C.textLight,marginBottom:18}}>doba dana tokom epizoda i pokušaja</p>
          <div style={{display:"flex",gap:8,alignItems:"flex-end"}}>
            {[
              {k:"jutro",l:"Jutro",t:"6–12h",v:tod.jutro},
              {k:"popodne",l:"Podne",t:"12–18h",v:tod.popodne},
              {k:"vece",l:"Veče",t:"18–22h",v:tod.vece},
              {k:"noc",l:"Noć",t:"22–6h",v:tod.noc},
            ].map(t=>{
              const isTop=t.v===todMax&&t.v>0;
              const barH=t.v>0?Math.max((t.v/todMax)*60,8):4;
              return(
                <div key={t.k} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:0}}>
                  {isTop&&<span style={{fontSize:9,fontWeight:700,color:C.primary,marginBottom:4}}>najčešće</span>}
                  <div style={{display:"flex",flexDirection:"column",justifyContent:"flex-end",height:64,width:"100%"}}>
                    <div style={{width:"100%",height:barH,background:isTop?C.primary:t.v>0?C.primary+"44":C.bgMuted,borderRadius:"6px 6px 0 0"}}/>
                  </div>
                  <div style={{width:"100%",height:1,background:C.border,marginBottom:8}}/>
                  <p style={{fontSize:10,fontWeight:isTop?800:500,color:isTop?C.text:C.textMid,marginBottom:2,textAlign:"center"}}>{t.l}</p>
                  <p style={{fontSize:9,color:C.textLight,textAlign:"center"}}>{t.t}</p>
                  {t.v>0&&<p style={{fontSize:11,fontWeight:700,color:isTop?C.primary:C.textMid,marginTop:4}}>{Math.round(t.v/todTotal*100)}%</p>}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Sekcija 5 — okidači */}
      {topOki.length>0&&(
        <div style={{margin:"0 20px",background:C.bgCard,borderRadius:24,padding:"18px",border:`1px solid ${C.border}`}}>
          <p style={{fontSize:13,fontWeight:700,color:C.text,marginBottom:2}}>Najčešći okidači</p>
          <p style={{fontSize:11,color:C.textLight,marginBottom:16}}>šta prethodi epizodama</p>
          {topOki.map((o,i)=>(
            <div key={o.l} style={{marginBottom:i<topOki.length-1?14:0}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <div style={{width:7,height:7,borderRadius:"50%",background:o.c,flexShrink:0}}/>
                  <span style={{fontSize:14,color:C.text,fontWeight:600}}>{o.l}</span>
                </div>
                <span style={{fontSize:13,fontWeight:800,color:o.c}}>{o.p}%</span>
              </div>
              <div style={{height:5,background:C.bgMuted,borderRadius:100,overflow:"hidden"}}>
                <div style={{height:"100%",width:`${o.p}%`,background:o.c,borderRadius:100}}/>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const CLANCI=[
  {e:"🧠",n:"Šta je dermatilomanija?",k:"Edukacija",v:"5 min",sadrzaj:[
    {tip:"uvod",t:"Dermatilomanija (ekskoriozni poremećaj) je kompulzivno ponavljano čačkanje, grebanje ili šćipanje kože — često do tačke oštećenja."},
    {tip:"naslov",t:"Koliko je česta?"},
    {tip:"tekst",t:"Pogađa oko 1,4–5,4% populacije. Nije retkost — samo retko o tome govorimo. Mnoge osobe godinama ne znaju da postoji naziv za ono što doživljavaju."},
    {tip:"naslov",t:"Zašto se to dešava?"},
    {tip:"tekst",t:"Mozak tokom čačkanja otpušta dopamin. To stvara krug: napetost → čačkanje → privremeno olakšanje → krivica → napetost. Nije stvar volje, već neurobiologije."},
    {tip:"naslov",t:"Da li je to OKP?"},
    {tip:"tekst",t:"Dermatilomanija spada u grupu poremećaja sličnih OKP-u, zajedno sa trichotilomanijom i grickanjem noktiju. Sve su to BFRB — poremećaji fokusirani na telo."},
    {tip:"vazno",t:"Ovo nije slabost karaktera. Ovo je poremećaj koji se može lečiti i koji reaguje na terapiju."},
  ]},
  {e:"🔄",n:"HRT — Trening zamene navika",k:"Tehnika",v:"8 min",sadrzaj:[
    {tip:"uvod",t:"Habit Reversal Training (HRT) je najevidencijom potkrepljena tehnika za lečenje BFRB poremećaja. Pomaže da zamenite automatsko čačkanje svesnom alternativnom radnjom."},
    {tip:"naslov",t:"Korak 1 — Osvestiti"},
    {tip:"tekst",t:"Primetite tačno kada i kako čačkate. Koje ruke koristite? U kom položaju sedite? Koristite dnevnik u ovoj aplikaciji da zabeležite obrasce."},
    {tip:"naslov",t:"Korak 2 — Prepoznati okidač"},
    {tip:"tekst",t:"Svako čačkanje ima okidač — stres, dosada, koncentracija, ogledalo. Kada prepoznate okidač, možete da reagujete pre nego što počne automatska radnja."},
    {tip:"naslov",t:"Korak 3 — Konkurentska radnja"},
    {tip:"tekst",t:"Izaberite radnju nespojiva sa čačkanjem i koristite je čim osetite impuls: stiskanje šake, nošenje gumice, stavljanje kreme na ruke."},
    {tip:"vazno",t:"Vežbajte konkurentsku radnju svaki dan — čak i kada nema impulsa. Mozak uči kroz ponavljanje."},
  ]},
  {e:"🧘",n:"Mindfulnes za BFRB",k:"Tehnika",v:"6 min",sadrzaj:[
    {tip:"uvod",t:"Mindfulnes znači svesno prisustvo — primećivanje misli, osećanja i telesnih senzacija bez osude. Za BFRB, ovo stvara prostor između impulsa i radnje."},
    {tip:"naslov",t:"Tehnika SURF"},
    {tip:"tekst",t:"Kada osetite impuls, zamislite ga kao talas. Talasi rastu, dostignu vrhunac i opadaju sami od sebe. Vaš zadatak je da posmatrate, ne da zaustavljate."},
    {tip:"naslov",t:"Body scan (5 minuta)"},
    {tip:"tekst",t:"Zatvorite oči. Polako od glave do prstiju primećujte napetost u telu. Dišite u ta mesta. Samo primećujte."},
    {tip:"vazno",t:"Cilj mindfulnesa nije eliminisati impulse — već promeniti vaš odnos prema njima."},
  ]},
  {e:"💬",n:"Kako nekome reći o tome",k:"Podrška",v:"3 min",sadrzaj:[
    {tip:"uvod",t:"Govoriti nekome o dermatilomaniji može biti zastrašujuće. Strah od osude je realan. Ali pravi ljudi zaslužuju da razumeju šta proživljavate."},
    {tip:"naslov",t:"Kome reći?"},
    {tip:"tekst",t:"Počnite sa osobom kojoj najviše verujete — partnerom, prijateljicom, sestrom. Ne morate reći svima. Jedna razumevajuća osoba može napraviti ogromnu razliku."},
    {tip:"naslov",t:"Ako ne reaguju dobro"},
    {tip:"tekst",t:"Ponekad ljudi ne razumeju odmah. To nije odraz vaše vrednosti. Ako ostanu nerazumevajući, to govori o njima, ne o vama."},
    {tip:"vazno",t:"Ne nosite ovo sami. Podrška okoline je jedan od najjačih faktora oporavka."},
  ]},
  {e:"💆",n:"Stres kao okidač",k:"Edukacija",v:"4 min",sadrzaj:[
    {tip:"uvod",t:"Stres je jedan od najčešćih okidača za čačkanje. Razumevanje te veze pomaže da se bolje pripremite u teškim momentima."},
    {tip:"naslov",t:"Zašto stres pokreće čačkanje?"},
    {tip:"tekst",t:"Kada smo pod stresom, telo traži načine da se reguliše. Čačkanje pruža trenutno oslobađanje napetosti — to je telo koje pokušava da se umiri na jedini način koji zna."},
    {tip:"naslov",t:"Prepoznajte svoje okidače"},
    {tip:"tekst",t:"Ispiti, rokovi, svađe, dosada, gledanje u ekran — svako ima svoje. Koristite dnevnik u aplikaciji da pratite kada se čačkanje pojavljuje i šta mu prethodi."},
    {tip:"vazno",t:"Okidač nije krivac. On je signal da vam je potrebna briga o sebi."},
  ]},
  {e:"🌬️",n:"Disanje koje smiruje",k:"Tehnika",v:"4 min",sadrzaj:[
    {tip:"uvod",t:"Dijafragmalno disanje aktivira parasimpatički nervni sistem — deo koji smiruje telo i smanjuje impuls za čačkanjem."},
    {tip:"naslov",t:"Tehnika 4-7-8"},
    {tip:"tekst",t:"Udahnite 4 sekunde. Zadržite 7 sekundi. Polako izdahnite 8 sekundi. Ponovite 4 puta. Ova tehnika brzo snižava kortizol i smiruje nervni sistem."},
    {tip:"naslov",t:"Kvadratno disanje (Box breathing)"},
    {tip:"tekst",t:"Udahnite 4 sekunde → zadržite 4 → izdahnite 4 → zadržite 4. Ovaj ritam koriste vojnici i sportisti za brzu regulaciju stresa."},
    {tip:"vazno",t:"Vežbajte disanje i kada niste u krizi — tada će biti dostupno kada vam zatreba."},
  ]},
  {e:"🤲",n:"Barijere i alternative",k:"Tehnika",v:"5 min",sadrzaj:[
    {tip:"uvod",t:"Fizičke barijere između ruku i kože su jedna od najefikasnijih strategija — posebno za period dok gradite svest o okidačima."},
    {tip:"naslov",t:"Šta funkcioniše?"},
    {tip:"tekst",t:"Flasteri na mestima koja najčešće čačkate, rukavice dok radite za računarom, duge rukave, nošenje stres lopte ili fidzet igračke u džepu."},
    {tip:"naslov",t:"Alternative koje pomažu"},
    {tip:"tekst",t:"Masaža kremom za ruke, kotrljanje olovke između prstiju, igranje sa kosom, gnetenje plastelina. Cilj je da ruke budu zauzete nečim bezopasnim."},
    {tip:"vazno",t:"Barijere nisu rešenje — one su most dok učite nove obrasce. Koristite ih bez stida."},
  ]},
  {e:"🌙",n:"Čačkanje pre spavanja",k:"Edukacija",v:"4 min",sadrzaj:[
    {tip:"uvod",t:"Večernje sate mnoge osobe opisuju kao najtežepostoji poseban razlog — telo i mozak su umorniji, a kontrola impulsa slabija."},
    {tip:"naslov",t:"Zašto baš uveče?"},
    {tip:"tekst",t:"Prefrontalni korteks — deo mozga zadužen za kontrolu — slabi tokom dana od umora. Uveče je doslovno teže odoleti impulsima nego ujutru."},
    {tip:"naslov",t:"Večernja rutina koja pomaže"},
    {tip:"tekst",t:"Topla kupka ili tuš pre spavanja, kratka meditacija, čitanje fizičke knjige, stavljanje kreme na lice i ruke — sve to smanjuje napetost i signalizira mozgu da je vreme za odmor."},
    {tip:"vazno",t:"Planirajte večernju rutinu unapred — umoran mozak loše donosi odluke u poslednji čas."},
  ]},
  {e:"💪",n:"Proslavljanje malih pobeda",k:"Podrška",v:"3 min",sadrzaj:[
    {tip:"uvod",t:"Oporavak nije linearan. Jedan dobar dan, pa loš — to nije neuspeh, to je proces. Naučiti slaviti male pobede menja sve."},
    {tip:"naslov",t:"Šta je mala pobeda?"},
    {tip:"tekst",t:"Primetila si impuls pre nego što si počela. Zaustavila si se posle par sekundi. Pitala si se 'šta osećam?' umesto da čačkaš automatski. Sve ovo je napredak."},
    {tip:"naslov",t:"Kako proslaviti?"},
    {tip:"tekst",t:"Zabeležite u dnevniku. Recite sebi naglas 'dobro sam uradila'. Pošaljite poruku osobi koja vas podržava. Mali rituali učvršćuju nova neurološka kola u mozgu."},
    {tip:"vazno",t:"Ne čekaj 'savršen dan' da bi bila ponosna na sebe. Svaki korak se računa."},
  ]},
  {e:"🏥",n:"Kada potražiti pomoć?",k:"Podrška",v:"4 min",sadrzaj:[
    {tip:"uvod",t:"Dermatilomanija je medicinski poremećaj i postoje stručnjaci koji mogu da pomognu. Tražiti pomoć je čin hrabrosti, ne slabosti."},
    {tip:"naslov",t:"Znaci da je vreme za stručnjaka"},
    {tip:"tekst",t:"Čačkanje uzrokuje vidljive rane ili infekcije, utiče na svakodnevni život, posao ili odnose, osećaš stid koji te sprečava da izlaziš ili nosiš određenu odeću, pokušavala si da prestaneš ali ne uspeva."},
    {tip:"naslov",t:"Ko može da pomogne?"},
    {tip:"tekst",t:"Psiholog ili psihoterapeut sa iskustvom u KBT i HRT terapiji, psihijatar ako se razmatra medikamentna podrška. U Srbiji možeš početi od izabranog lekara koji može da uputi."},
    {tip:"vazno",t:"Ova aplikacija je podrška — ne zamena za terapiju. Ako osećaš da ti treba više, potraži stručnjaka."},
  ]},
];
const kBoja=k=>k==="Edukacija"?[C.purpleLight,C.purple]:k==="Tehnika"?[C.primaryLight,C.primaryDark]:[C.amberLight,C.amber];

function Clanak({clanak,onNazad}){
  const [b,f]=kBoja(clanak.k);
  return(
    <div style={{paddingTop:HDR_PT,paddingLeft:20,paddingRight:20,paddingBottom:48}} className="fi">
      <button className="btn-g" style={{marginBottom:24}} onClick={onNazad}><Ico d={I.back} size={18} stroke={C.textMid}/> Biblioteka</button>
      <div style={{display:"flex",gap:16,alignItems:"center",marginBottom:30}}>
        <div style={{width:64,height:64,borderRadius:20,background:b,display:"flex",alignItems:"center",justifyContent:"center",fontSize:32,flexShrink:0}}>{clanak.e}</div>
        <div>
          <span className="tag" style={{background:b,color:f,fontSize:11,marginBottom:8,display:"inline-block"}}>{clanak.k}</span>
          <h2 className="serif" style={{fontSize:22,lineHeight:1.3,letterSpacing:-0.3}}>{clanak.n}</h2>
          <span style={{fontSize:12,color:C.textLight,fontWeight:600}}>{clanak.v} čitanja</span>
        </div>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:18}}>
        {clanak.sadrzaj.map((s,i)=>{
          if(s.tip==="uvod") return<div key={i} style={{background:b,borderRadius:20,padding:"20px 22px"}}><p style={{fontSize:16,color:C.text,lineHeight:1.8,fontStyle:"italic",fontFamily:"'Playfair Display',serif"}}>{s.t}</p></div>;
          if(s.tip==="naslov") return<h3 key={i} className="serif" style={{fontSize:20,color:C.text,marginTop:4,marginBottom:-8,letterSpacing:-0.2}}>{s.t}</h3>;
          if(s.tip==="tekst") return<p key={i} style={{fontSize:15,color:C.textMid,lineHeight:1.85,fontWeight:500}}>{s.t}</p>;
          if(s.tip==="vazno") return<div key={i} style={{background:C.primaryLight,borderLeft:`4px solid ${C.primary}`,borderRadius:"0 16px 16px 0",padding:"16px 20px"}}><p style={{fontSize:15,color:C.primaryDark,lineHeight:1.7,fontWeight:600}}>{s.t}</p></div>;
          return null;
        })}
      </div>
    </div>
  );
}

function Biblioteka(){
  const [otvoren,setOtvoren]=useState(null);
  if(otvoren!==null) return<Clanak clanak={CLANCI[otvoren]} onNazad={()=>setOtvoren(null)}/>;
  return(
    <div style={{paddingBottom:20}} className="fi">
      <div style={{position:"sticky",top:0,zIndex:10,background:C.bgCard,borderBottom:`1px solid ${C.border}`,boxShadow:`0 2px 8px ${C.shadow}`,paddingTop:HDR_PT,paddingLeft:24,paddingRight:24,paddingBottom:14}}>
        <span style={{display:"inline-block",background:C.primaryLight,color:C.primary,fontSize:10,fontWeight:800,letterSpacing:1,textTransform:"uppercase",padding:"3px 10px",borderRadius:100,marginBottom:7}}>Resursi</span>
        <h1 className="serif" style={{fontSize:24,letterSpacing:-0.3}}>Biblioteka</h1>
      </div>
      <div style={{padding:"16px 20px 0"}}>
        {CLANCI.map((a,idx)=>{const [b,f]=kBoja(a.k);return(
          <div key={a.n} className="card fi" style={{marginBottom:12,display:"flex",gap:14,alignItems:"center",cursor:"pointer"}} onClick={()=>setOtvoren(idx)}>
            <div style={{width:58,height:58,borderRadius:18,background:b,display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,flexShrink:0}}>{a.e}</div>
            <div style={{flex:1}}>
              <span className="tag" style={{background:b,color:f,marginBottom:6,fontSize:11,display:"inline-block"}}>{a.k}</span>
              <p style={{fontWeight:700,fontSize:15,lineHeight:1.3,marginBottom:2}}>{a.n}</p>
              <span style={{fontSize:12,color:C.textLight,fontWeight:600}}>{a.v} čitanja</span>
            </div>
            <div style={{width:34,height:34,borderRadius:"50%",background:C.bgMuted,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <Ico d={I.chev} size={14} stroke={C.textLight} sw={2.5}/>
            </div>
          </div>
        );})}
      </div>
    </div>
  );
}

const NAV=[{id:"poc",l:"Početna",ico:"home"},{id:"dnv",l:"Dnevnik",ico:"journal"},{id:"nap",l:"Napredak",ico:"chart"},{id:"bib",l:"Biblioteka",ico:"library"},{id:"chat",l:"Chat",ico:"chat"}];

function Profil({kor,onLogout,onNotif,notifStatus}){
  const [menjaLozinku,setMenjaLozinku]=useState(false);
  const [novaLoz,setNovaLoz]=useState("");
  const [potvrda,setPotvrda]=useState("");
  const [poruka,setPoruka]=useState(null);
  const [loading,setLoading]=useState(false);
  const initijali=(kor?.ime||"").split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase()||"🌸";

  async function promeniLozinku(){
    if(novaLoz!==potvrda){setPoruka({tip:"greska",t:"Lozinke se ne podudaraju."});return;}
    if(novaLoz.length<6){setPoruka({tip:"greska",t:"Lozinka mora imati najmanje 6 karaktera."});return;}
    setLoading(true);
    const{error}=await supabase.auth.updateUser({password:novaLoz});
    setLoading(false);
    if(error){setPoruka({tip:"greska",t:error.message});return;}
    setPoruka({tip:"ok",t:"Lozinka uspešno promenjena! 🎉"});
    setMenjaLozinku(false);setNovaLoz("");setPotvrda("");
  }

  return(
    <div style={{minHeight:"100vh",background:C.bg}} className="fi">
      {/* Header */}
      <div style={{paddingTop:HDR_PT,paddingBottom:32,paddingLeft:24,paddingRight:24,background:`linear-gradient(160deg,#FFF8FA 0%,#FAE0EB 100%)`,borderBottom:`1px solid ${C.border}`}}>
        <span style={{display:"inline-block",background:"rgba(192,120,144,.13)",color:C.primary,fontSize:10,fontWeight:800,letterSpacing:1.5,textTransform:"uppercase",padding:"3px 10px",borderRadius:100,marginBottom:16}}>Nalog</span>
        <div style={{display:"flex",alignItems:"center",gap:16}}>
          <div style={{width:64,height:64,borderRadius:22,background:C.primaryGrad,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,boxShadow:`0 4px 16px rgba(192,120,144,.3)`}}>
            <span style={{fontSize:initijali.length>1?20:26,fontWeight:800,color:"#fff",fontFamily:"'DM Sans',sans-serif"}}>{initijali}</span>
          </div>
          <div>
            <p style={{fontWeight:800,fontSize:18,color:C.text,marginBottom:3,letterSpacing:-0.3}}>{kor?.ime||"Korisnik"}</p>
            <p style={{fontSize:13,color:C.textMid,fontWeight:500}}>{kor?.email||""}</p>
          </div>
        </div>
      </div>

      <div style={{padding:"20px 20px",display:"flex",flexDirection:"column",gap:10}}>
        {/* Notifikacije */}
        {notifStatus!=="granted"?(
          <button onClick={isPWA?onNotif:undefined} style={{width:"100%",background:C.bgCard,border:`1.5px solid ${C.border}`,borderRadius:18,padding:"15px 18px",display:"flex",alignItems:"center",gap:14,cursor:isPWA?"pointer":"default",fontFamily:"inherit",textAlign:"left"}}>
            <div style={{width:42,height:42,borderRadius:14,background:C.primaryLight,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>🔔</div>
            <div style={{flex:1}}>
              <p style={{fontWeight:700,fontSize:14,color:C.text,marginBottom:2}}>Uključi podsetnik</p>
              <p style={{fontSize:12,color:C.textLight}}>{isPWA?"Tapni da uključiš dnevnu notifikaciju":"Dodaj app na početni ekran da bi primala podsetnike"}</p>
            </div>
            {isPWA&&<Ico d={I.chev} size={14} stroke={C.textLight} sw={2.5}/>}
          </button>
        ):(
          <div style={{background:C.greenLight,borderRadius:18,padding:"15px 18px",display:"flex",alignItems:"center",gap:14,border:`1px solid rgba(122,158,120,.2)`}}>
            <div style={{width:42,height:42,borderRadius:14,background:"rgba(122,158,120,.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>🔔</div>
            <div>
              <p style={{fontWeight:700,fontSize:14,color:C.green,marginBottom:2}}>Podsetnik uključen</p>
              <p style={{fontSize:12,color:C.green,opacity:0.75}}>Svaki dan u 13h</p>
            </div>
          </div>
        )}

        {/* Promena lozinke */}
        <div style={{background:C.bgCard,borderRadius:18,border:`1px solid ${C.border}`,overflow:"hidden"}}>
          <button onClick={()=>{setMenjaLozinku(m=>!m);setPoruka(null);}} style={{width:"100%",background:"none",border:"none",padding:"15px 18px",display:"flex",alignItems:"center",gap:14,cursor:"pointer",fontFamily:"inherit"}}>
            <div style={{width:42,height:42,borderRadius:14,background:C.primaryLight,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>🔑</div>
            <div style={{textAlign:"left",flex:1}}>
              <p style={{fontWeight:700,fontSize:14,color:C.text}}>Promeni lozinku</p>
            </div>
            <Ico d={I.chev} size={14} stroke={C.textLight} sw={2.5} style={{transform:menjaLozinku?"rotate(90deg)":"none",transition:"transform .2s"}}/>
          </button>
          {menjaLozinku&&(
            <div style={{padding:"0 18px 18px",display:"flex",flexDirection:"column",gap:10,borderTop:`1px solid ${C.border}`,paddingTop:16}}>
              <input className="inp" type="password" placeholder="Nova lozinka" value={novaLoz} onChange={e=>setNovaLoz(e.target.value)}/>
              <input className="inp" type="password" placeholder="Potvrdi novu lozinku" value={potvrda} onChange={e=>setPotvrda(e.target.value)}/>
              {poruka&&<p style={{fontSize:13,color:poruka.tip==="ok"?C.green:C.red,fontWeight:600,textAlign:"center"}}>{poruka.t}</p>}
              <button onClick={promeniLozinku} disabled={loading} className="btn-p" style={{borderRadius:14,padding:"13px"}}>
                {loading?"Čuvam...":"Sačuvaj lozinku"}
              </button>
            </div>
          )}
        </div>

        {/* Odjava */}
        <button onClick={onLogout} style={{width:"100%",background:C.bgCard,border:`1.5px solid rgba(196,104,120,.25)`,borderRadius:18,padding:"15px 18px",display:"flex",alignItems:"center",gap:14,cursor:"pointer",fontFamily:"inherit"}}>
          <div style={{width:42,height:42,borderRadius:14,background:"#FFF0F2",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>🚪</div>
          <p style={{fontWeight:700,fontSize:14,color:C.red}}>Odjavi se</p>
        </button>
      </div>
    </div>
  );
}

export default function App(){
  const [faza,setFaza]=useState("loading");const [kor,setKor]=useState(null);const [ekran,setEkran]=useState("poc");
  const [priSOS,setPriSOS]=useState(false);const [priUnos,setPriUnos]=useState(false);const [editUnos,setEditUnos]=useState(null);
  const [noviUnosi,setNoviUnosi]=useState([]);
  const [isDesk,setIsDesk]=useState(typeof window!=="undefined"&&window.innerWidth>=768);
  useEffect(()=>{const h=()=>setIsDesk(window.innerWidth>=768);window.addEventListener("resize",h);return()=>window.removeEventListener("resize",h);},[]);
  const [kbOpen,setKbOpen]=useState(false);
  useEffect(()=>{
    const vv=window.visualViewport;
    if(!vv)return;
    const baseH=vv.height;
    const h=()=>setKbOpen(vv.height<baseH*0.85);
    vv.addEventListener("resize",h);
    return()=>vv.removeEventListener("resize",h);
  },[]);
  const contentRef=useRef(null);
  useEffect(()=>{if(contentRef.current)contentRef.current.scrollTop=0;},[ekran]);

  const isIOS=typeof window!=="undefined"&&/iphone|ipad|ipod/i.test(navigator.userAgent)&&!window.MSStream;
  const isIOSSafari=isIOS&&/safari/i.test(navigator.userAgent)&&!/crios|fxios/i.test(navigator.userAgent);

  const [installPrompt,setInstallPrompt]=useState(null);
  const [showInstall,setShowInstall]=useState(false);
  const [showIOSHint,setShowIOSHint]=useState(false);
  useEffect(()=>{
    const handler=(e)=>{e.preventDefault();setInstallPrompt(e);setShowInstall(true);};
    window.addEventListener("beforeinstallprompt",handler);
    if(isIOSSafari&&!isPWA){
      const dismissed=sessionStorage.getItem("iosHintDismissed");
      if(!dismissed) setTimeout(()=>setShowIOSHint(true),2500);
    }
    return()=>window.removeEventListener("beforeinstallprompt",handler);
  },[]);
  async function handleInstall(){
    if(!installPrompt) return;
    installPrompt.prompt();
    const{outcome}=await installPrompt.userChoice;
    if(outcome==="accepted") setShowInstall(false);
  }

  const [notifStatus,setNotifStatus]=useState(typeof Notification!=="undefined"?Notification.permission:"default");
  async function enableNotifications(){
    if(typeof Notification==="undefined") return;
    const permission=await Notification.requestPermission();
    setNotifStatus(permission);
    if(permission!=="granted") return;
    const sub=await subscribeToPush();
    if(!sub||!kor?.id) return;
    await supabase.from("profiles").update({push_subscription:JSON.stringify(sub)}).eq("id",kor.id);
  }
  useEffect(()=>{
    if(faza==="app"&&isPWA&&typeof Notification!=="undefined"&&Notification.permission==="default"){
      enableNotifications();
    }
  },[faza]);

  // forsiraj ažuriranje Service Workera pri svakom pokretanju
  useEffect(()=>{
    if('serviceWorker' in navigator){
      navigator.serviceWorker.getRegistrations().then(regs=>regs.forEach(r=>r.update()));
    }
  },[]);

  function hideSplash(){const s=document.getElementById("splash");if(s){s.style.transition="opacity 0.4s";s.style.opacity="0";setTimeout(()=>s.remove(),400);}}

  useEffect(()=>{
    setTimeout(hideSplash,2300);
    const cachedKey=Object.keys(localStorage).find(k=>k.startsWith('sb-')&&k.endsWith('-auth-token'));
    if(cachedKey){try{const parsed=JSON.parse(localStorage.getItem(cachedKey));if(parsed?.access_token){resolveSession({user:parsed.user||{id:parsed.user_id,email:parsed.email,user_metadata:parsed.user_metadata,created_at:parsed.created_at}});}}catch{}}
    supabase.auth.getSession().then(({data:{session}})=>{
      if(session) resolveSession(session);
      else{setFaza("auth");hideSplash();}
    });
    const {data:{subscription}}=supabase.auth.onAuthStateChange((event,session)=>{
      if(event==="SIGNED_OUT"){setFaza("auth");setKor(null);}
    });
    return()=>subscription.unsubscribe();
  },[]);

  async function resolveSession(session){
    const uid=session.user.id;
    const imePrivremeno=session.user.user_metadata?.name||session.user.email||"";
    setKor({ime:imePrivremeno,id:uid,registeredAt:session.user.created_at,email:session.user.email||""});
    // keš → instant prikaz; sveži podaci dolaze u pozadini i ažuriraju
    try{const c=localStorage.getItem(`unpick_entries_${uid}`);if(c)setNoviUnosi(JSON.parse(c));}catch{}
    setFaza("app");
    hideSplash();
    loadJournalEntries(uid);
    supabase.from("profiles").select("ime").eq("id",uid).single().then(({data,error})=>{
      if(data?.ime){setKor(prev=>({...prev,ime:data.ime}));}
      else if(error){
        // profile row missing (registered before trigger fix) — create it now
        supabase.from("profiles").upsert({id:uid,ime:imePrivremeno}).then(null,()=>{});
      }
    }).catch(()=>{});
  }

  async function loadJournalEntries(userId){
    const {data}=await supabase.from("journal_entries").select("*").eq("user_id",userId).order("created_at",{ascending:false});
    if(data){
      const entries=data.map(e=>({id:e.id,datum:new Date(e.created_at).toLocaleString("sr"),ts:new Date(e.created_at).getTime(),int:e.intensity,ok:safeParseOk(e.trigger),lok:e.location,epre:e.emotion_before,epost:e.emotion_after,ish:e.outcome,bel:e.note,slike:e.images||[]}));
      setNoviUnosi(entries);
      localStorage.setItem(`unpick_entries_${userId}`,JSON.stringify(entries));
      localStorage.setItem(`unpick_sync_${userId}`,Date.now().toString());
    }
  }

  async function handleSacuvajUnos(u){
    const {data:{session}}=await supabase.auth.getSession();
    if(editUnos){
      if(session){
        await supabase.from("journal_entries").update({
          intensity:u.int,trigger:JSON.stringify(u.ok),location:u.lok,
          emotion_before:u.epre,emotion_after:u.epost,outcome:u.ish,note:u.bel
        }).eq("id",editUnos.id);
      }
      setNoviUnosi(v=>v.map(e=>e.id===editUnos.id?{...e,int:u.int,ok:u.ok,lok:u.lok,epre:u.epre,epost:u.epost,ish:u.ish,bel:u.bel}:e));
      setEditUnos(null);setPriUnos(false);return;
    }
    if(session){
      const {data}=await supabase.from("journal_entries").insert({
        user_id:session.user.id,intensity:u.int,trigger:JSON.stringify(u.ok),location:u.lok,
        emotion_before:u.epre,emotion_after:u.epost,outcome:u.ish,note:u.bel,images:u.slike,
        created_at:new Date(u.ts).toISOString()
      }).select().single();
      if(data) setNoviUnosi(v=>[{id:data.id,datum:new Date(u.ts).toLocaleString("sr"),ts:u.ts,int:u.int,ok:u.ok,lok:u.lok,epre:u.epre,epost:u.epost,ish:u.ish,bel:u.bel,slike:u.slike},...v]);
    }else{
      setNoviUnosi(v=>[{...u,id:Date.now(),datum:"Upravo"},...v]);
    }
    setPriUnos(false);setEkran("dnv");
  }

  async function handleObrisiUnos(id){
    const {data:{session}}=await supabase.auth.getSession();
    if(session) await supabase.from("journal_entries").delete().eq("id",id);
    setNoviUnosi(v=>v.filter(e=>e.id!==id));
  }

  async function handleLogout(){
    await supabase.auth.signOut();
  }

  if(faza==="loading") return(
    <><style>{fonts}{css}</style>
    <div className="app" style={{display:"flex",alignItems:"center",justifyContent:"center",minHeight:"100vh"}}>
      <div style={{textAlign:"center"}}>
        <div style={{width:52,height:52,borderRadius:16,background:C.primaryGrad,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px",boxShadow:"0 8px 28px rgba(122,158,142,.35)"}}>
          <Ico d={I.leaf} size={26} stroke="#fff" sw={2}/>
        </div>
        <p style={{color:C.textMid,fontWeight:600,fontSize:15}}>Učitava se...</p>
      </div>
    </div></>
  );

  return(
    <><style>{fonts}{css}</style>
    <div className="app">
      {faza==="auth"&&(
        isDesk
          ?<div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:C.bg,flex:1}}>
              <div style={{width:420,background:C.bgCard,borderRadius:28,padding:8,boxShadow:`0 8px 40px ${C.shadow}`}}>
                <Auth onDone={u=>{setKor(u);supabase.auth.getSession().then(({data:{session}})=>{if(session){loadJournalEntries(session.user.id);}});setFaza("app");}}/>
              </div>
            </div>
          :<Auth onDone={u=>{setKor(u);supabase.auth.getSession().then(({data:{session}})=>{if(session){loadJournalEntries(session.user.id);}});setFaza("app");}}/>
      )}
      {faza==="app"&&showInstall&&!isPWA&&(
        <div style={{position:"fixed",bottom:80,left:"50%",transform:"translateX(-50%)",width:"calc(100% - 40px)",maxWidth:350,zIndex:200,background:"#fff",borderRadius:20,padding:"16px 18px",boxShadow:"0 8px 32px rgba(192,120,144,0.22)",border:`1.5px solid ${C.border}`,display:"flex",alignItems:"center",gap:14}}>
          <div style={{flex:1}}>
            <p style={{fontWeight:700,fontSize:14,color:C.text,marginBottom:2}}>Dodaj Unpick na ekran</p>
            <p style={{fontSize:12,color:C.textLight}}>Brži pristup, radi offline</p>
          </div>
          <button onClick={handleInstall} style={{background:C.primaryGrad,color:"#fff",border:"none",borderRadius:100,padding:"9px 16px",fontSize:13,fontWeight:700,fontFamily:"inherit",cursor:"pointer",flexShrink:0}}>Dodaj</button>
          <button onClick={()=>setShowInstall(false)} style={{background:"none",border:"none",cursor:"pointer",color:C.textLight,fontSize:18,lineHeight:1,padding:4,flexShrink:0}}>✕</button>
        </div>
      )}
      {faza==="app"&&showIOSHint&&!isPWA&&(
        <div style={{position:"fixed",top:"max(16px,env(safe-area-inset-top,0px))",left:"50%",transform:"translateX(-50%)",width:"calc(100% - 40px)",maxWidth:350,zIndex:200,background:"#fff",borderRadius:20,padding:"18px 18px 16px",boxShadow:"0 8px 32px rgba(192,120,144,0.22)",border:`1.5px solid ${C.border}`}}>
          <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:10}}>
            <p style={{fontWeight:700,fontSize:14,color:C.text}}>Dodaj Unpick na ekran</p>
            <button onClick={()=>{setShowIOSHint(false);sessionStorage.setItem("iosHintDismissed","1");}} style={{background:"none",border:"none",cursor:"pointer",color:C.textLight,fontSize:18,lineHeight:1,padding:"0 0 0 8px",flexShrink:0}}>✕</button>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
            <span style={{fontSize:20}}>⬆️</span>
            <p style={{fontSize:13,color:C.textMid}}>Tapni <strong>Share</strong> dugme u Safariju (dole u sredini)</p>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <span style={{fontSize:20}}>📲</span>
            <p style={{fontSize:13,color:C.textMid}}>Izaberi <strong>„Dodaj na početni ekran"</strong></p>
          </div>
          <div style={{marginTop:12,height:1,background:C.border}}/>
          <p style={{fontSize:11,color:C.textLight,marginTop:10,textAlign:"center"}}>Radi offline · Brži pristup · Bez pregledača</p>
        </div>
      )}
      {faza==="app"&&(
        priSOS?(
          <div style={{minHeight:"100vh",background:C.bg,overflowY:"auto",flex:isDesk?1:undefined}} className="fi"><SOS onZatvori={()=>setPriSOS(false)}/></div>
        ):priUnos?(
          <div style={{minHeight:"100vh",background:C.bg,overflowY:"auto",flex:isDesk?1:undefined}} className="fi"><NoviUnos onSacuvaj={handleSacuvajUnos} onOtkazi={()=>{setPriUnos(false);setEditUnos(null);}} editData={editUnos}/></div>
        ):(
          <>
            {isDesk&&(
              <aside style={{width:240,minHeight:"100vh",background:C.bgCard,borderRight:`1px solid ${C.border}`,display:"flex",flexDirection:"column",padding:"28px 16px",position:"sticky",top:0,flexShrink:0}}>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:40,paddingLeft:4}}>
                  <div style={{width:36,height:36,borderRadius:11,background:C.primaryGrad,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Ico d={I.leaf} size={18} stroke="#fff" sw={2}/></div>
                  <span style={{fontSize:18,fontWeight:800,color:C.text,letterSpacing:-0.5}}>Unpick</span>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:2,flex:1}}>
                  {NAV.map(n=>(
                    <button key={n.id} onClick={()=>setEkran(n.id)} style={{display:"flex",alignItems:"center",gap:12,padding:"11px 14px",borderRadius:14,border:"none",background:ekran===n.id?C.primaryLight:"transparent",cursor:"pointer",fontFamily:"inherit",transition:"background .15s",textAlign:"left"}}>
                      <Ico d={I[n.ico]} size={20} stroke={ekran===n.id?C.primary:C.textLight} sw={ekran===n.id?2.2:1.6}/>
                      <span style={{fontSize:14,fontWeight:ekran===n.id?700:500,color:ekran===n.id?C.primary:C.textMid}}>{n.l}</span>
                    </button>
                  ))}
                </div>
                <div style={{borderTop:`1px solid ${C.border}`,paddingTop:16,display:"flex",alignItems:"center",justifyContent:"space-between",gap:8}}>
                  <div style={{minWidth:0}}>
                    <p style={{fontSize:13,fontWeight:700,color:C.text,marginBottom:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{kor?.ime||""}</p>
                    <p style={{fontSize:11,color:C.textLight}}>Moj nalog</p>
                  </div>
                  <button onClick={handleLogout} style={{background:C.bgMuted,border:"none",borderRadius:10,padding:"8px 12px",cursor:"pointer",fontSize:12,color:C.textMid,fontWeight:600,fontFamily:"inherit",flexShrink:0}}>Izlaz</button>
                </div>
              </aside>
            )}
            <div style={isDesk
              ?{flex:1,minWidth:0,display:"flex",flexDirection:"column",height:"100vh",overflow:"hidden"}
              :{display:"flex",flexDirection:"column",height:"100dvh",overflow:"hidden"}}>
              <div ref={contentRef} style={{display:ekran==="chat"?"none":"flex",flexDirection:"column",flex:1,minHeight:0,paddingBottom:isDesk?"24px":"calc(63px + env(safe-area-inset-bottom,0px))",overflowY:"auto"}}>
                {ekran==="poc"&&<Pocetna ime={kor?.ime||""} niz={calcStreak(noviUnosi,kor?.registeredAt)} unosi={noviUnosi} registeredAt={kor?.registeredAt} onSOS={()=>setPriSOS(true)} onNoviUnos={()=>setPriUnos(true)} onLogout={handleLogout} kor={kor} onNotif={enableNotifications} notifStatus={notifStatus}/>}
                {ekran==="dnv"&&<Dnevnik noviUnosi={noviUnosi} onDodaj={()=>setPriUnos(true)} onIzmeni={u=>{setEditUnos(u);setPriUnos(true);}} onObrisi={handleObrisiUnos}/>}
                {ekran==="nap"&&<Napredak unosi={noviUnosi} niz={calcStreak(noviUnosi,kor?.registeredAt)}/>}
                {ekran==="bib"&&<Biblioteka/>}
                {ekran==="profil"&&<Profil kor={kor} onLogout={handleLogout} onNotif={enableNotifications} notifStatus={notifStatus}/>}
              </div>
              <div style={{display:ekran==="chat"?"flex":"none",flexDirection:"column",flex:1,minHeight:0,overflow:"hidden",paddingBottom:isDesk||kbOpen?0:"63px"}}>
                <AIChat ime={kor?.ime||""} niz={calcStreak(noviUnosi,kor?.registeredAt)} unosi={noviUnosi} userId={kor?.id} onSOS={()=>setPriSOS(true)} isVisible={ekran==="chat"}/>
              </div>
              {!isDesk&&(
                <nav className="bnav">
                  {NAV.map(n=>(
                    <button key={n.id} className={`ni${ekran===n.id?" active":""}`} onClick={()=>setEkran(n.id)}>
                      <Ico d={I[n.ico]} size={22} stroke={ekran===n.id?C.primary:C.textLight} sw={ekran===n.id?2.2:1.6}/>
                      <span style={{fontSize:10,fontWeight:700,color:ekran===n.id?C.primary:C.textLight}}>{n.l}</span>
                    </button>
                  ))}
                </nav>
              )}
            </div>
          </>
        )
      )}
    </div></>
  );
}
