<?php
return array(

	'V2.Page.Guest.Config' => '/config',
	'V2.Page.Guest.403' => '/403',
	'V2.Page.Guest.404' => '/404',
	'V2.Page.Guest.Browser' => '/browser',
	'V2.Page.Guest.Check' => '/check',
	'V2.Page.Guest.Phpinfo' => '/phpinfo',
	'V2.Page.Guest.Logout' => '/logout',
	'V2.Page.Guest.Index' => '/v2/g/.*',
	'V2.Page.User.Index' => '(|/|/v2/u|/v2/u/.*)',

	'V2.Api.Etc.Environments' => '/v2/get/etc/environments',

	'V2.Api.Demo.Cookie' => '/demo/cookie',
	'V2.Api.Demo.Json' => '/demo/json',
	'V2.Api.Demo.Xml' => '/demo/xml',
	'V2.Api.Demo.Get' => '/demo/get',
	'V2.Api.Demo.Server' => '/demo/server',

	'V2.Api.Request.Request' => '/v2/get/api/request',
	'V2.Api.Auth.Account' => '/v2/get/api/auth/account',
	'V2.Api.Auth.Teambition' => '/v2/get/api/auth/teambition',
	'V2.Api.Third.Teambition' => '/v2/get/api/third/teambition',

	'V2.Api.Test.Add' => '/v2/put/api/test',
	'V2.Api.Test.Tasks.Tasks' => '/v2/get/api/tasks',
	'V2.Api.Test.Reports.Reports' => '/v2/get/api/reports',
	'V2.Api.Test.Spaces.Spaces' => '/v2/get/api/spaces',
	'V2.Api.Test.Environments.Environments' => '/v2/get/api/environments',
	'V2.Api.Test.Applications.Applications' => '/v2/get/api/applications',
	'V2.Api.Test.Users.Users' => '/v2/get/api/users',
	'V2.Api.Test.Logs.Logs' => '/v2/get/api/logs',
	'V2.Api.Test.Step.Request.Request' => '/v2/get/api/test/step/request/{$request_id}',
	'V2.Api.Test.Step.Check.Check' => '/v2/get/api/test/step/check/check',
	'V2.Api.Test.Step.Data.Data' => '/v2/get/api/test/step/data/data',

	'V2.Api.System.System' => '/v2/get/api/system/{$system_id}',
	'V2.Api.System.Add' => '/v2/put/api/system', // TO DO
	'V2.Api.System.Update' => '/v2/post/api/system/{$system_id}', // TO DO
	'V2.Api.System.Remove' => '/v2/delete/api/system/{$system_id}', // TO DO
	'V2.Api.System.Conf.Conf' => '/v2/get/api/system/{$system_id}/conf',
	'V2.Api.System.Conf.Update' => '/v2/post/api/system/{$system_id}/conf',
	'V2.Api.System.Mail.Update' => '/v2/post/api/system/{$system_id}/mail',
	'V2.Api.System.Owner.Update' => '/v2/post/api/system/{$system_id}/owner',

	'V2.Api.Space.Space' => '/v2/get/api/space/{$space_id}',
	'V2.Api.Space.Add' => '/v2/put/api/space',
	'V2.Api.Space.Update' => '/v2/post/api/space/{$space_id}',
	'V2.Api.Space.Remove' => '/v2/delete/api/space/{$space_id}',
	'V2.Api.Space.Owner.Update' => '/v2/post/api/space/{$space_id}/owner',
	'V2.Api.Space.Modules.Modules' => '/v2/get/api/space/{$space_id}/modules',
	'V2.Api.Space.Items.Items' => '/v2/get/api/space/{$space_id}/items',

	'V2.Api.Module.Module' => '/v2/get/api/module/{$module_id}', // TO DO
	'V2.Api.Module.Add' => '/v2/put/api/module',
	'V2.Api.Module.Update' => '/v2/post/api/module/{$module_id}',
	'V2.Api.Module.Remove' => '/v2/delete/api/module/{$module_id}',
	'V2.Api.Module.Owner.Update' => '/v2/post/api/module/{$module_id}/owner',
	'V2.Api.Module.Statistics.Statistics' => '/v2/get/api/module/{$module_id}/statistics',

	'V2.Api.Item.Item' => '/v2/get/api/item/{$item_id}',
	'V2.Api.Item.Add' => '/v2/put/api/item',
	'V2.Api.Item.Update' => '/v2/post/api/item/{$item_id}',
	'V2.Api.Item.Remove' => '/v2/delete/api/item/{$item_id}',
	'V2.Api.Item.Owner.Owner' => '/v2/get/api/item/{$item_id}/owner',
	'V2.Api.Item.Owner.Update' => '/v2/post/api/item/{$item_id}/owner',
	'V2.Api.Item.Module.Update' => '/v2/post/api/item/{$item_id}/module',
	'V2.Api.Item.Cases.Cases' => '/v2/get/api/item/{$item_id}/cases',

	'V2.Api.Case.Case' => '/v2/get/api/case/{$case_id}',
	'V2.Api.Case.Add' => '/v2/put/api/case',
	'V2.Api.Case.Update' => '/v2/post/api/case/{$case_id}',
	'V2.Api.Case.Remove' => '/v2/delete/api/case/{$case_id}',
	'V2.Api.Case.Level.Update' => '/v2/post/api/case/{$case_id}/level',
	'V2.Api.Case.Steps.Steps' => '/v2/get/api/case/{$case_id}/steps',
	'V2.Api.Case.Steps.Remove' => '/v2/delete/api/case/{$case_id}/steps',

	'V2.Api.Step.Step' => '/v2/get/api/step/{$step_id}', // TO DO
	'V2.Api.Step.Add' => '/v2/put/api/step',
	'V2.Api.Step.Update' => '/v2/post/api/step/{$step_id}', // TO DO
	'V2.Api.Step.Remove' => '/v2/delete/api/step/{$step_id}', // TO DO

	'V2.Api.Environment.Environment' => '/v2/get/api/environment/{$environment_id}',
	'V2.Api.Environment.Add' => '/v2/put/api/environment',
	'V2.Api.Environment.Update' => '/v2/post/api/environment/{$environment_id}',
	'V2.Api.Environment.Remove' => '/v2/delete/api/environment/{$environment_id}',
	'V2.Api.Environment.Params.Params' => '/v2/get/api/environment/{$environment_id}/params',
	'V2.Api.Environment.Data.Data' => '/v2/get/api/environment/{$environment_id}/data',

	'V2.Api.Param.Param' => '/v2/get/api/param/{$param_id}',
	'V2.Api.Param.Add' => '/v2/put/api/param',
	'V2.Api.Param.Update' => '/v2/post/api/param/{$param_id}',
	'V2.Api.Param.Remove' => '/v2/delete/api/param/{$param_id}',

	'V2.Api.Data.Data' => '/v2/get/api/data/{$data_id}',
	'V2.Api.Data.Add' => '/v2/put/api/data',
	'V2.Api.Data.Update' => '/v2/post/api/data/{$data_id}',
	'V2.Api.Data.Remove' => '/v2/delete/api/data/{$data_id}',

	'V2.Api.Task.Task' => '/v2/get/api/task/{$task_id}',
	'V2.Api.Task.Add' => '/v2/put/api/task',
	'V2.Api.Task.Update' => '/v2/post/api/task/{$task_id}',
	'V2.Api.Task.Remove' => '/v2/delete/api/task/{$task_id}',
	'V2.Api.Task.Suspension.Update' => '/v2/post/api/task/{$task_id}/suspension',

	'V2.Api.Job.Add' => '/v2/put/api/job',
	'V2.Api.Job.Remove' => '/v2/delete/api/job/_task/{$task_id}',

	'V2.Api.Report.Report' => '/v2/get/api/report/{$report_id}',
	'V2.Api.Report.Add' => '/v2/put/api/report', // TO DO
	'V2.Api.Report.Update' => '/v2/post/api/report/{$report_id}', // TO DO
	'V2.Api.Report.Remove' => '/v2/delete/api/report/{$report_id}', // TO DO
	'V2.Api.Report.Records.Records' => '/v2/get/api/report/{$report_id}/records',

	'V2.Api.Application.Application' => '/v2/get/api/application/{$application_id}',
	'V2.Api.Application.Add' => '/v2/put/api/application', // TO DO
	'V2.Api.Application.Update' => '/v2/post/api/application/{$application_id}', // TO DO
	'V2.Api.Application.Remove' => '/v2/delete/api/application/{$application_id}', // TO DO

	'V2.Api.User.User' => '/v2/get/api/user/{$user_id}',
	'V2.Api.User.Add' => '/v2/put/api/user',
	'V2.Api.User.Update' => '/v2/post/api/user/{$user_id}',
	'V2.Api.User.Remove' => '/v2/delete/api/user/{$user_id}',
	'V2.Api.User.Password.Update' => '/v2/post/api/user/{$user_id}/password',
);
