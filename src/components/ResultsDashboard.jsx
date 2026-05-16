import React from 'react';
import { useTranslation } from 'react-i18next';
import { IconLocation, IconChevronDown } from './Icons';

export default function ResultsDashboard({
  currentTitle,
  currentData,
  getMostFrequentLocation,
  openDropdownId,
  setOpenDropdownId,
  handleStatusChange
}) {
  const { t } = useTranslation();

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto animate-fadeIn">
      <div className="mb-8 glass-panel p-6 rounded-3xl border-white/60">
        <h2 className="text-3xl font-extrabold text-violet-950 mb-2 tracking-tight">{currentTitle}</h2>
        <p className="text-violet-700 font-medium">{t('displaying_results')}</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass-panel border-white/60 p-5 rounded-2xl shadow-sm">
          <p className="text-violet-600 text-xs font-extrabold uppercase tracking-wider">{t('total_jobs')}</p>
          <p className="text-4xl font-black text-violet-950 mt-2">{currentData.length}</p>
        </div>
        <div className="glass-panel border-white/60 p-5 rounded-2xl shadow-sm">
          <p className="text-violet-600 text-xs font-extrabold uppercase tracking-wider">{t('top_platform')}</p>
          <p className="text-2xl font-black text-fuchsia-600 mt-2">Glints</p>
        </div>
        <div className="glass-panel border-white/60 p-5 rounded-2xl shadow-sm">
          <p className="text-violet-600 text-xs font-extrabold uppercase tracking-wider">{t('top_location')}</p>
          <div className="flex items-center mt-2">
            <IconLocation />
            <p className="text-2xl font-black text-violet-900">{getMostFrequentLocation()}</p>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="glass-panel border-white/60 rounded-3xl overflow-hidden shadow-xl pb-10">
        <div className="overflow-x-auto min-h-[300px]">
          <table className="w-full text-left text-sm text-violet-900">
            <thead className="bg-white/40 text-violet-700 uppercase text-[10px] font-black tracking-widest border-b border-white/50">
              <tr>
                <th className="px-5 py-5">{t('company')}</th>
                <th className="px-5 py-5">{t('role')}</th>
                <th className="px-5 py-5">{t('salary')}</th>
                <th className="px-5 py-5">{t('location')}</th>
                <th className="px-5 py-5">{t('type')}</th>
                <th className="px-5 py-5">{t('source')}</th>
                <th className="px-5 py-5 text-center">{t('status')}</th>
                <th className="px-5 py-5 text-center">{t('scraping_date')}</th>
                <th className="px-5 py-5 text-center">{t('action')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/40">
              {currentData.map(job => (
                <tr key={job.id} className="hover:bg-white/30 transition-colors">
                  <td className="px-5 py-4 text-violet-900">{job.company}</td>
                  <td className="px-5 py-4 text-violet-900">{job.role}</td>
                  <td className="px-5 py-4 text-violet-900">{job.salary}</td>
                  <td className="px-5 py-4 text-violet-900">{job.location}</td>
                  <td className="px-5 py-4">
                    <span className="px-2 py-1 text-[10px] uppercase bg-white/60 text-violet-900 rounded-md shadow-sm border border-white/50">
                      {job.type}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="px-2.5 py-1 text-[11px] rounded-md border shadow-sm whitespace-nowrap bg-white/60 text-violet-900 border-white/50">
                      {job.platform}
                    </span>
                  </td>
                  
                  <td className="px-5 py-4 text-center relative">
                    <button onClick={(e) => { e.stopPropagation(); setOpenDropdownId(openDropdownId === job.id ? null : job.id); }}
                      className={`flex items-center justify-between w-[135px] px-3 py-2 text-[11px] border rounded-xl transition-all focus:outline-none mx-auto shadow-sm backdrop-blur-sm ${
                        job.status === 'Belum Lamar' ? 'bg-red-100/80 border-red-200 text-red-700 hover:bg-red-200/80' :
                        job.status === 'Sudah Lamar' ? 'bg-yellow-100/80 border-yellow-200 text-yellow-700 hover:bg-yellow-200/80' :
                        'bg-green-100/80 border-green-200 text-green-700 hover:bg-green-200/80'
                      }`}
                    >
                      <span className="truncate mr-1">{t(job.status.toLowerCase().replace(/ /g, '_')) || job.status}</span>
                      <IconChevronDown />
                    </button>

                    {openDropdownId === job.id && (
                      <div className="absolute z-50 left-1/2 -translate-x-1/2 mt-1.5 w-44 glass-panel border border-white/60 rounded-2xl shadow-xl overflow-hidden animate-fadeIn py-1" onClick={(e) => e.stopPropagation()}>
                        {['Belum Lamar', 'Sudah Lamar', 'Offering Terpanggil'].map((statusOption) => (
                          <button key={statusOption} onClick={(e) => handleStatusChange(e, job.id, statusOption)}
                            className={`w-full text-left px-4 py-2.5 text-[11px] transition-colors ${job.status === statusOption ? 'bg-white/60 text-violet-900' : 'text-violet-700 hover:bg-white/40 hover:text-violet-900'}`}
                          >
                            {t(statusOption.toLowerCase().replace(/ /g, '_')) || statusOption}
                          </button>
                        ))}
                      </div>
                    )}
                  </td>

                  <td className="px-5 py-4 text-center text-[11px] font-mono text-violet-900">
                    {job.date}
                  </td>

                  <td className="px-5 py-4 text-center">
                    <button className="px-3.5 py-1.5 bg-white/60 border border-white/50 text-violet-900 rounded-xl hover:bg-fuchsia-500 hover:text-white hover:border-fuchsia-400 transition-all text-xs whitespace-nowrap shadow-sm">
                      {t('open_link')}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
