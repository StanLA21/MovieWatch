import '../scss/style.scss';
import './login-reserv.js';
import './transfer.js';
import './burger-menu.js';
import './login-form-authorization.js';

import { getMovieDetails, getMovieCredits, getMovieVideos, getSimilarMovies, getMovieReviews, BACKDROP_URL, POSTER_URL } from './api.js';
import { initSearch } from './movies.js';

// Извлекаем id и type из URL (?id=...&type=tv)
const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get('id');
const mediaType = urlParams.get('type') || 'movie'; // По умолчанию 'movie'

const detailContainer = document.querySelector('.movie-detail');

if (detailContainer && !movieId) {
  detailContainer.innerHTML = '<h2 style="color: white; text-align: center; padding: 50px;">Элемент не выбран. <a href="index_2.html" style="color: red;">Вернуться на главную</a></h2>';
}

async function initMoviePage() {
    initSearch();
    if (!movieId) {
        console.error('ID не найден в URL');
        return;
    }

    try {
        // Передаем mediaType во все запросы к API
        const [movie, credits, videos, similar, reviews] = await Promise.all([
            getMovieDetails(movieId, mediaType),
            getMovieCredits(movieId, mediaType),
            getMovieVideos(movieId, mediaType),
            getSimilarMovies(movieId, mediaType),
            getMovieReviews(movieId, mediaType)
        ]);

        if (!movie) return;

        renderMovieDetails(movie, credits);
        setupTrailerModal(videos);
        renderRelatedMovies(similar);
        renderMovieReviews(reviews);

    } catch (error) {
        console.error('Ошибка при загрузке детальной страницы:', error);
    }
}

// 1. Рендер основных данных фильма или сериала
function renderMovieDetails(movie, credits) {
    // Фон
    const bgElement = document.getElementById('movie-bg');
    if (bgElement && movie.backdrop_path) {
        bgElement.style.backgroundImage = `
            linear-gradient(180deg, rgba(14, 10, 4, 0.65) 0%, rgba(14, 10, 4, 0.95) 100%), 
            url(${BACKDROP_URL}${movie.backdrop_path})
        `;
    }

    // Постер
    const posterImg = document.querySelector('.movie__poster-img');
    if (posterImg) {
        const displayTitle = movie.title || movie.name || 'Poster';
        posterImg.src = movie.poster_path ? `${POSTER_URL}${movie.poster_path}` : './src/img/movie-detail/movie-poster/movie-poster.png';
        posterImg.alt = displayTitle;
    }

    // Заголовок и Год (поддержка title для фильмов и name для сериалов)
    const titleEl = document.querySelector('.movie__title');
    if (titleEl) {
        const title = movie.title || movie.name || 'Untitled';
        const rawDate = movie.release_date || movie.first_air_date || '';
        const year = rawDate ? rawDate.split('-')[0] : '';
        titleEl.innerHTML = `${title} <span class="movie__year">${year}</span>`;
    }

    // Жанры
    const genreEl = document.querySelector('.movie__genre, .movie_genre');
    if (genreEl) {
        const genresText = movie.genres?.map(g => g.name).join(', ') || 'N/A';
        genreEl.textContent = `Genre: ${genresText}`;
    }

    // Длительность (минуты для фильмов, длительность серии / сезоны для сериалов)
    const timeEl = document.querySelector('.movie__time');
    if (timeEl) {
        let durationText = 'N/A';
        if (movie.runtime) {
            durationText = `${movie.runtime}m`;
        } else if (movie.episode_run_time && movie.episode_run_time.length) {
            durationText = `${movie.episode_run_time[0]}m / ep`;
        } else if (movie.number_of_seasons) {
            durationText = `${movie.number_of_seasons} Season(s)`;
        }
        timeEl.textContent = `Time: ${durationText}`;
    }

    // Актеры (первые 4 актера из cast)
    const actorsEl = document.querySelector('.movie__actors');
    if (actorsEl && credits?.cast) {
        const topCast = credits.cast.slice(0, 4).map(actor => actor.name).join(', ');
        actorsEl.textContent = `Stars: ${topCast || 'N/A'}`;
    }

    // Режиссер / Создатель
    const createdEl = document.querySelector('.movie__created');
    if (createdEl) {
        let creatorName = 'N/A';
        if (movie.created_by && movie.created_by.length) {
            creatorName = movie.created_by.map(c => c.name).join(', ');
        } else if (credits?.crew) {
            const director = credits.crew.find(person => person.job === 'Director');
            if (director) creatorName = director.name;
        }
        createdEl.textContent = `Created by: ${creatorName}`;
    }

    // Производство / Сеть
    const networkEl = document.querySelector('.movie__network');
    if (networkEl) {
        const company = movie.networks?.[0]?.name || movie.production_companies?.[0]?.name || 'N/A';
        networkEl.textContent = `Network: ${company}`;
    }

    // Рейтинг
    const rateEl = document.querySelector('.movie__rate');
    if (rateEl) {
        rateEl.textContent = movie.vote_average ? movie.vote_average.toFixed(1) : '0.0';
    }

    // Описание
    const descEl = document.querySelector('.movie__text-description');
    if (descEl) {
        descEl.textContent = movie.overview || 'No description available.';
    }
}

// 2. Настройка трейлера и модального окна
function setupTrailerModal(videos) {
    const watchBtn = document.querySelector('.movie__btn--primary');
    const modal = document.getElementById('trailerModal');
    const iframe = document.getElementById('trailerPlayer');

    if (!watchBtn || !modal || !iframe) return;

    // Поиск трейлера, тизера или любого доступного видео YouTube
    const trailer = videos?.results?.find(v => v.type === 'Trailer' && v.site === 'YouTube') ||
                    videos?.results?.find(v => v.type === 'Teaser' && v.site === 'YouTube') ||
                    videos?.results?.find(v => v.site === 'YouTube');

    if (!trailer) {
        watchBtn.style.display = 'none';
        return;
    }

    watchBtn.style.display = 'inline-flex';

    watchBtn.addEventListener('click', () => {
        iframe.src = `https://www.youtube.com/embed/${trailer.key}?autoplay=1`;
        modal.classList.add('modal--active');
    });

    // Закрытие модального окна
    modal.addEventListener('click', (e) => {
        if (e.target.hasAttribute('data-close')) {
            modal.classList.remove('modal--active');
            iframe.src = '';
        }
    });
}

// 3. Рендер похожих фильмов / сериалов (Related)
function renderRelatedMovies(similar) {
    const relatedBlock = document.querySelector('.related__block');
    const viewAllBtn = document.querySelector('.related__view-all') ||
        document.getElementById('view-all-related') ||
        document.querySelector('.related__link') ||
        document.querySelector('.related__title-link');

    if (!relatedBlock || !similar?.results?.length) {
        if (viewAllBtn) viewAllBtn.style.display = 'none';
        return;
    }

    const moviesList = similar.results;
    let isExpanded = false;

    const createCardMarkup = (m) => {
        const cardTitle = m.title || m.name || 'Untitled';
        const cardDate = m.release_date || m.first_air_date || '';
        return `
            <li class="related__items">
              <a href="./movie-detail.html?id=${m.id}&type=${mediaType}" class="related__item">
                <div class="related__poster">
                  <img src="${m.poster_path ? POSTER_URL + m.poster_path : 'https://placehold.co/300x450/1a1a1a/ffffff?text=No+Poster'}" alt="${cardTitle}" loading="lazy">
                  <span class="related__genres">${mediaType === 'tv' ? 'TV Show' : 'Movie'}</span>
                </div>
                <p class="related__name">${cardTitle}<span class="related__rate">${m.vote_average ? m.vote_average.toFixed(1) : 'N/A'}</span></p>
                <div class="related__description">
                  <span class="related__description-year">${cardDate}</span>
                  <p class="related__description-about">${m.overview ? m.overview.slice(0, 80) + '...' : ''}</p>
                </div>
              </a>
            </li>
        `;
    };

    const updateList = () => {
        const limit = isExpanded ? 16 : 4;
        const currentMovies = moviesList.slice(0, limit);

        relatedBlock.innerHTML = `
            <ul class="related__list">
              ${currentMovies.map(createCardMarkup).join('')}
            </ul>
        `;
    };

    updateList();

    if (moviesList.length <= 4) {
        if (viewAllBtn) viewAllBtn.style.display = 'none';
        return;
    }

    if (viewAllBtn) {
        viewAllBtn.style.display = 'inline-block';
        const newBtn = viewAllBtn.cloneNode(true);
        viewAllBtn.parentNode.replaceChild(newBtn, viewAllBtn);

        newBtn.addEventListener('click', (e) => {
            e.preventDefault();
            isExpanded = !isExpanded;
            updateList();
            newBtn.textContent = isExpanded ? 'Hide' : 'View All';
        });
    }
}

// 4. Отзывы
function renderMovieReviews(reviewsData) {
    const commentsBlock = document.querySelector('.comments__block');
    const countSpan = document.querySelector('.comments__title span');
    const headerCommentsSpan = document.querySelector('.movie__comments');
    const loadMoreBtn = document.querySelector('.comments__load-btn');

    if (!commentsBlock) return;

    const reviews = reviewsData?.results || [];
    const totalCount = reviewsData?.total_results || 0;

    if (countSpan) countSpan.textContent = `${totalCount} Comments`;
    if (headerCommentsSpan) headerCommentsSpan.textContent = `${totalCount} Comments`;

    if (reviews.length === 0) {
        commentsBlock.innerHTML = '<p class="comments__empty" style="color: #a0a0a0; padding: 20px 0; text-align: center;">No comments yet.</p>';
        if (loadMoreBtn) loadMoreBtn.style.display = 'none';
        return;
    }

    let visibleCount = 4;

    const renderStarsHtml = (rating) => {
        const starsCount = rating ? Math.max(1, Math.round(rating / 2)) : 5;
        let starsHtml = '';
        for (let i = 0; i < starsCount; i++) {
            starsHtml += `<img src="./src/img/movie-detail/movie-stars/star.svg" alt="star">`;
        }
        return starsHtml;
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    const updateCommentsView = () => {
        const currentReviews = reviews.slice(0, visibleCount);

        commentsBlock.innerHTML = `
            <ul class="comments__list">
                ${currentReviews.map(item => {
                    const author = item.author || item.author_details?.username || 'Anonymous';
                    const text = item.content.length > 250 ? item.content.slice(0, 250) + '...' : item.content;
                    const date = formatDate(item.created_at);
                    const stars = renderStarsHtml(item.author_details?.rating);

                    return `
                        <li class="comments__item">
                            <div class="comments__stars">
                                <div class="comments__stars-icon">
                                    ${stars}
                                </div>
                                <a href="#" class="comments__dots" onclick="event.preventDefault();">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </a>
                            </div>
                            <span class="comments__name">${author}</span>
                            <p class="comments__text">"${text}"</p>
                            <span class="comments__date">Posted on ${date}</span>
                        </li>
                    `;
                }).join('')}
            </ul>
        `;
    };

    updateCommentsView();

    if (loadMoreBtn) {
        if (reviews.length <= 4) {
            loadMoreBtn.style.display = 'none';
        } else {
            loadMoreBtn.style.display = 'inline-block';
            const newBtn = loadMoreBtn.cloneNode(true);
            loadMoreBtn.parentNode.replaceChild(newBtn, loadMoreBtn);

            newBtn.addEventListener('click', (e) => {
                e.preventDefault();
                visibleCount += 4;
                updateCommentsView();

                if (visibleCount >= reviews.length) {
                    newBtn.style.display = 'none';
                }
            });
        }
    }
}

// Запуск
initMoviePage();



