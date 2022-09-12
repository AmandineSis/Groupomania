-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : jeu. 23 juin 2022 à 19:35
-- Version du serveur : 8.0.28
-- Version de PHP : 7.4.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `groupomaniadb`
--

-- 

--
-- Structure de la table `comments`
--

DROP TABLE IF EXISTS `comments`;
CREATE TABLE IF NOT EXISTS `comments` (
  `comId` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `commentContent` text CHARACTER SET utf8 COLLATE utf8_general_ci,
  `postId` int NOT NULL,
  `imageUrl` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`comId`),
  KEY `fk_comments_posts1_idx` (`postId`),
  KEY `fk_comments_users1_idx` (`userId`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=177 DEFAULT CHARSET=utf8mb3;

--
-- Déchargement des données de la table `comments`
--

INSERT INTO `comments` (`comId`, `userId`, `commentContent`, `postId`, `imageUrl`) VALUES
(158, 8, 'can\'t wait ! --\'', 46, NULL),
(162, 4, 'Oui bon courage à toi aussi ! :)', 46, NULL),
(163, 8, 'cool !', 59, NULL),
(174, 24, 'Super ! :)', 59, 'http://localhost:3000/images/comment/95dc39ee640098e7ed1d49facfbf2157.png1655997228718.png'),
(175, 8, 'Salut ! ', 64, NULL),
(176, 18, 'Il est déjà parti !', 65, NULL);

-- 

--
-- Structure de la table `likes`
--

DROP TABLE IF EXISTS `likes`;
CREATE TABLE IF NOT EXISTS `likes` (
  `likeId` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `postId` int NOT NULL,
  PRIMARY KEY (`likeId`),
  KEY `fk_likes_users1_idx` (`userId`),
  KEY `fk_likes_posts1_idx` (`postId`)
) ENGINE=InnoDB AUTO_INCREMENT=89 DEFAULT CHARSET=utf8mb3;

--
-- Déchargement des données de la table `likes`
--

INSERT INTO `likes` (`likeId`, `userId`, `postId`) VALUES
(70, 4, 46),
(72, 8, 59),
(82, 24, 59),
(83, 8, 64),
(84, 8, 46),
(85, 18, 65),
(86, 18, 64),
(87, 18, 59),
(88, 18, 46);

-- 

--
-- Structure de la table `posts`
--

DROP TABLE IF EXISTS `posts`;
CREATE TABLE IF NOT EXISTS `posts` (
  `postId` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `created` datetime DEFAULT CURRENT_TIMESTAMP,
  `content` text,
  `likes` int DEFAULT '0',
  `comments` int DEFAULT '0',
  `imageUrl` varchar(255) DEFAULT NULL,
  `report` int DEFAULT '0',
  PRIMARY KEY (`postId`),
  KEY `fk_posts_comments1` (`comments`),
  KEY `fk_posts_users` (`userId`)
) ENGINE=InnoDB AUTO_INCREMENT=67 DEFAULT CHARSET=utf8mb3;

--
-- Déchargement des données de la table `posts`
--

INSERT INTO `posts` (`postId`, `userId`, `created`, `content`, `likes`, `comments`, `imageUrl`, `report`) VALUES
(46, 3, '2022-06-11 17:18:17', 'Allez bientôt le week-end ! courage à tous ! ;)', 5, 2, 'http://localhost:3000/images/post/week-end-logikart.jpg1655376334695.jpg', 0),
(59, 4, '2022-06-16 13:15:48', 'Prochaine soirée organisée par le CE bientôt ! :D', 5, 4, 'http://localhost:3000/images/post/360_F_238759515_aE4K0v5UVo5LyvAwu4PfE2pH0oxrc4f3.jpg1655378148007.jpg', 0),
(64, 24, '2022-06-23 17:13:19', 'Salut tout le monde ! ', 2, 1, 'http://localhost:3000/images/post/beachsunnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn.jpg1655997199324.jpg', 0),
(65, 8, '2022-06-23 17:16:12', 'Quelqu\'un a vu Luke ?!', 1, 1, 'http://localhost:3000/images/post/DcWCTnhX0AE_SxF.png1655997372215.png', 0),
(66, 18, '2022-06-23 17:17:44', 'J\'espère que notre réseau social vous plaît ! :D', 0, 0, 'http://localhost:3000/images/post/beachsunnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn.jpg1655997464236.jpg', 0);

-- 

--
-- Structure de la table `report`
--

DROP TABLE IF EXISTS `report`;
CREATE TABLE IF NOT EXISTS `report` (
  `reportId` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `postId` int NOT NULL,
  PRIMARY KEY (`reportId`),
  KEY `fk_report_users` (`userId`),
  KEY `fk_report_posts` (`postId`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb3;

--

--
-- Structure de la table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `userId` int NOT NULL AUTO_INCREMENT,
  `firstName` varchar(255) NOT NULL,
  `lastName` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `profilePicUrl` varchar(255) DEFAULT NULL,
  `moderator` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`userId`,`email`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb3;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`userId`, `firstName`, `lastName`, `email`, `password`, `profilePicUrl`, `moderator`) VALUES
(3, 'Ron', 'Weasley', 'ron@gmail.com', '$2b$10$uV/e9MzPitFdmbJBO6fVPeoOOFkVO.F5hO2ST0ic9hjVulmh1IZ.2', 'http://localhost:3000/images/user/ron.jpg1654516834259.jpg', 0),
(4, 'Alice', 'Wonderland', 'alice@gmail.com', '$2b$10$BPfqFUAard8dTrnT2bVHQuo571vreiDRTAKPHY.1zmTN9jD/qujfW', 'http://localhost:3000/images/user/alice.jpg1654621694777.jpg', 0),
(8, 'Darth', 'Vader', 'dv@starwars.com', '$2b$10$ndSUflQaCvELYCYT9iaTY.80L/KGcyAuXynymBf7fnFS2gIl./jdy', 'http://localhost:3000/images/user/darth-crossing-arms2.jpg1655376064299.jpg', 0),
(10, 'Hermione', 'Granger', 'hg@poudlard.com', '$2b$10$cVO28SjLQ9KPjzYXPvaRXuqfLiRw8Rjop4lUuJcNWbHzbEodnmF6W', 'http://localhost:3000/images/user/profilePicDefault.jpg', 0),
(18, 'Admin', 'Groupomania', 'admin@groupomania.com', '$2b$10$6i6qNy8LZBxy5gS93DDQgulF264DfT3CmpqO77/wZU0P2AEVYuBze', 'http://localhost:3000/images/user/icon-above-font.png1655461635766.png', 1),
(24, 'Amandine', 'Sismondi', 'am.sismondi@gmail.com', '$2b$10$UAkPLNew08zn52zcSL7x.O8rj.AC8O9QtNzUErPkU6.qQs1/7/WoO', 'http://localhost:3000/images/user/magna-carta-by-hyung-tae-kim.jpg1655997159403.jpg', 0);

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `fk_comments_posts` FOREIGN KEY (`postId`) REFERENCES `posts` (`postId`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_comments_users` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `likes`
--
ALTER TABLE `likes`
  ADD CONSTRAINT `fk_likes_posts` FOREIGN KEY (`postId`) REFERENCES `posts` (`postId`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_likes_users` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `posts`
--
ALTER TABLE `posts`
  ADD CONSTRAINT `fk_posts_users` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `report`
--
ALTER TABLE `report`
  ADD CONSTRAINT `fk_report_posts` FOREIGN KEY (`postId`) REFERENCES `posts` (`postId`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_report_users` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
