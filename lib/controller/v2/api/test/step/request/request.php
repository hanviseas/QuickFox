<?php

/**
 * Controller 接口调用步骤
 */
class Controller_V2_Api_Test_Step_Request_Request extends Controller_V2_Api_Test_Base
{
	protected $request_params = array(
		'step_value' => 'int',
		'environment_id' => 'int',
		'preposition_fliter' => 'string',
		'postposition_fliter' => 'string',
		'extension' => 'string',
		'cookie_file' => 'string'
	);

	public function act()
	{
		$this->init_param();
		$this->set_json_response($this->exec_request_step($this->params['step_value'], $this->params['environment_id'], $this->params['preposition_fliter'], $this->params['postposition_fliter'], $this->params['extension'], $this->params['cookie_file']));
	}
}
