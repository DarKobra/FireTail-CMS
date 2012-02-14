DROP TABLE IF EXISTS `drak_announces`;

CREATE TABLE `drak_announces` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `imagen` varchar(128) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL DEFAULT '',
  `link` varchar(200) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  PRIMARY KEY (`id`,`imagen`,`link`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;

/*Table structure for table `drak_index_slideshow` */

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

/*Table structure for table `drak_news` */

DROP TABLE IF EXISTS `drak_news`;

CREATE TABLE `drak_news` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `thumb` varchar(28) NOT NULL,
  `author` varchar(128) CHARACTER SET utf8 NOT NULL,
  `title` varchar(128) CHARACTER SET utf8 NOT NULL,
  `text` text CHARACTER SET utf8 NOT NULL,
  `date` varchar(200) NOT NULL,
  PRIMARY KEY (`id`,`thumb`,`author`,`date`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;

/*Table structure for table `drak_news_comments` */

DROP TABLE IF EXISTS `drak_news_comments`;

CREATE TABLE `drak_news_comments` (
  `id` int(50) unsigned NOT NULL AUTO_INCREMENT,
  `id_news` int(20) NOT NULL,
  `user` varchar(50) NOT NULL,
  `date` varchar(60) NOT NULL,
  `comment` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;

/*Table structure for table `drak_users` */

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

DROP TABLE IF EXISTS `drak_reinos`;

CREATE TABLE `drak_reinos` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(32) NOT NULL,
  `host` varchar(32) NOT NULL DEFAULT '127.0.0.1',
  `puerto` int(11) NOT NULL DEFAULT '8085',
  `char_db` varchar(32) NOT NULL,
  `world_db` varchar(32) NOT NULL,
  `ra_user` varchar(128) NOT NULL,
  `ra_pass` varchar(128) NOT NULL,
  `version` varchar(64) NOT NULL,
  PRIMARY KEY (`id`,`ra_user`,`ra_pass`,`char_db`,`world_db`),
  UNIQUE KEY `idx_name` (`nombre`)
) ENGINE=MyISAM AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC COMMENT='Firetail Realm System';