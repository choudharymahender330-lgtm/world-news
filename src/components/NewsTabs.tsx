import { motion } from 'framer-motion';
import { Zap, Archive, Clock } from 'lucide-react';

export type NewsTab = 'latest' | 'archive';

interface NewsTabsProps {
  activeTab: NewsTab;
  onTabChange: (tab: NewsTab) => void;
}

export default function NewsTabs({ activeTab, onTabChange }: NewsTabsProps) {
  return (
    <div className="flex items-center gap-2 p-1 bg-white/5 rounded-xl border border-white/10">
      <button
        onClick={() => onTabChange('latest')}
        className={`relative flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
          activeTab === 'latest'
            ? 'text-white'
            : 'text-slate-400 hover:text-slate-300'
        }`}
      >
        {activeTab === 'latest' && (
          <motion.div
            layoutId="activeTab"
            className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg"
            transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
          />
        )}
        <Zap className="w-4 h-4 relative z-10" />
        <span className="relative z-10">Latest News</span>
      </button>
      
      <button
        onClick={() => onTabChange('archive')}
        className={`relative flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
          activeTab === 'archive'
            ? 'text-white'
            : 'text-slate-400 hover:text-slate-300'
        }`}
      >
        {activeTab === 'archive' && (
          <motion.div
            layoutId="activeTab"
            className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg"
            transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
          />
        )}
        <Archive className="w-4 h-4 relative z-10" />
        <span className="relative z-10">Previous Days</span>
      </button>
    </div>
  );
}