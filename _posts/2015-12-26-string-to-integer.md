---
layout: post
title: String to Integer (atoi)
date: 2015-12-26 20:15:14 +0800
tags:
  - algorithm
  - OJ
  - leetcode
---

Question
--------
> Implement atoi to convert a string to an integer.

> **Hint:** Carefully consider all possible input cases. If you want a challenge,
  please do not see below and ask yourself what are the possible input cases.

> **Notes:** It is intended for this problem to be specified vaguely (ie, no given
  input specs). You are responsible to gather all the input requirements up front.

Solution
--------

```cpp
#include <string>
#include <climits>
using namespace std;

class Solution {
public:
  int myAtoi(string str) {
    const int threshold = INT_MAX / 10;
    const char* p = str.c_str();
    // skip white space
    while (*p == ' ') {
      p++;
    }
    // check sign
    bool negtive = false;
    if (*p == '+') {
      p++;
    } else if (*p == '-') {
      negtive = true;
      p++;
    }
    // parse
    int result = 0;
    while (*p >= '0' && *p <= '9') {
      if (result > threshold) {
        return negtive ? INT_MIN : INT_MAX;
      } else if (result == threshold) {
        int last = *p - '0';
        if (last > 7) {
          return negtive ? INT_MIN : INT_MAX;
        }
      }
      result = result * 10 + (*p - '0');
      p++;
    }
    return negtive ? -result : result;
  }
};
```
