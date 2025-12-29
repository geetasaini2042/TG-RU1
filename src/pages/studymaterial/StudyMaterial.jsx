import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, BookOpen, ChevronRight, FolderOpen, Home } from 'lucide-react';

// Services & Components
import { fetchStudyContent, sendFileViaBot } from '../../services/studyService';
import FolderItem from './FolderItem';
import FileItem from './FileItem';
import CustomAlert from '../../components/ui/CustomAlert';
import SyllabusList from '../home/components/content/SyllabusList'; // Reusing Syllabus List

const StudyMaterial = ({ onBack }) => {
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Navigation State
  // Path Array: [{id: null, name: 'Root'}, {id: '123', name: 'Sem 1'}]
  const [path, setPath] = useState([{ id: null, name: 'Home' }]); 
  const [contents, setContents] = useState([]); // Items in current folder
  
  // User Data for API
  const user = JSON.parse(localStorage.getItem('usg_user') || '{}');

  // --- 1. LOAD CONTENT LOGIC ---
  const loadContent = async (parentId = null) => {
    setLoading(true);
    const data = await fetchStudyContent(user.collegeCode, user.courseId, parentId);
    
    // Mock Data if API fails (For Testing UI)
    if (!data || data.length === 0) {
        if (!parentId) {
            // Root Level (Semesters)
            setContents([
                { id: 'sem1', name: 'Semester 1', type: 'folder', itemCount: 6 },
                { id: 'sem2', name: 'Semester 2', type: 'folder', itemCount: 5 },
            ]);
        } else if (parentId === 'sem1') {
            // Level 2 (Subjects)
            setContents([
                { id: 'sub1', name: 'Mathematics', type: 'folder', itemCount: 10 },
                { id: 'sub2', name: 'Physics', type: 'folder', itemCount: 8 },
            ]);
        } else {
            // Level 3 (Files)
            setContents([
                { id: 'f1', name: 'Unit 1 Notes', type: 'file', fileType: 'doc', size: '2 MB', url: '#' },
                { id: 'f2', name: 'Lecture Video', type: 'file', fileType: 'video', size: '50 MB', url: '#' },
            ]);
        }
    } else {
        setContents(data);
    }
    setLoading(false);
  };

  // Initial Load (Root)
  useEffect(() => {
    loadContent(null);
  }, []);

  // --- HANDLERS ---
  
  const handleFolderClick = (folder) => {
      // Add to path
      setPath([...path, { id: folder.id, name: folder.name }]);
      // Fetch children
      loadContent(folder.id);
  };

  const handleBackNav = () => {
      if (path.length > 1) {
          // Go up one level
          const newPath = [...path];
          newPath.pop(); // Remove current
          setPath(newPath);
          
          const parent = newPath[newPath.length - 1];
          loadContent(parent.id);
      } else {
          // Go back to Home Dashboard
          onBack();
      }
  };

  const handleFileDownload = async (file) => {
      const token = localStorage.getItem('usg_token');
      if (!user.tg_id) {
          setAlert({ message: "User ID missing", type: "error" });
          return false;
      }

      const success = await sendFileViaBot(file.url, file.name, user.tg_id, token);
      if (success) {
          setAlert({ message: "Sent to Telegram Chat! 📩", type: "success" });
          return true;
      } else {
          setAlert({ message: "Failed to send", type: "error" });
          return false;
      }
  };

  // --- RENDER HELPERS ---

  const renderBreadcrumbs = () => (
      <div className="flex items-center gap-1 overflow-x-auto whitespace-nowrap pb-2 no-scrollbar px-5">
          {path.map((p, idx) => (
              <div key={idx} className="flex items-center">
                  <span className={`text-xs font-bold ${idx === path.length - 1 ? 'text-blue-600' : 'text-gray-400'}`}>
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
      className="min-h-screen bg-gray-50 dark:bg-slate-900 pb-10 transition-colors duration-300"
    >
      {alert && <CustomAlert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}

      {/* --- HEADER --- */}
      <div className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-100 dark:border-slate-800 pb-2">
         <div className="px-5 pt-4 pb-2 flex items-center gap-4">
             <button onClick={handleBackNav} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-700 dark:text-white">
                 <ArrowLeft size={24} />
             </button>
             <h1 className="text-xl font-bold text-gray-800 dark:text-white">Study Material</h1>
         </div>
         {/* Breadcrumbs (Only show if deep inside) */}
         {path.length > 1 && renderBreadcrumbs()}
      </div>

      <div className="px-5 pt-4 space-y-6">
         
         {/* 1. SYLLABUS OVERVIEW (Only on Root) */}
         {path.length === 1 && (
             <div className="space-y-3">
                <div className="flex justify-between items-end">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                        <BookOpen size={18} className="text-blue-500" /> Syllabus
                    </h3>
                </div>
                {/* Reusing Home Component for Consistency */}
                <SyllabusList />
             </div>
         )}

         {/* 2. FOLDER / FILE BROWSER */}
         <div>
            <div className="flex justify-between items-end mb-3">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                    {path.length === 1 ? <FolderOpen size={18} className="text-purple-500" /> : null}
                    {path.length === 1 ? "Browse Material" : path[path.length - 1].name}
                </h3>
            </div>

            {loading ? (
                <div className="grid grid-cols-2 gap-3">
                    {[1,2,3,4].map(i => <div key={i} className="h-24 bg-gray-200 dark:bg-slate-800 rounded-2xl animate-pulse"></div>)}
                </div>
            ) : contents.length === 0 ? (
                <div className="text-center py-10 text-gray-400">
                    <p>Folder is empty</p>
                </div>
            ) : (
                <div className={contents[0]?.type === 'folder' ? "grid grid-cols-2 gap-3" : "flex flex-col gap-2"}>
                    {contents.map((item) => (
                        item.type === 'folder' ? (
                            <FolderItem key={item.id} data={item} onClick={handleFolderClick} />
                        ) : (
                            <FileItem key={item.id} data={item} onDownload={handleFileDownload} />
                        )
                    ))}
                </div>
            )}
         </div>

      </div>
    </motion.div>
  );
};

export default StudyMaterial;
