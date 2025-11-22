const { spawn } = require('child_process');
const path = require('path'); const os = require('os');
const exe = process.platform==='win32' ? 'npx.cmd' : 'npx';
const child = spawn(exe, ['-y','electron','--disable-gpu','.'], { stdio: 'inherit' });
const timer = setTimeout(()=>{ try{ child.kill(); }catch{}; }, 5000);
child.on('exit', (code)=>{ clearTimeout(timer); process.exit(0); });
