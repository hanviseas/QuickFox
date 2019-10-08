<?php

use Lazybug\Framework as LF;

/**
 * Controller 更新空间
 */
class Controller_V2_Api_Space_Update extends Controller_V2_Api_Space_Base
{
	protected $request_params = array(
		'space_id' => 'int',
		'space_name' => 'string'
	);

	protected $required_params = array(
		'space_id',
		'space_name'
	);

	public function act()
	{
		$this->init_param(Const_Code::SPACE_PARAM_ERROR, '空间传递参数错误');
		$space = LF\M('V2.Space')->get_by_id($this->params['space_id']);
		if (!$space) { // 未找到空间返回400
			$this->return_404(Const_Code::SPACE_NOT_FOUND, '空间未找到');
		}
		// 名称在全局范围内唯一，如果重复返回400
		if ($this->params['space_name'] === '默认空间' || LF\M('V2.Space')->is_name_exists($this->params['space_name'], $this->params['space_id'])) {
			$this->return_400(Const_Code::UPDATE_SPACE_EXISTS, '空间名称重复');
		}
		// 更新空间
		$return = LF\M('V2.Space')->modify_by_id($this->params['space_id'], array(
			'name' => $this->params['space_name']
		));
		if (is_null($return)) { // 无更新返回400
			$this->return_400(Const_Code::UPDATE_SPACE_FAIL, '空间更新失败');
		}
		$this->log('更新空间: ID-' . $this->params['space_id'] . ' ' . $space['name']);
		LF\V('Json.Base')->init(Const_Code::SUCCESS, '空间更新成功');
	}
}
