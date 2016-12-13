---
layout: post
title: JavaScript UMD模块定义
date: 2016-12-12 20:33:19 +0800
tags:
  - frontend
  - javascript
---

现在的前端工程已经离不开转译器和打包工具了，随着前端工程的越来越自动化，我们的开发效率的确得到了
极大的提升，但是，作为一个程序员，单单只是会使用工具是不够的。工具在帮助我们完成一些任务的同时也
屏蔽了一些重要的细节，而细节不容忽视，所以我们回过头来看看工具自动生成的代码还是很有必要的。

今天就先研究一下rollup的模块打包格式

命令`rollup -h`告诉我们bundle的输出格式可选5种，分别是：[amd, cjs, es, iife, umd]，其中
umd据说可以适配所有的模块环境，那么我们就先输出一个umd的bundle看看。

先介绍一下工具链：
* babel@6.18 使用es6
* rollup@0.36

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
