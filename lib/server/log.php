<?php

/**
 * 服务端日志
 */
class Server_Log
{

    /**
     * 输出日志
     * 
     * @param string $type 日志类型
     * @param string $message 日志消息
     */
    static public function output($type, $message)
    {
        echo '[' . date('Y-m-d H:i:s') . '][' . $type . '] ' . $message . "\n";
    }
}
