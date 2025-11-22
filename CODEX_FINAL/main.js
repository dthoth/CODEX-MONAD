const {app, BrowserWindow, ipcMain} = require('electron');
const path = require('path'); const fs = require('fs');

// Portable mode
const isPortable = process.env.PORTABLE_MODE === '1' || process.argv.includes('--portable');
if (isPortable) {
  const portableDir = path.join(process.resourcesPath || process.cwd(), 'data');
  try { fs.mkdirSync(portableDir, {recursive:true}); } catch {}
  app.setPath('userData', portableDir);
}

// Logger

// --- VERIFY_PORTABLE + diagnostics dump ---
const diagDir = path.join(app.getPath('userData'), 'diagnostics');
try { fs.mkdirSync(diagDir, { recursive: true }); } catch {}
const diag = {
  ts: new Date().toISOString(),
  node: process.version,
  electron: process.versions.electron,
  chrome: process.versions.chrome,
  platform: process.platform,
  arch: process.arch,
  portableMode: isPortable,
  userDataPath: app.getPath('userData')
};
try { fs.writeFileSync(path.join(diagDir, 'diagnostics.json'), JSON.stringify(diag, null, 2)); } catch {}
if (isPortable && !app.getPath('userData').replace(/\\/g,'/').includes('/data')) {
  console.error('VERIFY_PORTABLE failed: userData not under ./data ->', app.getPath('userData'));
}

const logDir = path.join(app.getPath('userData'), 'logs');
try { fs.mkdirSync(logDir, { recursive: true }); } catch {}
const logFile = path.join(logDir, `app-${new Date().toISOString().slice(0,10)}.log`);
const logStream = fs.createWriteStream(logFile, { flags: 'a' });
function logLine(level, msg){ const line = `[${new Date().toISOString()}] [${level}] ${msg}\n`; try { logStream.write(line); } catch {} }
['log','warn','error'].forEach(fn => { const o=console[fn].bind(console); console[fn]=(...a)=>{try{logLine(fn.toUpperCase(),a.map(String).join(' '))}catch{};o(...a)} });

// Optional GPU disable
if (process.env.DISABLE_GPU==='1' || process.argv.includes('--disable-gpu')) app.commandLine.appendSwitch('disable-gpu');

function createWindow() {
  const win = new BrowserWindow({
    width: 1280, height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true, sandbox: true, nodeIntegration: false, webviewTag: true
    }
  });
  win.loadFile('index.html');
}

app.whenReady().then(createWindow);
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });

// Harden webviews
app.on('web-contents-created', (_e, contents) => {
  contents.on('will-attach-webview', (event, params) => {
    delete params.preloadURL;
    params.preload = path.join(__dirname, 'preload-webview.js');
    params.nodeintegration = false;
    params.allowpopups = false;
  });
  contents.setWindowOpenHandler(() => ({ action: 'deny' }));
});

// Apps registry
const appsRoot = path.join(process.resourcesPath || process.cwd(), 'apps');
function readJSON(p, fb){ try { return JSON.parse(fs.readFileSync(p,'utf8')); } catch { return fb; } }

ipcMain.handle('apps:list', () => {
  if (!fs.existsSync(appsRoot)) return [];
  return fs.readdirSync(appsRoot)
    .filter(d => fs.existsSync(path.join(appsRoot, d, 'app.json')))
    .map(d => readJSON(path.join(appsRoot, d, 'app.json'), {id:d,dir:d}));
});

ipcMain.handle('apps:open', (_e, id) => {
  const p = path.join(appsRoot, id, 'app.json');
  const meta = readJSON(p, null);
  if (!meta) return false;
  const w = new BrowserWindow({
    width: 1000, height: 700,
    webPreferences: { preload: path.join(__dirname,'preload.js'), contextIsolation:true, sandbox:true, nodeIntegration:false }
  });
  if (meta.kind === 'html') { w.loadFile(path.join(appsRoot, id, meta.entry)); return true; }
  if (meta.kind === 'url')  { w.loadURL(meta.entry); return true; }
  return false;
});
