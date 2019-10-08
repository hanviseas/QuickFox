<?php

/**
 * Model 应用模型
 */
class Model_V2_Application extends Model_V2_Base
{
	protected $table_name = 'application';

	/**
	 * 检查密钥是否匹配
	 *
	 * @param string $name 应用名称
	 * @param string $secret 应用密钥
	 * @return $id 应用ID或0
	 */
	public function is_secret_match($name, $secret)
	{
		$where = array(
			'name' => $name
		);
		$applicaition_info = $this->get_one_row($where);
		return ($applicaition_info && $applicaition_info['secret'] === $secret) ? (int) $applicaition_info['id'] : 0;
	}
}
