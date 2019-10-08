<?php

namespace Lazybug\Framework;

// +------------------------------------------------------------
// | Interface 数据库驱动接口
// +------------------------------------------------------------
// | 定义数据库的连接、查询和关闭方法
// +------------------------------------------------------------
// | Author : yuanhang.chen@gmail.com
// +------------------------------------------------------------
interface Driver_Db_Interface
{
	/**
	 * 连接数据库
	 *
	 * @access public
	 */
	public function connect($host, $dbname, $user, $password, $charset);

	/**
	 * 查询数据库
	 *
	 * @access public
	 */
	public function query($statement, $params);

	/**
	 * 关闭数据库
	 *
	 * @access public
	 */
	public function close();
}
