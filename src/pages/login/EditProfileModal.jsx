import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Phone, Mail, BookOpen, X, Check, Loader2 } from 'lucide-react';
import InputField from './InputField';

const EditProfileModal = ({ user, onClose, onSave }) => {
  const [formData, setFormData] = useState(user);
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    // Haptic Feedback
    if(window.Telegram?.WebApp?.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
    }

    setSaving(true);
    // API Call Simulation
    setTimeout(() => {
        onSave(formData);
        setSaving(false);
        onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-slate-700"
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center">
            <h3 className="font-bold text-lg text-gray-800 dark:text-white">Edit Details</h3>
            <button onClick={onClose} className="p-2 bg-gray-100 dark:bg-slate-800 rounded-full text-gray-500 hover:bg-gray-200 dark:hover:bg-slate-700">
                <X size={18} />
            </button>
        </div>

        {/* Scrollable Form Area */}
        <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto">
            <div className="flex justify-center mb-2">
                <img src={formData.photo} alt="Avatar" className="w-20 h-20 rounded-full border-4 border-blue-100 dark:border-slate-700" />
            </div>

            <InputField label="Full Name" name="name" value={formData.name} onChange={handleChange} icon={User} />
            
            {/* LOCKED FIELDS */}
            <InputField label="Mobile Number" name="mobile" value={formData.mobile} disabled icon={Phone} />
            <InputField label="Email Address" name="email" value={formData.email} disabled icon={Mail} />
            <InputField label="University" name="university" value={formData.university} disabled icon={BookOpen} />
            
            <InputField label="Current Course" name="course" value={formData.course} onChange={handleChange} icon={BookOpen} />
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 dark:bg-slate-950 border-t border-gray-100 dark:border-slate-800 flex gap-3">
            <button onClick={onClose} className="flex-1 py-3 rounded-xl font-bold text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
                Cancel
            </button>
            <button 
                onClick={handleSave} 
                disabled={saving}
                className="flex-1 py-3 rounded-xl font-bold bg-blue-600 text-white shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 active:scale-95 transition-transform"
            >
                {saving ? <Loader2 className="animate-spin" size={18} /> : <><Check size={18} /> Save Changes</>}
            </button>
        </div>
      </motion.div>
    </div>
  );
};

export default EditProfileModal;
