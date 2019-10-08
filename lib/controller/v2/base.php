<?php

use Lazybug\Framework as LF;
use Lazybug\Framework\LB;
use Lazybug\Framework\Lb_Controller;
use Lazybug\Framework\Util_Server_Request as Request;
use Lazybug\Framework\Util_Server_Response as Response;
use Lazybug\Framework\Util_Client_Cookie as Cookie;
use Lazybug\Framework\Mod_Router_Mapping as Router;

/**
 * Controller 控制器基类
 */
abstract class Controller_V2_Base extends Lb_Controller
{
	/**
	 * 请求参数数组
	 */
	protected $request_params = array();

	/**
	 * 必备参数数组
	 */
	protected $required_params = array();

	/**
	 * 参数数组
	 */
	protected $params = array();

	/**
	 * 快捷获取数字类型参数
	 *
	 * @param string $key 参数索引
	 * @return $value 参数值
	 */
	protected function i($key)
	{
		// 优先查找路径参数，得到的参数值强制做int类型转换
		if (Router::get_path_param($key) !== '') {
			return (int) (Router::get_path_param($key));
		}
		return (int) (trim(Request::get_param($key, 'post')));
	}

	/**
	 * 快捷获取字符类型参数
	 *
	 * @param string $key 参数索引
	 * @return $value 参数值
	 */
	protected function s($key)
	{
		// 优先查找路径参数，得到的参数值去除首尾空格
		if (Router::get_path_param($key) !== '') {
			return Router::get_path_param($key);
		}
		return trim(Request::get_param($key, 'post'));
	}

	/**
	 * 返回400错误
	 *
	 * @param string $code 返回码
	 * @param string $message 返回消息
	 */
	protected function return_400($code = '', $message = '')
	{
		Response::set_header_400();
		LF\V('Json.Base')->init($code, $message);
		exit();
	}

	/**
	 * 返回403错误
	 *
	 * @param string $code 返回码
	 * @param string $message 返回消息
	 */
	protected function return_403($code = '', $message = '')
	{
		Response::set_header_403();
		LF\V('Json.Base')->init($code, $message);
		exit();
	}

	/**
	 * 返回404错误
	 *
	 * @param string $code 返回码
	 * @param string $message 返回消息
	 */
	protected function return_404($code = '', $message = '')
	{
		Response::set_header_404();
		LF\V('Json.Base')->init($code, $message);
		exit();
	}

	/**
	 * 参数初始化
	 *
	 * @param string $code 返回码
	 * @param string $message 返回消息
	 */
	protected function init_param($code = '', $message = '')
	{
		// 初始化请求参数到params数组，区分int和string类型
		if ($this->request_params && is_array($this->request_params)) {
			foreach ($this->request_params as $request_param => $data_type) {
				if ($data_type === 'int') {
					$this->params[$request_param] = $this->i($request_param);
				} else if ($data_type === 'string') {
					$this->params[$request_param] = $this->s($request_param);
				}
			}
		}
		// 检查必备参数，如果失败返回400
		if ($this->required_params && is_array($this->required_params)) {
			foreach ($this->required_params as $param) {
				if (!isset($this->params[$param]) || $this->params[$param] === '') { // 是否传递了参数
					$this->return_400($code, $message);
				}
			}
		}
	}

	/**
	 * 授权检查
	 *
	 * @param string $auth_type 授权方式
	 * @return status 授权状态
	 */
	protected function check_auth($auth_type = 'session')
	{
		$controller = LB::get_instance()->get_controller();
		$white_list = LF\lb_read_config('white', 'controller');
		if ($white_list && in_array($controller, $white_list)) { // 白名单内免验证
			return true;
		}
		if (!$auth_type || $auth_type === 'session') { // SESSION验证
			if (!isset($_SESSION['userrole'])) { // 无会话信息
				return false;
			}
			// 将角色与授权配置文件比对，授权配置位于config的auth文件，按Controller名字做授权
			$config = LF\lb_read_config('auth', $_SESSION['userrole']);
			return ($config && in_array($controller, $config)) ? true : false;
		} else if ($auth_type === 'app') { // 应用验证
			$client = trim(Request::get_param('client', 'get'));
			$secret = trim(Request::get_param('secret', 'get'));
			if (!LF\M('V2.Application')->is_secret_match($client, $secret)) { // 应用密钥未匹配
				return false;
			}
			// 将应用与授权配置文件比对，授权配置位于config的auth文件，按Controller名字做授权
			$config = LF\lb_read_config('auth', 'app');
			return ($config && in_array($controller, $config)) ? true : false;
		} else if ($auth_type === 'key') { // 密钥验证
			$key = trim(Request::get_param('key', 'get'));
			return $key === LF\lb_read_system('seckey') ? true : false;
		}
		return false;
	}

	/**
	 * 发起CURL请求
	 *
	 * @param string $request_type 请求类型
	 * @param string $request_url 请求URL
	 * @param string $request_param 请求参数
	 * @param array $request_header 请求头信息
	 * @param bool $set_cookie 是否使用COOKIE文件
	 * @param string $cookie_file COOKIE文件
	 * @return $response 响应内容
	 */
	protected function initiate_curl_request($request_type, $request_url, $request_param, $request_header, $set_cookie = false, $cookie_file = '')
	{
		$ch = curl_init();
		// 注意：四种请求类型的参数传递方式不一致
		switch ($request_type) {
			case 'GET':
				$request_param && $request_url .= '?' . $request_param;
				break;
			case 'POST':
				curl_setopt($ch, CURLOPT_POST, true);
				curl_setopt($ch, CURLOPT_POSTFIELDS, $request_param);
				break;
			case 'PUT':
				curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'PUT');
				curl_setopt($ch, CURLOPT_POSTFIELDS, $request_param);
				break;
			case 'DELETE':
				curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'DELETE');
				curl_setopt($ch, CURLOPT_POSTFIELDS, $request_param);
				break;
		}
		// COOKIE文件处理
		if ($set_cookie) {
			// 优先使用提供的参数，如果未提供则取得COOKIE中记录的文件名，如果仍没有，则默认设为local-当前微秒数
			if (!$cookie_file) {
				$saved_cookie_file = Request::get_cookie('cookiefile');
				if ($saved_cookie_file) {
					$cookie_file = $saved_cookie_file;
				} else {
					$cookie_file = 'local-' . microtime();
					Cookie::set_cookie('cookiefile', $cookie_file, time() + 90 * 24 * 3600);
				}
			}
			// 自动创建目录
			$cookie_file_dir = APP_PATH . '/tmp/cookie/';
			if (!is_dir($cookie_file_dir)) { // cookie目录不存在则创建，权限777
				@mkdir($cookie_file_dir, 0777, true);
			}
			$cookie_file_path = $cookie_file_dir . $cookie_file;
			curl_setopt($ch, CURLOPT_COOKIEFILE, $cookie_file_path); // 请求中附带的COOKIE
			curl_setopt($ch, CURLOPT_COOKIEJAR, $cookie_file_path); // 响应中设置COOKIE保存到文件
		}
		curl_setopt($ch, CURLOPT_TIMEOUT, 60);
		curl_setopt($ch, CURLOPT_URL, $request_url);
		curl_setopt($ch, CURLOPT_HTTPHEADER, $request_header);
		curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1); // 跟随重定向，会影响响应头部分解析
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		curl_setopt($ch, CURLOPT_HEADER, 1); // 响应内容中包含头信息
		curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); // 此两项设置用于略过HTTPS
		curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
		$response_content = curl_exec($ch);
		$response_header = '';
		// 将头信息与主体内容从响应中拆分出来，响应头有可能有多个（重定向）
		while (preg_match('/^HTTP\//', $response_content)) {
			$response_components = explode("\r\n\r\n", $response_content, 2);
			if (count($response_components) >= 2) {
				$response_header .= $response_components[0] . "\r\n\r\n";
				$response_content = $response_components[1];
			}
		}
		// 响应信息中包含头信息、主体内容、状态码、总耗时
		$response = json_encode(array(
			'header' => $response_header,
			'body' => $response_content,
			'code' => curl_getinfo($ch, CURLINFO_HTTP_CODE),
			'time' => curl_getinfo($ch, CURLINFO_TOTAL_TIME)
		));
		curl_close($ch);
		return $response;
	}
}
