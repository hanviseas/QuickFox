<?php
class Controller_V2_Api_Demo_Json extends Controller_V2_Api_Base
{
	public function act()
	{
		echo json_encode(array(
			'Name' => 'LazyBug',
			'Adult' => true,
			'Sex' => 'M',
			'Age' => 18,
			'Address' => 'ShangHai. CHINA.',
			'Friends' => array(
				'China' => 'XiaoMing',
				'Amarica' => 'John',
				'Japan' => 'Conan'
			)
		));
	}
}
