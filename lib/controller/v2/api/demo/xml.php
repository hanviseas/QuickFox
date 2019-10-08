<?php
class Controller_V2_Api_Demo_Xml extends Controller_V2_Api_Base
{
	public function act()
	{
		echo "
		<?xml version=\"1.0\" encoding=\"ISO-8859-1\" ?>
		<User>
			<Name>LazyBug</Name>
			<Adult>True</Adult>
			<Sex>M</Sex>
			<Age>18</Age>
			<Address>ShangHai. CHINA.</Address>
			<Friend Title=\"Best\" Order=\"1\">
				<Name>Kevin</Name>
			</Friend>
			<Friend Order=\"2\">
				<Name>John</Name>
			</Friend>
			<Friend Order=\"3\">
				<Name>Lily</Name>
			</Friend>
		</User>";
	}
}
