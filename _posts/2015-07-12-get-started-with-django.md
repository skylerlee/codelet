---
layout: post
title: 开始使用Django
date: 2015-07-12 12:40:51 +0800
tags:
  - tutorial
  - python
---
很早就听说了Django框架，在众多的Python Web框架里，Django算是最全面、最稳定的一支了，很适合
用于网站的快速开发，今天就来学习一下。

以前我用Java写网站后台，总是觉得很不便捷，今天看了Django的文档，有一种眼前一亮的感觉，原来后台
还可以这样写，通过写正则路由就不用配置web.xml了，通过模板引擎就不用编写jsp了，自带有ORM、表单验证，
就不需要解决大量的jar包依赖问题了，可见使用Django会带来很大的便捷。

### Django 简介
Django是一个Python语言的Web开发框架，最初是被开发来用于管理劳伦斯出版集团旗下的一些以新闻内容
为主的网站的，即CMS（内容管理系统）软件。Django最大的优点就是快速开发、齐全和统一，Web开发中觉大
多数的常用功能Django都有支持，通过扩展包还可以得到更多功能支持，可谓是Web开发的利器。

### 安装 Django
安装非常简单，首先保证已经安装好了python环境，建议使用2.7的版本，然后保证已经装好了pip包管理器，
安装Django只需要一条命令`pip install Django`，等待安装结束后，输入`django-admin --version`
命令，看到输出版本号`1.8`或者类似的就证明安装成功了。

### 安装 Apache和mod_wsgi
值得注意的是Django只是一个Web开发框架，并不是一个Web服务器，虽然Django内置有一个小型Web服务器，
但只能用于开发环境，在生产环境下需要依靠Apache作为容器，通过mod_wsgi和Django连接起来。

注意mod_wsgi有两种模式，嵌入模式和守护模式，Django鼓励我们使用更加灵活的守护模式，可以通过编辑
文件httpd.conf来配置，部署的时候需要特别注意，具体可以参考：
[django-modwsgi](https://docs.djangoproject.com/en/1.8/howto/deployment/wsgi/modwsgi/)

> mod_wsgi can operate in one of two modes: an embedded mode and a daemon mode.
> In embedded mode, mod_wsgi is similar to mod_perl – it embeds Python within
Apache and loads Python code into memory when the server starts.
> Code stays in memory throughout the life of an Apache process, which leads to
significant performance gains over other server arrangements.
> In daemon mode, mod_wsgi spawns an independent daemon process that handles
requests.
> The daemon process can run as a different user than the Web server, possibly
leading to improved security, and the daemon process can be restarted without
restarting the entire Apache Web server, possibly making refreshing your codebase
more seamless.

### 新项目
Django自带有管理工具django-admin，新建一个项目只需要短短的一行命令`django-admin startproject mysite`,
然后一个HelloWorld级别的工程就建好了，大致的项目结构如下：

```
mysite
|-- mysite          # App包
|   |-- __init__.py
|   |-- settings.py # 配置文件
|   |-- urls.py     # 路由配置
|   |-- wsgi.py     # wsgi接口
|-- manage.py       # 管理脚本
```

其中manage.py脚本提供了很多项目管理命令，比如添加管理员，更新数据库，运行服务器等等，全部自带
支持，手动管理的负担大大减小了。settings.py文件用于项目配置，包括项目的安全、数据库、中间件等等，
wsgi.py是App的WSGI接口，可以看成是App的入口。WSGI（Python Web Server Gateway Interface）
是Python的一种Web应用标准，简单来说就是一份Web App和Web Server之间的协议，以便所有支持WSGI
规范的Python应用都能够在同一服务器环境下运行。

项目建好后，输入`manage.py runserver`就可以运行了，注意命令行提示数据库没有migrate，这是因为
还没有配置好数据库，现在可以暂时不用理会，后面会有详细的配置说明。等待程序运行后，用浏览器打开
`localhost:8000`可以看到`It worked!`字样，说明服务正常运行。

### 连接数据库
Django自带SQLite数据库的支持，如果想用其他的DBMS，Django也有很好的支持，Django官网上就有
连接所有主流数据库的教程——[django-database](https://docs.djangoproject.com/en/1.8/ref/databases/)

在这里我用的是MySQL，先安装MySQL的驱动，``，然后在settings.py文件中写入自己的配置：

```python
# settings.py
DATABASES = {
  'default': {
    'ENGINE': 'django.db.backends.mysql',
    'NAME': 'mydb_name',
    'USER': 'mydb_user',
    'PASSWORD': 'my_password',
    'HOST': '127.0.0.1',
    'PORT': '3306',
  }
}
```

注意：这只是开发环境下的数据库配置，生产环境下的配置也许会有所不同，可以通过`DEBUG`变量或者
环境变量来针对不同的环境进行配置。

### 创建页面
如果不想只看到Django的调试界面，就可以开始编辑自己的网页了。首先添加一个views.py文件，在其中
定义视图函数index，然后在urls.py文件中添加一条路由`url(r'^$', views.index)`，让页面可以
被索引：

```python
from django.http import HttpResponse

def index(req):
    return HttpResponse('Hello World')
```

如果每个页面都像这样使用字符串来创建页面肯定不好，Django提供了template模板来动态生成网页，
首先在项目目录下添加一个文件夹template，用于存放模板文件，然后添加一个常规的html文件index.html，
然后再修改视图函数，让视图由模板产生，最后再将template文件夹路径配置到settings.py即可。

```
# views.py
from django.shortcuts import render_to_response

def index(req):
    return render_to_response('index.html')

# settings.py
TEMPLATES = [
  {
    'BACKEND': 'django.template.backends.django.DjangoTemplates',
    'DIRS': [
      os.path.join(BASE_DIR, 'template')
    ],
    ...
  },
]
```

### 配置静态文件
一般来说，Web App开发都离不开css/js/img等文件，Django会将这些文件的url自动的填充到页面中，
而且这些文件在部署的时候，需要进行版本管理，压缩，常用的还可以通过CDN加速，Django也提供了方便
的部署方式。

首先在settings.py文件中配置`STATIC_URL`和`STATICFILES_DIRS`，其中`STATIC_URL`是静态文件
在html中显示的链接前缀，`STATICFILES_DIRS`才是主机上存放静态文件的文件夹路径。

需要注意，在模版中使用静态文件链接之前要使用`load staticfiles`标签加载站点中静态文件的路径，
其实Django的静态文件分发是由`django.contrib.staticfiles`这个内建App支持的，只有在开发环境
下才能分发静态文件，在生产环境下因为性能问题，静态文件分发是应该交给服务器程序处理的。

所以在部署项目时要运行`django-admin collectstatic`命令，静态文件就会被拷贝到`STATIC_ROOT`
变量所指向的目录，这个目录应该是Apache服务器所能索引到的，在Unix系统下默认是`/var/www/static/`，
这样Django就可以配合Apache提供完善的Web运行环境了。

### 总结
总体来说，Django给我的感觉就是现代化，比起Java Web的url映射，正则表达式匹配显然更加直观，通过
pattern捕获url参数也美观了许多。对于每个request使用一个函数做处理显然比用一个类更加简洁，而且
这样一来可以把多个请求处理函数合并成一个模块作为url路由集合，还可以方便的重用。使用模板的继承和
包含来组织页面关系可以大大减少前端的工作量。使用这些Web开发技术，再加上各种工具的支持，就可以花
更少的时间在琐碎的事情上，而把精力集中到开发业务上去，就像Django的设计准则之一所说的
"Don't Repeat Yourself"。
