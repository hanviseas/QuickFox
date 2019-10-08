<?php

namespace Lazybug\Framework;

// +------------------------------------------------------------
// | View JSON视图
// +------------------------------------------------------------
// | JSON数据内容展示
// +------------------------------------------------------------
// | Author : yuanhang.chen@gmail.com
// +------------------------------------------------------------
class Mod_View_Json extends Lb_View
{
	/**
	 * 对象数据
	 *
	 * @access private
	 * @var string $data 对象数据
	 */
	private $data = array();

	/**
	 * 获得对象数据
	 *
	 * @access public
	 * @return string $data 对象数据
	 */
	public function get_data()
	{
		return $this->data;
	}

	/**
	 * 设置对象数据
	 *
	 * @access public
	 * @param string $data 对象数据
	 */
	public function set_data($data)
	{
		$this->data = $data;
	}

	/**
	 * 输出对象数据
	 *
	 * @access public
	 */
	public function output()
	{
		echo json_encode($this->data);
	}
}
