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

class Userplate_model extends CI_Model {

	function __construct()
    {
        parent::__construct();
    }
	public function get_characters($id)
    {
	$this->config['reino_1'];
	$query = $this->db->query("SELECT * FROM characters");
	$query = $this->db->where('account', $id);
	$query = $this->db->get('characters');
	foreach ($query->result() as $row)
		{
		return $row->$column;
		}
    } 
}
