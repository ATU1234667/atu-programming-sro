"use strict";

// БАЗОВАЯ СЛОЖНОСТЬ, ВАРИАНТ №6: приветствие по Enter.
const greetingForm = document.querySelector("#greeting-form");
const greetingName = document.querySelector("#greeting-name");
const greetingError = document.querySelector("#greeting-error");
const greetingResult = document.querySelector("#greeting-result");
const greetingPlaceholder = document.querySelector("#greeting-placeholder");
const greetingCounter = document.querySelector("#greeting-count");
let greetingCount = 0;

function clearGreetingMessage() {
  greetingError.textContent = "";
  greetingName.removeAttribute("aria-invalid");
  greetingResult.textContent = "";
  greetingResult.hidden = true;
  greetingPlaceholder.hidden = false;
}

function greetUser() {
  clearGreetingMessage();
  const name = greetingName.value.trim();

  if (name === "") {
    greetingError.textContent = "Введи имя для приветствия.";
    greetingName.setAttribute("aria-invalid", "true");
    greetingName.focus();
    return;
  }

  greetingResult.textContent = `Здравствуйте, ${name}!`;
  greetingResult.hidden = false;
  greetingPlaceholder.hidden = true;
  greetingCount++;
  greetingCounter.textContent = `Успешных приветствий: ${greetingCount}`;
}

greetingName.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.isComposing) {
    event.preventDefault();
    greetUser();
  }
});

// Кнопка — дополнительный способ вызвать тот же обработчик.
greetingForm.addEventListener("submit", (event) => {
  event.preventDefault();
  greetUser();
});

greetingName.addEventListener("input", clearGreetingMessage);

document.querySelector("#greeting-clear").addEventListener("click", () => {
  greetingName.value = "";
  greetingCount = 0;
  greetingCounter.textContent = "Успешных приветствий: 0";
  clearGreetingMessage();
  greetingName.focus();
});

// СРЕДНЯЯ СЛОЖНОСТЬ, ВАРИАНТ №13: динамические теги.
const tagForm = document.querySelector("#tag-form");
const tagInput = document.querySelector("#tag-input");
const tagError = document.querySelector("#tag-error");
const tagList = document.querySelector("#tag-list");
const tagCounter = document.querySelector("#tag-count");
const tagEmpty = document.querySelector("#tag-empty");

function clearTagError() {
  tagError.textContent = "";
  tagInput.removeAttribute("aria-invalid");
}

function showTagError(message) {
  tagError.textContent = message;
  tagInput.setAttribute("aria-invalid", "true");
  tagInput.focus();
}

function updateTagCount() {
  const count = tagList.children.length;
  tagCounter.textContent = `Тегов: ${count}`;
  tagEmpty.hidden = count !== 0;
}

function addTag() {
  clearTagError();
  const text = tagInput.value.trim();
  if (text === "") {
    showTagError("Введи непустой тег.");
    return;
  }

  // Дополнение: запрещаем повторы, даже если регистр букв отличается.
  const normalizedText = text.toLocaleLowerCase("ru");
  for (const existing of tagList.querySelectorAll(".tag-text")) {
    if (existing.textContent.toLocaleLowerCase("ru") === normalizedText) {
      showTagError("Такой тег уже есть в списке.");
      return;
    }
  }

  const item = document.createElement("li");
  const label = document.createElement("span");
  const removeButton = document.createElement("button");

  item.className = "tag";
  label.className = "tag-text";
  label.textContent = text;
  removeButton.className = "tag-remove";
  removeButton.type = "button";
  removeButton.textContent = "×";
  removeButton.setAttribute("aria-label", `Удалить тег ${text}`);
  item.append(label, removeButton);
  tagList.append(item);

  tagInput.value = "";
  updateTagCount();
  tagInput.focus();
}

tagInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.isComposing) {
    event.preventDefault();
    addTag();
  }
});

tagForm.addEventListener("submit", (event) => {
  event.preventDefault();
  addTag();
});

tagInput.addEventListener("input", clearTagError);

// Один обработчик на списке обслуживает все текущие и новые крестики.
tagList.addEventListener("click", (event) => {
  const removeButton = event.target.closest(".tag-remove");
  if (!removeButton || !tagList.contains(removeButton)) {
    return;
  }
  removeButton.closest("li").remove();
  clearTagError();
  updateTagCount();
  tagInput.focus();
});

document.querySelector("#tag-clear").addEventListener("click", () => {
  tagList.replaceChildren();
  tagInput.value = "";
  clearTagError();
  updateTagCount();
  tagInput.focus();
});

// ПОВЫШЕННАЯ СЛОЖНОСТЬ, ВАРИАНТ №20: «Поймай объект».
// В условии число попаданий не задано; здесь цель — 10.
const TARGET_HITS = 10;
const gameBoard = document.querySelector("#game-board");
const gameStart = document.querySelector("#game-start");
const gameScore = document.querySelector("#game-score");
const gameProgress = document.querySelector("#game-progress");
const gameStatus = document.querySelector("#game-status");
const gamePlaceholder = document.querySelector("#game-placeholder");
const targetSize = document.querySelector("#target-size");
let hitCount = 0;
let gameIsActive = false;
let target = null;

function updateGameScore() {
  gameScore.textContent = `Попаданий: ${hitCount} / ${TARGET_HITS}`;
  gameProgress.value = hitCount;
  gameProgress.textContent = `${hitCount} из ${TARGET_HITS}`;
}

function moveTarget() {
  if (!target) {
    return;
  }
  // Вычитаем размеры объекта, чтобы он оставался внутри поля.
  const maxX = Math.max(0, gameBoard.clientWidth - target.offsetWidth);
  const maxY = Math.max(0, gameBoard.clientHeight - target.offsetHeight);
  let x = Math.floor(Math.random() * (maxX + 1));
  let y = Math.floor(Math.random() * (maxY + 1));

  // При случайном совпадении координат всё равно меняем положение.
  if (x === parseInt(target.style.left, 10) && y === parseInt(target.style.top, 10)) {
    if (maxX > 0) {
      x = (x + 1) % (maxX + 1);
    } else if (maxY > 0) {
      y = (y + 1) % (maxY + 1);
    }
  }

  target.style.left = `${x}px`;
  target.style.top = `${y}px`;
}

function finishGame() {
  gameIsActive = false;
  target.remove();
  target = null;
  gameBoard.classList.add("is-finished");
  gamePlaceholder.textContent = `Победа! Все ${TARGET_HITS} попаданий выполнены.`;
  gamePlaceholder.hidden = false;
  gameStatus.textContent = "Игра завершена. Можно сыграть ещё раз.";
  gameStart.textContent = "Играть ещё";
  gameStart.focus();
}

function registerHit() {
  if (!gameIsActive) {
    return;
  }
  hitCount++;
  updateGameScore();
  if (hitCount >= TARGET_HITS) {
    finishGame();
  } else {
    gameStatus.textContent = `Попадание засчитано. Осталось: ${TARGET_HITS - hitCount}.`;
    moveTarget();
  }
}

function startGame() {
  // Новый запуск удаляет прежний объект и создаёт ровно один новый.
  if (target) {
    target.remove();
  }
  hitCount = 0;
  gameIsActive = true;
  updateGameScore();
  gameBoard.classList.remove("is-finished");
  gamePlaceholder.hidden = true;
  gameStatus.textContent = "Игра началась. Нажимай на синий объект.";
  gameStart.textContent = "Начать заново";

  target = document.createElement("button");
  target.className = "game-target";
  target.classList.toggle("is-small", targetSize.value === "small");
  target.type = "button";
  target.textContent = "Лови";
  target.setAttribute("aria-label", "Поймать объект");
  target.addEventListener("click", registerHit);
  gameBoard.append(target);
  moveTarget();
  target.focus();
}

gameStart.addEventListener("click", startGame);

// Дополнение: размер можно менять без сброса текущего счёта.
targetSize.addEventListener("change", () => {
  if (target) {
    target.classList.toggle("is-small", targetSize.value === "small");
    moveTarget();
  }
});

window.addEventListener("resize", () => {
  if (gameIsActive) {
    moveTarget();
  }
});
