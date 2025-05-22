// Mapping des IDs TMDB vers des liens de vidéos pour iframe
window.videoLinks = {
    // Films (ID TMDB -> lien iframe)
    movies: {
        // Exemples avec différentes plateformes
        "505642": "https://www.youtube.com/embed/aSiDu3Ywi8E", // Dune 2 (YouTube)
        "569094": "https://player.vimeo.com/video/379148578", // Spider-Man (Vimeo)
        "299534": "https://www.dailymotion.com/embed/video/x7tgad0", // Avengers (Dailymotion)
        "299536": "https://streamable.com/e/demo123", // Autre film (Streamable)
        "950387": "https://cinecactus.xyz/movies/Minecraft.mp4", // Minecraft, le film
        "671": "https://cinecactus.xyz/movies/Harry-Potter-a-l'ecole-des-sorciers.mp4", //HP1
        "475557": "https://cinecactus.xyz/movies/Joker.mp4", //Joker
        "9340": "https://cinecactus.xyz/movies/Les-Goonies.mp4", //Les Goonies
        "447273": "https://cinecactus.xyz/movies/Blanche-Neige-2025.mp4", //Blanche Neige
        "1195506": "https://cinecactus.xyz/movies/Novocaine.mp4", //Novocaine
        
        // Ajoutez autant de films que vous voulez
        // "ID_TMDB": "LIEN_IFRAME",
        
        // Vidéo par défaut si l'ID n'est pas trouvé
        "default": "https://www.youtube.com/embed/dQw4w9WgXcQ"
    },
    
    // Séries (ID TMDB -> saison -> épisode -> lien iframe)
    series: {
        "1396": { // Breaking Bad
            "1": { // Saison 1
                "1": "https://www.youtube.com/embed/HhesaQXLuRY", // S01E01
                "2": "https://www.youtube.com/embed/1JLUn2DFW4w", // S01E02
                // Autres épisodes...
                "default": "https://www.youtube.com/embed/HhesaQXLuRY" // Épisode par défaut
            },
            "2": {
                // Épisodes de la saison 2...
                "default": "https://www.youtube.com/embed/HhesaQXLuRY"
            },
            // Autres saisons...
            "default": "https://www.youtube.com/embed/HhesaQXLuRY" // Saison par défaut
        },
        
        // Autres séries...
        "1399": { // Game of Thrones
            "1": {
                "1": "https://www.youtube.com/embed/KPLWWIOCOOQ",
                // Autres épisodes...
            },
            // Autres saisons...
        },
        
        // Vidéo par défaut si l'ID n'est pas trouvé
        "default": "https://www.youtube.com/embed/dQw4w9WgXcQ"
    },
    
    // Fonction pour obtenir le lien vidéo
    getVideoLink: function(mediaType, mediaId, season = null, episode = null) {
        mediaId = mediaId.toString(); // Convertir en string pour la comparaison
        
        if (mediaType === 'movie') {
            return this.movies[mediaId] || this.movies.default;
        } else if (mediaType === 'tv') {
            if (season && episode) {
                season = season.toString();
                episode = episode.toString();
                
                // Vérifier si la série existe
                if (!this.series[mediaId]) {
                    return this.series.default;
                }
                
                // Vérifier si la saison existe
                if (!this.series[mediaId][season]) {
                    return this.series[mediaId].default || this.series.default;
                }
                
                // Vérifier si l'épisode existe
                if (!this.series[mediaId][season][episode]) {
                    return this.series[mediaId][season].default || this.series[mediaId].default || this.series.default;
                }
                
                return this.series[mediaId][season][episode];
            }
            return this.series.default;
        }
        return this.movies.default;
    }
};