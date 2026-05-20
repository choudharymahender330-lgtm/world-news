import { motion } from 'framer-motion';
import { MapPin, TrendingUp, Clock } from 'lucide-react';
import { Country } from '../data/countries';

interface HeroSectionProps {
  selectedCountry: Country;
}

export default function HeroSection({ selectedCountry }: HeroSectionProps) {
  return (
    <section className="relative min-h-[40vh] flex items-center justify-center overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="relative z-10 text-center px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <motion.div 
              className="text-6xl"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              {selectedCountry.flag}
            </motion.div>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-white via-indigo-200 to-purple-200 bg-clip-text text-transparent">
              News from
            </span>
            <br />
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              {selectedCountry.name}
            </span>
          </h1>
          
          <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-8">
            Stay informed with the latest headlines, breaking news, and stories from {selectedCountry.name} and around the world.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-400">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
              <MapPin className="w-4 h-4 text-indigo-400" />
              <span>{selectedCountry.region}</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
              <TrendingUp className="w-4 h-4 text-purple-400" />
              <span>Top Headlines</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span>Updated Live</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}