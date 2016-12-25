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
