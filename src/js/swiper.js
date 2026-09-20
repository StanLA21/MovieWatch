const API_KEY = 'ef06a3583aa7aa3890f161ade30f5ffb';
const BASE_URL = 'https://api.themoviedb.org/3';
const POSTER_URL = 'https://image.tmdb.org/t/p/w500';
const BACKDROP_URL = 'https://image.tmdb.org/t/p/original';

let movies = [];
let currentIndex = 0;

// Элементы DOM слайдера
const titleEl = document.getElementById('hero-title');
const descEl = document.getElementById('hero-desc');
const posterPrevEl = document.getElementById('poster-prev');
const posterNextEl = document.getElementById('poster-next');
const bgEl = document.getElementById('hero-bg');

const btnPrev = document.getElementById('btn-prev');
const btnNext = document.getElementById('btn-next');
const watchBtn = document.querySelector('.hero__btn--primary');

// 1. Получаем фильмы с TMDB
async function fetchMovies() {
  try {
    const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=1`);
    const data = await response.json();
    movies = data.results.slice(0, 10);
    
    updateSlider();
  } catch (error) {
    console.error('Ошибка загрузки фильмов:', error);
  }
}

// 2. Функция обновления контента слайдера
function updateSlider() {
  if (movies.length === 0) return;

  const total = movies.length;
  const prevIndex = (currentIndex - 1 + total) % total;
  const nextIndex = (currentIndex + 1) % total;

  const currentMovie = movies[currentIndex];
  const prevMovie = movies[prevIndex];
  const nextMovie = movies[nextIndex];

  // Заполняем данные
  if (titleEl) titleEl.textContent = currentMovie.title;
  if (descEl) descEl.textContent = currentMovie.overview;

  if (posterPrevEl) {
    posterPrevEl.src = `${POSTER_URL}${prevMovie.poster_path}`;
    posterPrevEl.alt = prevMovie.title;
  }

  if (posterNextEl) {
    posterNextEl.src = `${POSTER_URL}${nextMovie.poster_path}`;
    posterNextEl.alt = nextMovie.title;
  }

  // Меняем фон
  if (bgEl) {
    bgEl.style.backgroundImage = `
      linear-gradient(180deg, rgba(14, 10, 4, 0.4) 0%, rgba(14, 10, 4, 0.8) 70%, #0e0a04 100%), 
      url('${BACKDROP_URL}${currentMovie.backdrop_path}')
    `;
  }
}

// 3. Переключение слайдов
if (btnPrev) {
  btnPrev.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + movies.length) % movies.length;
    updateSlider();
  });
}

if (btnNext) {
  btnNext.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % movies.length;
    updateSlider();
  });
}

// 4. Клик по "Watch Now" переводит на страницу с подробностями фильма
if (watchBtn) {
  watchBtn.addEventListener('click', () => {
    if (movies.length > 0) {
      const currentMovieId = movies[currentIndex].id;
      window.location.href = `./movie-detail.html?id=${currentMovieId}`;
    }
  });
}

// Запуск
fetchMovies();

































// const API_KEY = 'ef06a3583aa7aa3890f161ade30f5ffb';
// const BASE_URL = 'https://api.themoviedb.org/3';
// const POSTER_URL = 'https://image.tmdb.org/t/p/w500';
// const BACKDROP_URL = 'https://image.tmdb.org/t/p/original';

// let movies = [];
// let currentIndex = 0;

// // Элементы DOM слайдера
// const titleEl = document.getElementById('hero-title');
// const descEl = document.getElementById('hero-desc');
// const posterPrevEl = document.getElementById('poster-prev');
// const posterNextEl = document.getElementById('poster-next');
// const bgEl = document.getElementById('hero-bg');

// const btnPrev = document.getElementById('btn-prev');
// const btnNext = document.getElementById('btn-next');

// // Элементы DOM модального окна
// const modal = document.getElementById('trailerModal');
// const player = document.getElementById('trailerPlayer');
// const watchBtn = document.querySelector('.hero__btn--primary');

// // 1. Получаем фильмы с TMDB
// async function fetchMovies() {
//   try {
//     const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=1`);
//     const data = await response.json();
//     movies = data.results.slice(0, 10); // Берем 10 популярных
    
//     updateSlider();
//   } catch (error) {
//     console.error('Ошибка загрузки фильмов:', error);
//   }
// }

// // 2. Функция обновления контента слайдера
// function updateSlider() {
//   if (movies.length === 0) return;

//   const total = movies.length;
//   const prevIndex = (currentIndex - 1 + total) % total;
//   const nextIndex = (currentIndex + 1) % total;

//   const currentMovie = movies[currentIndex];
//   const prevMovie = movies[prevIndex];
//   const nextMovie = movies[nextIndex];

//   // Заполняем данные
//   titleEl.textContent = currentMovie.title;
//   descEl.textContent = currentMovie.overview;

//   posterPrevEl.src = `${POSTER_URL}${prevMovie.poster_path}`;
//   posterPrevEl.alt = prevMovie.title;

//   posterNextEl.src = `${POSTER_URL}${nextMovie.poster_path}`;
//   posterNextEl.alt = nextMovie.title;

//   // Меняем фон
//   bgEl.style.backgroundImage = `
//     linear-gradient(180deg, rgba(14, 10, 4, 0.4) 0%, rgba(14, 10, 4, 0.8) 70%, #0e0a04 100%), 
//     url('${BACKDROP_URL}${currentMovie.backdrop_path}')
//   `;
// }

// // 3. Получение видеоролика для текущего фильма
// async function fetchMovieTrailer(movieId) {
//   try {
//     const url = `${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}&include_video_language=en,null`;
//     const response = await fetch(url);

//     if (!response.ok) return null;

//     const data = await response.json();
//     if (!data.results || data.results.length === 0) return null;

//     // Ищем Трейлер -> Тизер -> Любое первое видео на YouTube
//     const video =
//       data.results.find((v) => v.site === 'YouTube' && v.type === 'Trailer') ||
//       data.results.find((v) => v.site === 'YouTube' && v.type === 'Teaser') ||
//       data.results.find((v) => v.site === 'YouTube');

//     return video ? video.key : null;
//   } catch (error) {
//     console.error('Ошибка при загрузке трейлера:', error);
//     return null;
//   }
// }

// // 4. Открытие и закрытие модального окна
// async function openTrailerModal(movieId) {
//   const videoKey = await fetchMovieTrailer(movieId);

//   if (videoKey) {
//     player.src = `https://www.youtube.com/embed/${videoKey}?autoplay=1`;
//     modal.classList.add('modal--active');
//     modal.setAttribute('aria-hidden', 'false');
//   } else {
//     alert('К сожалению, трейлер для этого фильма не найден');
//   }
// }

// function closeModal() {
//   if (!modal) return;
//   modal.classList.remove('modal--active');
//   modal.setAttribute('aria-hidden', 'true');
//   player.src = '';
// }

// // 5. События переключения слайдов
// btnPrev.addEventListener('click', () => {
//   currentIndex = (currentIndex - 1 + movies.length) % movies.length;
//   updateSlider();
// });

// btnNext.addEventListener('click', () => {
//   currentIndex = (currentIndex + 1) % movies.length;
//   updateSlider();
// });

// // 6. Клик по "Watch Now" (автоматически подтягивает ID активного фильма)
// if (watchBtn) {
//   watchBtn.addEventListener('click', () => {
//     if (movies.length > 0) {
//       const currentMovieId = movies[currentIndex].id;
//       openTrailerModal(currentMovieId);
//     }
//   });
// }

// // 7. Обработчики закрытия модалки
// document.querySelectorAll('[data-close]').forEach((element) => {
//   element.addEventListener('click', closeModal);
// });

// document.addEventListener('keydown', (e) => {
//   if (e.key === 'Escape' && modal?.classList.contains('modal--active')) {
//     closeModal();
//   }
// });

// // Запуск
// fetchMovies();






























// // const API_KEY = 'ef06a3583aa7aa3890f161ade30f5ffb';
// // const BASE_URL = 'https://api.themoviedb.org/3';
// // const POSTER_URL = 'https://image.tmdb.org/t/p/w500';
// // const BACKDROP_URL = 'https://image.tmdb.org/t/p/original';

// // let movies = [];
// // let currentIndex = 0;

// // // Элементы DOM
// // const titleEl = document.getElementById('hero-title');
// // const descEl = document.getElementById('hero-desc');
// // const posterPrevEl = document.getElementById('poster-prev');
// // const posterNextEl = document.getElementById('poster-next');
// // const bgEl = document.getElementById('hero-bg');

// // const btnPrev = document.getElementById('btn-prev');
// // const btnNext = document.getElementById('btn-next');

// // // 1. Получаем фильмы с TMDB
// // async function fetchMovies() {
// //   try {
// //     const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=1`);
// //     const data = await response.json();
// //     movies = data.results.slice(0, 10); // Берем 10 популярных
    
// //     updateSlider();
// //   } catch (error) {
// //     console.error('Ошибка загрузки фильмов:', error);
// //   }
// // }

// // // 2. Функция обновления контента
// // function updateSlider() {
// //   if (movies.length === 0) return;

// //   const total = movies.length;
// //   const prevIndex = (currentIndex - 1 + total) % total;
// //   const nextIndex = (currentIndex + 1) % total;

// //   const currentMovie = movies[currentIndex];
// //   const prevMovie = movies[prevIndex];
// //   const nextMovie = movies[nextIndex];

// //   // Заполняем данные
// //   titleEl.textContent = currentMovie.title;
// //   descEl.textContent = currentMovie.overview;

// //   posterPrevEl.src = `${POSTER_URL}${prevMovie.poster_path}`;
// //   posterPrevEl.alt = prevMovie.title;

// //   posterNextEl.src = `${POSTER_URL}${nextMovie.poster_path}`;
// //   posterNextEl.alt = nextMovie.title;

// //   // Меням фон
// //   bgEl.style.backgroundImage = `
// //     linear-gradient(180deg, rgba(14, 10, 4, 0.4) 0%, rgba(14, 10, 4, 0.8) 70%, #0e0a04 100%), 
// //     url('${BACKDROP_URL}${currentMovie.backdrop_path}')
// //   `;
// // }

// // // 3. События кликов по стрелкам
// // btnPrev.addEventListener('click', () => {
// //   currentIndex = (currentIndex - 1 + movies.length) % movies.length;
// //   updateSlider();
// // });

// // btnNext.addEventListener('click', () => {
// //   currentIndex = (currentIndex + 1) % movies.length;
// //   updateSlider();
// // });

// // // Запуск
// // fetchMovies();