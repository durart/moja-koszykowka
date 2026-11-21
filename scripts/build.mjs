import {cp,mkdir,rm} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
execFileSync(process.execPath,['--test','tests/state.test.js'],{stdio:'inherit'});
const out='dist';await rm(out,{recursive:true,force:true});await mkdir(out);
for(const p of ['index.html','manifest.webmanifest','sw.js','src','icons'])await cp(p,`${out}/${p}`,{recursive:true});
console.log('Gotowe: dist/');
