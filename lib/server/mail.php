<?php

use Lazybug\Framework as LF;

/**
 * 服务端通知邮件
 */
class Server_Mail
{

	/**
	 * 邮件内容
	 */
	private static $mail_body = <<<END
	<html>
	<body>
		<p style="font-size:16px;font-family:Microsoft Yahei, SimHei, Arial;font-weight:bold;">
			任务 "{{task_name}}" 测试 {{test_result}}
		</p>
		<p style="font-size:16px;font-family:Microsoft Yahei, SimHei, Arial;">
			总共执行{{total_cases}}个检查点，
			通过<span style="color:#629731;font-weight:bold;">{{passed_cases}}</span>，
			失败<span style="color:#d0636e;font-weight:bold;">{{failed_cases}}</span>
		</p>
		<p style="font-size:16px;font-family:Microsoft Yahei, SimHei, Arial;font-weight:bold;">
			<a style="color:#22aabe;" href="http://{{server_host}}/index.php/v2/u/report?id={{report_id}}" target="_blank">查看详细报告 >></a>
		</p>
	</body>
	</html>
END;

	static public function send($task_name, $report_id)
	{
		$report = LF\M('V2.Report')->get_by_id($report_id);
		$passed_cases = (int) $report['pass']; // 成功用例数
		$failed_cases = (int) $report['fail']; // 失败用例数
		$title = '接口自动化测试报告 (' . date('Y-m-d h:i:s') . ')';
		$test_result = ($failed_cases === 0) ? '<span style="color:#629731">通过</span>' : '<span style="color:#d0636e">失败</span>';
		self::$mail_body = preg_replace('/{{task_name}}/', $task_name, self::$mail_body);
		self::$mail_body = preg_replace('/{{test_result}}/', $test_result, self::$mail_body);
		self::$mail_body = preg_replace('/{{total_cases}}/', $passed_cases + $failed_cases, self::$mail_body);
		self::$mail_body = preg_replace('/{{passed_cases}}/', $passed_cases, self::$mail_body);
		self::$mail_body = preg_replace('/{{failed_cases}}/', $failed_cases, self::$mail_body);
		self::$mail_body = preg_replace('/{{server_host}}/', LF\lb_read_system('www_domain'), self::$mail_body);
		self::$mail_body = preg_replace('/{{report_id}}/', $report_id, self::$mail_body);
		$system = LF\M('V2.System')->get_one_row(); // 邮件配置在system表中
		foreach (explode(',', $system['mail_list']) as $mail) {
			$mail = trim($mail);
			if (!$mail) {
				continue;
			}
			// 将mail_list中的邮箱单个依次发送
			// 注意：不能使用批量发送功能，否则中途失败则会导致后续无法继续发送
			try {
				$smtp = new Extension_Smtp();
				$smtp->setServer($system['smtp_server'], $system['smtp_user'], $system['smtp_password'], $system['smtp_port'], $system['smtp_ssl'] ? true : false);
				$smtp->setFrom($system['smtp_user']);
				$smtp->setReceiver($mail);
				$smtp->setMail($title, self::$mail_body);
				$smtp->sendMail();
			} catch (Exception $e) {
				// 异常不做额外处理
			}
		}
	}
}
