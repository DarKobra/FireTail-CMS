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
?>	
<!DOCTYPE html>
	<html xmlns="http://www.w3.org/1999/xhtml">
	<head>
		<title></title>
		<link rel="stylesheet" type="text/css" href="/www/themes/retail/static/local-common/css/common.css?v22"/>
		<link rel="stylesheet" type="text/css" href="/www/themes/retail/static/_themes/bam/css/master.css?v1"/>
			<link rel="stylesheet" type="text/css" media="all" href="/www/themes/retail/static/local-common/css/locale/es-es.css?v22" />
			<link rel="stylesheet" type="text/css" media="all" href="/www/themes/retail/static/_themes/bam/css/_lang/es-es.css?v1" />
		<script type="text/javascript" src="/www/themes/retail/static/local-common/js/third-party/jquery-1.4.4-p1.min.js"></script>
		<script type="text/javascript" src="/www/themes/retail/static/local-common/js/core.js?v22"></script>
		<script>
			var targetOrigin = "<?php echo $path; ?>";

			function updateParent(action, key, value) {
				var obj = { action: action };

				if (key) obj[key] = value;

				parent.postMessage(JSON.stringify(obj), targetOrigin);
				return false;
			}

			function checkDefaultValue(input, isPass) {
				if (input.value == input.title)
					input.value = "";

				if (isPass)
					input.type = "password";
			}
		</script>
	</head>
	<body>
		<div id="embedded-login">
			<h1>Battle.net</h1>
	<?php echo form_open('account/login'); ?>
	<?
		if(validation_errors())
		{
			echo "<div id=\"errors\">
			<ul>
			<li>".validation_errors()."</li>
		</ul>
		</div>";
		}
      if(isset($error)){
         echo "<div id=\"errors\">
			<ul>
			<li>".$error."</li>
		</ul>
		</div>";
      }
      ?>
		<a id="embedded-close" href="javascript:;" onClick="updateParent('close')"> </a>

		<div>

			<p><label for="accountName" class="label">Direcci&oacute;n de e-mail</label>
			<input id="accountName" value="" name="username" maxlength="320" type="text" tabindex="1" class="input" value="<?php echo set_value('username'); ?>" /></p>

			<p><label for="password" class="label">Contrase&ntilde;a</label>
			<input id="password" name="password" maxlength="16" type="password" tabindex="2" autocomplete="off" class="input" value="<?php echo set_value('password'); ?>" /></p>


			<p>
				<span id="remember-me">
					<label for="persistLogin">
						<input type="checkbox" checked="checked" name="persistLogin" id="persistLogin" />
						Seguir conectado
					</label>
				</span>

				<input type="hidden" name="app" value="com-sc2"/>

				

	<button
		class="ui-button button1 "
			type="submit"
			data-text="Procesando..."
		
		
		
		
		
		
		>
		<span>
			<span>Iniciar sesi&oacute;n</span>
		</span>
	</button>

			</p>
		</div>
        
	<ul id="help-links">


				<li class="icon-pass">
					No puedes <a href="https://eu.battle.net/account/support/login-support.html">iniciar sesi&oacute;n</a>?
				</li>

			<li class="icon-secure">
				M&aacute;s informaci&oacute;n sobre c&oacute;mo <a href="http://eu.battle.net/security/?ref=">proteger tu cuenta</a>.
			</li>



				<li class="icon-signup">
					A&uacute;n no tienes una cuenta? <a href="https://eu.battle.net/account/creation/tos.html?ref=">Reg&iacute;strate ya</a>!
				</li>



	</ul>
		
		
		<script type="text/javascript">
			$(function() {
				$("#ssl-trigger").click(function() {
					updateParent('onload', 'height', $(document).height() + 76);
					$("#thawteseal").show();
				});
				
				$("#help-links a").click(function() {
					updateParent('redirect', 'url', this.href);
					return false;
				});

				$('#accountName').focus();

				updateParent('onload', 'height', $(document).height());
			});
		</script>
	</form>
		</div>
	</body>
	</html>