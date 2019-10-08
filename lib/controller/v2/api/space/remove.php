<?php

use Lazybug\Framework as LF;

/**
 * Controller 删除空间
 */
class Controller_V2_Api_Space_Remove extends Controller_V2_Api_Space_Base
{
	protected $request_params = array(
		'space_id' => 'int'
	);

	protected $required_params = array(
		'space_id'
	);

	public function act()
	{
		$this->init_param(Const_Code::SPACE_PARAM_ERROR, '空间传递参数错误');
		$space = LF\M('V2.Space')->get_by_id($this->params['space_id']);
		if (!$space) { // 未找到空间返回400
			$this->return_404(Const_Code::SPACE_NOT_FOUND, '空间未找到');
		}
		// 清除所有空间数据
		LF\M('V2.Space.Module')->remove_by_space($this->params['space_id']);
		LF\M('V2.Space.Item')->remove_by_space($this->params['space_id']);
		LF\M('V2.Space.Case')->remove_by_space($this->params['space_id']);
		LF\M('V2.Space')->remove_by_id($this->params['space_id']);
		// 尝试取回数据，如果取回成功返回400
		if (LF\M('V2.Space')->get_by_id($this->params['space_id'])) {
			$this->return_400(Const_Code::DELETE_SPACE_FAIL, '空间删除失败');
		}
		$this->log('删除空间: ID-' . $this->params['space_id'] . ' ' . $space['name']);
		LF\V('Json.Base')->init(Const_Code::SUCCESS, '空间删除成功');
	}
}
