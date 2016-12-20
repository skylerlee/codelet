---
layout: post
title: JavaScript解构赋值
date: 2016-12-20 20:42:46 +0800
tags:
  - note
  - frontend
  - javascript
---

解构赋值语法是ES6的新特性，我们可以借助解构赋值写出简短优雅的代码，多运用解构赋值可以很大的提高
代码的可读性，提高开发效率。现在很多转译工具（如Babel）会帮助我们处理解构赋值语句，自动兼容低版
本的JS引擎，所以我们需要读一读这些辅助代码，才能知道工具为我们做了什么。

解构赋值大致有如下的几种用法：

1. 交换变量

```js
let a = 0
let b = 1
let c = 2
[a, b, c] = [b, c, a]
```

会被转译为：

```js
"use strict";

var a = 0;
var b = 1;
var c = 2;
var _ref = [b, c, a];
a = _ref[0];
b = _ref[1];
c = _ref[2];
_ref;
```

2. 多返回值

```js
function getResult () { return [] }

let [a, b, c] = getResult()
```

和变量解构一样，返回值会由一个中间变量存储，下面的`_slicedToArray`用于把可迭代对象转化成数组

```js
function getResult() { return []; }

var _getResult = getResult(),
  _getResult2 = _slicedToArray(_getResult, 3),
  a = _getResult2[0],
  b = _getResult2[1],
  c = _getResult2[2];
```

3. 参数解构

```js
function putArray ([a, b, c]) {}

function putObject ({ x: a, y: b, z: c }) {}
```

函数传参实际上是隐式的变量赋值，因此也可以使用解构语法，除了数组以外对象也是可以解构的

```js
function putArray(_ref) {
  var _ref2 = _slicedToArray(_ref, 3),
    a = _ref2[0],
    b = _ref2[1],
    c = _ref2[2];
}

function putObject(_ref3) {
  var a = _ref3.x,
    b = _ref3.y,
    c = _ref3.z;
}
```

4. 默认属性值

```js
let obj = {
  a: 1
}

let {
  a = 0,
  b = 0
} = obj
```

解构的同时还可以指定默认参数，对函数传参也一样适用

```js
"use strict";

var obj = {
  a: 1
};

var _obj$a = obj.a,
    a = _obj$a === undefined ? 0 : _obj$a,
    _obj$b = obj.b,
    b = _obj$b === undefined ? 0 : _obj$b;
```

5. 深对象赋值

```js
var obj = {
  a: 0,
  b: {
    c: 1,
    d: {
      e: 2
    }
  }
}

var {
  a,
  b: {
    d: {
      e: e
    }
  }
} = obj
```

解构赋值还可以用于获取深对象中的属性值，不过为了更安全的操作最好还是用`_.get()`

```js
"use strict";

var obj = {
  a: 0,
  b: {
    c: 1,
    d: {
      e: 2
    }
  }
};

var a = obj.a,
    e = obj.b.d.e;
```
