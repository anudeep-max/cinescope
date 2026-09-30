// OMDB API utility — all API calls go through here.
// Key loaded from VITE_OMDB_API_KEY env variable (never hardcoded).

const API_KEY = import.meta.env.VITE_OMDB_API_KEY;
const BASE_URL = 'https://www.omdbapi.com';

if (!API_KEY) {
  console.warn('[CineScope] VITE_OMDB_API_KEY is not set. Add it to your .env file.');
}

// ── Curated popular movie IDs for the "Trending" section ─────────────────────
// OMDB has no trending endpoint, so we maintain a curated list of great films.
const FEATURED_IDS = [
  'tt15239678', // Dune: Part Two (2024)
  'tt21807222', // Deadpool & Wolverine (2024)
  'tt12412888', // Barbie (2023)
  'tt15398776', // Oppenheimer (2023)
  'tt6791350',  // Guardians of the Galaxy Vol. 3 (2023)
  'tt10366460', // The Batman (2022)
  'tt1745960',  // Top Gun: Maverick (2022)
  'tt4154796',  // Avengers: Endgame (2019)
  'tt1375666',  // Inception (2010)
  'tt0468569',  // The Dark Knight (2008)
  'tt0816692',  // Interstellar (2014)
  'tt0111161',  // The Shawshank Redemption (1994)
];

// ── Genre definitions for Discover page ──────────────────────────────────────
// OMDB has no genre filter API, so each genre maps to a search query.
export const GENRES = [
  { id: 'action',    name: '💥 Action',    query: 'action hero' },
  { id: 'comedy',   name: '😂 Comedy',    query: 'comedy' },
  { id: 'drama',    name: '🎭 Drama',     query: 'drama' },
  { id: 'horror',   name: '👻 Horror',    query: 'horror' },
  { id: 'scifi',    name: '🚀 Sci-Fi',    query: 'science fiction space' },
  { id: 'romance',  name: '❤️ Romance',   query: 'love romance' },
  { id: 'thriller', name: '🔪 Thriller',  query: 'thriller suspense' },
  { id: 'animation',name: '🎨 Animation', query: 'animated' },
  { id: 'crime',    name: '🕵️ Crime',     query: 'crime heist' },
  { id: 'adventure',name: '🗺️ Adventure', query: 'adventure quest' },
  { id: 'fantasy',  name: '🧙 Fantasy',   query: 'fantasy magic' },
  { id: 'mystery',  name: '🔍 Mystery',   query: 'mystery murder' },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function parseRuntime(runtime) {
  if (!runtime || runtime === 'N/A') return 0;
  const m = runtime.match(/(\d+)/);
  return m ? parseInt(m[1]) : 0;
}

function parseVotes(votes) {
  if (!votes || votes === 'N/A') return 0;
  return parseInt(votes.replace(/,/g, '')) || 0;
}

function extractYear(yearStr) {
  if (!yearStr) return '';
  const m = yearStr.match(/\d{4}/);
  return m ? m[0] : yearStr;
}

// Normalize a lightweight OMDB search result to internal format
export function normalizeSearchResult(m) {
  return {
    id: m.imdbID,
    imdbID: m.imdbID,
    title: m.Title,
    poster_path: m.Poster && m.Poster !== 'N/A' ? m.Poster : null,
    backdrop_path: null,
    vote_average: 0,
    release_date: m.Year || '',
    year: extractYear(m.Year),
    genre_ids: [],
    genres: [],
    overview: '',
    runtime: 0,
    original_language: '',
    popularity: 0,
  };
}

// Normalize a full OMDB detail object to internal format
export function normalizeDetails(m) {
  return {
    id: m.imdbID,
    imdbID: m.imdbID,
    title: m.Title,
    poster_path: m.Poster && m.Poster !== 'N/A' ? m.Poster : null,
    backdrop_path: null,
    vote_average: parseFloat(m.imdbRating) || 0,
    release_date: m.Released && m.Released !== 'N/A' ? m.Released : m.Year || '',
    year: extractYear(m.Year),
    runtime: parseRuntime(m.Runtime),
    genres: m.Genre && m.Genre !== 'N/A'
      ? m.Genre.split(', ').map((name, i) => ({ id: i, name }))
      : [],
    genre_ids: [],
    overview: m.Plot && m.Plot !== 'N/A' ? m.Plot : '',
    original_language: m.Language && m.Language !== 'N/A'
      ? m.Language.split(', ')[0]
      : '',
    popularity: parseVotes(m.imdbVotes),
    tagline: null,
    director: m.Director && m.Director !== 'N/A' ? m.Director : null,
    actors: m.Actors && m.Actors !== 'N/A' ? m.Actors : null,
    ratings: m.Ratings || [],
    rated: m.Rated && m.Rated !== 'N/A' ? m.Rated : null,
    imdbVotes: m.imdbVotes && m.imdbVotes !== 'N/A' ? m.imdbVotes : null,
    country: m.Country && m.Country !== 'N/A' ? m.Country : null,
    boxOffice: m.BoxOffice && m.BoxOffice !== 'N/A' ? m.BoxOffice : null,
    awards: m.Awards && m.Awards !== 'N/A' ? m.Awards : null,
  };
}

// ── Generic fetch helper ──────────────────────────────────────────────────────
async function apiFetch(params = {}) {
  const url = new URL(BASE_URL);
  url.searchParams.set('apikey', API_KEY);
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, v);
  });

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`OMDB error ${res.status}: ${res.statusText}`);

  const data = await res.json();

  if (data.Response === 'False') {
    if (data.Error === 'Movie not found!') return null;
    throw new Error(data.Error || 'OMDB API error');
  }

  return data;
}

// ── Public API functions ──────────────────────────────────────────────────────

// In-memory cache for fast repeat loads
const cache = new Map();

/** Fast search helper with caching */
async function fastSearch(query) {
  if (cache.has(query)) return cache.get(query);
  const data = await apiFetch({ s: query, type: 'movie' });
  const results = (data?.Search || []).map(normalizeSearchResult);
  cache.set(query, results);
  return results;
}

/** Trending / Featured movies — fast search queries cached in memory */
export async function fetchTrending() {
  if (cache.has('__trending__')) return cache.get('__trending__');

  // Search top modern movie queries for instant loading
  const queries = ['dune', 'avengers', 'batman', 'interstellar'];
  const res = await Promise.allSettled(queries.map(fastSearch));

  const combined = res
    .filter(r => r.status === 'fulfilled' && r.value)
    .flatMap(r => r.value);

  // De-duplicate by IMDb ID
  const unique = Array.from(new Map(combined.map(m => [m.id, m])).values()).slice(0, 12);
  cache.set('__trending__', unique);
  return unique;
}

/** Search movies by title */
export async function searchMovies(query, year = '', page = 1) {
  const params = { s: query, type: 'movie', page };
  if (year) params.y = year;

  const data = await apiFetch(params);
  if (!data || !data.Search) return { results: [], totalResults: 0 };

  return {
    results: data.Search.map(normalizeSearchResult),
    totalResults: parseInt(data.totalResults) || 0,
  };
}

/** Full movie details by IMDB ID */
export async function fetchMovieDetails(imdbId) {
  const data = await apiFetch({ i: imdbId, plot: 'full' });
  if (!data) return null;
  return normalizeDetails(data);
}

/** Discover movies via genre query + optional year */
export async function discoverMovies({ genreQuery = 'adventure', year = '', page = 1 } = {}) {
  return searchMovies(genreQuery, year, page);
}

/** Genre list (static since OMDB has no genre API) */
export async function fetchGenres() {
  return { genres: GENRES };
}

// ── Image helpers ─────────────────────────────────────────────────────────────

/** Poster URL — OMDB gives full URLs directly, return as-is */
export function posterUrl(path) {
  if (!path || path === 'N/A') return null;
  return path;
}

/** Backdrop URL — not available in OMDB */
export function backdropUrl() {
  return null;
}
