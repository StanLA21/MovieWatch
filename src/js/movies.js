import { getTopRatedMovies, getPopularMovies, searchMovies, getGenres, getMoviesByGenre, getTrendingTVShows, getTVGenres,POSTER_URL } from './api.js';

// Генерация разметки карточки с прямой ссылкой на movie-detail.html
function createMovieCardMarkup(movie) {
  const { id, title, poster_path, vote_average, release_date, overview } = movie;
  const rating = vote_average ? vote_average.toFixed(1) : 'N/A';
  const year = release_date ? release_date.split('-')[0] : 'N/A';
  const posterSrc = poster_path 
    ? `${POSTER_URL}${poster_path}` 
    : 'https://via.placeholder.com/500x750?text=No+Poster';
  const description = overview 
    ? (overview.length > 80 ? overview.slice(0, 80) + '...' : overview) 
    : '';

  return `
    <li class="rated__items">
      <a href="./movie-detail.html?id=${id}" class="rated__item">
        <div class="rated__poster">
          <img src="${posterSrc}" alt="${title}" loading="lazy">
          <span class="rated__genres">Movie</span>
        </div>
        <p class="rated__name">${title} <span class="rated__rate">${rating}</span></p>
        <div class="rated__description">
          <span class="rated__description-year">${year}</span>
          <p class="rated__description-about">${description}</p>
        </div>
      </a>
    </li>
  `;
}

export async function renderHomePageMovies() {
  const topRatedContainer = document.getElementById('top-rated-list');
  const popularContainer = document.getElementById('popular-list');

  if (topRatedContainer) {
    const topMovies = await getTopRatedMovies();
    if (topMovies.length) {
      topRatedContainer.innerHTML = topMovies.slice(0, 8).map(createMovieCardMarkup).join('');
    }
  }

  if (popularContainer) {
    const popularMovies = await getPopularMovies();
    if (popularMovies.length) {
      popularContainer.innerHTML = popularMovies.slice(0, 8).map(createMovieCardMarkup).join('');
    }
  }
}

// Вспомогательная функция Debounce
function debounce(func, delay = 500) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

// Логика живого поиска
export function initSearch() {
  const searchInput = document.querySelector('.header__search-input') || document.querySelector('.header__search input');
  const searchForm = document.querySelector('.header__search') || searchInput?.closest('form');
  const topRatedContainer = document.getElementById('top-rated-list');
  const sectionTitle = document.querySelector('.rated__title');

  if (!searchInput) return;

  // Если мы НА ДЕТАЛЬНОЙ СТРАНИЦЕ (нет списков с главной)
  if (!topRatedContainer) {
    const handleRedirect = (e) => {
      e.preventDefault();
      const query = searchInput.value.trim();
      if (query.length >= 2) {
        window.location.href = `./index.html?search=${encodeURIComponent(query)}`;
      }
    };

    if (searchForm) {
      searchForm.addEventListener('submit', handleRedirect);
    }
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleRedirect(e);
    });
    return;
  }

  // Если мы НА ГЛАВНОЙ СТРАНИЦЕ
  if (searchForm) {
    searchForm.addEventListener('submit', (e) => e.preventDefault());
  }

  // Функция выполнения поиска
  async function performSearch(query) {
    if (query.length === 0) {
      if (sectionTitle) sectionTitle.textContent = 'Top Rated Movies';
      renderHomePageMovies();
      return;
    }

    if (query.length < 2) return;

    const results = await searchMovies(query);

    if (sectionTitle) {
      sectionTitle.textContent = `Search Results for "${query}"`;
    }

    if (results && results.length > 0) {
      topRatedContainer.innerHTML = results.map(createMovieCardMarkup).join('');
    } else {
      topRatedContainer.innerHTML = `<p class="search-empty">No movies found for "${query}"</p>`;
    }
  }

  // Проверяем, не пришли ли мы с детальной страницы по ссылке ?search=...
  const urlParams = new URLSearchParams(window.location.search);
  const searchQuery = urlParams.get('search');

  if (searchQuery) {
    searchInput.value = searchQuery;
    performSearch(searchQuery);
  }

  // Живой поиск при вводе
  const handleSearch = debounce((e) => {
    performSearch(e.target.value.trim());
  }, 500);

  searchInput.addEventListener('input', handleSearch);
}

// Фильтр по жанрам
export async function initGenreFilter() {
  const genresList = document.getElementById('genres-list');
  const viewAllBtn = document.getElementById('view-all-genres');
  const moviesContainer = document.getElementById('top-rated-list');
  const sectionTitle = document.querySelector('.rated__title');

  if (!genresList) return;

  const genres = await getGenres();
  if (!genres || !genres.length) return;

  const genreCardsData = await Promise.all(
    genres.map(async (genre) => {
      const movies = await getMoviesByGenre(genre.id);
      const bgImage = movies && movies[0] && movies[0].backdrop_path
        ? `${POSTER_URL}${movies[0].backdrop_path}`
        : '';
      return { ...genre, bgImage };
    })
  );

  genresList.innerHTML = genreCardsData.map(genre => `
    <li class="genres__item" data-genre-id="${genre.id}" style="background-image: linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 100%), url('${genre.bgImage}')">
      <a href="#" class="genres__link" onclick="event.preventDefault()">${genre.name}</a>
    </li>
  `).join('');

  if (viewAllBtn) {
    let isAnimating = false;

    viewAllBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (isAnimating) return;

      const isOpen = genresList.classList.contains('is-open');

      if (isOpen) {
        isAnimating = true;
        genresList.classList.add('is-closing');
        viewAllBtn.textContent = 'View All';

        setTimeout(() => {
          genresList.classList.remove('is-open');
          genresList.classList.remove('is-closing');
          isAnimating = false;
        }, 800);
      } else {
        genresList.classList.add('is-open');
        viewAllBtn.textContent = 'Hide';
      }
    });
  }

  genresList.addEventListener('click', async (e) => {
    const item = e.target.closest('.genres__item');
    if (!item) return;

    e.stopPropagation();

    const genreId = item.dataset.genreId;
    const genreName = item.querySelector('.genres__link').textContent;

    if (sectionTitle) sectionTitle.textContent = `${genreName} Movies`;

    const movies = await getMoviesByGenre(genreId);
    if (moviesContainer && movies.length) {
      moviesContainer.innerHTML = movies.slice(0, 8).map(createMovieCardMarkup).join('');
      moviesContainer.scrollIntoView({ behavior: 'smooth' });
    }
  });
}
// Функция для отрисовки секции "Maybe You Like This"
export async function renderMaybeLikeSection() {
  const container = document.getElementById('maybe-like-list');
  if (!container) return;

  const [shows, genresList] = await Promise.all([
    getTrendingTVShows(),
    getTVGenres()
  ]);

  if (!shows || !shows.length) return;

  // Создаем словарь ID жанров -> Название
  const genresMap = (genresList || []).reduce((acc, genre) => {
    acc[genre.id] = genre.name;
    return acc;
  }, {});

  const top4Shows = shows.slice(0, 4);

  container.innerHTML = top4Shows.map(show => {
    const { id, name, poster_path, vote_average, first_air_date, overview, genre_ids } = show;

    const title = name || 'Untitled';
    const rating = vote_average ? vote_average.toFixed(1) : 'N/A';
    
    const dateFormatted = first_air_date 
      ? new Date(first_air_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
      : '';

    const genresText = (genre_ids || [])
      .slice(0, 3)
      .map(gId => genresMap[gId])
      .filter(Boolean)
      .join(' - ') || 'TV Show';

    const posterSrc = poster_path 
      ? `${POSTER_URL}${poster_path}` 
      : 'https://via.placeholder.com/500x750?text=No+Poster';

    const description = overview 
      ? (overview.length > 90 ? overview.slice(0, 90) + '...' : overview) 
      : 'No description available.';

    return `
      <li class="you-like__item">
        <a href="./movie-detail.html?id=${id}&type=tv" class="you-like__link">
          <div class="you-like__poster">
            <img src="${posterSrc}" alt="${title}" loading="lazy">
            <span class="you-like__genres">${genresText}</span>
          </div>
          <p class="you-like__name">${title} <span class="you-like__rate">${rating}</span></p>
          <div class="you-like__description">
            <span class="you-like__description-year">${dateFormatted}</span>
            <p class="you-like__description-about">${description}</p>
          </div>
        </a>
      </li>
    `;
  }).join('');
}





















