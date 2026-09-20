const menuBurger = document.querySelector('.header__burger');
const menuBody = document.querySelector('.menu');
const search = document.querySelector('.header__search');

const body = document.body;


if (menuBurger && menuBody && search) {
    menuBurger.addEventListener("click", function (e) {
        body.classList.toggle('lock');
        menuBurger.classList.toggle('_active');
        menuBody.classList.toggle('_active');
        search.classList.toggle('_active');
    });
    menuBody.querySelectorAll('.menu__link').forEach(link => {
        link.addEventListener('click', () => {
            document.body.classList.remove('lock');
            menuBurger.classList.remove('_active');
            menuBody.classList.remove('_active');
            search.classList.remove('_active');
        });
    });
}