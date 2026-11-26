import "./prepare-final-guides.mjs";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import vm from "node:vm";
import {createHash} from "node:crypto";
const read=p=>readFile(new URL("../"+p,import.meta.url),"utf8");
const h=await read("index.html"),ctx=vm.createContext({window:{}});
const scripts=[...h.matchAll(/<script src="([^"]+)"><\/script>/g)].map(m=>m[1]);
for(const p of scripts){const s=await read(p);new vm.Script(s,{filename:p});if(/guide-data|map-data|vehicle-data-final/.test(p))vm.runInContext(s,ctx);}
for(const m of h.matchAll(/<script>([\s\S]*?)<\/script>/g))new vm.Script(m[1]);
const ids=[...h.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(ids.length,new Set(ids).size,"duplicate HTML IDs");
const refs=[...h.matchAll(/\$\("([^"]+)"\)/g)].map(m=>m[1]);for(const id of refs)assert(ids.includes(id),"missing DOM id "+id);
const p=ctx.window.LEONIDA_GUIDE_PAGES;assert.equal(Object.keys(ctx.window.LEONIDA_GUIDES).length,36);for(const list of Object.values(p))for(const item of list){const path=(item.includes("/")?item:"guides/"+item)+".md";assert(ctx.window.LEONIDA_GUIDES[path],"missing guide "+path);}
const d=ctx.window.LEONIDA_MAP;assert.equal(d.total,d.rows.length);assert.equal(d.rows.length,6642);assert.equal(new Set(d.rows.map(r=>r[0])).size,d.rows.length);
for(const r of d.rows){assert(typeof r[0]==="string"&&r[0]&&typeof r[1]==="string"&&r[1]);assert(r.length===11);assert(Number.isFinite(r[3])&&r[3]>=0&&r[3]<=1024);assert(Number.isFinite(r[4])&&r[4]>=0&&r[4]<=1024);assert(typeof r[7]==="string"&&r[7]);assert(Array.isArray(r[10]));}
const cars=d.rows.filter(r=>r[2]==="vehicle");assert.equal(cars.length,449);assert.equal(cars.filter(r=>r[6]==="Vehicle spawn").length,10);assert.equal(cars.filter(r=>r[6]==="Vehicle request").length,16);assert.equal(cars.filter(r=>r[6]==="Standout vehicle").length,423);
const vehicles=ctx.window.LEONIDA_VEHICLES;assert.equal(vehicles.rows.length,560);assert.equal(new Set(vehicles.rows.map(r=>r.slug)).size,560);const pinIds=new Set(d.rows.map(r=>r[0]));for(const r of vehicles.rows){assert(r.name&&r.reference);for(const pin of r.pins)assert(pinIds.has(pin.id),pin.id);}
console.log(JSON.stringify({vehicles:vehicles.rows.length,guides:Object.keys(ctx.window.LEONIDA_GUIDES).length,mapRecords:d.rows.length,vehicleMarkers:cars.length,uniqueIds:true,coordinateBounds:true,scriptSyntax:true,sectionReferences:true},null,2));

// Verify the approved artwork, not merely the existence of an image.
for(const [path,sha] of [["app/brand-wordmark.webp","eef6f3c8b77e2495af4100379455cd1b3161071f"],["android/app/src/main/res/drawable-nodpi/ultimate_launcher.webp","03254f280970fccff00bfc4bf83774d9db920655"]]){
 const bytes=await readFile(new URL("../"+path,import.meta.url));
 assert.equal(createHash("sha1").update("blob "+bytes.length+"\0").update(bytes).digest("hex"),sha,"Brand artwork mismatch: "+path);
}
const manifest=await read("android/app/src/main/AndroidManifest.xml");assert(manifest.includes('android:icon="@drawable/ultimate_launcher_padded"'));assert(manifest.includes('android:roundIcon="@drawable/ultimate_launcher_padded"'));console.log("Approved wordmark and launcher artwork verified.");

assert((await read("android/app/src/main/res/drawable/ultimate_launcher_padded.xml")).includes('android:inset="12%"'));assert((await read("android/app/src/main/res/drawable-v26/ultimate_launcher_padded.xml")).includes("<adaptive-icon"));assert((await read("android/app/src/main/res/drawable/ultimate_launcher_foreground.xml")).includes('android:inset="24%"'));
