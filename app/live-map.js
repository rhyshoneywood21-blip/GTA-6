/* Original Open GTA 6 Map as primary map, via documented embed URL. */
(function(){
"use strict";
const host=document.getElementById("primary-map"),offline=document.getElementById("native-map"),local=window.LeonidaMap;
if(!host||!offline||!local)return;
window.LeonidaLocalMap=local;
const base="https://fbritoferreira.github.io/gta6/",rows=window.LEONIDA_MAP.rows,byId=new Map(rows.map(r=>[r[0],r]));
const el=(tag,t,cls)=>{const n=document.createElement(tag);if(t!=null)n.textContent=t;if(cls)n.className=cls;return n;};
const button=(t,f)=>{const n=el("button",t);n.type="button";n.onclick=f;return n;};
const modes={all:["All locations",""],vehicles:["Vehicles","vehicle"],money:["Money","bank,gang,store,smash,fence,towatm,payday,safe,treasure"],collectibles:["Collectibles","card,flamingo,package,meteorite,bottle,bookswap,mural,streetart,waink,underwater,kenton,magazine,playlist"],weapons:["Free weapons","weapon"],safes:["Safes","safe"]};
let mode="all",view="live",frame=null,activeURL="",pins=[];
const title=el("h2","Explore Leonida"),toolbar=el("div",null,"map-toolbar"),modesRow=el("div",null,"map-modes"),picker=el("div",null,"map-pin-picker"),wrap=el("div",null,"map-frame-wrap"),help=el("p","Tap Filters in the map to search, choose categories or hide found locations. Tap a marker for its information and screenshot when available.","map-help"),links=el("div",null,"map-links"),credit=el("p",null,"map-credit");
const attribution=el("a","Open GTA 6 Map");attribution.href="https://github.com/fbritoferreira/gta6";const licence=el("a","CC BY 4.0");licence.href="https://creativecommons.org/licenses/by/4.0/";credit.append(attribution,document.createTextNode(" · fbritoferreira and contributors · "),licence);
const openBrowser=el("a","Open map in browser");openBrowser.href=base;
const status=el("span","Live map progress is separate from companion checklists and backups.");
const expand=button("Full screen",()=>{const on=document.body.classList.toggle("map-expanded");expand.textContent=on?"Exit full screen":"Full screen";});
const reload=button("Reload map",()=>{if(frame)frame.src=activeURL;});
const fallback=button("Saved locations",()=>{if(view==="live"){showOffline();local.open("","");}else showLive(mode);});
toolbar.append(title,expand);links.append(fallback,reload,openBrowser,status);host.append(toolbar,modesRow,picker,wrap,credit,help,links);
const buttons=new Map();for(const [id,[label]] of Object.entries(modes)){const n=button(label,()=>showLive(id));n.setAttribute("aria-pressed","false");buttons.set(id,n);modesRow.append(n);}
function setView(next){view=next;const live=next==="live";wrap.hidden=!live;offline.hidden=live;expand.hidden=!live;reload.hidden=!live;help.hidden=!live;picker.hidden=!live||!pins.length;fallback.textContent=live?"Saved locations":"Back to live map";title.textContent=live?(mode==="all"?"Explore Leonida":modes[mode][0]+" map"):"Saved locations";if(!live)document.body.classList.remove("map-expanded");for(const [id,b] of buttons)b.setAttribute("aria-pressed",String(live&&id===mode));}
function showLive(next="all",pin=null,keepPins=false){
 mode=modes[next]?next:"all";if(!keepPins){pins=[];picker.replaceChildren();}
 const url=new URL(base);url.searchParams.set("embed","1");url.searchParams.set("style","night");if(modes[mode][1])url.searchParams.set("kinds",modes[mode][1]);if(pin)url.searchParams.set("id",pin);
 const src=url.href;setView("live");if(!frame){frame=el("iframe");frame.id="live-map-frame";frame.title="Open GTA 6 interactive map";frame.referrerPolicy="no-referrer";frame.allowFullscreen=true;wrap.append(frame);}
 if(activeURL!==src){activeURL=src;frame.src=src;}const external=new URL(src);external.searchParams.delete("embed");openBrowser.href=external.href;
}
function showOffline(){setView("offline");}
function navigate(){go("map");document.getElementById("map").scrollIntoView({block:"start"});}
function openVehicle(v){navigate();const valid=(v.pins||[]).filter(p=>byId.has(p.id));if(!valid.length){showOffline();local.open(v.name,"vehicle");return;}pins=valid;picker.replaceChildren(el("small",v.name+" · "+valid.length+" linked map records"));for(let i=0;i<valid.length;i++){const p=valid[i],n=button(p.area||"Location "+(i+1),()=>showLive("vehicles",p.id,true));picker.append(n);}showLive("vehicles",valid[0].id,true);}
window.LeonidaMap={lookup:local.lookup,refresh:()=>{if(!frame&&view==="live")showLive(mode);else if(view==="offline")local.refresh();},mode:id=>{navigate();showLive(id);},open:(term,kind)=>{navigate();if(term){showOffline();local.open(term,kind);return;}showLive(kind==="vehicle"?"vehicles":kind==="weapon"?"weapons":kind==="safe"?"safes":kind==="bank"?"money":"all");},openId:id=>{const r=byId.get(id);if(!r)return;navigate();showLive(r[2]==="vehicle"?"vehicles":"all",id);},openVehicle,offline:()=>{navigate();showOffline();local.refresh();}};
document.querySelectorAll("[data-map-mode]").forEach(b=>b.onclick=()=>window.LeonidaMap.mode(b.dataset.mapMode));
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&document.body.classList.contains("map-expanded")){document.body.classList.remove("map-expanded");expand.textContent="Full screen";}});
setView("live");
})();
