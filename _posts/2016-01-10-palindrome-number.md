---
layout: post
title: Palindrome Number
date: 2016-01-10 22:13:58 +0800
tags:
  - algorithm
  - OJ
  - leetcode
---

Question
--------

> Determine whether an integer is a palindrome. Do this without extra space.

今天又看到了这个问题，有下面几点需要注意，再回顾一下吧
1. 不准使用额外空间
2. 针对负数的处理
3. 整数的溢出问题

Solution
--------

```cpp
class Solution {
public:
  bool isPalindrome(int x) {
    if (x < 0) {
      return false;
    }
    int digits[10];
    int length = 0;
    while (x > 0) {
      digits[length++] = x % 10;
      x = x / 10;
    }
    int i = 0;
    int j = length - 1;
    while (digits[i] == digits[j] && i <= j) {
      i++;
      j--;
    }
    if (i > j) {
      return true;
    } else {
      return false;
    }
  }
};
```
