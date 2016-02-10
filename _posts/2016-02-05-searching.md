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

排序数组的查找效率很高，但是插入和删除操作的复杂度都是\\(O(n)\\)，因此不适合大量的增删数据

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
