DROP TABLE IF EXISTS `drak_announces`;

CREATE TABLE `drak_announces` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `imagen` varchar(128) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL DEFAULT '',
  `link` varchar(200) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  PRIMARY KEY (`id`,`imagen`,`link`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

/*Data for the table `drak_announces` */

insert  into `drak_announces`(`id`,`imagen`,`link`) values (1,'free_play','http://localhost');

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
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;

/*Data for the table `drak_index_slideshow` */

insert  into `drak_index_slideshow`(`id`,`title`,`desc`,`banner`,`link`) values (1,'FireTailCMS','DrakantasCMS ahora se llamar&aacute; FireTailCMS!!','wow','http://localhost');
insert  into `drak_index_slideshow`(`id`,`title`,`desc`,`banner`,`link`) values (7,'Sabee','Cool','expansion','http://localhost');
insert  into `drak_index_slideshow`(`id`,`title`,`desc`,`banner`,`link`) values (8,'Test 3','Sabeee','sell','http://localhost');

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
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;

/*Data for the table `drak_news` */

insert  into `drak_news`(`id`,`thumb`,`author`,`title`,`text`,`date`) values (1,'repair','Drakantas','DrakantasCMS','DrakantasCMS v.0.0.2 ya revelada!!<br />\r\nChangelog:<br />\r\n. Agregado sistema de login.<br />\r\n. Fixeado sistema de registro de cuentas y de noticias.<br />\r\n. Panel de cuenta (Obtenci&oacute;n de informaci&oacute;n terminado).<br />\r\nPara v.0.0.3:<br />\r\n. Se agregar&aacute; seguridad para todas las query\'s del sitio.<br />\r\n. Creación de Libreria de Wow(Telnet y SHA1 Encryption).<br />\r\n. Sistema de Comentarios para las noticias.','1320000000');
insert  into `drak_news`(`id`,`thumb`,`author`,`title`,`text`,`date`) values (2,'future','Drakantas','DrakantasCMS UPDATE','DrakantasCMS v.0.0.3 ya revelada!!<br />\r\nChangelog:<br />\r\n. Se agregar&aacute; seguridad para todas las query\'s del sitio.<br />\r\n. Creación de Libreria Personalizada(Telnet y SHA1 Encryption).<br />\r\n. Sistema de Comentarios para las noticias.<br />\r\nPara v.0.0.4:<br />\r\n. Se agregar&aacute; seguridad para todas las query\'s del sitio.<br />\r\n. Creación de Libreria de Wow(Telnet y SHA1 Encryption).<br />\r\n. Sistema de Comentarios para las noticias.','1320000000');
insert  into `drak_news`(`id`,`thumb`,`author`,`title`,`text`,`date`) values (3,'console','Drakantas','FireTailCMS','El CMS se llamar&aacute; ahora FireTailCMS.<br />\r\nBienvenidos a FireTailCMS.','1320000000');
insert  into `drak_news`(`id`,`thumb`,`author`,`title`,`text`,`date`) values (4,'console','Drakantas','Probando Unix Time','Mejorando sistema de Fechas.<br />\r\n:O :·3','1320000000');
insert  into `drak_news`(`id`,`thumb`,`author`,`title`,`text`,`date`) values (5,'repair','Drakantas','Fixeando Unix Time','Bla Bla Bla<br />\r\nadasdasdasdas<br />\r\nxd','1329151365');

/*Table structure for table `drak_news_comments` */

DROP TABLE IF EXISTS `drak_news_comments`;

CREATE TABLE `drak_news_comments` (
  `id` int(50) unsigned NOT NULL AUTO_INCREMENT,
  `id_news` int(20) NOT NULL,
  `user` varchar(50) NOT NULL,
  `date` varchar(60) NOT NULL,
  `comment` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

/*Data for the table `drak_news_comments` */

insert  into `drak_news_comments`(`id`,`id_news`,`user`,`date`,`comment`) values (1,1,'Asfo','01-01-2011','Prueba');
insert  into `drak_news_comments`(`id`,`id_news`,`user`,`date`,`comment`) values (2,1,'Asfo','01-01-2012','Lorem ipsum');
insert  into `drak_news_comments`(`id`,`id_news`,`user`,`date`,`comment`) values (3,2,'Drakantas','01-01-2012','Probando, testing :)');

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
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC COMMENT='Account System';

/*Data for the table `drak_users` */

insert  into `drak_users`(`id`,`username`,`email`,`points`,`coins`,`level`) values (1,'Drakantas','pok_mu@hotmail.com',0,0,0);