import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { CITY_DATABASE, mockHistoryList } from '../constants/cities';

export default function useJofynEngine() {
  const { t } = useTranslation();
  const [view, setView] = useState('new'); 
  const [history, setHistory] = useState(mockHistoryList);
  const [currentData, setCurrentData] = useState([]);
  const [currentTitle, setCurrentTitle] = useState('');
  
  // -- Mobile Sidebar State & Active History Tracker --
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedHistoryId, setSelectedHistoryId] = useState(null);

  // -- Core Form States --
  const [file, setFile] = useState(null);
  const [locations, setLocations] = useState([]);
  const [locInput, setLocInput] = useState('');
  const [showLocDropdown, setShowLocDropdown] = useState(false);
  const locRef = useRef(null);

  const [dateOption, setDateOption] = useState('all_time');
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [customDate, setCustomDate] = useState({ start: '', end: '' });
  const dateRef = useRef(null);

  const [logs, setLogs] = useState([]);
  const [progress, setProgress] = useState(0);

  const [showModal, setShowModal] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState(null);

  // --- DYNAMIC FAVICON & TAB TITLE ---
  useEffect(() => {
    document.title = "JOFYN - Auto Scout Engine";

    const svgIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="#6d28d9" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="20" height="20" rx="5" fill="#ffffff" fill-opacity="0.9" stroke="#6d28d9" stroke-width="1.25" />
      <path d="M6.5 9l2.5 3-2.5 3" />
      <path d="M10 15h3.5" />
      <path d="M16.5 9v6" />
      <path d="M14.5 12h4" />
    </svg>`;
    
    const blob = new Blob([svgIcon], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.href = url;

    return () => URL.revokeObjectURL(url);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (locRef.current && !locRef.current.contains(event.target)) setShowLocDropdown(false);
      if (dateRef.current && !dateRef.current.contains(event.target)) setShowDateDropdown(false);
      if (openDropdownId !== null) setOpenDropdownId(null);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openDropdownId]);

  const filteredCities = CITY_DATABASE.filter(city => 
    city.toLowerCase().includes(locInput.toLowerCase()) && !locations.includes(city)
  );

  const addLocation = (city) => {
    if (locations.length < 5) {
      setLocations([...locations, city]);
      setLocInput('');
      setShowLocDropdown(false);
    }
  };

  const removeLocation = (cityToRemove) => {
    setLocations(locations.filter(city => city !== cityToRemove));
  };

  const startScraping = async (e) => {
    e.preventDefault();
    if (!file) return setShowModal(true);
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const uploadRes = await axios.post('http://localhost:5000/api/upload', formData);
      const { keywords } = uploadRes.data;

      await axios.post('http://localhost:5000/api/start', {
        keywords,
        locations,
        targets: ['Glints', 'Jobstreet', 'KitaLulus', 'Tech in Asia', 'Pintarnya', 'LinkedIn']
      });

      setView('scraping');
      pollStatus();
    } catch (err) {
      console.error("Error starting process:", err);
      alert("Failed to connect to backend engine.");
    }
  };

  const pollStatus = () => {
    const interval = setInterval(async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/status');
        const { status, progress, logs, results } = res.data;
        
        setLogs(logs);
        setProgress(progress);

        if (status === 'completed') {
          clearInterval(interval);
          setTimeout(() => {
            setCurrentData(results);
            setCurrentTitle(t('results_dashboard'));
            setView('results');
            refreshHistory();
          }, 1000);
        } else if (status === 'error') {
          clearInterval(interval);
          alert("An error occurred during scraping.");
        }
      } catch (err) {
        clearInterval(interval);
      }
    }, 1000);
  };

  const refreshHistory = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/history');
      setHistory(res.data);
    } catch (err) {
      console.error("Error fetching history:", err);
    }
  };

  useEffect(() => {
    refreshHistory();
  }, []);

  const loadHistory = async (id, date) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/data/${id}`);
      setCurrentData(res.data);
      setCurrentTitle(`${t('results_dashboard')}: ${date}`);
      setSelectedHistoryId(id);
      setView('results');
    } catch (err) {
      console.error("Error loading history item:", err);
    }
  };

  const handleOpenExcel = () => alert("Membuka aplikasi Excel...\nMenjalankan: `start excel /path/to/MasterData.xlsx`");
  const handleOpenFolder = () => alert("Membuka Folder Explorer...\nMenjalankan: `explorer .\\data\\`");

  const handleStatusChange = (e, jobId, newStatus) => {
    e.stopPropagation();
    setCurrentData(currentData.map(job => job.id === jobId ? { ...job, status: newStatus } : job));
    setOpenDropdownId(null); 
  };

  const getMostFrequentLocation = () => {
    if (currentData.length === 0) return '-';
    const counts = {};
    currentData.forEach(job => counts[job.location] = (counts[job.location] || 0) + 1);
    return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
  };

  return {
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
  };
}
