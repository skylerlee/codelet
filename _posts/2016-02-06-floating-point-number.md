---
layout: post
title: 浮点数
date: 2016-02-06 15:12:21 +0800
tags:
  - study
  - principle
---

在计算机底层所有的数据都是二进制表示的，在C语言中，基本数据类型大致有以下几种：

`char`，`short`，`int`，`long`，`float`，`double`

其中，定点数的二进制表示很好理解，计组书上说过有符号整数的二进制表示法大致有四种：

1. 原码
2. 反码
3. 补码
4. 移码

现代计算机基本都采用补码来表示有符号数，而浮点数用到了移码，今天就来具体研究一番：
参考资料：  
[1] [wikipedia - Signed Number Representations](https://en.wikipedia.org/wiki/Signed_number_representations)  
[2] [wikipedia - Floating Number](https://en.wikipedia.org/wiki/Floating-point_arithmetic)  
