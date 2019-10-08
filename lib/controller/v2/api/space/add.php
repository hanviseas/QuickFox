<?php

use Lazybug\Framework as LF;

/**
 * Controller 添加空间
 */
class Controller_V2_Api_Space_Add extends Controller_V2_Api_Space_Base
{
	protected $request_params = array(
		'space_name' => 'string'
	);

	protected $required_params = array(
		'space_name'
	);

	public function act()
	{
		$this->init_param(Const_Code::SPACE_PARAM_ERROR, '空间传递参数错误');
		// 名称在全局范围内唯一，如果重复返回400
		if ($this->params['space_name'] === '默认空间' || LF\M('V2.Space')->is_name_exists($this->params['space_name'])) {
			$this->return_400(Const_Code::ADD_SPACE_EXISTS, '空间名称重复');
		}
		// 添加空间
		LF\M('V2.Space')->add(array(
			'name' => $this->params['space_name']
		));
		// 取回插入的空间ID，用以回载到页面
		$space_id = LF\M('V2.Space')->is_name_exists($this->params['space_name']);
		if (!$space_id) { // 未找到ID返回400
			$this->return_400(Const_Code::ADD_SPACE_FAIL, '空间添加失败');
		}
		$this->log('添加空间: ID-' . $space_id . ' ' . $this->params['space_name']);
		LF\V('Json.Base')->init(Const_Code::SUCCESS, $space_id);
	}
}
