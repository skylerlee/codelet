// console logger utility
#ifndef LOGGER_H_
#define LOGGER_H_

#include <iostream>

namespace clogger {

class Logger {
 public:
  Logger() = default;
  Logger(const Logger&) = delete;
  ~Logger() = default;
  Logger& operator=(const Logger&) = delete;

  template<typename T, typename ...Args>
  void log(T t, Args... args) {
    std::cout << t << " ";
    log(args...);
  }

  template<typename T>
  void log(T t) {
    std::cout << t << std::endl;
  }
};

}  // namespace clogger

#endif  // LOGGER_H_
