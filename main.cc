#include "main.h"
// -----------------------------------------------------------------------------
clogger::Logger d;

class Solution {
public:
  int add(int a, int b) {
    return a + b;
  }
};

// -----------------------------------------------------------------------------
// Test Cases

Solution sol;

TEST(Main, Case1) {
  EXPECT_EQ(sol.add(1, 1), 2);
}

MAIN
