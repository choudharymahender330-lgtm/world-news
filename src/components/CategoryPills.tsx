import { motion } from 'framer-motion';
import { Category } from '../data/categories';

interface CategoryPillsProps {
  categories: Category[];
  selectedCategory: Category;
  onSelect: (category: Category) => void;
}

export default function CategoryPills({ categories, selectedCategory, onSelect }: CategoryPillsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category, index) => {
        const isSelected = selectedCategory.id === category.id;
        return (
          <motion.button
            key={category.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.03 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
              isSelected
                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/25'
                : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10'
            }`}
          >
            <span>{category.icon}</span>
            <span>{category.name}</span>
          </motion.button>
        );
      })}
    </div>
  );
}