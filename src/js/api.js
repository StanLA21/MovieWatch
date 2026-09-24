
const API_KEY = import.meta.env.VITE_TMDB_API_KEY || 'ef06a3583aa7aa3890f161ade30f5ffb';
const BASE_URL = 'https://api.themoviedb.org/3';

// Константы для изображений
export const POSTER_URL = 'https://image.tmdb.org/t/p/w500';
export const BACKDROP_URL = 'https://image.tmdb.org/t/p/original';

// Базовая функция запроса
async function fetchData(endpoint, params = '') {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}?api_key=${API_KEY}&language=en-US${params}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('API Fetch Error:', error);
    return null;
  }
}

/* ==================== ГЛАВНАЯ СТРАНИЦА И ПОИСК ==================== */

export async function getTopRatedMovies() {
  const data = await fetchData('/movie/top_rated');
  return data ? data.results : [];
}

export async function getPopularMovies() {
  const data = await fetchData('/movie/popular');
  return data ? data.results : [];
}

export async function searchMovies(query) {
  if (!query.trim()) return [];
  const data = await fetchData('/search/movie', `&query=${encodeURIComponent(query)}`);
  return data ? data.results : [];
}

export async function getGenres() {
  const data = await fetchData('/genre/movie/list');
  return data ? data.genres : [];
}

export async function getMoviesByGenre(genreId) {
  const data = await fetchData('/discover/movie', `&with_genres=${genreId}`);
  return data ? data.results : [];
}

/* ==================== ДЕТАЛЬНАЯ СТРАНИЦА (ФИЛЬМЫ / СЕРИАЛЫ) ==================== */

// Добавлен параметр type = 'movie' во все функции детализации
export async function getMovieDetails(movieId, type = 'movie') {
  return await fetchData(`/${type}/${movieId}`);
}

export async function getMovieCredits(movieId, type = 'movie') {
  return await fetchData(`/${type}/${movieId}/credits`);
}

export async function getMovieVideos(movieId, type = 'movie') {
  return await fetchData(`/${type}/${movieId}/videos`);
}

export async function getMovieTrailer(movieId, type = 'movie') {
  const data = await getMovieVideos(movieId, type);
  if (!data || !data.results) return null;
  const trailer = data.results.find(v => v.site === 'YouTube' && v.type === 'Trailer');
  return trailer ? trailer.key : (data.results[0] ? data.results[0].key : null);
}

export async function getSimilarMovies(movieId, type = 'movie') {
  return await fetchData(`/${type}/${movieId}/similar`);
}

export async function getMovieReviews(id, type = 'movie') {
  const res = await fetch(`${BASE_URL}/${type}/${id}/reviews?api_key=${API_KEY}`);
  return await res.json();
}

export async function getTVGenres() {
  const data = await fetchData('/genre/tv/list');
  return data ? data.genres : [];
}

export async function getTrendingTVShows() {
  const data = await fetchData('/trending/tv/week');
  return data ? data.results : [];
}



















