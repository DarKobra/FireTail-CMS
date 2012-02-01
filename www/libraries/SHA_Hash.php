<?php defined('BASEPATH') OR exit('No direct script access allowed');

class SHA_Hash {

    public function __construct()
    {
    }
	public function sha_password($user,$pass){
					$user = strtoupper($user);
					$pass = strtoupper($pass);
					return SHA1($user.':'.$pass);
	}
}