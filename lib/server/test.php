<?php

use Lazybug\Framework as LF;

/**
 * 服务端测试执行
 */
class Server_Test
{
    /**
     * 作业信息
     */
    private $job = array();

    /**
     * 任务信息
     */
    private $task = array();

    /**
     * 报告ID
     */
    private $report_id = 0;

    /**
     * 分表名
     */
    private $submeter = '';

    /**
     * 运行测试
     * 
     * @param int $job 作业信息
     */
    public function run($job)
    {
        $this->job = $job;
        $this->task = LF\M('V2.Task')->get_by_id((int) $job['task_id']);
        if (!$this->task) {
            Server_Log::output('Error', 'Task {' . $job['task_id'] . '} does not exist');
            return;
        }
        $this->submeter = date('Ym');
        $this->report_id = $this->create_report();
        if (!$this->report_id) {
            return;
        }
        $this->test_task();
        $this->reset_test();
    }

    /**
     * 重置测试
     */
    private function reset_test()
    {
        $this->job = array();
        $this->task = array();
        $this->report_id = 0;
        $this->submeter = '';
    }

    /**
     * 创建报告
     */
    private function create_report()
    {
        LF\M('V2.Report')->add(array(
            'task_id' => (int) $this->job['task_id'],
            'guid' => $this->job['guid'],
            'submeter' => $this->submeter,
            'runtime' => date('Y-m-d H:i:s', time())
        ));
        try { // 创建分表
            $table_name = LF\M('V2.Report.Record')->get_table_name() . '_' . $this->submeter;
            $db_connect = LF\Driver_Db_Factory::get_db_item();
            $db_connect->query("CREATE TABLE IF NOT EXISTS `{$table_name}` (
				`id` int(10) NOT NULL AUTO_INCREMENT,`report_id` int(10) NOT NULL,
  				`item_id` int(10) NOT NULL DEFAULT '0',`case_id` int(10) NOT NULL DEFAULT '0',
                `step_id` tinyint(1) NOT NULL DEFAULT '0',`step_type` varchar(30) DEFAULT NULL,
  				`name` varchar(100) DEFAULT NULL,`content` text,
  				`value_1` text,`value_2` text,`value_3` text,`value_4` text,`value_5` text,
                `value_6` text,`value_7` text,`value_8` text,`value_9` text,`value_10` text,
  				`pass` tinyint(1) NOT NULL DEFAULT '1',
				PRIMARY KEY (`id`),KEY `report_id` (`report_id`),KEY `item_id` (`item_id`),KEY `case_id` (`case_id`)
			) ENGINE=InnoDB DEFAULT CHARSET=utf8;");
        } catch (Exception $e) {
            Server_Log::output('Error', 'Table {' . $table_name . '} creation failed');
            return 0;
        }
        $report = LF\M('V2.Report')->get_by_guid($this->job['guid']);
        if (!(int) $report['id']) {
            Server_Log::output('Error', 'Report {' . $this->job['guid'] . '} creation failed');
            return 0;
        }
        return (int) $report['id'];
    }

    /**
     * 测试任务
     */
    private function test_task()
    {
        Server_Log::output('Info', 'Job {' . $this->job['guid'] . '} was dispatched to run pool');
        $preposition_cmds = explode("\n", $this->task['preposition_script']);
        $preposition_output = array(); // 前置脚本输出
        foreach ($preposition_cmds as $cmd) {
            try {
                if (trim($cmd) === '') {
                    continue;
                }
                exec($cmd . ' 2>&1', $preposition_output);
            } catch (Exception $e) { }
        }
        LF\M('V2.Report')->update_preposition_output($this->report_id, implode("\n", $preposition_output));
        if ((int) $this->task['space_id'] !== 0) { // 0代表默认空间
            $space = LF\M('V2.Space')->get_by_id((int) $this->task['space_id']);
            if (!$space) {
                Server_Log::output('Error', 'Space {' . (int) $this->task['space_id'] . '} does not exist');
                return;
            }
        }
        if ((int) $this->task['module_id'] === -1) { // 测试全部模块
            $items = LF\M('V2.Space.Item')->get_by_space((int) $this->task['space_id']);
            $item_num = LF\M('V2.Space.Item')->get_total_by_space((int) $this->task['space_id']);
        } else { // 测试特定模块
            $items = LF\M('V2.Space.Item')->get_by_module((int) $this->task['module_id']);
            $item_num = LF\M('V2.Space.Item')->get_total_by_module((int) $this->task['module_id']);
        }
        LF\M('V2.Task.Job')->set_my_total_value($this->job['guid'], $item_num); // 写入总接口数
        Server_Log::output('Info', 'Job {' . $this->job['guid'] . '} include {' . $item_num . '} interface');
        $this->test_item($items);
        $postposition_cmds = explode("\n", $this->task['postposition_script']);
        $postposition_output = array(); // 后置脚本输出
        foreach ($postposition_cmds as $cmd) {
            try {
                if (trim($cmd) === '') {
                    continue;
                }
                exec($cmd . ' 2>&1',  $postposition_output);
            } catch (Exception $e) { }
        }
        LF\M('V2.Report')->update_postposition_output($this->report_id, implode("\n", $postposition_output));
        Server_Log::output('Info', 'Job {' . $this->job['guid'] . '} execution completed');
        Server_Mail::send($this->task['name'], $this->report_id);
    }

    /**
     * 测试接口
     * 
     * @param array $items 接口列表
     */
    private function test_item($items)
    {
        foreach ($items as $item) {
            if (!LF\M('V2.Task.Job')->is_guid_exists($this->job['guid'])) {
                Server_Log::output('Info', 'Job {' . $this->job['guid'] . '} stoped by manual');
                return;
            }
            Server_Log::output('Info', 'Interface {' . $item['id'] . '} was dispatched to run pool');
            LF\M('V2.Task.Job')->increase_my_current_value($this->job['guid']); // 当前已调用的接口数+1，用于反馈任务进度百分比
            $model = LF\M('V2.Report.Record');
            $model->set_table_name($this->submeter);
            $model->add(array(
                'report_id' => $this->report_id,
                'item_id' => (int) $item['id'],
                'name' => $item['name']
            ));
            $cases = LF\M('V2.Space.Case')->get_by_item_and_level((int) $item['id'], (int) $this->task['level']);
            $this->test_case($cases);
        }
    }

    /**
     * 测试用例
     * 
     * @param array $cases 用例列表
     */
    private function test_case($cases)
    {
        foreach ($cases as $case) {
            Server_Log::output('Info', 'Case {' . $case['id'] . '} was dispatched to run pool');
            $model = LF\M('V2.Report.Record');
            $model->set_table_name($this->submeter); // 分表存储
            $model->add(array(
                'report_id' => $this->report_id,
                'item_id' => (int) $case['item_id'],
                'case_id' => (int) $case['id'],
                'name' => $case['name']
            ));
            $steps = LF\M('V2.Space.Step')->get_by_case((int) $case['id']);
            $this->test_step($steps, (int) $case['item_id'], (int) $case['id']);
        }
    }

    /**
     * 测试步骤
     * 
     * @param array $steps 步骤列表
     * @param int $item_id 接口ID
     * @param int $case_id 用例ID
     */
    private function test_step($steps, $item_id, $case_id)
    {
        $test = new Controller_V2_Api_Test_Test();
        $record_model = LF\M('V2.Report.Record');
        $record_model->set_table_name($this->submeter); // 分表存储
        $response = '';
        foreach ($steps as $step) {
            if ($step['type'] === 'request') {
                try {
                    $result = $test->exec_request_step($step['value'], $this->task['environment_id'],  $step['preposition_fliter'], $step['postposition_fliter'], $response,  'server-' . $this->job['guid']);
                    $response = $result['response_body'];
                    $record_model->add(array(
                        'report_id' => $this->report_id,
                        'item_id' => $item_id,
                        'case_id' => $case_id,
                        'step_id' => 1,
                        'step_type' => 'request',
                        'name' => $step['name'],
                        'content' => strlen($result['response_body']) > 50000 ? '系统错误: 内容长度大于50000个字符' : $result['response_body'],
                        'value_1' => $result['request_url'],
                        'value_2' => $result['request_param'],
                        'value_3' => $result['request_header'],
                        'value_4' => $result['response_header'],
                        'value_5' => $result['response_code'],
                        'value_6' => $result['response_time']
                    ));
                } catch (Exception $e) {
                    Server_Log::output('Error', 'Step ' . $step['name'] . ' execution failed');
                }
            } else if ($step['type'] === 'data') {
                try {
                    $result = $test->exec_data_step($step['command'], $step['value'], $this->task['environment_id'],  $step['preposition_fliter'], $response);
                    $response = $result['data'];
                    $record_model->add(array(
                        'report_id' => $this->report_id,
                        'item_id' => $item_id,
                        'case_id' =>  $case_id,
                        'step_id' => 1,
                        'step_type' => 'data',
                        'name' => $step['name'],
                        'content' => $result['data'],
                        'value_1' => $result['query']
                    ));
                } catch (Exception $e) {
                    Server_Log::output('Error', 'Step ' . $step['name'] . ' execution failed');
                }
            } else if ($step['type'] === 'check') {
                try {
                    $result = $test->exec_check_step($step['command'], $step['value'], $this->task['environment_id'],  $step['preposition_fliter'], $response);
                    // 当检查成功或失败后，将对应校验结果+1，用于生成最终报告
                    if ($result['result'] === 'FAIL') {
                        $is_pass = 0;
                        LF\M('V2.Report')->increase_my_fail_value($this->report_id);
                    } else {
                        $is_pass = 1;
                        LF\M('V2.Report')->increase_my_pass_value($this->report_id);
                    }
                    // 添加报告记录
                    $record_model->add(array(
                        'report_id' => $this->report_id,
                        'item_id' => $item_id,
                        'case_id' => $case_id,
                        'step_id' => 1,
                        'step_type' => 'check',
                        'name' => $step['name'],
                        'content' => $result['result'],
                        'value_1' => $result['source'],
                        'value_2' => $result['target'],
                        'pass' => $is_pass
                    ));
                    // 更新上层记录
                    if (!$is_pass) {
                        $record_model->modify(array(
                            'report_id' => $this->report_id,
                            'item_id' => $item_id,
                            'case_id' => 0,
                            'step_id' => 0,
                        ), array(
                            'pass' => $is_pass
                        ));
                        $record_model->modify(array(
                            'report_id' => $this->report_id,
                            'item_id' => $item_id,
                            'case_id' => $case_id,
                            'step_id' => 0,
                        ), array(
                            'pass' => $is_pass
                        ));
                    }
                } catch (Exception $e) {
                    Server_Log::output('Error', 'Step ' . $step['name'] . ' execution failed');
                }
            } else if ($step['type'] === 'time') {
                try {
                    usleep((int) $step['value'] * 1000);
                    // 添加报告记录
                    $record_model->add(array(
                        'report_id' => $this->report_id,
                        'item_id' => $item_id,
                        'case_id' => $case_id,
                        'step_id' => 1,
                        'step_type' => 'time',
                        'name' => $step['name'],
                        'content' => $step['value'],
                    ));
                } catch (Exception $e) {
                    Server_Log::output('Error', 'Step ' . $step['name'] . ' execution failed');
                }
            }
        }
    }
}
