const {contextBridge, ipcRenderer} = require('electron');
contextBridge.exposeInMainWorld('electronAPI', {
  listApps: () => ipcRenderer.invoke('apps:list'),
  openApp:  (id) => ipcRenderer.invoke('apps:open', id)
});
