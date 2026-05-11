import { useState, useEffect, useRef } from "react";
import { supabase } from "./supabase";

const C = {
  bg:"#F8F4FB",bgCard:"#FFFFFF",bgMuted:"#F0EAF5",
  primary:"#A8516A",primaryGrad:"linear-gradient(135deg,#C06080 0%,#8B3F5C 100%)",
  primaryLight:"#F7E8EE",primaryDark:"#7A2E48",
  purple:"#7E6BA8",purpleLight:"#EDE8F8",
  text:"#160D1E",textMid:"#5E4870",textLight:"#A090B5",
  green:"#4E9E7A",greenLight:"#E3F5EC",
  amber:"#C4813A",amberLight:"#FBF0E3",
  red:"#B85555",border:"#E8DDEF",shadow:"rgba(60,20,80,0.08)",
};
const fonts=`@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');`;
const css=`
*{box-sizing:border-box;margin:0;padding:0;}
body{background:${C.bg};}
.app{font-family:'Plus Jakarta Sans',sans-serif;background:${C.bg};min-height:100vh;max-width:390px;margin:0 auto;position:relative;color:${C.text};overflow-x:hidden;}
.serif{font-family:'Instrument Serif',serif;}
.italic{font-style:italic;}
.btn-p{background:${C.primaryGrad};color:#fff;border:none;border-radius:16px;padding:17px 28px;font-size:16px;font-weight:700;font-family:'Plus Jakarta Sans',sans-serif;cursor:pointer;width:100%;transition:all .18s;box-shadow:0 4px 20px rgba(168,81,106,.35);}
.btn-p:active{transform:scale(.98);}
.btn-o{background:transparent;color:${C.primary};border:1.5px solid ${C.border};border-radius:16px;padding:15px 28px;font-size:15px;font-weight:600;font-family:'Plus Jakarta Sans',sans-serif;cursor:pointer;width:100%;}
.btn-g{background:transparent;color:${C.textMid};border:none;font-size:14px;font-family:'Plus Jakarta Sans',sans-serif;cursor:pointer;padding:6px;display:flex;align-items:center;gap:6px;font-weight:500;}
.card{background:${C.bgCard};border-radius:24px;box-shadow:0 2px 12px ${C.shadow},0 1px 3px rgba(60,20,80,.04);padding:20px;}
.chip{display:inline-flex;align-items:center;gap:6px;padding:9px 16px;border-radius:100px;border:1.5px solid ${C.border};background:${C.bgCard};font-size:13px;color:${C.textMid};cursor:pointer;transition:all .16s;font-family:'Plus Jakarta Sans',sans-serif;font-weight:500;}
.chip.on{border-color:${C.primary};background:${C.primaryLight};color:${C.primaryDark};}
.cr{display:block;width:100%;text-align:left;padding:16px 20px;border-radius:16px;border:1.5px solid ${C.border};background:${C.bgCard};font-size:15px;color:${C.textMid};cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;margin-bottom:10px;transition:all .16s;font-weight:500;}
.cr.on{border-color:${C.primary};background:${C.primaryLight};color:${C.primaryDark};font-weight:600;}
.inp{width:100%;padding:15px 18px;border-radius:16px;border:1.5px solid ${C.border};background:${C.bgCard};font-size:15px;font-family:'Plus Jakarta Sans',sans-serif;color:${C.text};outline:none;transition:all .18s;font-weight:500;}
.inp:focus{border-color:${C.primary};box-shadow:0 0 0 4px ${C.primaryLight};}
textarea.inp{resize:none;min-height:80px;line-height:1.65;}
.bnav{position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:100%;max-width:390px;background:rgba(255,255,255,.88);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);border-top:1px solid rgba(232,221,239,.7);display:flex;z-index:100;padding:6px 8px calc(env(safe-area-inset-bottom,0px) + 8px);gap:4px;}
.ni{flex:1;display:flex;flex-direction:column;align-items:center;gap:3px;padding:8px 4px 6px;cursor:pointer;background:none;border:none;border-radius:14px;transition:all .18s;}
.ni.active{background:${C.primaryLight};}
.tag{display:inline-block;padding:4px 12px;border-radius:100px;font-size:11px;font-weight:700;}
.fi{animation:fi .28s cubic-bezier(.4,0,.2,1);}
@keyframes fi{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
.pb{height:4px;background:${C.border};border-radius:100px;overflow:hidden;}
.pf{height:100%;background:${C.primaryGrad};border-radius:100px;transition:width .4s ease;}
.emb{background:${C.bgMuted};border:2px solid transparent;border-radius:18px;padding:13px 6px;cursor:pointer;transition:all .16s;text-align:center;flex:1;}
.emb.on{border-color:${C.primary};background:${C.primaryLight};}
.bbu{background:${C.primaryGrad};color:#fff;border-radius:22px 22px 6px 22px;padding:13px 17px;font-size:14px;line-height:1.6;max-width:78%;align-self:flex-end;box-shadow:0 4px 20px rgba(140,63,88,.3);font-weight:500;}
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
  journal:["M4 4h16v16H4z","M8 8h8","M8 12h8","M8 16h5"],
  chart:["M18 20V10","M12 20V4","M6 20v-6"],
  library:["M4 19.5A2.5 2.5 0 016.5 17H20","M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"],
  chat:"M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z",
  heart:"M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z",
  send:["M22 2L11 13","M22 2L15 22l-4-9-9-4 22-7z"],
  plus:["M12 5v14","M5 12h14"],
  back:"M19 12H5 M12 19l-7-7 7-7",
  x:["M18 6L6 18","M6 6l12 12"],
  spark:"M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z",
  check:"M20 6L9 17l-5-5",
  chev:"M9 18l6-6-6-6",
};

const RAS=["😔","😕","😐","🙂","😊"],RAS_N=["Teško","Loše","Okej","Dobro","Sjajno"];
const EMOCIJE=[["😰","Anksiozna"],["😢","Tužna"],["😤","Ljuta"],["😶","Utrnula"],["😴","Umorna"],["😐","Neutralna"],["😌","Mirna"],["😊","Dobro"]];
const LOK=["🛋️ Dnevna","🛁 Kupatilo","🍳 Kuhinja","🛏️ Spavaća","💼 Posao","🚗 Auto","🌳 Napolju","📱 Krevet"];
const OKI=["Stres","Umor","Ogledalo","Dosada","Ekrani","Tuga","Učenje","Jelo","Ostalo"];

function validEmail(e){return/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);}

function Auth({onDone}){
  const [mode,setMode]=useState("w");
  const [ime,setIme]=useState("");const [em,setEm]=useState("");const [loz,setLoz]=useState("");const [loz2,setLoz2]=useState("");
  const [errs,setErrs]=useState({});const [loading,setLoading]=useState(false);
  const [showLoz,setShowLoz]=useState(false);const [showLoz2,setShowLoz2]=useState(false);
  const [uspeh,setUspeh]=useState("");

  function reset(){setErrs({});setUspeh("");}

  if(mode==="w") return(
    <div className="fi" style={{minHeight:"100vh",background:"linear-gradient(160deg,#F0D8E8 0%,#EAE0F8 45%,"+C.bg+" 100%)",display:"flex",flexDirection:"column",justifyContent:"space-between",padding:"0 0 52px"}}>
      <div style={{padding:"72px 32px 0"}}>
        <div style={{width:60,height:60,borderRadius:20,background:C.primaryGrad,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:32,boxShadow:"0 8px 28px rgba(168,81,106,.4)"}}>
          <Ico d={I.heart} size={28} stroke="#fff" sw={2}/>
        </div>
        <h1 className="serif italic" style={{fontSize:56,lineHeight:1.05,marginBottom:14,letterSpacing:-1}}>Unpick</h1>
        <p style={{fontSize:16,color:C.textMid,lineHeight:1.8,maxWidth:270,fontWeight:500}}>Nežni pratilac na tvom putu ka slobodi od čačkanja kože.</p>
      </div>
      <div style={{padding:"0 28px",display:"flex",flexDirection:"column",gap:12}}>
        <button className="btn-p" onClick={()=>{setMode("r");reset();}}>Napravi nalog</button>
        <button className="btn-o" onClick={()=>{setMode("l");reset();}}>Već imam nalog</button>
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

  const EyeBtn=({show,toggle})=><button type="button" onClick={toggle} style={{position:"absolute",right:14,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:C.textLight,padding:4,lineHeight:1}}>{show?"🙈":"👁️"}</button>;

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

  return(
    <div className="fi" style={{minHeight:"100vh",padding:"0 0 40px",background:C.bg}}>
      <div style={{padding:"52px 28px 32px",background:"linear-gradient(160deg,#F0D8E8 0%,#EAE0F8 60%,"+C.bg+" 100%)"}}>
        <button className="btn-g" style={{marginBottom:20,padding:0}} onClick={()=>{setMode("w");reset();setIme("");setEm("");setLoz("");setLoz2("");}}><Ico d={I.back} size={18} stroke={C.textMid}/> Nazad</button>
        <h2 className="serif" style={{fontSize:36,marginBottom:6,letterSpacing:-0.5}}>{isL?"Dobrodošla nazad 👋":"Napravi nalog 🌸"}</h2>
        <p style={{color:C.textMid,fontSize:14,fontWeight:500}}>{isL?"Drago nam je što si tu.":"Bez osude — samo podrška."}</p>
      </div>
      <div style={{padding:"24px 28px 0",display:"flex",flexDirection:"column",gap:18}}>
        {!isL&&<div>
          <input className="inp" placeholder="Tvoje ime" value={ime} onChange={e=>{setIme(e.target.value);if(errs.ime)setErrs(v=>({...v,ime:""}));}} style={{borderColor:errs.ime?C.red:undefined}}/>
          {prevErr("ime")}
        </div>}
        <div>
          <input className="inp" placeholder="Email adresa" value={em} onChange={e=>{setEm(e.target.value);if(errs.em)setErrs(v=>({...v,em:""}));}} type="email" style={{borderColor:errs.em?C.red:undefined}}/>
          {prevErr("em")}
        </div>
        <div>
          <div style={{position:"relative"}}>
            <input className="inp" type={showLoz?"text":"password"} placeholder="Lozinka" value={loz} onChange={e=>{setLoz(e.target.value);if(errs.loz)setErrs(v=>({...v,loz:""}));}} style={{paddingRight:44,borderColor:errs.loz?C.red:undefined}}/>
            <EyeBtn show={showLoz} toggle={()=>setShowLoz(v=>!v)}/>
          </div>
          {prevErr("loz",!isL?"Najmanje 6 karaktera":null)}
        </div>
        {!isL&&<div>
          <div style={{position:"relative"}}>
            <input className="inp" type={showLoz2?"text":"password"} placeholder="Ponovi lozinku" value={loz2} onChange={e=>{setLoz2(e.target.value);if(errs.loz2)setErrs(v=>({...v,loz2:""}));}} style={{paddingRight:44,borderColor:errs.loz2?C.red:undefined}}/>
            <EyeBtn show={showLoz2} toggle={()=>setShowLoz2(v=>!v)}/>
          </div>
          {prevErr("loz2")}
        </div>}
        {errs.general&&<div style={{background:"#FAEAEA",borderRadius:14,padding:"12px 16px",border:`1px solid ${C.red}20`}}><p style={{color:C.red,fontSize:13,fontWeight:600,textAlign:"center"}}>{errs.general}</p></div>}
        {uspeh&&<div style={{background:C.greenLight,borderRadius:14,padding:"12px 16px",border:`1px solid ${C.green}30`}}><p style={{color:C.green,fontSize:13,fontWeight:600,textAlign:"center"}}>{uspeh}</p></div>}
        <div style={{height:4}}/>
        <button className="btn-p" onClick={handleSubmit} disabled={loading||!!uspeh} style={{opacity:(loading||!!uspeh)?0.7:1}}>
          {loading?"Molimo sačekajte...":(isL?"Prijavi se →":"Registruj se →")}
        </button>
        <button className="btn-g" style={{justifyContent:"center",marginTop:4}} onClick={()=>{setMode(isL?"r":"l");reset();setLoz("");setLoz2("");}}>
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
  const [faza,setFaza]=useState("int");const [int,setInt]=useState(5);const [alat,setAlat]=useState(null);
  const [ishod,setIshod]=useState(null);const [dk,setDk]=useState(0);const [tajmer,setTajmer]=useState(300);const [tAkt,setTAkt]=useState(false);
  const ref=useRef(null);
  useEffect(()=>{if(tAkt&&tajmer>0){ref.current=setInterval(()=>setTajmer(t=>t-1),1000)}return()=>clearInterval(ref.current)},[tAkt,tajmer]);
  const fmt=s=>`${Math.floor(s/60)}:${String(s%60).padStart(2,"0")}`;
  const W=({ch})=><div style={{minHeight:"100vh",padding:"32px 24px 48px",background:C.bg}} className="fi">{ch}</div>;
  const XBtn=()=><div style={{display:"flex",justifyContent:"flex-end",marginBottom:24}}><button style={{background:C.bgMuted,border:"none",borderRadius:50,width:40,height:40,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}} onClick={onZatvori}><Ico d={I.x} size={16} stroke={C.textMid} sw={2}/></button></div>;
  const ALATI=[{id:"dis",icon:"🫁",l:"Vežba disanja",op:"4-7-8 tehnika"},{id:"taj",icon:"⏱️",l:"Čekaj 5 minuta",op:"Impulsi prolaze"},{id:"ruke",icon:"🤲",l:"Zaposli ruke",op:"Alternativne aktivnosti"},{id:"uzem",icon:"🌿",l:"Uzemljenje",op:"5-4-3-2-1 tehnika"},{id:"meh",icon:"🫧",l:"Prsni mehuriće",op:"Igrica"},{id:"boj",icon:"🎨",l:"Igra boja",op:"Igrica"}];

  if(faza==="int") return(
    <div style={{minHeight:"100vh",padding:"32px 24px 48px",background:C.bg}} className="fi">
      <div style={{display:"flex",justifyContent:"flex-end",marginBottom:24}}><button style={{background:C.bgMuted,border:"none",borderRadius:50,width:40,height:40,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}} onClick={onZatvori}><Ico d={I.x} size={16} stroke={C.textMid} sw={2}/></button></div>
      <div style={{textAlign:"center",marginBottom:32}}>
        <div style={{width:80,height:80,borderRadius:"50%",background:C.primaryLight,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px"}}><Ico d={I.heart} size={38} stroke={C.primary} sw={1.8}/></div>
        <h2 className="serif" style={{fontSize:30,lineHeight:1.2,marginBottom:10,letterSpacing:-0.3}}>Potražila si pomoć.<br/><span className="italic" style={{color:C.primary}}>To je hrabro.</span></h2>
        <p style={{color:C.textMid,fontSize:15,fontWeight:500}}>Hajde zajedno kroz ovo.</p>
      </div>
      <div className="card" style={{textAlign:"center",marginBottom:24}}>
        <span className="lbl">Koliko je jak impuls sada?</span>
        <div style={{fontSize:64,fontWeight:400,color:C.primary,marginBottom:16,fontFamily:"'Instrument Serif',serif",lineHeight:1}}>{int}</div>
        <input type="range" min={1} max={10} value={int} onChange={e=>setInt(+e.target.value)} style={{width:"100%",accentColor:C.primary}}/>
        <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:C.textLight,marginTop:8,fontWeight:600}}><span>Slab</span><span>Jak</span></div>
      </div>
      <button className="btn-p" onClick={()=>setFaza("izb")}>Izaberi tehniku →</button>
    </div>
  );

  if(faza==="izb") return(
    <div style={{minHeight:"100vh",padding:"32px 24px 48px",background:C.bg}} className="fi">
      <button className="btn-g" style={{marginBottom:22}} onClick={()=>setFaza("int")}><Ico d={I.back} size={16} stroke={C.textMid}/> Nazad</button>
      <h2 className="serif" style={{fontSize:26,marginBottom:4,letterSpacing:-0.3}}>Šta danas probamo?</h2>
      <p style={{fontSize:14,color:C.textMid,marginBottom:20,fontWeight:500}}>Tehnika smirenja ili igrica za distrakciju</p>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {ALATI.map(a=>(
          <button key={a.id} onClick={()=>{setAlat(a.id);setFaza("alat")}} style={{background:C.bgCard,border:`1.5px solid ${C.border}`,borderRadius:20,padding:"16px 20px",cursor:"pointer",display:"flex",alignItems:"center",gap:16,textAlign:"left",boxShadow:`0 2px 8px ${C.shadow}`}}>
            <div style={{width:50,height:50,borderRadius:16,background:C.primaryLight,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,flexShrink:0}}>{a.icon}</div>
            <div style={{flex:1}}><p style={{fontWeight:600,fontSize:15,color:C.text,marginBottom:2}}>{a.l}</p><p style={{fontSize:13,color:C.textLight}}>{a.op}</p></div>
            <Ico d={I.chev} size={16} stroke={C.textLight} sw={2}/>
          </button>
        ))}
      </div>
    </div>
  );

  if(faza==="alat"){
    const kor=[{l:"Udahni...",d:4,c:C.primary},{l:"Zadrži...",d:7,c:C.purple},{l:"Izdahni...",d:8,c:C.green}];
    if(alat==="dis"){const cur=kor[dk%3];return(
      <div style={{minHeight:"100vh",padding:"40px 24px 48px",background:C.bg,textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",gap:24}} className="fi">
        <h3 className="serif" style={{fontSize:26,letterSpacing:-0.3}}>4 · 7 · 8 Disanje</h3>
        <div style={{width:176,height:176,borderRadius:"50%",background:cur.c+"18",border:`3px solid ${cur.c}`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",transition:"all .8s"}}>
          <span style={{fontSize:40}}>{dk%3===0?"🫁":dk%3===1?"🤐":"💨"}</span>
          <span style={{fontWeight:600,color:cur.c,marginTop:8,fontSize:14}}>{cur.l}</span>
          <span style={{fontSize:28,fontWeight:400,color:cur.c,fontFamily:"'Instrument Serif',serif"}}>{cur.d}s</span>
        </div>
        <div style={{display:"flex",gap:8}}>{kor.map((_,i)=><div key={i} style={{width:8,height:8,borderRadius:"50%",background:i===dk%3?C.primary:C.border,transition:"all .3s"}}/>)}</div>
        <button className="btn-p" onClick={()=>setDk(v=>v+1)} style={{width:"auto",padding:"14px 40px"}}>Sledeće →</button>
        {dk>=3&&<button className="btn-o" style={{width:"auto"}} onClick={()=>setFaza("ish")}>Osećam se bolje</button>}
      </div>
    );}
    if(alat==="taj") return(
      <div style={{minHeight:"100vh",padding:"40px 24px 48px",background:C.bg,textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",gap:22}} className="fi">
        <h3 className="serif" style={{fontSize:26,letterSpacing:-0.3}}>Čekaj malo</h3>
        <p style={{color:C.textMid,fontSize:15,maxWidth:260,fontWeight:500}}>Impulsi prolaze. Samo 5 minuta.</p>
        <div style={{width:176,height:176,borderRadius:"50%",background:tajmer>0?C.primaryLight:C.greenLight,border:`3px solid ${tajmer>0?C.primary:C.green}`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
          <span style={{fontSize:42,fontWeight:400,color:tajmer>0?C.primary:C.green,fontFamily:"'Instrument Serif',serif"}}>{fmt(tajmer)}</span>
          <span style={{fontSize:12,color:C.textMid,marginTop:4,fontWeight:600}}>{tajmer>0?"preostalo":"Gotovo! 🎉"}</span>
        </div>
        {!tAkt&&<button className="btn-p" onClick={()=>setTAkt(true)} style={{width:"auto",padding:"14px 44px"}}>Pokreni</button>}
        {tAkt&&<button className="btn-o" style={{width:"auto"}} onClick={()=>setFaza("ish")}>Prošlo je →</button>}
      </div>
    );
    if(alat==="ruke") return(
      <div style={{minHeight:"100vh",padding:"32px 24px 48px",background:C.bg}} className="fi">
        <h3 className="serif" style={{fontSize:26,marginBottom:20,letterSpacing:-0.3}}>Zaposli ruke</h3>
        {["🧴 Nanesite kremu za ruke","🧊 Držite kocku leda","🤲 Pritisnite nokte u dlan","🖊️ Klikćite hemijsku","🎯 Kuckajte prstima o sto","💆 Masirajte sopstvene ruke"].map(a=><div key={a} className="card" style={{marginBottom:10,fontSize:14,fontWeight:500}}>{a}</div>)}
        <div style={{height:16}}/><button className="btn-p" onClick={()=>setFaza("ish")}>Probala sam →</button>
      </div>
    );
    if(alat==="uzem") return(
      <div style={{minHeight:"100vh",padding:"32px 24px 48px",background:C.bg}} className="fi">
        <h3 className="serif" style={{fontSize:26,marginBottom:6,letterSpacing:-0.3}}>5-4-3-2-1 Uzemljenje</h3>
        <p style={{color:C.textMid,fontSize:14,marginBottom:22,fontWeight:500}}>Primeti šta je oko tebe, upravo sada.</p>
        {[["👀","5","stvari koje VIDIŠ"],["🤚","4","stvari koje DODIRUJEŠ"],["👂","3","zvuka koje ČUJEŠ"],["👃","2","mirisa koje OSEĆAŠ"],["👅","1","ukus koji OSETIŠ"]].map(([e,n,l])=>(
          <div key={l} className="card" style={{marginBottom:10,display:"flex",alignItems:"center",gap:14}}>
            <span style={{fontSize:26}}>{e}</span>
            <div><span style={{fontWeight:400,color:C.primary,fontSize:22,fontFamily:"'Instrument Serif',serif"}}>{n} </span><span style={{fontSize:13,color:C.textMid,fontWeight:500}}>{l}</span></div>
          </div>
        ))}
        <div style={{height:16}}/><button className="btn-p" onClick={()=>setFaza("ish")}>Završila sam →</button>
      </div>
    );
    if(alat==="meh") return(<div style={{minHeight:"100vh",padding:"28px 24px 48px",background:C.bg}} className="fi"><h3 className="serif" style={{fontSize:24,marginBottom:20,textAlign:"center"}}>Prsni mehuriće! 🫧</h3><Mehurici onDone={()=>setFaza("ish")}/></div>);
    if(alat==="boj") return(<div style={{minHeight:"100vh",padding:"28px 24px 48px",background:C.bg}} className="fi"><h3 className="serif" style={{fontSize:24,marginBottom:20,textAlign:"center"}}>Igra boja 🎨</h3><Boje onDone={()=>setFaza("ish")}/></div>);
  }

  return(
    <div style={{minHeight:"100vh",padding:"40px 24px 48px",background:C.bg,display:"flex",flexDirection:"column",alignItems:"center",gap:16}} className="fi">
      <div style={{fontSize:56,marginBottom:4}}>💛</div>
      <h2 className="serif" style={{fontSize:30,letterSpacing:-0.3}}>Kako je prošlo?</h2>
      <p style={{color:C.textMid,fontSize:14,fontWeight:500}}>Nema pogrešnog odgovora.</p>
      <div style={{display:"flex",flexDirection:"column",gap:10,width:"100%"}}>
        {[["✅","Odolela sam impulsu",C.green,C.greenLight],["💛","Pokušala sam, ali teško",C.amber,C.amberLight],["❌","Imala sam epizodu",C.red,"#FAEAEA"]].map(([e,l,c,bg])=>(
          <button key={l} onClick={()=>setIshod(l)} style={{width:"100%",padding:"18px 20px",borderRadius:18,border:`2px solid ${ishod===l?c:C.border}`,background:ishod===l?bg:C.bgCard,cursor:"pointer",fontSize:15,fontWeight:ishod===l?700:500,display:"flex",alignItems:"center",gap:14,transition:"all .16s",boxShadow:ishod===l?`0 4px 16px ${c}25`:`0 2px 8px ${C.shadow}`}}>
            <span style={{fontSize:24}}>{e}</span>{l}
          </button>
        ))}
      </div>
      {ishod&&<><p style={{fontSize:13,color:C.textLight,fontWeight:500,textAlign:"center"}}>{ishod.includes("✅")?"Neverovatno! Ta snaga je tvoja. 🌸":ishod.includes("💛")?"Pokušaj je napredak. Budi blaga. 💛":"U redu je. Potražila si pomoć — to je važno. 🩹"}</p><button className="btn-p" style={{width:"auto",padding:"14px 44px"}} onClick={onZatvori}>Sačuvaj i zatvori</button></>}
    </div>
  );
}

function NoviUnos({onSacuvaj,onOtkazi}){
  const [k,setK]=useState(1);const [u,setU]=useState({int:5,ok:"",lok:"",epre:"",epost:"",ish:"",bel:"",slike:[]});const N=5;
  const Hdr=({title})=>(
    <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:24}}>
      <button className="btn-g" onClick={k>1?()=>setK(v=>v-1):onOtkazi} style={{padding:0}}><Ico d={I.back} size={20} stroke={C.textMid}/></button>
      <div style={{flex:1}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><span style={{fontSize:14,fontWeight:700}}>{title}</span><span style={{fontSize:12,color:C.textLight,fontWeight:600}}>{k}/{N}</span></div>
        <div className="pb"><div className="pf" style={{width:`${(k/N)*100}%`}}/></div>
      </div>
    </div>
  );
  return(
    <div style={{padding:"56px 24px 40px",minHeight:"100vh"}} className="fi">
      {k===1&&<><Hdr title="Novi unos"/>
        <h3 className="serif" style={{fontSize:26,marginBottom:20,letterSpacing:-0.3}}>Šta se desilo?</h3>
        <span className="lbl">INTENZITET</span>
        <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:24}}>
          <input type="range" min={1} max={10} value={u.int} onChange={e=>setU(v=>({...v,int:+e.target.value}))} style={{flex:1,accentColor:C.primary}}/>
          <span style={{fontSize:30,fontWeight:400,color:C.primary,minWidth:32,fontFamily:"'Instrument Serif',serif"}}>{u.int}</span>
        </div>
        <span className="lbl">OKIDAČ</span>
        <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:20}}>
          {OKI.map(o=><button key={o} className={`chip${u.ok===o?" on":""}`} onClick={()=>setU(v=>({...v,ok:o}))} style={{padding:"8px 14px"}}>{o}</button>)}
        </div>
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
        {[["res","✅ Odolela sam impulsu"],["try","💛 Pokušala sam, ali nije išlo"],["ep","❌ Imala sam epizodu"]].map(([v,l])=><button key={v} className={`cr${u.ish===v?" on":""}`} onClick={()=>setU(x=>({...x,ish:v}))}>{l}</button>)}
        <div style={{height:18}}/><button className="btn-p" onClick={()=>setK(4)} disabled={!u.ish} style={{opacity:u.ish?1:0.4}}>Nastavi →</button>
      </>}
      {k===4&&<><Hdr title="Fotografija"/>
        <h3 className="serif" style={{fontSize:26,marginBottom:6,letterSpacing:-0.3}}>Dodaj fotografiju</h3>
        <p style={{fontSize:14,color:C.textMid,marginBottom:20,fontWeight:500}}>Opciono — ostaje privatno</p>
        <label style={{display:"block",border:`2px dashed ${C.border}`,borderRadius:22,padding:"30px 20px",textAlign:"center",cursor:"pointer",background:C.bgMuted,marginBottom:14}}>
          <input type="file" accept="image/*" multiple style={{display:"none"}} onChange={e=>{Promise.all(Array.from(e.target.files).map(f=>new Promise(res=>{const r=new FileReader();r.onload=ev=>res(ev.target.result);r.readAsDataURL(f)}))).then(urls=>setU(v=>({...v,slike:[...v.slike,...urls]})))}}/>
          <div style={{fontSize:36,marginBottom:10}}>📷</div>
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
          {[["Intenzitet",`${u.int}/10`],["Okidač",u.ok||"—"],["Lokacija",u.lok||"—"],["Pre",u.epre||"—"],["Posle",u.epost||"—"]].map(([kk,vv])=>(
            <div key={kk} style={{display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:7}}><span style={{color:C.textLight,fontWeight:600}}>{kk}</span><span style={{fontWeight:700,color:C.textMid}}>{vv}</span></div>
          ))}
        </div>
        <button className="btn-p" onClick={()=>onSacuvaj({...u,id:Date.now(),datum:"Upravo"})}>Sačuvaj unos 🌸</button>
      </>}
    </div>
  );
}

const SYS=`Ti si Mia, topla AI drugarica unutar aplikacije Unpick za podršku osobama sa dermatilomanijom. Slušaš bez osude, pružaš podršku, predlažeš tehnike kada je prikladno. Uvek govori u ženskom rodu. Koristi srpski. Budi sažeta — do 3-4 rečenice. Ne zamenjuješ stručnu pomoć.`;

function AIChat(){
  const [poruke,setPoruke]=useState([{id:0,ko:"ai",tekst:"Zdravo! Ja sam Mia 🌸 Tu sam da razgovaramo — o teškim trenucima, napretku, ili jednostavno kada ti treba neko da te sasluša. Kako ti je danas?"}]);
  const [unos,setUnos]=useState("");const [ucitava,setUcitava]=useState(false);const krajRef=useRef(null);
  useEffect(()=>{krajRef.current?.scrollIntoView({behavior:"smooth"})},[poruke,ucitava]);
  async function posalji(){
    const txt=unos.trim();if(!txt||ucitava)return;
    const np=[...poruke,{id:Date.now(),ko:"user",tekst:txt}];
    setPoruke(np);setUnos("");setUcitava(true);
    try{
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,system:SYS,messages:np.map(p=>({role:p.ko==="user"?"user":"assistant",content:p.tekst}))})});
      const data=await res.json();
      setPoruke(v=>[...v,{id:Date.now()+1,ko:"ai",tekst:data.content?.find(b=>b.type==="text")?.text||"Žao mi je, pokušaj ponovo."}]);
    }catch{setPoruke(v=>[...v,{id:Date.now()+1,ko:"ai",tekst:"Nešto nije pošlo po planu."}]);}
    finally{setUcitava(false);}
  }
  return(
    <div style={{display:"flex",flexDirection:"column",height:"100%",flex:1,minHeight:0}}>
      <div style={{padding:"52px 20px 14px",background:"rgba(255,255,255,.96)",borderBottom:`1px solid ${C.border}`,flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",gap:14}}>
          <div style={{width:46,height:46,borderRadius:"50%",background:`linear-gradient(135deg,${C.primaryLight},${C.purpleLight})`,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 4px 14px rgba(168,81,106,.2)`}}>
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
              <div className="bba">{p.tekst}</div>
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
        {["Teško mi je večeras 😔","Imala sam epizodu","Trebam tehniku smirenja","Napredovala sam danas 🌱"].map(t=>(
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

function Pocetna({ime,niz,onSOS,ras,onRas,onNoviUnos,onLogout}){
  const dani=["P","U","S","Č","P","S","N"],stat=["z","z","z","ž","c","z",null];
  return(
    <div style={{paddingBottom:24}}>
      <div style={{padding:"60px 24px 24px",background:"linear-gradient(160deg,#F0D8E8 0%,#EAE0F8 55%,"+C.bg+" 100%)"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
          <p style={{fontSize:13,color:C.textMid,fontWeight:600}}>Dobro jutro,</p>
          <button onClick={onLogout} style={{background:"none",border:"none",fontSize:12,color:C.textLight,fontWeight:600,cursor:"pointer",fontFamily:"'Plus Jakarta Sans',sans-serif",padding:"4px 8px"}}>Odjavi se</button>
        </div>
        <h1 className="serif italic" style={{fontSize:38,lineHeight:1.1,letterSpacing:-0.5,marginBottom:22}}>{ime} 🌸</h1>
        <div style={{background:"rgba(255,255,255,.72)",backdropFilter:"blur(12px)",borderRadius:24,padding:"18px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",border:"1px solid rgba(255,255,255,.9)",boxShadow:"0 4px 24px rgba(160,80,120,.1)"}}>
          <div><span className="lbl">TRENUTNI NIZ</span>
            <div style={{display:"flex",alignItems:"baseline",gap:8}}>
              <span style={{fontSize:50,fontWeight:400,color:C.primary,fontFamily:"'Instrument Serif',serif",lineHeight:1}}>{niz}</span>
              <span style={{fontSize:16,color:C.textMid,fontWeight:600}}>dana</span>
            </div>
          </div>
          <div style={{textAlign:"right"}}><div style={{fontSize:44}}>🔥</div><p style={{fontSize:11,color:C.textMid,fontWeight:700,marginTop:4}}>Nastavi!</p></div>
        </div>
      </div>
      <div style={{padding:"16px 20px 0"}}>
        <div className="card fi" style={{marginBottom:14}}>
          <span className="lbl">OVA NEDELJA</span>
          <div style={{display:"flex",gap:4,justifyContent:"space-between"}}>
            {dani.map((d,i)=>(
              <div key={i} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:5}}>
                <div style={{width:38,height:38,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",background:stat[i]==="z"?C.greenLight:stat[i]==="ž"?C.amberLight:stat[i]==="c"?"#FAE8E8":C.bgMuted,boxShadow:stat[i]==="z"?"0 2px 8px rgba(78,158,122,.2)":stat[i]==="c"?"0 2px 8px rgba(184,85,85,.15)":"none"}}>
                  {stat[i]==="z"&&<Ico d={I.check} size={16} stroke={C.green} sw={2.5}/>}
                  {stat[i]==="ž"&&<span style={{fontSize:14,color:C.amber,fontWeight:700}}>~</span>}
                  {stat[i]==="c"&&<span style={{fontSize:14,color:C.red}}>·</span>}
                </div>
                <span style={{fontSize:10,color:C.textLight,fontWeight:700}}>{d}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card fi" style={{marginBottom:14}}>
          <span className="lbl">KAKO SE OSEĆAŠ DANAS?</span>
          <div style={{display:"flex",gap:6}}>
            {RAS.map((r,i)=>(
              <button key={i} className={`emb${ras===i?" on":""}`} onClick={()=>onRas(i)}>
                <div style={{fontSize:24,marginBottom:5}}>{r}</div>
                <div style={{fontSize:10,color:ras===i?C.primary:C.textLight,fontWeight:700}}>{RAS_N[i]}</div>
              </button>
            ))}
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14}}>
          <button onClick={onSOS} style={{height:130,borderRadius:24,background:C.primaryGrad,border:"none",color:"#fff",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:10,position:"relative",overflow:"hidden",boxShadow:"0 8px 32px rgba(168,81,106,.45)"}}>
            <div style={{position:"absolute",top:-24,right:-24,width:90,height:90,borderRadius:"50%",background:"rgba(255,255,255,.12)"}}/>
            <div style={{width:50,height:50,borderRadius:"50%",background:"rgba(255,255,255,.2)",display:"flex",alignItems:"center",justifyContent:"center"}}>
              <Ico d={I.heart} size={26} stroke="#fff" sw={2}/>
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
        <div className="card fi" style={{background:`linear-gradient(135deg,${C.purpleLight},#F5E8F8)`,boxShadow:"none"}}>
          <div style={{display:"flex",gap:14,alignItems:"flex-start"}}>
            <div style={{width:40,height:40,borderRadius:14,background:"rgba(126,107,168,.18)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <Ico d={I.spark} size={18} stroke={C.purple} sw={1.5}/>
            </div>
            <div><span className="lbl" style={{color:C.purple}}>PORUKA DANA</span><p style={{fontSize:14,color:C.textMid,lineHeight:1.75,fontWeight:500}}>Svaki trenutak u kom odabereš drugačije jeste trenutak ozdravljenja. 🌱</p></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Dnevnik({noviUnosi,onDodaj}){
  const [svi,setSvi]=useState([
    {id:1,datum:"Danas, 14:32",int:7,ok:"Stres",ish:"res",epre:"Anksiozna",epost:"Mirna",lok:"💼 Posao",bel:"Bila sam na roku, izašla sam da se prošetam.",slike:[]},
    {id:2,datum:"Juče, 21:10",int:5,ok:"Ekrani",ish:"try",epre:"Utrnula",epost:"Neutralna",lok:"🛋️ Dnevna",bel:"",slike:[]},
    {id:3,datum:"Pon, 09:45",int:4,ok:"Umor",ish:"res",epre:"Umorna",epost:"Dobro",lok:"🛏️ Spavaća",bel:"Jutarnja rutina pomogla.",slike:[]},
  ]);
  const [otvoren,setOtvoren]=useState(null);
  useEffect(()=>{if(noviUnosi.length)setSvi(v=>[noviUnosi[noviUnosi.length-1],...v])},[noviUnosi.length]);
  const bc=o=>o==="res"?C.green:o==="try"?C.amber:C.red;
  const bl=o=>o==="res"?"Odolela":o==="try"?"Pokušala":"Epizoda";
  return(
    <div style={{paddingBottom:20}} className="fi">
      <div style={{padding:"60px 24px 20px",background:`linear-gradient(160deg,#F5EBF0 0%,${C.bg} 70%)`}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end"}}>
          <div><h1 className="serif" style={{fontSize:32,letterSpacing:-0.5}}>Dnevnik</h1><p style={{fontSize:13,color:C.textLight,fontWeight:600,marginTop:2}}>{svi.length} unosa</p></div>
          <button onClick={onDodaj} style={{width:48,height:48,borderRadius:"50%",background:C.primaryGrad,border:"none",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",boxShadow:"0 4px 18px rgba(168,81,106,.4)"}}>
            <Ico d={I.plus} size={22} stroke="#fff" sw={2.5}/>
          </button>
        </div>
      </div>
      <div style={{padding:"0 20px"}}>
        {svi.map(u=>(
          <div key={u.id} className="card fi" style={{marginBottom:12,cursor:"pointer"}} onClick={()=>setOtvoren(otvoren===u.id?null:u.id)}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
              <span style={{fontSize:12,color:C.textLight,fontWeight:600}}>{u.datum}</span>
              <span className="tag" style={{background:bc(u.ish)+"20",color:bc(u.ish)}}>{bl(u.ish)}</span>
            </div>
            <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
              <span className="tag" style={{background:C.primaryLight,color:C.primaryDark}}>🎯 {u.ok}</span>
              <span className="tag" style={{background:C.bgMuted,color:C.textMid}}>⚡ {u.int}/10</span>
              {u.lok&&<span className="tag" style={{background:C.bgMuted,color:C.textMid}}>{u.lok}</span>}
            </div>
            {otvoren===u.id&&(
              <div className="fi" style={{borderTop:`1px solid ${C.border}`,marginTop:14,paddingTop:14}}>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:u.bel?12:0}}>
                  {u.epre&&<div style={{background:C.bgMuted,borderRadius:14,padding:"12px 14px"}}><span className="lbl" style={{marginBottom:4}}>PRE</span><p style={{fontSize:15,fontWeight:700,color:C.text}}>{u.epre}</p></div>}
                  {u.epost&&<div style={{background:C.bgMuted,borderRadius:14,padding:"12px 14px"}}><span className="lbl" style={{marginBottom:4}}>POSLE</span><p style={{fontSize:15,fontWeight:700,color:C.text}}>{u.epost}</p></div>}
                </div>
                {u.bel&&<p style={{fontSize:13,color:C.textMid,lineHeight:1.7,fontWeight:500}}>{u.bel}</p>}
                {u.slike?.length>0&&<div style={{display:"flex",gap:8,marginTop:12,flexWrap:"wrap"}}>{u.slike.map((s,i)=><img key={i} src={s} alt="" style={{width:76,height:76,borderRadius:14,objectFit:"cover"}}/>)}</div>}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function Napredak(){
  const mes=["Jan","Feb","Mar","Apr","Maj"],pod=[18,14,11,7,4];
  const ok=[{l:"Stres",p:38,c:C.primary},{l:"Ekrani",p:22,c:C.purple},{l:"Umor",p:20,c:C.amber},{l:"Dosada",p:12,c:C.green},{l:"Ostalo",p:8,c:C.textLight}];
  return(
    <div style={{paddingBottom:24}} className="fi">
      <div style={{padding:"60px 24px 24px",background:`linear-gradient(160deg,${C.purpleLight} 0%,${C.bg} 70%)`}}>
        <h1 className="serif" style={{fontSize:32,letterSpacing:-0.5,marginBottom:4}}>Napredak</h1>
        <p style={{fontSize:13,color:C.textMid,fontWeight:600}}>Pogledaj koliko si napredovala 🌱</p>
      </div>
      <div style={{padding:"0 20px"}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14}}>
          {[["🔥","12","Trenutni niz"],["🏆","21","Rekordni niz"],["✅","68%","SOS uspešnost"],["📓","24","Ukupno unosa"]].map(([e,v,l])=>(
            <div key={l} className="card" style={{padding:"18px 16px"}}>
              <div style={{fontSize:24,marginBottom:8}}>{e}</div>
              <div style={{fontSize:32,fontWeight:400,color:C.primary,marginBottom:3,fontFamily:"'Instrument Serif',serif",lineHeight:1}}>{v}</div>
              <div style={{fontSize:10,color:C.textLight,fontWeight:700,letterSpacing:0.8,textTransform:"uppercase"}}>{l}</div>
            </div>
          ))}
        </div>
        <div className="card" style={{marginBottom:14}}>
          <span className="lbl">EPIZODE PO MESECU</span>
          <div style={{display:"flex",alignItems:"flex-end",gap:10,height:100}}>
            {pod.map((v,i)=>(
              <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:6}}>
                <span style={{fontSize:12,color:C.textMid,fontWeight:700}}>{v}</span>
                <div style={{width:"100%",height:`${(v/20)*80}px`,background:i===pod.length-1?C.green:C.primary+(i===pod.length-2?"CC":"66"),borderRadius:"10px 10px 0 0",minHeight:6}}/>
                <span style={{fontSize:11,color:C.textLight,fontWeight:700}}>{mes[i]}</span>
              </div>
            ))}
          </div>
          <div style={{height:1,background:C.border,margin:"14px 0 10px"}}/>
          <p style={{fontSize:13,color:C.green,fontWeight:700,textAlign:"center"}}>↓ 78% manje epizoda od januara</p>
        </div>
        <div className="card">
          <span className="lbl">NAJČEŠĆI OKIDAČI</span>
          {ok.map(o=>(
            <div key={o.l} style={{marginBottom:14}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><span style={{fontSize:14,color:C.textMid,fontWeight:600}}>{o.l}</span><span style={{fontSize:14,fontWeight:700,color:o.c}}>{o.p}%</span></div>
              <div className="pb" style={{height:7}}><div className="pf" style={{width:`${o.p}%`,background:o.c}}/></div>
            </div>
          ))}
        </div>
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
      <div style={{padding:"60px 24px 24px",background:`linear-gradient(160deg,#EDE8F8 0%,${C.bg} 70%)`}}>
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
  const [priSOS,setPriSOS]=useState(false);const [priUnos,setPriUnos]=useState(false);
  const [ras,setRas]=useState(null);const [noviUnosi,setNoviUnosi]=useState([]);

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
    setKor({ime,id:session.user.id});
    setFaza("app");
    loadJournalEntries(session.user.id);
  }

  async function loadJournalEntries(userId){
    const {data}=await supabase.from("journal_entries").select("*").eq("user_id",userId).order("created_at",{ascending:false});
    if(data) setNoviUnosi(data.map(e=>({id:e.id,datum:new Date(e.created_at).toLocaleString("sr"),int:e.intensity,ok:e.trigger,lok:e.location,epre:e.emotion_before,epost:e.emotion_after,ish:e.outcome,bel:e.note,slike:e.images||[]})));
  }

  async function handleSacuvajUnos(u){
    const {data:{session}}=await supabase.auth.getSession();
    if(session){
      const {data}=await supabase.from("journal_entries").insert({
        user_id:session.user.id,intensity:u.int,trigger:u.ok,location:u.lok,
        emotion_before:u.epre,emotion_after:u.epost,outcome:u.ish,note:u.bel,images:u.slike
      }).select().single();
      if(data) setNoviUnosi(v=>[{id:data.id,datum:"Upravo",int:u.int,ok:u.ok,lok:u.lok,epre:u.epre,epost:u.epost,ish:u.ish,bel:u.bel,slike:u.slike},...v]);
    }else{
      setNoviUnosi(v=>[{...u,id:Date.now(),datum:"Upravo"},...v]);
    }
    setPriUnos(false);setEkran("dnv");
  }

  async function handleLogout(){
    await supabase.auth.signOut();
  }

  if(faza==="loading") return(
    <><style>{fonts}{css}</style>
    <div className="app" style={{display:"flex",alignItems:"center",justifyContent:"center",minHeight:"100vh"}}>
      <div style={{textAlign:"center"}}>
        <div style={{width:52,height:52,borderRadius:16,background:C.primaryGrad,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px",boxShadow:"0 8px 28px rgba(168,81,106,.4)"}}>
          <Ico d={I.heart} size={26} stroke="#fff" sw={2}/>
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
          <div style={{minHeight:"100vh",background:C.bg,overflowY:"auto"}} className="fi"><NoviUnos onSacuvaj={handleSacuvajUnos} onOtkazi={()=>setPriUnos(false)}/></div>
        ):(
          <>
            <div style={{paddingBottom:ekran==="chat"?0:76,overflowY:ekran==="chat"?"hidden":"auto",height:ekran==="chat"?"calc(100vh - 72px)":"auto",display:ekran==="chat"?"flex":"block",flexDirection:"column"}}>
              {ekran==="poc"&&<Pocetna ime={kor?.ime||"Ana"} niz={12} onSOS={()=>setPriSOS(true)} ras={ras} onRas={setRas} onNoviUnos={()=>setPriUnos(true)} onLogout={handleLogout}/>}
              {ekran==="dnv"&&<Dnevnik noviUnosi={noviUnosi} onDodaj={()=>setPriUnos(true)}/>}
              {ekran==="nap"&&<Napredak/>}
              {ekran==="bib"&&<Biblioteka/>}
              {ekran==="chat"&&<AIChat/>}
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
