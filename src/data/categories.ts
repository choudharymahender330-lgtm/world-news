export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export const categories: Category[] = [
  { id: 'general', name: 'General', icon: '📰', description: 'Top headlines and breaking news' },
  { id: 'world', name: 'World', icon: '🌍', description: 'International news and global events' },
  { id: 'nation', name: 'Nation', icon: '🏛️', description: 'National news and politics' },
  { id: 'business', name: 'Business', icon: '💼', description: 'Markets, finance and economy' },
  { id: 'technology', name: 'Technology', icon: '💻', description: 'Tech news and innovations' },
  { id: 'entertainment', name: 'Entertainment', icon: '🎬', description: 'Movies, music and pop culture' },
  { id: 'sports', name: 'Sports', icon: '⚽', description: 'Sports news and scores' },
  { id: 'science', name: 'Science', icon: '🔬', description: 'Scientific discoveries and research' },
  { id: 'health', name: 'Health', icon: '🏥', description: 'Health and wellness news' },
];

export const getCategoryById = (id: string): Category | undefined => {
  return categories.find(c => c.id === id);
};
