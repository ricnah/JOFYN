import React from 'react';
import { useTranslation } from 'react-i18next';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const isEn = i18n.language && i18n.language.startsWith('en');

  const setLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };

  return (
    <div className="flex items-center bg-white/45 border border-white/60 rounded-xl p-0.5 shadow-sm shrink-0">
      <div className="flex space-x-0.5">
        <button
          type="button"
          onClick={() => setLanguage('id')}
          className={`px-3 py-1 text-[10px] font-extrabold rounded-lg transition-all duration-200 ${
            !isEn 
              ? 'bg-violet-600 text-white shadow-md' 
              : 'text-violet-700 hover:bg-white/40 hover:text-violet-900'
          }`}
        >
          ID
        </button>
        <button
          type="button"
          onClick={() => setLanguage('en')}
          className={`px-3 py-1 text-[10px] font-extrabold rounded-lg transition-all duration-200 ${
            isEn 
              ? 'bg-violet-600 text-white shadow-md' 
              : 'text-violet-700 hover:bg-white/40 hover:text-violet-900'
          }`}
        >
          EN
        </button>
      </div>
    </div>
  );
}
