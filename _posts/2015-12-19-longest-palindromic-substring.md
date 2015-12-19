---
layout: post
title: Longest Palindromic Substring
date: 2015-12-19 10:00:34 +0800
tags:
  - algorithm
  - OJ
  - leetcode
---
Question
--------
> Given a string S, find the longest palindromic substring in S. You may assume
  that the maximum length of S is 1000, and there exists one unique longest
  palindromic substring.

Solution
--------

```cpp
#include <string>
#include <utility>
using namespace std;

class Solution {
public:
  typedef string::const_iterator Iter;
  typedef pair<Iter, Iter> Range;

  Range longerPalindrome(Range range, Range cursor, Range prev) {
    Iter b = range.first;
    Iter e = range.second;
    Iter l = cursor.first;
    Iter r = cursor.second;
    while (l >= b && r < e && *l == *r) {
      l--;
      r++;
    }
    Range result = make_pair(l + 1, r);
    if (result.second - result.first > prev.second - prev.first) {
      return result;
    } else {
      return prev;
    }
  }

  string longestPalindrome(string s) {
    Range range = make_pair(s.begin(), s.end());
    Range result = make_pair(s.begin(), s.begin());
    for (Iter i = range.first; i < range.second; i++) {
      result = longerPalindrome(range, make_pair(i, i), result);
      result = longerPalindrome(range, make_pair(i, i + 1), result);
    }
    return string(result.first, result.second);
  }
};
```

* Dynamic programming

| i:j |     |     |     |     |
|:---:|:---:|:---:|:---:|:---:|
| 0,0 | 0,1 | 0,2 | 0,3 | 0,4 |
|     | 1,1 | 1,2 | 1,3 | 1,4 |
|     |     | 2,2 | 2,3 | 2,4 |
|     |     |     | 3,3 | 3,4 |
|     |     |     |     | 4,4 |

```
have j >= i
all (i:j) where i == j     -> true
all (i:j) where i == j - 1 -> compare(i,j)
==>
(i:j) -> compare(i,j) and (i+1:j-1)
# (i+1:j-1) is at the left-down of (i:j)
longest -> (i:j) where j - i == max
# the greater j - i the more right-up for (i:j)
```

```cpp
#include <string>
using namespace std;

class Solution {
public:
  string longestPalindrome(string s) {
    const int size = s.length();
    bool dp[1000][1000];
    int begin, length;
    // For substr length == 1
    for (int i = 0; i < size; i++) {
      dp[i][i] = true;
      begin = i;
      length = 1;
    }
    // For length == 2
    for (int i = 0; i < size - 1; i++) {
      bool result = s[i] == s[i + 1];
      dp[i][i + 1] = result;
      if (result) {
        begin = i;
        length = 2;
      }
    }
    // For length >= 3
    for (int len = 3; len <= size; len++) {
      for (int i = 0; i < size - len + 1; i++) {
        int j = i + len - 1;
        bool result = dp[i + 1][j - 1] && s[i] == s[j];
        dp[i][j] = result;
        if (result) {
          begin = i;
          length = len;
        }
      }
    }
    return s.substr(begin, length);
  }
};
```

Test Cases
----------

```cpp
Solution sol;

TEST(LPS, Case1) {
  string s = "abbaccab";
  string r = sol.longestPalindrome(s);
  ASSERT_EQ("baccab", r);
}

TEST(LPS, Case2) {
  string s = "a";
  string r = sol.longestPalindrome(s);
  ASSERT_EQ("a", r);
}

TEST(LPS, Case3) {
  string s = "abb";
  string r = sol.longestPalindrome(s);
  ASSERT_EQ("bb", r);
}

TEST(LPS, Case4) {
  string s = "bbc";
  string r = sol.longestPalindrome(s);
  ASSERT_EQ("bb", r);
}
```
