<?php

use Lazybug\Framework\Mod_View_Html;

/**
 * View Html视图基类
 */
class View_Html_Base extends Mod_View_Html
{
	public function __construct()
	{
		parent::__construct();
		$this->add_style('Css.Public.Jquery_ui_min');
		$this->add_style('Css.Public.Global');
		$this->add_script('Js.Public.Jquery_2_1_1_min');
		$this->add_script('Js.Public.Jquery_ui_min');
		$this->add_script('Js.Public.Global');
		$this->add_script('Js.Public.Menu');
	}

	public function init($html = '')
	{
		$this->add_data('body', $html);
		$this->load('Public.Main');
	}
}
