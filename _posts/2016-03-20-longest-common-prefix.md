---
layout: post
title: Longest Common Prefix
date: 2016-03-20 00:30:54 +0800
tags:
  - algorithm
  - OJ
  - leetcode
---

Question
--------

> Write a function to find the longest common prefix string amongst an array of
  strings.

Solution
--------

```cpp
#include <vector>
#include <string>
using namespace std;

class Solution {
public:
  string longestCommonPrefix(vector<string>& strs) {
    if (strs.size() == 0) {
      return "";
    }
    if (strs.size() == 1) {
      return strs[0];
    }
    string& key = strs[0];
    int cur = 0;
    while (true) {
      for (int i = 1; i < strs.size(); i++) {
        string& str = strs[i];
        if (cur >= key.length() ||
            cur >= str.length() ||
            key[cur] != str[cur]) {
          return key.substr(0, cur);
        }
      }
      cur++;
    }
  }
};
```
