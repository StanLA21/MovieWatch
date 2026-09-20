import '../scss/style.scss';
import './login-reserv.js';
import './transfer.js';
import './burger-menu.js';
import './login-form-authorization.js';
import './login-form.js';
import { initSearch } from './movies.js';



const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/w500';

const listElement = document.getElementById('tvshows-list');
const searchForm = document.getElementById('tvshows-search-form');
const searchInput = document.getElementById('tvshows-search-input');
const paginationElement = document.getElementById('tvshows-pagination');

let currentPage = 1;
let currentQuery = '';
let totalPages = 1;

document.addEventListener('DOMContentLoaded', () => {
    loadTVShows();

    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        currentQuery = searchInput.value.trim();
        currentPage = 1;
        loadTVShows();
    });
});

async function loadTVShows() {
    const endpoint = currentQuery
        ? `${BASE_URL}/search/tv?api_key=${API_KEY}&query=${encodeURIComponent(currentQuery)}&page=${currentPage}`
        : `${BASE_URL}/tv/popular?api_key=${API_KEY}&page=${currentPage}`;

    try {
        const response = await fetch(endpoint);
        const data = await response.json();

        totalPages = Math.min(data.total_pages || 1, 500);
        renderCards(data.results || []);
        renderPagination();
    } catch (error) {
        console.error('Ошибка при загрузке шоу:', error);
        listElement.innerHTML = '<p style="color: #D2D2D2;">Ошибка загрузки данных.</p>';
    }
}

function renderCards(shows) {
    if (!shows.length) {
        listElement.innerHTML = '<p style="color: #D2D2D2;">Ничего не найдено.</p>';
        return;
    }

    listElement.innerHTML = shows.map(show => {
        const title = show.name || 'Untitled';
        const rate = show.vote_average ? show.vote_average.toFixed(1) : 'N/A';
        const poster = show.poster_path ? `${IMG_URL}${show.poster_path}` : './src/img/no-poster.png';
        const year = show.first_air_date ? show.first_air_date.split('-')[0] : '—';
        const overview = show.overview ? (show.overview.slice(0, 90) + '...') : 'Описание отсутствует.';

        return `
            <li class="tv-shows__items">
                <a href="./movie-detail.html?id=${show.id}&type=tv" class="tv-shows__item">
                    <div class="tv-shows__poster">
                        <img src="${poster}" alt="${title}" loading="lazy">
                        <span class="tv-shows__genres">TV Show</span>
                    </div>
                    <p class="tv-shows__name">${title} <span class="tv-shows__rate">${rate}</span></p>
                    <div class="tv-shows__description">
                        <span class="tv-shows__description-year">${year}</span>
                        <p class="tv-shows__description-about">${overview}</p>
                    </div>
                </a>
            </li>
        `;
    }).join('');
}

function renderPagination() {
    if (!paginationElement || totalPages <= 1) {
        paginationElement.innerHTML = '';
        return;
    }

    paginationElement.innerHTML = '';

    const createBtn = (page, text = page, isActive = false) => {
        const btn = document.createElement('button');
        btn.className = `pagination__btn ${isActive ? 'pagination__btn--active' : ''}`;
        btn.textContent = text;
        btn.addEventListener('click', () => {
            currentPage = page;
            loadTVShows();
            window.scrollTo({ top: 300, behavior: 'smooth' });
        });
        return btn;
    };

    let pages = [1];
    if (currentPage > 3) pages.push('...');

    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        pages.push(i);
    }

    if (currentPage < totalPages - 2) pages.push('...');
    if (totalPages > 1) pages.push(totalPages);

    pages.forEach(p => {
        if (p === '...') {
            const span = document.createElement('span');
            span.className = 'pagination__btn pagination__btn--dots';
            span.textContent = '...';
            paginationElement.appendChild(span);
        } else {
            paginationElement.appendChild(createBtn(p, p, p === currentPage));
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initSearch(); // Инициализируем поиск хедера
    loadTVShows();
    // ...
});