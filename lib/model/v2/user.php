<?php

/**
 * Model 用户模型
 */
class Model_V2_User extends Model_V2_Base
{
	protected $table_name = 'user';

	/**
	 * 检查密码是否匹配
	 *
	 * @param string $name 用户名
	 * @param string $password 密码串
	 * @return $id 用户ID或0
	 */
	public function is_password_match($name, $password)
	{
		$where = array(
			'name' => $name
		);
		$user_info = $this->get_one_row($where);
		return ($user_info && $user_info['passwd'] === $password) ? (int) $user_info['id'] : 0;
	}

	/**
	 * 设置密码
	 *
	 * @param int $id 用户ID
	 * @param int $password 密码
	 */
	public function set_my_password($id, $password)
	{
		$where = array(
			'id' => $id
		);
		$update = array(
			'passwd' => $password
		);
		return $this->modify($where, $update);
	}
}
