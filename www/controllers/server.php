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

class Server extends CI_Controller {

	public function __construct()
	{
		parent::__construct();
		$this->activo = "server";
		$this->url = $this->config->item('base_url');
	}
	public function index()
	{
		$data['path'] = $this->url;
		$data['title'] = $this->config->item('site_title');
		$this->template->title($data['title'], 'Inicio');
		$data['server_name'] = $this->config->item('server_name');
		$data['theme'] = $this->config->item('theme');
		$data['activo'] = 'server';
		$data['pagina'] = 'game-index';
		$this->load->model('announces_model');
		$this->template->prepend_metadata('
<link rel="shortcut icon" href="'.$data['path'].'/'.APPPATH.'themes/'.$data['theme'].'/static/local-common/images/favicons/wow.ico" type="image/x-icon"/>
<link rel="stylesheet" type="text/css" media="all" href="'.$data['path'].'/'.APPPATH.'themes/'.$data['theme'].'/static/local-common/css/common.css?v37" />
<!--[if IE]> <link rel="stylesheet" type="text/css" media="all" href="'.$data['path'].'/'.APPPATH.'themes/'.$data['theme'].'/static/local-common/css/common-ie.css?v37" />
<![endif]-->
<!--[if IE 6]> <link rel="stylesheet" type="text/css" media="all" href="'.$data['path'].'/'.APPPATH.'themes/'.$data['theme'].'/static/local-common/css/common-ie6.css?v37" />
<![endif]-->
<!--[if IE 7]> <link rel="stylesheet" type="text/css" media="all" href="'.$data['path'].'/'.APPPATH.'themes/'.$data['theme'].'/static/local-common/css/common-ie7.css?v37" />
<![endif]-->
<link rel="stylesheet" type="text/css" media="all" href="'.$data['path'].'/'.APPPATH.'themes/'.$data['theme'].'/static/css/wow.css?v19" />
<link rel="stylesheet" type="text/css" media="all" href="'.$data['path'].'/'.APPPATH.'themes/'.$data['theme'].'/static/css/wiki/wiki.css?v19" />
<!--[if IE]> <link rel="stylesheet" type="text/css" media="all" href="'.$data['path'].'/'.APPPATH.'themes/'.$data['theme'].'/static/css/wiki/wiki-ie.css?v19" />
<![endif]-->
<link rel="stylesheet" type="text/css" media="all" href="'.$data['path'].'/'.APPPATH.'themes/'.$data['theme'].'/static/css/game/game-index.css?v19" />
<!--[if IE]> <link rel="stylesheet" type="text/css" media="all" href="'.$data['path'].'/'.APPPATH.'themes/'.$data['theme'].'/static/css/wow-ie.css?v19" />
<![endif]-->
<!--[if IE 6]> <link rel="stylesheet" type="text/css" media="all" href="'.$data['path'].'/'.APPPATH.'themes/'.$data['theme'].'/static/css/wow-ie6.css?v19" />
<![endif]-->
<!--[if IE 7]> <link rel="stylesheet" type="text/css" media="all" href="/wow/static/css/wow-ie7.css?v19" />
<![endif]-->
<link rel="stylesheet" type="text/css" media="all" href="'.$data['path'].'/'.APPPATH.'themes/'.$data['theme'].'/static/local-common/css/locale/es-es.css?v37" />
<link rel="stylesheet" type="text/css" media="all" href="'.$data['path'].'/'.APPPATH.'themes/'.$data['theme'].'/static/css/locale/es-es.css?v19" />
<script type="text/javascript" src="'.$data['path'].'/'.APPPATH.'themes/'.$data['theme'].'/static/local-common/js/third-party/jquery.js?v37"></script>
<script type="text/javascript" src="'.$data['path'].'/'.APPPATH.'themes/'.$data['theme'].'/static/local-common/js/core.js?v37"></script>
<script type="text/javascript" src="'.$data['path'].'/'.APPPATH.'themes/'.$data['theme'].'/static/local-common/js/tooltip.js?v37"></script>
<!--[if IE 6]> <script type="text/javascript">
//<![CDATA[
try { document.execCommand(\'BackgroundImageCache\', false, true) } catch(e) {}
//]]>
</script>
<![endif]-->');
$data['announce'] = $this->announces_model->announce();
$this->template->build('server', $data);
	}
}