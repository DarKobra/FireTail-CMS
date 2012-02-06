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

class Islideshow_model extends CI_Model {

	function __construct()
	{
		parent::__construct();
	}
	public function get_slides()
	{
			$query = $this->db->query("SELECT * FROM `drak_index_slideshow` ORDER BY `id` DESC");
			return $query->result_array();
	}
	public function get_num_slides()
	{
			return $this->db->count_all('drak_index_slideshow');
	}
	public function get_leader_slide()
	{
			$query = $this->db->query("SELECT * FROM `drak_index_slideshow` ORDER BY `id` ASC LIMIT 1");
			return $query->result_array();
	}
}
