/* Only interactive map: original Open GTA 6 Map. No custom map renderer. */
(function(){
"use strict";
const host=document.getElementById("primary-map");if(!host)return;
const base="https://fbritoferreira.github.io/gta6/",rows=window.LEONIDA_MAP.rows,byId=new Map(rows.map(r=>[r[0],r])),cats=new Map(window.LEONIDA_MAP.categories.map(c=>[c.key,c]));
const el=(tag,t,cls)=>{const n=document.createElement(tag);if(t!=null)n.textContent=t;if(cls)n.className=cls;return n;};
const button=(t,f)=>{const n=el("button",t);n.type="button";n.onclick=f;return n;};
const modes={all:["All locations",""],vehicles:["Vehicles","vehicle"],money:["Money","bank,gang,store,smash,fence,towatm,payday,safe,treasure"],collectibles:["Collectibles","card,flamingo,package,meteorite,bottle,bookswap,mural,streetart,waink,underwater,kenton,magazine,playlist"],weapons:["Free weapons","weapon"],safes:["Safes","safe"]};
let mode="all",frame=null,activeURL="";
const title=el("h2","Explore Leonida"),toolbar=el("div",null,"map-toolbar"),modesRow=el("div",null,"map-modes"),picker=el("div",null,"map-pin-picker"),wrap=el("div",null,"map-frame-wrap"),help=el("p","Tap Filters on the map, or tap a marker for its details. Internet required.","map-help"),links=el("div",null,"map-links"),credit=el("p",null,"map-credit");
const attribution=el("a","Open GTA 6 Map");attribution.href="https://github.com/fbritoferreira/gta6";const licence=el("a","CC BY 4.0");licence.href="https://creativecommons.org/licenses/by/4.0/";credit.append(attribution,document.createTextNode(" · fbritoferreira and contributors · "),licence);
const openBrowser=el("a","Open map in browser");openBrowser.href=base;
const status=el("span","Map found markers are managed by the original map, separately from companion progress and backups.");
const expand=button("Full screen",()=>{const on=document.body.classList.toggle("map-expanded");expand.textContent=on?"Exit full screen":"Full screen";});
const reload=button("Reload map",()=>{if(frame)frame.src=activeURL;});
toolbar.append(title,expand);links.append(reload,openBrowser,status);host.append(toolbar,modesRow,picker,wrap,credit,help,links);picker.hidden=true;
const buttons=new Map();for(const [id,[label]] of Object.entries(modes)){const n=button(label,()=>showLive(id));n.setAttribute("aria-pressed","false");buttons.set(id,n);modesRow.append(n);}
function modeFor(kind){return kind==="vehicle"?"vehicles":kind==="weapon"?"weapons":kind==="safe"?"safes":kind==="bank"?"money":"all";}
function showLive(next="all",pin=null,keepPicker=false,kind=null){
 mode=modes[next]?next:"all";if(!keepPicker){picker.replaceChildren();picker.hidden=true;}
 const url=new URL(base);url.searchParams.set("embed","1");url.searchParams.set("style","night");const kinds=kind&&cats.has(kind)?kind:modes[mode][1];if(kinds)url.searchParams.set("kinds",kinds);if(pin)url.searchParams.set("id",pin);
 title.textContent=mode==="all"?"Explore Leonida":modes[mode][0]+" map";for(const [id,b] of buttons)b.setAttribute("aria-pressed",String(id===mode));
 const src=url.href;if(!frame){frame=el("iframe");frame.id="live-map-frame";frame.title="Open GTA 6 interactive map";frame.referrerPolicy="no-referrer";frame.allowFullscreen=true;wrap.append(frame);}
 if(activeURL!==src){activeURL=src;frame.src=src;}const external=new URL(src);external.searchParams.delete("embed");openBrowser.href=external.href;
}
function navigate(){go("map");window.scrollTo(0,0);}
function lookup(terms,n=20,kind){return rows.filter(r=>(!kind||r[2]===kind)&&terms.every(t=>[r[1],r[5],r[6],r[8],cats.get(r[2])?.name||""].join(" ").toLowerCase().includes(t.toLowerCase()))).slice(0,n);}
function choose(label,matches,next,kind){picker.replaceChildren(el("small",label));picker.hidden=false;for(const r of matches){const n=button(r.label||[r[1],r[5]].filter(Boolean).join(" · "),()=>showLive(next,r.id||r[0],true,r.kind||r[2]||kind));picker.append(n);}picker.append(button("Clear locations",()=>showLive(next,null,false,kind)));}
function open(term,kind){navigate();const next=modeFor(kind);if(!term){showLive(next,null,false,kind);return;}const q=term.trim().toLowerCase().split(/\s+/).filter(Boolean),hits=lookup(q,20,kind);showLive(next,hits.length===1?hits[0][0]:null,false,kind);choose(hits.length?"Choose a matching location for "+term:"No exact saved pin for "+term+". Use the map’s Filters to search current provider data.",hits,next,kind);}
function openVehicle(v){navigate();const valid=(v.pins||[]).filter(p=>byId.has(p.id));if(!valid.length){open(v.name,"vehicle");return;}showLive("vehicles",valid[0].id);choose(v.name+" · "+valid.length+" linked map records",valid.map((p,i)=>({id:p.id,kind:"vehicle",label:(p.area||"Location "+(i+1))+(p.type?" · "+p.type:"")})),"vehicles","vehicle");}
function matches(name,kind){const norm=s=>s.toLowerCase().replace(/\s*\([^)]*\)/g,"").replace(/[^a-z0-9]/g,"");const n=norm(name);if(n.length<4)return [];const hits=rows.filter(r=>(!kind||r[2]===kind||(kind==="vehicle"&&r[6]==="Vehicle request"))&&norm(r[1])===n);const requests=hits.filter(r=>r[0].startsWith("vehicle-request-")&&/Randy/.test(r[1]));return requests.length?requests:hits.slice(0,20);}
function openMatches(name,hits){if(!hits.length){open(name,"vehicle");return;}navigate();const r=hits[0],next=modeFor(r[2]);showLive(next,hits.length===1?r[0]:null,false,r[2]);if(hits.length>1)choose("Choose a reported location for "+name,hits,next,r[2]);}
window.LeonidaMap={matches,openMatches,lookup,refresh:()=>{if(!frame)showLive(mode);if(!document.body.classList.contains("map-expanded"))expand.textContent="Full screen";},mode:id=>{navigate();showLive(id);},open,openId:id=>{const r=byId.get(id);if(!r)return;navigate();showLive(modeFor(r[2]),id,false,r[2]);},openVehicle};
document.querySelectorAll("[data-map-mode]").forEach(b=>b.onclick=()=>window.LeonidaMap.mode(b.dataset.mapMode));
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&document.body.classList.contains("map-expanded")){document.body.classList.remove("map-expanded");expand.textContent="Full screen";}});
})();
