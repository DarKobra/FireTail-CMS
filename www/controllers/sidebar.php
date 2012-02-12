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

class Sidebar extends CI_Controller {

	public function __construct()
	{
		parent::__construct();
	}
	public function sotd()
	{
		$this->load->model('news_model');
		$data['news'] = $this->news_model->get_news();
		$this->load->view('/sidebar/sotd', $data);
	}
	public function related_articles()
	{
		$this->load->model('news_model');
		$data['news'] = $this->news_model->get_news();
		$this->load->view('/sidebar/related-articles', $data);
	}
	public function recent_articles()
	{
		$this->load->model('news_model');
		$data['news'] = $this->news_model->get_news();
		$this->load->view('/sidebar/recent-articles', $data);
	}
	public function forums()
	{
		$this->load->model('news_model');
		$data['news'] = $this->news_model->get_news();
		$this->load->view('/sidebar/forums', $data);
	}
}