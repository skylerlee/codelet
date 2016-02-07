---
layout: post
title: 浮点数
date: 2016-02-06 15:12:21 +0800
tags:
  - study
  - principle
use_require: true
require_math: true
---

在计算机底层所有的数据都是二进制表示的，在C语言中，基本数据类型大致有以下几种：

`char` `short` `int` `long` `float` `double`

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

浮点数又可以分为单精度浮点数和双精度浮点数两种，根据IEEE-754标准，一个二进制浮点数可以分为三个
部分：

1. 符号位：用于表示正负，正数为0，负数为1
2. 指数域：用于表示指数值，其实际值=编码值-偏移值，这就是移码表示法
3. 尾数域：用于表示有效数位，只表示小数部分，整数部分一般为1而被省略

32位单精度数指数域有8位，尾数域有23位，即`32=1+8+23`  
64位双精度数指数域有11位，尾数域有52位，即`64=1+11+52`  

偏移值是一个固定值，它等于：\\(2^{e-1}-1\\)，其中\\(e\\)是指数域的位数  
32位单精度数的偏移值是127  
64位双精度数的偏移值是1023  

浮点数的小数部分也是由二进制表示的，其最高位表示\\(1/2\\)，次高位表示\\(1/4\\)，以此类推直到
\\(1/2^f\\)，其中\\(f\\)是尾数域的位数

先测试单精度浮点数，因为`float`会隐式转化为`int`，因此需要借助指针

```c
float num = 1;
int* addr = (int*) &num;
print_bits_of_int(*addr); // 00111111 10000000 00000000 00000000
// sign: 0
// exp : 01111111
// frac: 00000000000000000000000
```

指数域的编码值为127，减去偏移值，实际值为0，整体表示为：\\(1.0*2^0\\)

```c
print_bits_of_float(0.0);
// 00000000 00000000 00000000 00000000
// 1.0*2^-127
print_bits_of_float(-0.0);
// 10000000 00000000 00000000 00000000
// -1.0*2^-127
print_bits_of_float(2.0);
// 01000000 00000000 00000000 00000000
// 1.0*2^1
print_bits_of_float(3.0);
// 01000000 01000000 00000000 00000000
// (1+0.5)*2^1
```

那现在我们就反过来验证一下：

对于小数\\(18.75\\)，可以表示为：\\(1.171875*2^4\\) \\
其中\\(0.171875\\)又可以表示为：\\(1/8+1/32+1/64\\) \\
因此
sign: 0
exp : 4+127=131 : 10000011
frac: \\(1/8+1/32+1/64\\) : 00101100 00000000 0000000
综合起来：01000001 10010110 00000000 00000000

```c
print_bits_of_float(18.75);
// 01000001 10010110 00000000 00000000
```

结果和我们的推断是一致的

那么单精度浮点数所能表示的最大最小值是什么呢？可以先猜测：max=0x7fffffff，min=0xffffffff，
下面就验证一下

```c
print_as_float(0x7fffffff); // nan
print_as_float(0xffffffff); // -nan
```

和我们的预期不一致，说明这是一个特殊值

#### 特殊值

根据规范，浮点数有三种特殊值

1. 指数域全0，尾数域全0，则为\\(\pm0\\)
2. 指数域全1，尾数域全0，则为\\(\pm\infty\\)
3. 指数域全1，尾数域不全0，则为\\(\pm nan\\)

参考资料：  
[1] [wikipedia - Signed Number Representations](https://en.wikipedia.org/wiki/Signed_number_representations)  
[2] [wikipedia - Floating Number](https://en.wikipedia.org/wiki/Floating-point_arithmetic)  
[3] [wikipedia - IEEE-754](https://en.wikipedia.org/wiki/IEEE_754)  
