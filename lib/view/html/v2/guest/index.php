<?php

use Lazybug\Framework\Mod_View_Html;

/**
 * View 访客视图统一入口
 */
class View_Html_V2_Guest_Index extends Mod_View_Html
{
	protected $title = '接口测试自动化平台';

	public function __construct()
	{
		parent::__construct();
		$this->add_script('Dist.Common');
		$this->load('V2.Public.Frame');
	}
}
