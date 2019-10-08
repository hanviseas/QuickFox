<?php

use Lazybug\Framework as LF;

/**
 * Controller 更新系统配置
 */
class Controller_V2_Api_System_Conf_Update extends Controller_V2_Api_System_Base
{
	protected $request_params = array(
		'domain' => 'string',
		'dbhost' => 'string',
		'dbname' => 'string',
		'dbuser' => 'string',
		'dbpass' => 'string',
	);

	protected $required_params = array(
		'dbhost',
		'dbname',
		'dbuser',
	);

	public function act()
	{
		$this->init_param(Const_Code::SYSTEM_PARAM_ERROR, '系统传递参数错误');
		// 参数处理
		$this->params['domain'] = preg_replace('/\\\\/', '\\\\\\\\\\\\\\\\', $this->params['domain']);
		$this->params['dbhost'] = preg_replace('/\\\\/', '\\\\\\\\\\\\\\\\', $this->params['dbhost']);
		$this->params['dbname'] = preg_replace('/\\\\/', '\\\\\\\\\\\\\\\\', $this->params['dbname']);
		$this->params['dbuser'] = preg_replace('/\\\\/', '\\\\\\\\\\\\\\\\', $this->params['dbuser']);
		$this->params['dbpass'] = preg_replace('/\\\\/', '\\\\\\\\\\\\\\\\', $this->params['dbpass']);
		$this->params['domain'] = preg_replace('/\'/', '\\\'', $this->params['domain']);
		$this->params['dbhost'] = preg_replace('/\'/', '\\\'', $this->params['dbhost']);
		$this->params['dbname'] = preg_replace('/\'/', '\\\'', $this->params['dbname']);
		$this->params['dbuser'] = preg_replace('/\'/', '\\\'', $this->params['dbuser']);
		$this->params['dbpass'] = preg_replace('/\'/', '\\\'', $this->params['dbpass']);
		// 覆盖系统配置
		$system_file_content = file_get_contents(CONF_PATH . '/system.php');
		$system_file_content = preg_replace("/'www_domain' => '([^']|\\\\')*',/", "'www_domain' => '{$this->params['domain']}',", $system_file_content);
		file_put_contents(CONF_PATH . '/system.php', $system_file_content);
		// 覆盖数据库配置
		$db_file_content = file_get_contents(CONF_PATH . '/database.php');
		$db_file_content = preg_replace("/'host' => '([^']|\\\\')*',/", "'host' => '{$this->params['dbhost']}',", $db_file_content);
		$db_file_content = preg_replace("/'dbname' => '([^']|\\\\')*',/", "'dbname' => '{$this->params['dbname']}',", $db_file_content);
		$db_file_content = preg_replace("/'user' => '([^']|\\\\')*',/", "'user' => '{$this->params['dbuser']}',", $db_file_content);
		$db_file_content = preg_replace("/'password' => '([^']|\\\\')*',/", "'password' => '{$this->params['dbpass']}',", $db_file_content);
		file_put_contents(CONF_PATH . '/database.php', $db_file_content);
		LF\V('Json.Base')->init(Const_Code::SUCCESS, '系统配置已更新');
	}
}
