const words={3:["IBU","AYU","API","BOL","TAS","JAM"],4:["BUKU","BOLA","MEJA","SAPI","KAKI","MATA","ROTI","BAJU","TOPI"],5:["MOBIL","RUMAH","BUAH","KURSI","PAPAN","BOTOL"],6:["SEPATU","KELAPA","KAMERA"]};
let len=4,last=-1,speaking=false;
const $=id=>document.getElementById(id),word=$("word"),reading=$("reading"),hint=$("hint");
function pool(){return(words[len]||words[4]).filter(w=>w.length===len)}
function next(){let p=pool(),i;do{i=Math.floor(Math.random()*p.length)}while(p.length>1&&i===last);last=i;word.textContent=p[i];reading.textContent=""}
function voiceID(){return speechSynthesis.getVoices().find(v=>/^id(-|_)/i.test(v.lang))||speechSynthesis.getVoices().find(v=>/indonesia/i.test(v.name))}
function say(text,rate=.68){return new Promise(resolve=>{const u=new SpeechSynthesisUtterance(text);u.lang="id-ID";const v=voiceID();if(v)u.voice=v;u.rate=rate;u.pitch=1;u.onend=resolve;u.onerror=resolve;speechSynthesis.speak(u)})}
const letterSound={A:"a",B:"bé",C:"cé",D:"dé",E:"é",F:"éf",G:"gé",H:"ha",I:"i",J:"jé",K:"ka",L:"él",M:"ém",N:"én",O:"o",P:"pé",Q:"ki",R:"ér",S:"és",T:"té",U:"u",V:"vé",W:"wé",X:"éks",Y:"yé",Z:"zét"};\nconst syllableSpeech={TO:"toh",BO:"boh",RO:"roh",DO:"doh",KO:"koh",LO:"loh",MO:"moh",NO:"noh",PO:"poh",SO:"soh",GO:"goh",JO:"joh",HO:"hoh"};
function syllables(w){const map={BUKU:["BU","KU"],TOPI:["TO","PI"],BOLA:["BO","LA"],MEJA:["ME","JA"],SAPI:["SA","PI"],KAKI:["KA","KI"],MATA:["MA","TA"],ROTI:["RO","TI"],BAJU:["BA","JU"]};return map[w]||[w.slice(0,Math.ceil(w.length/2)),w.slice(Math.ceil(w.length/2))]}
function sequence(w){const syl=syllables(w),out=[];for(const s of syl){for(const c of s)out.push({show:c,speak:letterSound[c]||c,letter:true});out.push({show:s,speak:syllableSpeech[s]||s,letter:false})}out.push({show:w,speak:w,letter:false});return out}
async function read(){if(speaking)return;speaking=true;speechSynthesis.cancel();for(const x of sequence(word.textContent)){reading.textContent=x.show;await say(x.speak,x.letter?.55:.62);await new Promise(r=>setTimeout(r,180))}setTimeout(()=>reading.textContent="",650);speaking=false}
$("next").onclick=next;$("speak").onclick=read;$("settings").onclick=()=>$("sheet").classList.add("show");$("close").onclick=()=>$("sheet").classList.remove("show");
$("length").onchange=e=>{len=+e.target.value;hint.textContent=len+" huruf";last=-1;next();$("sheet").classList.remove("show")};
speechSynthesis.getVoices();