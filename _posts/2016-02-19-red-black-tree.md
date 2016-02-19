---
layout: post
title: 红黑树
date: 2016-02-19 20:36:39 +0800
tags:
  - study
  - algorithm
use_require: true
require_math: true
---
## 红黑树
红黑树也是一种二叉搜索树，它除了满足二叉搜索树的性质之外，还满足以下几条性质
1. 每个结点要么是红色要么是黑色
2. 根结点和叶子结点(nil)是黑色的
3. 红色结点的两个孩子都是黑色的（红色结点不允许连续出现）
4. 任意结点到其任意后代叶子结点的简单路径，其所包含的黑色结点数目相等（结点的黑高）

```cpp
enum Color {
  RED = 0,
  BLACK
};

struct Node {
  Node(int value)
  : value(value),
    color(RED),
    left(nullptr),
    right(nullptr) {}

  int value;
  Color color;
  Node* left;
  Node* right;
};
```

参考资料：  
[1] [wikipedia - 2–3 tree](https://en.wikipedia.org/wiki/2%E2%80%933_tree)  
[2] [wikipedia - red-black tree](https://en.wikipedia.org/wiki/Red%E2%80%93black_tree)  
[3] [R. Sedgewick and K. Wayne Algorithms-4th - Balanced Search Trees](https://algs4.cs.princeton.edu/33balanced/)  
