// Script de débogage pour StreamFlix
(function() {
    console.log('=== StreamFlix Debug Tool ===');
    
    // Vérifier si l'API TMDB est disponible
    if (window.tmdbApi) {
        console.log('✅ API TMDB disponible:', Object.keys(window.tmdbApi));
    } else {
        console.error('❌ API TMDB non disponible! Vérifiez que tmdb-api.js est chargé correctement.');
    }
    
    // Vérifier si Swiper est disponible
    if (typeof Swiper !== 'undefined') {
        console.log('✅ Swiper disponible');
    } else {
        console.warn('⚠️ Swiper non disponible! Les sliders ne fonctionneront pas correctement.');
    }
    
    // Vérifier les éléments DOM importants
    const checkElement = (selector, name) => {
        const element = document.querySelector(selector);
        if (element) {
            console.log(`✅ Élément ${name} trouvé`);
        } else {
            console.warn(`⚠️ Élément ${name} non trouvé! Sélecteur: ${selector}`);
        }
    };
    
    // Vérifier les éléments selon la page actuelle
    const currentPath = window.location.pathname;
    
    if (currentPath.endsWith('index.html') || currentPath.endsWith('/') || currentPath === '') {
        checkElement('.hero-swiper', 'Hero Slider');
        checkElement('.movie-swiper', 'Films Slider');
        checkElement('.series-swiper', 'Séries Slider');
        checkElement('.anime-swiper', 'Animés Slider');
    } else if (currentPath.includes('movie.html')) {
        checkElement('.detail-hero', 'Détail Hero');
        checkElement('.detail-poster-img', 'Poster');
        checkElement('.detail-title', 'Titre');
        checkElement('.movie-swiper', 'Films Similaires Slider');
    } else if (currentPath.includes('series.html')) {
        checkElement('.detail-hero', 'Détail Hero');
        checkElement('.detail-poster-img', 'Poster');
        checkElement('.detail-title', 'Titre');
        checkElement('.season-selector', 'Sélecteur de Saison');
        checkElement('.episodes-grid', 'Grille d\'Épisodes');
        checkElement('.series-swiper', 'Séries Similaires Slider');
    } else if (currentPath.includes('search.html')) {
        checkElement('.search-results-grid', 'Grille de Résultats');
    }
    
    console.log('=== Fin du débogage ===');
})();