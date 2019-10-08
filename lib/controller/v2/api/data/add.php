<?php

use Lazybug\Framework as LF;

/**
 * Controller 添加数据源
 */
class Controller_V2_Api_Data_Add extends Controller_V2_Api_Data_Base
{
	protected $request_params = array(
		'environment_id' => 'int',
		'data_source' => 'string',
		'data_keyword' => 'string',
		'data_value' => 'string',
		'data_comment' => 'string'
	);

	protected $required_params = array(
		'environment_id',
		'data_source',
		'data_keyword',
		'data_value'
	);

	public function act()
	{
		$this->init_param(Const_Code::DATA_PARAM_ERROR, '数据源传递参数错误');
		// 关键字必须由数字、字母、下划线组成
		if (!preg_match('/^\w+$/', $this->params['data_keyword'])) {
			$this->return_400(Const_Code::DATA_FORMAT_ERROR, '数据源关键字格式错误');
			return;
		}
		// 关键字在环境范围内唯一，如果重复返回400
		if (LF\M('V2.Environment.Data')->is_keyword_exists_in_environment($this->params['environment_id'], $this->params['data_keyword'])) {
			$this->return_400(Const_Code::ADD_DATA_EXISTS, '数据源关键字重复');
		}
		// 添加数据源
		LF\M('V2.Environment.Data')->add(array(
			'environment_id' => $this->params['environment_id'],
			'source' => $this->params['data_source'],
			'keyword' => $this->params['data_keyword'],
			'value' => $this->params['data_value'],
			'comment' => $this->params['data_comment']
		));
		// 取回插入的接口ID，用以回载到页面
		$data_id = LF\M('V2.Environment.Data')->is_keyword_exists_in_environment($this->params['environment_id'], $this->params['data_keyword']);
		if (!$data_id) { // 未找到ID返回400
			$this->return_400(Const_Code::ADD_DATA_FAIL, '数据源添加失败');
		}
		$this->log('添加数据源: ID-' . $data_id . ' ' . $this->params['data_keyword']);
		LF\V('Json.Base')->init(Const_Code::SUCCESS, $data_id);
	}
}
