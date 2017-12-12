---
layout: post
title: JavaScript变量提升
date: 2016-12-11 20:31:08 +0800
tags:
  - note
  - frontend
  - javascript
---

JavaScript与其他语言相比有一个奇怪的特性——变量提升(Hoisting)，ECMA-262标准中并未明确定义
这种行为，但我们还是要了解清楚这个特性。

```js
(function () {
  a = 10
  var a
  console.log(a) // 10
}())

(function () {
  a = 10 // ReferenceError: a is not defined
  let a
  console.log(a)
}())
```

可见用`var`关键字声明的变量会有提升现象，`let`变量‘没有’提升现象。

**什么是提升？**

从形式上看，提升是指函数体内声明的变量会‘无视’语句顺序，在整个函数体内都可以访问，就好像变量的
声明被提前到了函数体的首行的现象。

但是对于`let`，还需要先看一个例子：

```js
(function () {
  let a = 10
  {
    console.log(a) // ReferenceError: a is not defined
    let a
  }
}())
```

让人疑惑的是如果`let`不提升变量，那么打印的结果应该是外层的变量，然而结果却是变量不能被访问，
这说明`console.log(a)`语句还是可以‘感知’到下一行的变量声明语句，而这是不是声明语句提前所导致
的现象呢？
