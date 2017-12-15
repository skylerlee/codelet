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

**函数优先**

```js
(function () {
  console.log(a)   // undefined
  console.log(b()) // 20
  console.log(c()) // TypeError: c is not a function

  var a = 10

  function b () { return 20 }

  var c = function () { return 30 }
}())

(function () {
  console.log(f()) // 20

  var f = function () { return 10 }
  function f () { return 20 }
  f = function () { return 30 }
}())
```

上面的例子说明：同样是声明语句，函数声明会优先提升，且函数定义也会随变量名一起提升。

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

Kyle Simpson大神在[issue: let hoisting](https://github.com/getify/You-Dont-Know-JS/issues/767#issuecomment-227946671)
里讲道‘提升’并不是一个具体的行为，而`let`的这种现象是因为`TDZ (temporal dead zone)`的存在，
`var`不产生临时死区-TDZ。
因此可以理解为JS解释器在编译期会找出所有的变量，并为其分配空间（此时初始值为undefined），但是
`let`/`const`变量在实际声明语句之前会存在于死区之中，不能被访问，而`var`声明的变量没有这个限制。

最后补充一点：babel是没有实现TDZ的，使用转译器时要特别注意，已测试babel@6.20，详情参考[issue: Block scoping temporal dead zones](https://github.com/babel/babel/issues/563#issuecomment-70920215)
