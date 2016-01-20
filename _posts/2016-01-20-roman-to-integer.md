---
layout: post
title: Roman to Integer
date: 2016-01-20 20:40:18 +0800
tags:
  - algorithm
  - OJ
  - leetcode
---

Question
--------

> Given a roman numeral, convert it to an integer.

> Input is guaranteed to be within the range from 1 to 3999.

Solution
--------

```cpp
#include <string>
#include <map>
using namespace std;

map<char, int> table;

class Solution {
public:
  Solution() {
    table['I'] = 1;
    table['V'] = 5;
    table['X'] = 10;
    table['L'] = 50;
    table['C'] = 100;
    table['D'] = 500;
    table['M'] = 1000;
  }

  int romanToInt(string s) {
    int result = 0;
    for (int i = 0; i < s.length();) {
      int value = table[s[i]];
      int next = 0;
      if (i < s.length() - 1) {
        next = table[s[i + 1]];
      }
      if (next > value) {
        result += next - value;
        i += 2;
      } else {
        result += value;
        i++;
      }
    }
    return result;
  }
};
```

Test Cases
----------

```cpp
Solution sol;

TEST(FromRoman, Case1) {
  EXPECT_EQ(sol.romanToInt("III"), 3);
}

TEST(FromRoman, Case2) {
  EXPECT_EQ(sol.romanToInt("IV"), 4);
}

TEST(FromRoman, Case3) {
  EXPECT_EQ(sol.romanToInt("XIV"), 14);
}

TEST(FromRoman, Case4) {
  EXPECT_EQ(sol.romanToInt("MCMXCIX"), 1999);
}
```
