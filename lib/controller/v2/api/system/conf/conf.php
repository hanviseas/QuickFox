<?php

use Lazybug\Framework as LF;

/**
 * Controller 获取系统配置信息
 */
class Controller_V2_Api_System_Conf_Conf extends Controller_V2_Api_System_Base
{

	public function act()
	{
		$config = array(
			'domain' => LF\lb_read_system('www_domain'),
			'dbname' => LF\lb_read_database('mysql.master.dbname'),
			'dbhost' => LF\lb_read_database('mysql.master.host'),
			'dbuser' => LF\lb_read_database('mysql.master.user'),
			'dbpass' => LF\lb_read_database('mysql.master.password'),
		);
		$this->set_json_response($config);
	}
}
