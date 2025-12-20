import { app, BrowserWindow, ipcMain, Tray, Menu, Notification, nativeImage } from 'electron'
import path from 'node:path'
import { exec } from 'node:child_process'
import fs from 'node:fs'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'


app.commandLine.appendSwitch('ignore-gpu-blocklist');
app.commandLine.appendSwitch('enable-gpu-rasterization');
app.commandLine.appendSwitch('enable-zero-copy');

const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))

const DIST = path.join(__dirname, '../dist')
const PUBLIC = app.isPackaged ? DIST : path.join(DIST, '../public')
process.env.DIST = DIST
process.env.VITE_PUBLIC = PUBLIC

let win: BrowserWindow | null
let trafficInterval: NodeJS.Timeout | null = null
let currentConnectionName: string | null = null
let lastRx = 0
let lastTx = 0

// Config File Path
const userDataPath = app.getPath('userData');
const configFilePath = path.join(userDataPath, 'user-config.json');

// Helper pentru Configurare
const getUserConfig = () => {
    try {
        if (fs.existsSync(configFilePath)) {
            return JSON.parse(fs.readFileSync(configFilePath, 'utf-8'));
        }
    } catch {}
    return { vpnPath: '' };
};

const saveUserConfig = (config: any) => {
    fs.writeFileSync(configFilePath, JSON.stringify(config, null, 2));
};

function createWindow() {
  win = new BrowserWindow({
    width: 1100,
    height: 750,
    minWidth: 900,
    minHeight: 600,
    frame: false,
    transparent: true,
    hasShadow: true,
    icon: path.join(PUBLIC, 'electron-vite.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false,
      backgroundThrottling: false
    },
  })

  win.once('ready-to-show', () => {
      win?.show();
      safeCleanup();
  })

  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL)
  } else {
    win.loadFile(path.join(DIST, 'index.html'))
  }
}

const execute = (command: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
         if (command.startsWith('ping') || command.includes('delete') || command.includes('show')) {
             resolve(stdout || ''); return;
         }
         resolve('');
         return;
      }
      resolve(stdout.trim());
    });
  });
};

const safeCleanup = async () => {
    try {
        const output = await execute('nmcli -t -f NAME,TYPE connection show --active');
        const lines = output.split('\n');
        for (const line of lines) {
            const parts = line.split(':');
            if (parts.length < 2) continue;
            if (parts[1] === 'wireguard' || parts[1] === 'vpn' || parts[1] === 'tun') {
                currentConnectionName = parts[0];
                startTrafficMonitor();
                win?.webContents.send('vpn:status', { connected: true, server: parts[0] });
                return;
            }
        }
        win?.webContents.send('vpn:status', { connected: false });
    } catch {}
};

const getTraffic = () => {
    try {
        const data = fs.readFileSync('/proc/net/dev', 'utf-8');
        const lines = data.split('\n');
        let totalRx = 0, totalTx = 0;
        for (let i = 2; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;
            const parts = line.split(/\s+/);
            if (parts.length > 9) {
                if (parts[0].includes(':') && parts[0].split(':')[1] !== '') {
                     totalRx += parseInt(parts[0].split(':')[1]); totalTx += parseInt(parts[8]);
                } else {
                     totalRx += parseInt(parts[1]); totalTx += parseInt(parts[9]);
                }
            }
        }
        return { rx: totalRx, tx: totalTx };
    } catch { return { rx: 0, tx: 0 }; }
}

const startTrafficMonitor = () => {
    if (trafficInterval) clearInterval(trafficInterval);
    const init = getTraffic(); lastRx = init.rx; lastTx = init.tx;
    trafficInterval = setInterval(() => {
        const current = getTraffic();
        const down = Math.max(0, current.rx - lastRx);
        const up = Math.max(0, current.tx - lastTx);
        lastRx = current.rx; lastTx = current.tx;
        win?.webContents.send('stats:update', { down, up });
    }, 1000);
}

const stopTrafficMonitor = () => {
    if (trafficInterval) clearInterval(trafficInterval);
    win?.webContents.send('stats:update', { down: 0, up: 0 });
}

// --- IPC HANDLERS ---

// CONFIG PATH MANAGEMENT
ipcMain.handle('config:get-path', () => {
    const cfg = getUserConfig();
    return cfg.vpnPath || '';
});

ipcMain.handle('config:set-path', (_, newPath) => {
    const cfg = getUserConfig();
    cfg.vpnPath = newPath;
    saveUserConfig(cfg);
    return true;
});

ipcMain.handle('vpn:mullvad-check', async () => {
    try {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), 2000);
        const req = await fetch('https://am.i.mullvad.net/json', { signal: controller.signal });
        clearTimeout(id);
        const data = await req.json();
        return { connected: data.mullvad_exit_ip, ip: data.ip, country: data.country };
    } catch { return { connected: false }; }
});

ipcMain.handle('vpn:leak-check', async () => {
    try {
        const req = await fetch('https://am.i.mullvad.net/json');
        const data = await req.json();
        return { success: true, ...data, isProtected: data.mullvad_exit_ip };
    } catch { return { success: false }; }
});

ipcMain.handle('vpn:scan-dir', async (_, dirPath) => {
    try {
        if (!fs.existsSync(dirPath)) return [];
        return fs.readdirSync(dirPath).filter(f => f.endsWith('.conf') || f.endsWith('.ovpn')).map(f => {
            const c = fs.readFileSync(path.join(dirPath, f), 'utf-8');
            const m = c.match(/(Endpoint|remote)\s*(=|\s)\s*([0-9.]+)/i);
            return { id: f, name: f.replace(/\.(conf|ovpn)$/, ''), path: path.join(dirPath, f), type: f.includes('conf') ? 'wireguard' : 'openvpn', endpoint: m ? m[3] : '1.1.1.1' };
        });
    } catch { return []; }
});

ipcMain.handle('vpn:connect', async (_, config) => {
  try {
    if (currentConnectionName) await execute(`nmcli connection delete id "${currentConnectionName}"`);
    const connName = config.name;
    await execute(`nmcli connection delete id "${connName}"`);
    await execute(`nmcli connection import type ${config.type} file "${config.path}"`);
    await execute(`nmcli connection up id "${connName}"`);
    currentConnectionName = connName;
    startTrafficMonitor();
    new Notification({ title: 'Aether VPN', body: 'Secured' }).show();
    return { success: true };
  } catch { return { success: false }; }
});

ipcMain.handle('vpn:disconnect', async () => {
    stopTrafficMonitor();
    if (currentConnectionName) {
        await execute(`nmcli connection down id "${currentConnectionName}"`);
        await execute(`nmcli connection delete id "${currentConnectionName}"`);
        currentConnectionName = null;
    }
    win?.webContents.send('vpn:status', { connected: false });
    return { success: true };
});

ipcMain.handle('vpn:ping', async (_, ip) => {
    try { const o = await execute(`ping -c 1 -W 1 ${ip}`); const m = o.match(/time=([0-9.]+)/); return m ? Math.round(parseFloat(m[1])) : 999; } catch { return 999; }
});

ipcMain.handle('app:close', () => app.quit());
ipcMain.handle('app:minimize', () => win?.minimize());

app.whenReady().then(createWindow)
