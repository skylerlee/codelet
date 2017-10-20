---
layout: post
title: Container With Most Water
date: 2016-01-16 22:00:12 +0800
tags:
  - algorithm
  - OJ
  - leetcode
use_require: true
require_math: true
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
* Brute Force

```cpp
#include <vector>
#include <cmath>
using namespace std;

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

* Two Pointers

\\(area = width * min(left, right)\\) \\
\\(width\\)的取值可以是 \\([n - 1 .. 1]\\) \\
假设 \\(left < right\\)，则 \\(area = width * left\\) \\
当 \\(width = width' - 1\\) 时，\\(area\\)有两种取值：

- \\(area_1 = (width - 1) * min(left, right_2)\\)
- \\(area_2 = (width - 1) * min(left_2, right)\\)

因为 \\(min(left, right_2) <= left\\)，所以 \\(area_1 < area\\) \\
只需要比较\\(area, area_2\\)即可

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
