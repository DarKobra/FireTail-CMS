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

class Announces_model extends CI_Model {

	function __construct()
	{
		parent::__construct();
	}
	public function announce()
	{
			$query = $this->db->query("SELECT * FROM `drak_announces` ORDER BY `id` DESC LIMIT 1");
			return $query->result_array();
	}
}
