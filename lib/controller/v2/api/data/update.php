<?php

use Lazybug\Framework as LF;

/**
 * Controller 更新数据源
 */
class Controller_V2_Api_Data_Update extends Controller_V2_Api_Data_Base
{
	protected $request_params = array(
		'data_id' => 'int',
		'data_source' => 'string',
		'data_keyword' => 'string',
		'data_value' => 'string',
		'data_comment' => 'string'
	);

	protected $required_params = array(
		'data_id',
		'data_source',
		'data_keyword',
		'data_value'
	);

	public function act()
	{
		$this->init_param(Const_Code::DATA_PARAM_ERROR, '数据源传递参数错误');
		if ($this->params['data_id'] === 1 && LF\lb_read_system('demo') === true) {
			$this->return_400(Const_Code::DATA_PARAM_ERROR, '演示模式下内置数据源不能修改');
		}
		$data = LF\M('V2.Environment.Data')->get_by_id($this->params['data_id']);
		if (!$data) { // 未找到数据源返回400
			$this->return_404(Const_Code::DATA_NOT_FOUND, '数据源未找到');
		}
		// 关键字必须由数字、字母、下划线组成
		if (!preg_match('/^\w+$/', $this->params['data_keyword'])) {
			$this->return_400(Const_Code::DATA_FORMAT_ERROR, '数据源关键字格式错误');
			return;
		}
		// 关键字在环境范围内唯一，如果重复返回400
		if (LF\M('V2.Environment.Data')->is_keyword_exists_in_environment((int) $data['environment_id'], $this->params['data_keyword'], $this->params['data_id'])) {
			$this->return_400(Const_Code::UPDATE_DATA_EXISTS, '数据源关键字重复');
		}
		// 更新数据源
		$return = LF\M('V2.Environment.Data')->modify_by_id($this->params['data_id'], array(
			'source' => $this->params['data_source'],
			'keyword' => $this->params['data_keyword'],
			'value' => $this->params['data_value'],
			'comment' => $this->params['data_comment']
		));
		if (is_null($return)) { // 无更新返回400
			$this->return_400(Const_Code::UPDATE_DATA_FAIL, '数据源更新失败');
		}
		$this->log('更新数据源: ID-' . $this->params['data_id'] . ' ' . $data['keyword']);
		LF\V('Json.Base')->init(Const_Code::SUCCESS, '数据源更新成功');
	}
}
