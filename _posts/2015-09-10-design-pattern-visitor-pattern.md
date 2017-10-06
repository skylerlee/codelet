---
layout: post
title: 设计模式——访问者模式
date: 2015-09-10 24:05:23 +0800
tags:
  - coding
  - design-pattern
---

最近在研究一个字符串格式化算法，其中用到了访问者模式（Visitor Pattern），据说这个设计模式比较
复杂难懂，那么就看看到底难在哪。

访问者模式的定义：

> The visitor design pattern is a way of separating an algorithm from an object
structure on which it operates.
> A practical result of this separation is the ability to add new operations to
existing object structures without modifying those structures.
> It is one way to follow the open/closed principle.
> -- [wikipedia](https://en.wikipedia.org/wiki/Visitor_pattern)

可见作用大致就是分离实现细节以及在不修改类的前提下增加新的操作。

字符串格式化算法的描述如下：
输入为字符串格式模板以及若干个参数，这些参数都是不同类型的（如：int、double、string、object等），
但是为了方便储存在列表中，需要有一个统一的基类Arg，然后程序通过遍历ArgList，把不同的参数转化成
字符串，最后替换模板中的占位符，生成出结果。

大致的步骤可以用以下的代码描述：

```python
# Formating algorithm
class Arg:
  ...

alias ArgList List<Arg>

class IntArg(Arg):
  ...
class DoubleArg(Arg):
  ...

arglist = ArgList()
arglist.append(IntArg(8))
arglist.append(DoubleArg(12.35))

do_format('an int {}, a double {}', arglist)
```

现在问题就在于`do_format`函数的实现里需要对`arglist`里的每一个元素的类型进行区分，从而采取
针对不同数据类型的字符串化算法。

下面介绍用于类型区分的3种方案：

1. 最容易想到的就是利用多态，在`Arg`类里面增加一个`stringfy`函数，在不同的子类里给予不同的实现，
最后通过调用基类的`Arg::stringfy`方法来调用不同的实现算法。

这个方法看起来相当好，在大多数情况下是可以采用的，但问题在于：int以及double的字符串化算法其实
相当复杂，对性能要求较高的格式化库对于int和double采用了自己实现的算法，然而如果把这些算法全部
写入`IntArg`和`DoubleArg`则会显得很不合适，原本一个用于数据包装的类却包含上千行的Grisu算法，
会对代码的封装造成破坏。

在这种情况下最好增加一个`Formatter`类，将各种类型的字符串化算法写在此类里，然后再调用此类的方法
来得到字符串。

2. 第二种就采用这种分离算法的方案，在`Formatter`类中增加不同类型数据的字符串化方法。

```python
class Formatter:
  def stringfyInt(arg: IntArg):
    ...
  def stringfyDouble(arg: DoubleArg):
    ...
  # 或者定义为可重载的方法
  def stringfy(arg: IntArg):
    ...
  def stringfy(arg: DoubleArg):
    ...
```

但是无论如何，现在还是不能成功的调用`Formatter::stringfy`方法，原因就在于从`ArgList`中得到的
元素类型都是`Arg`基类类型，需要进行类型区分。

而我之前区分子类类型时基本都是使用 RTTI + 强制类型转换，这样是很不好的做法。

```python
for arg in arglist:
  switch typeof(arg):
    case Int:
      formatter.stringfy((Int)arg)
    case Double:
      formatter.stringfy((Double)arg)
    ...
```

这样不但多了一步 RTTI 的开销，而且所有的类型都必须出现在switch语句里，不然就会出错！而之后
每增加一个类型，就需要改动`Formatter`类、switch语句两个地方，以及增加一个类定义，不便于维护。

3. 第三种就是访问者模式（Visitor Pattern）

还记得上面对访问者模式的定义吗？算法实现分离，增加操作，这不刚好就是`Arg`以及`Formatter`的需求
吗？将格式化算法从`Arg`分离到`Formatter`中。

此外访问者模式还可以实现“双重分派”的功能，之前的方案2之所以要进行 RTTI，其原因就是：不同于方案1
算法在子类内部，通过多态即可区分类型，然后调用内部绑定的算法；方案2的算法在子类外部，首先需要
RTTI ‘手动’区分类型，然后再通过switch语句‘手动’绑定算法，做两次区分才能调用正确的算法。其实当
算法实现在子类外部时，做两次区分是不可避免的，不同的是访问者模式可以通过多态和函数重载自动的进行
两次区分，即所谓的“双重分派”。

下面就看采用访问者模式后的做法：

```python
class Arg:
  def stringfy():
    raise NotImplementatedError()

class IntArg(Arg):
  def stringfy() override:
    return formatter.format(this)

class DoubleArg(Arg):
  def stringfy() override:
    return formatter.format(this)

class Formatter:
  # 采用重载方法
  def format(arg: IntArg):
    ...
  def format(arg: DoubleArg):
    ...

def do_format(fmt: string, arglist: ArgList):
  for arg in arglist:
    str = arg.stringfy() # 多态调用
    fmt = fmt.replaceFirst('{}', str)
  return fmt
```

其实，访问者模式更像是方案1与方案2的结合，既利用了多态来区分类型，也利用了函数重载来绑定类型和
实现算法，比起方案2优点就是自动绑定类型和算法，之后每增加一个类型，只需要增加一个类定义以及在
`Formatter`中添加一个函数实现即可，更重要的是代码也清晰了许多，虽然有点绕。
