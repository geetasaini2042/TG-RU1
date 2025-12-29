import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Mail, Building, GraduationCap, ChevronDown, CheckCircle, 
  Loader2, BookOpen, Smartphone, AlertCircle 
} from 'lucide-react';
import { getSecureHeaders, getTelegramUser } from '../../utils/security';
import { API_ENDPOINTS, STATIC_FILES } from '../../config/apiConfig';

// ==========================================
// 🎨 1. CORE CUSTOM DROPDOWN (UI COMPONENT)
// ==========================================
const CustomDropdown = ({ label, icon: Icon, options, value, onChange, placeholder, disabled, loading, isSmall = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedLabel = options.find(o => o.value.toString() === value?.toString())?.label;

  return (
    <div className={`relative ${isSmall ? '' : 'mb-4'}`} ref={dropdownRef}>
      {!isSmall && <label className="text-xs font-bold text-slate-500 ml-1 mb-1 block uppercase tracking-wider">{label}</label>}
      
      <motion.div 
        whileTap={{ scale: disabled ? 1 : 0.98 }}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between rounded-xl border transition-all cursor-pointer shadow-sm
        ${isSmall ? 'p-3 text-xs' : 'p-3.5'}
        ${isOpen ? 'border-indigo-500 ring-2 ring-indigo-500/10 bg-white' : 'border-slate-200 bg-slate-50/50'}
        ${disabled ? 'opacity-50 cursor-not-allowed grayscale' : 'hover:bg-white hover:border-indigo-300'}`}
      >
        <div className="flex items-center gap-2 overflow-hidden w-full">
          {Icon && (
             <div className={`p-1.5 rounded-md ${value ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-200 text-slate-500'}`}>
                <Icon size={isSmall ? 14 : 18} />
             </div>
          )}
          <span className={`font-semibold truncate ${selectedLabel ? 'text-slate-800' : 'text-slate-400'} ${isSmall ? 'text-xs' : 'text-sm'}`}>
            {loading ? "..." : (selectedLabel || placeholder)}
          </span>
        </div>
        {!loading && <ChevronDown size={14} className={`text-slate-400 shrink-0 transition-transform ${isOpen ? 'rotate-180 text-indigo-500' : ''}`} />}
      </motion.div>

      <AnimatePresence>
        {isOpen && !disabled && (
          <motion.div 
            initial={{ opacity: 0, y: -5, scale: 0.95 }} 
            animate={{ opacity: 1, y: 4, scale: 1 }} 
            exit={{ opacity: 0, y: -5, scale: 0.95 }}
            className="absolute z-50 w-full bg-white border border-slate-100 rounded-xl shadow-xl max-h-52 overflow-y-auto custom-scrollbar"
          >
            {options.length > 0 ? (
              options.map((opt) => (
                <div 
                  key={opt.value}
                  onClick={() => { onChange(opt.value); setIsOpen(false); }}
                  className={`px-3 py-2.5 font-medium cursor-pointer border-b border-slate-50 last:border-none flex items-center justify-between
                  ${isSmall ? 'text-xs' : 'text-sm'}
                  ${value === opt.value ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  {opt.label}
                </div>
              ))
            ) : (
              <div className="p-3 text-center text-xs text-slate-400">No options</div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ==========================================
// 📅 2. SPECIAL 3-PART CUSTOM DOB SELECTOR
// ==========================================
const DOBSplitSelector = ({ value, onChange }) => {
  const [d, m, y] = value ? value.split('-') : ["", "", ""];
  const currentYear = new Date().getFullYear();

  // 1. Generate Days
  const days = Array.from({ length: 31 }, (_, i) => {
    const val = (i + 1).toString().padStart(2, '0');
    return { value: val, label: val };
  });

  // 2. Generate Months (Filtered based on Day)
  const months = useMemo(() => {
    const all = [
      { value: '01', label: 'Jan' }, { value: '02', label: 'Feb' }, { value: '03', label: 'Mar' },
      { value: '04', label: 'Apr' }, { value: '05', label: 'May' }, { value: '06', label: 'Jun' },
      { value: '07', label: 'Jul' }, { value: '08', label: 'Aug' }, { value: '09', label: 'Sep' },
      { value: '10', label: 'Oct' }, { value: '11', label: 'Nov' }, { value: '12', label: 'Dec' }
    ];
    if (!d) return all;
    const dayInt = parseInt(d);
    return all.filter(mon => {
      if (dayInt === 31) return !['02', '04', '06', '09', '11'].includes(mon.value);
      if (dayInt === 30) return mon.value !== '02';
      return true;
    });
  }, [d]);

  // 3. Generate Years (Filtered for Leap Year)
  const years = useMemo(() => {
    let list = [];
    for (let i = currentYear - 10; i >= 1970; i--) {
      list.push({ value: i.toString(), label: i.toString() });
    }
    if (d === '29' && m === '02') {
      return list.filter(yr => {
        const yInt = parseInt(yr.value);
        return (yInt % 4 === 0 && yInt % 100 !== 0) || (yInt % 400 === 0);
      });
    }
    return list;
  }, [d, m]);

  // Update logic
  const handleUpdate = (type, val) => {
    let newD = type === 'd' ? val : d;
    let newM = type === 'm' ? val : m;
    let newY = type === 'y' ? val : y;

    // Reset invalid combos
    if (newD === '31' && ['02', '04', '06', '09', '11'].includes(newM)) newM = "";
    if (newD === '30' && newM === '02') newM = "";
    if (newD === '29' && newM === '02' && newY) {
       const yInt = parseInt(newY);
       const isLeap = (yInt % 4 === 0 && yInt % 100 !== 0) || (yInt % 400 === 0);
       if (!isLeap) newY = "";
    }

    if (newD && newM && newY) {
      onChange(`${newY}-${newM}-${newD}`);
    } else {
      onChange(`${newY || ''}-${newM || ''}-${newD || ''}`); // Keep partial state internally logic
    }
  };

  return (
    <div className="mb-4">
      <label className="text-xs font-bold text-slate-500 ml-1 mb-1 block uppercase tracking-wider">Date of Birth</label>
      <div className="flex gap-2">
        <div className="w-[28%]">
          <CustomDropdown isSmall placeholder="DD" options={days} value={d} onChange={(v) => handleUpdate('d', v)} />
        </div>
        <div className="w-[36%]">
          <CustomDropdown isSmall placeholder="Month" options={months} value={m} onChange={(v) => handleUpdate('m', v)} disabled={!d} />
        </div>
        <div className="flex-1">
          <CustomDropdown isSmall placeholder="Year" options={years} value={y} onChange={(v) => handleUpdate('y', v)} disabled={!m} />
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 🚀 3. MAIN SIGNUP FORM
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

  // --- API CALLS ---
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
      setFormData(prev => ({ ...prev, collegeCode: val, collegeName: col?.label, courseId: '', courseName: '' }));
  };

  const handleCourseSelect = (val) => {
      const course = courses.find(c => c.value.toString() === val.toString());
      setFormData(prev => ({ ...prev, courseId: val, courseName: course?.label }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const required = ['name', 'dob', 'universityId', 'collegeCode', 'courseId', 'mobile', 'email'];
    for (let field of required) {
        if (!formData[field] || (field === 'dob' && formData.dob.length < 10)) {
            showAlert(`Please fill ${field.toUpperCase()}`, 'error');
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
    <div className="flex items-center justify-center min-h-screen w-full bg-slate-100 font-sans md:p-4">
      {/* FIXED CONTAINER:
        - h-screen on mobile (no gaps)
        - h-auto on desktop
        - w-full
      */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="w-full md:max-w-md bg-white md:rounded-[2rem] shadow-2xl relative flex flex-col overflow-hidden h-screen md:h-[85vh] md:border border-white"
      >
        {/* HEADER */}
        <div className="relative pt-8 pb-4 px-6 shrink-0 z-20 bg-white/90 backdrop-blur-md border-b border-slate-100">
           {/* Alert */}
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
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-indigo-500/30 shrink-0">
                  {formData.photo ? <img src={formData.photo} alt="User" className="w-full h-full rounded-2xl object-cover" /> : <User size={28} />}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Profile</h2>
                <p className="text-slate-400 text-xs font-medium">Complete registration</p>
              </div>
           </div>
        </div>

        {/* SCROLLABLE FORM */}
        <div className="flex-1 overflow-y-auto px-6 py-6 custom-scrollbar bg-slate-50/30">
          <form onSubmit={handleRegister} className="pb-20 md:pb-0">
              
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

                 {/* CUSTOM 3-PART DOB SELECTOR */}
                 <DOBSplitSelector value={formData.dob} onChange={(val) => updateField('dob', val)} />
              </div>

              {/* Academic Info */}
              <div className="mb-6">
                 <h4 className="text-xs font-bold text-indigo-500 uppercase tracking-widest mb-4">Academic Details</h4>
                 <CustomDropdown label="University" icon={Building} options={universities} value={formData.universityId} onChange={handleUniSelect} placeholder="Select University" />
                 <CustomDropdown label="College" icon={GraduationCap} options={colleges} value={formData.collegeCode} onChange={handleCollegeSelect} placeholder="Select College" disabled={!formData.universityId} loading={dataLoading} />
                 <CustomDropdown label="Course" icon={BookOpen} options={courses} value={formData.courseId} onChange={handleCourseSelect} placeholder="Select Course" disabled={!formData.collegeCode} loading={courseLoading} />
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
