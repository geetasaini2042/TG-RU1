import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const CustomCalendar = ({ value, onChange, onClose }) => {
  // Parse initial date or default to 2005 (approx 18-20 years old)
  const initialDate = value ? new Date(value) : new Date('2005-01-01');
  
  const [currentDate, setCurrentDate] = useState(initialDate);
  const [view, setView] = useState('days'); // 'days' | 'years' | 'months'
  const [direction, setDirection] = useState(0);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Helpers
  const getDaysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
  const getFirstDayOfMonth = (y, m) => new Date(y, m, 1).getDay();

  const changeMonth = (increment) => {
    setDirection(increment);
    setCurrentDate(new Date(year, month + increment, 1));
  };

  const selectDate = (day) => {
    // Format: YYYY-MM-DD
    const formattedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    onChange(formattedDate);
    onClose();
  };

  // --- SUB-VIEWS ---

  // 1. Days View (Calendar Grid)
  const renderDays = () => {
    const daysInMonth = getDaysInMonth(year, month);
    const startDay = getFirstDayOfMonth(year, month);
    const blanks = Array(startDay).fill(null);
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    return (
      <motion.div 
        key={year + month}
        initial={{ x: direction * 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -direction * 50, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="grid grid-cols-7 gap-1"
      >
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
          <div key={d} className="text-center text-xs font-bold text-slate-400 py-2">{d}</div>
        ))}
        {blanks.map((_, i) => <div key={`b-${i}`} />)}
        {days.map(day => {
          const isSelected = value && 
            parseInt(value.split('-')[2]) === day && 
            parseInt(value.split('-')[1]) - 1 === month && 
            parseInt(value.split('-')[0]) === year;

          return (
            <div 
              key={day} 
              onClick={() => selectDate(day)}
              className={`h-9 w-9 rounded-full flex items-center justify-center text-sm font-medium cursor-pointer transition-all
              ${isSelected 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/40' 
                : 'text-slate-700 hover:bg-indigo-50 hover:text-indigo-600'}`}
            >
              {day}
            </div>
          );
        })}
      </motion.div>
    );
  };

  // 2. Years View (Scrollable List)
  const renderYears = () => {
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 100 }, (_, i) => currentYear - i); // Last 100 years

    return (
      <div className="h-64 overflow-y-auto no-scrollbar grid grid-cols-4 gap-2 content-start">
        {years.map(y => (
          <button
            key={y}
            onClick={() => {
              setCurrentDate(new Date(y, month, 1));
              setView('days');
            }}
            className={`py-2 rounded-lg text-sm font-semibold transition-colors
            ${y === year ? 'bg-indigo-100 text-indigo-700' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            {y}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="p-4 bg-white w-full max-w-xs mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 px-1">
        <button 
          onClick={() => changeMonth(-1)} disabled={view !== 'days'}
          className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 disabled:opacity-0"
        >
          <ChevronLeft size={20} />
        </button>

        <div className="flex gap-1">
          <button 
            onClick={() => setView(view === 'years' ? 'days' : 'years')}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-slate-100 text-slate-800 font-bold text-base transition-colors"
          >
            {MONTHS[month]} {year} 
            <ChevronDown size={14} className={`transition-transform ${view === 'years' ? 'rotate-180' : ''}`}/>
          </button>
        </div>

        <button 
          onClick={() => changeMonth(1)} disabled={view !== 'days'}
          className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 disabled:opacity-0"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Body */}
      <div className="min-h-[280px]">
        <AnimatePresence mode="wait">
          {view === 'days' ? renderDays() : renderYears()}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="flex justify-end pt-4 border-t border-slate-100 mt-2">
         <button onClick={onClose} className="text-sm font-bold text-slate-500 hover:text-slate-800 px-4">Close</button>
      </div>
    </div>
  );
};

export default CustomCalendar;
