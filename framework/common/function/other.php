<?php

namespace Lazybug\Framework;

/**
 * 快捷模型
 *
 * @param string $name 模型名称
 * @return object $model 模型对象
 */
function M($name)
{
	// 命名空间处理
	$model = lb_parse_classname($name);
	$real_path = $model['classname'];
	if (lb_read_system('namespace_path')) {
		$real_path = preg_replace('/\\\\/', '.', preg_replace('/^\\\\/', '', $model['namespace'])) . $real_path;
	}
	// 模型存在时创建对象
	if (lb_require_lib('Model.' . $real_path)) {
		$model_class = $model['namespace'] . 'Model_' . lb_convert_quote_to_class($model['classname']);
		return new $model_class();
	}
}

/**
 * 快捷视图
 *
 * @param string $name 视图名称
 * @return object $view 视图对象
 */
function V($name)
{
	// 命名空间处理
	$view = lb_parse_classname($name);
	$real_path = $view['classname'];
	if (lb_read_system('namespace_path')) {
		$real_path = preg_replace('/\\\\/', '.', preg_replace('/^\\\\/', '', $view['namespace'])) . $real_path;
	}
	// 视图存在时创建对象
	if (lb_require_lib('View.' . $real_path)) {
		$view_class = $view['namespace'] . 'View_' . lb_convert_quote_to_class($view['classname']);
		return new $view_class();
	}
}

/**
 * 应用文件载入
 *
 * @param string $class 加载类名
 */
function lb_load_from_app($class)
{
	// 命名空间处理
	if (lb_read_system('namespace_path')) {
		$class = preg_replace('/\\\\/', '_', preg_replace('/^\\\\/', '', $class));
	} else {
		$class = preg_replace('/^\\\\/', '', substr($class, strripos($class, '\\')));
	}
	// 搜索应用库文件目录
	lb_require_lib(lb_convert_class_to_quote($class));
}

/**
 * 框架文件载入
 *
 * @param string $class 加载类名
 */
function lb_load_from_system($class)
{
	// 消除框架命名空间前缀
	$class = preg_replace("/^Lazybug\\\\Framework\\\\/", '', $class);
	// 搜索系统库文件目录
	lb_require_file(_LIB_PATH, lb_convert_class_to_quote(str_replace('/^Lb_/', '', $class)));
}
