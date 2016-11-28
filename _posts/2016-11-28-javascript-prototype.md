---
layout: post
title: JavaScript原型
date: 2016-11-28 20:45:05 +0800
tags:
  - note
  - frontend
  - javascript
---

不同于一般的OOP语言，JavaScript中对象的创建可以不借助‘类’的概念，而是通过‘原型’机制实现OOP的。

首先，我们先看看OOP的几大特性：
* 封装
* 继承
* 多态
* 抽象

在Java中，一个典型的对象创建过程如下：

```java
class Test {
  private String name;
  private int age;

  public Test(String name, int age) {
    this.name = name;
    this.age = age;
  }

  public void print() {}
}
// ... ...
Test test = new Test("Tom", 20);
```

可见，类是对象的模板，用于规定属性，提供可调用的方法。其中访问限定符（`public/protected/
private/*package*`）提供封装；类之间的继承提供属性/方法的重用；多态和抽象就无需赘言了。

再看看JavaScript中，对象的创建：

```js
function Test (name, age) {
  this.name = name
  this.age = age
}

Test.prototype.print = function () {}
// ... ...
var t0 = new Test()
```

JS中对象是由函数创建的，而不是类，事实上ES6中的`class`其实也只是原型继承的语法糖，JS中并没有
真正的类的概念。在JS中，对象的模板是构造函数，构造函数是个运行时概念，指通过`new`关键字调用的
普通函数，不像Java中的构造函数是静态的，是特殊函数。
