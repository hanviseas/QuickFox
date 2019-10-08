<?php

use Lazybug\Framework as LF;
use Lazybug\Framework\Util_Server_Request as Request;

/**
 * Controller Teambition登录授权接口
 */
class Controller_V2_Api_Auth_Teambition extends Controller_V2_Api_Auth_Base
{
	protected $request_params = array(
		'username' => 'string',
		'password' => 'string',
		'code' => 'string'
	);

	protected $required_params = array(
		'username',
		'password'
	);

	public function act()
	{
		$this->init_param(Const_Code::LOGIN_PARAM_ERROR, '第三方登录传递参数错误');
		// 提取TB登录页面Token
		$tb_html = json_decode($this->initiate_curl_request('GET', 'https://account.teambition.com/login', '', array()), true);
		preg_match('/data-clientid="([^"]+)"/', $tb_html['body'], $match);
		$client_id = count($match) === 2 ? $match[1] : '';
		preg_match('/data-clienttoken="([^"]+)"/', $tb_html['body'], $match);
		$client_token = count($match) === 2 ? $match[1] : '';
		// 不能获取Client_ID或Client_Token
		if (!$client_id || !$client_token) {
			$this->return_400(Const_Code::LOGIN_FAIL, '第三方登录异常');
		}
		// 提交TB登录验证
		$param = array(
			'email=' . urlencode($this->params['username']),
			'password=' . urlencode($this->params['password']),
			'response_type=' . 'session',
			'client_id=' . $client_id,
			'token=' . $client_token
		);
		$auth_response = json_decode($this->initiate_curl_request('POST', 'https://account.teambition.com/api/login/email', implode('&', $param), array()), true);
		$auth_response = json_decode($auth_response['body'], true);
		// 请求TB登录接口异常
		if ($auth_response === null) {
			$this->return_400(Const_Code::LOGIN_FAIL, '第三方登录异常');
		}
		if (isset($auth_response['token'])) {
			// 未输入验证码
			if (!$this->params['code']) {
				$this->return_400(Const_Code::LOGIN_CODE_ERROR, '请输入二步验证码');
			}
			// 进一步调用二步验证接口
			$param = array(
				'redirect_uri=https://www.teambition.com/projects',
				'verify=' . $auth_response['token'],
				'authcode=' . $this->params['code'],
				'response_type=' . 'session',
				'client_id=' . $client_id,
				'token=' . $client_token
			);
			$auth_response = json_decode($this->initiate_curl_request('POST', 'https://account.teambition.com/api/login/two-factor', implode('&', $param), array()), true);
			$auth_response = json_decode($auth_response['body'], true);
			// 请求二步验证接口异常
			if ($auth_response === null) {
				$this->return_400(Const_Code::LOGIN_FAIL, '第三方登录异常');
			}
			// 二步验证失败
			if (isset($auth_response['status'])) {
				$this->return_400(Const_Code::LOGIN_FAIL, '二步验证错误');
			}
		}
		// 登录TB验证不正确
		if (!isset($auth_response['user'])) {
			$this->return_400(Const_Code::LOGIN_FAIL, 'Teambition 帐号验证错误');
		}
		// 返回信息异常
		if (!isset($auth_response['user']['_id']) || !isset($auth_response['user']['name']) || !isset($auth_response['user']['email'])) {
			$this->return_400(Const_Code::LOGIN_FAIL, 'Teambition 用户信息异常');
		}
		// 自动注册用户
		$account_name = 'teambition_' . md5($auth_response['user']['_id']);
		$user = LF\M('V2.User')->get_by_name($account_name);
		if (!$user) { // 用户不存在，自动注册
			LF\M('V2.User')->add(array(
				'name' => $account_name,
				'card' => $auth_response['user']['name'],
				'passwd' => md5($account_name . 'quickfox'),
				'role' => 'normal',
				'avatar' => $auth_response['user']['avatarUrl'],
				'email' => $auth_response['user']['email']
			));
			$user = LF\M('V2.User')->get_by_name($account_name);
			if (!$user) {
				$this->return_400(Const_Code::LOGIN_FAIL, '自动注册失败');
			}
			LF\M('V2.Third.Teambition')->add(array(
				'user_id' => (int) $user['id'],
				'third_id' => $auth_response['user']['_id']
			));
		} else { // 同步用户信息
			$update = array(
				'card' => $auth_response['user']['name'],
				'avatar' => $auth_response['user']['avatarUrl'],
				'email' => $auth_response['user']['email']
			);
			LF\M('V2.User')->modify_by_id((int) $user['id'], $update);
		}
		$_SESSION['userid'] = (int) $user['id'];
		$_SESSION['username'] = $user['name'];
		$_SESSION['userrole'] = $user['role'];
		LF\V('Json.Base')->init(Const_Code::SUCCESS, '授权通过');
	}
}
