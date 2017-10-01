// Header for test
#include "gtest/gtest.h"
// Header for debug
#include "prettyprint/prettyprint.h"

#define LOG(s) std::cout << s << std::endl

#define MAIN \
int main(int argc, char **argv) { \
  ::testing::InitGoogleTest(&argc, argv); \
  return RUN_ALL_TESTS(); \
}
