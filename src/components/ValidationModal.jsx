import React from 'react';
import { useTranslation } from 'react-i18next';
import { IconClose } from './Icons';

export default function ValidationModal({ isOpen, onClose }) {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-violet-950/20 backdrop-blur-sm animate-fadeIn" onClick={onClose}>
      <div className="glass-panel p-6 rounded-3xl max-w-sm w-full mx-4 relative border-white/60 shadow-[0_8px_32px_0_rgba(192,132,252,0.2)]" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-violet-400 hover:text-violet-700 transition-colors">
          <IconClose />
        </button>
        <div className="flex items-center mb-4">
          <div className="bg-red-100/50 p-2 rounded-full mr-3 border border-red-200/50">
            <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
          </div>
          <h3 className="text-xl font-bold text-violet-950">{t('file_required_title')}</h3>
        </div>
        <p className="text-violet-700 text-sm mb-6">{t('file_required_desc')}</p>
        <button onClick={onClose} className="w-full py-2.5 bg-white/60 hover:bg-white/90 text-violet-800 font-bold rounded-xl transition-all shadow-sm border border-white">
          {t('understand')}
        </button>
      </div>
    </div>
  );
}
