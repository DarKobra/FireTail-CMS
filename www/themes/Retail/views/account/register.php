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
<code><?php echo validation_errors(); ?></code>
<?php echo form_open('account/register'); ?>
		<code>
		  <label>Nombre de Cuenta:
		    <input type="text" name="username" value="<?php echo set_value('username'); ?>">
	      </label>
	  </code>
		<code>
		<label>Contrase&ntilde;a: 
		    <input type="password" name="password" value="<?php echo set_value('password'); ?>">
	      </label>
		  </code>
		  <code>
		<label>Repetir Contrase&ntilde;a: 
		    <input type="password" name="repeat_password" value="<?php echo set_value('repeat_password'); ?>">
	      </label>
		  </code>
		  <code>
		<label>Email: 
		    <input type="text" name="email" value="<?php echo set_value('email'); ?>">
	      </label>
		  </code>
		  <code>
		<label>Repetir Email: 
		    <input type="text" name="repeat_email" value="<?php echo set_value('repeat_email'); ?>">
	      </label>
		  </code>
		  <code>
		<label>
		    <input type="submit" value="Crear Cuenta">
	      </label>
		  </code>
	</div>