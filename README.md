Taskmanager
================

**taskmanager**是一个基于Node.js的任务管理器，方便统一管理运行的Node.js程序。


快速入门
================

* 安装：`npm install taskmanager -g`

* 新建一个工作目录：`mkdir mytask && cd mytask`

* 创建配置文件：`config.json`

```
{
  "port":           8860,
  "admin":          "admin",
  "password":       "3A:5B9AD333E3F867CB4666DB4702C315F0:FD",
  "loginFail":      5,
  "refuseTimeout":  60
}
```

> **port**：管理后台监听的端口
>
> **admin**：管理源账户
>
> **password**：管理密码，该加密字符串可通过以下方式获取到：执行命令`taskmanager -passwd 密码`
>
> **loginFail**：登录失败最多的尝试次数，超过该数量后会屏蔽该IP地址一段时间
>
> **refuseTimeout**：屏蔽的时间，单位为秒

* 创建一个数据目录：`mkdir data`

* 新建一个任务：新建文件`test.app.json`和文件`test.js`

**test.app.json**为应用配置文件，包括一下项：

> **name**：应用名称（必须）
>
> **main**：启动文件路径（必须）
>
> **type**：应用类型，`default`为创建一个普通进程（默认），`cluster`为创建多个cluster进程
>
> **log**：日志文件，如果不指定则不保存日志输出
>
> **cluster**：cluster进程数量，仅在`type=cluster`时有效
>
> **execPath**：Node命令路径，默认使用当前的Node版本，可在此处指定该应用需要的Node版本路径
>
>

示例：

```
{
  "name":   "test3",
  "main":   "data/test3.js",
  "type":   "default",
  "log":    "/tmp/logs/test3.log"
}
```

**test.js**为Node.js程序内容，比如：

```
setInterval(function () {
  console.log('hello!');
}, 1000);
```

* 启动任务管理器：`taskmanager`

* 打开页面http://127.0.0.1:8860，输入账户`admin`及密码`admin`登录

* 点顶栏菜单中的`应用`，并在应用`test`行中点`启动`按钮

* 点顶栏菜单中的`进程`，可看到进程`test`已在运行，点该行的`详细信息`可看到该进程相关信息

* 在屏幕下方可显示该进程的控制台输出内容
