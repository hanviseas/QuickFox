<?php

use Lazybug\Framework\Mod_View_Xml;
use Lazybug\Framework\Util_Server_Response as Response;

/**
 * View Xml视图基类
 */
class View_Xml_Base extends Mod_View_Xml
{
	private $dom = null;

	public function __construct()
	{
		parent::__construct();
		Response::set_header_content('text/xml; charset=utf-8');
		$this->dom = $this->get_dom();
	}

	public function init($root, $data)
	{
		$this->dom->appendChild($this->create_tree($root, $data));
		$this->output();
	}

	private function create_tree($root, $data)
	{
		$root = $this->create_node($root);
		if (is_array($data)) {
			foreach ($data as $key => $value) {
				if (is_array($value)) {
					$root->appendChild($this->create_tree($key, $value));
				} else {
					$node = $this->create_node($key);
					$node->appendChild($this->createValue($value));
					$root->appendChild($node);
				}
			}
		}
		return $root;
	}

	private function create_node($name)
	{
		if (is_numeric($name)) {
			return $this->dom->createElement('item');
		} else {
			return $this->dom->createElement($name);
		}
	}

	private function createValue($value)
	{
		if (strpos($value, '<') > -1) {
			return $this->dom->createCDATASection($value);
		} else {
			return $this->dom->createTextNode($value);
		}
	}
}
