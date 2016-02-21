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
一种树——2-3-4树，它将有助于我们理解红黑树的平衡原理

## 2-3-4树
2-3-4树是4阶的B-树，根据定义，它具有以下几点性质：
1. 每个结点都是m-结点，其中\\(m \in \\{2, 3, 4\\}\\)（m-结点：包含m-1个元素和m个孩子）
2. 所有叶子结点的深度相同
3. 结点之间以及结点内部的元素都是有序的

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
  Node(int value, Node* parent)
  : value(value),
    color(RED),
    parent(parent),
    left(nullptr),
    right(nullptr) {}

  int value;
  Color color;
  Node* parent;
  Node* left;
  Node* right;
};
```

### 搜索
红黑树同时具有二叉搜索树的性质，适用二分法，因此搜索算法是一致的

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

### 插入
和AVL树类似，红黑树首先将新元素插入到合适的位置，然后再进行调整，不同的是红黑树以结点的颜色作为
判别平衡的依据，依次向上调整

```cpp
inline bool isRed(Node* node) {
  return node != nullptr && node->color == RED;
}

inline bool isBlack(Node* node) {
  return !isRed(node);
}

void RBTree::rotateLeft(Node* node) {
  Node* grandpa = node->parent;
  Node* pivot = node->right;
  node->right = pivot->left;
  if (pivot->left != nullptr) {
    pivot->left->parent = node;
  }
  pivot->left = node;
  node->parent = pivot;
  // fix grandpa
  if (grandpa == nullptr) { // node == root
    this->root = pivot;
  } else if (node == grandpa->left) {
    grandpa->left = pivot;
  } else { // node == grandpa->right
    grandpa->right = pivot;
  }
  pivot->parent = grandpa;
}

void RBTree::rotateRight(Node* node) {
  Node* grandpa = node->parent;
  Node* pivot = node->left;
  node->left = pivot->right;
  if (pivot->right != nullptr) {
    pivot->right->parent = node;
  }
  pivot->right = node;
  node->parent = pivot;
  // fix grandpa
  if (grandpa == nullptr) { // node == root
    this->root = pivot;
  } else if (node == grandpa->left) {
    grandpa->left = pivot;
  } else { // node == grandpa->right
    grandpa->right = pivot;
  }
  pivot->parent = grandpa;
}

void RBTree::fixInsertion(Node* node) {
  Node* parent;
  while (isRed((parent = node->parent))) {
    Node* grandpa = parent->parent;
    Node* uncle;
    if (parent == grandpa->left) { // left branch
      uncle = grandpa->right;
      if (isRed(uncle)) { // case 1
        uncle->color = BLACK;
        parent->color = BLACK;
        grandpa->color = RED;
        node = grandpa;
      } else { // black uncle
        if (node == parent->right) { // case 3
          rotateLeft(parent);
          parent = node;
        }
        rotateRight(grandpa); // case 2
        parent->color = BLACK;
        grandpa->color = RED;
      }
    } else { // right branch
      uncle = grandpa->left;
      if (isRed(uncle)) { // case 1
        uncle->color = BLACK;
        parent->color = BLACK;
        grandpa->color = RED;
        node = grandpa;
      } else { // black uncle
        if (node == parent->left) { // case 3
          rotateRight(parent);
          parent = node;
        }
        rotateLeft(grandpa); // case 2
        parent->color = BLACK;
        grandpa->color = RED;
      }
    }
  } // accept black parent
  // keep root black
  this->root->color = BLACK;
}

void RBTree::insert(int key) {
  if (this->root == nullptr) { // empty tree
    this->root = new Node(key, nullptr);
    this->root->color = BLACK;
    return;
  }
  Node* node = this->root;
  Node* parent;
  do {
    parent = node;
    if (key < node->value) {
      node = node->left;
    } else { // key >= node->value
      node = node->right;
    }
  } while(node != nullptr);
  Node* newNode = new Node(key, parent);
  if (key < parent->value) {
    parent->left = newNode;
  } else { // key >= parent->value
    parent->right = newNode;
  }
  fixInsertion(newNode);
}
```

红黑树只有在新出现红色结点时才需要调整，因此平衡调整的改动要比AVL树少，一般来说效率更高，也因为
这一点，上面的实现采用了父结点指针的方式实现回溯，避免了低效的遍历每一层结点

插入操作可以总结出以下几个要点：
* 新增的元素都作为红色结点插入，因为特性3要比特性4更容易验证，当检测到两个连续的红色结点时，则
说明需要调整了
* 如果调整后根结点被置为了红色，则可以直接置为黑色，而不违反任何特性
* 如果新结点的父结点是黑色的，不违反任何特性，不需要调整
* 如果新结点的父结点是红色的，则新结点和父结点是两个连续的红色结点，需要分三种情况作调整
    1. 如果叔结点也是红色的，则只需要颜色变换，将父结点和叔结点置为黑色，将祖父结点置为红色
    2. 如果叔结点是黑色的，且子树呈直线形，则进行单旋变换，并将变换后的子树根结点置为黑色，将其
    两孩子置为红色
    3. 如果叔结点是黑色的，且子树呈折线形，则进行双旋变换，并将变换后的子树根结点置为黑色，将其
    两孩子置为红色

现在重点问题来了，那就是算法这样设计的原因是什么，为什么结点的颜色就可以作为平衡判定的依据呢？

因为 **红黑树是2-3-4树的等价形式**

参考资料：  
[1] [wikipedia - 2–3 tree](https://en.wikipedia.org/wiki/2%E2%80%933_tree)  
[2] [wikipedia - red-black tree](https://en.wikipedia.org/wiki/Red%E2%80%93black_tree)  
[3] [R. Sedgewick and K. Wayne Algorithms-4th - Balanced Search Trees](https://algs4.cs.princeton.edu/33balanced/)  
