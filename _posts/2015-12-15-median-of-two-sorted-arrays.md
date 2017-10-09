---
layout: post
title: Median of Two Sorted Arrays
date: 2015-12-15 18:08:06 +0800
tags:
  - algorithm
  - OJ
  - leetcode
use_math: true
---

Question
--------

> There are two sorted arrays nums1 and nums2 of size m and n respectively. Find
  the median of the two sorted arrays. The overall run time complexity should be
  \\(O(log (m+n))\\).

Solution
--------

```cpp
#include <vector>
#include <cmath>
using namespace std;

class Solution {
public:
  int findKthNumber(int* b1, int* e1,
                    int* b2, int* e2,
                    int k) {
    // base cases
    if (b1 == e1) {  // array1 is empty
      return b2[k - 1];  // find in array2
    }
    if (b2 == e2) {  // array2 is empty
      return b1[k - 1];  // find in array1
    }
    if (k == 1) {
      return min(b1[0], b2[0]);
    }
    // recursive cases
    int i, j;  // partition by i and j
    int l1 = e1 - b1;
    int l2 = e2 - b2;
    if (l1 < l2) {
      i = min(k / 2, l1);
      j = k - i;  // make sure i + j = k
    } else {
      j = min(k / 2, l2);
      i = k - j;  // make sure i + j = k
    }
    int n1 = b1[i - 1];  // find i-th element in b1
    int n2 = b2[j - 1];  // find j-th element in b2
    if (n1 == n2) {
      return n1;  // n1(n2) is the k-th number
    } else if (n1 < n2) {
      return findKthNumber(b1 + i, e1,
                           b2, b2 + j,
                           k - i);
    } else {  // n1 > n2
      return findKthNumber(b1, b1 + i,
                           b2 + j, e2,
                           k - j);
    }
  }

  double findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2) {
    int m = nums1.size();
    int n = nums2.size();
    if ((m + n) % 2 == 1) {  // m + n is odd
      int k = (m + n + 1) / 2;
      return findKthNumber(&(*nums1.begin()), &(*nums1.end()),
                           &(*nums2.begin()), &(*nums2.end()),
                           k);
    } else {  // m + n is even
      int k = (m + n) / 2;
      int a = findKthNumber(&(*nums1.begin()), &(*nums1.end()),
                            &(*nums2.begin()), &(*nums2.end()),
                            k);
      int b = findKthNumber(&(*nums1.begin()), &(*nums1.end()),
                            &(*nums2.begin()), &(*nums2.end()),
                            k + 1);
      return (a + b) / 2.0;
    }
  }
};
```
