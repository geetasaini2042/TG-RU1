import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, Mail, Building, GraduationCap, ChevronDown, CheckCircle, 
  Loader2, BookOpen, Smartphone, Calendar 
} from 'lucide-react';
import { getSecureHeaders, getTelegramUser } from '../../utils/security';
import { API_ENDPOINTS, STATIC_FILES } from '../../config/apiConfig';
import CustomAlert from '../../components/ui/CustomAlert'; // Ensure path is correct

const SignupForm = ({ onSignupComplete }) => {
  const tgUser = getTelegramUser();
  
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false); // For Colleges
  const [courseLoading, setCourseLoading] = useState(false); // For Courses
  
  // Alert State
  const [alert, setAlert] = useState(null);

  // Lists
  const [universities, setUniversities] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [courses, setCourses] = useState([]);

  const [formData, setFormData] = useState({
    tg_id: tgUser?.id || '',
    username: tgUser?.username || '',
    name: tgUser?.first_name ? `${tgUser.first_name} ${tgUser.last_name || ''}`.trim() : '',
    photo: tgUser?.photo_url || null,
    
    // IDs
    universityId: '',
    collegeCode: '',
    courseId: '',

    // Names
    universityName: '',
    collegeName: '',
    courseName: '',
    
    // Details
    mobile: '',
    email: '',
    dob: '', // 🔥 NEW DOB FIELD
  });

  // --- 1. LOAD UNIVERSITIES ---
  useEffect(() => {
    fetch(STATIC_FILES.UNIVERSITIES)
      .then(res => res.json())
      .then(setUniversities)
      .catch(() => triggerAlert("Failed to load Universities", "error"));
  }, []);

  // --- 2. LOAD COLLEGES (When Uni Changes) ---
  useEffect(() => {
    if (!formData.universityId) {
        setColleges([]);
        setCourses([]); // Clear courses too
        return;
    }
    
    setDataLoading(true);
    fetch(API_ENDPOINTS.GET_COLLEGES(formData.universityId), { headers: getSecureHeaders() })
    .then(res => res.json())
    .then(data => {
        setColleges(data.STATUS_CODE === 200 ? data.RESPONSE : []);
        setDataLoading(false);
    })
    .catch(() => {
        setDataLoading(false);
        triggerAlert("Error loading colleges", "error");
    });
  }, [formData.universityId]);

  // --- 3. LOAD COURSES (When COLLEGE Changes) ---
  // 🔥 Logic Change: Ab Course College Code par depend karega
  useEffect(() => {
    if (!formData.collegeCode) {
        setCourses([]);
        return;
    }

    setCourseLoading(true);
    fetch(API_ENDPOINTS.GET_COURSES(formData.collegeCode), { headers: getSecureHeaders() })
    .then(res => res.json())
    .then(data => {
        setCourses(data.STATUS_CODE === 200 ? data.RESPONSE : []);
        setCourseLoading(false);
    })
    .catch(() => {
        setCourseLoading(false);
        // Optional: Alert mat dikhao agar course nahi mile, bas list khali rakho
    });
  }, [formData.collegeCode]);

  // --- HANDLERS ---
  
  const triggerAlert = (msg, type = 'error') => {
      setAlert({ message: msg, type });
  };

  const handleUniChange = (e) => {
      const id = e.target.value;
      const uni = universities.find(u => u.id.toString() === id);
      setFormData({ 
          ...formData, 
          universityId: id, 
          universityName: uni?.name || '',
          collegeCode: '', collegeName: '', // Reset Child
          courseId: '', courseName: ''      // Reset Grandchild
      });
  };

  const handleCollegeChange = (e) => {
      const code = e.target.value;
      const col = colleges.find(c => c.collegeCode === code);
      setFormData({ 
          ...formData, 
          collegeCode: code, 
          collegeName: col?.collegeName || '',
          courseId: '', courseName: '' // Reset Child
      });
  };

  const handleCourseChange = (e) => {
      const id = e.target.value;
      const course = courses.find(c => c.courseId.toString() === id);
      setFormData({ 
          ...formData, 
          courseId: id, 
          courseName: course?.courseData.courseShortName || '' 
      });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    // Validation
    if(!formData.universityId || !formData.collegeCode || !formData.courseId || !formData.dob) {
        triggerAlert("Please fill all fields including DOB", "error");
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
            onSignupComplete({
                user: data.RESPONSE.user_data,
                token: data.RESPONSE.token
            });
        } else {
            triggerAlert(data.MESSAGE || "Registration Failed", "error");
        }
    } catch (err) {
        triggerAlert("Network Connection Failed", "error");
    } finally {
        setLoading(false);
    }
  };

  return (
    <>
    {/* Floating Alert Component */}
    {alert && <CustomAlert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}

    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }} 
      animate={{ opacity: 1, scale: 1 }} 
      className="w-full max-w-sm bg-white rounded-3xl shadow-2xl relative overflow-hidden flex flex-col max-h-[85vh]"
    >
      {/* Header */}
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-purple-600 z-10"></div>
      
      <div className="pt-6 pb-2 text-center shrink-0">
         <h2 className="text-2xl font-bold text-gray-800">Create Account</h2>
         <p className="text-gray-400 text-xs mt-1">Join GNIKNAP Community</p>
      </div>

      {/* Scrollable Form Area */}
      <div className="flex-1 overflow-y-auto px-6 pb-6 pt-2 custom-scrollbar">
        <form onSubmit={handleRegister} className="space-y-3">
            
            {/* Name */}
            <div className="relative">
                <User size={18} className="absolute left-3.5 top-3.5 text-gray-400" />
                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl border border-gray-200 outline-none text-sm font-semibold" />
            </div>

            {/* DOB (New Field) */}
            <div className="relative">
                <Calendar size={18} className="absolute left-3.5 top-3.5 text-gray-400" />
                <input 
                    type="date" 
                    name="dob" 
                    onChange={handleChange} 
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl border border-gray-200 outline-none text-sm font-medium text-gray-600" 
                />
            </div>

            {/* University */}
            <div className="relative">
                <Building size={18} className="absolute left-3.5 top-3.5 text-gray-400" />
                <select name="universityId" onChange={handleUniChange} className="w-full pl-10 pr-8 py-3 bg-gray-50 rounded-xl border border-gray-200 outline-none text-sm font-medium text-gray-700">
                    <option value="">Select University</option>
                    {universities.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                </select>
                <ChevronDown size={16} className="absolute right-3 top-4 text-gray-400 pointer-events-none"/>
            </div>

            {/* College */}
            <div className="relative">
                <GraduationCap size={18} className="absolute left-3.5 top-3.5 text-gray-400" />
                <select name="collegeCode" onChange={handleCollegeChange} disabled={!formData.universityId} className="w-full pl-10 pr-8 py-3 bg-gray-50 rounded-xl border border-gray-200 outline-none text-sm font-medium text-gray-700 disabled:opacity-50">
                    <option value="">{dataLoading ? "Loading Colleges..." : "Select College"}</option>
                    {colleges.map(c => <option key={c.collegeCode} value={c.collegeCode}>{c.collegeName}</option>)}
                </select>
            </div>

            {/* Course (Depends on College now) */}
            <div className="relative">
                <BookOpen size={18} className="absolute left-3.5 top-3.5 text-gray-400" />
                <select name="courseId" onChange={handleCourseChange} disabled={!formData.collegeCode} className="w-full pl-10 pr-8 py-3 bg-gray-50 rounded-xl border border-gray-200 outline-none text-sm font-medium text-gray-700 disabled:opacity-50">
                    <option value="">{courseLoading ? "Loading Courses..." : "Select Course"}</option>
                    {courses.map(c => <option key={c.courseId} value={c.courseId}>{c.courseData.courseShortName}</option>)}
                </select>
            </div>

            {/* Contact */}
            <div className="grid grid-cols-1 gap-3">
                <div className="relative">
                    <Smartphone size={18} className="absolute left-3.5 top-3.5 text-gray-400" />
                    <input type="tel" name="mobile" onChange={handleChange} placeholder="Mobile Number" className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl border border-gray-200 outline-none text-sm font-semibold" />
                </div>
                <div className="relative">
                    <Mail size={18} className="absolute left-3.5 top-3.5 text-gray-400" />
                    <input type="email" name="email" onChange={handleChange} placeholder="Email Address" className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl border border-gray-200 outline-none text-sm font-medium" />
                </div>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3.5 rounded-xl shadow-lg mt-2 flex justify-center gap-2 items-center">
                {loading ? <Loader2 className="animate-spin" /> : <>Complete Signup <CheckCircle size={18}/></>}
            </button>
        </form>
      </div>
    </motion.div>
    </>
  );
};

export default SignupForm;
