import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ChevronRight, AlertCircle, X, RefreshCcw, FolderOpen } from 'lucide-react';

// Services & Components
import { fetchStudyContent, sendFileViaBot } from '../../services/studyService';
import FolderItem from './components/FolderItem';
import FileItem from './components/FileItem';

// ==========================================
// 💀 SKELETON LOADER (YouTube Style)
// ==========================================
const SkeletonLoader = () => (
  <div className="grid grid-cols-2 gap-3 animate-pulse">
      {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-gray-100 dark:border-slate-700 h-32 flex flex-col justify-between">
              <div className="flex justify-between">
                  <div className="w-12 h-12 bg-gray-200 dark:bg-slate-700 rounded-xl"></div>
                  <div className="w-8 h-6 bg-gray-200 dark:bg-slate-700 rounded-full"></div>
              </div>
              <div className="space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-full"></div>
              </div>
          </div>
      ))}
  </div>
);

// ==========================================
// 🍞 CUSTOM TOAST (For Success/Error)
// ==========================================
const Toast = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 4000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <motion.div 
            initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }}
            className={`fixed bottom-20 left-1/2 -translate-x-1/2 z-[100] px-5 py-3 rounded-full shadow-2xl flex items-center gap-3 min-w-[200px] whitespace-nowrap backdrop-blur-md
            ${type === 'error' ? 'bg-red-600/90 text-white' : 'bg-green-600/90 text-white'}`}
        >
            <span className="text-xs font-bold">{message}</span>
        </motion.div>
    );
};

// ==========================================
// 🚀 MAIN COMPONENT
// ==========================================
const StudyMaterial = ({ onBack }) => {
  const [loading, setLoading] = useState(true);
  const [errorState, setErrorState] = useState(false); // Full screen error
  const [toast, setToast] = useState(null);            // Popup msg { msg, type }
  
  const [path, setPath] = useState([{ id: null, name: 'Materials' }]); 
  const [contents, setContents] = useState([]); 
  
  const user = JSON.parse(localStorage.getItem('usg_user') || '{}');

  // --- 1. LOAD CONTENT ---
  const loadContent = async (parentId = null) => {
    setLoading(true);
    setErrorState(false);
    
    // API Call
    const result = await fetchStudyContent(user.collegeCode, user.courseId, parentId);
    
    if (result.success) {
        setContents(result.data);
    } else {
        setErrorState(true);
        setToast({ msg: result.message || "Failed to fetch data", type: 'error' });
        if(window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.notificationOccurred('error');
        }
    }
    setLoading(false);
  };

  // Initial Load
  useEffect(() => {
    loadContent(null);
  }, []);

  // --- 2. HANDLERS ---
  
  const handleFolderClick = (folder) => {
      setPath([...path, { id: folder.id, name: folder.name }]);
      loadContent(folder.id);
  };

  const handleBackNav = () => {
      if (path.length > 1) {
          const newPath = [...path];
          newPath.pop(); 
          setPath(newPath);
          const parent = newPath[newPath.length - 1];
          loadContent(parent.id);
      } else {
          onBack(); 
      }
  };

  // 🔥 CORE FIX: DOWNLOAD HANDLER
  const handleFileDownload = async (file) => {
      console.log("📥 Initiating Download for:", file.name);

      const token = localStorage.getItem('usg_token');
      // Reload user data to ensure tg_id is present
      const freshUser = JSON.parse(localStorage.getItem('usg_user') || '{}');
      
      if (!freshUser.tg_id) {
          setToast({ msg: "Telegram User ID Missing. Relogin.", type: 'error' });
          return false;
      }

      if (!file.url) {
          setToast({ msg: "File Link Not Available", type: 'error' });
          return false;
      }

      // API Call to Send File via Bot
      const success = await sendFileViaBot(file.url, file.name, freshUser.tg_id, token);
      
      if (success) {
          setToast({ msg: "Sent to Chat! Check Telegram 📩", type: 'success' });
          if(window.Telegram?.WebApp?.HapticFeedback) {
              window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
          }
          return true;
      } else {
          setToast({ msg: "Server failed to send file", type: 'error' });
          return false;
      }
  };

  // --- 3. HELPERS ---
  const folders = contents.filter(item => item.type === 'folder');
  const files = contents.filter(item => item.type === 'file');

  const renderBreadcrumbs = () => (
      <div className="flex items-center gap-1 overflow-x-auto whitespace-nowrap pb-2 no-scrollbar px-5">
          {path.map((p, idx) => (
              <div key={idx} className="flex items-center">
                  <span 
                    onClick={() => {
                        if(idx < path.length - 1) {
                            const newPath = path.slice(0, idx + 1);
                            setPath(newPath);
                            loadContent(p.id);
                        }
                    }}
                    className={`text-xs font-bold cursor-pointer transition-colors ${idx === path.length - 1 ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                      {p.name}
                  </span>
                  {idx < path.length - 1 && <ChevronRight size={12} className="text-gray-300 mx-1" />}
              </div>
          ))}
      </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }}
      className="min-h-screen bg-gray-50 dark:bg-slate-900 pb-20 transition-colors duration-300"
    >
      {/* Toast Notification */}
      <AnimatePresence>
          {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      </AnimatePresence>

      {/* --- HEADER --- */}
      <div className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-100 dark:border-slate-800 pb-2">
         <div className="px-5 pt-4 pb-2 flex items-center gap-4">
             <button onClick={handleBackNav} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-700 dark:text-white transition-colors">
                 <ArrowLeft size={24} />
             </button>
             <h1 className="text-xl font-bold text-gray-800 dark:text-white truncate">
                 {path.length === 1 ? "Study Resources" : path[path.length - 1].name}
             </h1>
         </div>
         {path.length > 1 && renderBreadcrumbs()}
      </div>

      {/* --- CONTENT AREA --- */}
      <div className="px-5 pt-4">
         
         {/* 1. LOADING STATE */}
         {loading && <SkeletonLoader />}

         {/* 2. ERROR STATE (Full Screen) */}
         {!loading && errorState && (
             <div className="flex flex-col items-center justify-center h-[60vh] text-center">
                 <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
                     <AlertCircle size={32} className="text-red-500" />
                 </div>
                 <h3 className="text-lg font-bold text-gray-800 dark:text-white">Unable to Load Data</h3>
                 <p className="text-sm text-gray-400 mb-6 max-w-[200px]">
                     Something went wrong while fetching study materials.
                 </p>
                 <button 
                    onClick={() => loadContent(path[path.length - 1].id)}
                    className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl font-bold shadow-lg active:scale-95 transition-transform"
                 >
                     <RefreshCcw size={18} /> Retry
                 </button>
             </div>
         )}

         {/* 3. SUCCESS STATE (Render Data) */}
         {!loading && !errorState && (
             <>
                 {contents.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-[50vh] opacity-50">
                        <FolderOpen size={48} className="text-gray-300 mb-2"/>
                        <p className="text-gray-400 text-sm">This folder is empty</p>
                    </div>
                 ) : (
                    <div className="space-y-6">
                        
                        {/* FOLDERS GRID */}
                        {folders.length > 0 && (
                            <div className="grid grid-cols-2 gap-3">
                                {folders.map((item) => (
                                    <FolderItem key={item.id} data={item} onClick={handleFolderClick} />
                                ))}
                            </div>
                        )}

                        {/* FILES LIST */}
                        {files.length > 0 && (
                            <div className="flex flex-col gap-2">
                                <h4 className="text-[10px] font-bold text-gray-400 uppercase mt-4 mb-1 pl-1">Documents</h4>
                                {files.map((item) => (
                                    <FileItem 
                                        key={item.id} 
                                        data={item} 
                                        onDownload={handleFileDownload} // ✅ FIX APPLIED HERE
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                 )}
             </>
         )}

      </div>
    </motion.div>
  );
};

export default StudyMaterial;
