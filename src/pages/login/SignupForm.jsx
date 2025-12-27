import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Mail, Building, GraduationCap, ChevronDown, CheckCircle, 
  Loader2, AlertCircle, BookOpen, Smartphone, X 
} from 'lucide-react';
import { getSecureHeaders, getTelegramUser } from '../../utils/security';
import { API_ENDPOINTS, STATIC_FILES } from '../../config/apiConfig';

// --- 🎨 1. CUSTOM ALERT / TOAST COMPONENT ---
const CustomToast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`absolute top-4 left-1/2 transform -translate-x-1/2 z-50 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 w-[90%] max-w-xs backdrop-blur-md border ${
        type === 'error' ? 'bg-red-500/90 border-red-400 text-white' : 'bg-green-500/90 border-green-400 text-white'
      }`}
    >
      {type === 'error' ? <AlertCircle size={20} /> : <CheckCircle size={20} />}
      <p className="text-sm font-semibold flex-1">{message}</p>
      <button onClick={onClose}><X size={16} className="opacity-70 hover:opacity-100"/></button>
    </motion.div>
  );
};

// --- 🔽 2. CUSTOM SELECTOR COMPONENT ---
const CustomSelect = ({ icon: Icon, options, value, onChange, placeholder, disabled, labelKey = "name", valueKey = "id" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => String(opt[valueKey]) === String(value));

  return (
    <div className="relative" ref={ref}>
      <Icon size={18} className="absolute left-3.5 top-3.5 text-gray-400 z-10" />
      
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`w-full pl-10 pr-8 py-3 bg-gray-50 rounded-xl border outline-none text-sm font-medium text-left flex items-center justify-between transition-all ${
          disabled ? 'opacity-50 cursor-not-allowed border-gray-200' : 
          isOpen ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-200 hover:border-blue-300'
        }`}
      >
        <span className={selectedOption ? "text-gray-800" : "text-gray-400"}>
          {selectedOption ? selectedOption[labelKey] : placeholder}
        </span>
        <ChevronDown size={16} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}/>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 w-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 max-h-48 overflow-y-auto z-50 no-scrollbar"
          >
            {options.length > 0 ? (
              options.map((opt) => (
                <div
                  key={opt[valueKey]}
                  onClick={() => {
                    onChange(opt[valueKey]);
                    setIsOpen(false);
                  }}
                  className={`px-4 py-3 text-sm cursor-pointer hover:bg-blue-50 transition-colors ${
                    String(opt[valueKey]) === String(value) ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-gray-600'
                  }`}
                >
                  {opt[labelKey]}
                </div>
              ))
            ) : (
              <div className="px-4 py-3 text-sm text-gray-400 text-center">No options found</div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const SignupForm = ({ onSignupComplete }) => {
  const tgUser = getTelegramUser();
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  
  // Custom Toast State
  const [toast, setToast] = useState(null); // { message, type }

  const [universities, setUniversities] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [courses, setCourses] = useState([]);

  const [formData, setFormData] = useState({
    tg_id: tgUser?.id || '',
    username: tgUser?.username || '',
    name: tgUser?.first_name ? `${tgUser.first_name} ${tgUser.last_name || ''}`.trim() : '',
    photo: tgUser?.photo_url || null,
    universityId: '',
    universityName: '',
    collegeCode: '',
    collegeName: '',
    courseId: '',
    courseName: '',
    mobile: '',
    email: ''
  });

  // --- Load Data Effects ---
  useEffect(() => {
    fetch(STATIC_FILES.UNIVERSITIES).then(res => res.json()).then(setUniversities).catch(console.error);
  }, []);

  useEffect(() => {
    if (!formData.universityId) return;
    setDataLoading(true);
    setColleges([]); // Reset colleges
    setCourses([]);   // Reset courses
    setFormData(prev => ({ ...prev, collegeCode: '', courseId: '' })); // Reset selection

    fetch(API_ENDPOINTS.GET_COLLEGES(formData.universityId), { headers: getSecureHeaders() })
    .then(res => res.json())
    .then(data => {
        setColleges(data.STATUS_CODE === 200 ? data.RESPONSE : []);
        setDataLoading(false);
    });
  }, [formData.universityId]);

  useEffect(() => {
    if (!formData.universityId) return;
    fetch(API_ENDPOINTS.GET_COURSES(formData.universityId), { headers: getSecureHeaders() })
    .then(res => res.json())
    .then(data => {
        if(data.STATUS_CODE === 200) setCourses(data.RESPONSE);
    });
  }, [formData.universityId]);

  // --- Handlers ---
  const handleUniChange = (id) => {
      const uni = universities.find(u => u.id.toString() === id.toString());
      setFormData({ ...formData, universityId: id, universityName: uni?.name || '' });
  };

  const handleCollegeChange = (code) => {
      const col = colleges.find(c => c.collegeCode === code);
      setFormData({ ...formData, collegeCode: code, collegeName: col?.collegeName || '' });
  };

  const handleCourseChange = (id) => {
      const course = courses.find(c => c.courseId.toString() === id.toString());
      setFormData({ ...formData, courseId: id, courseName: course?.courseData.courseShortName || '' });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- 🔥 VALIDATION LOGIC ---
  const validateForm = () => {
    if (!formData.name.trim()) return "Full Name is required";
    if (!formData.universityId) return "Please select a University";
    if (!formData.collegeCode) return "Please select a College";
    if (!formData.courseId) return "Please select a Course";
    if (!formData.mobile.trim() || formData.mobile.length < 10) return "Valid Mobile Number is required";
    if (!formData.email.trim() || !formData.email.includes('@')) return "Valid Email is required";
    return null;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    // 1. Validation Check
    const errorMsg = validateForm();
    if (errorMsg) {
      setToast({ message: errorMsg, type: 'error' });
      if(window.Telegram?.WebApp?.HapticFeedback) {
         window.Telegram.WebApp.HapticFeedback.notificationOccurred('error');
      }
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
            setToast({ message: "Registration Successful!", type: 'success' });
            setTimeout(() => {
                onSignupComplete({
                    user: data.RESPONSE.user_data,
                    token: data.RESPONSE.token
                });
            }, 1000);
        } else {
            setToast({ message: data.MESSAGE || "Registration Failed", type: 'error' });
            if(window.Telegram?.WebApp?.HapticFeedback) {
                window.Telegram.WebApp.HapticFeedback.notificationOccurred('error');
            }
        }
    } catch (err) {
        setToast({ message: "Network Connection Failed", type: 'error' });
    } finally {
        setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-sm bg-white p-6 rounded-3xl shadow-2xl relative">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-t-3xl"></div>
      
      {/* Floating Alert (Toast) */}
      <AnimatePresence>
        {toast && <CustomToast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </AnimatePresence>

      <div className="mb-6 text-center mt-2">
         <h2 className="text-2xl font-bold text-gray-800">Create Account</h2>
         <p className="text-gray-400 text-xs mt-1">Join USG Community</p>
      </div>

      <form onSubmit={handleRegister} className="space-y-4">
        
        {/* Name */}
        <div className="relative">
            <User size={18} className="absolute left-3.5 top-3.5 text-gray-400" />
            <input 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                placeholder="Full Name *" 
                className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl border border-gray-200 outline-none text-sm font-semibold focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all" 
            />
        </div>

        {/* Custom Selectors */}
        <CustomSelect 
            icon={Building}
            placeholder="Select University *"
            options={universities}
            value={formData.universityId}
            onChange={handleUniChange}
            labelKey="name"
            valueKey="id"
        />

        <CustomSelect 
            icon={GraduationCap}
            placeholder={dataLoading ? "Loading Colleges..." : "Select College *"}
            options={colleges}
            value={formData.collegeCode}
            onChange={handleCollegeChange}
            disabled={!formData.universityId}
            labelKey="collegeName"
            valueKey="collegeCode"
        />

        <CustomSelect 
            icon={BookOpen}
            placeholder="Select Course *"
            options={courses}
            value={formData.courseId}
            onChange={handleCourseChange}
            disabled={!formData.universityId}
            labelKey="courseData.courseShortName" // Handling nested key logic inside map in future or customize
            // Note: Since labelKey support is simple, we map courses differently below for clean passing:
            options={courses.map(c => ({ id: c.courseId, name: c.courseData.courseShortName }))}
            labelKey="name" 
            valueKey="id"
        />

        {/* Contact Info */}
        <div className="grid grid-cols-1 gap-3">
             <div className="relative">
                <Smartphone size={18} className="absolute left-3.5 top-3.5 text-gray-400" />
                <input 
                    type="tel" 
                    name="mobile" 
                    value={formData.mobile}
                    onChange={handleChange} 
                    placeholder="Mobile Number *" 
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl border border-gray-200 outline-none text-sm font-semibold focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all" 
                />
             </div>
             <div className="relative">
                <Mail size={18} className="absolute left-3.5 top-3.5 text-gray-400" />
                <input 
                    type="email" 
                    name="email" 
                    value={formData.email}
                    onChange={handleChange} 
                    placeholder="Email Address *" 
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl border border-gray-200 outline-none text-sm font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all" 
                />
             </div>
        </div>

        <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3.5 rounded-xl shadow-lg mt-4 flex justify-center gap-2 hover:shadow-xl transition-all active:scale-95 disabled:opacity-70">
            {loading ? <Loader2 className="animate-spin" /> : <>Complete Registration <CheckCircle size={20} /></>}
        </button>
      </form>
    </motion.div>
  );
};

export default SignupForm;
