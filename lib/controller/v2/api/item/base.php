<?php

use Lazybug\Framework as LF;

/**
 * Controller 接口相关接口控制器基类
 */
abstract class Controller_V2_Api_Item_Base extends Controller_V2_Api_Base
{
	public function __construct()
	{
		$this->check_api_auth();
	}

	/**
	 * 获取接口维护人（包括继承）
	 * 
	 * @param data $item 接口数据实体
	 * @return array $owner 维护人信息
	 */
	public function get_item_owner($item)
	{
		if ((int) $item['owner_id'] !== 0) { // 接口设置了维护人
			return array(
				'id' => (int) $item['owner_id'],
				'source' => 'item'
			);
		}
		$module = LF\M('V2.Space.Module')->get_by_id((int) $item['module_id']);
		if ($module && (int) $module['owner_id'] !== 0) { // 模块设置了维护人
			return array(
				'id' => (int) $module['owner_id'],
				'source' => 'module'
			);
		}
		if ((int) $item['space_id'] === 0) { // 默认空间
			$system = LF\M('V2.System')->get_one_row();
			$space_owner_id = $system ? (int) $system['default_owner'] : 0;
		} else {
			$space = LF\M('V2.Space')->get_by_id((int) $item['space_id']);
			$space_owner_id = $space ? (int) $space['owner_id'] : 0;
		}
		if ($space_owner_id) {  // 空间设置了维护人
			return array(
				'id' => $space_owner_id,
				'source' => 'space'
			);
		}
		return array(
			'id' => 0,
			'source' => 'item'
		);
	}
}
