import React from 'react';
import Sidebar from './Sidebar';
import TaskForm from './TaskForm';
import ScrapingTerminal from './ScrapingTerminal';
import ResultsDashboard from './ResultsDashboard';
import NeuronBackground from './NeuronBackground';
import ValidationModal from './ValidationModal';
import { IconLogo, IconMenu } from './Icons';
import useJofynEngine from '../hooks/useJofynEngine';

export default function DashboardLayout() {
  const {
    view, setView,
    history,
    currentData,
    currentTitle,
    isSidebarOpen, setIsSidebarOpen,
    selectedHistoryId, setSelectedHistoryId,
    file, setFile,
    locations,
    locInput, setLocInput,
    showLocDropdown, setShowLocDropdown,
    dateOption, setDateOption,
    showDateDropdown, setShowDateDropdown,
    customDate, setCustomDate,
    logs,
    progress,
    showModal, setShowModal,
    openDropdownId, setOpenDropdownId,
    locRef,
    dateRef,
    filteredCities,
    addLocation,
    removeLocation,
    startScraping,
    loadHistory,
    handleOpenFolder,
    handleOpenExcel,
    handleStatusChange,
    getMostFrequentLocation
  } = useJofynEngine();

  return (
    <div className="h-screen relative overflow-hidden flex flex-col md:flex-row">
      
      {/* 1. MESH & NEURON BACKGROUND LAYER */}
      <NeuronBackground />

      {/* MOBILE HEADER */}
      <div className="md:hidden flex items-center justify-between p-4 glass-panel border-b border-white/40 z-30 relative shrink-0">
        <h1 className="text-xl font-extrabold text-violet-900 flex items-center tracking-wide">
          <IconLogo />
          JOFYN
        </h1>
        <button onClick={() => setIsSidebarOpen(true)} className="text-violet-800 p-1.5 bg-white/40 rounded-lg border border-white/50 hover:bg-white/60 transition-colors">
          <IconMenu />
        </button>
      </div>

      {/* SIDEBAR OVERLAY */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-violet-950/20 backdrop-blur-sm z-40 md:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* 2. MODAL VALIDASI FILE */}
      <ValidationModal isOpen={showModal} onClose={() => setShowModal(false)} />

      {/* 3. SIDEBAR */}
      <Sidebar 
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        view={view}
        setView={setView}
        history={history}
        selectedHistoryId={selectedHistoryId}
        setSelectedHistoryId={setSelectedHistoryId}
        loadHistory={loadHistory}
        handleOpenFolder={handleOpenFolder}
        handleOpenExcel={handleOpenExcel}
      />

      {/* 4. MAIN CONTENT AREA */}
      <main className="flex-grow overflow-y-auto z-10 relative">
        {view === 'new' && (
          <TaskForm 
            file={file}
            setFile={setFile}
            dateOption={dateOption}
            setDateOption={setDateOption}
            showDateDropdown={showDateDropdown}
            setShowDateDropdown={setShowDateDropdown}
            customDate={customDate}
            setCustomDate={setCustomDate}
            locations={locations}
            addLocation={addLocation}
            removeLocation={removeLocation}
            locInput={locInput}
            setLocInput={setLocInput}
            showLocDropdown={showLocDropdown}
            setShowLocDropdown={setShowLocDropdown}
            filteredCities={filteredCities}
            startScraping={startScraping}
            dateRef={dateRef}
            locRef={locRef}
          />
        )}

        {view === 'scraping' && (
          <ScrapingTerminal progress={progress} logs={logs} />
        )}

        {view === 'results' && (
          <ResultsDashboard 
            currentTitle={currentTitle}
            currentData={currentData}
            getMostFrequentLocation={getMostFrequentLocation}
            openDropdownId={openDropdownId}
            setOpenDropdownId={setOpenDropdownId}
            handleStatusChange={handleStatusChange}
          />
        )}
      </main>
    </div>
  );
}
