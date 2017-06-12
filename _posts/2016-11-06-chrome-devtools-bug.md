---
layout: post
title: Chrome DevTools Bug
date: 2016-11-06 21:12:45 +0800
tags:
  - note
  - tool
  - frontend
---

今天发现了Chrome DevTools的一个bug，这个bug会导致DevTools卡死，造成Sources标签无法响应，
这样一来就无法继续调试了，本来想重装浏览器的，好在最后解决了，现在就来记录一下。

**复现：**
要复现bug首先要有一行比较长的JS代码，比如一些用webpack打包后再经过uglify的代码文件，F12打开
调试工具，在Sources标签下找到文件打开，然后随便找一行打上断点，刷新，如果执行到断点处调试工具
卡死了，那么问题就复现了。

**原因：**
因为Chrome在某个版本之后开始支持行内断点了，因此当一行代码被打上断点时，DevTools会分析整行代
码，如果代码长度很长，则会导致页面卡死。

**解决办法：**
工具的问题只能等Google修复了，但是现在打上的断点怎么取消呢？如果不取消，那么每次切换到Sources
标签时页面就会freeze掉，但如果不切换Sources，则没有地方删除断点，于是就陷入了僵局。

就在一筹莫展之时，突然想到之前清除Console历史的办法，历史命令是存储在DevTools的localStorage
里面的，如果断点也储存在里面，那么就可以手动清除断点了，操作步骤如下：

1. 首先undock调试工具
2. 按Ctrl+Shift+J打开DevTools的DevTools
3. 清除LocalStorage  
其实Chrome DevTools实质上是一个WebApp，知道这一点后一切都好办了，切换到Application标签页，
在左侧打开Local Storage，可以看到很多项，其中就包含了`consoleHistory`和`breakpoints`，
点开`breakpoints`查看值，原来断点的数据模型是这样的：

```json
[
  {
    "url": "https://host/path/script.js",
    "lineNumber": 1,
    "columnNumber": 0,
    "condition": "",
    "enabled": true
  }
]
```

后续的步骤就不多说了，通过这种方式还可以玩出更多花样，比如想在同事之间同步断点，但又不想在代码里
添加`debugger`语句，就可以通过同步json数据来保证断点数据的一致性。
