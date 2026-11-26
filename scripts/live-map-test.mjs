import {chromium} from "playwright";
import assert from "node:assert/strict";
import {createServer} from "node:http";
import {readFile,mkdir,writeFile} from "node:fs/promises";
import {resolve,extname} from "node:path";
const root=resolve("dist"),server=createServer(async(req,res)=>{try{const path=resolve(root,"."+decodeURIComponent(new URL(req.url,"http://localhost").pathname));if(!path.startsWith(root+"/"))throw Error("invalid path");res.setHeader("Content-Type",extname(path)===".js"?"text/javascript":extname(path)===".webp"?"image/webp":"text/html");res.end(await readFile(path));}catch{res.statusCode=404;res.end("Not found");}});
await new Promise(r=>server.listen(0,"127.0.0.1",r));await mkdir("qa-artifacts",{recursive:true});
let browser,page;const report={checks:[],status:"failed"};
try{
 browser=await chromium.launch({headless:true});page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
 await page.goto("http://127.0.0.1:"+server.address().port+"/index.html");
 await page.evaluate(()=>LeonidaMap.mode("vehicles"));
 const f=page.frameLocator("#live-map-frame");
 await f.locator("#map.leaflet-container").waitFor({state:"visible",timeout:60000});
 await f.locator(".leaflet-tile-loaded").first().waitFor({timeout:60000});
 report.checks.push("Original map and base tiles loaded inside companion");
 await page.screenshot({path:"qa-artifacts/live-vehicle-map.png"});
 const tileUrls=()=>f.locator(".leaflet-tile-loaded").evaluateAll(tiles=>tiles.map(t=>t.getAttribute("src")).sort().join("|"));
 const beforeZoom=await tileUrls();await f.locator(".leaflet-control-zoom-in").click();await page.waitForTimeout(1200);assert.notEqual(await tileUrls(),beforeZoom,"Provider zoom should request a different tile view");await f.locator(".leaflet-control-zoom-in").click();await page.waitForTimeout(1000);await page.screenshot({path:"qa-artifacts/live-map-zoomed.png"});report.checks.push("Original map zoom controls updated loaded tile view");
 const id=await page.evaluate(()=>LEONIDA_MAP.rows.find(r=>r[2]==="vehicle"&&r[0].startsWith("standout-vehicle-"))?.[0]);assert(id);
 await page.evaluate(id=>LeonidaMap.openId(id),id);
 await f.locator(".leaflet-popup .pop").waitFor({state:"visible",timeout:60000});
 const content=await f.locator(".leaflet-popup .pop").innerText();assert(content.trim().length>5);
 report.checks.push("Exact linked vehicle pin opened original information popup");
 await page.screenshot({path:"qa-artifacts/live-location-popup.png"});
 const found=f.locator(".leaflet-popup .found-btn");
 if(await found.count()){const before=await found.innerText();await found.click();assert.notEqual(await found.innerText(),before);await found.click();report.checks.push("Original mark-as-found toggle responded");}
 await page.evaluate(()=>LeonidaMap.mode("all"));
 await f.locator(".ctl-filters").waitFor({timeout:60000});
 await f.locator(".ctl-filters").click();
 await f.getByRole("combobox",{name:"Search the map"}).waitFor({state:"visible",timeout:15000});
 report.checks.push("Original filter panel and map search available");
 await page.screenshot({path:"qa-artifacts/live-map-filters.png"});
 report.status="passed";
}catch(e){report.error=String(e);if(page)await page.screenshot({path:"qa-artifacts/live-map-failure.png"}).catch(()=>{});throw e;}
finally{await writeFile("qa-artifacts/live-provider-report.json",JSON.stringify(report,null,2));console.log(JSON.stringify(report));await browser?.close();await new Promise(r=>server.close(r));}
