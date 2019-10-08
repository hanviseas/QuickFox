<?php

use Lazybug\Framework as LF;

/**
 * Controller 设置空间维护人
 */
class Controller_V2_Api_Space_Owner_Update extends Controller_V2_Api_Space_Base
{
	protected $request_params = array(
		'space_id' => 'int',
		'owner_id' => 'int'
	);

	protected $required_params = array(
		'space_id',
		'owner_id'
	);

	public function act()
	{
		$this->init_param(Const_Code::SPACE_PARAM_ERROR, '空间传递参数错误');
		$space = LF\M('V2.Space')->get_by_id($this->params['space_id']);
		if ($this->params['space_id'] !== 0 && !$space) { // 未找到空间返回400
			$this->return_404(Const_Code::SPACE_NOT_FOUND, '空间未找到');
		}
		// 更新空间
		if ($this->params['space_id'] === 0) { // 默认空间更新到系统配置
			$return = LF\M('V2.System')->modify(array(), array(
				'default_owner' => $this->params['owner_id']
			));
		} else {
			$return = LF\M('V2.Space')->modify_by_id($this->params['space_id'], array(
				'owner_id' => $this->params['owner_id']
			));
		}
		if (is_null($return)) { // 无更新返回400
			$this->return_400(Const_Code::UPDATE_SPACE_FAIL, '空间维护人更新失败');
		}
		$this->log('更新空间维护人: ID-' . $this->params['space_id'] . ' ' . ($this->params['space_id'] === 0 ? '默认空间' : $space['name']));
		LF\V('Json.Base')->init(Const_Code::SUCCESS, '空间维护人更新成功');
	}
}
