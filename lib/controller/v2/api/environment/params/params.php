<?php

use Lazybug\Framework as LF;

/**
 * Controller 获取环境参数
 */
class Controller_V2_Api_Environment_Params_Params extends Controller_V2_Api_Environment_Base
{
	protected $request_params = array(
		'page' => 'int',
		'size' => 'int',
		'environment_id' => 'int',
		'keyword' => 'string',
		'order_field' => 'string',
		'order_type' => 'string'
	);

	public function act()
	{
		$this->init_param();
		if ($this->params['environment_id'] !== 0 && !LF\M('V2.Environment')->get_by_id($this->params['environment_id'])) { // 未找到环境返回400
			$this->return_404(Const_Code::ENVIRONMENT_NOT_FOUND, '环境未找到');
		}
		// 如果有传递关键词参数，则在名称和请求地址中查找
		$where = array();
		if ($this->params['keyword'] !== '') {
			$where = array(
				'_complex' => array(
					'_logic' => 'or',
					'keyword' => array(
						'like', '%' . $this->params['keyword'] . '%'
					),
					'value' => array(
						'like', '%' . $this->params['keyword'] . '%'
					)
				)
			);
		}
		// 如果有传递排序方式，则进行数据排序
		$order = array();
		if ($this->params['order_field'] !== '') {
			$order_field = in_array($this->params['order_field'], array('id', 'keyword')) ? $this->params['order_field'] : 'id';
			$order_type = in_array($this->params['order_type'], array('asc', 'desc')) ? $this->params['order_type'] : 'asc';
			$order = array($order_field => $order_type);
		}
		$params = LF\M('V2.Environment.Param')->get_by_environment($this->params['environment_id'], $this->params['page'], $this->params['size'], $where, $order);
		$this->set_json_response($params);
	}
}
