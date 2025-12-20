import React, { useState } from 'react';
import { Settings, Volume2, Power, ShieldAlert, FolderOpen, Save, Palette } from 'lucide-react';
import { clsx } from 'clsx';

const SettingToggle = ({ label, desc, active, onClick, icon }: any) => (
    <div onClick={onClick} className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-xl cursor-pointer hover:bg-white/10 transition">
        <div className="flex items-center gap-3">
            <div className={clsx("p-2 rounded-lg transition-colors", active ? "bg-emerald-500/20 text-emerald-400" : "bg-gray-700/30 text-gray-400")}>{icon}</div>
            <div>
                <div className="font-bold text-sm text-white">{label}</div>
                <div className="text-xs text-gray-500">{desc}</div>
            </div>
        </div>
        <div className={clsx("w-11 h-6 rounded-full relative transition-colors duration-300", active ? "bg-emerald-500" : "bg-gray-700")}>
            <div className={clsx("absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 shadow-md", active ? "left-6" : "left-1")} />
        </div>
    </div>
);

export const SettingsView = ({ settings, setSettings, vpnPath, setVpnPath, appVersion }: any) => {
    const [pathInput, setPathInput] = useState(vpnPath);

    const savePath = async () => {
        await window.ipcRenderer.invoke('config:set-path', pathInput);
        setVpnPath(pathInput);
        alert('Path saved! Reloading...');
        window.location.reload();
    };

    const toggle = (key: string) => {
        setSettings((prev: any) => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="p-8 h-full flex flex-col z-20 overflow-y-auto custom-scrollbar">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3 mb-6"><Settings className="w-6 h-6 text-purple-400"/> Settings</h2>

            <div className="space-y-4">
                {}
                <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                    <div className="flex items-center gap-2 mb-2 text-gray-300 font-bold text-sm"><FolderOpen className="w-4 h-4"/> VPN Configs Path</div>
                    <div className="flex gap-2">
                        <input
                            value={pathInput}
                            onChange={(e) => setPathInput(e.target.value)}
                            className="flex-1 bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-white focus:border-purple-500 outline-none"
                        />
                        <button onClick={savePath} className="bg-purple-600 hover:bg-purple-500 text-white p-2 rounded-lg"><Save className="w-4 h-4"/></button>
                    </div>
                </div>

                {}
                <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                    <div className="flex items-center gap-2 mb-3 text-gray-300 font-bold text-sm"><Palette className="w-4 h-4"/> Seasonal Theme</div>
                    <div className="grid grid-cols-4 gap-2">
                        {['none', 'christmas', 'halloween', 'easter'].map(t => (
                            <button
                                key={t}
                                onClick={() => setSettings((s:any) => ({...s, theme: t}))}
                                className={clsx("text-xs py-2 rounded-lg border uppercase font-bold transition", settings.theme === t ? "bg-emerald-500/20 border-emerald-500 text-emerald-400" : "bg-black/20 border-white/5 text-gray-500 hover:bg-white/5")}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>

                <SettingToggle label="Sound Effects" desc="Enable UI sounds." active={settings.sound} onClick={() => toggle('sound')} icon={<Volume2 className="w-5 h-5"/>} />
                <SettingToggle label="Auto-Connect" desc="Connect on startup." active={settings.autoConnect} onClick={() => toggle('autoConnect')} icon={<Power className="w-5 h-5"/>} />
                <SettingToggle label="Kill Switch" desc="Block net if VPN drops." active={settings.killSwitch} onClick={() => toggle('killSwitch')} icon={<ShieldAlert className="w-5 h-5"/>} />
            </div>
        </div>
    );
};