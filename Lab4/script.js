// СРО №4: варианты №2, №13 и №19.
// Файл подключён с defer, поэтому HTML-элементы уже существуют.

// Точное число символов не задано в условии варианта №19.
// В этой реализации выбран минимум 100 символов.
const MIN_MOTIVATION_LENGTH = 100;

// Общие функции помогают не повторять вывод ошибок и результатов.
function clearErrors(formId) {
  const form = document.getElementById(formId);
  form.querySelectorAll('.field-error').forEach(function (message) {
    message.textContent = '';
  });
  form.querySelectorAll('[aria-invalid]').forEach(function (field) {
    field.removeAttribute('aria-invalid');
  });
}

function showError(fieldId, message) {
  document.getElementById(fieldId + '-error').textContent = message;
  document.getElementById(fieldId).setAttribute('aria-invalid', 'true');
}

function resetResult(resultId) {
  const result = document.getElementById(resultId);
  result.classList.remove('success');
  const heading = document.createElement('h3');
  heading.textContent = 'Результат проверки';
  const hint = document.createElement('p');
  hint.textContent = 'Здесь появятся данные корректно заполненной формы.';
  result.replaceChildren(heading, hint);
}

function showResult(resultId, entries) {
  const result = document.getElementById(resultId);
  const heading = document.createElement('h3');
  heading.textContent = 'Форма заполнена корректно';
  const list = document.createElement('dl');
  entries.forEach(function (entry) {
    const label = document.createElement('dt');
    const value = document.createElement('dd');
    label.textContent = entry[0];
    // textContent выводит введённые данные как текст.
    value.textContent = entry[1];
    list.append(label, value);
  });
  result.replaceChildren(heading, list);
  result.classList.add('success');
}

function setStatus(prefix, isValid) {
  const status = document.getElementById(prefix + '-status');
  status.textContent = isValid ? 'Данные проверены.' : 'Исправь выделенные поля и повтори проверку.';
  status.classList.toggle('success', isValid);
  if (!isValid) {
    const firstInvalid = document.querySelector('#' + prefix + '-form [aria-invalid="true"]');
    // Для группы checkbox/radio фокусируем первый элемент группы.
    const target = firstInvalid.querySelector('input') || firstInvalid;
    target.focus();
  }
}

// 1. Базовая сложность: обратная связь.
document.getElementById('feedback-form').addEventListener('submit', function (event) {
  event.preventDefault(); // Останавливаем обычную отправку и перезагрузку страницы.
  clearErrors('feedback-form');
  resetResult('feedback-result');
  const name = document.getElementById('feedback-name').value.trim();
  const topic = document.getElementById('feedback-topic').value;
  const message = document.getElementById('feedback-message').value.trim();
  let isValid = true;

  if (name === '') {
    showError('feedback-name', 'Введи имя. Одних пробелов недостаточно.');
    isValid = false;
  }
  if (message === '') {
    showError('feedback-message', 'Напиши сообщение. Одних пробелов недостаточно.');
    isValid = false;
  }
  setStatus('feedback', isValid);
  if (isValid) {
    showResult('feedback-result', [['Имя', name], ['Тема', topic], ['Сообщение', message]]);
  }
});

// 2. Средняя сложность: данные доставки.
document.getElementById('delivery-form').addEventListener('submit', function (event) {
  event.preventDefault();
  clearErrors('delivery-form');
  resetResult('delivery-result');
  const city = document.getElementById('delivery-city').value;
  const weightText = document.getElementById('delivery-weight').value.trim();
  const weight = Number(weightText);
  const deliveryType = document.querySelector('input[name="deliveryType"]:checked');
  let isValid = true;

  if (city === '') {
    showError('delivery-city', 'Выбери город доставки.');
    isValid = false;
  }
  if (weightText === '' || !Number.isFinite(weight) || weight <= 0) {
    showError('delivery-weight', 'Укажи числовой вес больше нуля, например 2.5 кг.');
    isValid = false;
  }
  if (deliveryType === null) {
    showError('delivery-type', 'Выбери стандартную или экспресс-доставку.');
    isValid = false;
  }
  setStatus('delivery', isValid);
  if (isValid) {
    showResult('delivery-result', [['Город', city], ['Вес посылки', weight + ' кг'], ['Тип доставки', deliveryType.value]]);
  }
});

// 3. Повышенная сложность: заявка на стажировку.
document.getElementById('internship-form').addEventListener('submit', function (event) {
  event.preventDefault();
  clearErrors('internship-form');
  resetResult('internship-result');
  const name = document.getElementById('internship-name').value.trim();
  const email = document.getElementById('internship-email').value.trim();
  const course = document.getElementById('internship-course').value;
  const direction = document.getElementById('internship-direction').value;
  const skills = Array.from(document.querySelectorAll('input[name="skills"]:checked')).map(function (checkbox) {
    return checkbox.value;
  });
  const motivation = document.getElementById('internship-motivation').value.trim();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  let isValid = true;

  if (name === '') {
    showError('internship-name', 'Введи ФИО.');
    isValid = false;
  }
  if (!emailPattern.test(email)) {
    showError('internship-email', 'Введи e-mail в формате name@example.com.');
    isValid = false;
  }
  if (course === '') {
    showError('internship-course', 'Выбери курс.');
    isValid = false;
  }
  if (direction === '') {
    showError('internship-direction', 'Выбери направление стажировки.');
    isValid = false;
  }
  if (skills.length < 2) {
    showError('internship-skills', 'Отметь минимум два навыка.');
    isValid = false;
  }
  if (motivation.length < MIN_MOTIVATION_LENGTH) {
    showError('internship-motivation', 'Напиши не менее ' + MIN_MOTIVATION_LENGTH + ' символов. Сейчас: ' + motivation.length + '.');
    isValid = false;
  }
  setStatus('internship', isValid);
  if (isValid) {
    showResult('internship-result', [
      ['ФИО', name], ['E-mail', email], ['Курс', course + ' курс'],
      ['Направление', direction], ['Навыки', skills.join(', ')], ['Мотивация', motivation]
    ]);
  }
});

// Дополнительное творческое задание: счётчики символов при вводе.
function updateCounters() {
  const feedbackLength = document.getElementById('feedback-message').value.trim().length;
  document.getElementById('feedback-counter').textContent = 'Символов: ' + feedbackLength;
  const motivationLength = document.getElementById('internship-motivation').value.trim().length;
  const counter = document.getElementById('internship-counter');
  counter.textContent = 'Символов: ' + motivationLength + ' / минимум ' + MIN_MOTIVATION_LENGTH;
  counter.classList.toggle('enough', motivationLength >= MIN_MOTIVATION_LENGTH);
}

document.getElementById('feedback-message').addEventListener('input', updateCounters);
document.getElementById('internship-motivation').addEventListener('input', updateCounters);

// Очистка возвращает каждую форму, её ошибки и результат в исходное состояние.
['feedback', 'delivery', 'internship'].forEach(function (prefix) {
  document.getElementById(prefix + '-form').addEventListener('reset', function () {
    clearErrors(prefix + '-form');
    resetResult(prefix + '-result');
    const status = document.getElementById(prefix + '-status');
    status.textContent = '';
    status.classList.remove('success');
    // Стандартный reset меняет значения после выполнения обработчика.
    setTimeout(updateCounters, 0);
  });
});

updateCounters();
