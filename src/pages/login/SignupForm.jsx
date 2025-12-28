import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Mail, Building, GraduationCap, ChevronDown, CheckCircle, 
  Loader2, BookOpen, Smartphone, Calendar, X, AlertCircle, ChevronLeft, ChevronRight 
} from 'lucide-react';
import { getSecureHeaders, getTelegramUser } from '../../utils/security';
import { API_ENDPOINTS, STATIC_FILES } from '../../config/apiConfig';

// ==========================================
// 🎨 1. MODERN CUSTOM DROPDOWN COMPONENT
// ==========================================
const ModernSelect = ({ label, icon: Icon, options, value, onChange, placeholder, disabled, loading }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown if clicked outside
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
    <div className="relative mb-3" ref={dropdownRef}>
      {/* Trigger Button */}
      <div 
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer bg-gray-50 
        ${isOpen ? 'border-blue-500 ring-2 ring-blue-500/20 bg-white' : 'border-gray-200'}
        ${disabled ? 'opacity-60 cursor-not-allowed' : 'hover:bg-white'}`}
      >
        <div className="flex items-center gap-3 overflow-hidden">
          <Icon size={18} className="text-gray-400 shrink-0" />
          <span className={`text-sm font-medium truncate ${selectedLabel ? 'text-gray-800' : 'text-gray-400'}`}>
            {loading ? "Loading..." : (selectedLabel || placeholder)}
          </span>
        </div>
        <ChevronDown size={16} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {/* Dropdown Menu (Absolute) */}
      <AnimatePresence>
        {isOpen && !disabled && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 5 }} exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 w-full bg-white border border-gray-100 rounded-xl shadow-xl max-h-60 overflow-y-auto custom-scrollbar"
          >
            {options.length > 0 ? (
              options.map((opt) => (
                <div 
                  key={opt.value}
                  onClick={() => { onChange(opt.value); setIsOpen(false); }}
                  className={`px-4 py-3 text-sm font-medium cursor-pointer hover:bg-blue-50 transition-colors border-b border-gray-50 last:border-none
                  ${value === opt.value ? 'bg-blue-50 text-blue-600' : 'text-gray-600'}`}
                >
                  {opt.label}
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-xs text-gray-400">No options available</div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ==========================================
// 📅 2. MODERN CUSTOM DATE PICKER
// ==========================================
const ModernDatePicker = ({ value, onChange }) => {
  const [showPicker, setShowPicker] = useState(false);
  const [tempDate, setTempDate] = useState(value || "");

  // Simple native-like UI but controlled
  return (
    <div className="relative mb-3">
       <div 
        onClick={() => setShowPicker(true)}
        className="w-full flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200 cursor-pointer hover:bg-white transition-all"
       >
          <Calendar size={18} className="text-gray-400" />
          <span className={`text-sm font-medium ${value ? 'text-gray-800' : 'text-gray-400'}`}>
             {value || "Date of Birth"}
          </span>
       </div>

       {/* Date Picker Modal Overlay */}
       <AnimatePresence>
         {showPicker && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 z-[60] bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center rounded-3xl"
            >
                <div className="w-full px-6">
                    <h3 className="text-center font-bold text-gray-700 mb-4">Select Birth Date</h3>
                    <input 
                        type="date" 
                        value={tempDate}
                        onChange={(e) => setTempDate(e.target.value)}
                        className="w-full p-3 bg-gray-100 rounded-xl text-center font-bold text-lg outline-none border-2 border-transparent focus:border-blue-500 mb-4"
                    />
                    <div className="flex gap-2">
                        <button 
                            onClick={() => setShowPicker(false)}
                            className="flex-1 py-3 rounded-xl bg-gray-200 font-bold text-gray-600 text-sm"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={() => { onChange(tempDate); setShowPicker(false); }}
                            className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-bold text-sm"
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            </motion.div>
         )}
       </AnimatePresence>
    </div>
  );
};

// ==========================================
// 🚀 3. MAIN SIGNUP FORM
// ==========================================
const SignupForm = ({ onSignupComplete }) => {
  const tgUser = getTelegramUser();
  const [loading, setLoading] = useState(false);
  
  // Loading States
  const [dataLoading, setDataLoading] = useState(false); 
  const [courseLoading, setCourseLoading] = useState(false); 
  
  // In-Card Alert State
  const [alertMsg, setAlertMsg] = useState(null); // { msg, type: 'error' | 'success' }

  // Lists
  const [universities, setUniversities] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [courses, setCourses] = useState([]);

  // Form Data
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

  // --- HANDLERS ---
  const showAlert = (msg, type = 'error') => {
      setAlertMsg({ msg, type });
      setTimeout(() => setAlertMsg(null), 4000); // Auto hide after 4s
  };

  const updateField = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    setAlertMsg(null); // Clear error on interaction
  };

  // Special Handlers for Logic
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
      setFormData(prev => ({ 
          ...prev, courseId: val, courseName: course?.label 
      }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    // STRICT VALIDATION
    const required = ['name', 'dob', 'universityId', 'collegeCode', 'courseId', 'mobile', 'email'];
    for (let field of required) {
        if (!formData[field]) {
            showAlert(`Field '${field.toUpperCase()}' is required!`, 'error');
            return;
        }
    }
    
    // Mobile Validation
    if (!/^[6-9]\d{9}$/.test(formData.mobile)) {
        showAlert("Invalid Indian Mobile Number", 'error');
        return;
    }

    // Email Validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        showAlert("Invalid Email Address", 'error');
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
        showAlert("Connection Error. Try Again.", 'error');
    } finally {
        setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }} 
      animate={{ opacity: 1, scale: 1 }} 
      className="w-full max-w-sm bg-white rounded-3xl shadow-2xl relative flex flex-col overflow-hidden max-h-[85vh] border border-gray-100"
    >
      {/* HEADER WITH IN-BOUND ALERT */}
      <div className="relative pt-6 pb-2 px-6 shrink-0 bg-white z-20">
         <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 to-purple-600"></div>
         
         <AnimatePresence mode="wait">
             {alertMsg ? (
                 <motion.div 
                    initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                    className={`p-3 rounded-xl flex items-center gap-2 text-xs font-bold shadow-md mb-2
                    ${alertMsg.type === 'error' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-50 text-green-600'}`}
                 >
                    <AlertCircle size={16} className="shrink-0" />
                    <p className="leading-tight">{alertMsg.msg}</p>
                 </motion.div>
             ) : (
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-2">
                    <h2 className="text-2xl font-bold text-gray-800">Create Account</h2>
                    <p className="text-gray-400 text-xs">Fill details to continue</p>
                 </motion.div>
             )}
         </AnimatePresence>
      </div>

      {/* SCROLLABLE FORM AREA */}
      <div className="flex-1 overflow-y-auto px-6 pb-6 pt-2 custom-scrollbar relative z-10">
        <form onSubmit={handleRegister}>
            
            {/* Full Name */}
            <div className="relative mb-3 group">
                <User size={18} className="absolute left-3.5 top-3.5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                <input 
                    type="text" 
                    value={formData.name} 
                    onChange={(e) => updateField('name', e.target.value)} 
                    placeholder="Full Name" 
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl border border-gray-200 outline-none text-sm font-semibold focus:bg-white focus:border-blue-500 transition-all" 
                />
            </div>

            {/* Custom Date Picker */}
            <ModernDatePicker 
                value={formData.dob} 
                onChange={(date) => updateField('dob', date)} 
            />

            {/* University Selector */}
            <ModernSelect 
                label="University" 
                icon={Building} 
                options={universities} 
                value={formData.universityId} 
                onChange={handleUniSelect} 
                placeholder="Select University"
            />

            {/* College Selector */}
            <ModernSelect 
                label="College" 
                icon={GraduationCap} 
                options={colleges} 
                value={formData.collegeCode} 
                onChange={handleCollegeSelect} 
                placeholder="Select College"
                disabled={!formData.universityId}
                loading={dataLoading}
            />

            {/* Course Selector */}
            <ModernSelect 
                label="Course" 
                icon={BookOpen} 
                options={courses} 
                value={formData.courseId} 
                onChange={handleCourseSelect} 
                placeholder="Select Course"
                disabled={!formData.collegeCode}
                loading={courseLoading}
            />

            {/* Contact Details */}
            <div className="relative mb-3 group">
                <Smartphone size={18} className="absolute left-3.5 top-3.5 text-gray-400 group-focus-within:text-blue-500" />
                <input 
                    type="tel" 
                    value={formData.mobile} 
                    onChange={(e) => updateField('mobile', e.target.value)} 
                    placeholder="Mobile Number" 
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl border border-gray-200 outline-none text-sm font-semibold focus:bg-white focus:border-blue-500 transition-all" 
                />
            </div>

            <div className="relative mb-4 group">
                <Mail size={18} className="absolute left-3.5 top-3.5 text-gray-400 group-focus-within:text-blue-500" />
                <input 
                    type="email" 
                    value={formData.email} 
                    onChange={(e) => updateField('email', e.target.value)} 
                    placeholder="Email Address" 
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl border border-gray-200 outline-none text-sm font-medium focus:bg-white focus:border-blue-500 transition-all" 
                />
            </div>

            {/* Submit Button */}
            <button 
                type="submit" 
                disabled={loading} 
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3.5 rounded-xl shadow-lg flex justify-center gap-2 items-center active:scale-95 transition-transform"
            >
                {loading ? <Loader2 className="animate-spin" /> : <>Register Account <CheckCircle size={18}/></>}
            </button>
        </form>
      </div>
    </motion.div>
  );
};

export default SignupForm;
