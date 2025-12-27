import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, Mail, Building, GraduationCap, 
  ChevronDown, CheckCircle, Loader2, AlertCircle, BookOpen 
} from 'lucide-react';

import { getSecureHeaders, getTelegramUser } from '../../utils/security';
import { API_ENDPOINTS, STATIC_FILES } from '../../config/apiConfig';

const SignupForm = ({ onSignupComplete }) => {
  const tgUser = getTelegramUser();
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const [error, setError] = useState(null);

  const [universities, setUniversities] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [courses, setCourses] = useState([]);

  const [formData, setFormData] = useState({
    tg_id: tgUser?.id || '',
    username: tgUser?.username || '',
    name: tgUser?.first_name ? `${tgUser.first_name} ${tgUser.last_name || ''}`.trim() : '',
    photo: tgUser?.photo_url || null,
    
    // IDs (Backend logic ke liye)
    universityId: '',
    collegeCode: '',
    courseId: '',

    // 🔥 NAMES (Profile Display ke liye - NEW ADDITION)
    universityName: '',
    collegeName: '',
    courseName: '',
    
    mobile: '',
    email: ''
  });

  // --- 1. LOAD UNIVERSITIES ---
  useEffect(() => {
    fetch(STATIC_FILES.UNIVERSITIES)
      .then(res => res.json())
      .then(data => setUniversities(data))
      .catch(err => console.error(err));
  }, []);

  // --- 2. LOAD COLLEGES ---
  useEffect(() => {
    if (!formData.universityId) { setColleges([]); return; }
    
    setDataLoading(true);
    fetch(API_ENDPOINTS.GET_COLLEGES(formData.universityId), { headers: getSecureHeaders() })
    .then(res => res.json())
    .then(data => {
        if(data.STATUS_CODE === 200) setColleges(data.RESPONSE);
        else setColleges([]);
        setDataLoading(false);
    });
  }, [formData.universityId]);

  // --- 3. LOAD COURSES ---
  useEffect(() => {
    if (!formData.universityId) { setCourses([]); return; }

    fetch(API_ENDPOINTS.GET_COURSES(formData.universityId), { headers: getSecureHeaders() })
    .then(res => res.json())
    .then(data => {
        if(data.STATUS_CODE === 200) setCourses(data.RESPONSE);
    });
  }, [formData.universityId]);

  // --- HANDLERS ---

  // 🔥 SPECIAL HANDLERS TO SAVE NAMES
  const handleUniChange = (e) => {
      const id = e.target.value;
      const uni = universities.find(u => u.id.toString() === id);
      setFormData({
          ...formData,
          universityId: id,
          universityName: uni ? uni.name : '' // Name save karo
      });
  };

  const handleCollegeChange = (e) => {
      const code = e.target.value;
      const col = colleges.find(c => c.collegeCode === code);
      setFormData({
          ...formData,
          collegeCode: code,
          collegeName: col ? col.collegeName : '' // Name save karo
      });
  };

  const handleCourseChange = (e) => {
      const id = e.target.value;
      // Note: API structure ke hisab se check karna, yahan courseId match kar rahe hain
      const course = courses.find(c => c.courseId.toString() === id);
      setFormData({
          ...formData,
          courseId: id,
          courseName: course ? course.courseData.courseShortName : '' // Name save karo
      });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
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
            setError(data.MESSAGE || "Failed");
        }
    } catch (err) {
        setError("Connection Failed");
    } finally {
        setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm bg-white p-6 rounded-3xl shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-purple-600"></div>
      <div className="mb-6 text-center">
         <h2 className="text-2xl font-bold text-gray-800">Student Sign Up</h2>
      </div>

      {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-xs font-bold rounded-xl">{error}</div>}

      <form onSubmit={handleRegister} className="space-y-4">
        
        {/* Name Input */}
        <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 text-sm font-semibold" />

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
                <option value="">{dataLoading ? "Loading..." : "Select College"}</option>
                {colleges.map(c => <option key={c.collegeCode} value={c.collegeCode}>{c.collegeName}</option>)}
            </select>
        </div>

        {/* Course */}
        <div className="relative">
            <BookOpen size={18} className="absolute left-3.5 top-3.5 text-gray-400" />
            <select name="courseId" onChange={handleCourseChange} disabled={!formData.universityId} className="w-full pl-10 pr-8 py-3 bg-gray-50 rounded-xl border border-gray-200 outline-none text-sm font-medium text-gray-700 disabled:opacity-50">
                <option value="">Select Course</option>
                {courses.map(c => <option key={c.courseId} value={c.courseId}>{c.courseData.courseShortName}</option>)}
            </select>
        </div>

        {/* Mobile & Email */}
        <input type="tel" name="mobile" onChange={handleChange} placeholder="Mobile Number" className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 text-sm" />
        <input type="email" name="email" onChange={handleChange} placeholder="Email" className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 text-sm" />

        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl shadow-lg mt-4 flex justify-center gap-2">
            {loading ? <Loader2 className="animate-spin" /> : "Complete Registration"}
        </button>
      </form>
    </motion.div>
  );
};

export default SignupForm;
