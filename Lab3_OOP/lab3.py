# СРО по лабораторной работе №3.
# Дисциплина: «Языки и технология программирования».
# Варианты: №4 Rectangle, №9 Temperature, №17 Library.
# Запуск этого файла выводит демонстрацию всех трёх заданий.


class Rectangle:
    """Прямоугольник: размеры, цвет, площадь и периметр."""

    def __init__(self, width, height, color="Белый"):
        # self означает конкретный объект, для которого выполняется метод.
        self.resize(width, height)
        self.color = color

    def area(self):
        """Вернуть площадь прямоугольника."""
        return self.width * self.height

    def perimeter(self):
        """Вернуть периметр прямоугольника."""
        return 2 * (self.width + self.height)

    def resize(self, width, height):
        """Изменить размеры; обе стороны должны быть положительными."""
        if width <= 0 or height <= 0:
            raise ValueError("Ширина и высота должны быть больше нуля.")
        self.width = width
        self.height = height

    def change_color(self, color):
        """Дополнительный метод: изменить цвет прямоугольника."""
        self.color = color


class Temperature:
    """Температура в градусах Цельсия и место измерения."""

    def __init__(self, celsius, location="Не указано"):
        self.set_celsius(celsius)
        self.location = location

    def to_fahrenheit(self):
        """Перевести температуру из градусов Цельсия в Фаренгейты."""
        return self.celsius * 9 / 5 + 32

    def to_kelvin(self):
        """Перевести температуру из градусов Цельсия в кельвины."""
        return self.celsius + 273.15

    def set_celsius(self, celsius):
        """Изменить температуру; значение не может быть ниже абсолютного нуля."""
        if celsius < -273.15:
            raise ValueError("Температура не может быть ниже -273.15 °C.")
        self.celsius = celsius

    def change_location(self, location):
        """Дополнительный метод: изменить место измерения."""
        self.location = location


class Library:
    """Учебная библиотека, хранящая список названий книг."""

    def __init__(self, name):
        self.name = name
        # Для каждого объекта создаётся собственный список.
        self.books = []

    def add_book(self, title):
        """Добавить непустое название; одинаковые названия не повторяются."""
        title = title.strip()
        if title == "":
            raise ValueError("Название книги не должно быть пустым.")
        if title in self.books:
            return False
        self.books.append(title)
        return True

    def remove_book(self, title):
        """Удалить книгу по названию и сообщить, было ли удаление."""
        title = title.strip()
        if title in self.books:
            self.books.remove(title)
            return True
        return False

    def find_book(self, title):
        """Найти точное название; вернуть название или None."""
        title = title.strip()
        if title in self.books:
            return title
        return None

    def count_books(self):
        """Дополнительный метод: вернуть количество книг."""
        return len(self.books)


def demo_rectangle():
    """Создать три прямоугольника и показать изменение первого."""
    print("БАЗОВАЯ СЛОЖНОСТЬ. ВАРИАНТ №4: RECTANGLE")
    rectangles = [
        Rectangle(3, 4),
        Rectangle(5, 2),
        Rectangle(10, 1),
    ]

    for number, rectangle in enumerate(rectangles, start=1):
        print(
            f"Объект {number}: {rectangle.width} × {rectangle.height}; "
            f"площадь = {rectangle.area()}; "
            f"периметр = {rectangle.perimeter()}; цвет = {rectangle.color}"
        )

    first = rectangles[0]
    first.resize(6, 2)
    first.change_color("Синий")
    print(
        f"После изменения объекта 1: {first.width} × {first.height}; "
        f"площадь = {first.area()}; периметр = {first.perimeter()}; "
        f"цвет = {first.color}"
    )
    print()


def demo_temperature():
    """Создать три измерения и изменить первое."""
    print("СРЕДНЯЯ СЛОЖНОСТЬ. ВАРИАНТ №9: TEMPERATURE")
    temperatures = [
        Temperature(0, "Холодильник"),
        Temperature(25, "Комната"),
        Temperature(-40, "Улица"),
    ]

    for number, temperature in enumerate(temperatures, start=1):
        # :.2f показывает число с двумя знаками после десятичной точки.
        print(
            f"Объект {number}: {temperature.celsius} °C = "
            f"{temperature.to_fahrenheit():.2f} °F = "
            f"{temperature.to_kelvin():.2f} K; место = {temperature.location}"
        )

    first = temperatures[0]
    first.set_celsius(100)
    first.change_location("Кипящая вода")
    print(
        f"После изменения объекта 1: {first.celsius} °C = "
        f"{first.to_fahrenheit():.2f} °F = "
        f"{first.to_kelvin():.2f} K; место = {first.location}"
    )
    print()


def demo_library():
    """Создать три библиотеки и выполнить операции с книгами."""
    print("ПОВЫШЕННАЯ СЛОЖНОСТЬ. ВАРИАНТ №17: LIBRARY")
    libraries = [
        Library("Учебная библиотека"),
        Library("Домашняя библиотека"),
        Library("Электронная библиотека"),
    ]
    book_sets = [
        ["Основы Python", "Алгоритмы"],
        ["Рассказы", "Стихи"],
        ["HTML и CSS", "JavaScript"],
    ]

    for library, titles in zip(libraries, book_sets):
        for title in titles:
            library.add_book(title)
        print(
            f"{library.name}: {', '.join(library.books)}; "
            f"количество книг = {library.count_books()}"
        )

    first = libraries[0]
    print("Поиск существующей книги:", first.find_book("Основы Python"))
    print("Поиск отсутствующей книги:", first.find_book("Неизвестная книга"))
    print("Удаление книги «Алгоритмы»:", first.remove_book("Алгоритмы"))
    print("Книги после удаления:", ", ".join(first.books))
    print("Количество после удаления:", first.count_books())
    print("Повторное удаление той же книги:", first.remove_book("Алгоритмы"))
    print("Повторное добавление «Основы Python»:", first.add_book("Основы Python"))
    print()


def demo_invalid_values():
    """Показать понятные сообщения для трёх ошибочных сценариев."""
    print("ПРОВЕРКА ОШИБОЧНЫХ ЗНАЧЕНИЙ")

    try:
        Rectangle(0, 4)
    except ValueError as error:
        print("Нулевая ширина:", error)

    try:
        Temperature(-300)
    except ValueError as error:
        print("Температура -300 °C:", error)

    try:
        library = Library("Проверка пустого названия")
        library.add_book("   ")
    except ValueError as error:
        print("Пустое название книги:", error)


def main():
    """Выполнить все демонстрации по порядку."""
    print("СРО №3. Основы объектно-ориентированного программирования")
    print()
    demo_rectangle()
    demo_temperature()
    demo_library()
    demo_invalid_values()


# Демонстрации запускаются при запуске файла, а не при его импорте.
if __name__ == "__main__":
    main()
