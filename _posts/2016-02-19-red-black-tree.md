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

红黑树是一种重要的数据结构，它常作为各种系统中关联数组的实现，比如C++STL中的map和set，JDK中的
TreeMap以及Linux内核都用到了红黑树，因此很有必要研究清楚。但在学习红黑树之前，我们最好先理解另
一种树——2-3树，它将有助于我们理解红黑树的平衡原理

## 2-3树
2-3树是3阶的B-树，根据定义，它具有以下几点性质：
## 红黑树
红黑树也是一种二叉搜索树，它除了满足二叉搜索树的性质之外，还满足以下几条性质
1. 每个结点要么是红色要么是黑色
2. 根结点和叶子结点（NIL结点）是黑色的
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

### 搜索
红黑树也是一种二叉搜索树，因此搜索算法是一致的

```cpp
Node* RBTree::search(int key) {
  Node* node = this->root;
  while (node != nullptr) {
    if (key < node->value) {
      node = node->left;
    } else if (key > node->value) {
      node = node->right;
    } else { // key == node->value
      return node;
    }
  }
  return nullptr;
}
```
参考资料：  
[1] [wikipedia - 2–3 tree](https://en.wikipedia.org/wiki/2%E2%80%933_tree)  
[2] [wikipedia - red-black tree](https://en.wikipedia.org/wiki/Red%E2%80%93black_tree)  
[3] [R. Sedgewick and K. Wayne Algorithms-4th - Balanced Search Trees](https://algs4.cs.princeton.edu/33balanced/)  
