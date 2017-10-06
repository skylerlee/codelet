---
layout: post
title: ZigZag Conversion
date: 2015-12-19 15:05:58 +0800
tags:
  - algorithm
  - OJ
  - leetcode
---

Question
--------

> The string "PAYPALISHIRING" is written in a zigzag pattern on a given number
  of rows like this: (you may want to display this pattern in a fixed font for
  better legibility)

>     P   A   H   N
>     A P L S I I G
>     Y   I   R

> And then read line by line: `"PAHNAPLSIIGYIR"`

> Write the code that will take a string and make this conversion given a number
  of rows:

>     string convert(string text, int nRows);

> `convert("PAYPALISHIRING", 3)` should return `"PAHNAPLSIIGYIR"`.

Solution
--------

```cpp
#include <string>
using namespace std;

class Solution {
public:
  string convert(string s, int numRows) {
    if (numRows == 1) {
      return s;
    }
    const int size = s.length();
    string result;
    for (int row = 0; row < numRows; row++) {
      const int delta1 = 2 * (numRows - row - 1);
      const int delta2 = 2 * (numRows - 1);
      int step = 0;
      int pos = row;
      while (pos < size) {
        result.push_back(s[pos]);
        step++;
        if (row == 0) {
          pos += delta1;
        } else if (row == numRows - 1) {
          pos += delta2;
        } else {
          if (step % 2 == 1) {
            pos += delta1;
          } else {
            pos += 2 * row;
          }
        }
      }
    }
    return result;
  }
};
```
