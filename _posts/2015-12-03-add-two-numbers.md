---
layout: post
title: Add Two Numbers
date: 2015-12-03 19:45:10 +0800
tags:
  - algorithm
  - OJ
  - leetcode
---

Question
--------
> You are given two linked lists representing two non-negative numbers. The
  digits are stored in reverse order and each of their nodes contain a single
  digit. Add the two numbers and return it as a linked list.

>     Input: (2 -> 4 -> 3) + (5 -> 6 -> 4)
>     Output: 7 -> 0 -> 8

Solution
--------

```cpp
/**
 * Definition for singly-linked list.
 */
struct ListNode {
  int val;
  ListNode* next;
  ListNode(int x) : val(x), next(NULL) {}
};

class Solution {
public:
  ListNode* addTwoNumbers(ListNode* l1, ListNode* l2) {
    ListNode* l3 = NULL;
    ListNode* head = NULL;  // head node of the result list
    int carry = 0;  // default carry digit
    // traverse to the end of the longest list
    while ((l1 != NULL) || (l2 != NULL)) {
      int val1 = 0;
      int val2 = 0;
      if (l1 != NULL) {
        val1 = l1->val;
      }
      if (l2 != NULL) {
        val2 = l2->val;
      }
      int sum = val1 + val2 + carry;  // max(sum) is 19 (9 + 9 + 1)
      if (sum < 10) {
        carry = 0;
      } else {
        carry = 1;  // max(carry) is 1
        sum = sum - 10;
      }
      if (head == NULL) {  // the first node
        l3 = new ListNode(sum);
        head = l3;  // store the address of the first node
      } else {  // nodes after the first node
        l3->next = new ListNode(sum);
        l3 = l3->next;  // move to the next node
      }
      if (l1 != NULL) {
        l1 = l1->next;
      }
      if (l2 != NULL) {
        l2 = l2->next;
      }
    }
    if (carry > 0) {  // handle the carry digit
      l3->next = new ListNode(carry);
    }
    return head;
  }
};
```
