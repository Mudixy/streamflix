document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM chargé, initialisation de StreamFlix...');
    
    // Vérifier que l'API TMDB est disponible
    if (!window.tmdbApi) {
        console.error('ERREUR: L\'API TMDB n\'est pas disponible. Vérifiez que tmdb-api.js est chargé avant main.js');
        alert('Erreur de chargement de l\'API TMDB. Veuillez recharger la page ou vérifier la console.');
        return;
    }
    
    console.log('API TMDB disponible:', window.tmdbApi);
    
    // Initialisation des variables
    const body = document.body;
    const header = document.querySelector('.header');
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuClose = document.getElementById('mobile-menu-close');
    const mobileDropdownToggles = document.querySelectorAll('.mobile-dropdown-toggle');
    const themeToggle = document.getElementById('theme-toggle');
    const overlay = document.createElement('div');
    
    // Création de l'overlay
    overlay.classList.add('overlay');
    body.appendChild(overlay);
    
    // Fonction pour vérifier si le thème est sombre
    function isDarkTheme() {
        return localStorage.getItem('theme') === 'dark' || 
               (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    
    // Fonction pour définir le thème
    function setTheme(isDark) {
        if (isDark) {
            body.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            if (themeToggle) themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            body.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
            if (themeToggle) themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        }
    }
    
    // Initialiser le thème
    setTheme(isDarkTheme());
    
    // Gestion du changement de thème
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            setTheme(!isDarkTheme());
        });
    }
    
    // Gestion du menu mobile
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            mobileMenu.classList.add('active');
            overlay.classList.add('active');
            body.style.overflow = 'hidden';
        });
    }
    
    if (mobileMenuClose) {
        mobileMenuClose.addEventListener('click', function() {
            mobileMenu.classList.remove('active');
            overlay.classList.remove('active');
            body.style.overflow = '';
        });
    }
    
    overlay.addEventListener('click', function() {
        if (mobileMenu) {
            mobileMenu.classList.remove('active');
            overlay.classList.remove('active');
            body.style.overflow = '';
        }
    });
    
    // Gestion des dropdowns mobiles
    mobileDropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            const parent = this.parentElement;
            const menu = this.nextElementSibling;
            const icon = this.querySelector('i');
            
            if (menu.classList.contains('active')) {
                menu.classList.remove('active');
                icon.style.transform = '';
            } else {
                menu.classList.add('active');
                icon.style.transform = 'rotate(180deg)';
            }
        });
    });
    
    // Gestion du header transparent/scrollé
    function handleHeaderScroll() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
            header.classList.remove('transparent');
        } else {
            header.classList.remove('scrolled');
            if (document.querySelector('.hero-section')) {
                header.classList.add('transparent');
            }
        }
    }
    
    // Initialiser l'état du header
    if (header && document.querySelector('.hero-section') && window.scrollY < 50) {
        header.classList.add('transparent');
    }
    
    window.addEventListener('scroll', handleHeaderScroll);
    
    // Initialisation des sliders Swiper si présents
    if (typeof Swiper !== 'undefined') {
        console.log('Swiper disponible, initialisation des sliders...');
        
        // Hero Slider
        const heroSwiperElement = document.querySelector('.hero-swiper');
        if (heroSwiperElement) {
            console.log('Initialisation du hero slider');
            const heroSwiper = new Swiper('.hero-swiper', {
                slidesPerView: 1,
                spaceBetween: 0,
                loop: true,
                autoplay: {
                    delay: 5000,
                    disableOnInteraction: false,
                },
                effect: 'fade',
                fadeEffect: {
                    crossFade: true
                },
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                }
            });
        }
        
        // Films Slider
        const movieSwiperElement = document.querySelector('.movie-swiper');
        if (movieSwiperElement) {
            console.log('Initialisation du slider de films');
            const movieSwiper = new Swiper('.movie-swiper', {
                slidesPerView: 2,
                spaceBetween: 15,
                navigation: {
                    nextEl: '.movie-swiper .swiper-button-next',
                    prevEl: '.movie-swiper .swiper-button-prev',
                },
                breakpoints: {
                    576: {
                        slidesPerView: 3,
                    },
                    768: {
                        slidesPerView: 4,
                    },
                    992: {
                        slidesPerView: 5,
                    },
                    1200: {
                        slidesPerView: 6,
                    }
                }
            });
        }
        
        // Séries Slider
        const seriesSwiperElement = document.querySelector('.series-swiper');
        if (seriesSwiperElement) {
            console.log('Initialisation du slider de séries');
            const seriesSwiper = new Swiper('.series-swiper', {
                slidesPerView: 2,
                spaceBetween: 15,
                navigation: {
                    nextEl: '.series-swiper .swiper-button-next',
                    prevEl: '.series-swiper .swiper-button-prev',
                },
                breakpoints: {
                    576: {
                        slidesPerView: 3,
                    },
                    768: {
                        slidesPerView: 4,
                    },
                    992: {
                        slidesPerView: 5,
                    },
                    1200: {
                        slidesPerView: 6,
                    }
                }
            });
        }
    } else {
        console.warn('Swiper n\'est pas disponible. Les sliders ne fonctionneront pas.');
    }
    
    // Gestion de la recherche
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const query = searchInput.value.trim();
            if (query) {
                const baseUrl = window.location.pathname.includes('/pages/') ? '' : 'pages/';
                window.location.href = `${baseUrl}search.html?q=${encodeURIComponent(query)}`;
            }
        });
    }
    
    // Gestion du formulaire de recherche mobile
    const mobileSearchForm = document.getElementById('mobile-search-form');
    const mobileSearchInput = document.getElementById('mobile-search-input');
    
    if (mobileSearchForm) {
        mobileSearchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const query = mobileSearchInput.value.trim();
            if (query) {
                const baseUrl = window.location.pathname.includes('/pages/') ? '' : 'pages/';
                window.location.href = `${baseUrl}search.html?q=${encodeURIComponent(query)}`;
            }
        });
    }
    
    // Chargement des données TMDB pour la page d'accueil
    async function loadHomepageData() {
        try {
            console.log("Chargement des données de la page d'accueil...");
            
            // Chargement des films tendances pour le hero slider
            console.log("Récupération des films tendances...");
            const trendingMovies = await window.tmdbApi.getTrending('movie', 'week');
            console.log("Films tendances:", trendingMovies);
            
            if (trendingMovies && trendingMovies.results && trendingMovies.results.length > 0) {
                loadHeroSlider(trendingMovies.results.slice(0, 3));
            } else {
                console.error("Aucun film tendance trouvé ou format de réponse incorrect");
            }
            
            // Chargement des films populaires
            console.log("Récupération des films populaires...");
            const popularMovies = await window.tmdbApi.getPopularMovies();
            console.log("Films populaires:", popularMovies);
            
            if (popularMovies && popularMovies.results) {
                loadMovieSlider(popularMovies.results, '.movie-swiper .swiper-wrapper');
            } else {
                console.error("Aucun film populaire trouvé ou format de réponse incorrect");
            }
            
            // Chargement des séries populaires
            console.log("Récupération des séries populaires...");
            const popularTVShows = await window.tmdbApi.getPopularTVShows();
            console.log("Séries populaires:", popularTVShows);
            
            if (popularTVShows && popularTVShows.results) {
                loadTVShowSlider(popularTVShows.results, '.series-swiper .swiper-wrapper');
            } else {
                console.error("Aucune série populaire trouvée ou format de réponse incorrect");
            }
        } catch (error) {
            console.error('Erreur lors du chargement des données de la page d\'accueil:', error);
        }
    }
    
    // Fonction pour charger le hero slider
    function loadHeroSlider(movies) {
        const heroSwiperWrapper = document.querySelector('.hero-swiper .swiper-wrapper');
        if (!heroSwiperWrapper) {
            console.warn("Élément hero-swiper non trouvé");
            return;
        }
        
        console.log("Chargement du hero slider avec:", movies);
        
        heroSwiperWrapper.innerHTML = '';
        
        movies.forEach(movie => {
            const slide = document.createElement('div');
            slide.className = 'swiper-slide';
            
            const backdropUrl = window.tmdbApi.getBackdropUrl(movie.backdrop_path, 'large');
            
            slide.innerHTML = `
                <div class="hero-slide" style="background-image: url('${backdropUrl}');">
                    <div class="hero-content">
                        <h1>${movie.title}</h1>
                        <div class="hero-meta">
                            <span class="rating"><i class="fas fa-star"></i> ${movie.vote_average.toFixed(1)}</span>
                            <span class="year">${movie.release_date ? movie.release_date.substring(0, 4) : ''}</span>
                            <span class="quality">HD</span>
                        </div>
                        <p class="hero-description">${movie.overview || 'Aucune description disponible.'}</p>
                        <div class="hero-buttons">
                            <a href="${window.location.pathname.includes('/pages/') ? '' : 'pages/'}movie.html?id=${movie.id}" class="btn btn-primary">
                                <i class="fas fa-play"></i> Regarder
                            </a>
                            <a href="#" class="btn btn-secondary add-to-list" data-id="${movie.id}" data-type="movie">
                                <i class="fas fa-plus"></i> Ma liste
                            </a>
                        </div>
                    </div>
                </div>
            `;
            
            heroSwiperWrapper.appendChild(slide);
        });
        
        // Ajouter des événements aux boutons "Ma liste"
        document.querySelectorAll('.add-to-list').forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const id = this.dataset.id;
                const type = this.dataset.type;
                
                // Simuler l'ajout à la liste
                alert(`${type === 'movie' ? 'Film' : 'Série'} ajouté(e) à votre liste!`);
                this.innerHTML = '<i class="fas fa-check"></i> Dans ma liste';
            });
        });
    }
    
    // Fonction pour charger un slider de films
    function loadMovieSlider(movies, sliderSelector) {
        const sliderWrapper = document.querySelector(sliderSelector);
        if (!sliderWrapper) {
            console.warn(`Élément ${sliderSelector} non trouvé`);
            return;
        }
        
        console.log(`Chargement du slider ${sliderSelector} avec:`, movies);
        
        sliderWrapper.innerHTML = '';
        
        movies.forEach(movie => {
            const slide = document.createElement('div');
            slide.className = 'swiper-slide';
            
            const posterUrl = window.tmdbApi.getPosterUrl(movie.poster_path, 'medium');
            
            slide.innerHTML = `
                <div class="movie-card">
                    <a href="${window.location.pathname.includes('/pages/') ? '' : 'pages/'}movie.html?id=${movie.id}">
                        <div class="movie-poster">
                            <img src="${posterUrl}" alt="${movie.title}">
                            <div class="movie-overlay">
                                <div class="movie-actions">
                                    <span class="movie-rating"><i class="fas fa-star"></i> ${movie.vote_average.toFixed(1)}</span>
                                    <button class="btn-play"><i class="fas fa-play"></i></button>
                                </div>
                            </div>
                            <span class="movie-quality">HD</span>
                        </div>
                        <div class="movie-info">
                            <h3 class="movie-title">${movie.title}</h3>
                            <div class="movie-meta">
                                <span class="movie-year">${movie.release_date ? movie.release_date.substring(0, 4) : ''}</span>
                                <span class="movie-genre">Film</span>
                            </div>
                        </div>
                    </a>
                </div>
            `;
            
            sliderWrapper.appendChild(slide);
        });
    }
    
    // Fonction pour charger un slider de séries
    function loadTVShowSlider(tvShows, sliderSelector) {
        const sliderWrapper = document.querySelector(sliderSelector);
        if (!sliderWrapper) {
            console.warn(`Élément ${sliderSelector} non trouvé`);
            return;
        }
        
        console.log(`Chargement du slider ${sliderSelector} avec:`, tvShows);
        
        sliderWrapper.innerHTML = '';
        
        tvShows.forEach(tvShow => {
            const slide = document.createElement('div');
            slide.className = 'swiper-slide';
            
            const posterUrl = window.tmdbApi.getPosterUrl(tvShow.poster_path, 'medium');
            
            slide.innerHTML = `
                <div class="movie-card">
                    <a href="${window.location.pathname.includes('/pages/') ? '' : 'pages/'}series.html?id=${tvShow.id}">
                        <div class="movie-poster">
                            <img src="${posterUrl}" alt="${tvShow.name}">
                            <div class="movie-overlay">
                                <div class="movie-actions">
                                    <span class="movie-rating"><i class="fas fa-star"></i> ${tvShow.vote_average.toFixed(1)}</span>
                                    <button class="btn-play"><i class="fas fa-play"></i></button>
                                </div>
                            </div>
                            <span class="movie-quality">HD</span>
                        </div>
                        <div class="movie-info">
                            <h3 class="movie-title">${tvShow.name}</h3>
                            <div class="movie-meta">
                                <span class="movie-year">${tvShow.first_air_date ? tvShow.first_air_date.substring(0, 4) : ''}</span>
                                <span class="movie-genre">Série</span>
                            </div>
                        </div>
                    </a>
                </div>
            `;
            
            sliderWrapper.appendChild(slide);
        });
    }
    
    // Chargement des détails d'un film
    async function loadMovieDetails() {
        const urlParams = new URLSearchParams(window.location.search);
        const movieId = urlParams.get('id');
        
        if (!movieId) {
            console.warn("ID du film non spécifié dans l'URL");
            return;
        }
        
        try {
            console.log("Chargement des détails du film:", movieId);
            
            const movie = await window.tmdbApi.getMovieDetails(movieId);
            if (!movie) {
                console.error("Aucun détail de film trouvé ou format de réponse incorrect");
                return;
            }
            
            console.log("Détails du film:", movie);
            
            // Mettre à jour le titre de la page
            document.title = `${movie.title} - StreamFlix`;
            
            // Mettre à jour l'image de fond
            const detailHero = document.querySelector('.detail-hero');
            if (detailHero) {
                detailHero.style.backgroundImage = `url('${window.tmdbApi.getBackdropUrl(movie.backdrop_path, 'large')}')`;
            }
            
            // Mettre à jour l'affiche
            const posterImg = document.querySelector('.detail-poster-img');
            if (posterImg) {
                posterImg.src = window.tmdbApi.getPosterUrl(movie.poster_path, 'large');
                posterImg.alt = movie.title;
            }
            
            // Mettre à jour les informations du film
            const detailTitle = document.querySelector('.detail-title');
            if (detailTitle) detailTitle.textContent = movie.title;
            
            const detailRating = document.querySelector('.detail-rating');
            if (detailRating) {
                detailRating.innerHTML = `<i class="fas fa-star"></i> ${movie.vote_average.toFixed(1)}`;
            }
            
            const detailMeta = document.querySelector('.detail-meta');
            if (detailMeta) {
                const releaseYear = movie.release_date ? movie.release_date.substring(0, 4) : '';
                const runtime = window.tmdbApi.formatRuntime(movie.runtime);
                
                detailMeta.innerHTML = `
                    <span class="detail-rating"><i class="fas fa-star"></i> ${movie.vote_average.toFixed(1)}</span>
                    <span>${releaseYear}</span>
                    <span>${runtime}</span>
                    <span class="quality">HD</span>
                `;
            }
            
            // Mettre à jour le bouton de lecture
            const watchBtn = document.querySelector('.watch-btn');
            if (watchBtn) {
                watchBtn.href = `watch.html?id=${movie.id}`;
            }
            
            const detailDescription = document.querySelector('.detail-description');
            if (detailDescription) {
                detailDescription.textContent = movie.overview || 'Aucune description disponible.';
            }
            
            // Mettre à jour les faits du film
            const detailFacts = document.querySelector('.detail-facts');
            if (detailFacts) {
                let directorsHTML = 'Non disponible';
                let castHTML = 'Non disponible';
                
                if (movie.credits && movie.credits.crew) {
                    const directors = movie.credits.crew.filter(person => person.job === 'Director');
                    if (directors.length > 0) {
                        directorsHTML = directors.map(director => director.name).join(', ');
                    }
                }
                
                if (movie.credits && movie.credits.cast && movie.credits.cast.length > 0) {
                    castHTML = movie.credits.cast.slice(0, 3).map(actor => 
                        `<a href="actor.html?id=${actor.id}">${actor.name}</a>`
                    ).join(', ');
                }
                
                const genresHTML = movie.genres && movie.genres.length > 0 
                    ? movie.genres.map(genre => 
                        `<a href="genre.html?genre=${genre.id}">${genre.name}</a>`
                    ).join(', ')
                    : 'Non disponible';
                
                detailFacts.innerHTML = `
                    <div class="detail-fact">
                        <span class="detail-fact-label">Réalisateur</span>
                        <span class="detail-fact-value">${directorsHTML}</span>
                    </div>
                    <div class="detail-fact">
                        <span class="detail-fact-label">Acteurs</span>
                        <span class="detail-fact-value">${castHTML}</span>
                    </div>
                    <div class="detail-fact">
                        <span class="detail-fact-label">Genres</span>
                        <span class="detail-fact-value">${genresHTML}</span>
                    </div>
                    <div class="detail-fact">
                        <span class="detail-fact-label">Pays</span>
                        <span class="detail-fact-value">${movie.production_countries && movie.production_countries.length > 0 ? movie.production_countries[0].name : 'Non disponible'}</span>
                    </div>
                    <div class="detail-fact">
                        <span class="detail-fact-label">Production</span>
                        <span class="detail-fact-value">${movie.production_companies && movie.production_companies.length > 0 ? movie.production_companies[0].name : 'Non disponible'}</span>
                    </div>
                    <div class="detail-fact">
                        <span class="detail-fact-label">Date de sortie</span>
                        <span class="detail-fact-value">${window.tmdbApi.formatDate(movie.release_date)}</span>
                    </div>
                `;
            }
            
            // Charger les films similaires
            if (movie.similar && movie.similar.results && movie.similar.results.length > 0) {
                loadMovieSlider(movie.similar.results, '.movie-swiper .swiper-wrapper');
            }
            
        } catch (error) {
            console.error('Erreur lors du chargement des détails du film:', error);
        }
    }
    
    // Détecter la page actuelle et charger les données appropriées
    const currentPath = window.location.pathname;
    console.log("Page actuelle:", currentPath);
    
    if (currentPath.endsWith('index.html') || currentPath.endsWith('/') || currentPath === '') {
        console.log("Chargement de la page d'accueil");
        loadHomepageData();
    } else if (currentPath.includes('movie.html')) {
        console.log("Chargement de la page de détails du film");
        loadMovieDetails();
    } else if (currentPath.includes('series.html')) {
        console.log("Chargement de la page de détails de la série");
        loadTVShowDetails();
    } else if (currentPath.includes('search.html')) {
        console.log("Chargement de la page de recherche");
        handleSearch();
    } else if (currentPath.includes('genre.html')) {
        console.log("Chargement de la page de genre");
        loadGenreContent();
    } else if (currentPath.includes('watch.html')) {
        console.log("Chargement de la page de lecture");
        // La logique de chargement est dans watch.html
    }
});