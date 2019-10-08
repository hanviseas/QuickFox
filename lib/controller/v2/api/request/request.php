<?php

/**
 * Controller 请求执行
 */
class Controller_V2_Api_Request_Request extends Controller_V2_Api_Request_Base
{
	protected $request_params = array(
		'request_url' => 'string',
		'request_type' => 'string',
		'content_type' => 'string',
		'request_param' => 'string',
		'request_header' => 'string',
		'request_cookie' => 'string'
	);

	public function act()
	{
		$this->init_param();
		// 请求参数处理，如果是x-www-form-urlencoded，将参数组装成k1=v1&k2=v2的形式，如果是form-date，将参数置为数组
		$request_param = $this->params['request_param'];
		if ($this->params['content_type'] === 'application/x-www-form-urlencoded') {
			$request_param = json_decode($this->params['request_param'], true);
			// 注意：传递过来的参数并不能保证是JSON串，需要做异常判断
			if (is_null($request_param) || !is_array($request_param)) {
				$request_param = '';
			} else {
				$request_param_array = array();
				// 注意：参数值有可能本身恰好是JSON串，在解码时变为了数组，这里需要重新组装
				foreach ($request_param as $key => $value) {
					$value = is_array($value) ? json_encode($value) : $value;
					$request_param_array[] = urlencode($key) . '=' . urlencode($value);
				}
				$request_param = implode('&', $request_param_array);
			}
		} else if ($this->params['content_type'] === 'multipart/form-data') {
			$request_param = json_decode($this->params['request_param'], true);
			// 注意：传递过来的参数并不能保证是JSON串，需要做异常判断
			if (is_null($request_param) || !is_array($request_param)) {
				$request_param = array();
			}
		}
		// 请求头处理，将请求头组装成key:value形式的数组
		$request_header = json_decode($this->params['request_header'], true);
		// 注意：传递过来的参数并不能保证是JSON串，需要做异常判断
		if (is_null($request_header) || !is_array($request_header)) {
			$request_header = array();
		}
		// 将Content-Type添加到请求头中，如果自己也指定了Content-Type，会被覆盖
		$request_header['Content-Type'] = $this->params['content_type'];
		$request_header_array = array();
		foreach ($request_header as $key => $value) {
			$request_header_array[] = $key . ':' . $value;
		}
		$request_header = $request_header_array;
		echo $this->initiate_curl_request($this->params['request_type'], $this->params['request_url'], $request_param, $request_header, true, $this->params['request_cookie']);
	}
}
