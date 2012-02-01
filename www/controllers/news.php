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

class News extends CI_Controller {

	function __construct()
	{
		parent::__construct();
		$this->load->model('islideshow_model');
		$this->load->model('news_model');
		$this->load->model('announces_model');
		$title = $this->config->item('site_title');
		$this->template->title($title);
		$this->load->helper('date');
	}

	public function index()
	{
		$this->load->helper("text");
		$data['limit'] = $this->config->item('index_slides_limit');
		$data['path'] = $this->config->item('base_url');
		$data['server_name'] = $this->config->item('server_name');
		$data['theme'] = $this->config->item('theme');
	$this->template->prepend_metadata('
	<meta http-equiv="content-type" content="text/html;charset=UTF-8">
	<link rel="shortcut icon" href="'.$data['path'].'/'.APPPATH.'themes/'.$data['theme'].'/static/local-common/images/favicons/wow.ico" type="image/x-icon"/>
	<link rel="stylesheet" type="text/css" media="all" href="'.$data['path'].'/'.APPPATH.'themes/'.$data['theme'].'/static/local-common/css/common.css?v37" />
	<!--[if IE]> <link rel="stylesheet" type="text/css" media="all" href="'.$data['path'].'/'.APPPATH.'themes/'.$data['theme'].'/static/local-common/css/common-ie.css?v37" />
	<![endif]-->
	<!--[if IE 6]> <link rel="stylesheet" type="text/css" media="all" href="'.$data['path'].'/'.APPPATH.'themes/'.$data['theme'].'/static/local-common/css/common-ie6.css?v37" />
	<![endif]-->
	<!--[if IE 7]> <link rel="stylesheet" type="text/css" media="all" href="'.$data['path'].'/'.APPPATH.'themes/'.$data['theme'].'/static/local-common/css/common-ie7.css?v37" />
	<![endif]-->
	<link rel="stylesheet" type="text/css" media="all" href="'.$data['path'].'/'.APPPATH.'themes/'.$data['theme'].'/static/css/wow.css?v19" />
	<link rel="stylesheet" type="text/css" media="all" href="'.$data['path'].'/'.APPPATH.'themes/'.$data['theme'].'/static/local-common/css/cms/homepage.css?v37" />
	<link rel="stylesheet" type="text/css" media="all" href="'.$data['path'].'/'.APPPATH.'themes/'.$data['theme'].'/static/local-common/css/cms/blog.css?v37" />
	<link rel="stylesheet" type="text/css" media="all" href="'.$data['path'].'/'.APPPATH.'themes/'.$data['theme'].'/static/local-common/css/cms/cms-common.css?v37" />
	<link rel="stylesheet" type="text/css" media="all" href="'.$data['path'].'/'.APPPATH.'themes/'.$data['theme'].'/static/css/cms.css?v19" />
	<!--[if IE 6]> <link rel="stylesheet" type="text/css" media="all" href="'.$data['path'].'/'.APPPATH.'themes/'.$data['theme'].'/static/css/cms-ie6.css?v19" />
	<![endif]-->
	<!--[if IE]> <link rel="stylesheet" type="text/css" media="all" href="'.$data['path'].'/'.APPPATH.'themes/'.$data['theme'].'/static/css/wow-ie.css?v19" />
	<![endif]-->
	<!--[if IE 6]> <link rel="stylesheet" type="text/css" media="all" href="'.$data['path'].'/'.APPPATH.'themes/'.$data['theme'].'/static/css/wow-ie6.css?v19" />
	<![endif]-->
	<!--[if IE 7]> <link rel="stylesheet" type="text/css" media="all" href="'.$data['path'].'/'.APPPATH.'themes/'.$data['theme'].'/static/css/wow-ie7.css?v19" />
	<![endif]-->
	<link rel="stylesheet" type="text/css" media="all" href="'.$data['path'].'/'.APPPATH.'themes/'.$data['theme'].'/static/local-common/css/locale/es-es.css?v37" />
	<link rel="stylesheet" type="text/css" media="all" href="'.$data['path'].'/'.APPPATH.'themes/'.$data['theme'].'/static/css/locale/es-es.css?v19" />
	<script type="text/javascript" src="'.$data['path'].'/'.APPPATH.'themes/'.$data['theme'].'/static/local-common/js/third-party/jquery.js?v37"></script>
	<script type="text/javascript" src="'.$data['path'].'/'.APPPATH.'themes/'.$data['theme'].'/static/local-common/js/core.js?v37"></script>
	<script type="text/javascript" src="'.$data['path'].'/'.APPPATH.'themes/'.$data['theme'].'/static/local-common/js/tooltip.js?v37"></script>
	<!--[if IE 6]> <script type="text/javascript">
	//<![CDATA[
	try { document.execCommand(BackgroundImageCache, false, true) } catch(e) {}
	//]]>
	</script>
	<![endif]-->
	<meta name="title" content="World of Warcraft" />
	<link rel="image_src" href="'.$data['path'].'/'.APPPATH.'themes/'.$data['theme'].'/static/images/icons/facebook/game.html" />
	');
		$data['islider'] = $this->islideshow_model->get_slides($data['limit']);
		$data['leader_islider'] = $this->islideshow_model->get_leader_slide();
		$data['news'] = $this->news_model->get_news();
		$data['news_top'] = $this->news_model->get_top_min_news();
		$data['announce'] = $this->announces_model->announce();
		$this->template->build('index', $data);
	}

	public function view($Id)
	{
		$data['news_item'] = $this->news_model->get_news($Id);
		if (empty($data['news_item']))
		{
			show_404();
		}
		$data['title'] = $data['news_item']['title'];
		$data['total_comments'] = $this->news_model->get_total_comments($Id);
		if(empty($data['total_comments']))
		{
		$data['total_comments'] = 0;
		}			
		$data['comments'] = $this->news_model->get_comments($Id);
		$this->form_validation->set_rules('comment', 'Comment', 'required|min_length[5]|max_length[250]|xss_clean');
		if ($this->form_validation->run() === FALSE)
		{
		$this->template->build('news/view', $data);
		}
		else
		{
		$this->news_model->set_comments($Id);
		redirect('news/'.$Id.'', 'refresh');
		}
	}
	public function create()
	{
		$this->form_validation->set_rules('title', 'Title', 'required');
		$this->form_validation->set_rules('text', 'text', 'required');
		
		if ($this->form_validation->run() === FALSE)
		{
			$this->template->build('news/create');
			
		}
		else
		{
			$this->news_model->set_news();
			$this->template->build('news/success');
		}
	}
}