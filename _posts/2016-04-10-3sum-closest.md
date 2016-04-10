---
layout: post
title: 3Sum Closest
date: 2016-04-10 19:19:30 +0800
tags:
  - algorithm
  - OJ
  - leetcode
---

Question
--------

> Given an array S of n integers, find three integers in S such that the sum is
  closest to a given number, target. Return the sum of the three integers.
  You may assume that each input would have exactly one solution.

>     For example, given array S = {-1 2 1 -4}, and target = 1.
>     The sum that is closest to the target is 2. (-1 + 2 + 1 = 2).

Solution
--------

```cpp
#include <vector>
#include <algorithm>
#include <cmath>
#include <climits>
using namespace std;

class Solution {
public:
  int threeSumClosest(vector<int>& nums, int target) {
    sort(nums.begin(), nums.end(), less<int>());
    vector<int>::iterator it0, it1, it2;
    int closest = INT_MAX;
    int distance = INT_MAX;
    for (it0 = nums.begin(); it0 < nums.end(); it0++) {
      it1 = it0 + 1;
      it2 = nums.end() - 1;
      while (it1 < it2) {
        int sum = *it0 + *it1 + *it2;
        if (abs(sum - target) < distance) {
          closest = sum;
          distance = abs(sum - target);
        }
        if (sum < target) {
          it1++;
        } else if (sum > target) {
          it2--;
        } else {
          // equal is the closest
          return sum;
        }
      }
    }
    return closest;
  }
};
```
