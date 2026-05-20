import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Search, Check, Globe } from 'lucide-react';
import { Country, getRegions } from '../data/countries';

interface CountrySelectProps {
  countries: Country[];
  selectedCountry: Country;
  onSelect: (country: Country) => void;
}

export default function CountrySelect({ countries, selectedCountry, onSelect }: CountrySelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(search.toLowerCase()) ||
    country.code.toLowerCase().includes(search.toLowerCase())
  );

  const regions = getRegions();
  
  const groupedCountries = regions.reduce((acc, region) => {
    acc[region] = filteredCountries.filter(c => c.region === region);
    return acc;
  }, {} as Record<string, Country[]>);

  return (
    <div ref={dropdownRef} className="relative">
      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 hover:border-indigo-500/30 transition-all duration-200"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{selectedCountry.flag}</span>
          <div className="text-left">
            <div className="font-medium text-white">{selectedCountry.name}</div>
            <div className="text-xs text-slate-400">{selectedCountry.region}</div>
          </div>
        </div>
        <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 w-full mt-2 bg-slate-900/95 backdrop-blur-xl rounded-xl border border-white/10 shadow-2xl overflow-hidden"
          >
            <div className="p-3 border-b border-white/5">
              <div className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-lg">
                <Search className="w-4 h-4 text-slate-400" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search 195 countries..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-transparent border-none outline-none text-sm text-white placeholder-slate-400 w-full"
                />
              </div>
            </div>
            
            <div className="max-h-80 overflow-y-auto">
              {search === '' ? (
                // Grouped view when not searching
                regions.map((region) => {
                  const regionCountries = groupedCountries[region];
                  if (regionCountries.length === 0) return null;
                  
                  return (
                    <div key={region}>
                      <div className="px-4 py-2 bg-white/5 text-xs font-semibold text-slate-500 uppercase tracking-wider sticky top-0">
                        {region} ({regionCountries.length})
                      </div>
                      {regionCountries.map((country) => (
                        <motion.button
                          key={country.code}
                          whileHover={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
                          onClick={() => {
                            onSelect(country);
                            setIsOpen(false);
                            setSearch('');
                          }}
                          className={`w-full flex items-center justify-between px-4 py-2.5 transition-colors ${
                            selectedCountry.code === country.code ? 'bg-indigo-500/10' : ''
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-lg">{country.flag}</span>
                            <div className="text-left">
                              <div className="text-sm font-medium text-white">{country.name}</div>
                            </div>
                          </div>
                          {selectedCountry.code === country.code && (
                            <Check className="w-4 h-4 text-indigo-400" />
                          )}
                        </motion.button>
                      ))}
                    </div>
                  );
                })
              ) : (
                // Flat list when searching
                filteredCountries.length > 0 ? (
                  filteredCountries.map((country) => (
                    <motion.button
                      key={country.code}
                      whileHover={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
                      onClick={() => {
                        onSelect(country);
                        setIsOpen(false);
                        setSearch('');
                      }}
                      className={`w-full flex items-center justify-between px-4 py-2.5 transition-colors ${
                        selectedCountry.code === country.code ? 'bg-indigo-500/10' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{country.flag}</span>
                        <div className="text-left">
                          <div className="text-sm font-medium text-white">{country.name}</div>
                          <div className="text-xs text-slate-500">{country.region}</div>
                        </div>
                      </div>
                      {selectedCountry.code === country.code && (
                        <Check className="w-4 h-4 text-indigo-400" />
                      )}
                    </motion.button>
                  ))
                ) : (
                  <div className="px-4 py-8 text-center">
                    <Globe className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                    <p className="text-sm text-slate-400">No countries found</p>
                  </div>
                )
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-2 bg-white/5 border-t border-white/5 text-center">
              <span className="text-xs text-slate-500">
                {countries.length} countries worldwide
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
