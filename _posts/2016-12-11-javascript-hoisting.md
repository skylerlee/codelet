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
