import React from 'react';
import { useTranslation } from 'react-i18next';

export default function ScrapingTerminal({ progress, logs }) {
  const { t } = useTranslation();

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto animate-fadeIn h-full flex flex-col">
      <h2 className="text-2xl font-extrabold text-violet-950 mb-6 animate-pulse">{t('running_scraper')}</h2>
      
      <div className="mb-5 glass-panel p-4 rounded-2xl border-white/60">
         <div className="flex justify-between text-sm font-extrabold text-violet-800 mb-2">
           <span>{t('overall_progress')}</span>
           <span>{progress}%</span>
         </div>
         <div className="w-full bg-white/40 rounded-full h-3 overflow-hidden shadow-inner">
           <div className="bg-gradient-to-r from-violet-400 to-fuchsia-400 h-3 transition-all duration-500 ease-out" style={{ width: `${progress}%` }}></div>
         </div>
      </div>

      <div className="flex-grow bg-violet-950/80 backdrop-blur-2xl rounded-3xl border border-violet-800/50 p-6 font-mono text-sm overflow-y-auto shadow-2xl relative">
        {logs.map((log, index) => (
          <div key={index} className="mb-1.5 text-violet-300">
            <span className="text-fuchsia-400 mr-2 font-bold opacity-80">[{new Date().toLocaleTimeString('id-ID', {hour12:false})}]</span>
            <span className={log.includes('[SYSTEM]') ? 'text-fuchsia-300 font-bold' : ''}>{log}</span>
          </div>
        ))}
        {progress < 100 && <div className="text-fuchsia-400 mt-2 animate-pulse font-bold">_</div>}
      </div>
    </div>
  );
}
