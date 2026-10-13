import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
function inventory(directory) {
  return Object.fromEntries(fs.readdirSync(directory, { withFileTypes:true }).flatMap(entry => {
    const file=path.join(directory,entry.name);
    return entry.isDirectory()?Object.entries(inventory(file)):[[file,crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')]];
  }));
}
const before=inventory('src/design/api/generated');
const command=process.platform==='win32'?'pnpm.cmd':'pnpm';
const result=spawnSync(command,['exec','orval'],{stdio:'inherit',shell:process.platform==='win32'});
if(result.status!==0)process.exit(result.status??1);
const after=inventory('src/design/api/generated');
if(JSON.stringify(before)!==JSON.stringify(after)){console.error('Generated clients drifted. Review contract/client changes and regenerate before committing.');process.exitCode=1;}
else console.log('PASS: complete Orval clients are reproducible from the reviewed contract.');
