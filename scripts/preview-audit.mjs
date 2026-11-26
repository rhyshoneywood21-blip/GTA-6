import {chromium} from "playwright";
import {mkdir,writeFile} from "node:fs/promises";
import assert from "node:assert/strict";
const url=process.env.PREVIEW_URL||"https://rhyshoneywood21-blip.github.io/GTA-6/";
const out="preview-audit";
await mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:1});
const report={url,screens:[],guides:[],checklists:[],vehicles:[],topics:[],issues:[],errors:[]};
page.on("pageerror",e=>report.errors.push(e.message));
const slug=s=>s.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,90);
async function capture(name,selector="main"){
 await page.evaluate(()=>window.scrollTo(0,0));
 await page.waitForTimeout(120);
 const metrics=await page.locator(selector).evaluate(el=>{
  const text=el.innerText;const visible=n=>n.getBoundingClientRect().width>0&&n.getBoundingClientRect().height>0&&getComputedStyle(n).visibility!=="hidden";
  const paragraphs=[...el.querySelectorAll("p,li")].filter(visible).map(n=>n.innerText).filter(t=>t.length>230);
  const buttons=[...el.querySelectorAll("button")].filter(visible).map(n=>n.innerText.trim());
  const duplicates=[...new Set(buttons.filter((s,i)=>s&&buttons.indexOf(s)!==i))];
  return {text,words:text.trim().split(/\s+/).length,height:document.documentElement.scrollHeight,overflow:document.documentElement.scrollWidth>innerWidth+2,paragraphs,duplicates,internalLines:text.split("\n").filter(t=>/\.\.\/|\b(?:data|research)\/[\w.-]+\.(?:json|csv|md)|\b(?:source reconciliation|research pass|not transcribed|not independently console-verified|no local test|do not promise|not a comprehensive|not verified here)\b/i.test(t))};
 });
 await page.screenshot({path:out+"/"+name+".png",animations:"disabled",fullPage:metrics.height<=10000});
 if(metrics.height>10000){for(const [i,y] of [metrics.height/3,metrics.height*2/3,metrics.height-844].entries()){await page.evaluate(y=>window.scrollTo(0,y),y);await page.screenshot({path:out+"/"+name+"-part-"+(i+2)+".png",animations:"disabled"});}}
 await writeFile(out+"/"+name+".txt",metrics.text);
 const {text,...rest}=metrics;return {name,...rest};
}
async function attempt(kind,name,fn){try{report[kind].push(await fn());}catch(e){report.issues.push({kind,name,error:String(e)});}}
try{
 await page.goto(url+"?audit="+Date.now(),{waitUntil:"domcontentloaded",timeout:60000});
 await page.waitForFunction(()=>typeof go==="function"&&window.LEONIDA_VEHICLES?.rows?.length===560,{timeout:60000});
 const pages=await page.evaluate(()=>Object.keys(PAGE_NAMES));
 const guidePages=await page.evaluate(()=>window.LEONIDA_GUIDE_PAGES);
 report.data=await page.evaluate(()=>({profiles:LEONIDA_VEHICLES.rows.length,guides:Object.keys(LEONIDA_GUIDES).length,mapRecords:LEONIDA_MAP.rows.length,quickCards:Object.values(ULTIMATE_TASKS).reduce((n,x)=>n+x.cards.length,0)}));
 for(const name of pages)await attempt("screens",name,async()=>{
  await page.evaluate(p=>go(p),name);
  if(name==="map"){await page.frameLocator("#live-map-frame").locator(".leaflet-tile-loaded").first().waitFor({timeout:60000});}
  return capture("screen-"+name);
 });
 const visited=new Set();
 for(const [pageName,ids] of Object.entries(guidePages)){
  if(pageName==="map")continue;
  for(const id of ids){if(visited.has(id))continue;visited.add(id);await attempt("guides",id,async()=>{
   await page.evaluate(({id,pageName})=>{go(pageName);openGuide(id,pageName);},{id,pageName});
   await page.locator(".guide-reader").waitFor({state:"visible",timeout:5000});
   const result=await capture("guide-"+slug(id),".guide-reader");result.actionSteps=await page.locator(".playbook-steps li").count();result.topicCount=await page.locator(".topic-button").count();result.referenceClosed=await page.locator(".playbook-reference").evaluate(e=>!e.open);assert(result.actionSteps>=3,"Missing action steps "+id);assert(result.referenceClosed,"Reference opened by default "+id);
   const buttons=await page.locator(".topic-button").all();for(let i=0;i<buttons.length;i++){const label=await buttons[i].innerText();await buttons[i].click();const detail=page.locator(".topic-detail");for(const extra of await detail.locator(".topic-activity").all())await extra.evaluate(el=>el.open=true);const metric=await capture("topic-"+slug(id)+"-"+(i+1),".topic-detail");metric.guide=id;metric.topic=label;metric.entries=await detail.locator(".topic-entry").count();report.topics.push(metric);assert(!metric.internalLines.length,"Internal wording in topic "+id+" "+label);assert(!metric.overflow,"Topic overflow "+id+" "+label);}
   return result;
  });}
 }
 await page.evaluate(()=>go("progress"));
 const tabs=await page.locator("#tabs button").allTextContents();
 for(let i=0;i<tabs.length;i++)await attempt("checklists",tabs[i],async()=>{await page.evaluate(i=>{go("progress");document.querySelectorAll("#tabs button")[i].click();},i);return capture("checklist-"+slug(tabs[i]),"#progress");});
 const samples=await page.evaluate(()=>{const rows=LEONIDA_VEHICLES.rows;return [...new Set([rows.find(v=>v.photos.length&&v.pins.length)?.slug,rows.find(v=>!v.photos.length&&!v.pins.length)?.slug,rows.find(v=>v.variant&&v.photos.length)?.slug,rows.find(v=>v.randy.length)?.slug,rows.find(v=>v.name.includes("Banshee"))?.slug].filter(Boolean))];});
 for(const id of samples)await attempt("vehicles",id,async()=>{await page.evaluate(id=>LeonidaVehicleCards.open(id),id);await page.locator("#vehicle-detail").waitFor({state:"visible"});await page.locator("#vehicle-detail img").first().evaluate(im=>{im.loading="eager";}).catch(()=>{});await page.waitForTimeout(500);return capture("vehicle-"+slug(id),"#vehicle-detail");});
 for(const width of [320,430]){await page.setViewportSize({width,height:844});for(const name of pages){await page.evaluate(n=>go(n),name);if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2))report.issues.push({kind:"overflow",name,width});}}
 report.summary={screens:report.screens.length,guides:report.guides.length,checklists:report.checklists.length,vehicleSamples:report.vehicles.length,deepTopics:report.topics.length,internalWordingFlags:[...report.screens,...report.guides,...report.topics].reduce((n,r)=>n+r.internalLines.length,0)};
 assert.equal(report.screens.length,pages.length,"Missing screen capture");assert.equal(report.guides.length,visited.size,"Missing guide capture");assert.equal(report.errors.length,0,"Browser runtime errors");
}catch(e){report.failure=String(e);throw e;}
finally{await writeFile(out+"/report.json",JSON.stringify(report,null,2));console.log(JSON.stringify({data:report.data,summary:report.summary,issues:report.issues,errors:report.errors,failure:report.failure},null,2));await browser.close();}
