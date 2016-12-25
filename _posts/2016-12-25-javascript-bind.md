---
layout: post
title: JavaScript绑定函数
date: 2016-12-25 21:49:58 +0800
tags:
  - note
  - frontend
  - javascript
---

在JS中，我们经常需要指定函数的`this`值，通常我们会用`call/apply`这样的函数为`this`绑定值，
除此之外函数还可以通过`bind`方法绑定`this`，现在就来深入分析一下`bind`函数。

先看下面的例子

```js
function test () {}

test.call(obj, 0, 1)
test.apply(obj, [0, 1])

var fn = test.bind(obj, 0, 1)
fn()
```

可见，不同于`call/apply`在调用时指定`this`，`bind`完成绑定后会返回一个函数，当调用此函数时
原函数才会执行，这种方式很适合为回调函数绑定上下文，因此在Web环境中被广泛的使用。

之前我一直以为`bind`的实现并不困难，在我看来它应该差不多是这样的：

```js
Function.prototype.bind = function (thisArg) {
  var that = this
  var args = Array.prototype.slice.call(arguments, 1)
  return function () {
    var rest = Array.prototype.slice.call(arguments)
    return that.apply(thisArg, args.concat(rest))
  }
}
```

但后来看了You-Dont-Know-JS才发现原来事情并不简单，下面就来解释为什么

还记得之前讲过的构造函数变长参数调用的问题吗？

```js
var arg = [1, 2, 3];
var t = new (Function.prototype.bind.apply(Test, [null].concat([0], arg)))();
```

可以简化为

```js
var t = new (Test.bind(null, 0, 1, 2, 3))
```

发现了问题吗？如果通过`new`关键字调用`bind`返回的函数，按照我之前的写法`t`应该是个空对象`{}`
才对呀，可是为什么会执行原函数的绑定呢？看来`bind`里面针对`new`有特殊的处理，下面就来分析一下

MDN上对于构造函数绑定有如下说明：

> Bound functions are automatically suitable for use with the `new` operator to
> construct new instances created by the target function. When a bound function
> is used to construct a value, the provided `this` is ignored.
> However, provided arguments are still prepended to the constructor call.

`bind`函数的polyfill代码如下：

```js
if (!Function.prototype.bind) {
  Function.prototype.bind = function(oThis) {
    if (typeof this !== 'function') {
      // closest thing possible to the ECMAScript 5
      // internal IsCallable function
      throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
    }

    var aArgs   = Array.prototype.slice.call(arguments, 1),
        fToBind = this,
        fNOP    = function() {},
        fBound  = function() {
          return fToBind.apply(this instanceof fNOP
                 ? this
                 : oThis,
                 aArgs.concat(Array.prototype.slice.call(arguments)));
        };

    if (this.prototype) {
      // Function.prototype doesn't have a prototype property
      fNOP.prototype = this.prototype;
    }
    fBound.prototype = new fNOP();

    return fBound;
  };
}
```

参考资料：  
[1] [MDN - Function Bind](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind)
