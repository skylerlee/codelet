---
layout: post
title: 浮点数
date: 2016-02-06 15:12:21 +0800
tags:
  - study
  - principle
---

在计算机底层所有的数据都是二进制表示的，在C语言中，基本数据类型大致有以下几种：

`char`，`short`，`int`，`long`，`float`，`double`

#### 定点数的二进制表示

定点数的二进制表示很好理解，计组书上说过有符号整数的二进制表示法大致有四种：

1. 原码
2. 反码
3. 补码
4. 移码

现代计算机基本都采用补码来表示有符号数，而浮点数用到了移码，今天就来具体研究一下

下面的代码用于打印有符号整数的bit位

```c
#include <stdio.h>
#include <string.h>

void pretty_print(char* str) {
  char buffer[256];
  char* p = buffer;
  int length = strlen(str);
  for (int i = 0; i < length; i++) {
    if (i > 0 && i % 8 == 0) {
      sprintf(p++, " ");
    }
    sprintf(p++, "%c", str[i]);
  }
  printf("%s\n", buffer);
}

void print_bits_of_int(int value) {
  const int size = sizeof(value) * 8;
  char buffer[size + 1];
  buffer[size] = '\0';
  for (int i = size - 1; i >= 0; i--) {
    int bit = value & (unsigned int) 1;
    buffer[i] = bit ? '1' : '0';
    value >>= 1;
  }
  pretty_print(buffer);
}
```

看看测试结果

```c
int num;
num = 8;
print_bits_of_int(num); // 00000000 00000000 00000000 00001000
num = -8;
print_bits_of_int(num); // 11111111 11111111 11111111 11111000
```

负数的补码是其正数的按位取反加一

#### 浮点数的二进制表示

浮点数又可以分为单精度浮点数和双精度浮点数两种

参考资料：  
[1] [wikipedia - Signed Number Representations](https://en.wikipedia.org/wiki/Signed_number_representations)  
[2] [wikipedia - Floating Number](https://en.wikipedia.org/wiki/Floating-point_arithmetic)  
[3] [wikipedia - IEEE-754](https://en.wikipedia.org/wiki/IEEE_754)  
