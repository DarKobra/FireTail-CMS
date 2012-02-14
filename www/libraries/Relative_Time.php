<?php defined('BASEPATH') OR exit('No direct script access allowed');

class Relative_Time {
	
	protected $time;
	protected $tiempo;
	private $dias;
	private $horas;
	private $minutos;
	private $segundos;

    public function __construct()
    {
    }
	public function FechaRelativa($fechaAbsoluta)
{
    $dias       = intval((time() - $fechaAbsoluta) /1000/60 / 60 /24);
    $segundos   = intval((time() - $fechaAbsoluta));
	$fecha = $fechaAbsoluta;
    if($dias < 0) {
        return FALSE;
    } elseif ($segundos > 0 && $segundos < 60) {
        $fecha = "hace " . $segundos . " segundos";
    } elseif ($segundos >= 60 && $segundos <120 ) {
        $fecha = "hace un minuto";
    } elseif ($segundos >= 120 && $segundos < 3600 ) {
        $fecha = "hace " . intval($segundos/60) . " minutos";
    } elseif ($segundos >= 3600 && $segundos < 7200) {
        $fecha = "hace una hora";
    } elseif ($segundos >= 7200 && $segundos < 86400) {
        $fecha = "hace " . intval($segundos/3600) . " horas";
    } elseif ($dias==1) {
        $fecha = "ayer";
    } elseif ($dias >= 2 && $dias <= 6) {
        $fecha =  "hace " . $dias . " días";
    } elseif ($dias >= 7 && $dias < 14) {
        $fecha= "la semana pasada";
    } elseif ($dias >= 14 && $dias <= 365) {
        $fecha =  "hace " . intval($dias / 7) . " semanas";
    }  else {
        $fecha = date("d/m/Y", $fechaAbsoluta);
    }
    return $fecha;
}
}