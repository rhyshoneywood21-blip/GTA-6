import {writeFile,readFile,mkdir} from "node:fs/promises";
const base="https://gta6gang.com/data/";
const kinds=["vehicles","weapons","animals","stores"];
const target=new URL("../data/catalog-snapshot.json",import.meta.url);
let snapshot={};try{snapshot=JSON.parse(await readFile(target,"utf8"));}catch(e){if(e.code!=="ENOENT")throw e;}
const report={source:"https://gta6gang.com/pages/gta6-open-data.html",license:"CC BY 4.0",checked:new Date().toISOString(),tables:{}};
for(const kind of kinds){
 try{
  const res=await fetch(base+kind+".json",{signal:AbortSignal.timeout(20000)});
  if(!res.ok)throw Error("HTTP "+res.status);
  const raw=await res.text();if(raw.length>5e6)throw Error("Oversized data");
  const j=JSON.parse(raw);if(!Array.isArray(j.columns)||!Array.isArray(j.rows)||!j.rows.length)throw Error("Unexpected data schema");
  const cols=j.columns.map(c=>typeof c==="string"?c:c?.name);if(!cols.includes("id")||!cols.some(c=>c==="name"||c==="title"))throw Error("Missing id/name");
  const seen=new Set();for(const raw of j.rows){const x=Array.isArray(raw)?Object.fromEntries(cols.map((c,i)=>[c,raw[i]])):raw;const id=String(x?.id||"");if(!id||seen.has(id)||typeof(x.name||x.title)!=="string")throw Error("Missing or duplicate named id");seen.add(id);}
  snapshot[kind]=j;report.tables[kind]={status:"downloaded",rows:j.rows.length,generated:j.generated||null};
 }catch(e){report.tables[kind]={status:snapshot[kind]?"retained previous snapshot":"unavailable",error:e.message,rows:snapshot[kind]?.rows?.length||0};}
}
await mkdir(new URL("../data/",import.meta.url),{recursive:true});await writeFile(target,JSON.stringify(snapshot));await writeFile(new URL("../data/catalog-import-report.json",import.meta.url),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
