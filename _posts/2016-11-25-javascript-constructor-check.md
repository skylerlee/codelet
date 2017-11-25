---
layout: post
title: JavaScript构造函数检查
date: 2016-11-25 00:15:57 +0800
tags:
  - note
  - frontend
  - javascript
---

在JavaScript之中，构造函数和普通函数并没有本质区别，因此对构造函数的检查只能在函数调用时进行，
即相当于判断函数是否是以`new`的方式调用的。

总结一下大致有下面几种方式：

1. **instanceof**

```js
function Base () {
  if (!(this instanceof Base)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
```

这种做法是最常见的，一般情况下足够了，不足是不能检测出`Base.call(instance)`这样的调用

2. **new.target**

ES6之后新增了`new.target`语法，用于在`new`调用时指向构造函数，可以防止通过`call/apply`的
方式绑定`this`，从而绕过检查

```js
function Base () {
  if (new.target === undefined) {
    throw new TypeError("Cannot call a class as a function");
  }
}
```

3. **constructor**

和`instanceof`类似，还可以借助`constructor`属性来判断`this`是否是实例对象，缺点也很明显，
不能防止`call/apply`调用，并且这样还会阻止子类的初始化，因为子类的`constructor`会指向子类
的构造函数，而不是基类，事实上这种方式常用来终止类的继承，模拟Java中的 **final class**。

```js
function Base () {
  if (!(this && this.constructor === Base)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
```
