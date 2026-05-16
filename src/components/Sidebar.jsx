import React from 'react';
import { useTranslation } from 'react-i18next';
import { IconLogo, IconClose, IconPlay, IconHistory, IconFolder, IconExcel } from './Icons';
import LanguageSwitcher from './LanguageSwitcher';

export default function Sidebar({ 
  isSidebarOpen, 
  setIsSidebarOpen, 
  view, 
  setView, 
  history, 
  selectedHistoryId, 
  setSelectedHistoryId,
  loadHistory,
  handleOpenFolder,
  handleOpenExcel
}) {
  const { t } = useTranslation();

  return (
    <aside className={`fixed inset-y-0 left-0 z-50 w-72 md:w-64 glass-panel border-r border-white/40 flex flex-col h-screen shrink-0 shadow-[4px_0_24px_0_rgba(192,132,252,0.1)] transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="p-5 border-b border-white/30 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-extrabold text-violet-900 flex items-center tracking-wide">
            <IconLogo />
            JOFYN
          </h1>
          <p className="text-[11px] font-bold text-violet-500 mt-1 uppercase tracking-wider">v1.0.0 beta</p>
        </div>
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-violet-500 hover:text-violet-800 bg-white/40 p-1.5 rounded-lg">
            <IconClose />
          </button>
        </div>
      </div>

      <div className="p-4 flex-grow overflow-y-auto">
        <button 
          onClick={() => { setView('new'); setIsSidebarOpen(false); setSelectedHistoryId(null); }} 
          className={`w-full flex items-center px-4 py-2.5 rounded-xl mb-6 transition-all font-semibold shadow-sm border ${view === 'new' || view === 'scraping' ? 'bg-violet-500/80 text-white border-violet-400 backdrop-blur-md shadow-violet-500/30' : 'bg-white/40 text-violet-700 hover:bg-white/70 border-white/50'}`}
        >
          <IconPlay /> {t('new_task')}
        </button>

        <h2 className="text-[10px] font-extrabold text-violet-500 uppercase tracking-widest mb-3 px-1">{t('local_database')}</h2>
        <ul className="space-y-1.5">
          {history.map(item => (
            <li key={item.id}>
              <button 
                onClick={() => { loadHistory(item.id, item.date); setIsSidebarOpen(false); setSelectedHistoryId(item.id); }} 
                className={`w-full text-left px-3 py-2 rounded-xl flex justify-between items-center group transition-all border ${selectedHistoryId === item.id ? 'bg-white/80 border-white shadow-sm' : 'border-transparent hover:bg-white/50 hover:border-white/60'}`}
              >
                <span className={`flex items-center text-sm font-bold truncate transition-colors ${selectedHistoryId === item.id ? 'text-violet-950' : 'text-violet-700 group-hover:text-violet-900'}`}>
                  <IconHistory /> <span className="truncate w-28">{item.date}</span>
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-md font-extrabold shrink-0 shadow-sm transition-colors ${selectedHistoryId === item.id ? 'bg-violet-100/80 text-violet-800 border border-violet-200' : 'bg-white/60 border border-white/40 text-violet-600'}`}>{item.total}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="p-4 border-t border-white/30 bg-white/20">
        <div className="mb-3">
          <p className="text-[10px] font-extrabold text-violet-500 uppercase tracking-widest mb-1.5 px-1">{t('local_storage')}</p>
          <button onClick={handleOpenFolder} className="flex items-center text-xs font-bold text-fuchsia-600 hover:text-fuchsia-700 hover:bg-white/60 bg-white/40 px-2.5 py-2 rounded-xl border border-white/50 w-full truncate transition-all text-left shadow-sm">
             <IconFolder /> ./data/ ({t('open_folder')})
          </button>
        </div>
        <button onClick={handleOpenExcel} className="w-full flex items-center justify-center px-4 py-2.5 bg-white/70 text-violet-800 border border-white/60 rounded-xl hover:bg-white transition-all text-sm font-bold shadow-sm shadow-violet-200/20">
          <IconExcel /> {t('open_excel')}
        </button>
        
        <div className="mt-4 text-center text-[10px] font-extrabold text-violet-500/70 tracking-wide">
          JOFYN Copyright by Ricki &copy; {new Date().getFullYear()}
        </div>
      </div>
    </aside>
  );
}
