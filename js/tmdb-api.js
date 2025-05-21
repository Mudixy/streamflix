// Configuration de l'API TMDB
const TMDB_API_KEY = '4aa5776ef3fdc9d6ee9a7b8815055984'; // Remplacez par votre clé API TMDB
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

// Tailles d'images disponibles
const POSTER_SIZES = {
    small: 'w185',
    medium: 'w342',
    large: 'w500',
    original: 'original'
};

const BACKDROP_SIZES = {
    small: 'w300',
    medium: 'w780',
    large: 'w1280',
    original: 'original'
};

// Fonction pour construire les URLs des images
function getPosterUrl(posterPath, size = 'medium') {
    if (!posterPath) return 'img/placeholder-poster.jpg';
    return `${TMDB_IMAGE_BASE_URL}/${POSTER_SIZES[size]}${posterPath}`;
}

function getBackdropUrl(backdropPath, size = 'large') {
    if (!backdropPath) return 'img/placeholder-backdrop.jpg';
    return `${TMDB_IMAGE_BASE_URL}/${BACKDROP_SIZES[size]}${backdropPath}`;
}

// Fonction pour faire des requêtes à l'API TMDB
async function fetchFromTMDB(endpoint, params = {}) {
    const queryParams = new URLSearchParams({
        api_key: TMDB_API_KEY,
        language: 'fr-FR',
        ...params
    });
    
    try {
        console.log(`Requête TMDB: ${TMDB_BASE_URL}${endpoint}?${queryParams}`);
        const response = await fetch(`${TMDB_BASE_URL}${endpoint}?${queryParams}`);
        if (!response.ok) {
            throw new Error(`Erreur TMDB: ${response.status}`);
        }
        const data = await response.json();
        console.log(`Réponse TMDB pour ${endpoint}:`, data);
        return data;
    } catch (error) {
        console.error('Erreur lors de la requête TMDB:', error);
        return null;
    }
}

// Récupérer les films populaires
async function getPopularMovies(page = 1) {
    return await fetchFromTMDB('/movie/popular', { page });
}

// Récupérer les séries populaires
async function getPopularTVShows(page = 1) {
    return await fetchFromTMDB('/tv/popular', { page });
}

// Récupérer les détails d'un film
async function getMovieDetails(movieId) {
    return await fetchFromTMDB(`/movie/${movieId}`, { 
        append_to_response: 'credits,videos,similar,recommendations' 
    });
}

// Récupérer les détails d'une série
async function getTVShowDetails(tvId) {
    return await fetchFromTMDB(`/tv/${tvId}`, { 
        append_to_response: 'credits,videos,similar,recommendations,seasons' 
    });
}

// Récupérer les détails d'une saison
async function getSeasonDetails(tvId, seasonNumber) {
    return await fetchFromTMDB(`/tv/${tvId}/season/${seasonNumber}`);
}

// Rechercher des films et séries
async function searchMulti(query, page = 1) {
    return await fetchFromTMDB('/search/multi', { query, page });
}

// Récupérer les films par genre
async function getMoviesByGenre(genreId, page = 1) {
    return await fetchFromTMDB('/discover/movie', { 
        with_genres: genreId,
        page 
    });
}

// Récupérer les séries par genre
async function getTVShowsByGenre(genreId, page = 1) {
    return await fetchFromTMDB('/discover/tv', { 
        with_genres: genreId,
        page 
    });
}

// Récupérer la liste des genres
async function getGenres(type = 'movie') {
    return await fetchFromTMDB(`/genre/${type}/list`);
}

// Récupérer les tendances
async function getTrending(mediaType = 'all', timeWindow = 'week') {
    return await fetchFromTMDB(`/trending/${mediaType}/${timeWindow}`);
}

// Formater la durée en heures et minutes
function formatRuntime(minutes) {
    if (!minutes) return '';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}min`;
}

// Formater la date
function formatDate(dateString) {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
}

// IMPORTANT: Exposer toutes les fonctions dans l'espace global
// Cette approche garantit que les fonctions sont disponibles partout
window.tmdbApi = {
    getPosterUrl,
    getBackdropUrl,
    fetchFromTMDB,
    getPopularMovies,
    getPopularTVShows,
    getMovieDetails,
    getTVShowDetails,
    getSeasonDetails,
    searchMulti,
    getMoviesByGenre,
    getTVShowsByGenre,
    getGenres,
    getTrending,
    formatRuntime,
    formatDate
};

// Vérification que l'API est bien chargée
console.log('TMDB API chargée avec succès!', window.tmdbApi);