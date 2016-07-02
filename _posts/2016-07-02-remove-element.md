---
layout: post
title: Remove Element
date: 2016-07-02 15:38:27 +0800
tags:
  - algorithm
  - OJ
  - leetcode
---

Question
--------

> Given an array and a value, remove all instances of that value in-place and
  return the new length.

> Do not allocate extra space for another array, you must do this by modifying
  the input array in-place with O(1) extra memory.

> The order of elements can be changed. It doesn't matter what you leave beyond
  the new length.

> **Example:**

>     Given nums = [3,2,2,3], val = 3,
>     Your function should return length = 2, with the first two elements of nums being 2.

Solution
--------

```cpp
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
  int removeElement(vector<int>& nums, int val) {
    sort(nums.begin(), nums.end(), less<int>());
    int i = 0;
    int j = nums.size() - 1;
    while (i < nums.size() && nums[i] != val) { i++; }
    while (j >= 0 && nums[j] != val) { j--; }
    if (i <= j) {
      // has interval of that value
      j = j + 1;
      // shift elements to left
      while (j < nums.size()) {
        nums[i] = nums[j];
        i++;
        j++;
      }
    }
    return i;
  }
};
```

* Two Pointers Swap

```cpp
#include <vector>
#include <utility>
using namespace std;

class Solution {
public:
  int removeElement(vector<int>& nums, int val) {
    if (nums.size() == 0) {
      return 0;
    }
    vector<int>::iterator lhs;
    vector<int>::iterator rhs;
    lhs = nums.begin();
    rhs = nums.end() - 1;
    int count = 0;
    while (true) {
      // find swapping pairs
      while (lhs < rhs && *lhs != val) { lhs++; }
      while (lhs <= rhs && *rhs == val) { rhs--; count++; }
      if (lhs < rhs) {
        swap(*lhs, *rhs);
      } else {
        break;
      }
    }
    return nums.size() - count;
  }
};
```

* 还有一个更简单的解法，不过我没有想到

```cpp
#include <vector>
using namespace std;

class Solution {
public:
  int removeElement(vector<int>& nums, int val) {
    int count = 0;
    for (int i = 0; i < nums.size(); i++) {
      if (nums[i] == val) {
        count++;
      } else if (count) {
        nums[i - count] = nums[i];
      }
    }
    return nums.size() - count;
  }
};
```
