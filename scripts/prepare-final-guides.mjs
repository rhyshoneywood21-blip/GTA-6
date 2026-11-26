import {readFile,writeFile,mkdir} from "node:fs/promises";
import assert from "node:assert/strict";
const root=new URL("../",import.meta.url),read=p=>readFile(new URL(p,root),"utf8");
const m=JSON.parse(await read("preparation/guide-manifest.json"));
const docs={};
for(const path of m.paths){
  let md=await read(path);
  if(path==="guides/reference-library.md"){
    md=md.split("\n").filter(l=>!/^\| (Story mission walkthroughs|All 91 story missions)|^- 91 story missions/.test(l)).join("\n");
    md=md.replace("# Quick lookup library — maps, missions, codes and rewards","# Quick lookup library — maps, codes and rewards");
  }
  assert(md.startsWith("# "),path+" missing title");
  docs[path]=md;
}
for(const list of Object.values(m.pages))for(const id of list)assert(docs[(id.includes("/")?id:"guides/"+id)+".md"],"missing "+id);
assert(!docs["guides/weapons-master.md"]);
const out=new URL("preparation/generated/",root);await mkdir(out,{recursive:true});
await writeFile(new URL("guide-data-final.js",out),"window.LEONIDA_GUIDES="+JSON.stringify(docs).replace(/</g,"\\u003c")+";\n");
await writeFile(new URL("guide-pages.json",out),JSON.stringify(m.pages,null,2)+"\n");
console.log("Prepared "+Object.keys(docs).length+" current guides; no Android build triggered.");
