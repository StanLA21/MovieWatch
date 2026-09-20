import '../scss/style.scss';
import './login-reserv.js';
import './transfer.js';
import './burger-menu.js';
import './login-form-authorization.js';
import './login-form.js';
import { initSearch } from './movies.js';




document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.querySelector('.contact__form');

  if (!contactForm) return;

  // Находим все элементы формы по их ID
  const nameInput = document.getElementById('user-name');
  const emailInput = document.getElementById('user-email');
  const subjectInput = document.getElementById('subject-email'); 
  const messageInput = document.getElementById('message');
  const submitBtn = contactForm.querySelector('.contact__form-button');

  // Вспомогательная функция проверки формата Email
  const isValidEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  // Показ сообщения об ошибке под конкретным полем
  const showError = (input, message) => {
    if (!input) return;
    const formGroup = input.closest('.contact__form-group');
    input.classList.add('input-error');

    let errorText = formGroup.querySelector('.error-message');
    if (!errorText) {
      errorText = document.createElement('span');
      errorText.className = 'error-message';
      formGroup.appendChild(errorText);
    }
    errorText.textContent = message;
  };

  // Очистка сообщения об ошибке
  const clearError = (input) => {
    if (!input) return;
    const formGroup = input.closest('.contact__form-group');
    input.classList.remove('input-error');
    const errorText = formGroup.querySelector('.error-message');
    if (errorText) {
      errorText.remove();
    }
  };

  // Валидация всей формы перед отправкой
  const validateForm = () => {
    let isValid = true;

    // 1. Проверка Имени
    if (nameInput && !nameInput.value.trim()) {
      showError(nameInput, 'Please enter your name');
      isValid = false;
    } else if (nameInput) {
      clearError(nameInput);
    }

    // 2. Проверка Email
    if (emailInput) {
      if (!emailInput.value.trim()) {
        showError(emailInput, 'Please enter your email');
        isValid = false;
      } else if (!isValidEmail(emailInput.value.trim())) {
        showError(emailInput, 'Please enter a valid email address');
        isValid = false;
      } else {
        clearError(emailInput);
      }
    }

    // 3. Проверка Темы (Subject)
    if (subjectInput) {
      if (!subjectInput.value.trim()) {
        showError(subjectInput, 'Please enter a subject');
        isValid = false;
      } else {
        clearError(subjectInput);
      }
    }

    // 4. Проверка Сообщения (Message)
    if (messageInput) {
      if (!messageInput.value.trim()) {
        showError(messageInput, 'Please enter your message');
        isValid = false;
      } else if (messageInput.value.trim().length < 10) {
        showError(messageInput, 'Message must be at least 10 characters long');
        isValid = false;
      } else {
        clearError(messageInput);
      }
    }

    return isValid;
  };

  // Слушатели на ввод текста для мгновенного снятия ошибки
  [nameInput, emailInput, subjectInput, messageInput].forEach((input) => {
    if (input) {
      input.addEventListener('input', () => clearError(input));
    }
  });

  // Обработка отправки формы
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const originalBtnText = submitBtn.textContent;

    // Включаем состояние загрузки и добавляем класс анимации
    submitBtn.disabled = true;
    submitBtn.classList.add('is-loading');
    submitBtn.textContent = 'Sending...';

    try {
      // Имитация задержки отправки на сервер (1.5 секунды)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Убираем лоадер и включаем состояние успеха
      submitBtn.classList.remove('is-loading');
      submitBtn.classList.add('is-success');
      submitBtn.textContent = 'Sent Successfully! ✓';

      contactForm.reset();

      // Через 3 секунды плавно возвращаем кнопку в исходный вид
      setTimeout(() => {
        submitBtn.classList.remove('is-success');
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
      }, 3000);

    } catch (error) {
      alert('Something went wrong. Please try again later.');
      submitBtn.classList.remove('is-loading');
      submitBtn.disabled = false;
      submitBtn.textContent = originalBtnText;
    }
  });
});


document.addEventListener('DOMContentLoaded', () => {
    initSearch(); // Инициализируем поиск хедера
    loadTVShows();
    // ...
});