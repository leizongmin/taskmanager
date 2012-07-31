Taskmanager
================

**taskmanager**是一个基于Node.js的任务管理器，方便统一管理运行的Node.js程序。


快速入门
================

1. 安装：`npm install taskmanager -g`
2. 新建一个工作目录：`mkdir mytask && cd mytask`
3. 初始化taskmanager配置：`taskmanager -init`
4. 配置后台管理密码：
    + 打开当前目录下的`config.json`文件
    + 执行`taskmanager -passwd <你的密码>`来获取加密后的密码字符串
    + 用此密码来替换配置文件中的`password`项
    + **注意**：由于配置密码不当会危及服务器安全，所以必须设置一个较强的密码，太简单的密码将不能启动taskmanager
5. 启动任务管理器：`taskmanager`
6. 打开页面http://127.0.0.1:8860 ，输入账户`admin`及密码登录
7. 点顶栏菜单中的`应用`，并在应用`test`行中点`启动`按钮
8. 点顶栏菜单中的`进程`，可看到进程`test`已在运行，点该行的`详细信息`可看到该进程相关信息
9. 在屏幕下方可显示该进程的控制台输出内容


命令行工具
==================

**taskmanager [option1] [option2] ...**

* 查看帮助信息：`-help` 或 `-h`
* 设置运行目录：`-path <目录>` 或 `-p <目录>`，若不指定运行目录，则使用当前目录。
* 在后台运行：`-service` 或 `-s`
* 日志记录器输出等级：`-logger <等级>` 或 `-l <等级>`，等级可选值为：`error`，`warn`，`info`，`log`，`debug`
* 获取加密的密码字符串：`-passwd <密码>`，用于设置配置文件中的密码项
* 停止当前目录下运行的taskmanager：`-stop`
* 在当前目录下初始化一个taskmanager项目：`-init`
* 显示taskmanager版本号：`-version` 或 `-v`


授权
=================

你可以在遵守**MIT Licence**的前提下随意使用并分发它。

```
Copyright (c) 2012 Lei Zongmin <leizongmin@gmail.com>
http://ucdok.com

The MIT License

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```