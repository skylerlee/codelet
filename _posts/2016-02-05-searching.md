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
对于已排序的数组，通过二分查找可以在\\(O(log(n))\\)的时间复杂度内判断某个元素是否存在

```cpp
bool binary_search(int arr[], int length, int key) {
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
      return true;
    }
  }
  return false;
}
```
