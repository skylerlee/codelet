---
layout: post
title: JavaScript扩展/剩余语法
date: 2016-12-22 20:04:36 +0800
tags:
  - note
  - frontend
  - javascript
---

ES6又新增了一种运算符——`...`，称为扩展/剩余操作符，实际上这个操作符有两种语义，分别用于数组或
对象的属性填充以及将函数实参转化成数组形式。

还是老规矩，根据Babel生成的代码来分析语义：

```js
let arr = [1, 2, 3]
let dst = [0, ...arr, 4]
```

会生成以下代码

```js
var arr = [1, 2, 3];
var dst = [0].concat(arr, [4]);
```
