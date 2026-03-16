/**
 * Memeriksa apakah ID yang diterima dari parameter URL valid (bertipe string).
 * Berfungsi sebagai TypeScript Type Guard.
 * * @param {string | string[] | undefined} id - ID yang didapat dari useLocalSearchParams.
 * @returns {boolean} True jika id adalah string yang valid.
 * * @example
 * if (isValidArticleId(id)) { console.log(id.toLowerCase()); }
 */
export const isValidArticleId = (id: string | string[] | undefined): id is string => {
  return typeof id === 'string' && id.trim().length > 0;
};

/**
 * Memformat string tanggal menjadi format lokal yang lebih mudah dibaca.
 * Jika tanggal tidak valid, mengembalikan string kosong atau string asli.
 * * @param {string} [dateString] - String tanggal (misal: "2023-11-01T10:00:00Z").
 * @returns {string} Tanggal terformat (misal: "1 November 2023").
 */
export const formatArticleDate = (dateString?: string): string => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    // Opsi format bisa disesuaikan, misal: 'id-ID' untuk Bahasa Indonesia
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch (e) {
    return dateString;
  }
};

/**
 * Mengembalikan konten artikel atau pesan default jika konten kosong/null.
 * Memisahkan logika teks fallback dari komponen UI.
 * * @param {string} [content] - Isi konten artikel.
 * @returns {string} Konten asli atau pesan default.
 */
export const getArticleContent = (content?: string | null): string => {
  if (!content || content.trim() === '') {
    return "Konten lengkap tidak tersedia. Silakan kunjungi sumber asli untuk membaca lebih lanjut.";
  }
  return content;
};