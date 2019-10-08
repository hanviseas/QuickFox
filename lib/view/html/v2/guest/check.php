<?php

use Lazybug\Framework\Mod_View_Html;

/**
 * View 环境检查页面视图
 */
class View_Html_V2_Guest_Check extends Mod_View_Html
{
	protected $title = '接口测试自动化平台';

	public function __construct()
	{
		parent::__construct();
		$this->add_script('Dist.Common');
		$this->load('V2.Public.Frame');
	}
}
