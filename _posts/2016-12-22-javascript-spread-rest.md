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

除了扩展数组，对象也可以使用扩展语法

```js
let obj = {
  b: 'bbb'
}

let dst = {
  a: 'aaa',
  ...obj,
  c: 'ccc'
}
```

会生成以下代码

```js
'use strict';

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];
    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }
  return target;
};

var obj = {
  b: 'bbb'
};

var dst = _extends({
  a: 'aaa'
}, obj, {
  c: 'ccc'
});
```

可见扩展语法和`Object.assign()`一样，都是对对象进行浅拷贝

除了扩展数组之外，还可以用于函数参数填充

```js
let arg = [1, 2, 3]
test(0, ...arg)
```

```js
var arg = [1, 2, 3];
test.apply(undefined, [0].concat(arg));
```

剩余语法和上面很相似，不过只能用于函数形参之中，用于匹配剩余的实参

```js
function test (a, b, ...rest) {
  console.log(rest)
}
```

```js
function test(a, b) {
  for (var _len = arguments.length,
      rest = Array(_len > 2 ? _len - 2 : 0),
      _key = 2;
      _key < _len;
      _key++) {
    rest[_key - 2] = arguments[_key];
  }

  console.log(rest);
}
```
