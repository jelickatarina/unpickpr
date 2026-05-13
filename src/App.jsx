import { useState, useEffect, useRef } from "react";
import { supabase } from "./supabase";

const C = {
  bg:"#FAF7F2",bgCard:"#FFFFFF",bgMuted:"#F3EDE3",
  primary:"#C4714A",primaryGrad:"linear-gradient(135deg,#D4825A 0%,#B46038 100%)",
  primaryLight:"#FAF0E8",primaryDark:"#8C4A28",
  purple:"#6A9E7F",purpleLight:"#E6F3EC",
  text:"#1E1410",textMid:"#6B5540",textLight:"#B09070",
  green:"#5A9A6E",greenLight:"#E4F3EB",
  amber:"#C49040",amberLight:"#FBF2E0",
  red:"#C05050",border:"#EDE5D8",shadow:"rgba(80,40,10,0.07)",
};
const fonts=`@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');`;
const css=`
*{box-sizing:border-box;margin:0;padding:0;}
body{background:${C.bg};}
.app{font-family:'Plus Jakarta Sans',sans-serif;background:${C.bg};min-height:100vh;max-width:390px;margin:0 auto;position:relative;color:${C.text};overflow-x:hidden;}
.serif{font-family:'Instrument Serif',serif;}
.italic{font-style:italic;}
.btn-p{background:${C.primaryGrad};color:#fff;border:none;border-radius:16px;padding:17px 28px;font-size:16px;font-weight:700;font-family:'Plus Jakarta Sans',sans-serif;cursor:pointer;width:100%;transition:all .18s;box-shadow:0 4px 22px rgba(196,113,74,.38);touch-action:manipulation;-webkit-tap-highlight-color:transparent;}
.btn-p:active{transform:scale(.98);}
.btn-o{background:transparent;color:${C.primary};border:1.5px solid ${C.border};border-radius:16px;padding:15px 28px;font-size:15px;font-weight:600;font-family:'Plus Jakarta Sans',sans-serif;cursor:pointer;width:100%;touch-action:manipulation;-webkit-tap-highlight-color:transparent;}
.btn-g{background:transparent;color:${C.textMid};border:none;font-size:14px;font-family:'Plus Jakarta Sans',sans-serif;cursor:pointer;padding:6px;display:flex;align-items:center;gap:6px;font-weight:500;touch-action:manipulation;}
.card{background:${C.bgCard};border-radius:24px;box-shadow:0 2px 14px ${C.shadow},0 1px 3px rgba(80,40,10,.03);padding:20px;}
.chip{display:inline-flex;align-items:center;gap:6px;padding:9px 16px;border-radius:100px;border:1.5px solid ${C.border};background:${C.bgCard};font-size:13px;color:${C.textMid};cursor:pointer;transition:all .16s;font-family:'Plus Jakarta Sans',sans-serif;font-weight:500;}
.chip.on{border-color:${C.primary};background:${C.primaryLight};color:${C.primaryDark};}
.cr{display:block;width:100%;text-align:left;padding:16px 20px;border-radius:16px;border:1.5px solid ${C.border};background:${C.bgCard};font-size:15px;color:${C.textMid};cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;margin-bottom:10px;transition:all .16s;font-weight:500;}
.cr.on{border-color:${C.primary};background:${C.primaryLight};color:${C.primaryDark};font-weight:600;}
.inp{width:100%;padding:15px 18px;border-radius:16px;border:1.5px solid ${C.border};background:${C.bgCard};font-size:15px;font-family:'Plus Jakarta Sans',sans-serif;color:${C.text};outline:none;transition:all .18s;font-weight:500;}
.inp:focus{border-color:${C.primary};box-shadow:0 0 0 4px ${C.primaryLight};}
textarea.inp{resize:none;min-height:80px;line-height:1.65;}
.bnav{position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:100%;max-width:390px;background:rgba(250,247,242,.92);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);border-top:1px solid ${C.border};display:flex;z-index:100;padding:6px 8px calc(env(safe-area-inset-bottom,0px) + 8px);gap:4px;}
.ni{flex:1;display:flex;flex-direction:column;align-items:center;gap:3px;padding:8px 4px 6px;cursor:pointer;background:none;border:none;border-radius:14px;transition:all .18s;}
.ni.active{background:${C.primaryLight};}
.tag{display:inline-block;padding:4px 12px;border-radius:100px;font-size:11px;font-weight:700;}
.fi{animation:fi .28s cubic-bezier(.4,0,.2,1);}
@keyframes fi{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
.pb{height:4px;background:${C.border};border-radius:100px;overflow:hidden;}
.pf{height:100%;background:${C.primaryGrad};border-radius:100px;transition:width .4s ease;}
.emb{background:${C.bgMuted};border:2px solid transparent;border-radius:18px;padding:13px 6px;cursor:pointer;transition:all .16s;text-align:center;flex:1;}
.emb.on{border-color:${C.primary};background:${C.primaryLight};}
.bbu{background:${C.primaryGrad};color:#fff;border-radius:22px 22px 6px 22px;padding:13px 17px;font-size:14px;line-height:1.6;max-width:78%;align-self:flex-end;box-shadow:0 4px 20px rgba(196,113,74,.32);font-weight:500;}
.bba{background:${C.bgCard};box-shadow:0 2px 12px ${C.shadow};color:${C.text};border-radius:22px 22px 22px 6px;padding:13px 17px;font-size:14px;line-height:1.6;max-width:84%;align-self:flex-start;font-weight:500;}
.typing{display:flex;gap:5px;padding:13px 17px;align-items:center;}
.dot{width:7px;height:7px;border-radius:50%;background:${C.textLight};animation:bounce 1.3s infinite;}
.dot:nth-child(2){animation-delay:.18s}.dot:nth-child(3){animation-delay:.36s}
@keyframes bounce{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-5px)}}
.lbl{font-size:10px;font-weight:700;color:${C.textLight};letter-spacing:1.2px;text-transform:uppercase;display:block;margin-bottom:10px;}
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

const EyeBtn=({show,toggle})=>(
  <button type="button" onClick={toggle} style={{position:"absolute",right:14,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:C.textLight,padding:4,lineHeight:1}}>{show?"🙈":"👁️"}</button>
);

function Auth({onDone}){
  const [mode,setMode]=useState("w");
  const [ime,setIme]=useState("");const [em,setEm]=useState("");const [loz,setLoz]=useState("");const [loz2,setLoz2]=useState("");
  const [errs,setErrs]=useState({});const [loading,setLoading]=useState(false);
  const [showLoz,setShowLoz]=useState(false);const [showLoz2,setShowLoz2]=useState(false);
  const [uspeh,setUspeh]=useState("");

  function reset(){setErrs({});setUspeh("");}

  if(mode==="w") return(
    <div className="fi" style={{minHeight:"100vh",background:C.bg,display:"flex",flexDirection:"column"}}>
      <div style={{position:"relative",padding:"72px 28px 36px",overflow:"hidden"}}>
        <div style={{position:"absolute",top:-100,right:-80,width:300,height:300,borderRadius:"50%",background:`radial-gradient(circle,${C.primaryLight} 0%,transparent 70%)`,pointerEvents:"none"}}/>
        <div style={{position:"absolute",top:30,right:20,width:100,height:100,borderRadius:"50%",background:C.primaryLight,opacity:.7,pointerEvents:"none"}}/>
        <div style={{position:"relative",display:"inline-flex",alignItems:"center",gap:10,marginBottom:40}}>
          <div style={{width:42,height:42,borderRadius:14,background:C.primaryGrad,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 6px 20px rgba(196,113,74,.4)`}}>
            <Ico d={I.leaf} size={20} stroke="#fff" sw={2}/>
          </div>
          <span style={{color:C.textLight,fontSize:11,fontWeight:700,letterSpacing:2.5,textTransform:"uppercase"}}>Unpick</span>
        </div>
        <h1 className="serif" style={{fontSize:46,lineHeight:1.1,marginBottom:16,letterSpacing:-1.5,color:C.text,position:"relative"}}>
          Sloboda od<br/><span className="italic" style={{color:C.primary}}>čačkanja kože.</span>
        </h1>
        <p style={{fontSize:15,color:C.textMid,lineHeight:1.85,maxWidth:280,fontWeight:500,position:"relative"}}>Prati obrasce, pronađi okidače, reaguj u kriznim trenucima. Bez osude.</p>
      </div>
      <div style={{padding:"0 24px",display:"flex",flexDirection:"column",gap:10,flex:1}}>
        {[[I.chart,C.primary,"Praćenje epizoda","Beleži svaki trenutak"],[I.shield,C.red,"SOS alat","Podrška u krizi"],[I.chat,C.purple,"Mia, AI drugarica","Tu je kada trebaš"]].map(([ico,clr,t,s])=>(
          <div key={t} style={{display:"flex",alignItems:"center",gap:14,background:C.bgCard,borderRadius:18,padding:"14px 18px",border:`1px solid ${C.border}`,boxShadow:`0 2px 10px ${C.shadow}`}}>
            <div style={{width:44,height:44,borderRadius:13,background:C.bgMuted,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Ico d={ico} size={20} stroke={clr} sw={1.8}/></div>
            <div><p style={{fontWeight:700,fontSize:14,color:C.text,marginBottom:2}}>{t}</p><p style={{fontSize:12,color:C.textLight,fontWeight:500}}>{s}</p></div>
          </div>
        ))}
      </div>
      <div style={{padding:"24px 24px 52px",display:"flex",flexDirection:"column",gap:10}}>
        <button onClick={()=>{setMode("r");reset();}} className="btn-p">Napravi nalog →</button>
        <button onClick={()=>{setMode("l");reset();}} style={{background:"transparent",color:C.textMid,border:`1.5px solid ${C.border}`,borderRadius:16,padding:"15px 28px",fontSize:15,fontWeight:600,fontFamily:"'Plus Jakarta Sans',sans-serif",cursor:"pointer",width:"100%"}}>Već imam nalog</button>
      </div>
    </div>
  );

  const isL=mode==="l";

  function validate(){
    const e={};
    if(!isL&&!ime.trim()) e.ime="Ime je obavezno.";
    else if(!isL&&ime.trim().length<2) e.ime="Ime mora imati najmanje 2 karaktera.";
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
        const {data:profile}=await supabase.from("profiles").select("name").eq("id",data.user.id).single();
        onDone({ime:profile?.name||data.user.user_metadata?.name||em});
      }else{
        const {data,error}=await supabase.auth.signUp({email:em.trim(),password:loz,options:{data:{name:ime.trim()}}});
        if(error){
          if(error.message.includes("already registered")||error.message.includes("already exists")) setErrs({em:"Nalog sa ovim emailom već postoji."});
          else setErrs({general:"Registracija nije uspela. Pokušaj ponovo."});
          return;
        }
        await supabase.from("profiles").upsert({id:data.user.id,name:ime.trim()});
        if(data.session){
          onDone({ime:ime.trim()});
        }else{
          setUspeh("Proveri email i potvrdi nalog, pa se prijavi.");
          setTimeout(()=>{setMode("l");setUspeh("");setLoz("");setLoz2("");},4000);
        }
      }
    }catch{
      setErrs({general:"Nešto nije pošlo po planu. Pokušaj ponovo."});
    }finally{setLoading(false);}
  }

  const inpStyle=(key)=>({borderColor:errs[key]?"#C0392B":undefined});
  const dis=loading||!!uspeh;

  return(
    <div className="fi" style={{minHeight:"100vh",background:C.bg}}>
      <div style={{position:"relative",padding:"60px 24px 28px",overflow:"hidden"}}>
        <div style={{position:"absolute",top:-60,right:-50,width:180,height:180,borderRadius:"50%",background:C.primaryLight,opacity:.7,pointerEvents:"none"}}/>
        <button type="button" onClick={()=>{setMode("w");reset();setIme("");setEm("");setLoz("");setLoz2("");}} style={{background:"none",border:"none",cursor:"pointer",display:"flex",alignItems:"center",gap:8,color:C.textLight,fontSize:14,fontWeight:600,fontFamily:"'Plus Jakarta Sans',sans-serif",marginBottom:28,padding:0,position:"relative"}}>
          <Ico d={I.back} size={16} stroke={C.textLight} sw={2}/> Nazad
        </button>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16,position:"relative"}}>
          <div style={{width:36,height:36,borderRadius:12,background:C.primaryGrad,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 4px 14px rgba(196,113,74,.35)`}}>
            <Ico d={I.leaf} size={17} stroke="#fff" sw={2}/>
          </div>
          <span style={{color:C.textLight,fontSize:11,fontWeight:700,letterSpacing:2,textTransform:"uppercase"}}>Unpick</span>
        </div>
        <h2 className="serif" style={{fontSize:36,letterSpacing:-0.5,color:C.text,marginBottom:6,position:"relative"}}>{isL?"Dobrodošao nazad":"Napravi nalog"}</h2>
        <p style={{color:C.textLight,fontSize:14,fontWeight:500,position:"relative"}}>{isL?"Nastavi odakle si stao.":"Besplatno. Bez osude."}</p>
      </div>
      <div style={{padding:"8px 24px 40px",display:"flex",flexDirection:"column",gap:18}}>
        {errs.general&&<div style={{background:"#FEF2F2",borderRadius:14,padding:"12px 16px",border:"1px solid #FCA5A5"}}><p style={{color:"#991B1B",fontSize:13,fontWeight:600,textAlign:"center"}}>{errs.general}</p></div>}
        {uspeh&&<div style={{background:"#F0FDF4",borderRadius:14,padding:"12px 16px",border:"1px solid #86EFAC"}}><p style={{color:"#166534",fontSize:13,fontWeight:600,textAlign:"center"}}>{uspeh}</p></div>}
        {!isL&&<div>
          <input className="inp" placeholder="Ime" value={ime} onChange={e=>{setIme(e.target.value);if(errs.ime)setErrs(v=>({...v,ime:""}));}} style={inpStyle("ime")} autoComplete="given-name"/>
          {prevErr("ime")}
        </div>}
        <div>
          <input className="inp" placeholder="Email adresa" value={em} onChange={e=>{setEm(e.target.value);if(errs.em)setErrs(v=>({...v,em:""}));}} type="email" autoComplete="email" inputMode="email" style={inpStyle("em")}/>
          {prevErr("em")}
        </div>
        <div>
          <div style={{position:"relative"}}>
            <input className="inp" type={showLoz?"text":"password"} placeholder="Lozinka" value={loz} onChange={e=>{setLoz(e.target.value);if(errs.loz)setErrs(v=>({...v,loz:""}));}} autoComplete={isL?"current-password":"new-password"} style={{paddingRight:44,...inpStyle("loz")}}/>
            <EyeBtn show={showLoz} toggle={()=>setShowLoz(v=>!v)}/>
          </div>
          {prevErr("loz",!isL?"Najmanje 6 karaktera":null)}
        </div>
        {!isL&&<div>
          <div style={{position:"relative"}}>
            <input className="inp" type={showLoz2?"text":"password"} placeholder="Ponovi lozinku" value={loz2} onChange={e=>{setLoz2(e.target.value);if(errs.loz2)setErrs(v=>({...v,loz2:""}));}} autoComplete="new-password" style={{paddingRight:44,...inpStyle("loz2")}}/>
            <EyeBtn show={showLoz2} toggle={()=>setShowLoz2(v=>!v)}/>
          </div>
          {prevErr("loz2")}
        </div>}
        <button
          type="button"
          disabled={dis}
          className="btn-p"
          style={{opacity:dis?0.55:1,cursor:dis?"default":"pointer",touchAction:"manipulation"}}
          onTouchStart={e=>{e.preventDefault();if(!dis)handleSubmit();}}
          onClick={()=>{if(!dis)handleSubmit();}}
        >
          {loading?"Molimo sačekajte...":(isL?"Prijavi se →":"Registruj se →")}
        </button>
        <button type="button" onClick={()=>{setMode(isL?"r":"l");reset();setLoz("");setLoz2("");}} style={{background:"none",border:"none",cursor:"pointer",color:C.textLight,fontSize:14,fontWeight:600,fontFamily:"'Plus Jakarta Sans',sans-serif",padding:"6px 0",textAlign:"center",touchAction:"manipulation"}}>
          {isL?"Nemaš nalog? Registruj se":"Već imaš nalog? Prijavi se"}
        </button>
      </div>
    </div>
  );
}


function Mehurici({onDone}){
  const [ms,setMs]=useState(()=>Array.from({length:9},(_,i)=>({id:i,x:10+(i%3)*33,y:8+Math.floor(i/3)*30,e:["💗","🌸","✨","💜","🌺","💫","🦋","🌷","🍀"][i],p:false})));
  const [n,setN]=useState(0);const svi=ms.every(m=>m.p);
  return(
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:16}}>
      <p style={{fontSize:14,color:C.textMid,fontWeight:500}}>Pritisni svaki mehurić!</p>
      <div style={{width:290,height:250,background:C.primaryLight,borderRadius:28,position:"relative",overflow:"hidden"}}>
        {ms.map(m=>!m.p&&<button key={m.id} onClick={()=>{setMs(v=>v.map(x=>x.id===m.id?{...x,p:true}:x));setN(v=>v+1)}} style={{position:"absolute",left:`${m.x}%`,top:`${m.y}%`,width:54,height:54,borderRadius:"50%",background:C.bgCard,border:`2px solid ${C.primary}`,fontSize:24,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",transform:"translate(-50%,-50%)",boxShadow:`0 4px 16px rgba(168,81,106,.22)`}}>{m.e}</button>)}
        {svi&&<div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:44}}>🎉</span><p style={{fontWeight:700,color:C.primaryDark,fontSize:16,marginTop:10}}>Sve si prsnula!</p></div>}
      </div>
      <p style={{fontSize:20,fontWeight:400,color:C.primary,fontFamily:"'Instrument Serif',serif"}}>{n} / {ms.length}</p>
      {svi&&<button className="btn-p" style={{width:"auto",padding:"13px 36px"}} onClick={onDone}>Osećam se bolje →</button>}
    </div>
  );
}

function Boje({onDone}){
  const B=[{b:"#E8A0BF",n:"Roze"},{b:"#9B7FA6",n:"Ljubičasta"},{b:"#7BAF8E",n:"Zelena"},{b:"#E8C452",n:"Žuta"},{b:"#7EB8D4",n:"Plava"}];
  const [cilj,setCilj]=useState(B[0]);const [ok,setOk]=useState(0);const [ne,setNe]=useState(0);const [msg,setMsg]=useState("");
  const [red,setRed]=useState(()=>[...B].sort(()=>Math.random()-0.5));
  function tap(b){if(b.n===cilj.n){setOk(v=>v+1);setMsg("✓");setTimeout(()=>{setCilj(B[Math.floor(Math.random()*B.length)]);setRed([...B].sort(()=>Math.random()-0.5));setMsg("")},500)}else{setNe(v=>v+1);setMsg("✗");setTimeout(()=>setMsg(""),500)}}
  return(
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:16}}>
      <p style={{fontSize:14,color:C.textMid,fontWeight:500}}>Pritisni ispravnu boju što brže možeš</p>
      <div style={{textAlign:"center"}}><p style={{fontSize:10,color:C.textLight,marginBottom:6,fontWeight:700,letterSpacing:1}}>PRONAĐI</p><span style={{fontSize:30,fontWeight:400,color:cilj.b,fontFamily:"'Instrument Serif',serif"}}>{cilj.n} {msg}</span></div>
      <div style={{display:"flex",gap:14,flexWrap:"wrap",justifyContent:"center"}}>
        {red.map(b=><button key={b.n} onClick={()=>tap(b)} style={{width:70,height:70,borderRadius:"50%",background:b.b,border:"none",cursor:"pointer",boxShadow:`0 6px 20px ${b.b}55`}}/>)}
      </div>
      <div style={{display:"flex",gap:24,fontSize:18}}><span style={{color:C.green,fontWeight:700}}>✓ {ok}</span><span style={{color:C.red,fontWeight:700}}>✗ {ne}</span></div>
      {ok>=5&&<button className="btn-p" style={{width:"auto",padding:"13px 36px"}} onClick={onDone}>Osećam se bolje →</button>}
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
  const W=({ch})=><div style={{minHeight:"100vh",padding:"32px 24px 48px",background:C.bg}} className="fi">{ch}</div>;
  const XBtn=()=><div style={{display:"flex",justifyContent:"flex-end",marginBottom:24}}><button style={{background:C.bgMuted,border:"none",borderRadius:50,width:40,height:40,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}} onClick={onZatvori}><Ico d={I.x} size={16} stroke={C.textMid} sw={2}/></button></div>;
  const ALATI=[{id:"dis",icon:I.leaf,l:"Vežba disanja",op:"4-7-8 tehnika"},{id:"taj",icon:I.spark,l:"Čekaj 5 minuta",op:"Impulsi prolaze"},{id:"ruke",icon:I.shield,l:"Zaposli ruke",op:"Alternativne aktivnosti"},{id:"uzem",icon:I.heart,l:"Uzemljenje",op:"5-4-3-2-1 tehnika"},{id:"meh",icon:I.plus,l:"Prsni mehuriće",op:"Igrica"},{id:"boj",icon:I.spark,l:"Igra boja",op:"Igrica"}];

  if(faza==="izb") return(
    <div style={{minHeight:"100vh",padding:"32px 24px 48px",background:C.bg}} className="fi">
      <div style={{display:"flex",justifyContent:"flex-end",marginBottom:24}}><button style={{background:C.bgMuted,border:"none",borderRadius:50,width:40,height:40,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}} onClick={onZatvori}><Ico d={I.x} size={16} stroke={C.textMid} sw={2}/></button></div>
      <h2 className="serif" style={{fontSize:26,marginBottom:4,letterSpacing:-0.3}}>Šta danas probamo?</h2>
      <p style={{fontSize:14,color:C.textMid,marginBottom:20,fontWeight:500}}>Tehnika smirenja ili igrica za distrakciju</p>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {ALATI.map(a=>(
          <button key={a.id} onClick={()=>{setAlat(a.id);setFaza("alat")}} style={{background:C.bgCard,border:`1.5px solid ${C.border}`,borderRadius:20,padding:"16px 20px",cursor:"pointer",display:"flex",alignItems:"center",gap:16,textAlign:"left",boxShadow:`0 2px 8px ${C.shadow}`}}>
            <div style={{width:50,height:50,borderRadius:16,background:C.primaryLight,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Ico d={a.icon} size={22} stroke={C.primary} sw={1.8}/></div>
            <div style={{flex:1}}><p style={{fontWeight:600,fontSize:15,color:C.text,marginBottom:2}}>{a.l}</p><p style={{fontSize:13,color:C.textLight}}>{a.op}</p></div>
            <Ico d={I.chev} size={16} stroke={C.textLight} sw={2}/>
          </button>
        ))}
      </div>
    </div>
  );

  if(faza==="alat"){
    const kor=[{l:"Udahni...",d:4,c:C.primary},{l:"Zadrži...",d:7,c:C.purple},{l:"Izdahni...",d:8,c:C.green}];
    const BackBtn=()=><button className="btn-g" style={{alignSelf:"flex-start",marginBottom:8}} onClick={()=>setFaza("izb")}><Ico d={I.back} size={16} stroke={C.textMid}/> Nazad</button>;
    if(alat==="dis"){const cur=kor[dk%3];const prog=Math.max(0,disSek/cur.d);const r=80;const circ=2*Math.PI*r;return(
      <div style={{minHeight:"100vh",padding:"40px 24px 48px",background:C.bg,textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",gap:24}} className="fi">
        <BackBtn/>
        <h3 className="serif" style={{fontSize:26,letterSpacing:-0.3}}>4 · 7 · 8 Disanje</h3>
        <div style={{position:"relative",width:196,height:196}}>
          <svg width={196} height={196} style={{position:"absolute",top:0,left:0,transform:"rotate(-90deg)"}}>
            <circle cx={98} cy={98} r={r} fill="none" stroke={cur.c+"22"} strokeWidth={6}/>
            <circle key={dk} cx={98} cy={98} r={r} fill="none" stroke={cur.c} strokeWidth={6} strokeLinecap="round"
              strokeDasharray={circ} strokeDashoffset={circ*(1-prog)} style={{transition:"stroke-dashoffset 1s linear,stroke .4s"}}/>
          </svg>
          <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:4}}>
            <Ico d={dk%3===0?I.plus:dk%3===1?I.shield:I.send} size={28} stroke={cur.c} sw={1.8}/>
            <span style={{fontSize:42,fontWeight:400,color:cur.c,fontFamily:"'Instrument Serif',serif",lineHeight:1}}>{Math.max(disSek,0)}</span>
            <span style={{fontWeight:600,color:cur.c,fontSize:13}}>{cur.l}</span>
          </div>
        </div>
        <div style={{display:"flex",gap:8}}>{kor.map((_,i)=><div key={i} style={{width:8,height:8,borderRadius:"50%",background:i===dk%3?C.primary:C.border,transition:"all .3s"}}/>)}</div>
        <p style={{color:C.textMid,fontSize:13,fontWeight:500}}>Krug {Math.floor(dk/3)+1}</p>
        {dk>=3&&<button className="btn-o" style={{width:"auto"}} onClick={()=>onZatvori()}>Osećam se bolje</button>}
      </div>
    );}
    if(alat==="taj"){const TOTAL=300;const prog=tajmer/TOTAL;const r=80;const circ=2*Math.PI*r;const done=tAkt&&tajmer===0;return(
      <div style={{minHeight:"100vh",padding:"40px 24px 48px",background:C.bg,textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",gap:28}} className="fi">
        <BackBtn/>
        <div>
          <h3 className="serif" style={{fontSize:30,letterSpacing:-0.5,marginBottom:6}}>{done?"Uspela si!":"Čekaj malo"}</h3>
          <p style={{color:C.textMid,fontSize:14,fontWeight:500}}>{done?"Impuls je prošao. Budi ponosna.":"Impulsi prolaze. Samo 5 minuta."}</p>
        </div>
        <div style={{position:"relative",width:210,height:210}}>
          <svg width={210} height={210} style={{position:"absolute",top:0,left:0,transform:"rotate(-90deg)"}}>
            <circle cx={105} cy={105} r={r} fill="none" stroke={done?C.green+"33":C.primary+"22"} strokeWidth={8}/>
            <circle cx={105} cy={105} r={r} fill="none" stroke={done?C.green:C.primary} strokeWidth={8} strokeLinecap="round"
              strokeDasharray={circ} strokeDashoffset={circ*(1-prog)} style={{transition:"stroke-dashoffset 1s linear,stroke .5s"}}/>
          </svg>
          <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:4}}>
            {done
              ? <div style={{width:64,height:64,borderRadius:"50%",background:C.greenLight,display:"flex",alignItems:"center",justifyContent:"center"}}><Ico d={I.check} size={32} stroke={C.green} sw={2.5}/></div>
              : <>
                  <span style={{fontSize:44,fontWeight:400,color:C.primary,fontFamily:"'Instrument Serif',serif",lineHeight:1}}>{tajmer}</span>
                  <span style={{fontSize:12,color:C.textLight,fontWeight:600,letterSpacing:1}}>SEK</span>
                </>
            }
          </div>
        </div>
        {!tAkt&&<button className="btn-p" onTouchStart={e=>{e.preventDefault();try{acRef.current=new(window.AudioContext||window.webkitAudioContext)();}catch{}setTAkt(true);}} onClick={()=>{try{acRef.current=new(window.AudioContext||window.webkitAudioContext)();}catch{}setTAkt(true);}} style={{width:"auto",padding:"15px 52px"}}>Pokreni ▶</button>}
        {done&&<button className="btn-p" onTouchStart={e=>{e.preventDefault();onZatvori();}} onClick={()=>onZatvori()} style={{width:"auto",padding:"15px 44px"}}>Nastavi →</button>}
        {tAkt&&!done&&<p style={{color:C.textLight,fontSize:13,fontWeight:500}}>Drži se</p>}
      </div>
    );}
    if(alat==="ruke") return(
      <div style={{minHeight:"100vh",padding:"32px 24px 48px",background:C.bg}} className="fi">
        <BackBtn/>
        <h3 className="serif" style={{fontSize:26,marginBottom:20,letterSpacing:-0.3}}>Zaposli ruke</h3>
        {["Nanesite kremu za ruke","Držite kocku leda","Pritisnite nokte u dlan","Klikćite hemijsku","Kuckajte prstima o sto","Masirajte sopstvene ruke"].map(a=><div key={a} className="card" style={{marginBottom:10,fontSize:14,fontWeight:500}}>{a}</div>)}
        <div style={{height:16}}/><button className="btn-p" onClick={()=>onZatvori()}>Probala sam →</button>
      </div>
    );
    if(alat==="uzem") return(
      <div style={{minHeight:"100vh",padding:"32px 24px 48px",background:C.bg}} className="fi">
        <BackBtn/>
        <h3 className="serif" style={{fontSize:26,marginBottom:6,letterSpacing:-0.3}}>5-4-3-2-1 Uzemljenje</h3>
        <p style={{color:C.textMid,fontSize:14,marginBottom:22,fontWeight:500}}>Primeti šta je oko tebe, upravo sada.</p>
        {[[I.spark,"5","stvari koje VIDIŠ"],[I.heart,"4","stvari koje DODIRUJEŠ"],[I.chat,"3","zvuka koje ČUJEŠ"],[I.leaf,"2","mirisa koje OSEĆAŠ"],[I.plus,"1","ukus koji OSETIŠ"]].map(([ico,n,l])=>(
          <div key={l} className="card" style={{marginBottom:10,display:"flex",alignItems:"center",gap:14}}>
            <div style={{width:36,height:36,borderRadius:10,background:C.primaryLight,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Ico d={ico} size={18} stroke={C.primary} sw={1.8}/></div>
            <div><span style={{fontWeight:400,color:C.primary,fontSize:22,fontFamily:"'Instrument Serif',serif"}}>{n} </span><span style={{fontSize:13,color:C.textMid,fontWeight:500}}>{l}</span></div>
          </div>
        ))}
        <div style={{height:16}}/><button className="btn-p" onClick={()=>onZatvori()}>Završila sam →</button>
      </div>
    );
    if(alat==="meh") return(<div style={{minHeight:"100vh",padding:"28px 24px 48px",background:C.bg}} className="fi"><BackBtn/><h3 className="serif" style={{fontSize:24,marginBottom:20,textAlign:"center"}}>Prsni mehuriće</h3><Mehurici onDone={()=>onZatvori()}/></div>);
    if(alat==="boj") return(<div style={{minHeight:"100vh",padding:"28px 24px 48px",background:C.bg}} className="fi"><BackBtn/><h3 className="serif" style={{fontSize:24,marginBottom:20,textAlign:"center"}}>Igra boja</h3><Boje onDone={()=>onZatvori()}/></div>);
  }

  return(
    <div style={{minHeight:"100vh",padding:"40px 24px 48px",background:C.bg,display:"flex",flexDirection:"column",alignItems:"center",gap:16}} className="fi">
      <div style={{width:72,height:72,borderRadius:"50%",background:C.amberLight,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:4}}><Ico d={I.heart} size={34} stroke={C.amber} sw={1.8}/></div>
      <h2 className="serif" style={{fontSize:30,letterSpacing:-0.3}}>Kako je prošlo?</h2>
      <p style={{color:C.textMid,fontSize:14,fontWeight:500}}>Nema pogrešnog odgovora.</p>
      <div style={{display:"flex",flexDirection:"column",gap:10,width:"100%"}}>
        {[["res","Odolela sam impulsu",C.green,C.greenLight],["try","Pokušala sam, ali teško",C.amber,C.amberLight],["ep","Imala sam epizodu",C.red,"#FAEAEA"]].map(([v,l,c,bg])=>(
          <button key={v} onClick={()=>setIshod(l)} style={{width:"100%",padding:"18px 20px",borderRadius:18,border:`2px solid ${ishod===l?c:C.border}`,background:ishod===l?bg:C.bgCard,cursor:"pointer",fontSize:15,fontWeight:ishod===l?700:500,display:"flex",alignItems:"center",gap:14,transition:"all .16s",boxShadow:ishod===l?`0 4px 16px ${c}25`:`0 2px 8px ${C.shadow}`}}>
            <div style={{width:20,height:20,borderRadius:"50%",background:c,flexShrink:0}}/>  {l}
          </button>
        ))}
      </div>
      {ishod&&<><p style={{fontSize:13,color:C.textLight,fontWeight:500,textAlign:"center"}}>{ishod==="Odolela sam impulsu"?"Neverovatno! Ta snaga je tvoja.":ishod==="Pokušala sam, ali teško"?"Pokušaj je napredak. Budi blaga.":"U redu je. Potražila si pomoć — to je važno."}</p><button className="btn-p" style={{width:"auto",padding:"14px 44px"}} onClick={onZatvori}>Sačuvaj i zatvori</button></>}
    </div>
  );
}

function NoviUnos({onSacuvaj,onOtkazi,editData}){
  const [k,setK]=useState(1);
  const [saving,setSaving]=useState(false);
  const [u,setU]=useState(editData?{int:editData.int||5,ok:editData.ok||[],lok:editData.lok||"",epre:editData.epre||"",epost:editData.epost||"",ish:editData.ish||"",bel:editData.bel||"",slike:editData.slike||[]}:{int:5,ok:[],lok:"",epre:"",epost:"",ish:"",bel:"",slike:[]});
  const N=5;
  const Hdr=({title})=>(
    <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:24}}>
      <button className="btn-g" onClick={k>1?()=>setK(v=>v-1):onOtkazi} style={{padding:0}}><Ico d={I.back} size={20} stroke={C.textMid}/></button>
      <div style={{flex:1}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><span style={{fontSize:14,fontWeight:700}}>{title}</span><span style={{fontSize:12,color:C.textLight,fontWeight:600}}>{k}/{N}</span></div>
        <div className="pb"><div className="pf" style={{width:`${(k/N)*100}%`}}/></div>
      </div>
    </div>
  );
  function toggleOk(o){
    if(o==="Ostalo"){setU(v=>({...v,ok:v.ok.includes("Ostalo")||v.ok.some(x=>x.startsWith("Ostalo:"))?v.ok.filter(x=>x!=="Ostalo"&&!x.startsWith("Ostalo:")):v.ok.includes("Ostalo")?v.ok:[...v.ok,"Ostalo"]}));return;}
    setU(v=>({...v,ok:v.ok.includes(o)?v.ok.filter(x=>x!==o):[...v.ok,o]}));
  }
  const ostaloAkt=u.ok.includes("Ostalo")||u.ok.some(x=>x.startsWith("Ostalo:"));
  const ostaloTekst=u.ok.find(x=>x.startsWith("Ostalo:"))?.slice(7)||"";
  return(
    <div style={{padding:"56px 24px 40px",minHeight:"100vh"}} className="fi">
      {k===1&&<><Hdr title={editData?"Izmena unosa":"Novi unos"}/>
        <h3 className="serif" style={{fontSize:26,marginBottom:20,letterSpacing:-0.3}}>Šta se desilo?</h3>
        <span className="lbl">JAK IMPULS</span>
        <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:8}}>
          <input type="range" min={1} max={10} value={u.int} onChange={e=>setU(v=>({...v,int:+e.target.value}))} style={{flex:1,accentColor:C.primary}}/>
          <span style={{fontSize:30,fontWeight:400,color:C.primary,minWidth:32,fontFamily:"'Instrument Serif',serif"}}>{u.int}</span>
        </div>
        <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:C.textLight,fontWeight:600,marginBottom:24}}><span>Jedva primetio</span><span>Nepodnošljiv</span></div>
        <span className="lbl">OKIDAČI <span style={{fontWeight:400,textTransform:"none",letterSpacing:0,fontSize:10}}>(može više)</span></span>
        <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:ostaloAkt?12:20}}>
          {OKI.map(o=><button key={o} className={`chip${(o==="Ostalo"?ostaloAkt:u.ok.includes(o))?" on":""}`} onClick={()=>toggleOk(o)} style={{padding:"8px 14px"}}>{o}</button>)}
        </div>
        {ostaloAkt&&<input className="inp" placeholder="Opiši okidač..." autoFocus value={ostaloTekst} onChange={e=>{const t=e.target.value;setU(v=>({...v,ok:[...v.ok.filter(x=>x!=="Ostalo"&&!x.startsWith("Ostalo:")),t?"Ostalo:"+t:"Ostalo"]}));}} style={{marginBottom:20}}/>}
        <span className="lbl">LOKACIJA</span>
        <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:28}}>
          {LOK.map(l=><button key={l} className={`chip${u.lok===l?" on":""}`} onClick={()=>setU(v=>({...v,lok:l}))} style={{padding:"8px 12px",fontSize:13}}>{l}</button>)}
        </div>
        <button className="btn-p" onClick={()=>setK(2)}>Nastavi →</button>
      </>}
      {k===2&&<><Hdr title="Emocije"/>
        <h3 className="serif" style={{fontSize:26,marginBottom:20,letterSpacing:-0.3}}>Tvoje emocije</h3>
        <span className="lbl">PRE</span>
        <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:22}}>
          {EMOCIJE.map(([e,l])=><button key={l} className={`chip${u.epre===l?" on":""}`} onClick={()=>setU(v=>({...v,epre:l}))}><span>{e}</span>{l}</button>)}
        </div>
        <span className="lbl">POSLE</span>
        <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:28}}>
          {EMOCIJE.map(([e,l])=><button key={l+"p"} className={`chip${u.epost===l?" on":""}`} onClick={()=>setU(v=>({...v,epost:l}))}><span>{e}</span>{l}</button>)}
        </div>
        <button className="btn-p" onClick={()=>setK(3)}>Nastavi →</button>
      </>}
      {k===3&&<><Hdr title="Ishod"/>
        <h3 className="serif" style={{fontSize:26,marginBottom:20,letterSpacing:-0.3}}>Kakav je bio ishod?</h3>
        {[["res","Odolela sam impulsu"],["try","Pokušala sam, ali nije išlo"],["ep","Imala sam epizodu"]].map(([v,l])=><button key={v} className={`cr${u.ish===v?" on":""}`} onClick={()=>setU(x=>({...x,ish:v}))}>{l}</button>)}
        <div style={{height:18}}/><button className="btn-p" onClick={()=>setK(4)} disabled={!u.ish} style={{opacity:u.ish?1:0.4}}>Nastavi →</button>
      </>}
      {k===4&&<><Hdr title="Fotografija"/>
        <h3 className="serif" style={{fontSize:26,marginBottom:6,letterSpacing:-0.3}}>Dodaj fotografiju</h3>
        <p style={{fontSize:14,color:C.textMid,marginBottom:20,fontWeight:500}}>Opciono — ostaje privatno</p>
        <label style={{display:"block",border:`2px dashed ${C.border}`,borderRadius:22,padding:"30px 20px",textAlign:"center",cursor:"pointer",background:C.bgMuted,marginBottom:14}}>
          <input type="file" accept="image/*" multiple style={{display:"none"}} onChange={e=>{Promise.all(Array.from(e.target.files).map(f=>new Promise(res=>{const r=new FileReader();r.onload=ev=>res(ev.target.result);r.readAsDataURL(f)}))).then(urls=>setU(v=>({...v,slike:[...v.slike,...urls]})))}}/>
          <div style={{marginBottom:10}}><Ico d={I.camera} size={36} stroke={C.primary} sw={1.5}/></div>
          <p style={{fontWeight:700,color:C.primary,marginBottom:4}}>Dodaj slike</p>
          <p style={{fontSize:13,color:C.textLight}}>Tapni da odabereš iz galerije</p>
        </label>
        {u.slike.length>0&&<div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:14}}>{u.slike.map((s,i)=><div key={i} style={{position:"relative"}}><img src={s} alt="" style={{width:80,height:80,borderRadius:14,objectFit:"cover"}}/><button onClick={()=>setU(v=>({...v,slike:v.slike.filter((_,j)=>j!==i)}))} style={{position:"absolute",top:-6,right:-6,width:22,height:22,borderRadius:"50%",background:C.red,color:"#fff",border:"none",fontSize:11,cursor:"pointer"}}>✕</button></div>)}</div>}
        <button className="btn-p" onClick={()=>setK(5)}>Nastavi →</button>
        <button className="btn-g" style={{width:"100%",marginTop:8,justifyContent:"center"}} onClick={()=>setK(5)}>Preskoči</button>
      </>}
      {k===5&&<><Hdr title="Beleška"/>
        <h3 className="serif" style={{fontSize:26,marginBottom:6,letterSpacing:-0.3}}>Beleška</h3>
        <p style={{fontSize:14,color:C.textMid,marginBottom:16,fontWeight:500}}>Šta se dešavalo? (opciono)</p>
        <textarea className="inp" placeholder="Piši slobodno..." value={u.bel} onChange={e=>setU(v=>({...v,bel:e.target.value}))} style={{marginBottom:18}}/>
        <div className="card" style={{background:C.bgMuted,boxShadow:"none",marginBottom:20}}>
          <span className="lbl">PREGLED</span>
          {[["Impuls",`${u.int}/10`],["Okidači",u.ok.length?u.ok.join(", "):"—"],["Lokacija",u.lok||"—"],["Pre",u.epre||"—"],["Posle",u.epost||"—"]].map(([kk,vv])=>(
            <div key={kk} style={{display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:7}}><span style={{color:C.textLight,fontWeight:600}}>{kk}</span><span style={{fontWeight:700,color:C.textMid,textAlign:"right",maxWidth:"60%"}}>{vv}</span></div>
          ))}
        </div>
        <button className="btn-p" disabled={saving} style={{opacity:saving?0.6:1}} onClick={()=>{if(saving)return;setSaving(true);onSacuvaj(u);}}>{editData?"Sačuvaj izmene":"Sačuvaj unos"}</button>
      </>}
    </div>
  );
}

const GROQ_KEY=import.meta.env.VITE_GROQ_API_KEY||"";

function buildSys(ime,niz,unosi){
  const today=new Date();today.setHours(0,0,0,0);
  const sedmicaDana=Array.from({length:7},(_,i)=>{
    const d=new Date(today.getTime()-i*86400000);
    const uns=(unosi||[]).filter(e=>e.ts&&e.ts>=d.getTime()&&e.ts<d.getTime()+86400000);
    return uns;
  }).flat();
  const ep=sedmicaDana.filter(e=>e.ish==="ep").length;
  const pok=sedmicaDana.filter(e=>e.ish==="try").length;
  const res=sedmicaDana.filter(e=>e.ish==="res").length;
  const okidaci=[...(unosi||[]).flatMap(e=>Array.isArray(e.ok)?e.ok:[e.ok]).filter(Boolean)];
  const okFreq={};okidaci.forEach(o=>{okFreq[o]=(okFreq[o]||0)+1;});
  const topOk=Object.entries(okFreq).sort((a,b)=>b[1]-a[1]).slice(0,3).map(([k])=>k);
  const lokFreq={};(unosi||[]).forEach(e=>{if(e.lok)lokFreq[e.lok]=(lokFreq[e.lok]||0)+1;});
  const topLok=Object.entries(lokFreq).sort((a,b)=>b[1]-a[1]).slice(0,2).map(([k])=>k);
  const prosecniInt=unosi?.length?Math.round((unosi||[]).reduce((s,e)=>s+(e.int||0),0)/unosi.length):0;
  const obrasci=[];
  if(ep>0&&topOk.length) obrasci.push(`Epizode su se dešavale najčešće uz: ${topOk.join(", ")}.`);
  if(topLok.length) obrasci.push(`Kritična mesta su: ${topLok.join(", ")}.`);
  if(prosecniInt>=7) obrasci.push("Intenzitet impulsa je visok — korisnik ima jake unutrašnje okidače.");
  if(niz>=7) obrasci.push(`Korisnik ima ${niz} dana čistog niza — to je ogroman uspeh vredan pohvale.`);
  if(ep===0&&res>0) obrasci.push("Ova nedelja je čista — ohrabri i pomozi da se taj zamah nastavi.");

  return `Ti si Mia, empatična AI drugarica unutar aplikacije Unpick koja pomaže osobama sa dermatilomanijom (skin picking).

JEZIK: Odgovaraj ISKLJUČIVO na srpskom jeziku (Srbija), ekavica. Nikada ne koristi reči: "tjedan" (→nedelja), "trenutačno" (→trenutno), "također" (→takođe), "ukoliko" (→ako), "kako bi" (→da bi). Bez obzira na jezik korisnika, uvek odgovaraj na srpskom.

ROD: Ti si Mia — govoriš o sebi u ŽENSKOM rodu. Na primer: "Ja sam tu", "Primetila sam", "Rekla bih", "Raduje me".

OBRAĆANJE: Bez "draga/dragi". Koristi direktno ime ili "ti/tebi". Rodno neutralno prema korisniku.

STIL: Topla, strpljiva, bez osude. Razlikuj dve situacije:
1. Korisnik DELI osećanja ili priča o problemima → slušaj, postavi jedno pitanje da bolje razumeš.
2. Korisnik TRAŽI POMOĆ ili SAVЕТ (pita "kako da se smirim", "šta da radim", "pomozi mi") → NE pitaj šta bi mu pomoglo. Odmah daj konkretne ideje, tehnike, korake. Budi direktna i korisna.

SOS PRAVILO: Kada korisnik kaže da se oseća loše, da ima jak impuls, da želi da čačka, da mu/joj je teško, da treba da se smiri — UVEK na kraju poruke dodaj tačno ovaj tag (bez izmena): [SOS_DUGME]. Pre toga reci nešto ohrabrujuće — da izdrži, da može ovo, da si tu. Npr: "Znam da je teško, ali možeš da izdržiš — hajde da probamo jednu tehniku smirenja zajedno. [SOS_DUGME]"

OBRASCI (koristi ovo da bi davala personalizovane uvide):
${obrasci.length?obrasci.map(o=>"- "+o).join("\n"):"- Nema dovoljno podataka za obrasce još uvek."}

PODACI O KORISNIKU (${ime}):
- Niz čistih dana (vatrica): ${niz}
- Ova nedelja: ${ep} epizoda, ${pok} neuspešnih pokušaja, ${res} odoljevanja
- Najčešći okidači: ${topOk.length?topOk.join(", "):"—"}
- Kritične lokacije: ${topLok.length?topLok.join(", "):"—"}
- Prosečan intenzitet: ${prosecniInt}/10
- Ukupno unosa: ${(unosi||[]).length}

Nikada ne pominjaj bazu podataka, API ni tehničke detalje. Govori prirodno. Budi sažeta — 2-4 rečenice. Ne zamenjuješ stručnu pomoć.`;
}

function AIChat({ime,niz,unosi,userId,onSOS}){
  const pocetna={id:0,ko:"ai",tekst:`Zdravo${ime?" "+ime:""}! Ja sam Mia — tu sam da te saslušam, bez osude i bez žurbe. Možeš mi reći šta te muči, kako se osećaš, ili šta ti je na umu. Šta se dešava kod tebe?`};
  const [poruke,setPoruke]=useState([pocetna]);
  const [unos,setUnos]=useState("");const [ucitava,setUcitava]=useState(false);const krajRef=useRef(null);
  const porRef=useRef([pocetna]);

  async function sacuvaj(p){
    if(!userId)return;
    await supabase.from("profiles").update({chat_history:p}).eq("id",userId);
  }

  useEffect(()=>{
    if(!userId)return;
    supabase.from("profiles").select("chat_history").eq("id",userId).single().then(({data})=>{
      if(data?.chat_history?.length){setPoruke(data.chat_history);porRef.current=data.chat_history;}
    });
  },[userId]);

  useEffect(()=>{krajRef.current?.scrollIntoView({behavior:"smooth"})},[poruke,ucitava]);
  async function posalji(){
    const txt=unos.trim();if(!txt||ucitava)return;
    const np=[...poruke,{id:Date.now(),ko:"user",tekst:txt}];
    setPoruke(np);porRef.current=np;setUnos("");setUcitava(true);
    if(!GROQ_KEY){const npp=[...np,{id:Date.now()+1,ko:"ai",tekst:"Mia trenutno nije dostupna — nedostaje VITE_GROQ_API_KEY u .env fajlu."}];setPoruke(npp);porRef.current=npp;setUcitava(false);return;}
    try{
      const res=await fetch("https://api.groq.com/openai/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json","Authorization":`Bearer ${GROQ_KEY}`},body:JSON.stringify({model:"llama-3.3-70b-versatile",max_tokens:512,messages:[{role:"system",content:buildSys(ime,niz,unosi)},...np.map(p=>({role:p.ko==="user"?"user":"assistant",content:p.tekst}))]})});
      const data=await res.json();
      const raw=data.choices?.[0]?.message?.content||"Žao mi je, pokušaj ponovo.";
      const imasSOS=raw.includes("[SOS_DUGME]");
      const aiTekst=raw.replace("[SOS_DUGME]","").trim();
      const npp=[...np,{id:Date.now()+1,ko:"ai",tekst:aiTekst,sos:imasSOS}];
      setPoruke(npp);porRef.current=npp;
      await sacuvaj(npp);
    }catch{const npp=[...np,{id:Date.now()+1,ko:"ai",tekst:"Nešto nije pošlo po planu. Proveri internet vezu."}];setPoruke(npp);porRef.current=npp;}
    finally{setUcitava(false);}
  }
  return(
    <div style={{display:"flex",flexDirection:"column",height:"100%",flex:1,minHeight:0}}>
      <div style={{padding:"52px 20px 14px",background:"rgba(255,255,255,.96)",borderBottom:`1px solid ${C.border}`,flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",gap:14}}>
          <div style={{width:46,height:46,borderRadius:"50%",background:`linear-gradient(135deg,${C.primaryLight},${C.purpleLight})`,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 4px 14px rgba(196,113,74,.2)`}}>
            <Ico d={I.spark} size={20} stroke={C.primary} sw={1.5}/>
          </div>
          <div><p style={{fontWeight:700,fontSize:16}}>Mia</p><p style={{fontSize:12,color:C.green,fontWeight:700}}>● dostupna</p></div>
        </div>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"20px 16px 10px",display:"flex",flexDirection:"column",gap:12,background:C.bg,minHeight:0}}>
        {poruke.map(p=>(
          <div key={p.id} style={{display:"flex",flexDirection:"column",alignItems:p.ko==="user"?"flex-end":"flex-start"}}>
            {p.ko==="ai"&&<div style={{display:"flex",alignItems:"flex-end",gap:8}}>
              <div style={{width:32,height:32,borderRadius:"50%",background:C.primaryLight,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginBottom:2}}><Ico d={I.spark} size={14} stroke={C.primary} sw={1.5}/></div>
              <div style={{display:"flex",flexDirection:"column",gap:8,maxWidth:"84%"}}>
                <div className="bba">{p.tekst}</div>
                {p.sos&&<button onClick={onSOS} style={{alignSelf:"flex-start",background:C.primaryGrad,color:"#fff",border:"none",borderRadius:14,padding:"10px 18px",fontSize:13,fontWeight:700,fontFamily:"'Plus Jakarta Sans',sans-serif",cursor:"pointer",boxShadow:"0 4px 16px rgba(196,113,74,.35)",display:"flex",alignItems:"center",gap:8}}><Ico d={I.shield} size={15} stroke="#fff" sw={2}/>Otvori SOS tehnike</button>}
              </div>
            </div>}
            {p.ko==="user"&&<div className="bbu">{p.tekst}</div>}
          </div>
        ))}
        {ucitava&&<div style={{display:"flex",alignItems:"flex-end",gap:8}}>
          <div style={{width:32,height:32,borderRadius:"50%",background:C.primaryLight,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Ico d={I.spark} size={14} stroke={C.primary} sw={1.5}/></div>
          <div className="bba"><div className="typing"><div className="dot"/><div className="dot"/><div className="dot"/></div></div>
        </div>}
        <div ref={krajRef}/>
      </div>
      {poruke.length===1&&<div style={{padding:"0 16px 10px",display:"flex",gap:8,overflowX:"auto",background:C.bg,flexShrink:0}}>
        {["Teško mi je danas","Imao/la sam epizodu","Kako da se smirim?","Napredovao/la sam!"].map(t=>(
          <button key={t} onClick={()=>setUnos(t)} style={{flexShrink:0,padding:"9px 16px",background:C.bgCard,border:`1.5px solid ${C.border}`,borderRadius:100,fontSize:13,color:C.textMid,cursor:"pointer",whiteSpace:"nowrap",fontWeight:600,fontFamily:"'Plus Jakarta Sans',sans-serif",boxShadow:`0 2px 8px ${C.shadow}`}}>{t}</button>
        ))}
      </div>}
      <div style={{padding:"10px 16px 14px",background:"rgba(255,255,255,.92)",backdropFilter:"blur(20px)",borderTop:`1px solid ${C.border}`,display:"flex",gap:10,alignItems:"flex-end",flexShrink:0}}>
        <textarea className="inp" placeholder="Napiši poruku..." value={unos} onChange={e=>setUnos(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();posalji()}}} rows={1} style={{flex:1,minHeight:"auto",resize:"none",padding:"12px 14px",borderRadius:14,lineHeight:1.5}}/>
        <button onClick={posalji} disabled={!unos.trim()||ucitava} style={{width:46,height:46,borderRadius:"50%",background:unos.trim()&&!ucitava?C.primaryGrad:C.border,border:"none",display:"flex",alignItems:"center",justifyContent:"center",cursor:unos.trim()?"pointer":"default",flexShrink:0,transition:"all .2s",boxShadow:unos.trim()&&!ucitava?"0 4px 16px rgba(168,81,106,.35)":"none"}}>
          <Ico d={I.send} size={18} stroke="#fff" sw={2}/>
        </button>
      </div>
    </div>
  );
}

function Pocetna({ime,niz,onSOS,onNoviUnos,onLogout,unosi}){
  const [izvestaj,setIzvestaj]=useState(null);
  const h=new Date().getHours();
  const pozdrav=h<12?"Dobro jutro":h<18?"Dobar dan":"Dobro veče";
  const prikazIme=ime?.includes("@")?ime.split("@")[0]:ime;
  const dani=["Pon","Uto","Sre","Čet","Pet","Sub","Ned"];
  const puniDani=["Ponedeljak","Utorak","Sreda","Četvrtak","Petak","Subota","Nedelja"];
  const danas=new Date();
  const dow=danas.getDay();
  const ponedeljak=new Date(danas);
  ponedeljak.setDate(danas.getDate()-(dow===0?6:dow-1));
  ponedeljak.setHours(0,0,0,0);
  const weekData=Array.from({length:7},(_,i)=>{
    const d=new Date(ponedeljak.getTime()+i*86400000);
    const buduci=d.getTime()>danas.getTime();
    const entries=(unosi||[]).filter(e=>e.ts&&e.ts>=d.getTime()&&e.ts<d.getTime()+86400000);
    let s=null;
    if(!buduci){
      if(entries.some(e=>e.ish==="ep")) s="c";
      else if(entries.some(e=>e.ish==="try")) s="ž";
      else s="z";
    }
    return {s,entries,datum:d,naziv:puniDani[i]};
  });

  const bc=o=>o==="res"?C.green:o==="try"?C.amber:C.red;
  const bl=o=>o==="res"?"Odolela/o":o==="try"?"Pokušala/o":"Epizoda";

  return(
    <div style={{paddingBottom:24}}>
      {izvestaj!==null&&(
        <div style={{position:"fixed",inset:0,zIndex:200,display:"flex",flexDirection:"column",justifyContent:"flex-end"}} onClick={()=>setIzvestaj(null)}>
          <div style={{position:"absolute",inset:0,background:"rgba(30,20,16,.45)",backdropFilter:"blur(4px)"}}/>
          <div onClick={e=>e.stopPropagation()} style={{position:"relative",background:C.bg,borderRadius:"28px 28px 0 0",padding:"24px 24px 48px",maxHeight:"75vh",overflowY:"auto",boxShadow:"0 -8px 40px rgba(80,40,10,.18)"}} className="fi">
            <div style={{width:36,height:4,borderRadius:2,background:C.border,margin:"0 auto 20px"}}/>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
              <h3 className="serif" style={{fontSize:22,letterSpacing:-0.3}}>{weekData[izvestaj].naziv}</h3>
              <button onClick={()=>setIzvestaj(null)} style={{background:C.bgMuted,border:"none",borderRadius:50,width:34,height:34,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>
                <Ico d={I.x} size={14} stroke={C.textMid} sw={2}/>
              </button>
            </div>
            <p style={{fontSize:13,color:C.textLight,fontWeight:600,marginBottom:20}}>
              {weekData[izvestaj].datum.toLocaleDateString("sr",{day:"numeric",month:"long"})} · {weekData[izvestaj].entries.length} {weekData[izvestaj].entries.length===1?"unos":weekData[izvestaj].entries.length<5?"unosa":"unosa"}
            </p>
            {weekData[izvestaj].entries.length===0?(
              <div style={{textAlign:"center",padding:"24px 0"}}>
                <div style={{fontSize:40,marginBottom:12}}>✨</div>
                <p style={{fontWeight:700,color:C.green,fontSize:15,marginBottom:4}}>Čist dan!</p>
                <p style={{fontSize:13,color:C.textLight,fontWeight:500}}>Ovog dana nije bilo epizoda.</p>
              </div>
            ):(
              <div style={{display:"flex",flexDirection:"column",gap:12}}>
                {weekData[izvestaj].entries.map((u,idx)=>(
                  <div key={u.id||idx} style={{background:C.bgCard,borderRadius:18,padding:"16px",border:`1px solid ${C.border}`}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                      <span style={{fontSize:12,color:C.textLight,fontWeight:600}}>{u.datum}</span>
                      <span className="tag" style={{background:bc(u.ish)+"20",color:bc(u.ish)}}>{bl(u.ish)}</span>
                    </div>
                    <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:u.bel?10:0}}>
                      <span className="tag" style={{background:C.bgMuted,color:C.textMid}}>⚡ Impuls {u.int}/10</span>
                      {(Array.isArray(u.ok)?u.ok:[u.ok]).filter(Boolean).map(o=><span key={o} className="tag" style={{background:C.primaryLight,color:C.primaryDark}}>{o}</span>)}
                      {u.lok&&<span className="tag" style={{background:C.bgMuted,color:C.textMid}}>{u.lok}</span>}
                      {u.epre&&<span className="tag" style={{background:C.bgMuted,color:C.textMid}}>Pre: {u.epre}</span>}
                      {u.epost&&<span className="tag" style={{background:C.bgMuted,color:C.textMid}}>Posle: {u.epost}</span>}
                    </div>
                    {u.bel&&<p style={{fontSize:13,color:C.textMid,lineHeight:1.65,fontWeight:500,fontStyle:"italic"}}>"{u.bel}"</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      <div style={{padding:"60px 24px 24px",background:`linear-gradient(160deg,#F5E8D8 0%,${C.bgMuted} 55%,${C.bg} 100%)`}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
          <p style={{fontSize:13,color:C.textMid,fontWeight:600}}>{pozdrav},</p>
          <button onClick={onLogout} style={{background:"none",border:"none",fontSize:12,color:C.textLight,fontWeight:600,cursor:"pointer",fontFamily:"'Plus Jakarta Sans',sans-serif",padding:"4px 8px"}}>Odjavi se</button>
        </div>
        <h1 className="serif italic" style={{fontSize:38,lineHeight:1.1,letterSpacing:-0.5,marginBottom:22}}>{prikazIme}</h1>
        <div style={{background:"rgba(255,255,255,.78)",backdropFilter:"blur(12px)",borderRadius:24,padding:"18px 20px",border:`1px solid ${C.border}`,boxShadow:`0 4px 24px ${C.shadow}`}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div><span className="lbl">TRENUTNI NIZ</span>
              {niz===0?(
                <p style={{fontSize:16,fontWeight:700,color:C.textMid,marginTop:2}}>Počni danas! ✨</p>
              ):(
                <div style={{display:"flex",alignItems:"baseline",gap:8}}>
                  <span style={{fontSize:50,fontWeight:400,color:C.primary,fontFamily:"'Instrument Serif',serif",lineHeight:1}}>{niz}</span>
                  <span style={{fontSize:16,color:C.textMid,fontWeight:600}}>dana</span>
                </div>
              )}
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"center"}}><Ico d={niz===0?I.leaf:niz>=30?I.trophy:I.flame} size={40} stroke={niz===0?C.green:niz>=30?C.amber:C.primary} sw={1.8}/></div>
              <p style={{fontSize:11,color:C.textMid,fontWeight:700,marginTop:4}}>{niz===0?"Kreni!":niz<7?"Nastavi!":niz<14?"Sjajno!":niz<30?"Neverovatno!":"Šampion!"}</p>
            </div>
          </div>
          {(()=>{
            const now=new Date();
            const todayStart=new Date(now);todayStart.setHours(0,0,0,0);
            const badDanas=(unosi||[]).some(e=>e.ts&&e.ts>=todayStart.getTime()&&(e.ish==="ep"||e.ish==="try"));
            const minutesToday=now.getHours()*60+now.getMinutes();
            const pct=badDanas?0:Math.min((minutesToday/1440)*100,100);
            const faliMin=1440-minutesToday;
            const faliH=Math.floor(faliMin/60);
            const faliM=faliMin%60;
            const faliTekst=badDanas?"Resetovano":faliH>0?`${faliH}h ${faliM}m`:`${faliM}m`;
            return(
              <div style={{marginTop:14}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                  <span style={{fontSize:11,color:C.textLight,fontWeight:700}}>DO SLEDECE VATRICE 🔥</span>
                  <span style={{fontSize:11,color:badDanas?C.red:C.primary,fontWeight:700}}>{faliTekst}</span>
                </div>
                <div className="pb"><div className="pf" style={{width:`${pct}%`}}/></div>
                <div style={{display:"flex",justifyContent:"space-between",marginTop:5}}>
                  <span style={{fontSize:10,color:C.textLight,fontWeight:600}}>Ponoć</span>
                  <span style={{fontSize:10,color:C.textLight,fontWeight:600}}>Ponoć +1</span>
                </div>
              </div>
            );
          })()}
        </div>
      </div>
      <div style={{padding:"16px 20px 0"}}>
        <div className="card fi" style={{marginBottom:14}}>
          <span className="lbl">OVA NEDELJA</span>
          <div style={{display:"flex",gap:4,justifyContent:"space-between"}}>
            {weekData.map(({s,entries},i)=>(
              <div key={i} onClick={()=>s!==null&&setIzvestaj(i)} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:5,cursor:s!==null?"pointer":"default"}}>
                <div style={{width:36,height:36,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",background:s==="z"?C.greenLight:s==="ž"?C.amberLight:s==="c"?"#FAE8E8":C.bgMuted,boxShadow:s==="z"?"0 2px 8px rgba(90,154,110,.22)":s==="c"?"0 2px 8px rgba(192,80,80,.18)":"none",transition:"all .2s",transform:izvestaj===i?"scale(1.15)":"scale(1)"}}>
                  {s==="z"&&<Ico d={I.check} size={15} stroke={C.green} sw={2.5}/>}
                  {s==="ž"&&<span style={{fontSize:16,color:C.amber,fontWeight:700,lineHeight:1}}>~</span>}
                  {s==="c"&&<Ico d={I.x} size={13} stroke={C.red} sw={2.5}/>}
                  {s===null&&<span style={{width:6,height:6,borderRadius:"50%",background:C.border,display:"block"}}/>}
                </div>
                <span style={{fontSize:9,color:izvestaj===i?C.primary:C.textLight,fontWeight:700}}>{dani[i]}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card fi" style={{marginBottom:14,background:`linear-gradient(135deg,${C.primaryLight} 0%,${C.purpleLight} 100%)`,border:`1px solid ${C.border}`}}>
          <span className="lbl">PORUKA DANA</span>
          <p style={{fontSize:15,color:C.primaryDark,fontWeight:600,lineHeight:1.65,fontFamily:"'Instrument Serif',serif",fontStyle:"italic"}}>{PORUKE_DANA[Math.floor((Date.now()-new Date(new Date().getFullYear(),0,0).getTime())/86400000)%PORUKE_DANA.length]}</p>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14}}>
          <button onClick={onSOS} style={{height:130,borderRadius:24,background:C.primaryGrad,border:"none",color:"#fff",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:10,position:"relative",overflow:"hidden",boxShadow:"0 8px 32px rgba(196,113,74,.42)"}}>
            <div style={{position:"absolute",top:-20,right:-20,width:80,height:80,borderRadius:"50%",background:"rgba(255,255,255,.14)"}}/>
            <div style={{position:"absolute",bottom:-30,left:-20,width:80,height:80,borderRadius:"50%",background:"rgba(255,255,255,.08)"}}/>
            <div style={{width:50,height:50,borderRadius:"50%",background:"rgba(255,255,255,.22)",display:"flex",alignItems:"center",justifyContent:"center"}}>
              <Ico d={I.shield} size={24} stroke="#fff" sw={2}/>
            </div>
            <div><p style={{fontSize:16,fontWeight:700,textAlign:"center"}}>SOS</p><p style={{fontSize:11,opacity:.85,textAlign:"center",fontWeight:500}}>Trebam pomoć</p></div>
          </button>
          <button onClick={onNoviUnos} style={{height:130,borderRadius:24,background:C.bgCard,border:`1.5px solid ${C.border}`,cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:10,boxShadow:`0 4px 16px ${C.shadow}`}}>
            <div style={{width:50,height:50,borderRadius:"50%",background:C.primaryLight,display:"flex",alignItems:"center",justifyContent:"center"}}>
              <Ico d={I.journal} size={24} stroke={C.primary} sw={1.8}/>
            </div>
            <div><p style={{fontSize:15,fontWeight:700,color:C.text,textAlign:"center"}}>Upiši epizodu</p><p style={{fontSize:11,color:C.textLight,textAlign:"center",fontWeight:500}}>Dodaj u dnevnik</p></div>
          </button>
        </div>
      </div>
    </div>
  );
}

function Dnevnik({noviUnosi,onDodaj,onIzmeni,onObrisi}){
  const [otvoren,setOtvoren]=useState(null);
  const [potvrda,setPotvrda]=useState(null);
  const bc=o=>o==="res"?C.green:o==="try"?C.amber:C.red;
  const bl=o=>o==="res"?"Odolela":o==="try"?"Pokušala":"Epizoda";
  return(
    <div style={{paddingBottom:20}} className="fi">
      <div style={{padding:"60px 24px 20px",background:`linear-gradient(160deg,${C.primaryLight} 0%,${C.bg} 70%)`}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end"}}>
          <div><h1 className="serif" style={{fontSize:32,letterSpacing:-0.5}}>Dnevnik</h1><p style={{fontSize:13,color:C.textLight,fontWeight:600,marginTop:2}}>{noviUnosi.length} {noviUnosi.length===1?"unos":noviUnosi.length<5?"unosa":"unosa"}</p></div>
          <button onClick={onDodaj} style={{width:48,height:48,borderRadius:"50%",background:C.primaryGrad,border:"none",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",boxShadow:`0 4px 18px rgba(196,113,74,.4)`}}>
            <Ico d={I.plus} size={22} stroke="#fff" sw={2.5}/>
          </button>
        </div>
      </div>
      <div style={{padding:"0 20px"}}>
        {noviUnosi.length===0&&(
          <div style={{textAlign:"center",padding:"48px 24px"}}>
            <div style={{width:72,height:72,borderRadius:"50%",background:C.primaryLight,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px"}}><Ico d={I.journal} size={32} stroke={C.primary} sw={1.5}/></div>
            <h3 className="serif" style={{fontSize:22,marginBottom:8}}>Još nema unosa</h3>
            <p style={{fontSize:14,color:C.textLight,fontWeight:500,lineHeight:1.7,marginBottom:24}}>Svaki zabeleženi trenutak<br/>pomaže ti da razumeš svoje obrasce.</p>
            <button onClick={onDodaj} className="btn-p" style={{width:"auto",padding:"14px 32px"}}>Dodaj prvi unos →</button>
          </div>
        )}
        {noviUnosi.map(u=>(
          <div key={u.id} className="card fi" style={{marginBottom:12,cursor:"pointer"}} onClick={()=>setOtvoren(otvoren===u.id?null:u.id)}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
              <span style={{fontSize:12,color:C.textLight,fontWeight:600}}>{u.datum}</span>
              <span className="tag" style={{background:bc(u.ish)+"20",color:bc(u.ish)}}>{bl(u.ish)}</span>
            </div>
            <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
              {(Array.isArray(u.ok)?u.ok:[u.ok]).filter(Boolean).map(o=><span key={o} className="tag" style={{background:C.primaryLight,color:C.primaryDark}}>{o}</span>)}
              <span className="tag" style={{background:C.bgMuted,color:C.textMid}}>⚡ {u.int}/10</span>
              {u.lok&&<span className="tag" style={{background:C.bgMuted,color:C.textMid}}>{u.lok}</span>}
            </div>
            {otvoren===u.id&&(
              <div className="fi" style={{borderTop:`1px solid ${C.border}`,marginTop:14,paddingTop:14}}>
                {u.bel&&<p style={{fontSize:13,color:C.textMid,lineHeight:1.7,fontWeight:500,marginBottom:12}}>{u.bel}</p>}
                {u.slike?.length>0&&<div style={{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap"}}>{u.slike.map((s,i)=><img key={i} src={s} alt="" style={{width:76,height:76,borderRadius:14,objectFit:"cover"}}/>)}</div>}
                <div style={{display:"flex",gap:8,marginTop:4}}>
                  <button onClick={e=>{e.stopPropagation();onIzmeni(u);}} style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:6,padding:"11px 0",borderRadius:14,border:`1.5px solid ${C.border}`,background:C.bgMuted,color:C.textMid,fontWeight:600,fontSize:13,cursor:"pointer",fontFamily:"inherit",transition:"all .15s"}}>
                    <Ico d={I.edit} size={14} stroke={C.textMid} sw={2}/>Izmeni
                  </button>
                  {potvrda===u.id
                    ?<button onClick={e=>{e.stopPropagation();onObrisi(u.id);setPotvrda(null);setOtvoren(null);}} style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:6,padding:"11px 0",borderRadius:14,border:"none",background:C.red,color:"#fff",fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>
                        <Ico d={I.check} size={14} stroke="#fff" sw={2.5}/>Potvrdi
                      </button>
                    :<button onClick={e=>{e.stopPropagation();setPotvrda(u.id);}} style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:6,padding:"11px 0",borderRadius:14,border:`1.5px solid ${C.red}30`,background:`${C.red}08`,color:C.red,fontWeight:600,fontSize:13,cursor:"pointer",fontFamily:"inherit",transition:"all .15s"}}>
                        <Ico d={I.trash} size={14} stroke={C.red} sw={1.8}/>Obriši
                      </button>
                  }
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function Napredak({unosi,niz}){
  const OKI_BOJE=[C.primary,C.purple,C.amber,C.green,C.textLight];

  // epizode po mesecu — poslednjih 6 meseci
  const meseci=Array.from({length:6},(_,i)=>{
    const d=new Date();d.setDate(1);d.setMonth(d.getMonth()-5+i);
    const mes=d.toLocaleString("sr",{month:"short"});
    const br=unosi.filter(e=>{
      if(!e.ts) return false;
      const ed=new Date(e.ts);
      return ed.getMonth()===d.getMonth()&&ed.getFullYear()===d.getFullYear()&&(e.ish==="ep"||e.ish==="try");
    }).length;
    return {mes,br};
  });
  const maxBr=Math.max(...meseci.map(m=>m.br),1);

  // rekordni niz
  function calcBest(){
    const withTs=unosi.filter(e=>e.ts).sort((a,b)=>a.ts-b.ts);
    if(!withTs.length) return 0;
    const badSet=new Set(withTs.filter(e=>e.ish==="try"||e.ish==="ep").map(e=>{const d=new Date(e.ts);return`${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;}));
    const start=new Date(withTs[0].ts);const today=new Date();
    const total=Math.floor((today-start)/86400000)+1;
    let best=0,cur=0;
    for(let i=0;i<total;i++){
      const d=new Date(start.getTime()+i*86400000);
      const k=`${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      if(!badSet.has(k)){cur++;best=Math.max(best,cur);}else cur=0;
    }
    return best;
  }

  // najčešći okidači
  const okCounts={};
  unosi.forEach(e=>{(Array.isArray(e.ok)?e.ok:[e.ok]).filter(Boolean).forEach(o=>{okCounts[o]=(okCounts[o]||0)+1;});});
  const totalOk=Object.values(okCounts).reduce((a,b)=>a+b,0);
  const topOki=Object.entries(okCounts).sort((a,b)=>b[1]-a[1]).slice(0,5).map(([l,n],i)=>({l,p:Math.round(n/totalOk*100),c:OKI_BOJE[i]}));

  const total=unosi.length;
  const best=calcBest();
  const resCount=unosi.filter(e=>e.ish==="res").length;
  const resP=total?Math.round(resCount/total*100):0;

  if(total===0) return(
    <div style={{paddingBottom:24}} className="fi">
      <div style={{padding:"60px 24px 24px",background:`linear-gradient(160deg,${C.amberLight} 0%,${C.bg} 70%)`}}>
        <h1 className="serif" style={{fontSize:32,letterSpacing:-0.5,marginBottom:4}}>Napredak</h1>
        <p style={{fontSize:13,color:C.textMid,fontWeight:600}}>Prati svoj put</p>
      </div>
      <div style={{textAlign:"center",padding:"48px 24px"}}>
        <div style={{width:72,height:72,borderRadius:"50%",background:C.primaryLight,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px"}}><Ico d={I.chart} size={32} stroke={C.primary} sw={1.5}/></div>
        <h3 className="serif" style={{fontSize:22,marginBottom:8}}>Još nema podataka</h3>
        <p style={{fontSize:14,color:C.textLight,fontWeight:500,lineHeight:1.7}}>Kada počneš da unosiš epizode,<br/>ovde ćeš videti svoje obrasce i napredak.</p>
      </div>
    </div>
  );

  return(
    <div style={{paddingBottom:24}} className="fi">
      <div style={{padding:"60px 24px 24px",background:`linear-gradient(160deg,${C.amberLight} 0%,${C.bg} 70%)`}}>
        <h1 className="serif" style={{fontSize:32,letterSpacing:-0.5,marginBottom:4}}>Napredak</h1>
        <p style={{fontSize:13,color:C.textMid,fontWeight:600}}>Pogledaj koliko si napredovala</p>
      </div>
      <div style={{padding:"0 20px"}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14}}>
          {[[niz===0?I.leaf:I.flame,niz===0?C.green:C.primary,String(niz),"Trenutni niz"],[I.trophy,C.amber,String(best),"Rekordni niz"],[I.check,C.green,`${resP}%`,"Odolelo"],[I.journal,C.textMid,String(total),"Ukupno unosa"]].map(([ico,clr,v,l])=>(
            <div key={l} className="card" style={{padding:"18px 16px"}}>
              <div style={{marginBottom:8}}><Ico d={ico} size={22} stroke={clr} sw={2}/></div>
              <div style={{fontSize:32,fontWeight:400,color:clr,marginBottom:3,fontFamily:"'Instrument Serif',serif",lineHeight:1}}>{v}</div>
              <div style={{fontSize:10,color:C.textLight,fontWeight:700,letterSpacing:0.8,textTransform:"uppercase"}}>{l}</div>
            </div>
          ))}
        </div>
        <div className="card" style={{marginBottom:14}}>
          <span className="lbl">EPIZODE PO MESECU</span>
          <div style={{display:"flex",alignItems:"flex-end",gap:10,height:100}}>
            {meseci.map((m,i)=>(
              <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:6}}>
                {m.br>0&&<span style={{fontSize:12,color:C.textMid,fontWeight:700}}>{m.br}</span>}
                <div style={{width:"100%",height:m.br?`${(m.br/maxBr)*80}px`:"6px",background:i===meseci.length-1?C.green:C.primary+(i===meseci.length-2?"CC":"66"),borderRadius:"10px 10px 0 0",minHeight:6,opacity:m.br?1:.25}}/>
                <span style={{fontSize:11,color:C.textLight,fontWeight:700}}>{m.mes}</span>
              </div>
            ))}
          </div>
        </div>
        {topOki.length>0&&<div className="card">
          <span className="lbl">NAJČEŠĆI OKIDAČI</span>
          {topOki.map(o=>(
            <div key={o.l} style={{marginBottom:14}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><span style={{fontSize:14,color:C.textMid,fontWeight:600}}>{o.l}</span><span style={{fontSize:14,fontWeight:700,color:o.c}}>{o.p}%</span></div>
              <div className="pb" style={{height:7}}><div className="pf" style={{width:`${o.p}%`,background:o.c}}/></div>
            </div>
          ))}
        </div>}
      </div>
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
];
const kBoja=k=>k==="Edukacija"?[C.purpleLight,C.purple]:k==="Tehnika"?[C.primaryLight,C.primaryDark]:[C.amberLight,C.amber];

function Clanak({clanak,onNazad}){
  const [b,f]=kBoja(clanak.k);
  return(
    <div style={{padding:"56px 20px 48px"}} className="fi">
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
          if(s.tip==="uvod") return<div key={i} style={{background:b,borderRadius:20,padding:"20px 22px"}}><p style={{fontSize:16,color:C.text,lineHeight:1.8,fontStyle:"italic",fontFamily:"'Instrument Serif',serif"}}>{s.t}</p></div>;
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
      <div style={{padding:"60px 24px 24px",background:`linear-gradient(160deg,${C.purpleLight} 0%,${C.bg} 70%)`}}>
        <h1 className="serif" style={{fontSize:32,letterSpacing:-0.5,marginBottom:4}}>Biblioteka</h1>
        <p style={{fontSize:13,color:C.textMid,fontWeight:600}}>Znanje koje podržava tvoj put</p>
      </div>
      <div style={{padding:"0 20px"}}>
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

export default function App(){
  const [faza,setFaza]=useState("loading");const [kor,setKor]=useState(null);const [ekran,setEkran]=useState("poc");
  const [priSOS,setPriSOS]=useState(false);const [priUnos,setPriUnos]=useState(false);const [editUnos,setEditUnos]=useState(null);
  const [noviUnosi,setNoviUnosi]=useState([]);

  useEffect(()=>{
    supabase.auth.getSession().then(({data:{session}})=>{
      if(session) resolveSession(session);
      else setFaza("auth");
    });
    const {data:{subscription}}=supabase.auth.onAuthStateChange((event,session)=>{
      if(!session){setFaza("auth");setKor(null);}
    });
    return()=>subscription.unsubscribe();
  },[]);

  async function resolveSession(session){
    const {data:profile}=await supabase.from("profiles").select("name").eq("id",session.user.id).single();
    const ime=profile?.name||session.user.user_metadata?.name||session.user.email;
    setKor({ime,id:session.user.id,registeredAt:session.user.created_at});
    setFaza("app");
    loadJournalEntries(session.user.id);
  }

  async function loadJournalEntries(userId){
    const {data}=await supabase.from("journal_entries").select("*").eq("user_id",userId).order("created_at",{ascending:false});
    if(data) setNoviUnosi(data.map(e=>({id:e.id,datum:new Date(e.created_at).toLocaleString("sr"),ts:new Date(e.created_at).getTime(),int:e.intensity,ok:safeParseOk(e.trigger),lok:e.location,epre:e.emotion_before,epost:e.emotion_after,ish:e.outcome,bel:e.note,slike:e.images||[]})));
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
        emotion_before:u.epre,emotion_after:u.epost,outcome:u.ish,note:u.bel,images:u.slike
      }).select().single();
      if(data) setNoviUnosi(v=>[{id:data.id,datum:"Upravo",ts:Date.now(),int:u.int,ok:u.ok,lok:u.lok,epre:u.epre,epost:u.epost,ish:u.ish,bel:u.bel,slike:u.slike},...v]);
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
        <div style={{width:52,height:52,borderRadius:16,background:C.primaryGrad,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px",boxShadow:"0 8px 28px rgba(196,113,74,.4)"}}>
          <Ico d={I.leaf} size={26} stroke="#fff" sw={2}/>
        </div>
        <p style={{color:C.textMid,fontWeight:600,fontSize:15}}>Učitava se...</p>
      </div>
    </div></>
  );

  return(
    <><style>{fonts}{css}</style>
    <div className="app">
      {faza==="auth"&&<Auth onDone={u=>{setKor(u);supabase.auth.getSession().then(({data:{session}})=>{if(session){loadJournalEntries(session.user.id);}});setFaza("app");}}/>}
      {faza==="app"&&(
        priSOS?(
          <div style={{minHeight:"100vh",background:C.bg,overflowY:"auto"}} className="fi"><SOS onZatvori={()=>setPriSOS(false)}/></div>
        ):priUnos?(
          <div style={{minHeight:"100vh",background:C.bg,overflowY:"auto"}} className="fi"><NoviUnos onSacuvaj={handleSacuvajUnos} onOtkazi={()=>{setPriUnos(false);setEditUnos(null);}} editData={editUnos}/></div>
        ):(
          <>
            <div style={{paddingBottom:ekran==="chat"?0:76,overflowY:ekran==="chat"?"hidden":"auto",height:ekran==="chat"?"calc(100vh - 72px)":"auto",display:ekran==="chat"?"flex":"block",flexDirection:"column"}}>
              {ekran==="poc"&&<Pocetna ime={kor?.ime||"Ana"} niz={calcStreak(noviUnosi,kor?.registeredAt)} unosi={noviUnosi} onSOS={()=>setPriSOS(true)} onNoviUnos={()=>setPriUnos(true)} onLogout={handleLogout}/>}
              {ekran==="dnv"&&<Dnevnik noviUnosi={noviUnosi} onDodaj={()=>setPriUnos(true)} onIzmeni={u=>{setEditUnos(u);setPriUnos(true);}} onObrisi={handleObrisiUnos}/>}
              {ekran==="nap"&&<Napredak unosi={noviUnosi} niz={calcStreak(noviUnosi,kor?.registeredAt)}/>}
              {ekran==="bib"&&<Biblioteka/>}
              {ekran==="chat"&&<AIChat ime={kor?.ime||""} niz={calcStreak(noviUnosi,kor?.registeredAt)} unosi={noviUnosi} userId={kor?.id} onSOS={()=>setPriSOS(true)}/>}
            </div>
            <nav className="bnav">
              {NAV.map(n=>(
                <button key={n.id} className={`ni${ekran===n.id?" active":""}`} onClick={()=>setEkran(n.id)}>
                  <Ico d={I[n.ico]} size={22} stroke={ekran===n.id?C.primary:C.textLight} sw={ekran===n.id?2.2:1.6}/>
                  <span style={{fontSize:10,fontWeight:700,color:ekran===n.id?C.primary:C.textLight}}>{n.l}</span>
                </button>
              ))}
            </nav>
          </>
        )
      )}
    </div></>
  );
}
