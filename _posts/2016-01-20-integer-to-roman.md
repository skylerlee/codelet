---
layout: post
title: Integer to Roman
date: 2016-01-20 20:13:30 +0800
tags:
  - algorithm
  - OJ
  - leetcode
---

Question
--------

> Given an integer, convert it to a roman numeral.

> Input is guaranteed to be within the range from 1 to 3999.

Solution
--------

```cpp
#include <string>
using namespace std;

const char* NUMS[4][10] = {
  // 0    1     2      3     4    5     6      7       8     9
  { "", "M", "MM", "MMM"                                       }, // 1000
  { "", "C", "CC", "CCC", "CD", "D", "DC", "DCC", "DCCC", "CM" }, // 100
  { "", "X", "XX", "XXX", "XL", "L", "LX", "LXX", "LXXX", "XC" }, // 10
  { "", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX" }, // 1
};

class Solution {
public:
  string intToRoman(int num) {
    int k = num / 1000;
    int h = num % 1000 / 100;
    int t = num % 100 / 10;
    int d = num % 10;
    string result = "";
    result.append(NUMS[0][k]);
    result.append(NUMS[1][h]);
    result.append(NUMS[2][t]);
    result.append(NUMS[3][d]);
    return result;
  }
};
```

Test Cases
----------

```cpp
Solution sol;

TEST(ToRoman, Case1) {
  EXPECT_EQ(sol.intToRoman(3), "III");
}

TEST(ToRoman, Case2) {
  EXPECT_EQ(sol.intToRoman(4), "IV");
}

TEST(ToRoman, Case3) {
  EXPECT_EQ(sol.intToRoman(14), "XIV");
}

TEST(ToRoman, Case4) {
  EXPECT_EQ(sol.intToRoman(1999), "MCMXCIX");
}
```
