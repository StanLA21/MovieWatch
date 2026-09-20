import '../scss/style.scss';
import './login-reserv.js';
import './transfer.js';
import './burger-menu.js';
import './login-form-authorization.js';




// DOM Элементы
const loginForm = document.getElementById('login-form');
const emailInput = document.getElementById('user-email');
const passwordInput = document.getElementById('user-password');
const rememberCheckbox = document.getElementById('remember-me');
const rememberBlock = document.querySelector('.remember__block');

const emailError = document.getElementById('email-error');
const passwordError = document.getElementById('password-error');

const cardTitle = document.querySelector('.login__card--title');
const submitBtn = document.querySelector('.form__btn');
const signUpToggleLink = document.querySelector('.sign-up__link');
const signUpText = document.querySelector('.sign-up');

let isLoginMode = true; // Флаг текущего режима (Login или Sign up)

// --- ПУНКТ 3: Работа с localStorage ---
// Проверяем сохраненный email при загрузке страницы
const savedEmail = localStorage.getItem('cinema_user_email');
if (savedEmail && emailInput && rememberCheckbox) {
  emailInput.value = savedEmail;
  rememberCheckbox.checked = true;
}

// --- ПУНКТ 1: Валидация ---
function showError(input, errorEl, message) {
  input.classList.add('form__input--error');
  errorEl.textContent = message;
  errorEl.classList.add('_active');
}

function clearErrors() {
  [emailInput, passwordInput].forEach(input => input.classList.remove('form__input--error'));
  [emailError, passwordError].forEach(el => el.classList.remove('_active'));
}

function validateForm() {
  clearErrors();
  let isValid = true;

  const emailVal = emailInput.value.trim();
  const passwordVal = passwordInput.value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailVal) {
    showError(emailInput, emailError, 'Email is required');
    isValid = false;
  } else if (!emailRegex.test(emailVal)) {
    showError(emailInput, emailError, 'Enter a valid email (e.g. name@mail.com)');
    isValid = false;
  }

  if (!passwordVal) {
    showError(passwordInput, passwordError, 'Password is required');
    isValid = false;
  } else if (passwordVal.length < 6) {
    showError(passwordInput, passwordError, 'Password must be at least 6 characters');
    isValid = false;
  }

  return isValid;
}

// --- ПУНКТ 2: Переключение режима (Login / Sign Up) ---
if (signUpToggleLink) {
  signUpToggleLink.addEventListener('click', (e) => {
    e.preventDefault();
    clearErrors();
    isLoginMode = !isLoginMode;

    if (isLoginMode) {
      cardTitle.innerHTML = '<span>Welcome</span> back';
      submitBtn.textContent = 'Login';
      rememberBlock.style.display = 'flex';
      signUpText.childNodes[0].nodeValue = 'Don’t have an account yet? ';
      signUpToggleLink.textContent = 'Sign up';
    } else {
      cardTitle.innerHTML = '<span>Create</span> account';
      submitBtn.textContent = 'Sign Up';
      rememberBlock.style.display = 'none'; // Скрываем "Remember me" при регистрации
      signUpText.childNodes[0].nodeValue = 'Already have an account? ';
      signUpToggleLink.textContent = 'Login';
    }
  });
}

// Отправка формы
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('currentUser', emailInput.value.trim());

    // Сохраняем/удаляем email из localStorage
    if (isLoginMode && rememberCheckbox.checked) {
      localStorage.setItem('cinema_user_email', emailInput.value.trim());
    } else {
      localStorage.removeItem('cinema_user_email');
    }

    alert(isLoginMode ? 'Successfully logged in!' : 'Account created successfully!');
    window.location.href = './index.html';
  });
}