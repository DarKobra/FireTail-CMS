DROP TABLE IF EXISTS `drak_announces`;

CREATE TABLE `drak_announces` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `imagen` varchar(128) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL DEFAULT '',
  `link` varchar(200) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  PRIMARY KEY (`id`,`imagen`,`link`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;

DROP TABLE IF EXISTS `drak_index_slideshow`;

CREATE TABLE `drak_index_slideshow` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(30) CHARACTER SET utf8 NOT NULL,
  `desc` tinytext CHARACTER SET utf8,
  `banner` varchar(128) CHARACTER SET utf8 NOT NULL,
  `link` varchar(128) CHARACTER SET utf8 NOT NULL,
  PRIMARY KEY (`id`,`title`,`banner`,`link`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;

DROP TABLE IF EXISTS `drak_news`;

CREATE TABLE `drak_news` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `date` varchar(128) CHARACTER SET utf8 NOT NULL,
  `thumb` varchar(28) NOT NULL,
  `author` varchar(128) CHARACTER SET utf8 NOT NULL,
  `title` varchar(128) CHARACTER SET utf8 NOT NULL,
  `text` text CHARACTER SET utf8 NOT NULL,
  PRIMARY KEY (`id`,`date`,`author`,`thumb`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;

DROP TABLE IF EXISTS `drak_news_comments`;

CREATE TABLE `drak_news_comments` (
  `id` int(50) unsigned NOT NULL AUTO_INCREMENT,
  `id_news` int(20) NOT NULL,
  `user` varchar(50) NOT NULL,
  `date` varchar(60) NOT NULL,
  `comment` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;

DROP TABLE IF EXISTS `drak_users`;

CREATE TABLE `drak_users` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT 'Identifier',
  `username` varchar(32) NOT NULL DEFAULT '',
  `email` text NOT NULL,
  `points` tinyint(10) NOT NULL DEFAULT '0',
  `coins` tinyint(10) NOT NULL DEFAULT '0',
  `level` tinyint(3) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `idx_gmlevel` (`level`)
) ENGINE=MyISAM AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC COMMENT='Account System';
