import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Mail, Building, GraduationCap, ChevronDown, CheckCircle, 
  Loader2, BookOpen, Smartphone, AlertCircle 
} from 'lucide-react';
import { getSecureHeaders, getTelegramUser } from '../../utils/security';
import { API_ENDPOINTS, STATIC_FILES } from '../../config/apiConfig';

// ==========================================
// 🧠 SMART DATE SELECTOR (LOGIC BASED)
// ==========================================
const SmartDateSelector = ({ value, onChange }) => {
  // Parse existing value "YYYY-MM-DD" or default to empty
  const [d, m, y] = value ? value.split('-') : ["", "", ""];
  
  const [selDay, setSelDay] = useState(d);
  const [selMonth, setSelMonth] = useState(m);
  const [selYear, setSelYear] = useState(y);

  const currentYear = new Date().getFullYear();
  const minAge = 10;
  
  // 1. Generate Days (1-31)
  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, '0'));

  // 2. Generate Months (Dynamic based on Day)
  const months = useMemo(() => {
    const allMonths = [
      { val: '01', label: 'Jan' }, { val: '02', label: 'Feb' }, { val: '03', label: 'Mar' },
      { val: '04', label: 'Apr' }, { val: '05', label: 'May' }, { val: '06', label: 'Jun' },
      { val: '07', label: 'Jul' }, { val: '08', label: 'Aug' }, { val: '09', label: 'Sep' },
      { val: '10', label: 'Oct' }, { val: '11', label: 'Nov' }, { val: '12', label: 'Dec' }
    ];

    if (!selDay) return allMonths;

    const dInt = parseInt(selDay);
    // Filter months logic
    return allMonths.filter(m => {
      if (dInt === 31) return !['02', '04', '06', '09', '11'].includes(m.val); // No Feb, Apr, Jun, Sep, Nov
      if (dInt === 30) return m.val !== '02'; // No Feb
      return true;
    });
  }, [selDay]);

  // 3. Generate Years (Dynamic based on Leap Year logic + Age Limit)
  const years = useMemo(() => {
    let yearList = [];
    // User must be at least 10 years old
    for (let i = currentYear - minAge; i >= 1960; i--) {
      yearList.push(i.toString());
    }

    // Special Check: Feb 29
    if (selDay === '29' && selMonth === '02') {
      return yearList.filter(yr => {
        const yInt = parseInt(yr);
        return (yInt % 4 === 0 && yInt % 100 !== 0) || (yInt % 400 === 0);
      });
    }

    return yearList;
  }, [selDay, selMonth, currentYear]);

  // Update Parent when all 3 are selected
  useEffect(() => {
    // Auto-reset Month/Year if they become invalid due to Day change
    if (selDay === '31' && ['02', '04', '06', '09', '11'].includes(selMonth)) setSelMonth("");
    if (selDay === '30' && selMonth === '02') setSelMonth("");
    
    // Auto-reset Year if Feb 29 selected but year is not leap
    if (selDay === '29' && selMonth === '02' && selYear) {
      const yInt = parseInt(selYear);
      const isLeap = (yInt % 4 === 0 && yInt % 100 !== 0) || (yInt % 400 === 0);
      if (!isLeap) setSelYear("");
    }

    if (selDay && selMonth && selYear) {
      onChange(`${selYear}-${selMonth}-${selDay}`);
    } else {
        onChange(""); // Incomplete
    }
  }, [selDay, selMonth, selYear]);

  // Common Select Style
  const selectClass = "w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 outline-none focus:border-blue-500 focus:bg-white transition-all appearance-none";

  return (
    <div className="mb-5">
       <label className="text-xs font-bold text-slate-500 ml-1 mb-1 block uppercase">Date of Birth</label>
       <div className="flex gap-2">
          {/* Day Select */}
          <div className="relative w-1/4">
             <select value={selDay} onChange={(e) => setSelDay(e.target.value)} className={selectClass}>
                <option value="">DD</option>
                {days.map(d => <option key={d} value={d}>{d}</option>)}
             </select>
          </div>

          {/* Month Select */}
          <div className="relative w-2/5">
             <select value={selMonth} onChange={(e) => setSelMonth(e.target.value)} className={selectClass} disabled={!selDay}>
                <option value="">Month</option>
                {months.map(m => <option key={m.val} value={m.val}>{m.label}</option>)}
             </select>
          </div>

          {/* Year Select */}
          <div className="relative flex-1">
             <select value={selYear} onChange={(e) => setSelYear(e.target.value)} className={selectClass} disabled={!selMonth}>
                <option value="">Year</option>
                {years.map(y => <option key={y} value={y}>{y}</option>)}
             </select>
          </div>
       </div>
       {/* Helper Text */}
       {selDay === '29' && selMonth === '02' && (
         <p className="text-[10px] text-blue-500 mt-1 pl-1">* Showing only Leap Years</p>
       )}
    </div>
  );
};

// ==========================================
// 🎨 SIMPLE SELECT (Standard for Mobile)
// ==========================================
const StandardSelect = ({ label, icon: Icon, options, value, onChange, placeholder, disabled, loading }) => {
  return (
    <div className="relative mb-4 group">
       <label className="text-xs font-bold text-slate-500 ml-1 mb-1 block uppercase">{label}</label>
       <div className="relative">
          <div className="absolute left-3 top-3.5 text-slate-400 pointer-events-none">
             {loading ? <Loader2 size={18} className="animate-spin text-blue-500"/> : <Icon size={18} />}
          </div>
          <select 
            value={value} 
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            className={`w-full pl-10 pr-8 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 outline-none focus:border-blue-500 focus:bg-white transition-all appearance-none disabled:opacity-50
            ${!value ? 'text-slate-400' : 'text-slate-800'}`}
          >
             <option value="" disabled>{loading ? "Loading..." : placeholder}</option>
             {options.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
             ))}
          </select>
          <ChevronDown size={16} className="absolute right-3 top-4 text-slate-400 pointer-events-none" />
       </div>
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
    <div className="flex items-center justify-center min-h-screen bg-slate-100 p-2 font-sans">
      {/* Increased Width & Removed Fixed Height for Mobile */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }} 
        animate={{ opacity: 1, scale: 1 }} 
        className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-200 flex flex-col overflow-hidden max-h-screen"
      >
        {/* HEADER */}
        <div className="relative pt-6 pb-4 px-6 shrink-0 bg-white z-10 border-b border-slate-100">
           <AnimatePresence>
               {alertMsg && (
                   <div className={`absolute top-0 left-0 w-full p-2 text-center text-xs font-bold
                      ${alertMsg.type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>
                      {alertMsg.msg}
                   </div>
               )}
           </AnimatePresence>
           
           <h2 className="text-2xl font-extrabold text-slate-800 mt-2">Create Account</h2>
           <p className="text-slate-500 text-xs">Enter your details to register</p>
        </div>

        {/* SCROLLABLE FORM AREA */}
        <div className="flex-1 overflow-y-auto px-6 py-4 custom-scrollbar">
          <form onSubmit={handleRegister} className="pb-4">
              
              {/* Profile Photo & Name */}
              <div className="flex items-center gap-4 mb-6">
                 <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center border-2 border-slate-200 shrink-0 overflow-hidden">
                    {formData.photo ? <img src={formData.photo} alt="U" className="w-full h-full object-cover"/> : <User className="text-slate-400"/>}
                 </div>
                 <div className="flex-1 group">
                    <label className="text-xs font-bold text-slate-500 ml-1 mb-1 block uppercase">Full Name</label>
                    <input 
                        type="text" value={formData.name} onChange={(e) => updateField('name', e.target.value)} 
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 transition-all font-semibold text-slate-800"
                        placeholder="Your Name"
                    />
                 </div>
              </div>

              {/* LOGIC BASED DATE SELECTOR */}
              <SmartDateSelector value={formData.dob} onChange={(date) => updateField('dob', date)} />

              {/* Academic Dropdowns (Using Native Select for Mobile Stability) */}
              <StandardSelect label="University" icon={Building} options={universities} value={formData.universityId} onChange={handleUniSelect} placeholder="Select University" />
              <StandardSelect label="College" icon={GraduationCap} options={colleges} value={formData.collegeCode} onChange={handleCollegeSelect} placeholder="Select College" disabled={!formData.universityId} loading={dataLoading} />
              <StandardSelect label="Course" icon={BookOpen} options={courses} value={formData.courseId} onChange={handleCourseSelect} placeholder="Select Course" disabled={!formData.collegeCode} loading={courseLoading} />

              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                 <div className="group">
                    <label className="text-xs font-bold text-slate-500 ml-1 mb-1 block uppercase">Mobile</label>
                    <div className="relative">
                        <Smartphone size={18} className="absolute left-3 top-3.5 text-slate-400"/>
                        <input 
                            type="tel" value={formData.mobile} onChange={(e) => updateField('mobile', e.target.value)} 
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 font-semibold text-slate-800"
                            placeholder="Mobile No."
                        />
                    </div>
                 </div>
                 <div className="group">
                    <label className="text-xs font-bold text-slate-500 ml-1 mb-1 block uppercase">Email</label>
                    <div className="relative">
                        <Mail size={18} className="absolute left-3 top-3.5 text-slate-400"/>
                        <input 
                            type="email" value={formData.email} onChange={(e) => updateField('email', e.target.value)} 
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 font-semibold text-slate-800"
                            placeholder="Email Address"
                        />
                    </div>
                 </div>
              </div>

              {/* Submit Button */}
              <button 
                  type="submit" disabled={loading} 
                  className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg active:scale-95 transition-transform flex justify-center gap-2 items-center"
              >
                  {loading ? <Loader2 className="animate-spin" /> : <>Complete Signup <CheckCircle size={20}/></>}
              </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default SignupForm;
