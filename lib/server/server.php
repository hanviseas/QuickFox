<?php

use Lazybug\Framework as LF;

/**
 * 服务端主服务
 */
class Server_Server
{

    /**
     * 构造函数
     */
    public function __construct()
    {
        echo "\n";
        echo "**************************************************\n";
        echo " Hello Quickfox !\n";
        echo " http://www.quickfox.cn\n";
        echo "**************************************************\n";
        echo "\n";
    }

    public function start()
    {
        $test = new Server_Test();
        try {
            $this->clear_job();
        } catch (PDOException $e) {
            Server_Log::output('Error', 'MySQL server has gone away, please try again later');
            exit();
        }
        $reset_flag = false; // 数据库连接异常重置标志
        while (true) {
            sleep(1);
            try {
                LF\Driver_Db_Factory::get_db_item();
                if ($reset_flag) { // 恢复连接清空任务池
                    $reset_flag = false;
                    Server_Log::output('Info', 'MySQL server has reconnected');
                    $this->clear_job();
                }
                $this->add_job();
                if (!$job = $this->fetch_job()) {
                    continue;
                }
                $test->run($job);
                $this->clear_job($job['guid']);
                Server_Log::output('Info', 'Memory Usage {' . memory_get_usage() . '}');
            } catch (PDOException $e) {
                $reset_flag = true;
                LF\Driver_Db_Factory::close_db_item();
                Server_Log::output('Error', 'MySQL connect timeout, waiting to reconnect...');
                sleep(5);
            } catch (Exception $e) {
                Server_Log::output('Error', $e);
            }
        }
    }

    /**
     * 添加作业
     */
    private function add_job()
    {
        $tasks = LF\M('V2.Task')->get_by_date(); // 取得所有到达设定时间但未运行过的任务
        foreach ($tasks as $task) {
            if (preg_match('/^[0-9]{2}-[0-9]{2}$/', $task['runtime'])) {
                if (LF\M('V2.Task.Job')->is_task_exists((int) $task['id'])) {  // 相同任务在作业表中同一时间只能存在一个
                    Server_Log::output('Info', 'Task {' . $task['id'] . '} conflicted, waiting...');
                    continue;
                }
                $guid = (int) $task['id'] . 'G' . date('YmdHis') . rand(1000, 9999);
                LF\M('V2.Task.Job')->add(array( // 添加任务到作业池
                    'task_id' => (int) $task['id'],
                    'guid' => $guid
                ));
                LF\M('V2.Task')->set_my_lasttime((int) $task['id']); // 更新最后运行时间
                Server_Log::output('Info', 'Job {' . $guid . '} add to queue');
            }
        }
    }

    /**
     * 获取作业
     */
    private function fetch_job()
    {
        $job = LF\M('V2.Task.Job')->get_one_available(); // 获取一个可运行作业
        if ($job) {
            LF\M('V2.Task.Job')->set_my_performance((int) $job['task_id']);  // 设置运行标志以使后续查询不再出现
        }
        return $job;
    }

    /**
     * 清除作业
     * 
     * @param int $guid GUID
     */
    private function clear_job($guid = '')
    {
        if ($guid) {  // 指定GUID清除，未指定时全部清空
            LF\M('V2.Task.Job')->remove_by_guid($guid);
            Server_Log::output('Info', 'Job {' . $guid . '} remove from queue');
        } else {
            LF\M('V2.Task.Job')->clear_all();
            Server_Log::output('Info', 'Job Queue is been cleaned up');
        }
    }
}
