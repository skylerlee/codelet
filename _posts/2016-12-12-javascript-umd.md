---
layout: post
title: JavaScript UMD模块定义
date: 2016-12-12 20:33:19 +0800
tags:
  - note
  - frontend
  - javascript
---

现在的前端工程已经离不开转译器和打包工具了，随着前端工程的越来越自动化，我们的开发效率的确得到了
极大的提升，但是，作为一个程序员，单单只是会使用工具是不够的。工具在帮助我们完成一些任务的同时也
屏蔽了一些重要的细节，而细节不容忽视，所以我们回过头来看看工具自动生成的代码还是很有必要的。

今天就先研究一下rollup的模块打包格式

先介绍一下工具链：
* babel@6.18 使用es6
* rollup@0.36

命令`rollup -h`告诉我们bundle的输出格式可选5种，分别是：[amd, cjs, es, iife, umd]，其中
umd据说可以适配所有的模块环境，那么我们就先输出一个umd的bundle看看。

配置好rollup后，使用`rollup -f umd -n Bundle entry.js`命令就可以看到输出的结果啦，因为
生成的代码不好看，所以这里我就美化了一下，去掉了ternary，以下是代码：

```js
(function (global, factory) {
  if (typeof exports === 'object' && typeof module !== 'undefined') {
    // CommonJS
    factory(exports)
  } else if (typeof define === 'function' && define.amd) {
    // AMD
    define(['exports'], factory)
  } else {
    // Default
    factory((global.Bundle = {}))
  }
}(this, (function (exports) {
  'use strict'

  /* Code Here */

  exports.foo = foo
  exports['default'] = bar

  Object.defineProperty(exports, '__esModule', { value: true })
})))
```

简单分析一下：

1. 最外层的iife执行时，会做参数映射，`this`即根对象(window/global)映射为`global`，第二个
匿名函数映射为`factory`，然后开始执行闭包函数体。
2. 然后就是判断运行时的模块格式了，一共三种：CommonJS、AMD以及默认，在默认环境下本模块会在
根对象上挂载一个由`-n/--name`参数指定的属性，其值为模块代码内暴露的exports对象。

如此一来，我们的同一份代码就可以被Node.js，RequireJS，浏览器原始环境所同时正确加载了，所谓的
‘一次编写到处运行’，抛开这个梗不讨论，其实UMD也有一些缺点。

缺点：

1. 其实代码的运行环境是相对固定的，实际开发中大多数都是针对平台编程，除非是一些通用函数库，否则
很少会需要跨browser+node平台。
2. 现在借助于打包工具，可以针对具体目标平台生成多份目标代码，工作量并不大。
3. 性能+冗余代码，如果有多份UMD模块被引入，模块格式条件判断执行xN，且会增加10多行代码，增加
代码体积。

可以参考vue的分发方式：
* vue.js - UMD
* vue.common.js - CommonJS
* vue.esm.js - ES Module

参考资料：  
[1] [universal-module-definition](https://github.com/umdjs/umd#umd-universal-module-definition)  
[2] [rollup ES6-modules](https://github.com/rollup/rollup/wiki/ES6-modules#why-use-modules-at-all)  
[3] [vuejs build files](https://github.com/vuejs/vue/tree/dev/dist#explanation-of-build-files)  
