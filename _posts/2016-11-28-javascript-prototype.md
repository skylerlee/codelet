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

JS中也没有访问限定符，没有私有属性与私有方法，封装主要靠命名规范以及自觉；继承是依靠对象的原型链
来达到的；JS本身是动态语言，多态和抽象不是问题。

要弄清原型链是什么？先看下面几个等式：

```js
function Construct () {}
var inst = new Construct()
// equations
inst.__proto__ === Construct.prototype
Construct.prototype !== Object.prototype
Construct.prototype.__proto__ === Object.prototype
Object.prototype.__proto__ === null

Construct.__proto__ === Function.prototype
Object.__proto__ === Function.prototype
Function.prototype.__proto__ === Object.prototype

inst instanceof Construct === true
inst instanceof Object === true
Construct instanceof Function === true

typeof Object.prototype === 'object'
typeof Function.prototype === 'function'
typeof Function.prototype.__proto__ === 'object'
```

* 原型：JS中每个函数都有一个`prototype`属性，称为显式原型，通过`new`关键字构造得到的对象都有
一个`__proto__`属性，称为隐式原型，两者都指向同一对象，是相等的。
* 构造函数：对象的隐式原型存在一个`constructor`属性，它指向此对象的构造函数
* 属性访问符：`.`操作符并不只是简单的读写当前对象中的属性，它也会访问原型链中的对象，一共可分为
3种情况：
  1. `[[Get]]`调用
    检查属性是否直接存在于对象中，如果存在便返回其值，否则沿原型链向上查找同名属性，找到便返回，
    如果遍历结束都没有找到，则返回`undefined`
  2. 属性不存在上级原型链中+`[[Put]]`调用
    如果属性直接存在于对象中，则直接修改其值；如果属性不存在于对象及其原型链上，则新属性会被添加
    到此对象上
  3. 属性存在上级原型链中+`[[Put]]`调用
    如果属性不直接存在于对象中，而是存在于其上级原型链中，则需要根据属性描述符判断是否应该添加
    其为屏蔽属性(shadowed property)，具体情况就不展开了
* `in`操作符：和`[[Get]]`一样，`in`操作符在检查属性存在性时会遍历原型链，因此在判断属性是否
直接存在时，应该借助`hasOwnProperty`函数

参考资料：  
[1] [You-Dont-Know-JS Prototypes](https://github.com/getify/You-Dont-Know-JS/blob/master/this%20%26%20object%20prototypes/ch5.md)
