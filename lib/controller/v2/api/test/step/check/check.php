<?php

/**
 * Controller 检查点步骤
 */
class Controller_V2_Api_Test_Step_Check_Check extends Controller_V2_Api_Test_Base
{
	protected $request_params = array(
		'step_command' => 'string',
		'step_value' => 'string',
		'environment_id' => 'int',
		'preposition_fliter' => 'string',
		'extension' => 'string'
	);

	public function act()
	{
		$this->init_param();
		$this->set_json_response($this->exec_check_step($this->params['step_command'], $this->params['step_value'], $this->params['environment_id'], $this->params['preposition_fliter'], $this->params['extension']));
	}
}
