import {readFile,writeFile,mkdir} from "node:fs/promises";
import assert from "node:assert/strict";
const root=new URL("../",import.meta.url),read=p=>readFile(new URL(p,root),"utf8");
const m=JSON.parse(await read("preparation/guide-manifest.json")),v=JSON.parse(await read("preparation/vehicle-cards-data.json"));
const docs={};
for(const path of m.paths){
 let md=await read(path);
 if(path==="guides/reference-library.md"){
  md=md.split("\n").filter(l=>!/^\| (Story mission walkthroughs|All 91 story missions)|^- 91 story missions/.test(l)).join("\n");
  md=md.replace("# Quick lookup library — maps, missions, codes and rewards","# Quick lookup library — maps, codes and rewards");
 }
 assert(md.startsWith("# "),path+" missing title");docs[path]=md;
}
for(const list of Object.values(m.pages))for(const id of list)assert(docs[(id.includes("/")?id:"guides/"+id)+".md"],"missing "+id);
assert.equal(Object.keys(docs).length,36);assert(!docs["guides/weapons-master.md"]);assert.equal(v.rows.length,560);assert.equal(new Set(v.rows.map(r=>r.slug)).size,560);
const js=o=>JSON.stringify(o).replace(/</g,"\\u003c");
const out=new URL("app/",root);await mkdir(out,{recursive:true});
await writeFile(new URL("guide-data-final.js",out),"window.LEONIDA_GUIDES="+js(docs)+";\nwindow.LEONIDA_GUIDE_PAGES="+js(m.pages)+";\n");
await writeFile(new URL("vehicle-data-final.js",out),"window.LEONIDA_VEHICLES="+js(v)+";\n");
console.log("Prepared "+Object.keys(docs).length+" guides and "+v.rows.length+" vehicles.");
