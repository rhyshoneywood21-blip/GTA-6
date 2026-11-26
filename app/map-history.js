/* Compatibility only: retain old local map-found records in backups. No map UI. */
(function(){
"use strict";
const ids=new Set(window.LEONIDA_MAP.rows.map(r=>r[0])),key="leonida-map-progress-v1";
let records={p1:{},p2:{}};
function clean(x){if(!x||!["p1","p2"].every(p=>x[p]&&typeof x[p]==="object"&&!Array.isArray(x[p])))return null;const n={p1:{},p2:{}};for(const p of ["p1","p2"])for(const [id,v] of Object.entries(x[p]))if(ids.has(id)&&v===true)n[p][id]=true;return n;}
try{records=clean(JSON.parse(localStorage.getItem(key)||"null"))||records;}catch(e){}
window.LeonidaMapProgress={export:()=>JSON.parse(JSON.stringify(records)),restore:x=>{const n=clean(x);if(!n)return false;records=n;try{localStorage.setItem(key,JSON.stringify(records));}catch(e){}return true;}};
})();
