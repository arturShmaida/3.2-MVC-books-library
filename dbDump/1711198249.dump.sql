/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: authors
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `authors` (
  `authors_id` int NOT NULL AUTO_INCREMENT,
  `authors_name` varchar(255) NOT NULL,
  UNIQUE KEY `authors_id_UNIQUE` (`authors_id`)
) ENGINE = InnoDB AUTO_INCREMENT = 59 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: books
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `books` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `author` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `year` varchar(55) DEFAULT NULL,
  `pages` int DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `isbn` varchar(255) DEFAULT NULL,
  `clicks` int NOT NULL DEFAULT '0',
  `views` int NOT NULL DEFAULT '0',
  `is_delete` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `isbn_UNIQUE` (`isbn`)
) ENGINE = InnoDB AUTO_INCREMENT = 59 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: id_pairs
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `id_pairs` (
  `book_id` int NOT NULL,
  `authors_id` int NOT NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: authors
# ------------------------------------------------------------

INSERT INTO
  `authors` (`authors_id`, `authors_name`)
VALUES
  (23, 'Марк Саммерфильд');
INSERT INTO
  `authors` (`authors_id`, `authors_name`)
VALUES
  (25, 'М., Вильямс');
INSERT INTO
  `authors` (`authors_id`, `authors_name`)
VALUES
  (26, 'Уэс Маккинни');
INSERT INTO
  `authors` (`authors_id`, `authors_name`)
VALUES
  (27, 'Брюс Эккель');
INSERT INTO
  `authors` (`authors_id`, `authors_name`)
VALUES
  (
    29,
    'Томас Кормен, Чарльз Лейзерсон, Рональд Ривест, Клиффорд Штайн'
  );
INSERT INTO
  `authors` (`authors_id`, `authors_name`)
VALUES
  (31, 'Дэвид Флэнаган');
INSERT INTO
  `authors` (`authors_id`, `authors_name`)
VALUES
  (32, 'Гэри Маклин Холл');
INSERT INTO
  `authors` (`authors_id`, `authors_name`)
VALUES
  (33, 'Джеймс Р. Грофф');
INSERT INTO
  `authors` (`authors_id`, `authors_name`)
VALUES
  (34, 'Люк Веллинг');
INSERT INTO
  `authors` (`authors_id`, `authors_name`)
VALUES
  (35, 'Сергей Мастицкий');
INSERT INTO
  `authors` (`authors_id`, `authors_name`)
VALUES
  (36, 'Джон Вудкок');
INSERT INTO
  `authors` (`authors_id`, `authors_name`)
VALUES
  (37, 'Джереми Блум');
INSERT INTO
  `authors` (`authors_id`, `authors_name`)
VALUES
  (38, 'А. Белов');
INSERT INTO
  `authors` (`authors_id`, `authors_name`)
VALUES
  (39, 'Сэмюэл Грингард');
INSERT INTO
  `authors` (`authors_id`, `authors_name`)
VALUES
  (40, 'Сет Гринберг');
INSERT INTO
  `authors` (`authors_id`, `authors_name`)
VALUES
  (41, 'Александр Сераков');
INSERT INTO
  `authors` (`authors_id`, `authors_name`)
VALUES
  (42, 'Тим Кедлек');
INSERT INTO
  `authors` (`authors_id`, `authors_name`)
VALUES
  (43, 'Пол Дейтел, Харви Дейтел');
INSERT INTO
  `authors` (`authors_id`, `authors_name`)
VALUES
  (44, 'Роберт Мартин');
INSERT INTO
  `authors` (`authors_id`, `authors_name`)
VALUES
  (45, 'Энтони Грей');
INSERT INTO
  `authors` (`authors_id`, `authors_name`)
VALUES
  (46, 'Мартин Фаулер, Прамодкумар Дж. Садаладж');
INSERT INTO
  `authors` (`authors_id`, `authors_name`)
VALUES
  (47, 'Джей Макгаврен');
INSERT INTO
  `authors` (`authors_id`, `authors_name`)
VALUES
  (48, 'Дрю Нейл');
INSERT INTO
  `authors` (`authors_id`, `authors_name`)
VALUES
  (49, 'Джон Дакетт');
INSERT INTO
  `authors` (`authors_id`, `authors_name`)
VALUES
  (50, 'Эндрю Хант, Дэвид Томас');
INSERT INTO
  `authors` (`authors_id`, `authors_name`)
VALUES
  (51, 'Брайан Гётц');
INSERT INTO
  `authors` (`authors_id`, `authors_name`)
VALUES
  (52, 'Майкл Хартл');
INSERT INTO
  `authors` (`authors_id`, `authors_name`)
VALUES
  (53, 'Иэн Гудфеллоу, Йошуа Бенжио, Аарон Курвилль');
INSERT INTO
  `authors` (`authors_id`, `authors_name`)
VALUES
  (54, 'Мариейн Хавербеке');
INSERT INTO
  `authors` (`authors_id`, `authors_name`)
VALUES
  (55, 'Брайан Керниган, Деннис Ритчи');
INSERT INTO
  `authors` (`authors_id`, `authors_name`)
VALUES
  (56, 'Эндрю Янг');
INSERT INTO
  `authors` (`authors_id`, `authors_name`)
VALUES
  (57, 'Марк Пилгрим');
INSERT INTO
  `authors` (`authors_id`, `authors_name`)
VALUES
  (58, 'Ниссим Нир');

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: books
# ------------------------------------------------------------

INSERT INTO
  `books` (
    `id`,
    `title`,
    `author`,
    `description`,
    `year`,
    `pages`,
    `date`,
    `isbn`,
    `clicks`,
    `views`,
    `is_delete`
  )
VALUES
  (
    23,
    'Программирование на языке Go!',
    'Марк Саммерфильд',
    'Практическое руководство по программированию на языке Go!',
    '',
    NULL,
    NULL,
    NULL,
    0,
    0,
    0
  );
INSERT INTO
  `books` (
    `id`,
    `title`,
    `author`,
    `description`,
    `year`,
    `pages`,
    `date`,
    `isbn`,
    `clicks`,
    `views`,
    `is_delete`
  )
VALUES
  (
    25,
    'Толковый словарь сетевых терминов и аббревиатур',
    'М., Вильямс',
    'Словарь, содержащий толкования основных терминов и аббревиатур, используемых в сетевых технологиях',
    '',
    NULL,
    NULL,
    NULL,
    0,
    0,
    0
  );
INSERT INTO
  `books` (
    `id`,
    `title`,
    `author`,
    `description`,
    `year`,
    `pages`,
    `date`,
    `isbn`,
    `clicks`,
    `views`,
    `is_delete`
  )
VALUES
  (
    26,
    'Python for Data Analysis',
    'Уэс Маккинни',
    'Руководство по анализу данных с использованием языка программирования Python',
    '',
    NULL,
    NULL,
    NULL,
    0,
    0,
    0
  );
INSERT INTO
  `books` (
    `id`,
    `title`,
    `author`,
    `description`,
    `year`,
    `pages`,
    `date`,
    `isbn`,
    `clicks`,
    `views`,
    `is_delete`
  )
VALUES
  (
    27,
    'Thinking in Java (4th Edition)',
    'Брюс Эккель',
    'Учебник по языку программирования Java, ориентированный на развитие навыков мышления в программировании',
    '',
    NULL,
    NULL,
    NULL,
    0,
    0,
    0
  );
INSERT INTO
  `books` (
    `id`,
    `title`,
    `author`,
    `description`,
    `year`,
    `pages`,
    `date`,
    `isbn`,
    `clicks`,
    `views`,
    `is_delete`
  )
VALUES
  (
    29,
    'Introduction to Algorithms',
    'Томас Кормен, Чарльз Лейзерсон, Рональд Ривест, Клиффорд Штайн',
    'Классическое введение в алгоритмы и структуры данных',
    '',
    NULL,
    NULL,
    NULL,
    0,
    0,
    0
  );
INSERT INTO
  `books` (
    `id`,
    `title`,
    `author`,
    `description`,
    `year`,
    `pages`,
    `date`,
    `isbn`,
    `clicks`,
    `views`,
    `is_delete`
  )
VALUES
  (
    31,
    'JavaScript Pocket Reference',
    'Дэвид Флэнаган',
    'Компактное справочное руководство по языку программирования JavaScript',
    '',
    NULL,
    NULL,
    NULL,
    0,
    0,
    0
  );
INSERT INTO
  `books` (
    `id`,
    `title`,
    `author`,
    `description`,
    `year`,
    `pages`,
    `date`,
    `isbn`,
    `clicks`,
    `views`,
    `is_delete`
  )
VALUES
  (
    32,
    'Adaptive Code via C#: Class and Interface Design, Design Patterns, and SOLID Principles',
    'Гэри Маклин Холл',
    'Руководство по разработке адаптивного кода с использованием языка программирования C#',
    '',
    NULL,
    NULL,
    NULL,
    0,
    0,
    0
  );
INSERT INTO
  `books` (
    `id`,
    `title`,
    `author`,
    `description`,
    `year`,
    `pages`,
    `date`,
    `isbn`,
    `clicks`,
    `views`,
    `is_delete`
  )
VALUES
  (
    33,
    'SQL: The Complete Reference',
    'Джеймс Р. Грофф',
    'Исчерпывающее руководство по языку структурированных запросов SQL',
    '',
    NULL,
    NULL,
    NULL,
    0,
    0,
    0
  );
INSERT INTO
  `books` (
    `id`,
    `title`,
    `author`,
    `description`,
    `year`,
    `pages`,
    `date`,
    `isbn`,
    `clicks`,
    `views`,
    `is_delete`
  )
VALUES
  (
    34,
    'PHP and MySQL Web Development',
    'Люк Веллинг',
    'Практическое руководство по веб-разработке с использованием PHP и MySQL',
    '',
    NULL,
    NULL,
    NULL,
    0,
    0,
    0
  );
INSERT INTO
  `books` (
    `id`,
    `title`,
    `author`,
    `description`,
    `year`,
    `pages`,
    `date`,
    `isbn`,
    `clicks`,
    `views`,
    `is_delete`
  )
VALUES
  (
    35,
    'Статистический анализ и визуализация данных с помощью R',
    'Сергей Мастицкий',
    'Введение в статистический анализ и визуализацию данных, используя язык программирования R',
    '',
    NULL,
    NULL,
    NULL,
    0,
    0,
    0
  );
INSERT INTO
  `books` (
    `id`,
    `title`,
    `author`,
    `description`,
    `year`,
    `pages`,
    `date`,
    `isbn`,
    `clicks`,
    `views`,
    `is_delete`
  )
VALUES
  (
    36,
    'Computer Coding for Kids',
    'Джон Вудкок',
    'Введение в компьютерное программирование для детей',
    '',
    NULL,
    NULL,
    NULL,
    0,
    0,
    0
  );
INSERT INTO
  `books` (
    `id`,
    `title`,
    `author`,
    `description`,
    `year`,
    `pages`,
    `date`,
    `isbn`,
    `clicks`,
    `views`,
    `is_delete`
  )
VALUES
  (
    37,
    'Exploring Arduino: Tools and Techniques for Engineering Wizardry',
    'Джереми Блум',
    'Практическое руководство по использованию платформы Arduino для создания различных устройств',
    '',
    NULL,
    NULL,
    NULL,
    0,
    0,
    0
  );
INSERT INTO
  `books` (
    `id`,
    `title`,
    `author`,
    `description`,
    `year`,
    `pages`,
    `date`,
    `isbn`,
    `clicks`,
    `views`,
    `is_delete`
  )
VALUES
  (
    38,
    'Программирование микроконтроллеров для начинающих и не только',
    'А. Белов',
    'Руководство по программированию микроконтроллеров с нуля',
    '',
    NULL,
    NULL,
    NULL,
    0,
    0,
    0
  );
INSERT INTO
  `books` (
    `id`,
    `title`,
    `author`,
    `description`,
    `year`,
    `pages`,
    `date`,
    `isbn`,
    `clicks`,
    `views`,
    `is_delete`
  )
VALUES
  (
    39,
    'The Internet of Things',
    'Сэмюэл Грингард',
    'Изучение концепций и принципов Интернета вещей',
    '',
    NULL,
    NULL,
    NULL,
    0,
    0,
    0
  );
INSERT INTO
  `books` (
    `id`,
    `title`,
    `author`,
    `description`,
    `year`,
    `pages`,
    `date`,
    `isbn`,
    `clicks`,
    `views`,
    `is_delete`
  )
VALUES
  (
    40,
    'Sketching User Experiences: The Workbook',
    'Сет Гринберг',
    'Практическое руководство по проектированию пользовательских интерфейсов и пользовательских взаимодействий',
    '',
    NULL,
    NULL,
    NULL,
    0,
    0,
    0
  );
INSERT INTO
  `books` (
    `id`,
    `title`,
    `author`,
    `description`,
    `year`,
    `pages`,
    `date`,
    `isbn`,
    `clicks`,
    `views`,
    `is_delete`
  )
VALUES
  (
    41,
    'InDesign CS6',
    'Александр Сераков',
    'Руководство по программе верстки InDesign CS6',
    '',
    NULL,
    NULL,
    NULL,
    0,
    0,
    0
  );
INSERT INTO
  `books` (
    `id`,
    `title`,
    `author`,
    `description`,
    `year`,
    `pages`,
    `date`,
    `isbn`,
    `clicks`,
    `views`,
    `is_delete`
  )
VALUES
  (
    42,
    'Адаптивный дизайн. Делаем сайты для любых устройств',
    'Тим Кедлек',
    'Учебное пособие по созданию адаптивного дизайна для веб-сайтов',
    '',
    NULL,
    NULL,
    NULL,
    0,
    0,
    0
  );
INSERT INTO
  `books` (
    `id`,
    `title`,
    `author`,
    `description`,
    `year`,
    `pages`,
    `date`,
    `isbn`,
    `clicks`,
    `views`,
    `is_delete`
  )
VALUES
  (
    43,
    'Android для разработчиков',
    'Пол Дейтел, Харви Дейтел',
    'Руководство по разработке приложений под платформу Android',
    '',
    NULL,
    NULL,
    NULL,
    0,
    0,
    0
  );
INSERT INTO
  `books` (
    `id`,
    `title`,
    `author`,
    `description`,
    `year`,
    `pages`,
    `date`,
    `isbn`,
    `clicks`,
    `views`,
    `is_delete`
  )
VALUES
  (
    44,
    'Clean Code: A Handbook of Agile Software Craftsmanship',
    'Роберт Мартин',
    'Руководство по написанию чистого и эффективного программного кода',
    '',
    NULL,
    NULL,
    NULL,
    0,
    0,
    0
  );
INSERT INTO
  `books` (
    `id`,
    `title`,
    `author`,
    `description`,
    `year`,
    `pages`,
    `date`,
    `isbn`,
    `clicks`,
    `views`,
    `is_delete`
  )
VALUES
  (
    45,
    'Swift Pocket Reference: Programming for iOS and OS X',
    'Энтони Грей',
    'Краткое справочное руководство по программированию на языке Swift для платформы iOS и OS X',
    '',
    NULL,
    NULL,
    NULL,
    0,
    0,
    0
  );
INSERT INTO
  `books` (
    `id`,
    `title`,
    `author`,
    `description`,
    `year`,
    `pages`,
    `date`,
    `isbn`,
    `clicks`,
    `views`,
    `is_delete`
  )
VALUES
  (
    46,
    'NoSQL Distilled: A Brief Guide to the Emerging World of Polyglot Persistence',
    'Мартин Фаулер, Прамодкумар Дж. Садаладж',
    'Краткое руководство по NoSQL-базам данных и принципам полиглотной устойчивости',
    '',
    NULL,
    NULL,
    NULL,
    0,
    0,
    0
  );
INSERT INTO
  `books` (
    `id`,
    `title`,
    `author`,
    `description`,
    `year`,
    `pages`,
    `date`,
    `isbn`,
    `clicks`,
    `views`,
    `is_delete`
  )
VALUES
  (
    47,
    'Head First Ruby',
    'Джей Макгаврен',
    'Введение в язык программирования Ruby через нестандартный и интерактивный подход',
    '',
    NULL,
    NULL,
    NULL,
    0,
    0,
    0
  );
INSERT INTO
  `books` (
    `id`,
    `title`,
    `author`,
    `description`,
    `year`,
    `pages`,
    `date`,
    `isbn`,
    `clicks`,
    `views`,
    `is_delete`
  )
VALUES
  (
    48,
    'Practical Vim',
    'Дрю Нейл',
    'Практическое руководство по эффективному использованию текстового редактора Vim',
    '',
    NULL,
    NULL,
    NULL,
    0,
    0,
    0
  );
INSERT INTO
  `books` (
    `id`,
    `title`,
    `author`,
    `description`,
    `year`,
    `pages`,
    `date`,
    `isbn`,
    `clicks`,
    `views`,
    `is_delete`
  )
VALUES
  (
    49,
    'HTML and CSS: Design and Build Websites',
    'Джон Дакетт',
    'Introduction to HTML and CSS for building websites',
    '',
    NULL,
    NULL,
    NULL,
    0,
    0,
    0
  );
INSERT INTO
  `books` (
    `id`,
    `title`,
    `author`,
    `description`,
    `year`,
    `pages`,
    `date`,
    `isbn`,
    `clicks`,
    `views`,
    `is_delete`
  )
VALUES
  (
    50,
    'The Pragmatic Programmer: Your Journey to Mastery',
    'Эндрю Хант, Дэвид Томас',
    'Guide to becoming a more efficient and effective programmer',
    '',
    NULL,
    NULL,
    NULL,
    0,
    0,
    0
  );
INSERT INTO
  `books` (
    `id`,
    `title`,
    `author`,
    `description`,
    `year`,
    `pages`,
    `date`,
    `isbn`,
    `clicks`,
    `views`,
    `is_delete`
  )
VALUES
  (
    51,
    'Java Concurrency in Practice',
    'Брайан Гётц',
    'Comprehensive guide to writing concurrent programs in Java',
    '',
    NULL,
    NULL,
    NULL,
    0,
    0,
    0
  );
INSERT INTO
  `books` (
    `id`,
    `title`,
    `author`,
    `description`,
    `year`,
    `pages`,
    `date`,
    `isbn`,
    `clicks`,
    `views`,
    `is_delete`
  )
VALUES
  (
    52,
    'Ruby on Rails Tutorial: Learn Web Development with Rails',
    'Майкл Хартл',
    'Step-by-step tutorial on building web applications with Ruby on Rails',
    '',
    NULL,
    NULL,
    NULL,
    0,
    0,
    0
  );
INSERT INTO
  `books` (
    `id`,
    `title`,
    `author`,
    `description`,
    `year`,
    `pages`,
    `date`,
    `isbn`,
    `clicks`,
    `views`,
    `is_delete`
  )
VALUES
  (
    54,
    'Eloquent JavaScript: A Modern Introduction to Programming',
    'Мариейн Хавербеке',
    'Introduction to JavaScript programming',
    '',
    NULL,
    NULL,
    NULL,
    0,
    0,
    1
  );
INSERT INTO
  `books` (
    `id`,
    `title`,
    `author`,
    `description`,
    `year`,
    `pages`,
    `date`,
    `isbn`,
    `clicks`,
    `views`,
    `is_delete`
  )
VALUES
  (
    55,
    'C Programming Language',
    'Брайан Керниган, Деннис Ритчи',
    'Classic book on programming in the C language',
    '',
    NULL,
    NULL,
    NULL,
    0,
    0,
    1
  );
INSERT INTO
  `books` (
    `id`,
    `title`,
    `author`,
    `description`,
    `year`,
    `pages`,
    `date`,
    `isbn`,
    `clicks`,
    `views`,
    `is_delete`
  )
VALUES
  (
    56,
    'Machine Learning Yearning',
    'Эндрю Янг',
    'Practical guide to developing and deploying machine learning systems',
    '',
    NULL,
    NULL,
    NULL,
    0,
    0,
    1
  );
INSERT INTO
  `books` (
    `id`,
    `title`,
    `author`,
    `description`,
    `year`,
    `pages`,
    `date`,
    `isbn`,
    `clicks`,
    `views`,
    `is_delete`
  )
VALUES
  (
    57,
    'Dive Into Python 3',
    'Марк Пилгрим',
    'Introduction to Python 3 programming language',
    '',
    NULL,
    NULL,
    NULL,
    0,
    0,
    1
  );
INSERT INTO
  `books` (
    `id`,
    `title`,
    `author`,
    `description`,
    `year`,
    `pages`,
    `date`,
    `isbn`,
    `clicks`,
    `views`,
    `is_delete`
  )
VALUES
  (
    58,
    'The Elements of Computing Systems: Building a Modern Computer from First Principles',
    'Ниссим Нир',
    'Guide to building a computer system from the ground up',
    '',
    NULL,
    NULL,
    NULL,
    0,
    0,
    1
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: id_pairs
# ------------------------------------------------------------

INSERT INTO
  `id_pairs` (`book_id`, `authors_id`)
VALUES
  (23, 23);
INSERT INTO
  `id_pairs` (`book_id`, `authors_id`)
VALUES
  (25, 25);
INSERT INTO
  `id_pairs` (`book_id`, `authors_id`)
VALUES
  (26, 26);
INSERT INTO
  `id_pairs` (`book_id`, `authors_id`)
VALUES
  (27, 27);
INSERT INTO
  `id_pairs` (`book_id`, `authors_id`)
VALUES
  (29, 29);
INSERT INTO
  `id_pairs` (`book_id`, `authors_id`)
VALUES
  (31, 31);
INSERT INTO
  `id_pairs` (`book_id`, `authors_id`)
VALUES
  (32, 32);
INSERT INTO
  `id_pairs` (`book_id`, `authors_id`)
VALUES
  (33, 33);
INSERT INTO
  `id_pairs` (`book_id`, `authors_id`)
VALUES
  (34, 34);
INSERT INTO
  `id_pairs` (`book_id`, `authors_id`)
VALUES
  (35, 35);
INSERT INTO
  `id_pairs` (`book_id`, `authors_id`)
VALUES
  (36, 36);
INSERT INTO
  `id_pairs` (`book_id`, `authors_id`)
VALUES
  (37, 37);
INSERT INTO
  `id_pairs` (`book_id`, `authors_id`)
VALUES
  (38, 38);
INSERT INTO
  `id_pairs` (`book_id`, `authors_id`)
VALUES
  (39, 39);
INSERT INTO
  `id_pairs` (`book_id`, `authors_id`)
VALUES
  (40, 40);
INSERT INTO
  `id_pairs` (`book_id`, `authors_id`)
VALUES
  (41, 41);
INSERT INTO
  `id_pairs` (`book_id`, `authors_id`)
VALUES
  (42, 42);
INSERT INTO
  `id_pairs` (`book_id`, `authors_id`)
VALUES
  (43, 43);
INSERT INTO
  `id_pairs` (`book_id`, `authors_id`)
VALUES
  (44, 44);
INSERT INTO
  `id_pairs` (`book_id`, `authors_id`)
VALUES
  (45, 45);
INSERT INTO
  `id_pairs` (`book_id`, `authors_id`)
VALUES
  (46, 46);
INSERT INTO
  `id_pairs` (`book_id`, `authors_id`)
VALUES
  (47, 47);
INSERT INTO
  `id_pairs` (`book_id`, `authors_id`)
VALUES
  (48, 48);
INSERT INTO
  `id_pairs` (`book_id`, `authors_id`)
VALUES
  (49, 49);
INSERT INTO
  `id_pairs` (`book_id`, `authors_id`)
VALUES
  (50, 50);
INSERT INTO
  `id_pairs` (`book_id`, `authors_id`)
VALUES
  (51, 51);
INSERT INTO
  `id_pairs` (`book_id`, `authors_id`)
VALUES
  (52, 52);
INSERT INTO
  `id_pairs` (`book_id`, `authors_id`)
VALUES
  (53, 53);
INSERT INTO
  `id_pairs` (`book_id`, `authors_id`)
VALUES
  (54, 54);
INSERT INTO
  `id_pairs` (`book_id`, `authors_id`)
VALUES
  (55, 55);
INSERT INTO
  `id_pairs` (`book_id`, `authors_id`)
VALUES
  (56, 56);
INSERT INTO
  `id_pairs` (`book_id`, `authors_id`)
VALUES
  (57, 57);
INSERT INTO
  `id_pairs` (`book_id`, `authors_id`)
VALUES
  (58, 58);

/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
