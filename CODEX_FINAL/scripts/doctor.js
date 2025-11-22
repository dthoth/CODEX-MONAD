const cp=require('child_process');const fs=require('fs');const path=require('path');
function sh(c){try{return cp.execSync(c,{stdio:['ignore','pipe','ignore']}).toString().trim()}catch{return'n/a'}}
console.log('Node:', sh('node -v')); console.log('NPM :', sh('npm -v'));
const ud = process.env.PORTABLE_MODE==='1'||process.argv.includes('--portable')?path.join(process.cwd(),'data'):'(use --portable)';
console.log('userData path (expected):', ud);
try{fs.mkdirSync(path.join(process.cwd(),'data','_write_test'),{recursive:true});fs.writeFileSync(path.join(process.cwd(),'data','_write_test','.ok'),'ok');console.log('data/ writable: true')}catch{console.log('data/ writable: false')}
