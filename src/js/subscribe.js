import '../scss/style.scss';
import './login-reserv.js';
import './transfer.js';
import './burger-menu.js';
import './login-form-authorization.js';
import './login-form.js';

import { initSearch } from './movies.js';
document.addEventListener('DOMContentLoaded', () => {
    initSearch(); // Инициализируем поиск хедера
    loadTVShows();
    // ...
});