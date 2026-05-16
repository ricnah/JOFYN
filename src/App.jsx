import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import Sidebar from './components/Sidebar';
import TaskForm from './components/TaskForm';
import ScrapingTerminal from './components/ScrapingTerminal';
import ResultsDashboard from './components/ResultsDashboard';
import { IconLogo, IconMenu, IconClose } from './components/Icons';

// --- MOCK DATA ---
const mockHistoryList = [
  { id: 'json_20260429', date: '29 April 2026', total: 112 },
  { id: 'json_20260420', date: '20 April 2026', total: 85 },
];

const mockPastData = {
  json_20260429: [
    { id: 1, company: 'PT. Tech Indo', role: 'Backend Developer (Python)', salary: 'Rp 8.000.000 - 12.000.000', location: 'Jakarta Selatan', type: 'WFO', platform: 'Glints', date: '29-04-2026', status: 'Belum Lamar' },
    { id: 2, company: 'Startup Kreatif', role: 'Fullstack Engineer', salary: 'Rahasia', location: 'Bandung (Remote)', type: 'WFH', platform: 'Tech In Asia', date: '29-04-2026', status: 'Sudah Lamar' },
    { id: 5, company: 'Unicorn Corp', role: 'Data Analyst', salary: 'Rp 10.000.000+', location: 'Jakarta Selatan', type: 'Hybrid', platform: 'LinkedIn', date: '29-04-2026', status: 'Offering Terpanggil' },
  ],
  json_20260420: [
    { id: 3, company: 'Bank Sentral', role: 'IT Support', salary: 'Rp 6.000.000', location: 'Surabaya', type: 'WFO', platform: 'Jobstreet', date: '20-04-2026', status: 'Belum Lamar' },
    { id: 6, company: 'Retail Maju', role: 'Digital Marketer', salary: 'Rp 5.500.000', location: 'Surabaya', type: 'WFO', platform: 'Pintarnya', date: '20-04-2026', status: 'Belum Lamar' },
  ]
};

const CITY_DATABASE = [
  'Provinsi Nanggroe Aceh Darussalam', 'Provinsi Sumatera Utara', 'Provinsi Sumatera Barat', 'Provinsi Riau', 'Provinsi Kepulauan Riau', 'Provinsi Jambi', 'Provinsi Sumatera Selatan', 'Provinsi Kepulauan Bangka Belitung', 'Provinsi Bengkulu', 'Provinsi Lampung', 'Provinsi DKI Jakarta', 'Provinsi Banten', 'Provinsi Jawa Barat', 'Provinsi Jawa Tengah', 'Provinsi DI Yogyakarta', 'Provinsi Jawa Timur', 'Provinsi Bali', 'Provinsi Nusa Tenggara Barat', 'Provinsi Nusa Tenggara Timur', 'Provinsi Kalimantan Barat', 'Provinsi Kalimantan Tengah', 'Provinsi Kalimantan Selatan', 'Provinsi Kalimantan Timur', 'Provinsi Kalimantan Utara', 'Provinsi Sulawesi Utara', 'Provinsi Gorontalo', 'Provinsi Sulawesi Tengah', 'Provinsi Sulawesi Barat', 'Provinsi Sulawesi Selatan', 'Provinsi Sulawesi Tenggara', 'Provinsi Maluku', 'Provinsi Maluku Utara', 'Provinsi Papua', 'Provinsi Papua Barat', 'Provinsi Papua Selatan', 'Provinsi Papua Tengah', 'Provinsi Papua Pegunungan', 'Provinsi Papua Barat Daya',
  'Jakarta Pusat', 'Jakarta Selatan', 'Jakarta Barat', 'Jakarta Timur', 'Jakarta Utara', 'Kepulauan Seribu', 'Kota Bogor', 'Kab. Bogor', 'Kota Depok', 'Kota Tangerang', 'Kota Tangerang Selatan', 'Kab. Tangerang', 'Kota Bekasi', 'Kab. Bekasi', 'Kota Serang', 'Kab. Serang', 'Kota Cilegon', 'Kab. Lebak', 'Kab. Pandeglang',
  'Kota Bandung', 'Kab. Bandung', 'Kab. Bandung Barat', 'Kota Cimahi', 'Kota Sukabumi', 'Kab. Sukabumi', 'Kota Cirebon', 'Kab. Cirebon', 'Kota Tasikmalaya', 'Kab. Tasikmalaya', 'Kota Banjar', 'Kab. Garut', 'Kab. Ciamis', 'Kab. Pangandaran', 'Kab. Kuningan', 'Kab. Majalengka', 'Kab. Sumedang', 'Kab. Indramayu', 'Kab. Subang', 'Kab. Purwakarta', 'Kab. Karawang', 'Kab. Cianjur',
  'Kota Semarang', 'Kab. Semarang', 'Kota Salatiga', 'Kota Magelang', 'Kab. Magelang', 'Kota Surakarta (Solo)', 'Kab. Boyolali', 'Kab. Klaten', 'Kab. Sukoharjo', 'Kab. Wonogiri', 'Kab. Karanganyar', 'Kab. Sragen', 'Kab. Grobogan', 'Kab. Blora', 'Kab. Rembang', 'Kab. Pati', 'Kab. Kudus', 'Kab. Jepara', 'Kab. Demak', 'Kab. Temanggung', 'Kab. Wonosobo', 'Kab. Purworejo', 'Kab. Kebumen', 'Kab. Cilacap', 'Kab. Banyumas (Purwokerto)', 'Kab. Purbalingga', 'Kab. Banjarnegara', 'Kota Tegal', 'Kab. Tegal', 'Kab. Brebes', 'Kab. Pemalang', 'Kota Pekalongan', 'Kab. Pekalongan', 'Kab. Batang', 'Kab. Kendal', 'Kota Yogyakarta', 'Kab. Sleman', 'Kab. Bantul', 'Kab. Gunungkidul', 'Kab. Kulon Progo',
  'Kota Surabaya', 'Kab. Sidoarjo', 'Kab. Gresik', 'Kab. Mojokerto', 'Kota Mojokerto', 'Kab. Jombang', 'Kab. Bojonegoro', 'Kab. Tuban', 'Kab. Lamongan', 'Kota Madiun', 'Kab. Madiun', 'Kab. Ngawi', 'Kab. Magetan', 'Kab. Ponorogo', 'Kab. Pacitan', 'Kota Kediri', 'Kab. Kediri', 'Kab. Nganjuk', 'Kab. Trenggalek', 'Kab. Tulungagung', 'Kota Blitar', 'Kab. Blitar', 'Kota Malang', 'Kab. Malang', 'Kota Batu', 'Kab. Lumajang', 'Kab. Jember', 'Kab. Banyuwangi', 'Kab. Bondowoso', 'Kab. Situbondo', 'Kota Probolinggo', 'Kab. Probolinggo', 'Kota Pasuruan', 'Kab. Pasuruan', 'Kab. Bangkalan', 'Kab. Sampang', 'Kab. Pamekasan', 'Kab. Sumenep',
  'Kota Banda Aceh', 'Kota Medan', 'Kab. Deli Serdang', 'Kota Pematangsiantar', 'Kota Binjai', 'Kota Padang', 'Kota Bukittinggi', 'Kota Pekanbaru', 'Kota Dumai', 'Kota Batam', 'Kota Tanjungpinang', 'Kota Jambi', 'Kota Palembang', 'Kab. Banyuasin', 'Kota Pangkalpinang', 'Kota Bengkulu', 'Kota Bandar Lampung', 'Kota Metro',
  'Kota Pontianak', 'Kota Singkawang', 'Kota Palangka Raya', 'Kota Banjarmasin', 'Kota Banjarbaru', 'Kota Balikpapan', 'Kota Samarinda', 'Kota Bontang', 'Kota Tarakan', 'Kab. Kutai Kartanegara',
  'Kota Makassar', 'Kab. Gowa', 'Kab. Maros', 'Kota Parepare', 'Kota Palopo', 'Kota Manado', 'Kota Bitung', 'Kota Tomohon', 'Kota Gorontalo', 'Kota Palu', 'Kota Kendari', 'Kota Bau-Bau',
  'Kota Denpasar', 'Kab. Badung', 'Kab. Gianyar', 'Kab. Buleleng (Singaraja)', 'Kab. Tabanan', 'Kota Mataram', 'Kab. Lombok Barat', 'Kab. Lombok Tengah', 'Kab. Lombok Timur', 'Kota Kupang', 'Kab. Manggarai Barat (Labuan Bajo)',
  'Kota Ambon', 'Kota Ternate', 'Kota Jayapura', 'Kab. Jayapura', 'Kab. Mimika (Timika)', 'Kab. Merauke', 'Kota Sorong', 'Kab. Manokwari',
  'Remote', 'Work From Anywhere (WFA)'
];

export default function App() {
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

  const [dateOption, setDateOption] = useState('Semua Waktu');
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

  // --- NEURON CANVAS ANIMATION ---
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];
    
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      const numParticles = Math.floor((canvas.width * canvas.height) / 12000);
      for (let i = 0; i < numParticles; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.7,
          vy: (Math.random() - 0.5) * 0.7,
          radius: Math.random() * 2 + 1
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let i = 0; i < particles.length; i++) {
        let p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.fill();
        
        for (let j = i + 1; j < particles.length; j++) {
          let p2 = particles[j];
          let dist = Math.sqrt(Math.pow(p.x - p2.x, 2) + Math.pow(p.y - p2.y, 2));
          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${1 - dist / 130})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }
      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resize);
    resize();
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
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
    
    // 1. Upload File
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const uploadRes = await axios.post('http://localhost:5000/api/upload', formData);
      const { keywords } = uploadRes.data;

      // 2. Start Scraping
      await axios.post('http://localhost:5000/api/start', {
        keywords,
        locations,
        targets: ['Glints', 'Jobstreet', 'KitaLulus', 'Tech in Asia', 'Pintarnya', 'LinkedIn'] // Use all by default or get from state
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

  return (
    <div className="h-screen relative overflow-hidden flex flex-col md:flex-row">
      
      {/* 1. MESH & NEURON BACKGROUND LAYER */}
      <div className="absolute inset-0 -z-20 bg-[#EBD6FB] overflow-hidden">
        <div className="mesh-blob blob-1"></div>
        <div className="mesh-blob blob-2"></div>
        <div className="mesh-blob blob-3"></div>
      </div>
      <canvas ref={canvasRef} className="absolute inset-0 -z-10 w-full h-full pointer-events-none opacity-60"></canvas>

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
      {showModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-violet-950/20 backdrop-blur-sm animate-fadeIn" onClick={() => setShowModal(false)}>
          <div className="glass-panel p-6 rounded-3xl max-w-sm w-full mx-4 relative border-white/60 shadow-[0_8px_32px_0_rgba(192,132,252,0.2)]" onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-violet-400 hover:text-violet-700 transition-colors">
              <IconClose />
            </button>
            <div className="flex items-center mb-4">
              <div className="bg-red-100/50 p-2 rounded-full mr-3 border border-red-200/50">
                <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
              </div>
              <h3 className="text-xl font-bold text-violet-950">{t('file_required_title')}</h3>
            </div>
            <p className="text-violet-700 text-sm mb-6">{t('file_required_desc')}</p>
            <button onClick={() => setShowModal(false)} className="w-full py-2.5 bg-white/60 hover:bg-white/90 text-violet-800 font-bold rounded-xl transition-all shadow-sm border border-white">{t('understand')}</button>
          </div>
        </div>
      )}

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
