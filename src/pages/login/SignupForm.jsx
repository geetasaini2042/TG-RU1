import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Mail, Building, GraduationCap, ChevronDown, CheckCircle, 
  Loader2, BookOpen, Smartphone, Calendar, AlertCircle 
} from 'lucide-react';

// === IMPORT YOUR NEW CALENDAR COMPONENT ===
// Adjust path based on where you saved it
import CustomCalendar from '../../components/CustomCalendar'; 

import { getSecureHeaders, getTelegramUser } from '../../utils/security';
import { API_ENDPOINTS, STATIC_FILES } from '../../config/apiConfig';

// ==========================================
// 🎨 MODERN CUSTOM DROPDOWN
// ==========================================
const ModernSelect = ({ label, icon: Icon, options, value, onChange, placeholder, disabled, loading }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedLabel = options.find(o => o.value.toString() === value?.toString())?.label;

  return (
    <div className="relative mb-4" ref={dropdownRef}>
      <label className="text-xs font-semibold text-slate-500 ml-1 mb-1 block uppercase tracking-wider">{label}</label>
      <motion.div 
        whileTap={{ scale: disabled ? 1 : 0.98 }}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer shadow-sm
        ${isOpen ? 'border-indigo-500 ring-2 ring-indigo-500/10 bg-white' : 'border-slate-200 bg-slate-50/50'}
        ${disabled ? 'opacity-50 cursor-not-allowed grayscale' : 'hover:bg-white hover:border-indigo-300'}`}
      >
        <div className="flex items-center gap-3 overflow-hidden">
          <div className={`p-2 rounded-lg ${value ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-200 text-slate-500'}`}>
             <Icon size={18} />
          </div>
          <span className={`text-sm font-medium truncate ${selectedLabel ? 'text-slate-800' : 'text-slate-400'}`}>
            {loading ? "Loading..." : (selectedLabel || placeholder)}
          </span>
        </div>
        <ChevronDown size={18} className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-indigo-500' : ''}`} />
      </motion.div>

      <AnimatePresence>
        {isOpen && !disabled && (
          <motion.div 
            initial={{ opacity: 0, y: -10, scale: 0.95 }} 
            animate={{ opacity: 1, y: 4, scale: 1 }} 
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute z-50 w-full bg-white/95 backdrop-blur-xl border border-slate-100 rounded-xl shadow-2xl max-h-60 overflow-y-auto custom-scrollbar"
          >
            {options.length > 0 ? (
              options.map((opt) => (
                <div 
                  key={opt.value}
                  onClick={() => { onChange(opt.value); setIsOpen(false); }}
                  className={`px-4 py-3 text-sm font-medium cursor-pointer transition-all border-b border-slate-50 last:border-none flex items-center justify-between
                  ${value === opt.value ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50 hover:pl-6'}`}
                >
                  {opt.label}
                  {value === opt.value && <CheckCircle size={14} className="text-indigo-600"/>}
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-xs text-slate-400">No options found</div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ==========================================
// 📅 NEW DATE PICKER WRAPPER
// ==========================================
const DatePickerWrapper = ({ value, onChange }) => {
  const [showModal, setShowModal] = useState(false);

  // Helper to format date nicely for display (e.g. "12 Oct, 2002")
  const displayDate = value ? new Date(value).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric'
  }) : "Select Date of Birth";

  return (
    <div className="relative mb-4">
       <label className="text-xs font-semibold text-slate-500 ml-1 mb-1 block uppercase tracking-wider">Date of Birth</label>
       
       {/* Trigger Button */}
       <motion.div 
        whileTap={{ scale: 0.98 }}
        onClick={() => setShowModal(true)}
        className={`w-full flex items-center gap-3 p-3.5 bg-slate-50/50 rounded-xl border border-slate-200 cursor-pointer hover:bg-white hover:border-indigo-300 transition-all shadow-sm
        ${value ? 'border-indigo-200 bg-indigo-50/30' : ''}`}
       >
          <div className={`p-2 rounded-lg ${value ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-200 text-slate-500'}`}>
            <Calendar size={18} />
          </div>
          <span className={`text-sm font-medium ${value ? 'text-slate-800' : 'text-slate-400'}`}>
             {displayDate}
          </span>
       </motion.div>

       {/* Modal Overlay */}
       <AnimatePresence>
         {showModal && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 z-[60] bg-slate-900/20 backdrop-blur-sm flex items-center justify-center rounded-[2rem]"
            >
                <motion.div 
                    initial={{ scale: 0.8, opacity: 0, y: 20 }} 
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.8, opacity: 0, y: 20 }}
                    className="bg-white rounded-2xl shadow-2xl border border-white/50 overflow-hidden w-[90%]"
                >
                    {/* USES THE NEW CUSTOM CALENDAR COMPONENT */}
                    <CustomCalendar 
                        value={value} 
                        onChange={onChange} 
                        onClose={() => setShowModal(false)} 
                    />
                </motion.div>
            </motion.div>
         )}
       </AnimatePresence>
    </div>
  );
};

// ==========================================
// 🚀 MAIN SIGNUP FORM
// ==========================================
const SignupForm = ({ onSignupComplete }) => {
  const tgUser = getTelegramUser();
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false); 
  const [courseLoading, setCourseLoading] = useState(false); 
  const [alertMsg, setAlertMsg] = useState(null);

  const [universities, setUniversities] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [courses, setCourses] = useState([]);

  const [formData, setFormData] = useState({
    tg_id: tgUser?.id || '',
    username: tgUser?.username || '',
    name: tgUser?.first_name ? `${tgUser.first_name} ${tgUser.last_name || ''}`.trim() : '',
    photo: tgUser?.photo_url || null,
    universityId: '', universityName: '',
    collegeCode: '', collegeName: '',
    courseId: '', courseName: '',
    mobile: '', email: '', dob: '',
  });

  // --- API CALLS (Same as before) ---
  useEffect(() => {
    fetch(STATIC_FILES.UNIVERSITIES)
      .then(res => res.json())
      .then(data => setUniversities(data.map(u => ({ value: u.id, label: u.name }))))
      .catch(() => showAlert("Failed to load Universities"));
  }, []);

  useEffect(() => {
    if (!formData.universityId) { setColleges([]); return; }
    setDataLoading(true);
    fetch(API_ENDPOINTS.GET_COLLEGES(formData.universityId), { headers: getSecureHeaders() })
    .then(res => res.json())
    .then(data => {
        const list = data.STATUS_CODE === 200 ? data.RESPONSE : [];
        setColleges(list.map(c => ({ value: c.collegeCode, label: c.collegeName })));
        setDataLoading(false);
    });
  }, [formData.universityId]);

  useEffect(() => {
    if (!formData.collegeCode) { setCourses([]); return; }
    setCourseLoading(true);
    fetch(API_ENDPOINTS.GET_COURSES(formData.collegeCode), { headers: getSecureHeaders() })
    .then(res => res.json())
    .then(data => {
        const list = data.STATUS_CODE === 200 ? data.RESPONSE : [];
        setCourses(list.map(c => ({ value: c.courseId, label: c.courseData.courseShortName })));
        setCourseLoading(false);
    });
  }, [formData.collegeCode]);

  const showAlert = (msg, type = 'error') => {
      setAlertMsg({ msg, type });
      setTimeout(() => setAlertMsg(null), 4000);
  };

  const updateField = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    setAlertMsg(null);
  };

  const handleUniSelect = (val) => {
      const uni = universities.find(u => u.value.toString() === val.toString());
      setFormData(prev => ({ 
          ...prev, universityId: val, universityName: uni?.label,
          collegeCode: '', collegeName: '', courseId: '', courseName: '' 
      }));
  };

  const handleCollegeSelect = (val) => {
      const col = colleges.find(c => c.value === val);
      setFormData(prev => ({ 
          ...prev, collegeCode: val, collegeName: col?.label,
          courseId: '', courseName: '' 
      }));
  };

  const handleCourseSelect = (val) => {
      const course = courses.find(c => c.value.toString() === val.toString());
      setFormData(prev => ({ ...prev, courseId: val, courseName: course?.label }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const required = ['name', 'dob', 'universityId', 'collegeCode', 'courseId', 'mobile', 'email'];
    for (let field of required) {
        if (!formData[field]) {
            showAlert(`Please fill ${field.replace(/([A-Z])/g, ' $1').trim()}`, 'error');
            return;
        }
    }
    
    if (!/^[6-9]\d{9}$/.test(formData.mobile)) {
        showAlert("Invalid Mobile Number", 'error');
        return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        showAlert("Invalid Email ID", 'error');
        return;
    }

    setLoading(true);
    try {
        const response = await fetch(API_ENDPOINTS.REGISTER_USER, {
            method: 'POST',
            headers: getSecureHeaders(),
            body: JSON.stringify(formData)
        });
        const data = await response.json();
        if (data.STATUS_CODE === 200) {
            onSignupComplete({ user: data.RESPONSE.user_data, token: data.RESPONSE.token });
        } else {
            showAlert(data.MESSAGE || "Registration Failed", 'error');
        }
    } catch {
        showAlert("Connection Error", 'error');
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100 p-4 font-sans">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="w-full max-w-md bg-white rounded-[2rem] shadow-2xl shadow-indigo-500/10 relative flex flex-col overflow-hidden h-[85vh] border border-white"
      >
        {/* HEADER */}
        <div className="relative pt-8 pb-4 px-6 shrink-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-100">
           
           {/* ALERTS */}
           <AnimatePresence>
               {alertMsg && (
                   <motion.div 
                      initial={{ opacity: 0, y: -50, x: '-50%' }} 
                      animate={{ opacity: 1, y: 10, x: '-50%' }} 
                      exit={{ opacity: 0, y: -50, x: '-50%' }}
                      className={`absolute top-0 left-1/2 z-50 px-4 py-2 rounded-full flex items-center gap-2 text-xs font-bold shadow-xl border whitespace-nowrap
                      ${alertMsg.type === 'error' ? 'bg-red-500 text-white border-red-600' : 'bg-emerald-500 text-white border-emerald-600'}`}
                   >
                      <AlertCircle size={14} className="fill-white/20" />
                      <span>{alertMsg.msg}</span>
                   </motion.div>
               )}
           </AnimatePresence>

           <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-indigo-500/30">
                  {formData.photo ? <img src={formData.photo} alt="User" className="w-full h-full rounded-2xl object-cover" /> : <User size={28} />}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Setup Profile</h2>
                <p className="text-slate-400 text-xs font-medium">Please complete your registration</p>
              </div>
           </div>
        </div>

        {/* SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-y-auto px-6 py-6 no-scrollbar bg-slate-50/30">
          <form onSubmit={handleRegister}>
              
              {/* Personal Info */}
              <div className="mb-6">
                 <h4 className="text-xs font-bold text-indigo-500 uppercase tracking-widest mb-4">Personal Details</h4>
                 
                 <div className="relative mb-4 group">
                    <label className="text-xs font-semibold text-slate-500 ml-1 mb-1 block uppercase tracking-wider">Full Name</label>
                    <div className="relative">
                        <User size={18} className="absolute left-4 top-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                        <input 
                            type="text" 
                            value={formData.name} 
                            onChange={(e) => updateField('name', e.target.value)} 
                            className="w-full pl-11 pr-4 py-3.5 bg-slate-50/50 rounded-xl border border-slate-200 outline-none text-sm font-semibold text-slate-700 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-slate-300 shadow-sm"
                            placeholder="e.g. Rahul Kumar"
                        />
                    </div>
                 </div>

                 {/* NEW DATE PICKER IMPLEMENTATION */}
                 <DatePickerWrapper 
                    value={formData.dob} 
                    onChange={(date) => updateField('dob', date)} 
                 />
              </div>

              {/* Academic Info */}
              <div className="mb-6">
                 <h4 className="text-xs font-bold text-indigo-500 uppercase tracking-widest mb-4">Academic Details</h4>
                 <ModernSelect label="University" icon={Building} options={universities} value={formData.universityId} onChange={handleUniSelect} placeholder="Select University" />
                 <ModernSelect label="College" icon={GraduationCap} options={colleges} value={formData.collegeCode} onChange={handleCollegeSelect} placeholder="Select College" disabled={!formData.universityId} loading={dataLoading} />
                 <ModernSelect label="Course" icon={BookOpen} options={courses} value={formData.courseId} onChange={handleCourseSelect} placeholder="Select Course" disabled={!formData.collegeCode} loading={courseLoading} />
              </div>

              {/* Contact Info */}
              <div className="mb-8">
                 <h4 className="text-xs font-bold text-indigo-500 uppercase tracking-widest mb-4">Contact Info</h4>
                 <div className="grid grid-cols-1 gap-4">
                    <div className="relative group">
                        <Smartphone size={18} className="absolute left-4 top-4 text-slate-400 group-focus-within:text-indigo-500" />
                        <input 
                            type="tel" value={formData.mobile} onChange={(e) => updateField('mobile', e.target.value)} 
                            className="w-full pl-11 pr-4 py-3.5 bg-slate-50/50 rounded-xl border border-slate-200 outline-none text-sm font-semibold text-slate-700 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-slate-300 shadow-sm"
                            placeholder="Mobile Number"
                        />
                    </div>
                    <div className="relative group">
                        <Mail size={18} className="absolute left-4 top-4 text-slate-400 group-focus-within:text-indigo-500" />
                        <input 
                            type="email" value={formData.email} onChange={(e) => updateField('email', e.target.value)} 
                            className="w-full pl-11 pr-4 py-3.5 bg-slate-50/50 rounded-xl border border-slate-200 outline-none text-sm font-semibold text-slate-700 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-slate-300 shadow-sm"
                            placeholder="Email Address"
                        />
                    </div>
                 </div>
              </div>

              {/* Submit Button */}
              <div className="pb-4">
                  <motion.button 
                      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      type="submit" disabled={loading} 
                      className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-4 rounded-xl shadow-xl shadow-indigo-500/40 flex justify-center gap-3 items-center transition-all disabled:opacity-70 disabled:shadow-none"
                  >
                      {loading ? <Loader2 className="animate-spin" /> : <>Complete Registration <CheckCircle size={20}/></>}
                  </motion.button>
              </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default SignupForm;
