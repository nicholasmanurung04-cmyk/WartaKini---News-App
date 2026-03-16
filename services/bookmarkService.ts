// services/bookmarkService.ts
import { supabase } from '@/utils/supabase'; // Pastikan path ini sesuai config Anda
import { NewsItem } from '../types';

export interface Collection {
  id: number;
  name: string;
  created_at: string;
  article_count?: number; // Optional untuk UI
}

// --- Collections ---

export const getUserCollections = async (): Promise<Collection[]> => {
  const { data, error } = await supabase
    .from('collections')
    .select('*, bookmarks(count)')
    .order('created_at', { ascending: false });

  if (error) throw error;
  
  // Mapping data untuk menyertakan jumlah artikel
  return data.map((item: any) => ({
    ...item,
    article_count: item.bookmarks?.[0]?.count || 0
  }));
};

export const getCollectionDetails = async (id: number) => {
  const { data, error } = await supabase
    .from('collections')
    .select('name')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
};

export const createCollection = async (name: string): Promise<Collection | null> => {
  const { data, error } = await supabase
    .from('collections')
    .insert([{ name }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

// --- Bookmarks ---

export const saveBookmarkToCollection = async (collectionId: number, article: NewsItem) => {
  const { error } = await supabase
    .from('bookmarks')
    .insert({
      collection_id: collectionId,
      article_id: article.id,
      title: article.title,
      image_url: article.imageUrl,
      source_name: article.author, // Mapping author ke source
      published_at: article.date,
      article_url: article.link || '', 
    });

  if (error) throw error;
  return true;
};

export const getBookmarksByCollection = async (collectionId: number): Promise<NewsItem[]> => {
  const { data, error } = await supabase
    .from('bookmarks')
    .select('*')
    .eq('collection_id', collectionId)
    .order('created_at', { ascending: false });

  if (error) throw error;

  // Mapping kembali ke format NewsItem aplikasi
  return data.map((item: any) => ({
    id: item.article_id,
    title: item.title,
    category: 'Saved', // Default category
    author: item.source_name,
    imageUrl: item.image_url,
    date: item.published_at,
    link: item.article_url
  }));
};

// --- UPDATE & DELETE COLLECTION ---

// 1. Rename Collection
export const updateCollectionName = async (id: number, newName: string) => {
  const { error } = await supabase
    .from('collections')
    .update({ name: newName })
    .eq('id', id);

  if (error) throw error;
  return true;
};

// 2. Delete Collection
// Karena di SQL kita sudah set "ON DELETE CASCADE", 
// menghapus collection otomatis menghapus semua bookmarks di dalamnya.
export const deleteCollection = async (id: number) => {
  const { error } = await supabase
    .from('collections')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
};