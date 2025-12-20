import React from 'react';
import { motion } from 'framer-motion';

type Theme = 'christmas' | 'halloween' | 'easter' | 'none';

// ASSETS
const Pumpkin = ({ x, scale, delay }: { x: string, scale: number, delay: number }) => (
    <motion.div
        className="absolute bottom-0 z-10"
        style={{ left: x, transform: `scale(${scale})` }}
        initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        transition={{ delay }}
    >
        <svg width="60" height="50" viewBox="0 0 60 50">
            <path d="M30,5 C50,5 60,20 60,35 C60,50 45,50 30,50 C15,50 0,50 0,35 C0,20 10,5 30,5 Z" fill="#f97316" />
            <path d="M28,5 L28,0 L32,0 L32,5" stroke="#166534" strokeWidth="3" />
            <motion.path d="M15,20 L25,20 L20,30 Z M35,20 L45,20 L40,30 Z" fill="#fef08a" animate={{ fillOpacity: [0.6, 1, 0.6] }} transition={{ duration: 2, repeat: Infinity }} />
            <path d="M15,40 Q30,45 45,40" fill="none" stroke="#fef08a" strokeWidth="2" />
        </svg>
    </motion.div>
);

const EasterEgg = ({ x, color, rotation }: any) => (
    <div className="absolute bottom-4 z-10 opacity-80" style={{ left: x, transform: `rotate(${rotation}deg)` }}>
        <svg width="30" height="40" viewBox="0 0 30 40">
            <ellipse cx="15" cy="20" rx="14" ry="19" fill={color} />
            <path d="M5,15 L25,15" stroke="rgba(0,0,0,0.1)" strokeWidth="2" />
        </svg>
    </div>
);

export const SeasonalOverlay = ({ theme }: { theme: Theme }) => {
  if (theme === 'none') return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">

      {theme === 'christmas' && (
        <>
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute bg-white rounded-full opacity-80 blur-[1px]"
              initial={{ x: Math.random() * window.innerWidth, y: -20, scale: Math.random() * 0.5 + 0.5 }}
              animate={{ y: window.innerHeight + 20, x: `calc(${Math.random() * 50 - 25}px)` }}
              transition={{ duration: Math.random() * 5 + 5, repeat: Infinity, ease: "linear", delay: Math.random() * 5 }}
              style={{ width: Math.random() * 3 + 2 + 'px', height: Math.random() * 3 + 2 + 'px' }}
            />
          ))}
          <div className="absolute bottom-0 left-0 w-full h-32 z-10">
              <div className="absolute bottom-0 w-full h-24 bg-gradient-to-t from-white/10 to-transparent backdrop-blur-[2px]"></div>
          </div>
        </>
      )}

      {theme === 'halloween' && (
        <>
          <div className="absolute inset-0 bg-gradient-to-t from-orange-900/20 via-transparent to-transparent mix-blend-overlay"></div>
          <Pumpkin x="5%" scale={1.4} delay={0} />
          {[...Array(5)].map((_, i) => (
            <motion.div key={i} className="absolute text-black/40" initial={{ x: -50, y: Math.random()*500 }} animate={{ x: window.innerWidth + 50 }} transition={{ duration: 15, delay: i*2 }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M22,2C22,2 18,8 18,8C17,8 16,7 15,7C12,7 12,9 12,9C12,9 12,7 9,7C8,7 7,8 6,8C6,8 2,2 2,2C2,2 4,10 4,10C4,10 6,12 6,12C6,12 8,10 8,10C8,10 10,12 12,12C14,12 16,10 16,10C16,10 18,12 18,12C18,12 20,10 20,10C20,10 22,2 22,2Z" /></svg>
            </motion.div>
          ))}
        </>
      )}

      {theme === 'easter' && (
        <>
          <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-emerald-900/30 to-transparent"></div>
          <EasterEgg x="10%" color="#f472b6" rotation={-15} />
          <EasterEgg x="90%" color="#60a5fa" rotation={10} />
          {[...Array(15)].map((_, i) => (
            <motion.div key={i} className="absolute rounded-full opacity-50 blur-[1px]"
                initial={{ x: Math.random()*window.innerWidth, y: window.innerHeight+10 }}
                animate={{ y: -20, rotate: 360 }}
                transition={{ duration: 10, delay: Math.random()*5 }}
                style={{ width: 6, height: 6, backgroundColor: ['#f472b6', '#34d399'][i%2] }} />
          ))}
        </>
      )}
    </div>
  );
};