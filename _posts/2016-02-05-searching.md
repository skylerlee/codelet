---
layout: post
title: 搜索
date: 2016-02-05 20:05:00 +0800
tags:
  - study
  - algorithm
use_require: true
require_math: true
---

## 二分查找
对于已排序的数组，通过二分查找可以在\\(O(log(n))\\)的时间复杂度内判断某个元素是否存在，并得到
元素的下标

```cpp
int binary_search(int arr[], int length, int key) {
  int low = 0;
  int high = length - 1;
  int mid;
  while (low <= high) {
    mid = low + (high - low) / 2;
    if (key < arr[mid]) {
      high = mid - 1;
    } else if (key > arr[mid]) {
      low = mid + 1;
    } else { // key == arr[mid]
      return mid;
    }
  }
  return -1;
}
```

排序数组的查找效率很高，但是插入和删除操作的复杂度都是\\(O(n)\\)，因此不适合大规模的增删数据

## 二叉搜索树
二叉搜索树满足一个性质：对于任意一个结点，它的关键字大于或等于左子树上所有结点的关键字，且小于或
等于右子树上所有结点的关键字

```cpp
struct Node {
  Node(int value)
  : value(value),
    left(nullptr),
    right(nullptr) {}

  int value;
  Node* left;
  Node* right;
};

class BSTree {
public:
  BSTree()
  : root(nullptr) {}
private:
  Node* root;
};

Node* BSTree::search(int key) {
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

此外还可以在二叉搜索树上查找最值，查找某个元素的前驱和后继等，这里就不展开了，具体请参考算法导论
第12章（minimum maximum successor predecessor），这些算法的平均复杂度为\\(O(h)\\)，即
正比于二叉树的高度

下面再看看结点的插入和删除

```cpp
void BSTree::insert(int key) {
  Node* newNode = new Node(key);
  if (this->root == nullptr) { // empty tree
    this->root = newNode;
    return;
  }
  Node* node = this->root;
  Node* parent;
  while (node != nullptr) {
    parent = node;
    if (key < node->value) {
      node = node->left;
    } else { // key >= node->value
      node = node->right;
    }
  }
  if (key < parent->value) {
    parent->left = newNode;
  } else { // key >= parent->value
    parent->right = newNode;
  }
}

Node* BSTree::removeMin(Node* node, Node*& removal) {
  if (node == nullptr) { // empty subtree
    return nullptr;
  }
  if (node->left != nullptr) {
    node->left = removeMin(node->left, removal);
    return node;
  } else { // node->left == nullptr
    removal = node;
    return node->right;
  }
}

Node* BSTree::remove(Node* node, int key, Node*& removal) {
  if (node == nullptr) { // empty tree
    return nullptr;
  }
  if (key < node->value) {
    node->left = remove(node->left, key, removal);
    return node;
  } else if (key > node->value) {
    node->right = remove(node->right, key, removal);
    return node;
  } else { // key == node->value
    // node to be removed
    removal = node;
    if (node->left == nullptr && node->right == nullptr) { // d == 0
      return nullptr;
    } else if (node->left == nullptr) { // d == 1
      return node->right;
    } else if (node->right == nullptr) { // d == 1
      return node->left;
    } else { // d == 2
      // replace by successor
      Node* min;
      node->right = removeMin(node->right, min);
      min->left = node->left;
      min->right = node->right;
      return min;
    }
  }
}

Node* BSTree::remove(int key) {
  Node* removed = nullptr;
  this->root = remove(this->root, key, removed);
  if (removed != nullptr) { // cleanup
    removed->left = nullptr;
    removed->right = nullptr;
  }
  return removed;
}
```

以上`insert`和`remove`两个方法的复杂度也是\\(O(h)\\)，但是当输入序列有序时，树高会增长为n，
二叉树退化为链表，导致所有操作的复杂度都退化为\\(O(n)\\)，因此我们应该使二叉树的高度尽量接近于
\\(log(n)\\)，以此获得更好的性能

注意：以上的实现都允许有重复关键字存在，相等关键字会出现在右子树中，因此不是一般set接口的实现

## AVL树
AVL树是经过改进的二叉搜索树，它除了满足二叉搜索树的性质之外，还要求任意结点的左子树和右子树高度
之差不超过1

AVL树是一种自平衡二叉搜索树，对于由插入删除操作引起的不平衡，AVL树可以通过旋转子树达到再平衡，
而判别树是否平衡的依据是其结点的平衡因子(balance factor)。下面的代码实现里，结点的`height`
属性表示结点的高（即以此结点为根的子树的树高），平衡因子等于右子树和左子树的高度之差，当高度差的
绝对值大于或等于2时，表明子树不平衡，需要进行旋转直到达到再平衡

```cpp
struct Node {
  Node(int value)
  : value(value),
    height(0),
    left(nullptr),
    right(nullptr) {}

  int value;
  int height;
  Node* left;
  Node* right;
};

inline int height(Node* node) {
  return node == nullptr ? -1 : node->height;
}

inline int balanceFactor(Node* node) {
  return height(node->right) - height(node->left);
}

Node* AVLTree::rotateLeft(Node* node) {
  Node* pivot = node->right;
  node->right = pivot->left;
  pivot->left = node;
  // update height
  node->height = max(height(node->left), height(node->right)) + 1;
  pivot->height = max(height(pivot->left), height(pivot->right)) + 1;
  return pivot;
}

Node* AVLTree::rotateRight(Node* node) {
  Node* pivot = node->left;
  node->left = pivot->right;
  pivot->right = node;
  // update height
  node->height = max(height(node->left), height(node->right)) + 1;
  pivot->height = max(height(pivot->left), height(pivot->right)) + 1;
  return pivot;
}

Node* AVLTree::balance(Node* node) {
  int bf = balanceFactor(node);
  if (bf < -1) { // left is higher
    if (balanceFactor(node->left) > 0) { // right is higher
      node->left = rotateLeft(node->left);
    }
    return rotateRight(node);
  }
  if (bf > 1) { // right is higher
    if (balanceFactor(node->right) < 0) { // left is higher
      node->right = rotateRight(node->right);
    }
    return rotateLeft(node);
  }
  return node;
}
```

以上就是AVL树的平衡算法实现，由于双旋实际上可以由两次单旋组合而成，因此没有单独实现。具体来说，
当检测到当前子树不平衡时，就需要将子树向较低的一边旋转，此时还需要对子树的形状做判断，如果子树呈
直线形，则进行单旋，如果子树呈折线形，则进行双旋变换，最终都要实现子树的重新平衡

```cpp
Node* AVLTree::insert(Node* node, int key) {
  if (node == nullptr) {
    return new Node(key);
  }
  if (key < node->value) {
    node->left = insert(node->left, key);
  } else { // key >= node->value
    node->right = insert(node->right, key);
  }
  // update height upwards
  node->height = max(height(node->left), height(node->right)) + 1;
  return balance(node);
}

void AVLTree::insert(int key) {
  this->root = insert(this->root, key);
}

Node* AVLTree::removeMin(Node* node, Node*& removal) {
  if (node == nullptr) { // empty subtree
    return nullptr;
  }
  if (node->left != nullptr) {
    node->left = removeMin(node->left, removal);
  } else { // node->left == nullptr
    removal = node;
    return node->right;
  }
  // update height upwards
  node->height = max(height(node->left), height(node->right)) + 1;
  return balance(node);
}

Node* AVLTree::remove(Node* node, int key, Node*& removal) {
  if (node == nullptr) { // empty tree
    return nullptr;
  }
  if (key < node->value) {
    node->left = remove(node->left, key, removal);
  } else if (key > node->value) {
    node->right = remove(node->right, key, removal);
  } else { // key == node->value
    // node to be removed
    removal = node;
    if (node->left == nullptr && node->right == nullptr) { // d == 0
      return nullptr;
    } else if (node->left == nullptr) { // d == 1
      return node->right;
    } else if (node->right == nullptr) { // d == 1
      return node->left;
    } else { // d == 2
      // replace by successor
      Node* min;
      node->right = removeMin(node->right, min);
      min->left = node->left;
      min->right = node->right;
      node = min; // as current node
    }
  }
  // update height upwards
  node->height = max(height(node->left), height(node->right)) + 1;
  return balance(node);
}

Node* AVLTree::remove(int key) {
  Node* removed = nullptr;
  this->root = remove(this->root, key, removed);
  if (removed != nullptr) { // cleanup
    removed->left = nullptr;
    removed->right = nullptr;
    removed->height = 0;
  }
  return removed;
}
```

不同于普通的BST，AVL树的插入删除操作都需要更新结点的高，因此这里需要利用递归实现向上遍历，其实
除了使用递归，还可以通过双亲指针，甚至栈的方式来实现回退

AVL树始终都可以保持平衡，因此在任何情况下它的查找复杂度都是\\(O(log(n))\\)

## 红黑树
红黑树是一种重要的自平衡树，常用于实现集合、字典等数据结构，限于篇幅，只能另外开篇介绍了

参考资料：  
[1] [Thomas H. Cormen Introduction to algorithms](https://mitpress.mit.edu/books/introduction-algorithms)  
[2] [R. Sedgewick and K. Wayne Algorithms-4th - BinarySearchTree](https://algs4.cs.princeton.edu/32bst/)  
[3] [R. Sedgewick and K. Wayne Algorithms-4th - AVLTreeST](https://algs4.cs.princeton.edu/code/edu/princeton/cs/algs4/AVLTreeST.java.html)  
