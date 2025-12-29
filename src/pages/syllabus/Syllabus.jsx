import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Search, Loader2, FileX } from 'lucide-react';

// API & Utils
import { fetchAllSyllabus } from '../../services/homeService'; // Ensure this exists
import { getSecureHeaders } from '../../utils/security';
import { API_ENDPOINTS } from '../../config/apiConfig';

// Components
import SyllabusCard from './components/SyllabusCard';
import CategoryFilter from './components/CategoryFilter';
import CustomAlert from '../../components/ui/CustomAlert';

const Syllabus = ({ onBack }) => {
  const [allFiles, setAllFiles] = useState([]);
  const [filteredFiles, setFilteredFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  
  const [alert, setAlert] = useState(null);

  // 1. Initial Load
  useEffect(() => {
    const loadData = async () => {
        const data = await fetchAllSyllabus();
        setAllFiles(data);
        setFilteredFiles(data); // Initialize filtered list
        setLoading(false);
    };
    loadData();
  }, []);

  // 2. Filter Logic
  useEffect(() => {
    let result = allFiles;

    if (activeCategory !== "All") {
        result = result.filter(f => f.category === activeCategory);
    }

    if (searchQuery) {
        result = result.filter(f => f.title.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    setFilteredFiles(result);
  }, [searchQuery, activeCategory, allFiles]);

  // 3. Handle Download (Send via Bot)
  const handleDownload = async (file) => {
      const storedUser = JSON.parse(localStorage.getItem('usg_user') || '{}');
      const token = localStorage.getItem('usg_token');

      if (!storedUser.tg_id) {
          setAlert({ message: "User not identified", type: "error" });
          return false;
      }

      try {
          const response = await fetch(API_ENDPOINTS.SEND_SYLLABUS, {
              method: 'POST',
              headers: {
                  ...getSecureHeaders(),
                  'Authorization': `Bearer ${token}`,
                  'X-User-ID': storedUser.tg_id,
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                  file_url: file.url,
                  file_name: file.title
              })
          });

          const data = await response.json();

          if (response.ok && data.STATUS_CODE === 200) {
              setAlert({ message: "Sent to Telegram Chat! 📩", type: "success" });
              if(window.Telegram?.WebApp?.HapticFeedback) {
                  window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
              }
              return true;
          } else {
              setAlert({ message: "Failed to send file", type: "error" });
              return false;
          }
      } catch (error) {
          setAlert({ message: "Network Error", type: "error" });
          return false;
      }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 100 }}
      className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300"
    >
      {alert && <CustomAlert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}

      {/* --- HEADER --- */}
      <div className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-100 dark:border-slate-800 pb-2">
         <div className="px-5 pt-4 pb-2 flex items-center gap-4">
             <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-700 dark:text-white">
                 <ArrowLeft size={24} />
             </button>
             <h1 className="text-xl font-bold text-gray-800 dark:text-white">Syllabus</h1>
         </div>

         {/* Search Bar */}
         <div className="px-5 mb-2">
             <div className="relative">
                 <Search size={18} className="absolute left-3.5 top-3.5 text-gray-400" />
                 <input 
                    type="text" 
                    placeholder="Search subjects..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-100 dark:bg-slate-800 rounded-xl border-none outline-none text-sm font-semibold text-gray-700 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500/20 transition-all"
                 />
             </div>
         </div>

         {/* Categories */}
         <CategoryFilter activeCat={activeCategory} setCat={setActiveCategory} />
      </div>

      {/* --- CONTENT --- */}
      <div className="px-5 pt-4 pb-10 space-y-3 min-h-[50vh]">
          {loading ? (
             <div className="flex flex-col items-center justify-center pt-20 text-gray-400">
                 <Loader2 className="animate-spin mb-2" size={32} />
                 <p className="text-xs">Loading Syllabus...</p>
             </div>
          ) : filteredFiles.length > 0 ? (
             <AnimatePresence>
                 {filteredFiles.map((file) => (
                     <SyllabusCard key={file.id} data={file} onDownload={handleDownload} />
                 ))}
             </AnimatePresence>
          ) : (
             <div className="flex flex-col items-center justify-center pt-20 text-gray-400">
                 <FileX size={48} className="mb-3 opacity-50" />
                 <h3 className="font-bold text-gray-500 dark:text-gray-300">No Syllabus Found</h3>
                 <p className="text-xs">Try searching for something else</p>
             </div>
          )}
      </div>
    </motion.div>
  );
};

export default Syllabus;
