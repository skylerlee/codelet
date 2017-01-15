---
layout: post
title: 学习Flask
date: 2015-11-13 23:33:23 +0800
tags:
  - tutorial
  - python
  - backend
---

最近发现了一个很火的Python Web框架——Flask，在Github上已有10K级的Star，
[mitsuhiko-flask](https://github.com/mitsuhiko/flask)——有Python微框架之称。

### 简介
说起Flask就不得不提到Werkzeug，Werkzeug是一个符合WSGI规范的基础库，其中包含有很多Web开发的
常用功能，比如：请求响应模型的类抽象，url路由，cookie实现，web调试界面等基础功能。Flask是基于
Werkzeug的高层封装，添加了更完备的web开发功能。

### 缺点
先说Flask的缺点吧，一个缺点就是太新，目前都处于Beta状态，不太适合对稳定性要求较高的项目。虽然
Flask文档质量很高，但是目前使用Flask的项目很少，某些错误很难得到及时的反馈。而且不像Django带有
功能健全的contrib，Flask采用的是可插拔的扩展设计，扩展插件的所有权都分散在个人开发者手上，因此
Flask的插件质量不像Django那么有保障，在使用之前要做好调研才行。

### 优点
1. 易于扩展，不同于Django的模块高耦合，Flask除了基础功能，像诸如数据库ORM、后台管理等功能都需要
用第三方扩展来完成，如SQLAlchemy和Flask-Admin，模块之间的耦合度低，比如想在Flask下使用非关系型
数据库也很简单，安装扩展Flask-PyMongo即可，而Django若想使用MongoDB而且不用任何关系型数据库
的话，则内建的后台管理模块则无法使用了，Django的后台管理界面很不错，期待对MongoDB的支持。

2. 配置方便
相比起Django来说，Flask相对不是那么的依赖配置，Flask的设计准则里有一条“约定优于配置”
（convention over configuration），因此在Flask里，像template文件夹路径，static文件路径
都是不需要出现在配置文件中的，因为这些细节一般都是固定的，很少有人会去改动，出现在配置文件中不但
显得多余，还有可能会对其他的配置产生干扰，给维护带来困难。
而且相比Django把几乎所有的配置存放在一个文件里，Flask的配置则是分散化的，数据库的配置可以单独
在Flask-SQLAlchemy初始化时配置，使用的插件可以在单独的exts.py文件中导入，而不是强制要求写在
同一个配置文件里。

3. Blueprint
Flask的模块化是由Blueprint类来完成的，可以通过给Blueprint指明url前缀，从而注册一个带有子域名
的模块，使用`@blueprint.route`装饰器来添加url路由也更加简洁，之后这个模块还可以在多个app之间
共享，这样做比起Django的多个app的组织方式更合理，因为多个app之间的独立性较强，之间不容易共享
共有的代码。

4. 模板语言
Flask默认的模板使用的jinja2，在众多的模板语言中，我觉得jinja2是功能最完善的，比起Django模板，
mustache、jade等，jinja2是功能最丰富的，更pythonic，更容易扩展。比如要添加自定义标签，只需要
使用装饰器`@app.context_processor`装饰一个函数，然后返回一个包含有要添加到模板上下文的变量或
函数的字典即可，在模板引擎初始化时会加载自定义的符号，然后就可以在模板中像使用python变量或函数
一样的使用就行了。

如果不喜欢jinja2模板，替换也很简单，很多扩展都重写了`render_template`方法，可以直接替换
`flask.render_template`函数，Flask很灵活，容易扩展，给开发者很大的自由度。
