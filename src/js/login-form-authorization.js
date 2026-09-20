// Функция проверки и обновления состояния шапки
function initAuthHeader() {
  const loginContainer = document.querySelector('.header__login');
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const currentUser = localStorage.getItem('currentUser');

  if (isLoggedIn && currentUser && loginContainer) {
    // Берем имя пользователя до знака @ (например, из "stanislav@mail.com" получим "stanislav")
    const userName = currentUser.split('@')[0];

    // Заменяем ссылку Sign in на имя пользователя и кнопку Выход
    loginContainer.innerHTML = `
      <div class="header__user">
        <span class="header__user-name"><img src="./src/img/header/header-login/profile-icon.svg" alt="" aria-hidden="true"> Hi, ${userName}</span>
        <button type="button" class="header__logout-btn" id="logout-btn" title="Exit">Exit</button>
      </div>
    `;

    // Слушатель для кнопки выхода
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        // Удаляем активную сессию
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('currentUser');

        // Перезагружаем страницу для обновления шапки
        window.location.reload();
      });
    }
  }
}

// Вызываем при загрузке страницы
document.addEventListener('DOMContentLoaded', initAuthHeader);