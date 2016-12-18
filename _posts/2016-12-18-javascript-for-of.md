---
layout: post
title: JavaScript for-of循环
date: 2016-12-18 21:19:26 +0800
tags:
  - note
  - frontend
  - javascript
---

JavaScript中的循环语句大致可以分为：条件循环(`for/while`)，属性枚举(`for-in`)，Array方法
(`forEach`)几种，而ES6又新增了一种循环语句`for-of`，用于可迭代对象的循环。

可迭代对象：对象实现了`@@iterator`方法（即具有`Symbol.iterator`属性），该方法返回一个迭代器
对象，则该对象是可迭代的，可以用`for-of`语句遍历，这种方式被称为可迭代协议。（如果`@@iterator`
方法返回的不是一个迭代器对象，则该对象不是良构的可迭代对象，可能会导致问题）

迭代器：迭代器对象遵循迭代器协议产生一系列的值，迭代器对象具有`next`方法，调用该方法返回一个
对象，其中的`done`属性表示迭代是否结束，`value`就是本次迭代使用的值。

生成器：通过调用生成器函数`function*`可以得到一个生成器对象，不同于手动维护迭代器对象的状态，
生成器对象的状态变化是由生成器函数自动确定的，函数通过`yield`语句产生迭代相关的值，函数退出时
迭代也随之结束，生成器是遵循迭代器协议的，也就是说生成器也是一种迭代器，只不过其状态是由执行环境
自动维护的。

```js
let arr = [1, 2, 3, 4]

for (let n of arr) {
  console.log(n)
}
```

```js
"use strict";

var arr = [1, 2, 3, 4];

var _iteratorNormalCompletion = true;
var _didIteratorError = false;
var _iteratorError = undefined;

try {
  for (var _iterator = arr[Symbol.iterator](),
      _step;
      !(_iteratorNormalCompletion = (_step = _iterator.next()).done);
      _iteratorNormalCompletion = true) { // 单次迭代成功结束
    var n = _step.value;
    // 使用元素
    console.log(n);
  }
} catch (err) {
  _didIteratorError = true; // 迭代异常退出
  _iteratorError = err;     // 保存异常
} finally {
  try {
    if (!_iteratorNormalCompletion && _iterator.return) {
      _iterator.return();   // 迭代异常，结束迭代器
    }
  } finally {
    if (_didIteratorError) {
      throw _iteratorError; // 重新抛出异常
    }
  }
}
```
