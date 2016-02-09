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
  int value;
  Node* left;
  Node* right;
};

Node* BST_search(Node* root, int key) {
  while (root != nullptr) {
    if (key < root->value) {
      root = root->left;
    } else if (key > root->value) {
      root = root->right;
    } else { // key == root->value
      return root;
    }
  }
  return nullptr;
}
```

此外还可以在二叉搜索树上查找最值，查找某个元素的前驱和后继等，这里就不展开了，具体请参考算法导论
第12章（minimum maximum successor predecessor），这些算法的平均复杂度为\\(O(h)\\)，即
正比于二叉树的高度

参考资料：  
[1] [Thomas H. Cormen Introduction to algorithms](https://mitpress.mit.edu/books/introduction-algorithms)
