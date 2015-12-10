---
layout: post
title: Longest Substring Without Repeating Characters
date: 2015-12-10 21:30:00 +0800
tags:
  - algorithm
  - OJ
  - leetcode
---
Question
--------
> Given a string, find the length of the longest substring without repeating
  characters. For example, the longest substring without repeating letters for
  "abcabcbb" is "abc", which the length is 3. For "bbbbb" the longest substring
  is "b", with the length of 1.

Solution
--------

```cpp
#include <string>
#include <map>
#include <cmath>
using namespace std;

class Solution {
public:
  int lengthOfLongestSubstring(string s) {
    map<char, int> record;
    int maxLength = 0;
    int start = 0;  // start index of current substring
    for (int i = 0; i < s.length(); i++) {
      char c = s[i];
      if (record.count(c) == 0) {  // c is never occured before
        maxLength = max(maxLength, i - start + 1);  // c is accepted
        record[c] = i;  // record the index
      } else {  // c is a repeating char
        // repeating chars existed, and they are at the start and the end of
        // current substring, move out the repeating char at the start
        int last = record[c];
        if (last >= start) {
          start = last + 1;  // start substring from the next position
        }
        maxLength = max(maxLength, i - start + 1);
        record[c] = i;  // update the index to i as the last occured
      }
    }
    return maxLength;
  }
};
```

Test Cases
----------

```cpp
Solution sol;

TEST(NRCS, Case1) {
  string s = "abcabcbb";
  int len = sol.lengthOfLongestSubstring(s);
  ASSERT_EQ(3, len);
}

TEST(NRCS, Case2) {
  string s = "aabcad";
  int len = sol.lengthOfLongestSubstring(s);
  ASSERT_EQ(4, len);
}

TEST(NRCS, Case3) {
  string s = "";
  int len = sol.lengthOfLongestSubstring(s);
  ASSERT_EQ(0, len);
}

TEST(NRCS, Case4) {
  string s = "abba";
  int len = sol.lengthOfLongestSubstring(s);
  ASSERT_EQ(2, len);
}

TEST(NRCS, Case5) {
  string s = "abbc";
  int len = sol.lengthOfLongestSubstring(s);
  ASSERT_EQ(2, len);
}

TEST(NRCS, Case6) {
  string s = "abbcdea";
  int len = sol.lengthOfLongestSubstring(s);
  ASSERT_EQ(5, len);
}
```
