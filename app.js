const words={3:["IBU","AYU","API","BOL","TAS","JAM"],4:["BUKU","BOLA","MEJA","SAPI","KAKI","MATA","ROTI","BAJU","TOPI","KUEH"],5:["MOBIL","RUMAH","BUAH","KURSI","PAPAN","BOTOL"],6:["SEPATU","KELAPA","KAMERA","SEKOLAH"]};
let len=4,last=-1,speaking=false;
const $=id=>document.getElementById(id), word=$("word"),reading=$("reading"),hint=$("hint");
function pool(){return (words[len]||words[4]).filter(w=>w.length===len)}
function next(){let p=pool(),i;do{i=Math.floor(Math.random()*p.length)}while(p.length>1&&i===last);last=i;word.textContent=p[i];reading.textContent=""}
function say(text,rate=.72){return new Promise(resolve=>{let u=new SpeechSynthesisUtterance(text);u.lang="id-ID";u.rate=rate;u.pitch=1;u.onend=resolve;u.onerror=resolve;speechSynthesis.speak(u)})}
function chunks(w){if(w==="BUKU")return ["B","U","BU","K","U","KU","BUKU"];let mid=Math.ceil(w.length/2),a=w.slice(0,mid),b=w.slice(mid);return [...a,...(a.length>1?[a]:[]),...b,...(b.length>1?[b]:[]),w]}
async function read(){if(speaking)return;speaking=true;speechSynthesis.cancel();for(const x of chunks(word.textContent)){reading.textContent=x;await say(x,x.length===1?.58:.72);await new Promise(r=>setTimeout(r,170))}setTimeout(()=>reading.textContent="",650);speaking=false}
$("next").onclick=next;$("speak").onclick=read;
$("settings").onclick=()=>$("sheet").classList.add("show");$("close").onclick=()=>$("sheet").classList.remove("show");
$("length").onchange=e=>{len=+e.target.value;hint.textContent=len+" huruf";last=-1;next();$("sheet").classList.remove("show")};
