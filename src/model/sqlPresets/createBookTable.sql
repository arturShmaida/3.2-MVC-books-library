CREATE TABLE `books` (
  `id` int NOT NULL,
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
); 