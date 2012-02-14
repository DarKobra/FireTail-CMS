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

class Account extends CI_Controller {

	public function __construct()
	{
		parent::__construct();
		$this->load->model('account_model');
		$this->load->library('SHA_Hash');
		$title = $this->config->item('site_title');
		$website_path = $this->config->item('base_url');
		$this->template->title($title);
	}
	public function index()
	{
	$username = $this->session->userdata('username');
	$info = array(
	'username' => $this->account_model->get_info('username', $username),
	'email' => $this->account_model->get_info('email', $username),
	'joindate' => $this->account_model->get_info('joindate', $username),
	'expansion' => $this->account_model->get_info('expansion', $username),
	'banned' => $this->account_model->get_info('locked', $username),
	'coins' => $this->account_model->get_drakinfo('coins', $username),
	'points' => $this->account_model->get_drakinfo('points', $username),
	);
	if($this->session->userdata('logged_in') == TRUE)
	{
	$this->template->build('account', $info);
	}
	else {
	redirect('account/login', 'refresh');
	}
	}
	public function register()
	{
		$this->form_validation->set_rules('username', 'Username', 'is_unique[account.username]|trim|required|min_length[5]|max_length[12]|xss_clean');
		$this->form_validation->set_rules('password', 'Password', 'trim|required|matches[repeat_password]|xss_clean');
		$this->form_validation->set_rules('repeat_password', 'Password Confirmation', 'trim|required|xss_clean');
		$this->form_validation->set_rules('email', 'Email', 'is_unique[account.email]|trim|required|matches[repeat_email]|valid_email|xss_clean');
		$this->form_validation->set_rules('repeat_email', 'Email Confirmation', 'trim|required|valid_email|xss_clean');

		if ($this->form_validation->run() == FALSE)
		{
			$this->template->build('account/register');
		}
		else
		{
			$this->account_model->register_account();
			$this->template->build('account/register_sucess');
		}
	}
	public function login($idioma = NULL)
   {
  		$data['path'] = $this->config->item('base_url');
		$data['server_name'] = $this->config->item('server_name');
		$data['theme'] = $this->config->item('theme');
      if(!isset($_POST['username'])){  
      $this->load->view('account/login', $data);
      }
      else{
         $this->form_validation->set_rules('username','Username','required');
         $this->form_validation->set_rules('password','Password','required');
         if(($this->form_validation->run() == FALSE)){
            $this->load->view('account/login', $data);
         }
         else{
            $this->load->model('account_model');
			$password = $this->sha_hash->sha_password($this->input->post('username'), $this->input->post('password'));
            $Load_data = $this->account_model->login($this->input->post('username'), $password);
            $id_data = $this->account_model->login_id($this->input->post('username'));
            if($Load_data){
			   $login_data = array(
			   	   'id' => $id_data,
                   'username'  => $this->input->post('username'),
                   'logged_in' => TRUE
               );
			   $this->session->set_userdata($login_data);
               $this->load->view('account/login_success', $data);
            }
            else{
				$data['username_empty_error']="Por favor, rellena el campo de nombre de usuario";
               $data['error']="E-mail o password incorrecta, por favor vuelva a intentar";
			  $this->load->view('account/login', $data);
            }
         }
      }
   }
	public function logout()
	{
	if($this->session->userdata('logged_in') == TRUE)
	{
	$this->session->sess_destroy();
	$this->template->build('account/logout');
	}
	else {
	redirect('/', 'refresh');
	}
	}
}

/* End of file welcome.php */
/* Location: ./application/controllers/welcome.php */