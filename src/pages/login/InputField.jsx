import React from 'react';
import { Lock } from 'lucide-react';

const InputField = ({ label, name, value, onChange, icon: Icon, disabled = false, type = "text" }) => {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase ml-1 flex justify-between">
        {label}
        {disabled && <span className="text-[10px] text-red-400 flex items-center gap-1"><Lock size={10} /> Locked</span>}
      </label>
      <div className="relative group">
        <div className={`absolute left-3 top-3.5 ${disabled ? 'text-gray-400' : 'text-blue-500 group-focus-within:text-blue-600'}`}>
          <Icon size={18} />
        </div>
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm font-semibold transition-all outline-none
            ${disabled 
              ? 'bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed dark:bg-slate-800 dark:border-slate-700 dark:text-slate-500' 
              : 'bg-white border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:bg-slate-900 dark:border-slate-700 dark:text-white dark:focus:border-blue-400'
            }
          `}
        />
      </div>
    </div>
  );
};

export default InputField;
