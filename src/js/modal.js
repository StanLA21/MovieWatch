const watchBtn = document.querySelector('.hero__btn--primary');

// Клик по кнопке "Watch Now" на главной странице перенаправляет на детальную страницу фильма
if (watchBtn) {
  watchBtn.addEventListener('click', (e) => {
    const movieId = e.currentTarget.dataset.movieId;

    if (movieId) {
      window.location.href = `./movie-detail.html?id=${movieId}`;
    } else {
      console.error('У кнопки .hero__btn--primary не указан атрибут data-movie-id');
    }
  });
}


































