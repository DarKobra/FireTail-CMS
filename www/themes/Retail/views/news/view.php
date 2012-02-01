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
?><div id="body">
<?php
echo '<h2>'.$news_item['title'].'</h2>';
?>
<code>
<?php
echo $news_item['text'];
?>
</code>
<code>
Comentarios (<?php echo $total_comments; ?>)
</code>
<?php foreach ($comments as $comments_item): ?>
<?php echo $comments_item['user']; ?> | <?php echo $comments_item['date']; ?>
<code>
<?php echo $comments_item['comment']; ?>
</code>
<?php endforeach ?>
<?php
if($this->session->userdata('logged_in') == TRUE)
	{
	echo '<b style="text-transform:capitalize;">'.$this->session->userdata('username').'</b><hr />';
	echo validation_errors();
	echo form_open();
	echo '<textarea style="min-width:1208px; min-height:60px; border: 1px solid #D0D0D0; -webkit-box-shadow: 0 0 8px #D0D0D0; outline:none;" name="comment"></textarea><br />
	<input style="min-width:100px; background: #fff; border: 1px solid #D0D0D0; -webkit-box-shadow: 0 0 8px #D0D0D0; outline:none;" type="submit" name="submit" value="Comment" /></form>';
	}
?>
</div>