import http from 'node:http';
import {readFile} from 'node:fs/promises';
import {extname,resolve,sep} from 'node:path';
const root=resolve('.');const types={'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.webmanifest':'application/manifest+json; charset=utf-8','.json':'application/json; charset=utf-8'};
const server=http.createServer(async(req,res)=>{
  try{let pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname); if(pathname==='/')pathname='/index.html'; const full=resolve(root,'.'+pathname);if(!(full===root||full.startsWith(root+sep)))throw Error('Nieprawidłowa ścieżka'); const content=await readFile(full);res.writeHead(200,{'content-type':types[extname(full)]||'application/octet-stream','cache-control':'no-store'});res.end(content);}catch{res.writeHead(404);res.end('404');}
});
server.listen(process.env.PORT||4173,'0.0.0.0',()=>console.log(`Moja Koszykówka: http://localhost:${process.env.PORT||4173}`));
