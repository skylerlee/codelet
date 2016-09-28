---
layout: post
title: Permutations
date: 2016-09-22 19:59:50 +0800
tags:
  - algorithm
  - OJ
  - leetcode
---

Question
--------

> Given a collection of distinct numbers, return all possible permutations.

> For example,
> `[1,2,3]` have the following permutations:

>     [
>       [1,2,3],
>       [1,3,2],
>       [2,1,3],
>       [2,3,1],
>       [3,1,2],
>       [3,2,1]
>     ]

其实一直都不怎么会排列组合的算法，今天好好研究了一番，现在做一下记录

Solution
--------

* 思路：首元素交换+递归

```cpp
#include <vector>
#include <utility>
using namespace std;

class Solution {
public:
  vector<vector<int>> permute(vector<int>& nums) {
    vector<vector<int>> result;
    if (nums.size() == 1) {
      result.push_back(nums);
      return result;
    }
    for (int i = 0; i < nums.size(); i++) {
      swap(nums[0], nums[i]);
      int head = nums[0];
      vector<int> sub(nums.begin() + 1, nums.end());
      vector<vector<int>> tmp = permute(sub);
      for (int j = 0; j < tmp.size(); j++) {
        vector<int>& ref = tmp[j];
        ref.insert(ref.begin(), head);
        result.push_back(ref);
      }
      swap(nums[0], nums[i]);
    }
    return result;
  }
};
```

* 第一种解法很直观，但是中间涉及了临时向量的开辟与首元素插入，产生了不必要的开销；
  而且递归的返回值是vector，我用的是笛卡儿积（Cartesian product）的形式追加结果，应该还可以
  继续优化

  下面是解法二：引用结果+直接修改 拷贝追加

```cpp
#include <vector>
#include <utility>
using namespace std;

typedef vector<int> VecInt;

class Solution {
public:
  vector<vector<int>> permute(vector<int>& nums) {
    vector<vector<int>> result;
    permuteHelper(result, nums, 0, nums.size());
    return result;
  }

  void permuteHelper(vector<VecInt>& result,
                     VecInt& nums,
                     int begin,
                     int end) {
    if (end - begin == 1) { // length 1
      result.push_back(nums);
    }
    for (int i = begin; i < end; i++) {
      swap(nums[begin], nums[i]);
      permuteHelper(result, nums, begin + 1, end);
      swap(nums[begin], nums[i]);
    }
  }
};
```
