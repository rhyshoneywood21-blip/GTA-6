import {chromium} from "playwright";
import {mkdir,writeFile} from "node:fs/promises";
import assert from "node:assert/strict";
const url=process.env.PREVIEW_URL||"https://rhyshoneywood21-blip.github.io/GTA-6/";
const out="preview-audit";
await mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:1});
const report={url,screens:[],guides:[],checklists:[],vehicles:[],topics:[],expanded:[],activities:[],allVehicleProfiles:[],issues:[],errors:[]};
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
  const result=await capture("screen-"+name);if(name!=="map"){await page.evaluate(()=>{for(const d of document.querySelectorAll("main details"))if(d.getClientRects().length)d.open=true;for(const d of document.querySelectorAll("main details details"))if(d.getClientRects().length)d.open=true;});report.expanded.push(await capture("expanded-"+name));}return result;
 });
 const visited=new Set();
 for(const [pageName,ids] of Object.entries(guidePages)){
  if(pageName==="map")continue;
  for(const id of ids){if(visited.has(id))continue;visited.add(id);await attempt("guides",id,async()=>{
   await page.evaluate(({id,pageName})=>{go(pageName);openGuide(id,pageName);},{id,pageName});
   await page.locator(".guide-reader").waitFor({state:"visible",timeout:5000});
   const result=await capture("guide-"+slug(id),".guide-reader");result.actionSteps=await page.locator(".playbook-steps li").count();result.topicCount=await page.locator(".topic-button").count();result.referenceClosed=await page.locator(".playbook-reference").evaluate(e=>!e.open);assert(result.actionSteps>=3,"Missing action steps "+id);assert(result.referenceClosed,"Reference opened by default "+id);
   const buttons=await page.locator(".topic-button").all();for(let i=0;i<buttons.length;i++){const label=await buttons[i].innerText();await buttons[i].click();const detail=page.locator(".topic-detail");await detail.evaluate(el=>{for(const more of el.querySelectorAll(".topic-more")){let count=0;while(!more.hidden&&count++<100)more.click();}});for(const extra of await detail.locator(".topic-activity").all())await extra.evaluate(el=>el.open=true);const metric=await capture("topic-"+slug(id)+"-"+(i+1),".topic-detail");metric.guide=id;metric.topic=label;metric.entries=await detail.locator(".topic-entry").count();report.topics.push(metric);assert(!metric.internalLines.length,"Internal wording in topic "+id+" "+label);assert(!metric.overflow,"Topic overflow "+id+" "+label);}
   await page.locator(".playbook-reference").evaluate(e=>e.open=true);report.expanded.push(await capture("sources-"+slug(id),".playbook-reference"));return result;
  });}
 }
 for(const [category,group] of Object.entries(await page.evaluate(()=>ULTIMATE_TASKS))){for(const card of group.cards){await attempt("activities",card[0],async()=>{await page.evaluate(({category,card})=>{go(category);openGuide(card[4],category,card[7],card);},{category,card});assert(await page.locator(".guide-reader").isVisible());return capture("activity-"+category+"-"+slug(card[0]),".guide-reader");});}}
 await page.evaluate(()=>go("progress"));
 const tabs=await page.locator("#tabs button").allTextContents();
 for(let i=0;i<tabs.length;i++)await attempt("checklists",tabs[i],async()=>{await page.evaluate(i=>{go("progress");document.querySelectorAll("#tabs button")[i].click();},i);return capture("checklist-"+slug(tabs[i]),"#progress");});
 const samples=await page.evaluate(()=>{const rows=LEONIDA_VEHICLES.rows;return [...new Set([rows.find(v=>v.photos.length&&v.pins.length)?.slug,rows.find(v=>!v.photos.length&&!v.pins.length)?.slug,rows.find(v=>v.variant&&v.photos.length)?.slug,rows.find(v=>v.randy.length)?.slug,rows.find(v=>v.name.includes("Banshee"))?.slug].filter(Boolean))];});
 for(const id of samples)await attempt("vehicles",id,async()=>{await page.evaluate(id=>LeonidaVehicleCards.open(id),id);await page.locator("#vehicle-detail").waitFor({state:"visible"});await page.locator("#vehicle-detail img").first().evaluate(im=>{im.loading="eager";}).catch(()=>{});await page.waitForTimeout(500);return capture("vehicle-"+slug(id),"#vehicle-detail");});
 // Audit each rendered vehicle profile, including expanded sources. The earlier screenshots retain actual image-loading results.
 await page.route("**/*",route=>route.request().resourceType()==="image"?route.abort():route.continue());
 report.allVehicleProfiles=await page.evaluate(()=>{const out=[];for(const v of LEONIDA_VEHICLES.rows){LeonidaVehicleCards.open(v.slug);const el=document.querySelector("#vehicle-detail");if(el.hidden||el.dataset.slug!==v.slug)throw Error("Wrong profile "+v.slug);for(const d of el.querySelectorAll("details"))d.open=true;const text=el.innerText;const paragraphs=[...el.querySelectorAll("p,li")].filter(n=>n.getClientRects().length>0&&n.innerText.length>230).map(n=>n.innerText);out.push({slug:v.slug,name:v.name,paragraphs,rawUrls:text.split("\n").filter(x=>x.startsWith("https://")||x.startsWith("http://")),overflow:document.documentElement.scrollWidth>innerWidth+2});}return out;});
 for(const width of [320,430]){await page.setViewportSize({width,height:844});for(const name of pages){await page.evaluate(n=>go(n),name);if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2))report.issues.push({kind:"overflow",name,width});}}
 report.summary={screens:report.screens.length,guides:report.guides.length,checklists:report.checklists.length,vehicleSamples:report.vehicles.length,deepTopics:report.topics.length,expandedViews:report.expanded.length,activityViews:report.activities.length,allVehicleProfiles:report.allVehicleProfiles.length,vehicleLongParagraphs:report.allVehicleProfiles.reduce((n,r)=>n+r.paragraphs.length,0),internalWordingFlags:[...report.screens,...report.guides,...report.topics,...report.expanded,...report.activities].reduce((n,r)=>n+r.internalLines.length,0)};
 assert.equal(report.screens.length,pages.length,"Missing screen capture");assert.equal(report.guides.length,visited.size,"Missing guide capture");assert.equal(report.activities.length,report.data.quickCards,"Missing activity capture");assert.equal(report.allVehicleProfiles.length,560,"Missing vehicle audit");assert.equal(report.issues.length,0,"Incomplete live audit");assert.equal(report.errors.length,0,"Browser runtime errors");
}catch(e){report.failure=String(e);throw e;}
finally{await writeFile(out+"/report.json",JSON.stringify(report,null,2));console.log(JSON.stringify({data:report.data,summary:report.summary,issues:report.issues,errors:report.errors,failure:report.failure},null,2));await browser.close();}
