import React, { useState, useEffect } from 'react';
import { Edit3, Check, X, Loader2, Shield } from 'lucide-react';

const ProfileField = ({ icon: Icon, label, value, fieldKey, locked, onSave, type = "text" }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);
  const [loading, setLoading] = useState(false);

  // Sync value when parent updates
  useEffect(() => { setTempValue(value); }, [value]);

  const handleSave = async () => {
    if (tempValue === value) { setIsEditing(false); return; }
    
    setLoading(true);
    const success = await onSave(fieldKey, tempValue); // API Call
    setLoading(false);
    
    if (success) setIsEditing(false);
  };

  const handleCancel = () => {
    setTempValue(value);
    setIsEditing(false);
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 flex items-center justify-between group transition-all hover:shadow-md mb-3">
      <div className="flex items-center gap-4 flex-1">
        {/* Icon */}
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${locked ? 'bg-gray-100 dark:bg-slate-700 text-gray-400' : 'bg-blue-50 dark:bg-slate-700/50 text-blue-600 dark:text-blue-400'}`}>
          <Icon size={18} />
        </div>

        {/* Text / Input */}
        <div className="flex-1">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">{label}</p>
          
          {isEditing ? (
            <input 
              type={type} 
              value={tempValue} 
              onChange={(e) => setTempValue(e.target.value)}
              className="w-full bg-gray-50 dark:bg-slate-900 border border-blue-200 dark:border-blue-900 rounded-lg px-2 py-1 text-sm font-semibold text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              autoFocus
            />
          ) : (
            <p className={`text-sm font-semibold ${locked ? 'text-gray-500 dark:text-gray-400' : 'text-gray-800 dark:text-white'}`}>
              {value || <span className="text-gray-300 italic">Not Set</span>}
            </p>
          )}
        </div>
      </div>

      {/* Buttons */}
      <div className="ml-3">
        {locked ? (
          <Shield size={16} className="text-gray-300 dark:text-slate-600" />
        ) : isEditing ? (
          <div className="flex gap-2">
            <button onClick={handleCancel} className="p-1.5 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-lg"><X size={16}/></button>
            <button onClick={handleSave} disabled={loading} className="p-1.5 bg-green-50 dark:bg-green-900/20 text-green-600 rounded-lg flex items-center">
                {loading ? <Loader2 size={16} className="animate-spin"/> : <Check size={16}/>}
            </button>
          </div>
        ) : (
          <button onClick={() => setIsEditing(true)} className="p-2 bg-gray-50 dark:bg-slate-700 text-gray-400 hover:text-blue-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
            <Edit3 size={16}/>
          </button>
        )}
      </div>
    </div>
  );
};

export default ProfileField;
