import React, { useState, useEffect } from 'react';
import { AreaChart, Area, ResponsiveContainer, Tooltip, YAxis, CartesianGrid } from 'recharts';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface DataPoint {
  download: number;
  upload: number;
}

const TrafficGraph = ({ downloadSpeed, uploadSpeed }: { downloadSpeed: number, uploadSpeed: number }) => {
  // Buffer de date
  const [data, setData] = useState<DataPoint[]>(Array(30).fill({ download: 0, upload: 0 }));

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => {
        const newPoint = {
            download: downloadSpeed,
            upload: uploadSpeed
        };
        // Mentinem ultimele 30 puncte
        const newData = [...prev.slice(1), newPoint];
        return newData;
      });
    }, 500); // Update la 0.5s pentru fluiditate vizuala

    return () => clearInterval(interval);
  }, [downloadSpeed, uploadSpeed]);

  return (
    <div className="w-full h-48 mt-6 relative bg-black/20 rounded-xl border border-white/5 backdrop-blur-sm overflow-hidden shadow-inner flex flex-col">

      {/* Header Simplu: Doar Viteza Curenta */}
      <div className="flex justify-between items-center px-4 py-2  bg-white/1">
          <div className="flex gap-6 text-[13px] font-bold font-mono uppercase tracking-widest w-full justify-center">
              <div className="flex items-center gap-2 text-emerald-400">
                  <ArrowDown className="w-3 h-3" />
                  <span>Download: {downloadSpeed.toFixed(0)} KB/s</span>
              </div>
              <div className="flex items-center gap-2 text-purple-400">
                  <ArrowUp className="w-3 h-3" />
                  <span>Upload: {uploadSpeed.toFixed(0)} KB/s</span>
              </div>
          </div>
      </div>

      <div className="flex-1 w-full min-h-0 relative">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorDownload" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorUpload" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.03)" vertical={false} />

              {/* Domain 'auto' este CHEIA: Graficul se intinde cat e valoarea maxima */}
              <YAxis domain={[0, 'auto']} hide />

              <Tooltip
                contentStyle={{ backgroundColor: 'rgba(24, 24, 27, 0.95)', borderColor: '#333', borderRadius: '8px', fontSize: '12px' }}
                itemStyle={{ padding: 0 }}
                labelStyle={{ display: 'none' }}
                formatter={(value: number) => [`${value.toFixed(0)} KB/s`]}
                animationDuration={100}
              />

              <Area
                type="monotone"
                dataKey="download"
                stroke="#10b981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorDownload)"
                isAnimationActive={true}
                animationDuration={300}
              />
              <Area
                type="monotone"
                dataKey="upload"
                stroke="#8b5cf6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorUpload)"
                isAnimationActive={true}
                animationDuration={300}
              />
            </AreaChart>
          </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TrafficGraph;
