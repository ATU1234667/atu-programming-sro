"use strict";

// БАЗОВАЯ СЛОЖНОСТЬ, ВАРИАНТ №5: таблица умножения.
const tableForm = document.getElementById("table-form");
const tableNumber = document.getElementById("table-number");
const tableError = document.getElementById("table-error");
const tableBody = document.getElementById("table-body");
const tableResult = document.getElementById("table-result");
const tablePlaceholder = document.getElementById("table-placeholder");
const tableCaption = document.getElementById("table-caption");
const tableStatus = document.getElementById("table-status");
const highlightEven = document.getElementById("highlight-even");

function clearTableOutput() {
  tableBody.replaceChildren();
  tableResult.hidden = true;
  tablePlaceholder.hidden = false;
  tableCaption.textContent = "";
  tableStatus.textContent = "";
}

function clearTableError() {
  tableError.textContent = "";
  tableNumber.removeAttribute("aria-invalid");
}

// Дополнение: переключаем подсветку строк с чётным результатом.
function updateEvenHighlight() {
  const rows = tableBody.querySelectorAll("tr");
  for (const row of rows) {
    const isEven = Number(row.dataset.product) % 2 === 0;
    row.classList.toggle("is-even", highlightEven.checked && isEven);
  }
}

function buildMultiplicationTable(number) {
  // Цикл создаёт десять строк таблицы.
  for (let multiplier = 1; multiplier <= 10; multiplier++) {
    const product = number * multiplier;
    const row = document.createElement("tr");
    const exampleCell = document.createElement("th");
    const resultCell = document.createElement("td");

    exampleCell.scope = "row";
    exampleCell.textContent = `${number} × ${multiplier}`;
    resultCell.textContent = product;
    row.dataset.product = product;
    row.append(exampleCell, resultCell);
    tableBody.append(row);
  }

  tableCaption.textContent = `Таблица умножения на ${number}`;
  tableResult.hidden = false;
  tablePlaceholder.hidden = true;
  tableStatus.textContent = "Построено строк: 10";
  updateEvenHighlight();
}

tableForm.addEventListener("submit", (event) => {
  event.preventDefault();
  clearTableOutput();
  clearTableError();

  const rawValue = tableNumber.value.trim();
  const number = Number(rawValue);
  if (rawValue === "" || !Number.isInteger(number) || number < 1 || number > 10) {
    tableError.textContent = "Введи целое число от 1 до 10.";
    tableNumber.setAttribute("aria-invalid", "true");
    tableNumber.focus();
  } else {
    buildMultiplicationTable(number);
  }
});

tableNumber.addEventListener("input", () => {
  // При изменении числа убираем результат для предыдущего значения.
  clearTableOutput();
  clearTableError();
});

highlightEven.addEventListener("change", updateEvenHighlight);

document.getElementById("table-clear").addEventListener("click", () => {
  tableNumber.value = "";
  highlightEven.checked = true;
  clearTableOutput();
  clearTableError();
  tableNumber.focus();
});

// СРЕДНЯЯ СЛОЖНОСТЬ, ВАРИАНТ №11: фильтр списка студентов.
const studentSearch = document.getElementById("student-search");
const studentItems = document.querySelectorAll("#student-list li");
const studentCount = document.getElementById("student-count");
const studentEmpty = document.getElementById("student-empty");

function filterStudents() {
  const query = studentSearch.value.trim().toLocaleLowerCase("ru");
  let visibleCount = 0;

  for (const item of studentItems) {
    const name = item.textContent.toLocaleLowerCase("ru");
    const matches = name.includes(query);
    // Неподходящие элементы скрываем, а не удаляем из списка.
    item.hidden = !matches;
    if (matches) {
      visibleCount++;
    }
  }

  studentCount.textContent = `Показано: ${visibleCount} из ${studentItems.length}`;
  studentEmpty.hidden = visibleCount !== 0;
}

studentSearch.addEventListener("input", filterStudents);

document.getElementById("student-clear").addEventListener("click", () => {
  studentSearch.value = "";
  filterStudents();
  studentSearch.focus();
});

// ПОВЫШЕННАЯ СЛОЖНОСТЬ, ВАРИАНТ №17: каталог из массива объектов.
// Товары и цены придуманы для учебной демонстрации.
const products = [
  { name: "Тетрадь", category: "Канцелярия", price: 600 },
  { name: "Ручка", category: "Канцелярия", price: 250 },
  { name: "Папка", category: "Канцелярия", price: 900 },
  { name: "Блокнот", category: "Канцелярия", price: 1500 },
  { name: "Калькулятор", category: "Техника", price: 3500 },
  { name: "Рюкзак", category: "Аксессуары", price: 12000 }
];

const maxPriceInput = document.getElementById("max-price");
const priceError = document.getElementById("price-error");
const productList = document.getElementById("product-list");
const productCount = document.getElementById("product-count");
const productEmpty = document.getElementById("product-empty");
const priceFormatter = new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 2 });

function createProductCard(product) {
  const card = document.createElement("article");
  const title = document.createElement("h3");
  const category = document.createElement("p");
  const price = document.createElement("p");

  card.className = "product-card";
  card.dataset.price = product.price;
  title.textContent = product.name;
  category.className = "product-category";
  category.textContent = product.category;
  price.className = "product-price";
  price.textContent = `${priceFormatter.format(product.price)} ₸`;
  card.append(title, category, price);
  return card;
}

function renderProducts(maxPrice) {
  productList.replaceChildren();
  let visibleCount = 0;

  for (const product of products) {
    // null означает отсутствие ограничения по цене.
    if (maxPrice === null || product.price <= maxPrice) {
      productList.append(createProductCard(product));
      visibleCount++;
    }
  }

  productCount.textContent = `Показано товаров: ${visibleCount} из ${products.length}`;
  productEmpty.hidden = visibleCount !== 0;
}

function filterProducts() {
  const rawValue = maxPriceInput.value.trim();
  priceError.textContent = "";
  maxPriceInput.removeAttribute("aria-invalid");

  if (rawValue === "") {
    renderProducts(null);
    return;
  }

  const maxPrice = Number(rawValue);
  if (!Number.isFinite(maxPrice) || maxPrice < 0) {
    priceError.textContent = "Введи число от 0 и выше или оставь поле пустым.";
    maxPriceInput.setAttribute("aria-invalid", "true");
    productList.replaceChildren();
    productCount.textContent = "Исправь значение максимальной цены.";
    productEmpty.hidden = true;
  } else {
    renderProducts(maxPrice);
  }
}

maxPriceInput.addEventListener("input", filterProducts);

document.getElementById("product-clear").addEventListener("click", () => {
  maxPriceInput.value = "";
  filterProducts();
  maxPriceInput.focus();
});

// Начальное состояние: все студенты и все товары.
filterStudents();
renderProducts(null);
