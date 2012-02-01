<?php
if (!defined('BASEPATH')) exit('No se permite el acceso a este script.');
/**********************************************************************************
*	
*		FireTail CMS
* 		-------------------------------------------------------------------
*		Autor		:	Frozen Team
*		Copyright	: 	Copyright (C) 2012, Frozen Team
*		Licencia	:	GNU GPL v3
*		Link		: 	http://github.com/FrozenTeam/
*		--------------------------------------------------------------------
*
**********************************************************************************/
?><div id="body">
		<p>Bienvenido: <b style="text-transform:capitalize;"><?php echo $username; ?></b>.</p>
		<p>E-mail: <b style="text-transform:capitalize;"><?php echo $email; ?></b></p>
		<p>Fecha de Ingreso: <b style="text-transform:capitalize;"><?php echo $joindate; ?></b></p>
		<p>Expansion: <b style="text-transform:capitalize;">
		<?php
		if($expansion == 2){print "Wrath of the Lich King";}
		if($expansion == 1){print "The Burning Crusade";}
		if($expansion == 0){print "Classic";}
		?></b></p>
		<p>Baneado: <b style="text-transform:capitalize;"><?php if($banned != 0){print "Baneado";}else{print "No Baneado";} ?></b></p>
		<p>Monedas: <b style="text-transform:capitalize;"><?php echo $coins; ?></b></p>
		<p>Puntos: <b style="text-transform:capitalize;"><?php echo $points; ?></b></p>
	</div>