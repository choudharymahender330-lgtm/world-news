import { motion } from 'framer-motion';
import { ExternalLink, Clock, User } from 'lucide-react';
import { NewsArticle } from '../lib/newsApi';

interface NewsCardProps {
  article: NewsArticle;
  index: number;
}

export default function NewsCard({ article, index }: NewsCardProps) {
  const formattedDate = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : '';

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="group relative bg-white/5 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/10 hover:border-indigo-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10"
    >
      {/* Image */}
      {article.image && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-60" />
        </div>
      )}

      {/* Content */}
      <div className="p-5">
        {/* Source */}
        {article.source && (
          <div className="flex items-center gap-2 mb-3">
            <div className="px-2 py-1 bg-indigo-500/20 rounded-md">
              <span className="text-xs font-medium text-indigo-300">{article.source}</span>
            </div>
          </div>
        )}

        {/* Title */}
        <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2 group-hover:text-indigo-300 transition-colors">
          {article.title}
        </h3>

        {/* Description */}
        {article.description && (
          <p className="text-sm text-slate-400 line-clamp-2 mb-4">
            {article.description}
          </p>
        )}

        {/* Meta */}
        <div className="flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-4">
            {formattedDate && (
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{formattedDate}</span>
              </div>
            )}
            {article.author && (
              <div className="flex items-center gap-1">
                <User className="w-3 h-3" />
                <span className="truncate max-w-[100px]">{article.author}</span>
              </div>
            )}
          </div>

          <motion.a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 bg-white/5 rounded-lg hover:bg-indigo-500/20 transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </motion.a>
        </div>
      </div>
    </motion.article>
  );
}