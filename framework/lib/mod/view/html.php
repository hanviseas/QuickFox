<?php

namespace Lazybug\Framework;

// +------------------------------------------------------------
// | View HTML视图
// +------------------------------------------------------------
// | HTML页面展示
// +------------------------------------------------------------
// | Author : yuanhang.chen@gmail.com
// +------------------------------------------------------------
class Mod_View_Html extends Lb_View
{
	/**
	 * 脚本文件
	 *
	 * @access private
	 * @var array $scripts 脚本文件
	 */
	private $scripts = array();

	/**
	 * 样式文件
	 *
	 * @access private
	 * @var array $styles 样式文件
	 */
	private $styles = array();

	/**
	 * 页面数据
	 *
	 * @access private
	 * @var array $data 页面数据
	 */
	private $data = array();

	/**
	 * 关键词组
	 *
	 * @access protected
	 * @var string $keywords 关键词组
	 */
	protected $keywords = '';

	/**
	 * 内容描述
	 *
	 * @access protected
	 * @var string $description 内容描述
	 */
	protected $description = '';

	/**
	 * 字符编码
	 *
	 * @access protected
	 * @var string $charset 字符编码
	 */
	protected $charset = 'utf-8';

	/**
	 * 页面标题
	 *
	 * @access protected
	 * @var string $title 页面标题
	 */
	protected $title = 'Default';

	/**
	 * 标题前缀
	 *
	 * @access protected
	 * @var string $title_prefix 标题前缀
	 */
	protected $title_prefix = '';

	/**
	 * 标题后缀
	 *
	 * @access protected
	 * @var string $title_suffix 标题后缀
	 */
	protected $title_suffix = '';

	/**
	 * 构造函数
	 *
	 * @access public
	 */
	public function __construct()
	{
		parent::__construct();
		$this->title_prefix || $this->title_prefix = lb_read_system('title_prefix');
		$this->title_suffix || $this->title_suffix = lb_read_system('title_suffix');
		$this->title = $this->title_prefix . $this->title . $this->title_suffix;
	}

	/**
	 * 获得脚本文件
	 *
	 * @access public
	 * @return array $scripts 脚本文件
	 */
	public function get_scripts()
	{
		return $this->scripts;
	}

	/**
	 * 添加脚本文件
	 *
	 * @access public
	 * @param string $file 脚本文件
	 */
	public function add_script($file)
	{
		$this->scripts[] = $file;
	}

	/**
	 * 获得样式文件
	 *
	 * @access public
	 * @return array $styles 样式文件
	 */
	public function get_styles()
	{
		return $this->styles;
	}

	/**
	 * 添加样式文件
	 *
	 * @access public
	 * @param string $file 样式文件
	 */
	public function add_style($file)
	{
		$this->styles[] = $file;
	}

	/**
	 * 获得页面数据
	 *
	 * @access public
	 * @param string $key 数据索引
	 * @return type $datum 数据值
	 */
	public function get_data($key)
	{
		return $this->data[$key];
	}

	/**
	 * 添加页面数据
	 *
	 * @access public
	 * @param string $key 数据索引
	 * @param type $value 数据值
	 */
	public function add_data($key, $value)
	{
		$this->data[$key] = $value;
	}

	/**
	 * 加载页面文件
	 *
	 * @access public
	 * @param $file 页面文件
	 */
	public function load($file)
	{
		if (file_exists($file = PAGE_PATH . '/' . strtolower(lb_convert_quote_to_path($file)) . '.html')) {
			include($file);
		}
	}
}
