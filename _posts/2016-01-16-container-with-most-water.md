---
layout: post
title: Container With Most Water
date: 2016-01-16 22:00:12 +0800
tags:
  - algorithm
  - OJ
  - leetcode
---

Question
--------

> Given n non-negative integers \\(a_1, a_2, ..., a_n\\), where each represents
  a point at coordinate \\((i, a_i)\\). n vertical lines are drawn such that the
  two endpoints of line i is at \\((i, a_i)\\) and \\((i, 0)\\). Find two lines,
  which together with x-axis forms a container, such that the container contains
  the most water.

> Note: You may not slant the container.

Solution
--------

```cpp
#include <vector>
#include <cmath>
using namespace std;

// Brute force
class Solution {
public:
  int maxArea(vector<int>& height) {
    const int size = height.size();
    int maxValue = 0;
    for (int i = 0; i < size; i++) {
      for (int j = i + 1; j < size; j++) {
        int area = (j - i) * min(height[i], height[j]);
        maxValue = max(maxValue, area);
      }
    }
    return maxValue;
  }
};
```

```cpp
#include <vector>
#include <cmath>
using namespace std;

class Solution {
public:
  int maxArea(vector<int>& height) {
    vector<int>::iterator p, q;
    p = height.begin();
    q = height.end() - 1;
    int maxValue = 0;
    while (p < q) {
      int area;
      if (*p < *q) {
        area = *p * (q - p);
        p++;
      } else {
        area = *q * (q - p);
        q--;
      }
      maxValue = max(maxValue, area);
    }
    return maxValue;
  }
};
```
