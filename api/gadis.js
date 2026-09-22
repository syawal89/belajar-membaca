import { EdgeTTS } from "edge-tts-universal";

export default async function handler(req,res){
  if(req.method!=="POST") return res.status(405).json({error:"Method not allowed"});
  const text=String(req.body?.text||"").trim();
  if(!text||text.length>120) return res.status(400).json({error:"Invalid text"});
  try{
    const tts=new EdgeTTS(text,"id-ID-GadisNeural",{
      rate:"-18%",
      pitch:"+0Hz",
      volume:"+0%"
    });
    const result=await tts.synthesize();
    const buf=Buffer.from(await result.audio.arrayBuffer());
    res.setHeader("Content-Type","audio/mpeg");
    res.setHeader("Cache-Control","no-store");
    return res.status(200).send(buf);
  }catch(e){
    return res.status(502).json({error:"Gadis TTS failed",detail:String(e?.message||e).slice(0,400)});
  }
}