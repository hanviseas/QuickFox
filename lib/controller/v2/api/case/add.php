<?php

use Lazybug\Framework as LF;

/**
 * Controller 添加用例
 */
class Controller_V2_Api_Case_Add extends Controller_V2_Api_Case_Base
{
	protected $request_params = array(
		'item_id' => 'int',
		'source_id' => 'int',
		'module_id' => 'int',
		'space_id' => 'int',
		'case_name' => 'string',
		'request_type' => 'string',
		'content_type' => 'string',
		'request_param' => 'string',
		'request_header' => 'string'
	);

	protected $required_params = array(
		'item_id',
		'module_id',
		'space_id',
		'case_name',
		'request_type',
		'content_type'
	);

	public function act()
	{
		$this->init_param(Const_Code::CASE_PARAM_ERROR, '用例传递参数错误');
		// 名称在接口范围内唯一，如果重复返回400
		if (LF\M('V2.Space.Case')->is_name_exists_in_item($this->params['item_id'], $this->params['case_name'])) {
			$this->return_400(Const_Code::ADD_CASE_EXISTS, '用例名称重复');
		}
		// 复制模式
		if ($this->params['source_id'] > 0) {
			$source_case = LF\M('V2.Space.Case')->get_by_id($this->params['source_id']);
			if (!$source_case) { // 未找到ID返回400
				$this->return_400(Const_Code::ADD_CASE_FAIL, '被复制用例未找到');
			}
			$this->params['request_type'] = $source_case['stype'];
			$this->params['content_type'] = $source_case['ctype'];
			$this->params['request_param'] = $source_case['param'];
			$this->params['request_header'] = $source_case['header'];
		}
		// 校正数据
		$item = LF\M('V2.Space.Item')->get_by_id($this->params['item_id']);
		$this->params['module_id'] = $item ? (int) $item['module_id'] : $this->params['module_id'];
		$this->params['space_id'] = $item ? (int) $item['space_id'] : $this->params['space_id'];
		// 添加用例
		LF\M('V2.Space.Case')->add(array(
			'item_id' => $this->params['item_id'],
			'module_id' => $this->params['module_id'],
			'space_id' => $this->params['space_id'],
			'name' => $this->params['case_name'],
			'stype' => $this->params['request_type'],
			'ctype' => $this->params['content_type'],
			'param' => $this->params['request_param'],
			'header' => $this->params['request_header']
		));
		// 取回插入的用例ID，用以回载到页面
		$case_id = LF\M('V2.Space.Case')->is_name_exists_in_item($this->params['item_id'], $this->params['case_name']);
		if (!$case_id) { // 未找到ID返回400
			$this->return_400(Const_Code::ADD_CASE_FAIL, '用例添加失败');
		}
		// 添加接口步骤，每个接口的默认步骤即调用自身，此步骤不能被删除
		if ($this->params['source_id'] > 0) { // 复制模式，所有步骤均会复制
			$source_steps = LF\M('V2.Space.Step')->get_by_case($this->params['source_id']);
			foreach ($source_steps as $step) {
				$step['case_id'] = $case_id;
				if ($step['command'] === 'self') { // 调用自身的名字和值需要替换成当前用例值
					$step['name'] = '调用: ' . (($item && isset($item['name'])) ? $item['name'] : '未定义接口') . '->' . $this->params['case_name'];
					$step['value'] = $case_id;
				}
				LF\M('V2.Space.Step')->add($step);
			}
		} else { // 非复制模式插入默认步骤即可
			LF\M('V2.Space.Step')->add(array(
				'case_id' => $case_id,
				'name' => '调用: ' . (($item && isset($item['name'])) ? $item['name'] : '未定义接口') . '->' . $this->params['case_name'], // 步骤格式为"接口名->用例名"
				'type' => 'request',
				'command' => 'self',
				'preposition_fliter' => '',
				'postposition_fliter' => '',
				'value' => $case_id,
				'sequence' => 1
			));
		}
		$this->log('添加用例: ID-' . $case_id . ' ' . $this->params['case_name']);
		LF\V('Json.Base')->init(Const_Code::SUCCESS, $case_id);
	}
}
