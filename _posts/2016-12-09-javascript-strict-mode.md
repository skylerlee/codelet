---
layout: post
title: JavaScript严格模式
date: 2016-12-09 15:46:02 +0800
tags:
  - note
  - frontend
  - javascript
---

JavaScript的执行模式可以分为严格模式和宽松模式，严格模式比起宽松模式：

* 严格模式下，JS会修复一些缺陷，减少静默错误
* 更容易被解释器优化，带来更高的执行速度
* 禁用了未来JS版本会用到的一些语法

**禁用隐式全局变量**

```js
(function () {
  foobaz = 100
  console.log(window.foobaz) // 100
}())

(function () {
  'use strict'
  foobaz = 100 // ReferenceError: foobaz is not defined
  console.log(window.foobaz)
}())
```

**this不指向全局对象**

```js
(function () {
  console.log(this) // Window
}())

(function () {
  'use strict'
  console.log(this) // undefined
}())
```

我们可以借助这一点来判断当前的执行环境

```js
var isStrict = (function () {
  return this === undefined
}())
```

**抛出静默错误**

```js
(function () {
  NaN = 100
  console.log(NaN) // NaN, readonly
}())

(function () {
  'use strict'
  NaN = 100 // TypeError: Cannot assign to read only property 'NaN' of
            // object '#<Window>'
  console.log(NaN)
}())
```

**禁用with**

```js
(function () {
  'use strict'
  var obj = {
    x: 10
  }
  with (obj) {
    console.log(x) // SyntaxError: Strict mode code may not include a
                   // with statement
  }
}())
```

**单独的eval作用域**

```js
(function () {
  var a = 10
  eval('var a = 20')
  console.log(a) // 20
}())

(function () {
  'use strict'
  var a = 10
  eval('var a = 20')
  console.log(a) // 10
}())
```

**不绑定arguments**

```js
(function () {
  function test (a) {
    console.log(arguments[0]) // 10
    a = 99
    console.log(arguments[0]) // 99
  }

  test(10)
}())

(function () {
  'use strict'

  function test (a) {
    console.log(arguments[0]) // 10
    a = 99
    console.log(arguments[0]) // 10, original
  }

  test(10)
}())
```

**禁用arguments.callee**

```js
(function () {
  function test () {
    console.log(arguments.callee) // ƒ test()
  }

  test()
}())

(function () {
  'use strict'

  function test () {
    console.log(arguments.callee) // TypeError: 'caller', 'callee',
                                  // and 'arguments' properties may not be
                                  // accessed on strict mode functions or the
                                  // arguments objects for calls to them
  }

  test()
}())
```

**禁用保留字**

```js
(function () {
  var let = 100
  console.log(let) // 100
}())

(function () {
  'use strict'
  var let = 100 // SyntaxError: Unexpected strict mode reserved word
  console.log(let)
}())
```
