import React from 'react';
import { motion } from 'framer-motion';
import { Home, Plane, Wifi, Shield, Zap, CheckCircle2 } from 'lucide-react';
import { clsx } from 'clsx';

const colorMap: any = {
    emerald: {
        bgActive: 'bg-emerald-500/10',
        borderActive: 'border-emerald-500',
        text: 'text-emerald-400',
        bgIcon: 'bg-emerald-500',
        glow: 'bg-emerald-500'
    },
    purple: {
        bgActive: 'bg-purple-500/10',
        borderActive: 'border-purple-500',
        text: 'text-purple-400',
        bgIcon: 'bg-purple-500',
        glow: 'bg-purple-500'
    },
    orange: {
        bgActive: 'bg-orange-500/10',
        borderActive: 'border-orange-500',
        text: 'text-orange-400',
        bgIcon: 'bg-orange-500',
        glow: 'bg-orange-500'
    }
};

const ProfileCard = ({ id, title, icon, desc, color, active, settings, onSelect, onToggleSetting }: any) => {
    const theme = colorMap[color] || colorMap['emerald'];

    return (
        <motion.div
            onClick={() => onSelect(id)}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className={clsx(
                "relative p-6 rounded-2xl border transition-all cursor-pointer overflow-hidden group",
                active
                    ? `${theme.bgActive} ${theme.borderActive} shadow-lg`
                    : "bg-white/5 border-white/10 hover:border-white/20"
            )}
        >
            {}
            {active && (
                <div className={clsx("absolute top-4 right-4 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 bg-black/40", theme.text)}>
                    <CheckCircle2 className="w-3 h-3" /> ACTIVE
                </div>
            )}

            <div className="flex items-start gap-4 mb-6">
                <div className={clsx("p-3 rounded-xl", active ? `${theme.bgIcon} text-black` : "bg-white/10 text-gray-400")}>
                    {icon}
                </div>
                <div>
                    <h3 className={clsx("text-lg font-bold", active ? "text-white" : "text-gray-300")}>{title}</h3>
                    <p className="text-xs text-gray-500 mt-1">{desc}</p>
                </div>
            </div>

            {}
            <div className="space-y-3">
                <div className="flex items-center justify-between" onClick={(e) => { e.stopPropagation(); onToggleSetting(id, 'autoConnect'); }}>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                        <Zap className="w-3 h-3" /> Auto-Connect Best
                    </div>
                    <div className={clsx("w-8 h-4 rounded-full relative transition-colors", settings.autoConnect ? theme.bgIcon : "bg-gray-700")}>
                        <div className={clsx("absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all", settings.autoConnect ? "left-4.5" : "left-0.5")} />
                    </div>
                </div>

                <div className="flex items-center justify-between" onClick={(e) => { e.stopPropagation(); onToggleSetting(id, 'killSwitch'); }}>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                        <Shield className="w-3 h-3" /> Kill Switch
                    </div>
                    <div className={clsx("w-8 h-4 rounded-full relative transition-colors", settings.killSwitch ? theme.bgIcon : "bg-gray-700")}>
                        <div className={clsx("absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all", settings.killSwitch ? "left-4.5" : "left-0.5")} />
                    </div>
                </div>
            </div>

            {}
            {active && <div className={clsx("absolute -bottom-10 -right-10 w-32 h-32 rounded-full blur-[60px] opacity-20", theme.glow)} />}
        </motion.div>
    );
};

export const ProfilesView = ({ activeProfileId, profiles, setProfiles, setActiveProfileId }: any) => {

    const handleToggle = (id: string, setting: string) => {
        setProfiles((prev: any[]) => prev.map(p =>
            p.id === id ? { ...p, settings: { ...p.settings, [setting]: !p.settings[setting] } } : p
        ));
    };

    return (
        <div className="p-8 h-full flex flex-col z-20 overflow-y-auto custom-scrollbar">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-white flex items-center gap-3">Smart Profiles</h2>
                <p className="text-gray-500 text-sm mt-1">Select a security posture based on your environment.</p>
            </div>

            <div className="grid grid-cols-1 gap-4 pb-4">
                {profiles.map((profile: any) => (
                    <ProfileCard
                        key={profile.id}
                        {...profile}
                        active={activeProfileId === profile.id}
                        onSelect={setActiveProfileId}
                        onToggleSetting={handleToggle}
                    />
                ))}
            </div>
        </div>
    );
};