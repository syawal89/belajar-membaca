export default async function handler(req,res){
  if(req.method!=="POST") return res.status(405).json({error:"Method not allowed"});
  const text=String(req.body?.text||"").trim();
  if(!text||text.length>30) return res.status(400).json({error:"Invalid text"});
  const key=process.env.ELEVENLABS_API_KEY;
  if(!key) return res.status(500).json({error:"TTS key not configured"});
  try{
    const r=await fetch("https://api.elevenlabs.io/v1/text-to-speech/52LXmmR0nGnIcDs1TL3f?output_format=mp3_22050_32",{
      method:"POST",
      headers:{"xi-api-key":key,"Content-Type":"application/json","Accept":"audio/mpeg"},
      body:JSON.stringify({
        text,
        model_id:"eleven_multilingual_v2",
        language_code:"id",
        voice_settings:{stability:.75,similarity_boost:.85,style:.15,speed:.78}
      })
    });
    if(!r.ok){const detail=await r.text();return res.status(r.status).json({error:"ElevenLabs error",detail:detail.slice(0,300)})}
    const buf=Buffer.from(await r.arrayBuffer());
    res.setHeader("Content-Type","audio/mpeg");
    res.setHeader("Cache-Control","no-store, no-cache, must-revalidate, max-age=0");\n    res.setHeader("CDN-Cache-Control","no-store");\n    res.setHeader("Vercel-CDN-Cache-Control","no-store");
    return res.status(200).send(buf);
  }catch(e){return res.status(500).json({error:"TTS failed"})}
}