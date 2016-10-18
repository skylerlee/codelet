---
layout: post
title: 哈希表
date: 2016-10-16 23:17:48 +0800
tags:
  - study
  - algorithm
use_require: true
require_math: true
---

哈希表又称散列表，是最常用的数据结构之一，也是除了搜索树以外的另一种常用的关联数组的实现，相比于
之前介绍过的红黑树，哈希表的查询效率往往更高，代码实现也更简单，不过由于其元素是无序分散存储的，
因此通常哈希表不支持查找前驱或后继元素，也不支持元素的顺序遍历

参考资料：  
[1] [Mark A. Weiss Data Structures and Algorithm Analysis in C++-4th - Hashing](https://www.pearson.com/us/higher-education/program/Weiss-Data-Structures-and-Algorithm-Analysis-in-C-4th-Edition/PGM148299.html)  
[2] [R. Sedgewick and K. Wayne Algorithms-4th - Hash Tables](https://algs4.cs.princeton.edu/34hash/)  
