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

### 插入
和二叉搜索树一样，第一步需要找到新元素的位置，若目标结点包含的元素少于3个，说明结点未满，则直接
加入新元素即可；若结点已经含有3个元素，则需要将其分裂为一棵3结点子树，并将根结点并入上一级结点，
最后再插入新结点

## 红黑树
红黑树也是一种二叉搜索树，它除了满足二叉搜索树的性质之外，还满足以下几条性质
1. 每个结点要么是红色要么是黑色
2. 根结点和叶子结点（NIL结点）是黑色的
3. 红色结点的两个孩子都是黑色的（红色结点不允许连续出现）
4. 任意结点到其所有后代叶子结点的简单路径上，所包含的黑色结点数量相等（结点的黑高）

注意：计算结点的黑高时，路径不包含结点本身

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
  Node* grandpa;
  Node* uncle;
  while (isRed((parent = node->parent))) {
    grandpa = parent->parent;
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
          swap(node, parent);
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
          swap(node, parent);
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

其实只需要把红色结点看作是其父结点的内部结点，就可以得出2-3-4树的三种结点的等价形式：
* 2-结点：即单元素结点，等价于黑色结点
* 3-结点：具有两个内部元素，等价于一棵以黑结点为根，且仅有一个红色孩子的子树
* 4-结点：具有三个内部元素，等价于一棵以黑结点为根，且有两个红色孩子的子树

```txt
2-node    B

          B    B
3-node   /      \
        R        R

          B
4-node   / \
        R   R
```

红黑树的性质也很好解释：
* 2-3-4树的4-结点如上图所示，内部红色结点是不能连续出现的
* 红黑树结点的黑高等价于2-3-4树结点的高度，又因为2-3-4树的所有叶子结点深度相同，因此红黑树每条
到叶子结点的简单路径上都有相同数量的黑色结点

因此红黑树上的插入操作也等价于2-3-4树上的插入操作：
* 父结点是黑色时，等价于在2-结点或3-结点上新增元素，结点未满，因此不需要调整
* 父结点叔结点都是红色时，情况1等价于在4-结点上新增元素，变色等价于4-结点的分裂
* 父结点是红色叔结点是黑色时，情况2、情况3等价于3-结点并入新增或变色产生的红色结点，而旋转变换
以及颜色变换只是为了构造正确的4-结点，并保持黑色结点对应着4-结点的中间元素

### 删除

```cpp
Node* RBTree::successor(Node* node) {
  node = node->right;
  while (node->left != nullptr) {
    node = node->left;
  }
  return node;
}

void RBTree::fixDeletion(Node* node, Node* parent) {
  Node* sibling;
  Node* nephew;
  while (isBlack(node)) {
    if (parent == nullptr) { // root
      return;
    }
    if (node == parent->left) { // left branch
      sibling = parent->right;
      if (isRed(sibling)) { // case 1
        rotateLeft(parent);
        sibling->color = BLACK;
        parent->color = RED;
        sibling = parent->right;
      }
      // black sibling
      if (isBlack(sibling->left) &&
          isBlack(sibling->right)) { // case 4 or 5
        sibling->color = RED;
        node = parent;
        parent = node->parent;
      } else {
        if (isRed(nephew = sibling->left)) { // case 2
          rotateRight(sibling);
          nephew->color = BLACK;
          sibling->color = RED;
          sibling = nephew;
        }
        // red right nephew // case 3
        rotateLeft(parent);
        sibling->color = parent->color;
        parent->color = BLACK;
        sibling->right->color = BLACK;
        // done
        node = this->root;
        break;
      }
    } else { // right branch
      sibling = parent->left;
      if (isRed(sibling)) { // case 1
        rotateRight(parent);
        sibling->color = BLACK;
        parent->color = RED;
        sibling = parent->left;
      }
      // black sibling
      if (isBlack(sibling->left) &&
          isBlack(sibling->right)) { // case 4 or 5
        sibling->color = RED;
        node = parent;
        parent = node->parent;
      } else {
        if (isRed(nephew = sibling->right)) { // case 2
          rotateLeft(sibling);
          nephew->color = BLACK;
          sibling->color = RED;
          sibling = nephew;
        }
        // red left nephew // case 3
        rotateRight(parent);
        sibling->color = parent->color;
        parent->color = BLACK;
        sibling->left->color = BLACK;
        // done
        node = this->root;
        break;
      }
    }
  } // accept red node
  // set node to black
  node->color = BLACK;
}

Node* RBTree::removeNode(Node* node) {
  if (node->left != nullptr && node->right != nullptr) { // degree 2
    Node* succ = successor(node);
    swap(node->value, succ->value);
    node = succ;
  }
  Node* replacement;
  if (node->left == nullptr) { // degree 0 or 1
    replacement = node->right;
  } else { // degree 1
    replacement = node->left;
  }
  // replace node
  Node* parent = node->parent;
  if (parent == nullptr) { // root
    this->root = replacement;
  } else if (node == parent->left) {
    parent->left = replacement;
  } else { // node == parent->right
    parent->right = replacement;
  }
  if (replacement != nullptr) {
    replacement->parent = parent;
  }
  if (isBlack(node)) {
    fixDeletion(replacement, parent);
  }
  return node;
}

Node* RBTree::remove(int key) {
  Node* node = this->root;
  while (node != nullptr) {
    if (key < node->value) {
      node = node->left;
    } else if (key > node->value) {
      node = node->right;
    } else { // key == node->value
      Node* removed = removeNode(node);
      // unlink node
      removed->left = nullptr;
      removed->right = nullptr;
      removed->parent = nullptr;
      return removed;
    }
  }
  return nullptr;
}
```

相比于插入操作，红黑树的删除要复杂一些

首先需要找到待删除的结点，如果待删除的结点有2个孩子，只需要将此结点与它的中序后继交换，此时问题
就转化为删除它的后继结点，而后继结点必然只有1个或0个孩子，因此下面待删除的结点的孩子不会多于1个
* 如果待删除的结点是红色的，则直接删除不违反任何特性，不需要调整
* 如果待删除的结点是黑色的，则删除后本侧子树的黑高减少1，需要讨论替补结点
  * 若替补结点是红色的，则将其置为黑色即可填补减少的黑高
  * 若替补结点也是黑色的，则需要在对侧子树上继续讨论

参考资料：  
[1] [wikipedia - 2–3 tree](https://en.wikipedia.org/wiki/2%E2%80%933_tree)  
[2] [wikipedia - red-black tree](https://en.wikipedia.org/wiki/Red%E2%80%93black_tree)  
[3] [R. Sedgewick and K. Wayne Algorithms-4th - Balanced Search Trees](https://algs4.cs.princeton.edu/33balanced/)  
[4] [red-black tree deletion](https://www.cnblogs.com/tongy0/p/5460623.html)  
