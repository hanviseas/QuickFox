<?php

namespace Lazybug\Framework;

// +------------------------------------------------------------
// | Model 关系模型
// +------------------------------------------------------------
// | 关系型数据库模型
// +------------------------------------------------------------
// | Author : yuanhang.chen@gmail.com
// +------------------------------------------------------------
class Mod_Model_Relation extends Lb_Model
{

	/**
	 * 数据库连接
	 *
	 * @access private
	 * @var object $db_connect 数据库连接
	 */
	private $db_connect = null;

	/**
	 * 查询语句
	 *
	 * @access private
	 * @var string $statement 查询语句
	 */
	public $statement = '';

	/**
	 * 查询参数
	 *
	 * @access private
	 * @var array $params 查询参数
	 */
	private $params = array();

	/**
	 * 选择标识
	 *
	 * @access private
	 * @var bool $selected 是否已选择
	 */
	private $selected = false;

	/**
	 * 数据表名
	 *
	 * @access protected
	 * @var string $table_name 数据表名
	 */
	protected $table_name = '';

	/**
	 * 表名前缀
	 *
	 * @access protected
	 * @var string $table_prefix 表名前缀
	 */
	protected $table_prefix = '';

	/**
	 * 表名后缀
	 *
	 * @access protected
	 * @var string $table_subffix 表名后缀
	 */
	protected $table_suffix = '';

	/**
	 * 映射字段
	 *
	 * @access protected
	 * @var array $fields 映射字段
	 */
	protected $fields = array();

	/**
	 * 构造函数
	 *
	 * @access public
	 * @param string $name 配置索引
	 */
	public function __construct($name = 'mysql.master')
	{
		parent::__construct();
		$this->db_connect = Driver_Db_Factory::get_db_item($name);
		$this->table_prefix || $this->table_prefix = lb_read_system('table_prefix');
		$this->table_suffix || $this->table_suffix = lb_read_system('table_suffix');
		$this->table($this->table_name);
	}

	/**
	 * 添加参数
	 *
	 * @access private
	 * @param string $key 参数索引
	 * @param string $value 参数值
	 * @return string $key 新参数索引
	 */
	private function add_param($key, $value)
	{
		do {
			$key = ':' . md5($key . rand(1000, 9999));
		} while (array_key_exists($key, $this->params));
		$this->params[$key] = $value;
		return $key;
	}

	/**
	 * 字段映射
	 *
	 * @access private
	 * @return array $fields 映射字段
	 */
	private function field_mapping()
	{
		// POST参数映射到数据库字段
		$fields = array();
		foreach ((array) $this->fields as $key => $value) {
			isset($_POST[$key]) && $fields[$value] = trim($_POST[$key]);
		}
		return $fields;
	}

	/**
	 * 选择映射
	 *
	 * @access private
	 * @param array $params 参数数组
	 * @return string $select 选择语句
	 */
	private function select_mapping($params)
	{
		foreach ($params as $value) {
			$exp[] = '`' . $value . '`';
		}
		return implode(',', $exp);
	}

	/**
	 * 插入映射
	 *
	 * @access private
	 * @param array $params 参数数组
	 * @return string $insert 插入语句
	 */
	private function insert_mapping($params)
	{
		foreach ($params as $key => $value) {
			$exp[] = $this->add_param($key, $value);
		}
		return implode(',', $exp);
	}

	/**
	 * 更新映射
	 *
	 * @access private
	 * @param array $params 参数数组
	 * @return string $update 更新语句
	 */
	private function update_mapping($params)
	{
		foreach ($params as $key => $value) {
			$exp[] = '`' . $key . '` = ' . $this->add_param($key, $value);
		}
		return implode(',', $exp);
	}

	/**
	 * 条件映射
	 *
	 * @access private
	 * @param array $params 参数数组
	 * @return string $where 条件语句
	 */
	private function where_mapping($params)
	{
		$logic = 'and';
		foreach ($params as $key => $value) {
			if ($key === '_logic') {
				$logic = $value;
			} else if ($key === '_complex') {
				$exp[] = '(' . $this->where_mapping($value) . ')';
			} else if ($key === '_exp') {
				$exp[] = $value;
			} else if (is_array($value)) {
				$exp[] = '`' . $key . '` ' . $value[0] . ' ' . $this->add_param($key, $value[1]);
			} else {
				$exp[] = '`' . $key . '` = ' . $this->add_param($key, $value);
			}
		}
		return implode(' ' . $logic . ' ', $exp);
	}

	/**
	 * 排序映射
	 *
	 * @access private
	 * @param array $params 参数数组
	 * @return string $order 排序语句
	 */
	private function order_mapping($params)
	{
		foreach ($params as $key => $value) {
			if (is_numeric($key)) {
				$exp[] = $value;
			} else {
				$exp[] = '`' . $key . '` ' . $value;
			}
		}
		return implode(',', $exp);
	}

	/**
	 * 设置表名
	 *
	 * @access public
	 * @param string $table_name 数据表名
	 * @return object $model 模型对象
	 */
	public function table($table_name = '')
	{
		$table_name || $table_name = preg_replace('/^Model_/', '', get_called_class());
		$this->table_name = $this->table_prefix . $table_name . $this->table_suffix;
		return $this;
	}

	/**
	 * Select 语句
	 *
	 * @access public
	 * @param array $params 参数数组
	 * @return object $model 模型对象
	 */
	public function select($params = array())
	{
		if (!$params) {
			return $this->select('*');
		}
		if (is_array($params)) {
			$this->statement = 'select ' . $this->select_mapping($params) . ' from ' . $this->table_name . $this->statement;
		} else {
			$this->statement = 'select ' . $params . ' from ' . $this->table_name . $this->statement;
		}
		$this->selected = true;
		return $this;
	}

	/**
	 * Insert 语句
	 *
	 * @access public
	 * @param array $params 参数数组
	 * @return int $result 插入行数
	 */
	public function insert($params = array())
	{
		if (!$params) {
			return $this->insert($this->field_mapping());
		}
		if (is_array($params)) {
			$this->statement = 'insert into ' . $this->table_name . '(' . $this->select_mapping(array_keys($params)) . ') values(' . $this->insert_mapping(array_values($params)) . ')' . $this->statement;
		} else {
			$this->statement = 'insert into ' . $this->table_name . $params . $this->statement;
		}
		return $this->exec();
	}

	/**
	 * Update 语句
	 *
	 * @access public
	 * @param array $params 参数数组
	 * @return int $result 更新行数
	 */
	public function update($params = array())
	{
		if (!$params) {
			return $this->update($this->field_mapping());
		}
		if (is_array($params)) {
			$this->statement = 'update ' . $this->table_name . ' set ' . $this->update_mapping($params) . $this->statement;
		} else {
			$this->statement = 'update ' . $this->table_name . ' set ' . $params . $this->statement;
		}
		return $this->exec();
	}

	/**
	 * Delete 语句
	 *
	 * @access public
	 * @return int $result 删除行数
	 */
	public function delete()
	{
		$this->statement = 'delete from ' . $this->table_name . $this->statement;
		return $this->exec();
	}

	/**
	 * Where 语句
	 *
	 * @access public
	 * @param array $params 参数数组
	 * @return object $model 模型对象
	 */
	public function where($params = array())
	{
		if (!$params) {
			return $this;
		}
		if (is_array($params)) {
			$this->statement = $this->statement . ' where ' . $this->where_mapping($params);
		} else {
			$this->statement = $this->statement . ' where ' . $params;
		}
		return $this;
	}

	/**
	 * Group By 语句
	 *
	 * @access public
	 * @param array $params 参数数组
	 * @return object $model 模型对象
	 */
	public function group($params = array())
	{
		if (!$params) {
			return $this;
		}
		if (is_array($params)) {
			$this->statement = $this->statement . ' group by ' . $this->select_mapping($params);
		} else {
			$this->statement = $this->statement . ' group by ' . $params;
		}
		return $this;
	}

	/**
	 * Having 语句
	 *
	 * @access public
	 * @param array $params 参数数组
	 * @return object $model 模型对象
	 */
	public function have($params = array())
	{
		if (!$params) {
			return $this;
		}
		if (is_array($params)) {
			$this->statement = $this->statement . ' having ' . $this->where_mapping($params);
		} else {
			$this->statement = $this->statement . ' having ' . $params;
		}
		return $this;
	}

	/**
	 * Order 语句
	 *
	 * @access public
	 * @param array $params 参数数组
	 * @return object $model 模型对象
	 */
	public function order($params = array())
	{
		if (!$params) {
			return $this;
		}
		if (is_array($params)) {
			$this->statement = $this->statement . ' order by ' . $this->order_mapping($params);
		} else {
			$this->statement = $this->statement . ' order by ' . $params;
		}
		return $this;
	}

	/**
	 * Limit 语句
	 *
	 * @access public
	 * @param string $params 参数数组
	 * @return object $model 模型对象
	 */
	public function limit($params = array())
	{
		$params && $this->statement = $this->statement . ' limit ' . $params;
		return $this;
	}

	/**
	 * 获取单行结果
	 *
	 * @access public
	 * @return array $result 查询结果
	 */
	public function fetch()
	{
		$this->selected || $this->select('*');
		$return = $this->db_connect->query($this->statement, $this->params)->fetch();
		$this->statement = '';
		$this->params = array();
		$this->selected = false;
		return $return;
	}

	/**
	 * 获取全部结果
	 *
	 * @access public
	 * @return array $result 查询结果
	 */
	public function fetchall()
	{
		$this->selected || $this->select('*');
		$return = $this->db_connect->query($this->statement, $this->params)->fetch_all();
		$this->statement = '';
		$this->params = array();
		$this->selected = false;
		return $return;
	}

	/**
	 * 执行结果
	 *
	 * @access pulic
	 * @return int $result 影响行数
	 */
	public function exec()
	{
		$return = $this->db_connect->query($this->statement, $this->params)->get_row_count();
		$this->statement = '';
		$this->params = array();
		$this->selected = false;
		return $return;
	}
}
