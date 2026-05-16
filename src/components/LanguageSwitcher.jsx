import React from 'react';
import { useTranslation } from 'react-i18next';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'id' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <button 
      onClick={toggleLanguage}
      className="flex items-center px-3 py-1.5 bg-white/40 hover:bg-white/60 border border-white/50 rounded-lg text-xs font-bold text-violet-800 transition-all shadow-sm"
    >
      <span className="mr-1.5">🌐</span>
      {i18n.language === 'en' ? 'EN' : 'ID'}
    </button>
  );
}
