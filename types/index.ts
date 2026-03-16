export interface NewsDataType {
  article_id: string;
  title: string;
  link: string;
  keywords: string[];
  creator: null;
  video_url: null;
  description: string;
  content: string;
  pubDate: string;
  image_url: string;
  source_id: string;
  source_priority: number;
  source_name: string;
  source_url: string;
  source_icon: string;
  language: string;
  country: string[];
  category: string[];
  ai_tag: string[];
  ai_region: string[];
  ai_org: null;
  sentiment: string;
  sentiment_stats: Sentimentstats;
  duplicate: boolean;
}

interface Sentimentstats {
  positive: number;
  neutral: number;
  negative: number;
}

export interface User {
  id: string;
  name: string;
  avatarUrl: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface NewsItem {
  id: string;
  title: string;
  category: string;
  author: string;
  imageUrl: string;
  date: string;
  content?: string; // Tambahan untuk detail
  link?: string;
}