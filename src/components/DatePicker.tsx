import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ChevronLeft, ChevronRight, Clock } from 'lucide-react';

interface DatePickerProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function DatePicker({ selectedDate, onDateSelect, minDate, maxDate }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [viewMonth, setViewMonth] = useState(selectedDate.getMonth());
  const [viewYear, setViewYear] = useState(selectedDate.getFullYear());
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const isSameDay = (date1: Date, date2: Date) => {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  };

  const isDateDisabled = (date: Date) => {
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return false;
  };

  const handleDateClick = (day: number) => {
    const newDate = new Date(viewYear, viewMonth, day);
    if (!isDateDisabled(newDate)) {
      onDateSelect(newDate);
      setIsOpen(false);
    }
  };

  const goToPreviousMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(viewMonth, viewYear);
    const firstDay = getFirstDayOfMonth(viewMonth, viewYear);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="w-8 h-8" />);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(viewYear, viewMonth, day);
      const isSelected = isSameDay(date, selectedDate);
      const isDisabled = isDateDisabled(date);
      const isToday = isSameDay(date, new Date());

      days.push(
        <button
          key={day}
          onClick={() => handleDateClick(day)}
          disabled={isDisabled}
          className={`w-8 h-8 rounded-lg text-sm font-medium transition-all
            ${isSelected 
              ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white' 
              : isToday
                ? 'bg-indigo-500/20 text-indigo-300'
                : 'text-slate-300 hover:bg-white/10'
            }
            ${isDisabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (isSameDay(date, today)) return 'Today';
    if (isSameDay(date, yesterday)) return 'Yesterday';
    
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
    });
  };

  return (
    <div ref={dropdownRef} className="relative">
      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 hover:border-indigo-500/30 transition-all duration-200"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/20 rounded-lg">
            <Calendar className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-left">
            <div className="font-medium text-white">{formatDate(selectedDate)}</div>
            <div className="text-xs text-slate-400">
              {selectedDate.toDateString() === new Date().toDateString() ? 'Latest News' : 'Historical News'}
            </div>
          </div>
        </div>
        <ChevronRight className={`w-5 h-5 text-slate-400 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 mt-2 p-4 bg-slate-900/95 backdrop-blur-xl rounded-xl border border-white/10 shadow-2xl"
          >
            {/* Month/Year Header */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={goToPreviousMonth}
                className="p-1 hover:bg-white/10 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-slate-400" />
              </button>
              <div className="text-sm font-semibold text-white">
                {MONTHS[viewMonth]} {viewYear}
              </div>
              <button
                onClick={goToNextMonth}
                className="p-1 hover:bg-white/10 rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {DAYS.map(day => (
                <div key={day} className="w-8 h-6 flex items-center justify-center text-xs font-medium text-slate-500">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {renderCalendarDays()}
            </div>

            {/* Quick Actions */}
            <div className="mt-4 pt-3 border-t border-white/10 flex gap-2">
              <button
                onClick={() => {
                  onDateSelect(new Date());
                  setIsOpen(false);
                }}
                className="flex-1 px-3 py-2 bg-indigo-500/20 text-indigo-300 text-xs font-medium rounded-lg hover:bg-indigo-500/30 transition-colors"
              >
                Today
              </button>
              <button
                onClick={() => {
                  const yesterday = new Date();
                  yesterday.setDate(yesterday.getDate() - 1);
                  onDateSelect(yesterday);
                  setIsOpen(false);
                }}
                className="flex-1 px-3 py-2 bg-white/5 text-slate-300 text-xs font-medium rounded-lg hover:bg-white/10 transition-colors"
              >
                Yesterday
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}