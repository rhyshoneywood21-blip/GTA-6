import {readFile,writeFile,mkdir,rm,copyFile} from "node:fs/promises";
import {join} from "node:path";
import {fileURLToPath} from "node:url";
const root=fileURLToPath(new URL("../",import.meta.url));
const dir=join(root,"dist");
await rm(dir,{recursive:true,force:true});await mkdir(join(dir,"app"),{recursive:true});
let html=await readFile(join(root,"index.html"),"utf8");
const scripts=[...html.matchAll(/<script src="([^"]+)"><\/script>/g)].map(m=>m[1]);
for(const p of scripts){if(!/^app\/[a-z0-9-]+\.js$/.test(p))throw Error("Unexpected asset path: "+p);await copyFile(join(root,p),join(dir,p));}
let snapshot={};try{snapshot=JSON.parse(await readFile(join(root,"data/catalog-snapshot.json"),"utf8"));}catch(e){if(e.code!=="ENOENT")throw e;}
const snapshotJS="window.LEONIDA_CATALOG_SNAPSHOT="+JSON.stringify(snapshot).replace(/</g,"\\u003c")+";\n";
await writeFile(join(dir,"app/catalog-snapshot.js"),snapshotJS);
html=html.replace('<script src="app/catalog.js"></script>','<script src="app/catalog-snapshot.js"></script><script src="app/catalog.js"></script>');
await writeFile(join(dir,"index.html"),html);
let standalone=html;
for(const match of html.matchAll(/<script src="([^"]+)"><\/script>/g)){
 const js=await readFile(join(dir,match[1]),"utf8");standalone=standalone.replace(match[0],()=>"<script>\n"+js.replace(/<\/script/gi,"<\\/script")+"\n</script>");
}
await writeFile(join(dir,"Leonida-Companion.html"),standalone);
console.log("Built offline assets",scripts.length+1,"scripts; standalone bytes",Buffer.byteLength(standalone));
