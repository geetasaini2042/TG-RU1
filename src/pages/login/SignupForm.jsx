import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getSecureHeaders, getTelegramUser } from '../../utils/security';
import { API_ENDPOINTS, STATIC_FILES } from '../../config/apiConfig';
import { Loader2, Upload, ChevronDown, CheckCircle } from 'lucide-react';

const SignupForm = ({ onSignupComplete }) => {
  const tgUser = getTelegramUser();
  
  // --- STATES ---
  const [step, setStep] = useState(1); // Step-wise loading optional
  const [loading, setLoading] = useState(false);
  
  // Dropdown Data
  const [universities, setUniversities] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [courses, setCourses] = useState([]);

  // Form Data
  const [formData, setFormData] = useState({
    tg_id: tgUser?.id || '',
    name: tgUser?.first_name ? `${tgUser.first_name} ${tgUser.last_name || ''}` : '',
    universityId: '',
    collegeCode: '',
    courseId: '',
    mobile: '',
    email: '',
    photo: tgUser?.photo_url || null // Default TG Photo
  });

  // --- 1. LOAD UNIVERSITIES (Static) ---
  useEffect(() => {
    fetch(STATIC_FILES.UNIVERSITIES)
      .then(res => res.json())
      .then(data => setUniversities(data))
      .catch(err => console.error("Uni Load Error", err));
  }, []);

  // --- 2. LOAD COLLEGES (On University Select) ---
  useEffect(() => {
    if (!formData.universityId) return;
    
    setLoading(true);
    // Secure Fetch with Headers
    fetch(API_ENDPOINTS.GET_COLLEGES(formData.universityId), {
        headers: getSecureHeaders()
    })
    .then(res => res.json())
    .then(data => {
        if(data.STATUS_CODE === 200) {
            setColleges(data.RESPONSE);
        }
        setLoading(false);
    })
    .catch(() => setLoading(false));
  }, [formData.universityId]);

  // --- 3. LOAD COURSES (On College/Uni Select) ---
  useEffect(() => {
    // Assuming Course depends on University ID or College Code based on your API structure
    // Using universityId as per typical flow, change id if needed
    if (!formData.universityId) return; 

    // Note: User prompt said /courses/id. I'm using universityId here.
    fetch(API_ENDPOINTS.GET_COURSES(formData.universityId), {
        headers: getSecureHeaders()
    })
    .then(res => res.json())
    .then(data => {
        if(data.STATUS_CODE === 200) {
            setCourses(data.RESPONSE);
        }
    });
  }, [formData.universityId]);

  // --- HANDLERS ---
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    
    // Validate Mobile (Indian)
    const mobileRegex = /^[6-9]\d{9}$/;
    if (!mobileRegex.test(formData.mobile)) {
        window.Telegram.WebApp.showAlert("Invalid Indian Mobile Number");
        return;
    }

    setLoading(true);
    
    // Simulate API POST
    console.log("Secure Payload:", formData);
    console.log("Headers:", getSecureHeaders());

    setTimeout(() => {
        // Assume Success
        setLoading(false);
        onSignupComplete(formData); // Parent ko data bhejo
    }, 2000);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-sm bg-white p-6 rounded-2xl shadow-xl">
      <h2 className="text-xl font-bold text-gray-800 mb-1">Student Registration</h2>
      <p className="text-xs text-gray-400 mb-6">Complete your profile to access USG</p>

      <form onSubmit={handleRegister} className="space-y-4">
        
        {/* READ ONLY FIELDS */}
        <div className="grid grid-cols-2 gap-3">
             <div className="bg-gray-50 p-2 rounded-lg border border-gray-200">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Telegram ID</label>
                <div className="font-mono text-xs text-gray-600 font-bold">{formData.tg_id}</div>
             </div>
             <div className="bg-gray-50 p-2 rounded-lg border border-gray-200 flex items-center gap-2">
                 <img src={formData.photo || "https://via.placeholder.com/50"} className="w-8 h-8 rounded-full" alt="Profile" />
                 <span className="text-[10px] text-gray-400">Profile Photo</span>
             </div>
        </div>

        {/* NAME */}
        <div>
            <label className="text-xs font-bold text-gray-500">Full Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-blue-500 outline-none text-sm font-bold" />
        </div>

        {/* UNIVERSITY DROPDOWN */}
        <div className="relative">
            <label className="text-xs font-bold text-gray-500">University</label>
            <select name="universityId" onChange={handleChange} className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none text-sm appearance-none">
                <option value="">Select University</option>
                {universities.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
            </select>
            <ChevronDown size={16} className="absolute right-3 top-8 text-gray-400 pointer-events-none"/>
        </div>

        {/* COLLEGE DROPDOWN (Dynamic) */}
        <div className="relative">
            <label className="text-xs font-bold text-gray-500">College</label>
            <select name="collegeCode" onChange={handleChange} disabled={!formData.universityId} className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none text-sm appearance-none disabled:opacity-50">
                <option value="">{loading ? "Loading Colleges..." : "Select College"}</option>
                {colleges.map(c => <option key={c.collegeCode} value={c.collegeCode}>{c.collegeName}</option>)}
            </select>
        </div>

        {/* COURSE DROPDOWN (Dynamic) */}
        <div className="relative">
            <label className="text-xs font-bold text-gray-500">Course</label>
            <select name="courseId" onChange={handleChange} disabled={!formData.universityId} className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none text-sm appearance-none disabled:opacity-50">
                <option value="">Select Course</option>
                {courses.map(c => <option key={c.courseId} value={c.courseId}>{c.courseData.courseShortName}</option>)}
            </select>
        </div>

        {/* MOBILE & EMAIL */}
        <div className="grid grid-cols-1 gap-4">
             <div>
                <label className="text-xs font-bold text-gray-500">Mobile (Indian)</label>
                <div className="flex">
                    <span className="p-3 bg-gray-100 border border-r-0 border-gray-200 rounded-l-xl text-sm font-bold text-gray-500">+91</span>
                    <input type="tel" name="mobile" maxLength="10" onChange={handleChange} className="w-full p-3 bg-gray-50 rounded-r-xl border border-gray-200 outline-none text-sm font-bold" placeholder="9876543210" />
                </div>
             </div>
             <div>
                <label className="text-xs font-bold text-gray-500">Email ID</label>
                <input type="email" name="email" onChange={handleChange} className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none text-sm" placeholder="student@email.com" />
             </div>
        </div>

        {/* SUBMIT BUTTON */}
        <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg mt-2 active:scale-95 transition-transform flex justify-center items-center gap-2"
        >
            {loading ? <Loader2 className="animate-spin" /> : <><CheckCircle size={18} /> Register Now</>}
        </button>

      </form>
    </motion.div>
  );
};

export default SignupForm;
