---
layout: post
title: Letter Combinations of a Phone Number
date: 2016-05-15 17:08:33 +0800
tags:
  - algorithm
  - OJ
  - leetcode
---

Question
--------

> Given a digit string, return all possible letter combinations that the number
  could represent.

> A mapping of digit to letters (just like on the telephone buttons) is given
  below.

>     Input:Digit string "23"
>     Output: ["ad", "ae", "af", "bd", "be", "bf", "cd", "ce", "cf"].

> **Note:**  
> Although the above answer is in lexicographical order, your answer could be
  in any order you want.

Solution
--------

```cpp
#include <string>
#include <vector>
using namespace std;

string letter_map[10] = {
  "",     // 0
  "",     // 1
  "abc",  // 2
  "def",  // 3
  "ghi",  // 4
  "jkl",  // 5
  "mno",  // 6
  "pqrs", // 7
  "tuv",  // 8
  "wxyz"  // 9
};

class Solution {
public:
  vector<string> letterCombinations(string digits) {
    vector<string> result;
    if (digits.length() == 0) {
      // empty result
      return result;
    }
    // calc size
    int size = 1;
    for (int i = 0; i < digits.length(); i++) {
      int digit = digits[i] - '0';
      int len = letter_map[digit].length();
      if (len > 1) {
        size *= len;
      }
    }
    // alloc space
    result.resize(size);
    // fill letters
    int count = 1; // count for multi
    for (int i = 0; i < digits.length(); i++) {
      int digit = digits[i] - '0';
      string letters = letter_map[digit];
      int len = letters.length();
      if (len > 1) {
        count *= len;
        int span = size / count;
        // loop letters
        int p = 0;
        for (int j = 0; j < size; j++) {
          if (j % span == 0) {
            p++; // move to next every span times
          }
          char letter = letters[p % len]; // wrap back
          result[j].push_back(letter); // put letters
        }
      }
    }
    return result;
  }
};
```
