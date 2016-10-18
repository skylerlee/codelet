---
layout: post
title: 哈希表
date: 2016-10-16 23:17:48 +0800
tags:
  - study
  - algorithm
use_require: true
require_math: true
---

哈希表又称散列表，是最常用的数据结构之一，也是除了搜索树以外的另一种常用的关联数组的实现，相比于
之前介绍过的红黑树，哈希表的查询效率往往更高，代码实现也更简单，不过由于其元素是无序分散存储的，
因此通常哈希表不支持查找前驱或后继元素，也不支持元素的顺序遍历

哈希表的关键技术是哈希函数，哈希函数的作用是将键值映射为数组元素（称为桶或者槽）的索引，因为这是
一个纯数学运算的过程，所以哈希表的查询效率很高，其平均时间复杂度是常量级的

在最理想的情况下，键值可以直接作为桶的位置索引，此时哈希函数只需要简单的返回输入的数值；但在现实
情况下，键值的取值范围往往很大，而相对应的内存开销是不可接受的，因此通过键值直接寻址是不可取的，
实际上，哈希函数需要将大量可能的取值映射到一小段内存空间里，在这种情况下，就可能会存在两个或多个
不同的键值被映射到同一个桶中，这种情况被称为冲突

一个好的哈希函数应该满足以下条件：
1. 对于相同的输入，必须有相同的输出
2. 输出应该尽量均匀的分布于\\([0, size - 1]\\)之内

### 字符串哈希
为了一般化，哈希表的键一般为整数类型，但实际应用中最常用的还是将字符串作为键，此时就需要一种算法
将字符串转化为整数，下面就是一种简单的算法，用于计算一个字符串的64位哈希

```cpp
uint64_t hashCode(const string& s) {
  uint64_t value = 0;
  for (size_t i = 0, length = s.length(); i < length; i++) {
    value = value * 31 + s[i];
  }
  return value & 0x7fffffffffffffff;
}
```

这种算法称为Horner方法，除此之外还有很多其他的字符串哈希算法，具体可以参考
[wikipedia - List of hash functions](https://en.wikipedia.org/wiki/List_of_hash_functions)

参考资料：  
[1] [Mark A. Weiss Data Structures and Algorithm Analysis in C++-4th - Hashing](https://www.pearson.com/us/higher-education/program/Weiss-Data-Structures-and-Algorithm-Analysis-in-C-4th-Edition/PGM148299.html)  
[2] [R. Sedgewick and K. Wayne Algorithms-4th - Hash Tables](https://algs4.cs.princeton.edu/34hash/)  
[3] [wikipedia - List of hash functions](https://en.wikipedia.org/wiki/List_of_hash_functions)  
