<?php

use Lazybug\Framework as LF;

/**
 * Controller 测试相关接口控制器基类
 */
abstract class Controller_V2_Api_Test_Base extends Controller_V2_Api_Base
{
	public function __construct()
	{
		$this->check_api_auth();
	}

	/**
	 * 执行调用接口步骤
	 * 
	 * @param string $step_value 步骤值
	 * @param int $environment_id 环境ID
	 * @param string preposition_fliter 前置过滤器
	 * @param string postposition_fliter 后置过滤器
	 * @param string extension 扩展内容
	 * @param string cookie COOKIE文件
	 */
	public function exec_request_step($step_value, $environment_id, $preposition_fliter, $postposition_fliter, $extension, $cookie_file)
	{
		$response = array(
			'request_url' => '',
			'request_param' => '',
			'request_header' => '',
			'response_header' => '',
			'response_body' => '',
			'response_code' => '',
			'response_time' => ''
		);
		$case = LF\M('V2.Space.Case')->get_by_id($step_value);
		if (!$case) { // 未找到用例空返回
			return $response;
		}
		$item = LF\M('V2.Space.Item')->get_by_id((int) $case['item_id']);
		if (!$item) { // 未找到接口空返回
			return $response;
		}
		// 前置过滤器
		if ($preposition_fliter) {
			$extension = $this->translate_fliter($preposition_fliter, 0, preg_replace('/\s/', ' ', $extension));
		} else {
			$extension = preg_replace('/\s/', ' ', $extension);
		}
		// 将Url、参数、请求头中的变量名替换为实际值
		// 注意：参数和请求头是以JSON形式组装的，最后一个值设置为TRUE
		$case['url'] = $this->translate_all($item['url'], $environment_id, $extension);
		$extra_info['param'] = $case['param'] = $this->translate_all($case['param'], $environment_id, $extension, true);
		$extra_info['header'] = $case['header'] = $this->translate_all($case['header'], $environment_id, $extension, true);
		// 请求参数处理，如果是x-www-form-urlencoded，将参数组装成k1=v1&k2=v2的形式，如果是form-date，将参数置为数组
		if ($case['ctype'] === 'application/x-www-form-urlencoded') {
			$case['param'] = json_decode($case['param'], true);
			// 注意：传递过来的参数并不能保证是JSON串，需要做异常判断
			if (is_null($case['param']) || !is_array($case['param'])) {
				$case['param'] = '';
			} else {
				$request_param_array = array();
				// 注意：参数值有可能本身恰好是JSON串，在解码时变为了数组，这里需要重新组装
				foreach ($case['param'] as $key => $value) {
					$value = is_array($value) ? json_encode($value) : $value;
					$request_param_array[] = urlencode($key) . '=' . urlencode($value);
				}
				$case['param'] = implode('&', $request_param_array);
			}
		} else if ($case['ctype'] === 'multipart/form-data') {
			$case['param'] = json_decode($case['param'], true);
			// 注意：传递过来的参数并不能保证是JSON串，需要做异常判断
			if (is_null($case['param']) || !is_array($case['param'])) {
				$case['param'] = array();
			}
		}
		// 请求头处理，将请求头组装成key:value形式的数组
		$case['header'] = json_decode($case['header'], true);
		// 注意：传递过来的参数并不能保证是JSON串，需要做异常判断
		if (is_null($case['header']) || !is_array($case['header'])) {
			$case['header'] = array();
		}
		// 将Content-Type添加到请求头中，如果自己也指定了Content-Type，会被覆盖
		$case['header']['Content-Type'] = $case['ctype'];
		$request_header_array = array();
		foreach ($case['header'] as $key => $value) {
			$request_header_array[] = $key . ':' . $value;
		}
		$case['header'] = $request_header_array;
		$raw_response = $this->initiate_curl_request($case['stype'], $case['url'], $case['param'], $case['header'], true, $cookie_file);
		$raw_response = json_decode($raw_response, true);
		if (is_null($raw_response) || !is_array($raw_response)) {
			$response['request_url'] = $case['url'];
			$response['request_param'] = $extra_info['param'];
			$response['request_header'] = $extra_info['header'];
			return $response;
		}
		// 后置过滤器
		if ($postposition_fliter) {
			$raw_response['body'] = $this->translate_fliter($postposition_fliter, 0, $raw_response['body']);
		}
		$response['request_url'] = $case['url'];
		$response['request_param'] = $extra_info['param'];
		$response['request_header'] = $extra_info['header'];
		$response['response_header'] = $raw_response['header'];
		$response['response_body'] = $raw_response['body'];
		$response['response_code'] = $raw_response['code'];
		$response['response_time'] = $raw_response['time'];
		return $response;
	}

	/**
	 * 执行存储查询步骤
	 * 
	 * @param string $step_command 步骤指令
	 * @param string $step_value 步骤值
	 * @param int $environment_id 环境ID
	 * @param string preposition_fliter 前置过滤器
	 * @param string extension 扩展内容
	 */
	public function exec_data_step($step_command, $step_value, $environment_id, $preposition_fliter, $extension)
	{
		$response = array(
			'query' => '',
			'data' => ''
		);
		// 前置过滤器
		if ($preposition_fliter) {
			$extension = $this->translate_fliter($preposition_fliter, 0, preg_replace('/\s/', ' ', $extension));
		} else {
			$extension = preg_replace('/\s/', ' ', $extension);
		}
		// 将参数值中的变量名替换为实际值
		$extra_info['query'] = $step_value = $this->translate_all($step_value, $environment_id, $extension);
		// step_command中以"|"分隔存储了各个配置，分解后根据配置获取配置值
		$result = '';
		foreach (explode('|', $step_command) as $command) {
			$command = trim(strtolower($command));
			if (preg_match('/^config:\w+$/', $command)) { // 获取数据配置值
				$config_keyword = explode(':', $command);
				$config = LF\M('V2.Environment.Data')->get_by_keyword_in_environment($environment_id, $config_keyword[1]);
				// 配置不存在返回空结果
				if (!$config) {
					$response['query'] = $extra_info['query'];
					return $response;
				}
			}
			// 配置值中以";"分隔存储了各个选项，每个选项均为"x=y;"的格式
			$options = array();
			foreach (explode(';', $config['value']) as $option) {
				$option = explode('=', $option);
				if (count($option) === 2) {
					$options[$option[0]] = $option[1];
				}
			}
			// 根据选项从不同的数据源获取数据
			if ($config['source'] === 'mysql') {
				$result = $this->connect_mysql($options, $step_value);
			} else if ($config['source'] === 'mysql_mysqli') {
				$result = $this->connect_mysqli($options, $step_value);
			} else if ($config['source'] === 'mysql_pdo') {
				$result = $this->connect_pdo_mysql($options, $step_value);
			} else if ($config['source'] === 'sqlsrv') {
				$result = $this->connect_sqlsrv($options, $step_value);
			} else if ($config['source'] === 'sqlsrv_pdo') {
				$result = $this->connect_pdo_sqlsrv($options, $step_value);
			} else if ($config['source'] === 'oracle_oci') {
				$result = $this->connect_oci_oracle($options, $step_value);
			} else if ($config['source'] === 'mongo') {
				$result = $this->connect_mongo($options, $step_value);
			}
		}
		$response['query'] = $extra_info['query'];
		$response['data'] = (string) $result;
		return $response;
	}

	/**
	 * 执行检查点步骤
	 * 
	 * @param string $step_command 步骤指令
	 * @param string $step_value 步骤值
	 * @param int $environment_id 环境ID
	 * @param string preposition_fliter 前置过滤器
	 * @param string extension 扩展内容
	 */
	public function exec_check_step($step_command, $step_value, $environment_id, $preposition_fliter, $extension)
	{
		$response = array(
			'source' => '',
			'target' => '',
			'result' => ''
		);
		// 前置过滤器
		if ($preposition_fliter) {
			$extension = $this->translate_fliter($preposition_fliter, 0, preg_replace('/\s/', ' ', $extension));
		} else {
			$extension = preg_replace('/\s/', ' ', $extension);
		}
		// 通过过滤器进一步提取检查值，再将检查值中的变量名替换为实际值
		$extra_info['source'] = $extension;
		$extra_info['target'] = $match = $step_value = $this->translate_variable($step_value, $environment_id, $extension);
		// step_command中以"|"分隔存储了各个选项，分解后根据选项值生成正则表达式
		$flag_begin = $flag_end = $flag_reg = $flag_opposite = 0;
		foreach (explode('|', $step_command) as $command) {
			$command = trim(strtolower($command));
			switch ($command) {
				case 'reg': // 正则表达式
					$flag_reg = 1;
					break;
				case 'all': // 完整匹配
					$flag_begin = $flag_end = 1;
					break;
				case 'begin': // 前段匹配
					$flag_begin = 1;
					break;
				case 'end': // 后端匹配
					$flag_end = 1;
					break;
				case 'opposite': // 取反
					$flag_opposite = 1;
					break;
				default:
			}
		}
		$match = ($flag_begin ? '/^' : '/') . ($flag_reg ? $match : preg_quote($match)) . ($flag_end ? '$/' : '/');
		// 正常情况时，匹配表示通过，非匹配表示失败，取反时结果相反
		if ($flag_opposite) {
			$result = @preg_match($match, $extension) ? 'FAIL' : 'PASS';
		} else {
			$result = @preg_match($match, $extension) ? 'PASS' : 'FAIL';
		}
		$response['source'] = $extra_info['source'];
		$response['target'] = $extra_info['target'];
		$response['result'] = $result;
		return $response;
	}

	/**
	 * 连接 MySQL
	 * 
	 * @param array $options 选项参数
	 * @param string $sql SQL语句
	 */
	private function connect_mysql($options, $sql)
	{
		if (isset($options['server']) && isset($options['user']) && isset($options['password']) && isset($options['database']) && isset($options['charset'])) {
			try {
				$mysql = mysql_connect($options['server'], $options['user'], $options['password']);
				mysql_select_db($options['database'], $mysql);
				mysql_query('set names ' . $options['charset'], $mysql);
				$result = mysql_query($sql, $mysql);
				if ($result) {
					$row = mysql_fetch_row($result);
					return $row ? implode(',', $row) : '';
				}
			} catch (Exception $e) {
				return $e;
			}
		} else {
			return '系统错误: 连接串不正确，请检查是否包含server, user, password, database, charset参数。';
		}
		return '';
	}

	/**
	 * 连接 MySQL(mysqli)
	 * 
	 * @param array $options 选项参数
	 * @param string $sql SQL语句
	 */
	private function connect_mysqli($options, $sql)
	{
		if (isset($options['server']) && isset($options['user']) && isset($options['password']) && isset($options['database']) && isset($options['charset'])) {
			try {
				$mysqli = new mysqli($options['server'], $options['user'], $options['password'], $options['database']);
				$mysqli->query('set names ' . $options['charset']);
				$result = $mysqli->query($sql);
				if ($result) {
					$row = $result->fetch_row();
					return $row ? implode(',', $row) : '';
				}
			} catch (Exception $e) {
				return $e;
			}
		} else {
			return '系统错误: 连接串不正确，请检查是否包含server, user, password, database, charset参数。';
		}
		return '';
	}

	/**
	 * 连接 MySQL(PDO)
	 * 
	 * @param array $options 选项参数
	 * @param string $sql SQL语句
	 */
	private function connect_pdo_mysql($options, $sql)
	{
		if (isset($options['server']) && isset($options['user']) && isset($options['password']) && isset($options['database']) && isset($options['charset'])) {
			try {
				$pdo = new Pdo('mysql:host=' . $options['server'] . ';dbname=' . $options['database'], $options['user'], $options['password']);
				$pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
				$pdo->query('set names ' . $options['charset']);
				$result = $pdo->query($sql);
				if ($result) {
					$row = $result->fetch();
					return $row ? implode(',', $row) : '';
				}
			} catch (Exception $e) {
				return $e;
			}
		} else {
			return '系统错误: 连接串不正确，请检查是否包含server, user, password, database, charset参数。';
		}
		return '';
	}

	/**
	 * 连接 SQLServer
	 * 
	 * @param array $options 选项参数
	 * @param string $sql SQL语句
	 */
	private function connect_sqlsrv($options, $sql)
	{
		if (isset($options['server']) && isset($options['user']) && isset($options['password']) && isset($options['database']) && isset($options['charset'])) {
			try {
				$sqlsrv = sqlsrv_connect($options['server'], array(
					'UID' => $options['user'],
					'PWD' => $options['password'],
					'Database' => $options['database'],
					'CharacterSet' => $options['charset']
				));
				$result = sqlsrv_query($sqlsrv, $sql);
				if ($result) {
					$row = sqlsrv_fetch_array($result, SQLSRV_FETCH_ASSOC);
					return $row ? implode(',', $row) : '';
				}
			} catch (Exception $e) {
				return $e;
			}
		} else {
			return '系统错误: 连接串不正确，请检查是否包含server, user, password, database, charset参数。';
		}
		return '';
	}

	/**
	 * 连接 SQLServer(PDO)
	 * 
	 * @param array $options 选项参数
	 * @param string $sql SQL语句
	 */
	private function connect_pdo_sqlsrv($options, $sql)
	{
		if (isset($options['server']) && isset($options['user']) && isset($options['password']) && isset($options['database']) && isset($options['charset'])) {
			try {
				$pdo = new Pdo('sqlsrv:server=' . $options['server'] . ';database=' . $options['database'], $options['user'], $options['password']);
				$pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
				$pdo->query('set character_set_connection=' . $options['charset'] . ', character_set_results=' . $options['charset'] . ', character_set_client=' . $options['charset']);
				$result = $pdo->query($sql);
				if ($result) {
					$row = $result->fetch();
					return $row ? implode(',', $row) : '';
				}
			} catch (Exception $e) {
				return $e;
			}
		} else {
			return '系统错误: 连接串不正确，请检查是否包含server, user, password, database, charset参数。';
		}
		return '';
	}

	/**
	 * 连接 Oracle
	 * 
	 * @param array $options 选项参数
	 * @param string $sql SQL语句
	 */
	private function connect_oci_oracle($options, $sql)
	{
		if (isset($options['server']) && isset($options['user']) && isset($options['password']) && isset($options['charset'])) {
			try {
				$conn = oci_connect($options['user'], $options['password'], $options['server'], $options['charset']);
				if ($conn) {
					$result = oci_parse($conn, $sql);
					oci_execute($result, OCI_DEFAULT);
					if ($result) {
						$row = oci_fetch_row($result);
						return $row ? implode(',', $row) : '';
					}
				}
			} catch (Exception $e) {
				return $e;
			}
		} else {
			return '系统错误: 连接串不正确，请检查是否包含server, user, password, charset参数。';
		}
		return '';
	}

	/**
	 * 连接 MongoDB
	 * 
	 * @param array $options 选项参数
	 * @param string $cmd 查询指令
	 */
	private function connect_mongo($options, $cmd)
	{
		if (isset($options['server']) && isset($options['user']) && isset($options['password']) && isset($options['database'])) {
			try {
				if ($options['user'] === '') {
					$conn = new Mongo($options['server']);
				} else {
					$conn = new Mongo('mongodb://' . $options['user'] . ':' . $options['password'] . '@' . $options['server']);
				}
				$db = $conn->selectDB($options['database']);
				if ($db) {
					$condition = json_decode($cmd, true);
					if ($condition && isset($condition['collection'])) {
						$collection = $db->selectCollection($condition['collection']);
						if ($collection && isset($condition['opt'])) {
							if ($condition['opt'] === 'find') {
								if (isset($condition['where']) && is_array($condition['where'])) {
									return json_encode(iterator_to_array($collection->find($condition['where'])));
								}
							} else if ($condition['opt'] === 'insert') {
								if (isset($condition['data']) && is_array($condition['data'])) {
									return json_encode($collection->insert($condition['data']));
								}
							} else if ($condition['opt'] === 'update') {
								if (isset($condition['where']) && is_array($condition['where']) && isset($condition['data']) && is_array($condition['data'])) {
									return json_encode($collection->update($condition['where'], $condition['data']));
								}
							} else if ($condition['opt'] === 'remove') {
								if (isset($condition['where']) && is_array($condition['where'])) {
									return json_encode($collection->remove($condition['where']));
								}
							}
						}
					} else {
						$result = $db->execute($cmd);
						return isset($result['retval']) ? json_encode($result['retval']) : json_encode($result);
					}
				}
			} catch (Exception $e) {
				return $e;
			}
		} else {
			return '系统错误: 连接串不正确，请检查是否包含server, user, password, database。';
		}
		return '';
	}
}
