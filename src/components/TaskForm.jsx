import React from 'react';
import { useTranslation } from 'react-i18next';
import { IconDoc, IconCalendar, IconChevronDown, IconLocation, IconPlay } from './Icons';

export default function TaskForm({
  file,
  setFile,
  dateOption,
  setDateOption,
  showDateDropdown,
  setShowDateDropdown,
  customDate,
  setCustomDate,
  locations,
  addLocation,
  removeLocation,
  locInput,
  setLocInput,
  showLocDropdown,
  setShowLocDropdown,
  filteredCities,
  startScraping,
  dateRef,
  locRef
}) {
  const { t } = useTranslation();

  return (
    <div className="h-full w-full overflow-y-auto flex items-start md:items-center justify-center p-4 md:p-8 animate-fadeIn">
      <div className="w-full max-w-4xl glass-panel p-6 md:p-8 rounded-3xl shadow-[0_8px_32px_0_rgba(192,132,252,0.15)] border-white/60">
        <h2 className="text-3xl font-extrabold text-violet-950 mb-2 tracking-tight">{t('config_title')}</h2>
        <p className="text-violet-600 font-medium mb-8">{t('config_desc')}</p>

        <form onSubmit={startScraping}>
          
          {/* Dropzone */}
          <div className="mb-6">
            <label className="block text-sm font-extrabold text-violet-900 mb-2">{t('input_cv')}</label>
            <label className={`mt-1 flex cursor-pointer justify-center px-6 pt-6 pb-7 border-2 border-dashed rounded-2xl transition-all ${file ? 'border-violet-400 bg-white/50' : 'border-violet-300/60 hover:border-violet-400 bg-white/30 hover:bg-white/40'}`}>
              <div className="space-y-1 text-center w-full">
                <IconDoc />
                <div className="flex text-sm justify-center font-bold text-violet-700">
                  <span className="relative rounded-md text-violet-700 hover:text-violet-900 underline decoration-violet-300 decoration-2 underline-offset-2">
                    <span>{file ? file.name : t('upload_file')}</span>
                    <input type="file" className="sr-only" accept=".doc,.docx" onChange={(e) => setFile(e.target.files[0])} />
                  </span>
                  <p className="pl-1 text-violet-500 no-underline">{file ? t('selected') : t('or_drag_drop')}</p>
                </div>
              </div>
            </label>
          </div>

          {/* Advanced Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            
            {/* Date Custom */}
            <div className="relative" ref={dateRef}>
              <label className="block text-sm font-extrabold text-violet-900 mb-2">{t('filter_date')}</label>
              <button type="button" onClick={() => setShowDateDropdown(!showDateDropdown)} className="w-full flex items-center justify-between px-4 py-3 bg-white/50 border border-white/60 rounded-xl text-sm font-bold text-violet-800 hover:bg-white/70 focus:outline-none transition-all shadow-sm">
                <span className="flex items-center"><IconCalendar /> {t(dateOption)}</span>
                <IconChevronDown />
              </button>
              
              {showDateDropdown && (
                <div className="absolute z-[40] mt-2 w-full bg-white/95 backdrop-blur-md border border-violet-100 rounded-2xl shadow-xl p-2 animate-fadeIn">
                  {['all_time', 'last_24h', 'last_week', 'last_month', 'custom_range'].map(opt => (
                    <button key={opt} type="button" onClick={() => { setDateOption(opt); if(opt !== 'custom_range') setShowDateDropdown(false); }} className={`w-full text-left px-3 py-2 text-sm font-bold rounded-xl mb-1 transition-all ${dateOption === opt ? 'bg-violet-200/60 text-violet-900' : 'text-violet-700 hover:bg-white/50'}`}>
                      {t(opt)}
                    </button>
                  ))}
                  {dateOption === 'custom_range' && (
                    <div className="mt-2 p-2.5 bg-white/40 rounded-xl border border-white/50 flex space-x-2 items-center">
                      <input type="text" placeholder={t('start_date')} className="w-1/2 bg-white/70 text-xs font-bold text-violet-900 border border-white/60 rounded-lg px-2.5 py-2 outline-none focus:border-violet-400 focus:bg-white shadow-sm" value={customDate.start} onChange={e=>setCustomDate({...customDate, start: e.target.value})} />
                      <span className="text-violet-500 font-bold">-</span>
                      <input type="text" placeholder={t('end_date')} className="w-1/2 bg-white/70 text-xs font-bold text-violet-900 border border-white/60 rounded-lg px-2.5 py-2 outline-none focus:border-violet-400 focus:bg-white shadow-sm" value={customDate.end} onChange={e=>setCustomDate({...customDate, end: e.target.value})} />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Location Autocomplete */}
            <div className="relative" ref={locRef}>
              <label className="block text-sm font-extrabold text-violet-900 mb-2">{t('filter_location')}</label>
              <div className="flex flex-wrap items-center bg-white/50 border border-white/60 rounded-xl p-2 focus-within:bg-white/70 transition-all min-h-[46px] shadow-sm">
                <IconLocation />
                {locations.map(loc => (
                  <span key={loc} className="flex items-center text-[11px] font-extrabold bg-violet-100/80 text-violet-800 border border-violet-200/60 rounded-lg px-2 py-1 m-0.5 shadow-sm">
                    {loc}
                    <button type="button" onClick={() => removeLocation(loc)} className="ml-1.5 text-violet-500 hover:text-violet-700 focus:outline-none">&times;</button>
                  </span>
                ))}
                {locations.length < 5 && (
                  <input 
                    type="text" 
                    placeholder={locations.length === 0 ? t('placeholder_city') : ""}
                    className="flex-grow bg-transparent text-sm font-bold text-violet-900 placeholder-violet-400 px-2 outline-none w-24"
                    value={locInput}
                    onChange={(e) => { setLocInput(e.target.value); setShowLocDropdown(true); }}
                    onFocus={() => setShowLocDropdown(true)}
                  />
                )}
              </div>
              
              {showLocDropdown && locInput && (
                <div className="absolute z-30 mt-2 w-full glass-panel border border-white/60 rounded-2xl shadow-xl max-h-56 overflow-y-auto animate-fadeIn py-1">
                  {filteredCities.length > 0 ? filteredCities.map(city => (
                    <button key={city} type="button" onClick={() => addLocation(city)} className="w-full text-left px-4 py-2.5 text-sm font-bold text-violet-700 hover:bg-white/60 hover:text-violet-950 transition-colors">
                      {city}
                    </button>
                  )) : (
                    <div className="px-4 py-3 text-sm text-violet-500 font-bold">{t('no_location')}</div>
                  )}
                </div>
              )}
            </div>

          </div>

          {/* Toggles Targets */}
          <div className="mb-8">
            <label className="block text-sm font-extrabold text-violet-900 mb-3">{t('choose_targets')}</label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {['Glints', 'Jobstreet', 'KitaLulus', 'Tech in Asia', 'Pintarnya', 'LinkedIn'].map(platform => (
                <label key={platform} className="flex items-center p-3 border border-white/50 rounded-xl cursor-pointer hover:bg-white/70 bg-white/40 transition-all shadow-sm">
                  <input type="checkbox" defaultChecked className="form-checkbox h-4 w-4 text-violet-500 border-violet-300 rounded focus:ring-violet-400/50" />
                  <span className="ml-2 text-xs font-extrabold text-violet-800 truncate">{platform}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end border-t border-white/40 pt-6">
            <button type="submit" className="flex items-center px-8 py-3.5 bg-violet-600/90 hover:bg-violet-600 backdrop-blur-md text-white rounded-2xl font-extrabold shadow-lg shadow-violet-500/30 transition-all transform hover:-translate-y-0.5 border border-violet-500/50">
              <IconPlay /> {t('run_engine')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
