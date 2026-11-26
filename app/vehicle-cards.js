/* Canonical, source-linked vehicle cards. No generated or guessed game facts. */
(function(){
"use strict";
const host=document.getElementById("vehicle-cards"),dataset=window.LEONIDA_VEHICLES;
if(!host||!dataset||!Array.isArray(dataset.rows))return;
const rows=dataset.rows,bySlug=new Map(rows.map(v=>[v.slug,v]));
const norm=x=>String(x??"").normalize("NFKD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[’‘]/g,"'").trim();
const el=(tag,t,cls)=>{const n=document.createElement(tag);if(t!=null)n.textContent=t;if(cls)n.className=cls;return n;};
const btn=(t,f)=>{const n=el("button",t);n.type="button";n.onclick=f;return n;};
const https=u=>typeof u==="string"&&/^https:\/\//i.test(u);
const link=(t,u)=>{const a=el("a",t);if(https(u))a.href=u;return a;};
const unique=a=>[...new Set(a.filter(Boolean))];
const names=new Map();for(const v of rows)for(const n of unique([v.name,...v.aliases])){const k=norm(n);if(!names.has(k))names.set(k,new Set());names.get(k).add(v.slug);}
function belongs(v,n){return n===v.slug||(names.get(norm(n))?.size===1&&names.get(norm(n)).has(v.slug));}
function has(v,k){return (extras[player][k]||[]).some(n=>belongs(v,n));}
function toggle(v,k){const a=extras[player][k]||[];extras[player][k]=has(v,k)?a.filter(n=>!belongs(v,n)):[...a,v.name];storeExtra();drawCars();}
const q=el("input");q.type="search";q.placeholder="Search by vehicle, class or location";q.setAttribute("aria-label","Search vehicle cards");q.style.width="100%";
const filter=el("select");filter.setAttribute("aria-label","Filter vehicle cards");for(const [label,value] of [["All vehicles",""],["Base / non-Standout","base"],["Standout variants","standout"],["Location leads","location"],["Randy targets","randy"],["Photo references","photo"],["Favorites","favorites"],["Owned vehicles","owned"],["Known seats","seats"],["Known storage","cargo"]])filter.add(new Option(label,value));
const category=el("select");category.setAttribute("aria-label","Vehicle category");category.add(new Option("All classes",""));for(const c of unique(rows.map(v=>v.class)).sort())category.add(new Option(c,c));
const sort=el("select");sort.setAttribute("aria-label","Sort vehicle cards");for(const [label,value] of [["Name A–Z","name"],["Speed rating","speed"],["Acceleration","acceleration"],["Seats","seats"],["Storage","cargo"]])sort.add(new Option(label,value));
const count=el("p"),details=el("div"),list=el("div");count.setAttribute("aria-live","polite");details.hidden=true;let limit=30,activeSlug=null;
const locations=v=>[...v.pins.map(p=>p.area),...v.randy.map(p=>p.lead),...v.spawn.flatMap(p=>Array.isArray(p.v)?p.v:[p.v])].filter(Boolean);
const hay=v=>norm([v.name,v.class,v.type,v.manufacturer,...v.aliases,...locations(v)].join(" "));
function lookup(terms,n=12){const a=terms.map(norm);return rows.filter(v=>a.every(t=>hay(v).includes(t))).sort((x,y)=>Number(norm(y.name).includes(a.join(" ")))-Number(norm(x.name).includes(a.join(" ")))||x.name.localeCompare(y.name)).slice(0,n);}
function field(label,value){if(value==null||value===""||(Array.isArray(value)&&!value.length))return null;const f=el("div",null,"vehicle-field");f.append(el("small",label),el("strong",Array.isArray(value)?value.join(" / "):String(value)));return f;}
function fields(parent,pairs){const f=el("div",null,"vehicle-facts");for(const [k,v] of pairs){const n=field(k,v);if(n)f.append(n);}if(f.childElementCount)parent.append(f);}
const money=x=>Number.isFinite(x)?"$"+x.toLocaleString():null;
const ratings=[["speed","Speed / 10"],["acceleration","Acceleration / 10"],["handling","Road handling / 10"],["offroad","Off-road / 10"],["strength","Strength / 10"]];
const sourceById=new Map((dataset.meta.timesaverSources||[]).map(s=>[s.id,s]));
function citeReports(parent,ids){for(const id of unique(ids||[])){const s=sourceById.get(id);if(s&&https(s.url))parent.append(el("small"," "),link(s.outlet||id,s.url));}}
function photo(parent,v){if(!v.photos.length){parent.append(el("p","No linked screenshot yet."),link("Open original vehicle profile",v.reference));return;}const preview=el("div");const im=el("img",null,"vehicle-photo");im.alt=v.name+" — source screenshot";im.loading="lazy";im.referrerPolicy="no-referrer";let started=false;const load=btn("Show photo (online)",()=>{if(started){preview.hidden=!preview.hidden;return;}started=true;im.onerror=()=>preview.replaceChildren(el("p","Photo unavailable offline or from the original provider."));preview.append(im);im.src=v.photos[0];});parent.append(load,preview,link("Original photo",v.photos[0]));}
function detail(v,scroll=true){activeSlug=v.slug;details.hidden=false;details.replaceChildren();const head=el("div",null,"vehicle-hero");head.append(el("small",v.variant?"STANDOUT VARIANT":"VEHICLE PROFILE"),el("h2",v.name),el("p",v.class||v.type));details.append(head);photo(details,v);if(v.summary)details.append(el("p",v.summary));
fields(details,[["Seats",v.seats],["Cargo slots",v.cargo],["Drivetrain",v.drivetrain],["Registration",money(v.registration)],["Reported sale",money(v.sale)],["Tracker",v.tracker],["Access",v.access],["Edition",v.edition],["Reported top speed",Number.isFinite(v.topSpeedMph)?v.topSpeedMph+" mph":null]]);
if(Object.keys(v.stats).length){details.append(el("h3","Reported performance ratings"));fields(details,ratings.map(([k,t])=>[t,v.stats[k]]));}
if(v.seatReports.length>1)details.append(el("p","Conflicting seats: "+v.seatReports.join(" / ")+". Check your own WAiNK scan."));
if(Object.keys(v.conflicts).length){const c=el("details");c.append(el("summary","Conflicting source reports"),el("p",JSON.stringify(v.conflicts)));details.append(c);}
details.append(btn(has(v,"favorites")?"★ Favorited":"☆ Favorite",()=>{toggle(v,"favorites");draw();detail(v,false);}),btn(has(v,"owned")?"✓ Owned":"Mark as owned",()=>{toggle(v,"owned");draw();detail(v,false);}),btn("Record sighting",()=>{document.getElementById("carname").value=v.name;document.getElementById("spawnform").scrollIntoView({block:"start"});}));
if(v.acquisition.length){details.append(el("h3","How to obtain"));for(const r of v.acquisition){const p=el("p",r.v);citeReports(p,r.src);details.append(p);}}
if(v.spawn.length||v.randy.length){details.append(el("h3","Location leads"));for(const r of v.spawn){const p=el("p",Array.isArray(r.v)?r.v.join(" • "):r.v);citeReports(p,r.src);details.append(p);}for(const r of v.randy){const p=el("p",[r.group,r.lead].filter(Boolean).join(" · "));if(https(r.source))p.append(el("small"," "),link("Source",r.source));details.append(p);}}
details.append(el("h3",v.pins.length+" mapped records"));for(const p of v.pins){const c=el("div",null,"carcard");c.append(el("p",[p.area,p.type,p.confidence].filter(Boolean).join(" · ")),btn("Show map pin",()=>window.LeonidaMap.openId(p.id)));if(https(p.source))c.append(link("Original pin",p.source));if(p.classificationReview)c.append(el("p","Classification needs review."));details.append(c);}
if(!v.pins.length)details.append(btn("Search map by vehicle name",()=>window.LeonidaMap.open(v.name,"vehicle")));
const refs=el("details",null,"vehicle-source-list");refs.append(el("summary","Sources and photo references"),link("Original GTA Town profile",v.reference));for(const u of unique([...v.sources,...v.photos]))if(https(u))refs.append(el("p"),link(u,u));for(const r of v.timesaverMatch||[])if(r.notes)refs.append(el("p",r.match+": "+r.notes));details.append(refs,el("p","Reported information; not independently console-verified. Missing data is not guessed. Some location leads may be mission-only or random."),btn("Close profile",()=>{details.hidden=true;activeSlug=null;count.scrollIntoView({block:"nearest"});}));if(scroll)details.scrollIntoView({block:"start"});}
function draw(){const t=norm(q.value).split(/\s+/).filter(Boolean),k=filter.value;let items=rows.filter(v=>{if(category.value&&v.class!==category.value||!t.every(x=>hay(v).includes(x)))return false;switch(k){case"base":return !v.variant;case"standout":return v.variant;case"location":return locations(v).length>0||v.pins.length>0;case"randy":return v.randy.length>0;case"photo":return v.photos.length>0;case"favorites":return has(v,"favorites");case"owned":return has(v,"owned");case"seats":return Number.isFinite(v.seats);case"cargo":return Number.isFinite(v.cargo);default:return true;}});
const score=v=>v.stats[sort.value]??v[sort.value]??-1;items.sort((a,b)=>sort.value==="name"?a.name.localeCompare(b.name):score(b)-score(a)||a.name.localeCompare(b.name));count.textContent=items.length+" matching vehicles · "+rows.length+" source-reported profiles";list.replaceChildren();
for(const v of items.slice(0,limit)){const c=el("article",null,"carcard vehicle-card");c.append(el("small",v.class||v.type),el("h3",v.name));const meta=el("div",null,"vehicle-meta");if(v.variant)meta.append(el("small","Standout"));if(has(v,"favorites"))meta.append(el("small","★ Favorite"));if(has(v,"owned"))meta.append(el("small","Owned"));if(Number.isFinite(v.stats.speed))meta.append(el("small","Speed "+v.stats.speed+"/10"));if(locations(v).length||v.pins.length)meta.append(el("small","Location lead"));if(v.photos.length)meta.append(el("small","Photo"));c.append(meta,btn("Open vehicle card",()=>detail(v)));list.append(c);}
if(!items.length)list.append(el("p","No vehicles match. Try another name or clear filters."));if(items.length>limit)list.append(btn("Show 30 more",()=>{limit+=30;draw();}));}
function reset(){limit=30;details.hidden=true;activeSlug=null;draw();}
q.oninput=filter.onchange=category.onchange=sort.onchange=reset;
host.append(el("h2","Vehicle database"),el("p","560 individual profiles, including 281 Standout variants. Seats and storage shown only when known. Photos and original maps require internet."),q,filter,category,sort,count,details,list,el("p",dataset.meta.attribution.join(" · ")),link("Data licence",dataset.meta.license));
window.LeonidaVehicleCards={refresh:()=>{const v=bySlug.get(activeSlug);draw();if(v&&!details.hidden)detail(v,false);},size:()=>rows.length,lookup,open:slug=>{const v=bySlug.get(slug);if(v){go("vehicles");q.value="";filter.value="";category.value="";draw();detail(v);}}};draw();
})();
