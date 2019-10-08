
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `quickfox`
--

-- --------------------------------------------------------

--
-- 表的结构 `quickfox_application`
--

CREATE TABLE `quickfox_application` (
  `id` int(10) NOT NULL,
  `name` varchar(50) NOT NULL,
  `secret` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `quickfox_case`
--

CREATE TABLE `quickfox_case` (
  `id` int(10) NOT NULL,
  `item_id` int(10) NOT NULL,
  `module_id` int(10) NOT NULL DEFAULT '0',
  `space_id` int(10) NOT NULL DEFAULT '0',
  `name` varchar(30) NOT NULL,
  `level` tinyint(1) NOT NULL DEFAULT '3',
  `stype` varchar(10) NOT NULL DEFAULT 'GET',
  `ctype` varchar(35) NOT NULL DEFAULT 'application/x-www-form-urlencoded',
  `param` text,
  `header` text,
  `expectation` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- 转存表中的数据 `quickfox_case`
--

INSERT INTO `quickfox_case` (`id`, `item_id`, `module_id`, `space_id`, `name`, `level`, `stype`, `ctype`, `param`, `header`, `expectation`) VALUES
(1, 1, 0, 0, 'JSON演示用例', 3, 'GET', 'application/x-www-form-urlencoded', '{}', '{}', NULL),
(2, 2, 0, 0, 'XML演示用例', 3, 'GET', 'application/x-www-form-urlencoded', '{}', '{}', NULL),
(3, 3, 0, 0, 'SQL查询演示用例', 3, 'GET', 'application/x-www-form-urlencoded', '{}', '{}', NULL);

-- --------------------------------------------------------

--
-- 表的结构 `quickfox_data`
--

CREATE TABLE `quickfox_data` (
  `id` int(10) NOT NULL,
  `environment_id` int(10) NOT NULL,
  `source` varchar(20) NOT NULL,
  `keyword` varchar(30) NOT NULL,
  `value` text,
  `comment` varchar(30) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- 转存表中的数据 `quickfox_data`
--

INSERT INTO `quickfox_data` (`id`, `environment_id`, `source`, `keyword`, `value`, `comment`) VALUES
(1, 0, 'mysql_pdo', 'localdb', 'server=localhost;user=demo;password=demo;database=demo;charset=utf8', NULL);

-- --------------------------------------------------------

--
-- 表的结构 `quickfox_environment`
--

CREATE TABLE `quickfox_environment` (
  `id` int(10) NOT NULL,
  `name` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `quickfox_field`
--

CREATE TABLE `quickfox_field` (
  `item_id` int(10) NOT NULL,
  `param_name` text NOT NULL,
  `param_value` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `quickfox_item`
--

CREATE TABLE `quickfox_item` (
  `id` int(10) NOT NULL,
  `module_id` int(10) NOT NULL DEFAULT '0',
  `space_id` int(10) NOT NULL DEFAULT '0',
  `owner_id` int(10) NOT NULL DEFAULT '0',
  `name` varchar(30) NOT NULL,
  `url` text,
  `comment` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- 转存表中的数据 `quickfox_item`
--

INSERT INTO `quickfox_item` (`id`, `module_id`, `space_id`, `owner_id`, `name`, `url`, `comment`) VALUES
(1, 0, 0, 0, 'JSON演示', 'http://${param:domain}/index.php/demo/json', NULL),
(2, 0, 0, 0, 'XML演示', 'http://${param:domain}/index.php/demo/xml', NULL),
(3, 0, 0, 0, 'SQL查询演示', 'http://${param:domain}/index.php/demo/get?get=${extractor:regexp:,([\\w]+):1:1;}', NULL);

-- --------------------------------------------------------

--
-- 表的结构 `quickfox_job`
--

CREATE TABLE `quickfox_job` (
  `task_id` int(10) NOT NULL,
  `guid` varchar(50) CHARACTER SET utf16 NOT NULL,
  `total` int(10) NOT NULL DEFAULT '0',
  `current` int(10) NOT NULL DEFAULT '0',
  `performance` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `quickfox_log`
--

CREATE TABLE `quickfox_log` (
  `id` int(10) NOT NULL,
  `source` varchar(20) NOT NULL,
  `operator` int(10) NOT NULL,
  `operator_name` varchar(50) DEFAULT NULL,
  `action` text NOT NULL,
  `time` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `quickfox_module`
--

CREATE TABLE `quickfox_module` (
  `id` int(10) NOT NULL,
  `space_id` int(10) NOT NULL DEFAULT '0',
  `owner_id` int(10) NOT NULL DEFAULT '0',
  `name` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `quickfox_param`
--

CREATE TABLE `quickfox_param` (
  `id` int(10) NOT NULL,
  `environment_id` int(10) NOT NULL,
  `keyword` varchar(30) NOT NULL,
  `value` text,
  `comment` varchar(30) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- 转存表中的数据 `quickfox_param`
--

INSERT INTO `quickfox_param` (`id`, `environment_id`, `keyword`, `value`, `comment`) VALUES
(1, 0, 'domain', 'www.quickfox.cn', NULL);

-- --------------------------------------------------------

--
-- 表的结构 `quickfox_record`
--

CREATE TABLE `quickfox_record` (
  `id` int(10) NOT NULL,
  `report_id` int(10) NOT NULL,
  `item_id` int(10) NOT NULL DEFAULT '0',
  `case_id` int(10) NOT NULL DEFAULT '0',
  `step_id` tinyint(1) NOT NULL DEFAULT '0',
  `step_type` varchar(30) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `content` text,
  `value_1` text,
  `value_2` text,
  `value_3` text,
  `value_4` text,
  `value_5` text,
  `value_6` text,
  `value_7` text,
  `value_8` text,
  `value_9` text,
  `value_10` text,
  `pass` tinyint(1) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `quickfox_report`
--

CREATE TABLE `quickfox_report` (
  `id` int(10) NOT NULL,
  `task_id` int(10) NOT NULL,
  `guid` varchar(50) NOT NULL,
  `submeter` varchar(6) NOT NULL,
  `runtime` datetime NOT NULL,
  `preposition_output` text,
  `postposition_output` text,
  `pass` int(10) NOT NULL DEFAULT '0',
  `fail` int(10) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `quickfox_space`
--

CREATE TABLE `quickfox_space` (
  `id` int(10) NOT NULL,
  `owner_id` int(10) NOT NULL DEFAULT '0',
  `name` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `quickfox_step`
--

CREATE TABLE `quickfox_step` (
  `case_id` int(10) NOT NULL,
  `name` varchar(100) NOT NULL,
  `type` varchar(10) NOT NULL DEFAULT 'GET',
  `command` varchar(50) NOT NULL DEFAULT 'default',
  `preposition_fliter` varchar(100) DEFAULT NULL,
  `postposition_fliter` varchar(100) DEFAULT NULL,
  `value` text,
  `sequence` int(10) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- 转存表中的数据 `quickfox_step`
--

INSERT INTO `quickfox_step` (`case_id`, `name`, `type`, `command`, `preposition_fliter`, `postposition_fliter`, `value`, `sequence`) VALUES
(1, '检查演示结果', 'check', 'all', '${extractor:json:Name;}', '', 'LazyBug', 2),
(1, '调用: JSON演示->JSON演示用例', 'request', 'self', '', '', '1', 1),
(2, '检查演示结果', 'check', 'all', '${extractor:xml:/User/Name;}', '', 'LazyBug', 2),
(2, '调用: XML演示->XML演示用例', 'request', 'self', '', '', '2', 1),
(3, '调用: 存储查询演示->SQL查询演示用例', 'request', 'self', '', '', '3', 2),
(3, '查询用户表', 'data', 'config:localdb', '', '', 'select * from user where id=1', 1);

-- --------------------------------------------------------

--
-- 表的结构 `quickfox_system`
--

CREATE TABLE `quickfox_system` (
  `smtp_server` varchar(100) DEFAULT NULL,
  `smtp_port` int(10) DEFAULT NULL,
  `smtp_user` varchar(50) DEFAULT NULL,
  `smtp_password` varchar(50) DEFAULT NULL,
  `smtp_ssl` tinyint(1) DEFAULT '0',
  `smtp_default_port` tinyint(1) DEFAULT '1',
  `mail_list` text,
  `default_owner` int(10) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- 转存表中的数据 `quickfox_system`
--

INSERT INTO `quickfox_system` (`smtp_server`, `smtp_port`, `smtp_user`, `smtp_password`, `smtp_ssl`, `smtp_default_port`, `mail_list`, `default_owner`) VALUES
('127.0.0.1', 25, NULL, NULL, 0, 1, NULL, 0);

-- --------------------------------------------------------

--
-- 表的结构 `quickfox_task`
--

CREATE TABLE `quickfox_task` (
  `id` int(10) NOT NULL,
  `name` varchar(30) NOT NULL,
  `environment_id` int(10) NOT NULL DEFAULT '0',
  `space_id` int(10) NOT NULL,
  `module_id` int(10) NOT NULL,
  `level` tinyint(1) NOT NULL,
  `runtime` text NOT NULL,
  `preposition_script` text,
  `postposition_script` text,
  `suspension` tinyint(1) NOT NULL DEFAULT '0',
  `lasttime` datetime NOT NULL DEFAULT '1900-01-01 00:00:00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- 转存表中的数据 `quickfox_task`
--

INSERT INTO `quickfox_task` (`id`, `name`, `environment_id`, `space_id`, `module_id`, `level`, `runtime`, `preposition_script`, `postposition_script`, `suspension`, `lasttime`) VALUES
(1, '示例任务', 0, 0, -1, 3, '/-/', '', '', 0, '1900-01-01 00:00:00');

-- --------------------------------------------------------

--
-- 表的结构 `quickfox_temp`
--

CREATE TABLE `quickfox_temp` (
  `key` varchar(20) NOT NULL,
  `case_id` int(10) DEFAULT '0',
  `name` varchar(20) NOT NULL,
  `value` text,
  `timestamp` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `quickfox_third_teambition`
--

CREATE TABLE `quickfox_third_teambition` (
  `user_id` int(10) NOT NULL,
  `third_id` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `quickfox_user`
--

CREATE TABLE `quickfox_user` (
  `id` int(10) NOT NULL,
  `name` varchar(50) NOT NULL,
  `card` varchar(15) NOT NULL,
  `passwd` varchar(32) NOT NULL,
  `role` varchar(30) NOT NULL,
  `avatar` text NOT NULL,
  `email` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- 转存表中的数据 `quickfox_user`
--

INSERT INTO `quickfox_user` (`id`, `name`, `card`, `passwd`, `role`, `avatar`, `email`) VALUES
(1, 'admin', '管理员', 'f6fdffe48c908deb0f4c3bd36c032e72', 'admin', '/static/img/v2/public/default-avatar.png', ''),
(2, 'qa', '测试工程师', '6b99135bdf2a2939064e701b5663549c', 'editor', '/static/img/v2/public/default-avatar.png', ''),
(3, 'guest', '访客', '2b45324a5a9ccb76249477b23dcebcec', 'normal', '/static/img/v2/public/default-avatar.png', '');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `quickfox_application`
--
ALTER TABLE `quickfox_application`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `quickfox_case`
--
ALTER TABLE `quickfox_case`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `quickfox_data`
--
ALTER TABLE `quickfox_data`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `quickfox_environment`
--
ALTER TABLE `quickfox_environment`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `quickfox_item`
--
ALTER TABLE `quickfox_item`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `quickfox_log`
--
ALTER TABLE `quickfox_log`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `quickfox_module`
--
ALTER TABLE `quickfox_module`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `quickfox_param`
--
ALTER TABLE `quickfox_param`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `quickfox_record`
--
ALTER TABLE `quickfox_record`
  ADD PRIMARY KEY (`id`),
  ADD KEY `item_id` (`item_id`),
  ADD KEY `case_id` (`case_id`),
  ADD KEY `report_id` (`report_id`);

--
-- Indexes for table `quickfox_report`
--
ALTER TABLE `quickfox_report`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `quickfox_space`
--
ALTER TABLE `quickfox_space`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `quickfox_task`
--
ALTER TABLE `quickfox_task`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `quickfox_user`
--
ALTER TABLE `quickfox_user`
  ADD PRIMARY KEY (`id`);

--
-- 在导出的表使用AUTO_INCREMENT
--

--
-- 使用表AUTO_INCREMENT `quickfox_application`
--
ALTER TABLE `quickfox_application`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT;
--
-- 使用表AUTO_INCREMENT `quickfox_case`
--
ALTER TABLE `quickfox_case`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- 使用表AUTO_INCREMENT `quickfox_data`
--
ALTER TABLE `quickfox_data`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- 使用表AUTO_INCREMENT `quickfox_environment`
--
ALTER TABLE `quickfox_environment`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT;
--
-- 使用表AUTO_INCREMENT `quickfox_item`
--
ALTER TABLE `quickfox_item`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- 使用表AUTO_INCREMENT `quickfox_log`
--
ALTER TABLE `quickfox_log`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT;
--
-- 使用表AUTO_INCREMENT `quickfox_module`
--
ALTER TABLE `quickfox_module`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT;
--
-- 使用表AUTO_INCREMENT `quickfox_param`
--
ALTER TABLE `quickfox_param`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- 使用表AUTO_INCREMENT `quickfox_record`
--
ALTER TABLE `quickfox_record`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT;
--
-- 使用表AUTO_INCREMENT `quickfox_report`
--
ALTER TABLE `quickfox_report`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT;
--
-- 使用表AUTO_INCREMENT `quickfox_space`
--
ALTER TABLE `quickfox_space`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT;
--
-- 使用表AUTO_INCREMENT `quickfox_task`
--
ALTER TABLE `quickfox_task`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- 使用表AUTO_INCREMENT `quickfox_user`
--
ALTER TABLE `quickfox_user`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
