import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity, Settings, Globe, Scan, Minus, X,
  ArrowUp, ArrowDown, Power, CheckCircle2, ShieldAlert, Cpu, Layers, Home, Plane, Wifi
} from 'lucide-react';
import { clsx } from 'clsx';
import ParticleBackground from './components/ParticleBackground';
import TrafficGraph from './components/TrafficGraph';
import { sfx } from './utils/SoundEngine';
import { SidebarBtn, Counter } from './components/UIComponents';
import { LoadRing } from './components/LoadRing';
import { LeakDetector } from './components/LeakDetector';
import { ProtonMap } from './components/ProtonMap';
import { ProcessMonitor } from './components/ProcessMonitor';
import { ServerDrawer } from './components/ServerDrawer';
import { SettingsView } from './components/SettingsView';
import { ProfilesView } from './components/ProfilesView';
import { detectCity } from './utils/geoData';

const VPN_DIR = '/home/xvxvxv/codes/vpn';

function App() {
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [view, setView] = useState('dashboard');
  const [servers, setServers] = useState<any[]>([]);
  const [selectedServer, setSelectedServer] = useState<any>(null);
  const [downSpeed, setDownSpeed] = useState(0);
  const [upSpeed, setUpSpeed] = useState(0);
  const [realInfo, setRealInfo] = useState<any>(null);
  const [activeCityGroup, setActiveCityGroup] = useState<any>(null);
  const [ripples, setRipples] = useState<{x: number, y: number, id: number}[]>([]);

  // --- PROFILES STATE (SAFE INIT) ---
  const defaultProfiles = [
      {
          id: 'home', title: 'Home Network', desc: 'Balanced security.',
          icon: <Home className="w-6 h-6"/>, color: 'emerald',
          settings: { autoConnect: false, killSwitch: false, bestServer: true }
      },
      {
          id: 'travel', title: 'Travel Mode', desc: 'High encryption routing.',
          icon: <Plane className="w-6 h-6"/>, color: 'purple',
          settings: { autoConnect: true, killSwitch: true, bestServer: false }
      },
      {
          id: 'public', title: 'Public Wi-Fi', desc: 'Maximum paranoia security.',
          icon: <Wifi className="w-6 h-6"/>, color: 'orange',
          settings: { autoConnect: true, killSwitch: true, bestServer: true }
      }
  ];

  const [profiles, setProfiles] = useState(() => {
      try {
          const s = localStorage.getItem('vpn_profiles');
          // Validam ca datele sunt ok, altfel fallback la default
          const parsed = s ? JSON.parse(s) : null;
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
          return defaultProfiles;
      } catch {
          return defaultProfiles;
      }
  });

  const [activeProfileId, setActiveProfileId] = useState(() => {
      return localStorage.getItem('vpn_active_profile') || 'home';
  });

  // Ensure active profile exists
  const activeProfileData = useMemo(() => {
      return profiles.find((p:any) => p.id === activeProfileId) || profiles[0];
  }, [profiles, activeProfileId]);

  useEffect(() => {
      // Reconstruim iconitele dupa JSON.parse (React Elements se pierd in localStorage)
      const profilesWithIcons = profiles.map((p:any, i:number) => ({
          ...p,
          icon: defaultProfiles[i]?.icon || <Home className="w-6 h-6"/>
      }));
      // Nu salvam iconitele in state pentru ca da loop, doar le afisam
  }, []);

  useEffect(() => {
      // Salvam doar datele serializabile
      const toSave = profiles.map(({ icon, ...rest }: any) => rest);
      localStorage.setItem('vpn_profiles', JSON.stringify(toSave));
      localStorage.setItem('vpn_active_profile', activeProfileId);
  }, [profiles, activeProfileId]);

  // --- SETTINGS STATE ---
  const [settings, setSettings] = useState(() => {
      try {
          const s = localStorage.getItem('vpn_settings');
          return s ? JSON.parse(s) : { autoConnect: false, killSwitch: true, sound: true };
      } catch { return { autoConnect: false, killSwitch: true, sound: true }; }
  });

  useEffect(() => { localStorage.setItem('vpn_settings', JSON.stringify(settings)); sfx.setEnabled(settings.sound); }, [settings]);

  useEffect(() => {
    window.ipcRenderer.on('stats:update', (_: any, data: any) => { setDownSpeed(data.down/1024); setUpSpeed(data.up/1024); });
    window.ipcRenderer.on('vpn:status', (_: any, st: any) => {
        if (st.connected) { setConnected(true); }
        else { setConnected(false); setRealInfo(null); }
    });
    scanFiles();
    const hb = setInterval(async () => {
        const s = await window.ipcRenderer.invoke('vpn:mullvad-check');
        if (s.connected) { if (!connected) { setConnected(true); setConnecting(false); } setRealInfo(s); }
        else { if (connected && !connecting) {} }
    }, 3000);
    return () => clearInterval(hb);
  }, [connected]);

  const scanFiles = async () => {
    const res = await window.ipcRenderer.invoke('vpn:scan-dir', VPN_DIR);
    const enriched = res.map((s:any) => { const geo = detectCity(s.name); return { ...s, prettyCountry: geo.country, prettyCity: geo.city, cityCode: geo.code, load: Math.floor(Math.random()*80)+10 }; });
    setServers(enriched);
    if (enriched.length > 0 && !selectedServer) setSelectedServer(enriched[0]);
  }

  const handleConnect = async (e: React.MouseEvent) => {
    if (!selectedServer) return;
    const rect = (e.target as HTMLElement).closest('button')?.getBoundingClientRect();
    if(rect) {
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const id = Date.now();
        setRipples(prev => [...prev, {x, y, id}]);
        setTimeout(() => setRipples(prev => prev.filter(r => r.id !== id)), 1000);
    }
    sfx.playClick();
    if (connected) {
        setConnecting(true); await window.ipcRenderer.invoke('vpn:disconnect'); setConnecting(false); sfx.playDisconnect();
    } else {
        setConnecting(true); sfx.playConnect();
        const res = await window.ipcRenderer.invoke('vpn:connect', selectedServer);
        if (!res.success) setConnecting(false);
    }
  }

  const MemoMap = useMemo(() => (<ProtonMap servers={servers} selectedServerId={selectedServer?.id} onCitySelect={setActiveCityGroup} />), [servers, selectedServer]);

  // COLOR THEME BASED ON PROFILE
  const themeColor = activeProfileData?.color || 'emerald';
  const getGlowStyle = () => {
      if(themeColor === 'orange') return connected ? "bg-orange-500/10 border-orange-500 shadow-[0_0_50px_rgba(249,115,22,0.4)]" : "bg-[#18181b]/80 border-white/10 hover:border-orange-500/50";
      if(themeColor === 'purple') return connected ? "bg-purple-500/10 border-purple-500 shadow-[0_0_50px_rgba(168,85,247,0.4)]" : "bg-[#18181b]/80 border-white/10 hover:border-purple-500/50";
      return connected ? "bg-emerald-500/10 border-emerald-500 shadow-[0_0_50px_rgba(16,185,129,0.4)]" : "bg-[#18181b]/80 border-white/10 hover:border-emerald-500/50";
  };
  const textColor = connected ? `text-${themeColor}-400` : "text-gray-400";

  // Re-attach icons for rendering (they are lost in JSON stringify)
  const profilesForRender = profiles.map((p:any, i:number) => ({
      ...p,
      icon: defaultProfiles[i]?.icon || <Home className="w-6 h-6"/>
  }));

  return (
    <div className="h-screen w-screen bg-[#09090b] text-white overflow-hidden flex flex-col relative font-sans">
      <div className="absolute inset-0 z-0"><ParticleBackground /></div>
      <div className="h-10 flex justify-between items-center px-4 z-50 bg-black/20 backdrop-blur-md border-b border-white/5" style={{WebkitAppRegion: 'drag'} as any}>
         <div className="flex items-center gap-2">
             <span className="text-xs font-bold text-gray-500 tracking-[0.2em]">AETHER PRO</span>
             <span className={clsx("text-[10px] px-2 py-0.5 rounded border border-white/10 uppercase font-bold",
                themeColor === 'orange' ? "text-orange-400 bg-orange-500/10" :
                themeColor === 'purple' ? "text-purple-400 bg-purple-500/10" : "text-emerald-400 bg-emerald-500/10"
             )}>{activeProfileData.title}</span>
         </div>
         <div className="flex items-center gap-2 no-drag" style={{WebkitAppRegion: 'no-drag'} as any}><button onClick={()=>window.ipcRenderer.invoke('app:minimize')} className="p-1 hover:bg-white/10 rounded"><Minus className="w-4 h-4"/></button><button onClick={()=>window.ipcRenderer.invoke('app:close')} className="p-1 hover:bg-red-500/80 rounded"><X className="w-4 h-4"/></button></div>
      </div>

      <div className="flex-1 flex z-10 relative min-h-0">
        <div className="w-20 bg-[#18181b]/60 backdrop-blur-2xl border-r border-white/5 flex flex-col items-center py-6 gap-6 z-20">
           <SidebarBtn active={view==='dashboard'} onClick={()=>setView('dashboard')} icon={<Activity/>} label="Dash" onHover={()=>sfx.playHover()}/>
           <SidebarBtn active={view==='profiles'} onClick={()=>setView('profiles')} icon={<Layers/>} label="Profiles" onHover={()=>sfx.playHover()}/>
           <SidebarBtn active={view==='map'} onClick={()=>setView('map')} icon={<Globe/>} label="Map" onHover={()=>sfx.playHover()}/>
           <SidebarBtn active={view==='security'} onClick={()=>setView('security')} icon={<Scan/>} label="Audit" onHover={()=>sfx.playHover()}/>
           <div className="mt-auto"><SidebarBtn active={view==='settings'} onClick={()=>setView('settings')} icon={<Settings/>} label="Config" onHover={()=>sfx.playHover()}/></div>
        </div>

        <div className="flex-1 flex flex-col relative overflow-hidden">
          <AnimatePresence mode='wait'>
            {view === 'dashboard' && (
              <motion.div key="dash" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="h-full flex flex-col p-8">
                <div className="flex justify-between items-start z-20">
                    <div>
                        <div className="flex items-center gap-2 mb-2"><div className={clsx("w-3 h-3 rounded-full transition-colors duration-500", connected ? `bg-${themeColor}-500 shadow-[0_0_10px_currentColor]` : "bg-red-500")}></div><span className={clsx("text-xs font-mono font-bold tracking-wider transition-colors duration-500", connected ? `text-${themeColor}-500` : "text-red-500")}>{connected ? "SECURED" : "UNPROTECTED"}</span></div>
                        {connected && realInfo ? ( <div className="flex flex-col gap-1"><h1 className="text-4xl font-bold text-white">{realInfo.country}</h1><div className="text-gray-400 text-sm flex gap-3"><span>{realInfo.ip}</span><span className="text-emerald-500 flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> Verified</span></div></div> ) : ( <div className="flex flex-col gap-1"><h1 className="text-4xl font-bold">{selectedServer?.prettyCity || 'Select Server'}</h1><span className="text-emerald-400 text-sm">Load: {selectedServer?.load || 0}%</span></div> )}
                    </div>
                    {}
                </div>

                <div className="flex-1 flex flex-col items-center justify-center relative z-20">
                   <motion.div animate={{ backgroundColor: connected ? (themeColor === 'orange' ? '#f97316' : themeColor === 'purple' ? '#a855f7' : '#10b981') : connecting ? "#eab308" : "#8b5cf6", opacity: connected ? 0.15 : 0.1 }} className="absolute w-[500px] h-[500px] rounded-full blur-[120px]" />
                   <button onClick={handleConnect} disabled={!selectedServer} className="group relative outline-none disabled:opacity-50">
                      <div className={clsx("w-52 h-52 rounded-full flex items-center justify-center border-2 transition-all duration-500", connected ? `border-${themeColor}-500/30` : "border-white/5 group-hover:border-purple-500/30")}>
                          <div className={clsx("w-40 h-40 rounded-full flex flex-col items-center justify-center backdrop-blur-xl border-4 shadow-2xl transition-all duration-500 overflow-hidden relative", getGlowStyle())}>
                             {ripples.map(r => (<motion.span key={r.id} initial={{ width: 0, height: 0, opacity: 0.5 }} animate={{ width: 500, height: 500, opacity: 0 }} transition={{ duration: 1 }} style={{ left: r.x, top: r.y }} className="absolute bg-white/30 rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2" />))}
                             <Power className={clsx("w-12 h-12 transition-all", `text-${themeColor}-400`)} />
                             <span className="mt-2 text-xs font-bold tracking-[0.2em] uppercase text-gray-500 group-hover:text-gray-300">{connecting ? '...' : connected ? 'STOP' : 'START'}</span>
                          </div>
                      </div>
                   </button>
                   <div className="w-full max-w-2xl mt-12 h-32"><TrafficGraph downloadSpeed={downSpeed} uploadSpeed={upSpeed} /></div>
                </div>
              </motion.div>
            )}

            {view === 'profiles' && (
                <motion.div key="prof" className="h-full z-20">
                    <ProfilesView
                        activeProfileId={activeProfileId}
                        profiles={profilesForRender}
                        setProfiles={setProfiles}
                        setActiveProfileId={setActiveProfileId}
                    />
                </motion.div>
            )}

            {view === 'map' && (
                <motion.div key="map" className="h-full w-full relative z-20">
                    {MemoMap}<ServerDrawer isOpen={!!activeCityGroup} onClose={()=>setActiveCityGroup(null)} cityName={activeCityGroup?.name} countryName={activeCityGroup?.country} servers={activeCityGroup?.servers||[]} onSelect={(s:any)=>{setSelectedServer(s); setView('dashboard'); setActiveCityGroup(null);}} currentId={selectedServer?.id}/>
                </motion.div>
            )}

            {view === 'security' && <motion.div key="sec" className="h-full z-20"><LeakDetector /></motion.div>}
            {view === 'settings' && <motion.div key="settings" className="h-full z-20"><SettingsView settings={settings} setSettings={setSettings} VPN_DIR="/home/xvxvxv/codes/vpn" appVersion="4.2 Stable" /></motion.div>}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
export default App;
