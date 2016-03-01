---
layout: post
title: 面向切面编程
date: 2016-03-01 20:13:46 +0800
tags:
  - coding
---

面向切面编程（aspect-oriented programming，AOP）也叫面向方面编程，面向侧面编程，剖面导向编程，
是一种常用的程序开发范式，在工程上有很多的应用场景，比如：日志（logging）、用户权限检查以及表单
数据验证等，都可以使用AOP的方式来优化程序的结构。

先看面向切面编程的定义：

> In computing, aspect-oriented programming (AOP) is a programming paradigm that
aims to increase modularity by allowing the separation of cross-cutting concerns.
> It does so by adding additional behavior to existing code (an advice) without
modifying the code itself, instead separately specifying which code is modified
via a "pointcut" specification. [1]

AOP的作用可以概括如下：

1. 可以通过分离横切关注点来增加程序的模块化程度。
2. 可以在不改变原有代码的前提下通过切入点来添加功能。

可是关注点，横切关注点都是什么呢？软件工程里的定义[2]如下：

* 关注点：有时，它被定义为一个功能概念（比如，关注点是系统中的某些功能要素）。同样的，它也可以被
定义得非常宽泛，如定义它是“程序中任意一块兴趣点或焦点片段”。
* 关注点分离：程序中的每个元素（类、方法、过程等）做且只做一件事，使得注意力能够集中在一个元素上
而无需考虑程序中的其他元素。
* 横切关注点：有些关注点横贯其他关注点，即实现它们的方法存在交集，称之为横切关注点。

说了这么多还是不懂什么是切面，其实可以以具体的例子来帮助理解：

* 关注点：可以简单的看做程序的功能点。
* 关注点分离：模块之间低耦合，写程序时很自然的思维，就是将一个功能尽量的写在一个函数或者类里面，
在其他的模块里不需要了解具体的实现细节。
* 横切关注点：有些关注点无法被局部化，比如日志记录（logging），一般来说程序的各个模块都会调用
记录日志的功能，从逻辑上来说日志记录模块和程序的其他模块是高耦合的，因此日志记录这个关注点与其他
关注点横切。
* 切面：例如日志记录（logging）是一个横切关注点，若采用传统的OOP的方法，则在每个需要记录的地方
都要添加日志记录的代码，但是如果把logging功能提取为一个切面，从另一个相对独立的方面（aspect）
来为程序添加功能，就可以有效地将logging功能和业务代码分离。

比如在下面的代码中：

```python
def admin_login(request):
  ...
  logging.info('Admin {} login succeeded.'.format(name))

...

def db_connect():
  ...
  if failed:
    logging.error('Database connection failed!')
```

不管是管理员登录还是连接数据库都会有logging操作，如此会在程序中混入很多与业务无关的代码，如果
使用切面编程的话，代码可以组织成这样：

```python
@logging.info('Admin {name} login succeeded.')
def admin_login(request):
  ...

...

@logging.onfailed.error('Database connection failed!')
def db_connect():
  ...
```

*注：`@deco`是Python装饰器，具体可以参考[pep-0318](https://www.python.org/dev/peps/pep-0318/)*

这样一来日志记录的代码就可以写在函数之外，和业务分离开来。上述例子中`admin_login`和`db_connect`
函数中所省略的代码就是各个模块的具体实现代码，也可以叫做“主关注点”。而绑定了logging的以上两个函数
就称为连接点（joinpoint），实现绑定的装饰器称为切入点（pointcut），日志记录切面就是通过装饰器
为切入点来添加功能的。

需要注意切入点的实现方式不一定只有装饰器这一种，还可以通过代理类，配置文件甚至简单的在代码中调用
切面的实现函数都可以看做是种AOP的切入方式。

比如，Java编程中广泛使用的AOP例子，SpringMVC的拦截器（Interceptor）就可以用配置文件实现AOP，
将要执行的代码单独放在Interceptor的实现里，然后通过xml配置文件里的标签或者annotation注解将
拦截器和方法关联起来。再比如，在Android编程中，需要给UI上的控件添加事件响应函数，而采用动态注入
库ButterKnife[3]中的`OnClick`注解将响应函数与控件绑定，就不需要在初始化时手动的添加监听器，
因此Java注解也可以作为实现AOP的切入点。

不同的语言或者不同的框架对AOP的实现方式可能有所不同，但思路都是类似的，就是分离出程序中的某一个
广泛使用的功能模块（横切关注点），以一种相对独立于程序业务（主关注点）的描述方式（切面）来给程序
添加功能。

切面的特点：
1. 切面和其他模块存在广泛的关联（横切关注点）
2. 相对独立，应该易于从其他模块中分离
3. 实现的功能和其他模块的功能往往是可叠加的

如果在开发中发现某一模块的功能满足上述特点，可以考虑将此模块抽取为一个切面，也许代码就清晰很多了。
面向切面编程（AOP）本质上是对面向对象编程（OOP）的一种补充，其目的都是增加程序的模块化程度。

参考资料：  
[1] Aspect-oriented_programming. Wikipedia.
[https://en.wikipedia.org/wiki/Aspect-oriented_programming](https://en.wikipedia
.org/wiki/Aspect-oriented_programming)  
[2] Ian Sommerville. "Aspect-oriented software engineering." Software Engineering,
Ninth Edition. (2011): 359-361.  
[3] Jake Wharton. "ButterKnife Android Views and Methods Binding."
[ButterKnife Doc](http://jakewharton.github.io/butterknife/javadoc/).  
