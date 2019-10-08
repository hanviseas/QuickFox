<?php

namespace Lazybug\Framework;

// +------------------------------------------------------------
// | View XML视图
// +------------------------------------------------------------
// | XML数据内容展示
// +------------------------------------------------------------
// | Author : yuanhang.chen@gmail.com
// +------------------------------------------------------------
class Mod_View_XML extends Lb_View
{
	/**
	 * 文档对象
	 *
	 * @access private
	 * @var object $dom 文档对象
	 */
	private $dom = null;

	/**
	 * 构造函数
	 *
	 * @access public
	 */
	public function __construct($version = '1.0', $charset = 'utf-8')
	{
		parent::__construct();
		Util_Server_Response::set_header("Content-type", "text/xml");
		$this->dom = new \DomDocument($version, $charset);
	}

	/**
	 * 获得文档对象
	 *
	 * @access public
	 * @return object $dom 文档对象
	 */
	public function get_dom()
	{
		return $this->dom;
	}

	/**
	 * 输出文档数据
	 *
	 * @access public
	 */
	public function output()
	{
		echo $this->dom->saveXML();
	}
}
