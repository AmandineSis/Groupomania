-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : mar. 07 juin 2022 à 17:18
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

-- --------------------------------------------------------

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
) ENGINE=InnoDB AUTO_INCREMENT=55 DEFAULT CHARSET=utf8mb3;

--
-- Déchargement des données de la table `comments`
--

INSERT INTO `comments` (`comId`, `userId`, `commentContent`, `postId`, `imageUrl`) VALUES
(49, 1, 'gter', 31, NULL),
(53, 2, 'Salut à tous ! :)', 27, 'http://localhost:3000/images/comment/95dc39ee640098e7ed1d49facfbf2157.png1654614090887.png'),
(54, 4, 'Bonjour ça va ?', 28, NULL);

-- --------------------------------------------------------

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
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb3;

--
-- Déchargement des données de la table `likes`
--

INSERT INTO `likes` (`likeId`, `userId`, `postId`) VALUES
(2, 3, 28),
(4, 2, 27),
(5, 1, 28),
(6, 4, 28);

-- --------------------------------------------------------

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
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb3;

--
-- Déchargement des données de la table `posts`
--

INSERT INTO `posts` (`postId`, `userId`, `created`, `content`, `likes`, `comments`, `imageUrl`, `report`) VALUES
(27, 1, '2022-06-07 11:52:00', ' Bienvenue sur le réseau social de Groupomania ! :)', 1, 1, 'http://localhost:3000/images/post/beachsunnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn.jpg1654595601375.jpg', 0),
(28, 3, '2022-06-07 11:53:40', 'Salut tout le monde ! :)', 3, 1, NULL, 0),
(31, 3, '2022-06-07 14:20:26', 'Bientôt le week-end !', 0, 0, 'http://localhost:3000/images/post/week-end-logikart.jpg1654621757833.jpg', 0);

-- --------------------------------------------------------

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
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb3;

-- --------------------------------------------------------

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
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb3;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`userId`, `firstName`, `lastName`, `email`, `password`, `profilePicUrl`, `moderator`) VALUES
(1, 'Admin', 'Groupomania', 'admin@groupomania.com', '$2b$10$zylMi8fiEL1up5JtY5U.NeA1U/NMmn9vzdC.FVoxd7nNG8o7P2Pt.', 'http://localhost:3000/images/user/icon-above-font.png1654516529075.png', 1),
(2, 'Amandine', 'Sismondi', 'am.sismondi@gmail.com', '$2b$10$JiJhrwW0JiMm.0Dqp2TGH.FqzbZn3DUmpugN6Hdo7TT9B8q.Nh25e', 'http://localhost:3000/images/user/g5th4b.jpg1654516793425.jpg', 0),
(3, 'Ron', 'Weasley', 'ron@gmail.com', '$2b$10$uV/e9MzPitFdmbJBO6fVPeoOOFkVO.F5hO2ST0ic9hjVulmh1IZ.2', 'http://localhost:3000/images/user/ron.jpg1654516834259.jpg', 0),
(4, 'Alice', 'Wonderland', 'alice@gmail.com', '$2b$10$BPfqFUAard8dTrnT2bVHQuo571vreiDRTAKPHY.1zmTN9jD/qujfW', 'http://localhost:3000/images/user/alice.jpg1654621694777.jpg', 0);

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
