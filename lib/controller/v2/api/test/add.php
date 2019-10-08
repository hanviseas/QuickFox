<?php

use Lazybug\Framework as LF;

/**
 * Controller 添加测试
 */
class Controller_V2_Api_Test_Add extends Controller_V2_Api_Test_Base
{
	protected $request_params = array(
		'space_id' => 'int',
		'module_id' => 'int',
		'request_url' => 'string',
		'item_name' => 'string',
		'case_name' => 'string',
		'request_type' => 'string',
		'content_type' => 'string',
		'request_param' => 'string',
		'request_header' => 'string'
	);

	protected $required_params = array(
		'space_id',
		'module_id',
		'request_url',
		'item_name',
		'case_name',
		'request_type',
		'content_type'
	);

	public function act()
	{
		$this->init_param(Const_Code::ERROR, '请求参数错误');
		// 检查接口名称是否已经存在，如果存在，更新接口信息，如果不存在，则新增一个接口
		$item_id = LF\M('V2.Space.Item')->is_name_exists_in_space($this->params['space_id'], $this->params['item_name']);
		if ($item_id) {
			// 更新接口
			$return = LF\M('V2.Space.Item')->modify_by_id($item_id, array(
				'module_id' => $this->params['module_id'],
				'name' => $this->params['item_name'],
				'url' => $this->params['request_url']
			));
			if (is_null($return)) { // 无更新返回400
				$this->return_400(Const_Code::UPDATE_ITEM_FAIL, '接口更新失败');
			}
			$this->log('更新接口: ID-' . $item_id . ' ' . $this->params['item_name']);
			// 用例所属模块需要一并更新，涉及到计数
			LF\M('V2.Space.Case')->switch_our_module($item_id, $this->params['space_id'], $this->params['module_id']);
			// 检查用例名称是否已经存在，如果存在，更新用例信息，如果不存在，则新增一个用例
			$case_id = LF\M('V2.Space.Case')->is_name_exists_in_item($item_id, $this->params['case_name']);
			if ($case_id) {
				// 更新用例	
				$return = LF\M('V2.Space.Case')->modify_by_id($case_id, array(
					'module_id' => $this->params['module_id'],
					'name' => $this->params['case_name'],
					'stype' => $this->params['request_type'],
					'ctype' => $this->params['content_type'],
					'param' => $this->params['request_param'],
					'header' => $this->params['request_header']
				));
				if (is_null($return)) { // 无更新返回400
					$this->return_400(Const_Code::UPDATE_CASE_FAIL, '用例更新失败');
				}
				$this->log('更新用例: ID-' . $case_id . ' ' . $this->params['case_name']);
				LF\V('Json.Base')->init(Const_Code::SUCCESS, '用例保存成功');
			} else {
				$this->add_case($item_id);
			}
		} else {
			// 添加接口
			LF\M('V2.Space.Item')->add(array(
				'module_id' => $this->params['module_id'],
				'space_id' => $this->params['space_id'],
				'name' => $this->params['item_name'],
				'url' => $this->params['request_url']
			));
			// 取回插入的用例ID，用以添加用例
			$item_id = LF\M('V2.Space.Item')->is_name_exists_in_space($this->params['space_id'], $this->params['item_name']);
			if (!$item_id) { // 未找到ID返回400
				$this->return_400(Const_Code::ADD_ITEM_FAIL, '接口添加失败');
			}
			$this->log('添加接口: ID-' . $item_id . ' ' . $this->params['item_name']);
			$this->add_case($item_id);
		}
	}

	/**
	 * 添加用例
	 *
	 * @param int $item_id 接口ID
	 */
	private function add_case($item_id)
	{
		$item = LF\M('V2.Space.Item')->get_by_id($item_id);
		// 添加用例
		LF\M('V2.Space.Case')->add(array(
			'item_id' => $item_id,
			'module_id' => (int) $item['module_id'],
			'space_id' => $this->params['space_id'],
			'name' => $this->params['case_name'],
			'stype' => $this->params['request_type'],
			'ctype' => $this->params['content_type'],
			'param' => $this->params['request_param'],
			'header' => $this->params['request_header']
		));
		$case_id = LF\M('V2.Space.Case')->is_name_exists_in_item($item_id, $this->params['case_name']);
		if (!$case_id) { // 未找到ID返回400
			$this->return_400(Const_Code::ADD_CASE_FAIL, '用例添加失败');
		}
		// 添加接口默认步骤，每个接口的默认步骤即调用自身，此步骤不能被删除
		LF\M('V2.Space.Step')->add(array(
			'case_id' => $case_id,
			'name' => '调用: ' . $this->params['item_name'] . '->' . $this->params['case_name'], // 步骤格式为"接口名->用例名"
			'type' => 'request',
			'command' => 'self',
			'value' => $case_id,
			'sequence' => 1
		));
		$this->log('添加用例: ID-' . $case_id . ' ' . $this->params['case_name']);
		LF\V('Json.Base')->init(Const_Code::SUCCESS, '用例添加成功');
	}
}
