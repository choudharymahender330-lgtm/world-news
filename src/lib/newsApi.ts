export interface NewsArticle {
  title: string;
  description: string | null;
  url: string;
  image: string | null;
  publishedAt: string | null;
  source: string | null;
  author: string | null;
}

// Free API keys (these are public demo keys with limited requests)
const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY || '';
const GNEWS_API_KEY = import.meta.env.VITE_GNEWS_API_KEY || '';
const CURRENTS_API_KEY = import.meta.env.VITE_CURRENTS_API_KEY || '';

// RSS feed URLs for different countries (no API key needed)
const RSS_FEEDS: Record<string, string[]> = {
  us: [
    'https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml',
    'https://feeds.npr.org/1001/rss.xml',
    'https://www.theguardian.com/world/rss',
  ],
  gb: [
    'https://feeds.bbci.co.uk/news/rss.xml',
    'https://www.theguardian.com/uk/rss',
    'https://www.independent.co.uk/news/uk/rss',
  ],
  de: [
    'https://www.spiegel.de/international/index.rss',
    'https://www.dw.com/en/top-stories/s-3069/rss',
  ],
  fr: [
    'https://www.france24.com/en/rss',
    'https://www.lemonde.fr/en/rss.xml',
  ],
  jp: [
    'https://www3.nhk.or.jp/rss/news/cat0.xml',
    'https://www.japantimes.co.jp/feed/',
  ],
  in: [
    'https://timesofindia.indiatimes.com/rssfeedstopstories.cms',
    'https://www.thehindu.com/feeder/default.rss',
  ],
  au: [
    'https://www.abc.net.au/news/feed/51120/rss.xml',
    'https://www.theguardian.com/au/rss',
  ],
  ca: [
    'https://www.cbc.ca/webfeed/rss/rss-canada',
    'https://www.theglobeandmail.com/arc/outboundfeeds/rss/category/canada/',
  ],
  br: [
    'https://feeds.folha.uol.com.br/folha/emcimadahora/rss091.xml',
  ],
  ru: [
    'https://www.moscowtimes.ru/rss/news',
  ],
  cn: [
    'https://www.scmp.com/rss/91/feed',
  ],
  default: [
    'https://feeds.bbci.co.uk/news/rss.xml',
    'https://www.theguardian.com/world/rss',
  ],
};

// CORS proxy for RSS feeds
const CORS_PROXIES = [
  'https://api.allorigins.win/raw?url=',
  'https://corsproxy.io/?',
];

// Parse RSS feed XML
function parseRSS(xmlText: string, feedSource: string): NewsArticle[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlText, 'text/xml');
  const items = doc.querySelectorAll('item');
  const articles: NewsArticle[] = [];

  items.forEach((item, index) => {
    const title = item.querySelector('title')?.textContent || '';
    const description = item.querySelector('description')?.textContent || '';
    const link = item.querySelector('link')?.textContent || '';
    const pubDate = item.querySelector('pubDate')?.textContent || '';
    const mediaContent = item.querySelector('content');
    const enclosure = item.querySelector('enclosure[type^="image"]');
    
    let image = null;
    if (mediaContent) {
      image = mediaContent.getAttribute('url');
    } else if (enclosure) {
      image = enclosure.getAttribute('url');
    }

    // Clean up description (remove HTML tags)
    const cleanDescription = description.replace(/<[^>]*>/g, '').trim();

    articles.push({
      title: title.replace(/<[^>]*>/g, '').trim(),
      description: cleanDescription.substring(0, 300) || null,
      url: link,
      image: image,
      publishedAt: pubDate ? new Date(pubDate).toISOString() : null,
      source: feedSource,
      author: null,
    });
  });

  return articles;
}

// Fetch news from RSS feeds (no API key needed)
async function fetchFromRSS(country: string): Promise<NewsArticle[]> {
  const feeds = RSS_FEEDS[country] || RSS_FEEDS['default'];
  const articles: NewsArticle[] = [];

  for (const feedUrl of feeds) {
    try {
      // Try each CORS proxy
      for (const proxy of CORS_PROXIES) {
        try {
          const response = await fetch(proxy + encodeURIComponent(feedUrl), {
            headers: {
              'Accept': 'application/xml, text/xml, */*',
            },
          });
          
          if (response.ok) {
            const text = await response.text();
            const feedName = new URL(feedUrl).hostname.replace('www.', '');
            const feedArticles = parseRSS(text, feedName);
            articles.push(...feedArticles);
            break; // Success, move to next feed
          }
        } catch {
          continue; // Try next proxy
        }
      }
    } catch (error) {
      console.warn(`Failed to fetch RSS feed: ${feedUrl}`);
    }
  }

  // Remove duplicates by URL
  const uniqueArticles = articles.filter((article, index, self) =>
    article.url && index === self.findIndex(a => a.url === article.url)
  );

  // Sort by date
  uniqueArticles.sort((a, b) => {
    if (!a.publishedAt) return 1;
    if (!b.publishedAt) return -1;
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
  });

  return uniqueArticles.slice(0, 20);
}

// Fetch from Currents API
async function fetchFromCurrents(country: string, category: string): Promise<NewsArticle[]> {
  if (!CURRENTS_API_KEY) return [];

  try {
    const params = new URLSearchParams({
      language: 'en',
      country: country.toUpperCase(),
      category: category === 'general' ? 'world' : category,
      apiKey: CURRENTS_API_KEY,
    });

    const response = await fetch(`https://api.currentsapi.services/v1/search?${params}`);
    const data = await response.json();

    return data.news?.map((article: any) => ({
      title: article.title,
      description: article.description,
      url: article.url,
      image: article.image || null,
      publishedAt: article.published,
      source: article.source || null,
      author: article.author || null,
    })) || [];
  } catch (error) {
    console.error('Currents API error:', error);
    return [];
  }
}

// Fetch from GNews API
async function fetchFromGNews(country: string, category: string): Promise<NewsArticle[]> {
  if (!GNEWS_API_KEY) return [];

  try {
    const params = new URLSearchParams({
      token: GNEWS_API_KEY,
      country,
      topic: category,
      max: '15',
      lang: 'en',
    });

    const response = await fetch(`https://gnews.io/api/v4/top-headlines?${params}`);
    const data = await response.json();

    return data.articles?.map((article: any) => ({
      title: article.title,
      description: article.description,
      url: article.url,
      image: article.image,
      publishedAt: article.publishedAt,
      source: article.source?.name || null,
      author: null,
    })) || [];
  } catch (error) {
    console.error('GNews API error:', error);
    return [];
  }
}

// Fetch from NewsAPI
async function fetchFromNewsAPI(country: string, category: string): Promise<NewsArticle[]> {
  if (!NEWS_API_KEY) return [];

  try {
    const params = new URLSearchParams({
      country,
      category,
      apiKey: NEWS_API_KEY,
      pageSize: '15',
    });

    const response = await fetch(`https://newsapi.org/v2/top-headlines?${params}`);
    const data = await response.json();

    return data.articles?.map((article: any) => ({
      title: article.title,
      description: article.description,
      url: article.url,
      image: article.urlToImage,
      publishedAt: article.publishedAt,
      source: article.source?.name || null,
      author: article.author,
    })) || [];
  } catch (error) {
    console.error('NewsAPI error:', error);
    return [];
  }
}

// Main function to fetch news from all available sources
export async function fetchNews(
  country: string,
  category: string,
  date?: Date
): Promise<NewsArticle[]> {
  // Try multiple sources in parallel
  const [rssArticles, currentsArticles, gnewsArticles, newsApiArticles] = await Promise.all([
    fetchFromRSS(country),
    fetchFromCurrents(country, category),
    fetchFromGNews(country, category),
    fetchFromNewsAPI(country, category),
  ]);

  // Combine all articles
  const allArticles = [
    ...gnewsArticles,
    ...currentsArticles,
    ...newsApiArticles,
    ...rssArticles,
  ];

  // Remove duplicates by title similarity
  const uniqueArticles: NewsArticle[] = [];
  const seenTitles = new Set<string>();

  for (const article of allArticles) {
    const normalizedTitle = article.title.toLowerCase().substring(0, 50);
    if (!seenTitles.has(normalizedTitle)) {
      seenTitles.add(normalizedTitle);
      uniqueArticles.push(article);
    }
  }

  // Filter by date if specified
  let filteredArticles = uniqueArticles;
  if (date) {
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);
    const nextDate = new Date(targetDate);
    nextDate.setDate(nextDate.getDate() + 1);

    filteredArticles = uniqueArticles.filter(article => {
      if (!article.publishedAt) return false;
      const articleDate = new Date(article.publishedAt);
      return articleDate >= targetDate && articleDate < nextDate;
    });
  }

  // Sort by date
  filteredArticles.sort((a, b) => {
    if (!a.publishedAt) return 1;
    if (!b.publishedAt) return -1;
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
  });

  // Return results or demo if empty
  if (filteredArticles.length > 0) {
    return filteredArticles.slice(0, 30);
  }

  // Fallback to demo news
  return getDemoNews(country, category, date);
}

export function getDemoNews(country: string, category: string, date?: Date): NewsArticle[] {
  const countryName = country.charAt(0).toUpperCase() + country.slice(1);
  const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
  const dateStr = date 
    ? date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : 'today';

  const baseIndex = date ? date.getDate() : 0;

  const headlines = [
    `${countryName} Government Announces New Policy Initiative`,
    `Breaking: Major Economic Developments in ${countryName}`,
    `${countryName} Leads Regional Cooperation Summit`,
    `Historic Agreement Signed in ${countryName}`,
    `${countryName} Reports Strong Economic Growth`,
    `New Infrastructure Project Launched in ${countryName}`,
    `${countryName} Celebrates National Achievement`,
    `International Partnership Formed with ${countryName}`,
    `${countryName} Unveils Ambitious Climate Goals`,
    `Breaking: ${categoryName} Sector Booms in ${countryName}`,
    `${countryName} Tech Industry Reaches New Milestone`,
    `Cultural Festival Draws Millions in ${countryName}`,
  ];

  const descriptions = [
    `In a significant development, officials announced comprehensive reforms aimed at boosting growth and prosperity across the nation.`,
    `The latest reports indicate unprecedented progress in key sectors, with analysts predicting continued momentum.`,
    `World leaders gathered to discuss regional cooperation and shared initiatives for sustainable development.`,
    `A landmark agreement was signed today, marking a new chapter in international relations and cooperation.`,
    `Economic indicators show remarkable improvement, with GDP growth exceeding expectations for the quarter.`,
    `Construction has begun on a major infrastructure project that will transform transportation and connectivity.`,
    `Citizens across the nation celebrate a momentous achievement that showcases the country's progress.`,
    `A new international partnership promises to bring investment and expertise to key development projects.`,
    `Environmental commitments have been strengthened with ambitious new targets for carbon reduction.`,
    `The ${categoryName.toLowerCase()} sector continues to show impressive growth, creating jobs and opportunities.`,
    `Technology innovation reaches new heights with groundbreaking developments in AI and renewable energy.`,
    `The annual cultural festival showcases the rich heritage and diverse traditions of the nation.`,
  ];

  const sources = [
    'Global News Network',
    'Daily Tribune',
    'World Press',
    'International Herald',
    'National Observer',
    'Times Report',
    'News Daily',
    'The Chronicle',
    'Morning Post',
    'Evening Standard',
  ];

  const images = [
    'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80',
    'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80',
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
    'https://images.unsplash.com/photo-1569163139599-0f4517e36f51?w=800&q=80',
    'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&q=80',
    'https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?w=800&q=80',
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80',
    'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80',
    'https://images.unsplash.com/photo-1521295121783-8a321d551ad2?w=800&q=80',
    'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=800&q=80',
    'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80',
    'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80',
  ];

  const authors = [
    'John Smith',
    'Sarah Johnson',
    'Michael Chen',
    'Emma Wilson',
    'David Park',
    'Lisa Thompson',
    'Robert Kim',
    'Amanda Lee',
    'Jennifer Brown',
    'Mark Williams',
  ];

  const articles: NewsArticle[] = [];
  const numArticles = 10 + (baseIndex % 5);

  for (let i = 0; i < numArticles; i++) {
    const hourOffset = i * 2 + baseIndex;
    const articleDate = date ? new Date(date) : new Date();
    articleDate.setHours(12 - hourOffset, 0, 0, 0);

    const headlineIndex = (i + baseIndex) % headlines.length;
    const descIndex = (i + baseIndex + 3) % descriptions.length;

    articles.push({
      title: headlines[headlineIndex],
      description: descriptions[descIndex],
      url: '#',
      image: images[(i + baseIndex) % images.length],
      publishedAt: articleDate.toISOString(),
      source: sources[(i + baseIndex) % sources.length],
      author: authors[(i + baseIndex) % authors.length],
    });
  }

  return articles;
}
