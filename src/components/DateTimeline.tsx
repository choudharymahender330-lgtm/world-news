import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface DateTimelineProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  daysToShow?: number;
}

export default function DateTimeline({ selectedDate, onDateSelect, daysToShow = 7 }: DateTimelineProps) {
  const generateDates = () => {
    const dates: Date[] = [];
    const today = new Date();
    
    for (let i = 0; i < daysToShow; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      dates.push(date);
    }
    
    return dates;
  };

  const dates = generateDates();

  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    
    return date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' });
  };

  const isSameDay = (date1: Date, date2: Date) => {
    return date1.toDateString() === date2.toDateString();
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {dates.map((date, index) => {
          const isSelected = isSameDay(date, selectedDate);
          const isToday = isSameDay(date, new Date());
          
          return (
            <motion.button
              key={date.toISOString()}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.03 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onDateSelect(date)}
              className={`flex-shrink-0 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isSelected
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/25'
                  : isToday
                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10'
              }`}
            >
              <div className="text-xs opacity-70 mb-1">{formatDate(date)}</div>
              <div className="font-bold">{date.getDate()}</div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}