<?php

use Lazybug\Framework as LF;

/**
 * Controller 删除参数
 */
class Controller_V2_Api_Param_Remove extends Controller_V2_Api_Param_Base
{
	protected $request_params = array(
		'param_id' => 'int'
	);

	protected $required_params = array(
		'param_id'
	);

	public function act()
	{
		$this->init_param(Const_Code::PARAM_PARAM_ERROR, '参数传递参数错误');
		if ($this->params['param_id'] === 1 && LF\lb_read_system('demo') === true) {
			$this->return_400(Const_Code::PARAM_PARAM_ERROR, '演示模式下内置参数不能删除');
		}
		$param = LF\M('V2.Environment.Param')->get_by_id($this->params['param_id']);
		if (!$param) { // 未找到参数返回400
			$this->return_404(Const_Code::PARAM_NOT_FOUND, '参数未找到');
		}
		LF\M('V2.Environment.Param')->remove_by_id($this->params['param_id']);
		// 尝试取回数据，如果取回成功返回400
		if (LF\M('V2.Environment.Param')->get_by_id($this->params['param_id'])) {
			$this->return_400(Const_Code::DELETE_PARAM_FAIL, '参数删除失败');
		}
		$this->log('删除参数: ID-' . $this->params['param_id'] . ' ' . $param['keyword']);
		LF\V('Json.Base')->init(Const_Code::SUCCESS, '参数删除成功');
	}
}
