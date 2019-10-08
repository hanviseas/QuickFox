<?php

use Lazybug\Framework as LF;
use Lazybug\Framework\Util_Server_Request as Request;
use Lazybug\Framework\Util_Server_Response as Response;

/**
 * Controller 接口控制器基类
 */
abstract class Controller_V2_Api_Base extends Controller_V2_Base
{
	/**
	 * 接口授权检查
	 */
	protected function check_api_auth()
	{
		if (!$this->check_auth(trim(Request::get_param('auth_type', 'get')))) { // 授权失败设置403错误返回
			Response::set_header_403();
			LF\V('Json.Base')->init(Const_Code::AUTH, '授权限制');
			exit();
		}
	}

	/**
	 * 设置Json返回
	 * 
	 * @param array $data 返回数据
	 */
	protected function set_json_response($data)
	{
		Response::set_header_content('application/json; charset=utf-8');
		echo json_encode($data);
	}

	/**
	 * 记录日志
	 * 
	 * @param array $action 日志动作
	 */
	protected function log($action)
	{
		$auth_type = trim(Request::get_param('auth_type', 'get'));
		if (!$auth_type || $auth_type === 'session') { // SESSION验证
			$source = 'user';
			$operator = isset($_SESSION['userid']) ? (int) $_SESSION['userid'] : 0;
			$operator_name = isset($_SESSION['username']) ? $_SESSION['username'] : '未识别用户';
		} else if ($auth_type === 'app') { // 应用验证
			$client = trim(Request::get_param('client', 'get'));
			$application = LF\M('V2.Application')->get_by_name($client);
			$source = 'app';
			$operator = $client ? (int) $application['id'] : 0;
			$operator_name =  $client ? $application['name'] : '未识别应用';
		} else if ($auth_type === 'key') { // 密钥验证
			$source = 'key';
			$operator = 0;
			$operator_name = '';
		}
		$insert = array(
			'source' => $source,
			'operator' => $operator,
			'operator_name' => $operator_name,
			'action' => $action,
			'time' => date('Y-m-d H:i:s')
		);
		LF\M('V2.Log')->add($insert);
	}

	/**
	 * 转译所有
	 *
	 * @param string $subject 替换字符串
	 * @param int $environment_id 环境ID
	 * @param string $extension 扩展字符串
	 * @param bool $is_json 是否JSON
	 * @return $subject 替换完成字符串
	 */
	protected function translate_all($subject, $environment_id = 0, $extension = '', $is_json = false)
	{
		$subject = $this->replace_param_expression($subject, $environment_id, $is_json);
		$subject = $this->replace_extractor_expression($subject, $extension, $is_json);
		$subject = $this->replace_function_expression($subject, $is_json);
		return $subject;
	}

	/**
	 * 转译过滤器
	 *
	 * @param string $subject 替换字符串
	 * @param int $environment_id 环境ID
	 * @param string $extension 扩展字符串
	 * @param bool $is_json 是否JSON
	 * @return $subject 替换完成字符串
	 */
	protected function translate_fliter($subject, $environment_id = 0, $extension = '', $is_json = false)
	{
		$subject = $this->replace_extractor_expression($subject, $extension, $is_json);
		return $subject;
	}

	/**
	 * 转译变量
	 *
	 * @param string $subject 替换字符串
	 * @param int $environment_id 环境ID
	 * @param string $extension 扩展字符串
	 * @param bool $is_json 是否JSON
	 * @return $subject 替换完成字符串
	 */
	protected function translate_variable($subject, $environment_id = 0, $extension = '', $is_json = false)
	{
		$subject = $this->replace_param_expression($subject, $environment_id, $is_json);
		return $subject;
	}

	/**
	 * 替换参数表达式
	 *
	 * @param string $subject 替换字符串
	 * @param int $environment_id 环境ID
	 * @param bool $is_json 是否JSON
	 * @return $subject 替换完成字符串
	 */
	private function replace_param_expression($subject, $environment_id, $is_json)
	{
		// 替换所有的${param:xxx}为环境参数配置关键字为xxx的值
		preg_match_all('/\$\{param:(\w+)\}/', $subject, $matches);
		foreach (array_unique($matches[1]) as $match) {
			// 根据环境读取参数配置并替换
			// 注意：如果目标会构成JSON串，则需要做过滤，把 " 转变成 \\"
			$config = LF\M('V2.Environment.Param')->get_by_keyword_in_environment($environment_id, $match);
			$config['value'] = isset($config['value']) ? $config['value'] : '% 配置不存在 %';
			$replacement = $is_json ? str_replace('"', '\\"', $config['value']) : $config['value'];
			$subject = preg_replace('/\$\{param:' . $match . '\}/', $replacement, $subject);
		}
		return $subject;
	}

	/**
	 * 替换函数表达式
	 *
	 * @param string $subject 替换字符串
	 * @return $subject 替换完成字符串
	 */
	private function replace_function_expression($subject)
	{
		// 替换所有的${function:rand(x)}为长度为x的随机数字字符串
		preg_match_all('/\$\{function:(rand\((\d+)\))\}/', $subject, $matches);
		foreach ($matches[1] as $index => $match) {
			$replacement = '';
			for ($i = 0; $i < $matches[2][$index]; $i++) { // $matches [2] [$index] 为随机串的长度
				$replacement .= rand(0, 9);
			}
			$subject = preg_replace('/\$\{function:' . preg_quote($match) . '\}/', $replacement, $subject, 1);
		}
		// 替换所有的${function:randc(x)}为长度为x的随机字母字符串
		preg_match_all('/\$\{function:(randc\((\d+)\))\}/', $subject, $matches);
		foreach ($matches[1] as $index => $match) {
			$replacement = '';
			for ($i = 0; $i < $matches[2][$index]; $i++) { // $matches [2] [$index] 为随机串的长度
				$replacement .= chr(rand(97, 122));
			}
			$subject = preg_replace('/\$\{function:' . preg_quote($match) . '\}/', $replacement, $subject, 1);
		}
		// 替换所有的${function:time(s或m)}为当前时间戳的秒数或毫妙数
		preg_match_all('/\$\{function:(time\(([sm])\))\}/', $subject, $matches);
		foreach ($matches[1] as $index => $match) {
			if ($matches[2][$index] === 's') { // s代表秒数
				$replacement = time();
			} else { // 否则为毫秒，补全三位小数
				$times = explode(' ', microtime());
				$replacement = strval($times[1]) . substr(strval(round($times[0], 3)), 2);
			}
			$subject = preg_replace('/\$\{function:' . preg_quote($match) . '\}/', $replacement, $subject, 1);
		}
		return $subject;
	}

	/**
	 * 替换提取表达式
	 *
	 * @param string $subject 替换字符串
	 * @param string $extension 扩展字符串
	 * @param bool $is_json 是否JSON
	 * @return $subject 替换完成字符串
	 */
	private function replace_extractor_expression($subject, $extension, $is_json)
	{
		// 替换的提取源为扩展字符串，没有则无需替换
		if (!$extension) {
			return $subject;
		}
		// 替换所有的${extractor:global}为整个扩展字符串
		preg_match_all('/\$\{extractor:global\}/', $subject, $matches);
		foreach (array_unique($matches[0]) as $match) {
			// 注意：如果目标会构成JSON串，则需要做过滤，把 " 转变成 \\"
			$replacement = $is_json ? str_replace('"', '\\"', $extension) : $extension;
			$subject = preg_replace('/\$\{extractor:global\}/', $replacement, $subject);
		}
		// 替换所有的${extractor:json:xxx->yyy;}为扩展字符串作为JSON解析后的json[xxx][yyy]的值
		preg_match_all('/\$\{extractor:json:([^;]+);\}/', $subject, $matches);
		if ($matches[1]) {
			$json = @json_decode(trim($extension), true);
			if (!is_null($json)) {
				foreach (array_unique($matches[1]) as $match) {
					$value = '';
					@eval('$value = $json[\'' . preg_replace('/\->/', '\'][\'', $match) . '\'];');
					// 智能拼接用于处理JSON值中布尔值的问题，布尔值会转换为true或false的字符串
					$value = $this->smart_bool_implode(",", $value);
					// 注意：如果目标会构成JSON串，则需要做过滤，把 " 转变成 \\"
					$replacement = $is_json ? str_replace('"', '\\"', $value) : $value;
					$subject = preg_replace('/\$\{extractor:json:' . preg_replace('/\//', '\/', preg_quote($match)) . ';\}/', $replacement, $subject);
				}
			}
		}
		// 替换所有的${extractor:json:xxx;}为扩展字符串作为XML解析后的xxx（XPATH）的值
		preg_match_all('/\$\{extractor:xml:([^;]+);\}/', $subject, $matches);
		if ($matches[1]) {
			$xml = @simplexml_load_string(trim($extension));
			if ($xml) {
				foreach (array_unique($matches[1]) as $match) {
					$value = '';
					@$value = $xml->xpath($match);
					// 智能拼接用于处理XML值中布尔值的问题，布尔值会转换为true或false的字符串
					$value = $this->smart_bool_implode(",", $value);
					// 注意：如果目标会构成JSON串，则需要做过滤，把 " 转变成 \\"
					$replacement = $is_json ? str_replace('"', '\\"', $value) : $value;
					$subject = preg_replace('/\$\{extractor:xml:' . preg_replace('/\//', '\/', preg_quote($match)) . ';\}/', $replacement, $subject);
				}
			}
		}
		// 替换所有的${extractor:regexp:xxx:y:z;}为扩展字符串中符合正则xxx的第y个匹配项（括号）的第z次匹配
		preg_match_all('/\$\{extractor:regexp:(([^;]+):(\d+):(\d+));\}/', $subject, $matches);
		if ($matches[1]) {
			foreach (array_unique($matches[1]) as $index => $match) {
				preg_match_all('/' . $matches[2][$index] . '/', $extension, $regexp_matches); // $matches [2] [$index] 为正则表达式
				if ($regexp_matches[0]) {
					$value = '';
					@$value = $regexp_matches[$matches[3][$index]][((int) $matches[4][$index] - 1)];
					// 注意：如果目标会构成JSON串，则需要做过滤，把 " 转变成 \\"
					$replacement = $is_json ? str_replace('"', '\\"', $value) : $value;
				} else {
					$replacement = '';
				}
				$subject = preg_replace('/\$\{extractor:regexp:' . preg_replace('/\//', '\/', preg_quote($match)) . ';\}/', $replacement, $subject);
			}
		}
		return $subject;
	}

	/**
	 * 智能布尔值implode
	 *
	 * @param string $glue 连接符
	 * @param array $object 目标数组
	 * @return $subject 拼接完成字符串
	 */
	private function smart_bool_implode($glue, $object)
	{
		if (!is_array($object)) {
			if ($object === true) {
				return "true";
			} else if ($object === false) {
				return "false";
			} else if ($object === null) {
				return "null";
			} else {
				return (string) $object;
			}
		}
		$subject = '';
		foreach ($object as $sub_object) {
			@$subject = $subject . $glue . $this->smart_bool_implode($glue, $sub_object);
		}
		return substr($subject, 1);
	}
}
