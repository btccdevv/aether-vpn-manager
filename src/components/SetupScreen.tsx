import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FolderSearch, Terminal, ChevronRight } from 'lucide-react';
import ParticleBackground from './ParticleBackground';

export const SetupScreen = ({ onPathSubmit }: { onPathSubmit: (path: string) => void }) => {
    const [pathInput, setPathInput] = useState('/home/xvxvxv/codes/vpn');

    const handleSubmit = () => {
        onPathSubmit(pathInput);
    };

    return (
        <div className="h-screen w-screen bg-[#09090b] text-white flex flex-col items-center justify-center p-8 relative overflow-hidden">
            <div className="absolute inset-0 z-0"><ParticleBackground /></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="z-10 w-full max-w-lg bg-black/60 backdrop-blur-2xl border border-white/10 rounded-2xl p-10 shadow-2xl text-center"
            >
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="flex justify-center mb-6"
                >
                    <div className="">

                    </div>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                    className="text-4xl font-bold mb-2 bg-gradient-to-br from-white to-gray-400 bg-clip-text text-transparent"
                >
                    Welcome to Aether
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
                    className="text-gray-400 text-sm mb-8"
                >
                    Where are your VPN configurations located?
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}
                    className="mb-6"
                >
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Config Folder Path</label>
                    <div className="flex gap-2 mt-2">
                        <div className="relative flex-1">
                             <FolderSearch className="absolute top-2.5 left-3 w-4 h-4 text-gray-500"/>
                             <input
                                id="pathInput"
                                value={pathInput}
                                onChange={(e) => setPathInput(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-3 py-2 text-sm outline-none focus:border-purple-500 transition font-mono"
                                placeholder="/path/to/your/configs"
                             />
                        </div>
                    </div>
                </motion.div>

                <motion.button
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}
                    onClick={handleSubmit}
                    className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded-lg transition flex items-center justify-center gap-2 group shadow-[0_0_20px_rgba(168,85,247,0.3)]"
                >
                    Load & Secure
                    <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1"/>
                </motion.button>
            </motion.div>
        </div>
    );
};
