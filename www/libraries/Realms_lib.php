<?php
class Realms_lib {    
    /**
     * Conexion a la BD de la website
     */
    private static $web = array(
        'host'      => 'localhost',
        'user'      => 'motorweb',
        'pass'      => 'wqaf1248',
        'daba'      => 'aeon_website',
        'port'      => '3306'
    );
    
    /*
     * Conexion a la BD del Foro
     */
    private static $foro = array(
        'host'      =>  'localhost',
        'user'      =>  'motorweb',
        'pass'      =>  'wqaf1248',
        'daba'      =>  'aeon_foro',
        'port'      =>  '3306'
    );
    
    /**
     * Conexion a la BD realmd o auth
     */
    private static $realmd = array(
        'host'      => 'localhost',
        'user'      => 'motorweb',
        'pass'      => 'wqaf1248',
        'daba'      => 'aeonrealm',
        'port'      => '3306'
    );
    
    
    /**
     * Conexion a la BD characters
     * Los numero corresponden al id del realmd que digura en la tabla 'realmd'
     * que esta en la BD realmd o auth
     * 
     */
    private static $characters = array(
        1       => array(
            'host'      => 'localhost',
            'user'      => 'motorweb',
            'pass'      => 'wqaf1248',
            'daba'      => 'aeonpj',
            'port'      => '3306'
        ),
        2       => array(
            'host'      => 'localhost',
            'user'      => 'root',
            'pass'      => 'jonathan',
            'daba'      => 'characters_2',
            'port'      => '3306'
        )
    );
    
    /**
     * Conexion a la BD world
     * Los numero corresponden al id del realmd que digura en la tabla 'realmd'
     * que esta en la BD realmd o auth
     * 
     */
    private static $world = array(
        1       => array(
            'host'      => 'localhost',
            'user'      => 'motorweb',
            'pass'      => 'wqaf1248',
            'daba'      => 'aeondb',
            'port'      => '3306'
        ),
        2       => array(
            'host'      => 'localhost',
            'user'      => 'root',
            'pass'      => 'jonathan',
            'daba'      => 'world_2',
            'port'      => '3306'
        )
    );
    
    /*
     * Un listado de todos las consultas a ejecurse.
     * Esto es para evitar SQL Inyection
     */
    private static $q = array(
        1       =>  "SELECT * FROM `account` WHERE `username`='%s' AND `sha_pass_hash`='%s'",
        2       =>  "UPDATE `account` SET `sha_pass_hash`='%s',`session_key`='0',`v`='0',`s`='0' WHERE `username`='%s' AND `sha_pass_hash`='%s' AND `email`='%s'",
        3       =>  "INSERT INTO `templates` (`name`,`link`,`img`,`active`) VALUES ('%s','%s','%s','0')",
        4       =>  "SELECT * FROM `templates` WHERE `active`='%d'",
        5       =>  "SELECT * FROM `account` WHERE `username`='%s' AND `sha_pass_hash`='%s' LIMIT 1",
        6       =>  "UPDATE `username`",
        7       =>  "SELECT * FROM `account` WHERE `username`='%s' LIMIT 3",
        8       =>  "SELECT `name`,`level`,`race`,`class`,`gender` FROM `characters` WHERE `online`='%s'",
        9       =>  "SELECT * FROM `account` WHERE `email`='%s' LIMIT 2",
        10      =>  "INSERT INTO `account` (`username`,`sha_pass_hash`,`email`) VALUES ('%s','%s','%s')",
        11      =>  "SELECT `guid`,`%s` FROM `characters`",
        12      =>  "SELECT * FROM `uptime` WHERE `realmid`='%s'",
        13      =>  "SELECT * FROM `realmlist` WHERE `id`='%s'",
        14      =>  "INSERT INTO `aeon_members` (`member_name`,`date_registered`,`real_name`,`passwd`,`email_address`) VALUES ('%s','%s','%s','%s','%s')"
    );
        
    
    /*
     * Tools
     */
    private $conLink = false;
    //private $dblink = false;
    private $error = null;
    private static $qpro = null;


    public function init($root,$qnum,$r=1) {
        $values = func_get_args();
        $count = func_num_args();
        $array = array();
            
        for($i=3; $i < $count; $i++)
            $array[$i-3] = $values[$i];
            
        if($root == "web")
            $this->conLink = @mysqli_connect(self::$web['host'],self::$web['user'],self::$web['pass'],self::$web['daba'],self::$web['port']);
        if($root == "foro")
            $this->conLink = @mysqli_connect(self::$foro['host'],self::$foro['user'],self::$foro['pass'],self::$foro['daba'],self::$foro['port']);
        if($root == "realmd")
            $this->conLink = @mysqli_connect(self::$realmd['host'], self::$realmd['user'], self::$realmd['pass'], self::$realmd['daba'], self::$realmd['port']);
        if($root == "chars")
            $this->conLink = @mysqli_connect(self::$characters[$r]['host'], self::$characters[$r]['user'], self::$characters[$r]['pass'], self::$characters[$r]['daba'], self::$characters[$r]['port']);
        if($root == "world")
            $this->conLink = @mysqli_connect(self::$world[$r]['host'], self::$world[$r]['user'], self::$world[$r]['pass'], self::$world[$r]['daba'], self::$world[$r]['port']);
        
        if(!$this->conLink)
        {
            $this->error = @mysqli_error($this->conLink);
            mysqli_close($this->conLink);
            return false;
        }
        if($count > 3)
            self::$qpro = vsprintf(self::$q[$qnum], $array);
        $get = stripos(self::$qpro, "SELECT");
        if($get !== false)
        {
            $result = mysqli_query($this->conLink,self::$qpro);
            $i = 0;
            $return = array();
            while($_return = mysqli_fetch_assoc($result))
            {
                $return[] = $_return;
            }
            return $return;
        }else{
            $result = mysqli_query($this->conLink,self::$qpro);
            $return = mysqli_affected_rows($this->conLink);
            mysqli_close($this->conLink);
            return $return;
        }
    }
}
?>