/**
 * Mengubah parameter string yang dipisahkan koma menjadi array string.
 * Berguna untuk memproses parameter URL seperti 'id,us,jp' menjadi ['id', 'us', 'jp'].
 *
 * @param {string | undefined | null} param - String parameter (misal: "tech,health") atau undefined.
 * @returns {string[]} Array string hasil split, atau array kosong jika input tidak valid/kosong.
 *
 * @example
 * parseSearchParamArray("id,us"); // returns ["id", "us"]
 * parseSearchParamArray("");      // returns []
 * parseSearchParamArray(undefined); // returns []
 */
export const parseSearchParamArray = (param?: string | null): string[] => {
  if (!param) return [];
  return param.split(',').map((item) => item.trim()).filter(Boolean);
};

/**
 * Membuat string ringkasan yang mudah dibaca berdasarkan filter yang aktif.
 * Menggabungkan negara dan kategori dengan pemisah '•'.
 *
 * @param {string} [country] - String parameter negara (misal: "us,id").
 * @param {string} [category] - String parameter kategori (misal: "technology").
 * @returns {string} String ringkasan (misal: "Countries: us,id • Categories: technology") atau string kosong.
 *
 * @example
 * formatSearchFilterSummary("us", "tech"); // returns "Countries: us • Categories: tech"
 * formatSearchFilterSummary(undefined, "tech"); // returns "Categories: tech"
 */
export const formatSearchFilterSummary = (country?: string, category?: string): string => {
  const filters: string[] = [];
  
  if (country && country.trim().length > 0) {
    filters.push(`Countries: ${country}`);
  }
  
  if (category && category.trim().length > 0) {
    filters.push(`Categories: ${category}`);
  }
  
  return filters.join(' • ');
};