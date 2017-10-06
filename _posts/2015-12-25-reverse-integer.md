---
layout: post
title: Reverse Integer
date: 2015-12-25 19:05:49 +0800
tags:
  - algorithm
  - OJ
  - leetcode
---

Question
--------

> Reverse digits of an integer.

> **Example1:** x = 123, return 321

> **Example2:** x = -123, return -321

Solution
--------

```cpp
#include <climits>

class Solution {
public:
  int reverse(int x) {
    const int threshold = INT_MAX / 10;
    bool negtive = x < 0;
    x = negtive ? -x : x;
    int result = 0;
    while (x > 0) {
      if (result > threshold) {
        return 0;
        // let a = result * 10
        // let b = x % 10
        // assume a + b > INT_MAX while result <= threshold
        // ==>
        // result <= threshold
        // -> result * 10 <= threshold * 10
        // -> a <= floor(INT_MAX / 10) * 10
        // have INT_MAX = 2147483647
        // -> a <= 2147483640
        // and have b < 10
        // a + b <= 2147483649
        // for a + b = 2147483648 or 2147483649
        // the reversed input never meet
        // so a + b <= INT_MAX
      }
      result = result * 10 + x % 10;
      x = x / 10;
    }
    return negtive ? -result : result;
  }
};
```
