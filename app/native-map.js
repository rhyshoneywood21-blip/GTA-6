/* Native map UI. Coordinates and source tiles use Open GTA 6 Map CRS.Simple. */
(function(){
"use strict";
const data=window.LEONIDA_MAP;if(!data||!Array.isArray(data.rows))return;
const byId=new Map(data.rows.map(r=>[r[0],r])),cats=new Map(data.categories.map(c=>[c.key,c]));
const text=(tag,t)=>{const n=document.createElement(tag);if(t!=null)n.textContent=t;return n};
const b=(t,f)=>{const n=text("button",t);n.type="button";n.onclick=f;return n};
const a=(t,url)=>{const n=text("a",t);n.href=url;n.target="_blank";n.rel="noopener noreferrer";return n};
const $=id=>document.getElementById(id);
const source="https://fbritoferreira.github.io/gta6/";
const key="leonida-map-progress-v1";let records={p1:{},p2:{}};
try{const j=JSON.parse(localStorage.getItem(key)||"null");if(j&&j.p1&&j.p2)for(const p of ["p1","p2"])for(const [id,v] of Object.entries(j[p]))if(byId.has(id)&&v===true)records[p][id]=true;}catch(e){}
const current=()=>typeof player!=="undefined"&&player==="p2"?"p2":"p1";
const found=id=>records[current()][id]===true;
function save(){try{localStorage.setItem(key,JSON.stringify(records));}catch(e){status.textContent="Storage unavailable; export your progress before closing.";}}
function restore(x){if(!x||!["p1","p2"].every(p=>x[p]&&typeof x[p]==="object"&&!Array.isArray(x[p])))return false;const n={p1:{},p2:{}};for(const p of ["p1","p2"])for(const [id,v] of Object.entries(x[p]))if(byId.has(id)&&v===true)n[p][id]=true;records=n;save();refresh();return true;}
window.LeonidaMapProgress={export:()=>JSON.parse(JSON.stringify(records)),restore};
const host=$("native-map");if(!host)return;
const status=text("p"),summary=text("p"),results=text("div"),detail=text("div");const query=text("input");query.type="search";query.placeholder="Search any location, car, safe or activity";query.setAttribute("aria-label","Search map locations");query.style.width="100%";
const cat=text("select");cat.setAttribute("aria-label","Map category");cat.add(new Option("All categories",""));const totals={};for(const r of data.rows)totals[r[2]]=(totals[r[2]]||0)+1;for(const [k,c] of [...cats].sort((a,b)=>a[1].name.localeCompare(b[1].name)))if(totals[k])cat.add(new Option(c.name+" ("+totals[k]+")",k));for(const k of Object.keys(totals))if(!cats.has(k))cat.add(new Option(k+" ("+totals[k]+")",k));
const hide=text("input");hide.type="checkbox";const hideLabel=text("label");hideLabel.append(hide,document.createTextNode(" Hide completed"));hideLabel.style.display="block";
const types=text("select");types.setAttribute("aria-label","Vehicle marker type");types.add(new Option("All vehicle markers",""));for(const t of [...new Set(data.rows.filter(r=>r[2]==="vehicle").map(r=>r[6]))].sort())types.add(new Option(t||"Unspecified",t));types.hidden=true;
const confidence=text("select");confidence.setAttribute("aria-label","Source confidence");for(const [n,v] of [["All evidence levels",""],["Community-labelled","community"],["Unverified / missing","unverified"]])confidence.add(new Option(n,v));
const canvas=text("canvas");canvas.style.cssText="width:100%;height:440px;max-height:65vh;background:#101526;border:1px solid #514560;border-radius:12px;touch-action:none;display:block";canvas.tabIndex=0;canvas.setAttribute("aria-label","Interactive map. Use zoom buttons or keyboard arrows. Exact source links are also listed below.");
const ctx=canvas.getContext("2d");const controls=text("div");controls.className="line";controls.style.margin="8px 0";let cx=405,cy=495,scale=1,w=1,h=1,matching=[],selected=null,limit=40,drag=null,frame=0,ready=false;
const cache=new Map();
function fit(){const rect=canvas.getBoundingClientRect();if(rect.width<2||rect.height<2)return;const dpr=Math.min(devicePixelRatio||1,2);w=rect.width;h=rect.height;canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);if(!ready){scale=Math.max(.4,Math.min(w/440,h/600));ready=true;}draw();}
function tile(z,x,y){const k=z+"/"+y+"/"+x;if(cache.has(k))return cache.get(k);const im=new Image();const rec={im,ok:false};cache.set(k,rec);im.onload=()=>{rec.ok=true;draw();};im.onerror=()=>{rec.ok=false;};im.src=source+"tiles/night/"+z+"/"+z+","+y+","+x+".webp";if(cache.size>200){const first=cache.keys().next().value;if(first!==k)cache.delete(first);}return rec;}
const screen=(x,y)=>[(x-cx)*scale+w/2,(y-cy)*scale+h/2];
function draw(){if(!ctx||frame)return;frame=requestAnimationFrame(()=>{frame=0;if(!ready||!canvas.isConnected)return;ctx.clearRect(0,0,w,h);ctx.fillStyle="#101526";ctx.fillRect(0,0,w,h);
const z=Math.max(0,Math.min(5,Math.floor(Math.log2(Math.max(1,scale))))),unit=256/2**z,edge=4*2**z;
const left=cx-w/(2*scale),right=cx+w/(2*scale),top=cy-h/(2*scale),bottom=cy+h/(2*scale);let rendered=0;
for(let y=Math.max(0,Math.floor(top/unit));y<=Math.min(edge-1,Math.floor(bottom/unit));y++)for(let x=Math.max(0,Math.floor(left/unit));x<=Math.min(edge-1,Math.floor(right/unit));x++){const t=tile(z,x,y);if(t.ok){const [sx,sy]=screen(x*unit,y*unit);ctx.drawImage(t.im,sx,sy,unit*scale+.5,unit*scale+.5);rendered++;}}
if(!rendered){ctx.fillStyle="#b9bbd4";ctx.font="12px system-ui";ctx.fillText("Basemap loading or offline — source-coordinate pins below",10,19);}
for(const r of matching){const [x,y]=screen(r[3],r[4]);if(x<0||y<0||x>w||y>h)continue;ctx.beginPath();ctx.arc(x,y,r[0]===selected?7:scale>4?4:2.3,0,Math.PI*2);ctx.fillStyle=found(r[0])?"#8fe9b2":cats.get(r[2])?.colour||"#f4a8dd";ctx.fill();if(r[0]===selected){ctx.strokeStyle="#fff";ctx.lineWidth=2;ctx.stroke();}}
ctx.fillStyle="#100f1d";ctx.fillRect(0,h-20,w,20);ctx.fillStyle="#d6d0e7";ctx.font="10px system-ui";ctx.fillText("Open GTA 6 Map · CC BY 4.0 · community data",7,h-6);
});}
function zoom(factor){scale=Math.min(24,Math.max(.35,scale*factor));draw();}
controls.append(b("−",()=>zoom(1/1.5)),b("+",()=>zoom(1.5)),b("Reset",()=>{cx=405;cy=495;ready=false;fit();}),b("Open source map",()=>window.open(source,"_blank","noopener,noreferrer")));
function point(r){selected=r[0];cx=r[3];cy=r[4];scale=Math.max(scale,5);detail.replaceChildren(text("h3",r[1]),text("p",(cats.get(r[2])?.name||r[2])+" · "+(r[6]||"Location")+" · "+(r[5]||"Area not supplied")),text("small","Evidence: "+r[7]+". Provider report, not independently checked."));if(r[8])detail.append(text("p",r[8]));detail.append(a("Open precise source pin",source+"?id="+encodeURIComponent(r[0])),document.createTextNode(" "),b(found(r[0])?"Mark not found":"Mark found",()=>{if(found(r[0]))delete records[current()][r[0]];else records[current()][r[0]]=true;save();refresh();point(r);}));for(const u of r[10]||[])if(/^https:\/\//i.test(u))detail.append(text("br"),a("Original evidence",u));draw();}
canvas.addEventListener("pointerdown",e=>{canvas.setPointerCapture(e.pointerId);drag={x:e.clientX,y:e.clientY,cx,cy,moved:false};});canvas.addEventListener("pointermove",e=>{if(!drag)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;if(Math.hypot(dx,dy)>5)drag.moved=true;if(drag.moved){cx=drag.cx-dx/scale;cy=drag.cy-dy/scale;draw();}});canvas.addEventListener("pointercancel",()=>drag=null);canvas.addEventListener("pointerup",e=>{if(!drag)return;const moved=drag.moved;drag=null;if(moved)return;const rect=canvas.getBoundingClientRect(),x=e.clientX-rect.left,y=e.clientY-rect.top;let nearest=null,dist=18;for(const r of matching){const [sx,sy]=screen(r[3],r[4]),d=Math.hypot(x-sx,y-sy);if(d<dist){dist=d;nearest=r;}}if(nearest)point(nearest);});
canvas.addEventListener("wheel",e=>{e.preventDefault();zoom(e.deltaY<0?1.2:1/1.2);},{passive:false});
canvas.addEventListener("keydown",e=>{const d=40/scale;if(e.key==="ArrowLeft")cx-=d;else if(e.key==="ArrowRight")cx+=d;else if(e.key==="ArrowUp")cy-=d;else if(e.key==="ArrowDown")cy+=d;else if(e.key==="+")zoom(1.5);else if(e.key==="-")zoom(1/1.5);else return;e.preventDefault();draw();});
function matches(r){if(cat.value&&r[2]!==cat.value)return false;if(cat.value==="vehicle"&&types.value&&r[6]!==types.value)return false;if(confidence.value&&r[7]!==confidence.value)return false;if(hide.checked&&found(r[0]))return false;const hay=[r[1],r[5],r[6],r[8],cats.get(r[2])?.name||""].join(" ").toLowerCase();return query.value.trim().toLowerCase().split(/\s+/).every(t=>hay.includes(t));}
function refresh(){types.hidden=cat.value!=="vehicle";matching=data.rows.filter(matches);summary.textContent=matching.length.toLocaleString()+" matches · "+Object.keys(records[current()]).length+" found by "+(current()==="p1"?"Player 1":"Player 2");results.replaceChildren();for(const r of matching.slice(0,limit)){const row=text("div");row.className="carcard";const button=b(r[1],()=>{point(r);detail.scrollIntoView({block:"nearest"});});button.style.textAlign="left";row.append(button,text("p",(r[6]||cats.get(r[2])?.name||r[2])+" · "+(r[5]||"Area unknown")+" · "+r[7]+(found(r[0])?" · Found":"")));results.append(row);}if(matching.length>limit)results.append(b("Show 40 more",()=>{limit+=40;refresh();}));draw();}
function changed(){limit=40;refresh();}
query.oninput=changed;cat.onchange=changed;types.onchange=changed;confidence.onchange=changed;hide.onchange=changed;
host.append(text("h2","Integrated location map"),text("p",data.rows.length.toLocaleString()+" imported map records. Includes reported and unverified locations; not a guarantee of a fixed spawn. Map imagery is loaded from its original provider."),query,cat,types,confidence,hide,summary,controls,canvas,detail,status,results,text("p",data.attribution),a("Source repository",data.source),document.createTextNode(" · "),a("CC BY 4.0",data.license));
if(typeof ResizeObserver!=="undefined")new ResizeObserver(fit).observe(canvas);window.addEventListener("resize",fit);
window.LeonidaMap={refresh:()=>{refresh();fit();},open:(term,kind)=>{go("map");query.value=term||"";cat.value=kind||"";types.value="";hide.checked=false;confidence.value="";changed();fit();host.scrollIntoView({block:"start"});},lookup:(terms,n=20)=>data.rows.filter(r=>terms.every(t=>[r[1],r[5],r[6],r[8]].join(" ").toLowerCase().includes(t))).slice(0,n),openId:id=>{const r=byId.get(id);if(r){go("map");query.value="";cat.value=r[2];types.value="";confidence.value="";hide.checked=false;changed();fit();point(r);host.scrollIntoView({block:"start"});}}};
refresh();
})();
