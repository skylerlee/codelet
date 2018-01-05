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
    while (i <= j && digits[i] == digits[j]) {
      i++;
      j--;
    }
    return i > j;
  }
};
```

上面的代码虽然通过了OJ，但使用了`int[10]`的栈空间，还是不符合题目的要求

```cpp
class Solution {
public:
  bool isPalindrome(int x) {
    if (x < 0) {
      return false;
    }
    long long r = 0; // reversed
    int n = x;
    while (n > 0) {
      r = r * 10 + (n % 10);
      n = n / 10;
    }
    while (x > 0) {
      if (x % 10 != r % 10) {
        return false;
      }
      x = x / 10;
      r = r / 10;
    }
    return true;
  }
};
```

这种做法就是通过计算`r = r * 10 + d`，将数位反转过来，同时使用`long long`类型来避免上溢出，
可是有没有更好的解法呢？

其实这种进制相关的问题都有一个难点，就在于模运算每次只能取得个位，而不好取得最高位。我们只要能够
做到在循环内同时访问最高位和最低位，那么就可以进行回文判断了。而要做到这一点，首先就要取得数字的
最高位数，具体可以通过1不断自乘10来得到数量级，然后最高位就可以通过除法得到，最后数字本身取模，
进入下一次迭代，代码如下：

```cpp
class Solution {
public:
  bool isPalindrome(int x) {
    if (x < 0) {
      return false;
    }
    int n = 1; // highest digit
    while (x / 10 >= n) {
      n = n * 10;
    }
    int y = x;
    int l, h; // lower higher digit
    while (y > 0) {
      l = x % 10;
      h = y / n;
      if (l != h) {
        return false;
      }
      x = x / 10;
      y = y % n;
      n = n / 10;
    }
    return true;
  }
};
```
