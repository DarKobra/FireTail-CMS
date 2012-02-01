<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');

$route['news/create'] = 'news/create';
$route['news/(:any)'] = 'news/view/$1';
$route['news'] = 'news';
$route['account'] = 'account';
$route['account/register'] = 'account/register';
$route['account/login'] = 'account/login';
$route['account/logout'] = 'account/logout';
$route['(:any)'] = 'pages/view/$1';
$route['default_controller'] = 'news';


/* End of file routes.php */
/* Location: ./application/config/routes.php */