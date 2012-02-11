<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');
/*
| -------------------------------------------------------------------
| DATABASE CONNECTIVITY SETTINGS
| -------------------------------------------------------------------
| This file will contain the settings needed to access your database.
|
| For complete instructions please consult the 'Database Connection'
| page of the User Guide.
*/
$active_group = 'db1';
$active_record = TRUE;

$db['db1']['hostname'] = ''; // HOST del MySQL
$db['db1']['username'] = ''; // USUARIO del MySQL
$db['db1']['password'] = ''; // CONTRASEÑA del MySQL
$db['db1']['database'] = ''; // BASE DE DATOS DONDE SE ALMACENA EL SITIO Y EL AUTH(PUEDE SER AUTH O REALMD)
$db['db1']['dbdriver'] = 'mysql';
$db['db1']['dbprefix'] = 'drak_';
$db['db1']['pconnect'] = FALSE;
$db['db1']['db_debug'] = TRUE;
$db['db1']['cache_on'] = FALSE;
$db['db1']['cachedir'] = '';
$db['db1']['char_set'] = 'utf8';
$db['db1']['dbcollat'] = 'utf8_general_ci';
$db['db1']['swap_pre'] = '';
$db['db1']['autoinit'] = TRUE;
$db['db1']['stricton'] = FALSE;


/* End of file database.php */
/* Location: ./application/config/database.php */