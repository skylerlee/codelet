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

迭代器实际上是一种设计模式，用于提供顺序访问容器内元素的方法，而不需要了解具体的实现。如果说之前
的JS中，迭代器只是以模式来运用的话，那么在ES6之后JS则是对迭代器提供了系统级的支持，任何JS对象
只要实现了可迭代协议，就可以通过统一的`for-of`方式实现迭代。

**可迭代对象：**
对象实现了`@@iterator`方法（即具有`Symbol.iterator`属性），则认为该对象是可迭代的，可以用
`for-of`语句遍历，这种方式被称为可迭代协议。（一般`@@iterator`方法会返回一个迭代器对象，如果
该方法返回的不是一个迭代器对象，则该对象不是良构的可迭代对象，可能会导致迭代失败）

**迭代器：**
迭代器遵循迭代器协议产生一系列的值，迭代器具有`next`方法，该方法会返回一个对象，其中`done`属性
表示迭代是否结束，`value`属性则是本次迭代的元素值。

所以实现自定义迭代器的关键在于实现`next`方法，通过其返回对象的`done`属性及`value`属性来控制
迭代的流程，然而有没有更加简单直接的办法呢？其实通过生成器就可以做到，那么下面就介绍一下什么是
生成器。

**生成器：**
通过调用生成器函数`function*`可以得到一个生成器对象，生成器对象的`next`结果是根据生成器函数的
执行过程确定的，函数通过`yield`语句产生迭代相关的元素值，函数退出时迭代也随之结束。生成器是遵循
迭代器协议的（具有`next`方法），也就是说生成器也是一种迭代器，除此之外生成器还具有`return`和
`throw`方法，用于终止迭代。其实生成器可以看做实现迭代协议的一种快捷方式，`yield`语句可以看做
是实现`next`方法的语法糖。

下面就看一下Babel是怎么处理`for-of`语句的

```js
let arr = [1, 2, 3, 4]

for (let n of arr) {
  console.log(n)
}
```

我格式化了一下代码，并添加了注释，其中的关键就在于通过`[Symbol.iterator]()`获取迭代器对象，
通过`iterator.next()`获取元素值并判断是否继续迭代。

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

上面的代码其实很易懂，较难理解的地方就在于`iteratorNormalCompletion`变量以及异常处理部分，
下面就来解释一下。

其中`iteratorNormalCompletion`变量用于标记迭代是否正常退出，如果在`for-of`循环中执行了
`break`语句或者抛出了异常，则会执行清理工作，停止迭代器。

其中的异常处理用了两层`try`语句，其中
第一层用于捕获循环中的异常，第二个`try`很特别，这是一个`try-finally`语句，它会抛出`return`
函数中抛出的异常，而且会保证`finally`语句总是执行，保证`iteratorError`会优先被抛出。

在理解了`try-finally`语句之后，`didIteratorError`和`iteratorError`两个变量的作用也就很
清楚了，采用`re-throw`方式来控制异常的优先顺序，假设`throw`语句直接写在`catch`之中，那么当
之后的`return`函数执行再发生异常时，后面的异常会覆盖迭代产生的异常，从而导致循环语句中的错误栈
信息丢失，不利于代码调试。

可以验证一下

```js
let obj = {
  [Symbol.iterator] () {
    let count = 0;
    return {
      next () {
        if (count < 10) {
          return {
            done: false,
            value: count++
          };
        } else {
          return {
            done: true,
            value: undefined
          };
        }
      },
      return () {
        throw new Error('Invalid return');
        count = 0;
      }
    };
  }
};

// 如果只使用单层`try`，应该改写成如下代码
var _iteratorNormalCompletion = true;

try {
  for (var _iterator = obj[Symbol.iterator](),
      _step;
      !(_iteratorNormalCompletion = (_step = _iterator.next()).done);
      _iteratorNormalCompletion = true) {
    var n = _step.value;
    if (n === 5) {
      throw new Error('Bad state');
    }
    console.log(n);
  }
} catch (err) {
  throw err;
} finally {
  if (!_iteratorNormalCompletion && _iterator.return) {
    _iterator.return();
  }
}
// Uncaught Error: Invalid return

// 使用原生的`for-of`循环
for (let n of obj) {
  if (n === 5) {
    throw new Error('Bad state');
  }
  console.log(n);
}
// Uncaught Error: Bad state
```

最后再提一下生成器，注意生成器对象既是迭代器也是可迭代对象，所有内建迭代器也是可迭代对象，但是
自定义的迭代器对象可能不具有此性质，需要特别注意。

```js
function* genNums () {
  let i = 0
  while (true) { yield ++i }
}

let gen = genNums()

gen[Symbol.iterator] !== undefined // true
gen[Symbol.iterator]() === gen // true
for (let n of gen) { ... }
// 可见生成器的迭代器是生成器本身，因此生成器对象是可迭代对象，可以用for-of遍历

let iter = [][Symbol.iterator]()

iter[Symbol.iterator] !== undefined // true
iter[Symbol.iterator]() === iter // true
for (let n of iter) { ... }
// 数组的迭代器对象也是可迭代对象，可以用for-of遍历

// 其根本原因是gen/iter二者都继承自`%IteratorPrototype%`原型，此原型的`@@iterator`方法
// 会返回this对象本身
gen[Symbol.iterator] === iter[Symbol.iterator] // true
```

参考资料：  
[1] [MDN - Iteration Protocols](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols)  
[2] [MDN - Generator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*)  
