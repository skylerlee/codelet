// Header for test
#include "gtest/gtest.h"
// Header for debug
#include <cstdio>
// Default using std
using namespace std;

#define MAIN \
int main(int argc, char **argv) { \
  ::testing::InitGoogleTest(&argc, argv); \
  return RUN_ALL_TESTS(); \
}
