import { fetch } from 'expo/fetch';
import { NewsItem } from '../types';

const API_KEY = 'pub_4c375465639a41ee9e1342bddacdc542'; // Pastikan API Key valid
const BASE_URL = 'https://newsdata.io/api/1/latest';

const mapArticleToNewsItem = (article: any): NewsItem => {
  return {
    id: article.article_id,
    title: article.title,
    category: article.category ? article.category[0] : 'General', 
    author: article.creator ? article.creator[0] : article.source_id,
    imageUrl: article.image_url || 'https://via.placeholder.com/400x300?text=No+Image',
    date: article.pubDate,
    content: article.content || article.description || 'No content available.',
    link: article.link,
  };
};

// Interface untuk parameter pencarian yang lebih detail
export interface SearchParams {
  q?: string;
  country?: string[]; // Array of codes: ['id', 'us']
  category?: string[]; // Array of categories: ['technology', 'business']
}

// Menerima parameter category
export const fetchTopNews = async (category?: string): Promise<NewsItem[]> => {
  try {
    // Default parameter sesuai request: country=id, language=id
    let params = `apikey=${API_KEY}&country=id&language=id`;

    // Jika kategori ada dan bukan 'top' (default awal), tambahkan param category
    // Catatan: 'top' juga merupakan kategori valid di NewsData.io, jadi bisa langsung dipass
    if (category && category !== 'all') {
      params += `&category=${category}`;
    } else {
        // Jika 'all', kita bisa set default category ke 'top' atau biarkan kosong (tergantung preferensi)
        params += `&category=top`; 
    }

    const url = `${BASE_URL}?${params}`;
    
    console.log("Fetching URL:", url); // Debugging URL

    const response = await fetch(url);
    const json = await response.json();

    if (json.status === 'success') {
      return json.results.map(mapArticleToNewsItem);
    }
    return [];
  } catch (error) {
    console.error('Error fetching news:', error);
    return [];
  }
};

export const fetchNewsById = async (id: string): Promise<NewsItem | null> => {
  try {
    // Menggunakan endpoint khusus jika ID spesifik (perlu dukungan plan di NewsData)
    // Atau mencari di latest dengan param id
    const url = `${BASE_URL}?apikey=${API_KEY}&id=${id}`; 
    const response = await fetch(url);
    const json = await response.json();

    if (json.status === 'success' && json.results.length > 0) {
      return mapArticleToNewsItem(json.results[0]);
    }
    return null;
  } catch (error) {
    console.error('Error fetching article details:', error);
    return null;
  }
};

export const searchNews = async (query: string): Promise<NewsItem[]> => {
  try {
    const url = `${BASE_URL}?apikey=${API_KEY}&q=${encodeURIComponent(query)}&country=id&language=id`;
    const response = await fetch(url);
    const json = await response.json();

    if (json.status === 'success') {
      return json.results.map(mapArticleToNewsItem);
    }
    return [];
  } catch (error) {
    console.error('Error searching news:', error);
    return [];
  }
};

export const searchNewsAdvanced = async (params: SearchParams): Promise<NewsItem[]> => {
  try {
    const queryParts: string[] = [`apikey=${API_KEY}`];

    // Handle Search Query (q)
    if (params.q && params.q.trim() !== '') {
      queryParts.push(`q=${encodeURIComponent(params.q)}`);
    }

    // Handle Country (Default 'id' jika tidak ada yang dipilih, atau sesuai kebutuhan)
    if (params.country && params.country.length > 0) {
      queryParts.push(`country=${params.country.join(',')}`);
    } 

    // Handle Category
    if (params.category && params.category.length > 0) {
      queryParts.push(`category=${params.category.join(',')}`);
    }

    // Gabungkan semua parameter
    const queryString = queryParts.join('&');
    const url = `${BASE_URL}?${queryString}`;
    
    console.log("Advanced Search URL:", url);

    const response = await fetch(url);
    const json = await response.json();

    if (json.status === 'success') {
      // @ts-ignore (mapArticleToNewsItem perlu diimpor atau didefinisikan di scope ini)
      return json.results.map(mapArticleToNewsItem);
    }
    return [];
  } catch (error) {
    console.error('Error calling advanced search:', error);
    return [];
  }
};