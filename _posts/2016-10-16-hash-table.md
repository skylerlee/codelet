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

哈希表本质上是可随机访问的线性表，通常由数组实现，数组的元素称为桶或者槽，键值对分散的存储在数组
之中，哈希表通过哈希函数实现对关联值的定位

哈希表的关键技术是哈希函数，哈希函数的作用是将键值映射为桶的下标，因为这是一个纯数学运算的过程，
所以哈希表的查询效率很高，平均时间复杂度是常量级的

在最理想的情况下，键值可以直接作为桶的位置索引，此时哈希函数只需要简单的返回输入的数值；但在现实
情况下，键值的取值范围往往很大，而相对应的内存开销是不可接受的，因此通过键值直接寻址是不可取的，
实际上，哈希函数需要将大量可能的取值映射到一小段内存空间里，在这种情况下，就可能会存在两个或多个
不同的键值被映射到同一个桶中，这种情况被称为冲突，发生冲突的键值被称为同义词

一个好的哈希函数应该满足以下条件：
1. 对于相同的输入，必须有相同的输出
2. 输出的分布要尽量的均匀，减少冲突的发生

### 装填因子
哈希表键值发生冲突的概率与表的空满程度有关，哈希表越满，空桶就越少，发生冲突的概率自然也就越大，
我们定义哈希表中的元素数量和桶数量的比值为哈希表的装载因子，通过调整装载因子，我们可以很方便的在
时间效率与空间效率之间取得平衡

\\(load factor: \\alpha = size / capacity\\)

### 字符串哈希
为了一般化，哈希表的键一般为整数类型，但实际应用中最常用的还是将字符串作为键，此时就需要一种算法
将字符串转化为整数，下面是JDK实现的一种字符串哈希算法，用于计算一个字符串的64位哈希

```cpp
uint64_t hashCode(const string& s) {
  uint64_t hash = 0;
  for (size_t i = 0, length = s.length(); i < length; i++) {
    hash = hash * 31 + s[i];
  }
  return hash;
}
```

这种算法将字符串当做整数处理，称为Horner方法，此外还有很多其他的字符串哈希算法，具体可以参考
[wikipedia - List of hash functions](https://en.wikipedia.org/wiki/List_of_hash_functions)

### 哈希函数
下面的哈希函数参考了JDK1.7中HashMap的实现，通过二次哈希的方法对哈希码作进一步混淆

```cpp
size_t HashTable::hash(const string& key) const {
  uint64_t h = hashCode(key);
  h ^= (h >> 20) ^ (h >> 12);
  h ^= (h >> 7) ^ (h >> 4);
  return h % capacity_;
}
```

### 解决冲突
一般来说，键值通过哈希函数映射后的散布性非常好，如果表比较空，冲突发生的概率是比较小的，但并不是
不可能，因此我们仍然需要对发生冲突的元素进行特殊处理，下面介绍最常见的两种解决冲突的方法，分别是
分离链接法(Separate Chaining)和开放定址法(Open Addressing)

* 分离链接法
这种方法借助链表来解决冲突，所有冲突的记录会储存在同一个链表中

```cpp
struct Node {
  string key;
  int value;
  Node* next;

  Node(const string& k, int v)
    : key(k),
      value(v),
      next(nullptr) {}
};

class HashTable {
public:
  HashTable();
  ~HashTable();
  size_t size() const { return size_; }
  // lookup
  Node* get(const string& key) const;
  bool contains(const string& key) const { return get(key) != nullptr; }
  // modifiers
  void set(const string& key, int value);
  Node* del(const string& key);

private:
  size_t hash(const string& key) const;
  void checkCapacity();
  void resize(size_t capacity);

  static const size_t kInitialCapacity;
  static const double kLoadFactorLimit;

  Node** buckets_;
  size_t capacity_;
  size_t size_;
};
```

```cpp
const size_t HashTable::kInitialCapacity = 8;
const double HashTable::kLoadFactorLimit = 0.75;

HashTable::HashTable()
  : capacity_(kInitialCapacity),
    size_(0) {
  buckets_ = new Node*[capacity_]();
}

HashTable::~HashTable() {
  Node* node;
  Node* next;
  for (size_t i = 0; i < capacity_; i++) {
    node = buckets_[i];
    while (node != nullptr) {
      next = node->next;
      delete node;
      node = next;
    }
  }
  delete[] buckets_;
}

Node* HashTable::get(const string& key) const {
  size_t i = hash(key);
  Node* node = buckets_[i];
  while (node != nullptr && node->key != key) {
    node = node->next;
  }
  return node;
}

void HashTable::set(const string& key, int value) {
  checkCapacity();
  size_t i = hash(key);
  Node* node = buckets_[i];
  while (node != nullptr) {
    if (node->key == key) {
      node->value = value; // update
      return;
    }
    node = node->next;
  }
  // prepend
  Node* newNode = new Node(key, value);
  newNode->next = buckets_[i];
  buckets_[i] = newNode;
  size_++;
}

Node* HashTable::del(const string& key) {
  checkCapacity();
  size_t i = hash(key);
  Node* node = buckets_[i];
  Node* prev = node;
  while (node != nullptr) {
    if (node->key == key) { // found
      Node* removed = node;
      if (node == prev) { // at head
        buckets_[i] = node->next;
      } else { // at tail
        prev->next = node->next;
      }
      size_--;
      removed->next = nullptr;
      return removed;
    }
    prev = node;
    node = node->next;
  }
  return nullptr;
}
```

很显然，链表的平均长度为\\(\\alpha\\)，查询操作的平均时间复杂度为\\(O(1 + \\alpha)\\)

* 开放定址法
这种方法将所有的记录都储存在桶数组内部，如果键值发生冲突，则探测其他的桶，直到找到一个空桶为止，
常见的探测方法有：线性探测、平方探测、双哈希，下面以平方探测法作为示例

```cpp
struct Entry {
  enum Type {
    EMPTY,
    ACTIVE,
    DELETED
  };

  Type type;
  string key;
  int value;

  Entry()
    : type(EMPTY) {}

  Entry(const string& k, int v)
    : type(EMPTY),
      key(k),
      value(v) {}
};

class HashTable {
public:
  HashTable();
  ~HashTable();
  size_t size() const { return numNonEmpty_ - numDeleted_; }
  // lookup
  Entry* get(const string& key) const;
  bool contains(const string& key) const { return get(key) != nullptr; }
  // modifiers
  void set(const string& key, int value);
  Entry* del(const string& key);

private:
  size_t hash(const string& key) const;
  Entry* entryFor(const string& key) const;
  void checkCapacity();
  void resize(size_t capacity);

  static const size_t kInitialCapacity;
  static const double kLoadFactorLimit;

  Entry* buckets_;
  size_t capacity_;
  size_t numNonEmpty_;
  size_t numDeleted_;
};
```

```cpp
const size_t HashTable::kInitialCapacity = 8;
const double HashTable::kLoadFactorLimit = 0.5;

HashTable::HashTable()
  : capacity_(kInitialCapacity),
    numNonEmpty_(0),
    numDeleted_(0) {
  buckets_ = new Entry[capacity_];
}

HashTable::~HashTable() {
  delete[] buckets_;
}

Entry* HashTable::entryFor(const string& key) const {
  size_t i = hash(key);
  Entry* e = buckets_ + i;
  size_t offset = 1;
  while (e->type != Entry::EMPTY &&
         (e->type != Entry::ACTIVE || e->key != key)) {
    i = (i + offset++) % capacity_;
    e = buckets_ + i;
  } // found key or empty bucket
  return e;
}

Entry* HashTable::get(const string& key) const {
  Entry* e = entryFor(key);
  if (e->type == Entry::ACTIVE) {
    return e;
  } else {
    return nullptr;
  }
}

void HashTable::set(const string& key, int value) {
  checkCapacity();
  Entry* e = entryFor(key);
  if (e->type == Entry::ACTIVE) {
    e->value = value; // update
  } else {
    // add
    e->key = key;
    e->value = value;
    e->type = Entry::ACTIVE;
    numNonEmpty_++;
  }
}

Entry* HashTable::del(const string& key) {
  checkCapacity();
  Entry* e = entryFor(key);
  if (e->type == Entry::ACTIVE) {
    e->type = Entry::DELETED; // mark deleted
    numDeleted_++;
    return e;
  } else {
    return nullptr;
  }
}
```

开放定址法相比分离链接法来说，数据的内存布局更紧凑，cache命中率更高，从理论上来说性能应该更好；
但相比分离链接法，开放定址法的删除更加复杂，因为空桶是探测的终止条件，因此删除一条记录时，桶不能
简单的置为空，否则会导致探测提前结束，导致后续记录查询失败

如果删除一条记录后，立即进行调整的话，则整个删除操作的复杂度是\\(O(n)\\)，为了保证性能，上面的
代码采用了惰性删除的方法，即只将桶标记为删除，真正的删除是发生在之后的容量调整过程中的，因此平均
下来，删除操作的复杂度和设置以及查询一样，都是\\(O(1)\\)

#### terminology
以上两种方法还有一种有趣的命名方式：其中"separate chaining"方法又可称作"open hashing"方法
或者"closed addressing"方法，而"open addressing"方法又可称作"closed hashing"方法，这种
命名实际上是根据同义词的存储位置来做区分的："hashing"是指哈希表内部的桶数组，而"addressing"
是指的桶的地址或下标；"open hashing"指同义词可以存储于内部数组之外，即链表的存储方式，而此时
同义词都储存在同一个桶中，即桶的下标是固定的，因此也可以称作"closed addressing"；与此相反，
"open addressing"方法将所有的同义词都储存在内部数组之中，因此又称作"closed hashing"，个人
感觉这种命名方式比较ambiguous，只做了解即可

### 再哈希
因为哈希表发生冲突的概率与装载因子正相关，因此我们需要通过一定的方式，保证装载因子不超过一定值，
常见的做法是将哈希表扩容，然后重新进行哈希映射，我们把这个过程称为再哈希

* 分离链接法的再哈希

```cpp
void HashTable::checkCapacity() {
  double loadFactor = (double) size_ / capacity_;
  if (loadFactor > kLoadFactorLimit) {
    // expand
    resize(capacity_ << 1);
  } else if (loadFactor < 0.25 * kLoadFactorLimit &&
             capacity_ > kInitialCapacity) {
    // shrink
    resize(capacity_ >> 1);
  }
}

void HashTable::resize(size_t capacity) {
  Node** oldBuckets = buckets_;
  size_t oldCapacity = capacity_;
  capacity_ = capacity;
  buckets_ = new Node*[capacity_]();
  // rehash
  Node* node;
  Node* next;
  size_t j;
  for (size_t i = 0; i < oldCapacity; i++) {
    node = oldBuckets[i];
    while (node != nullptr) {
      next = node->next;
      j = hash(node->key); // new index
      node->next = buckets_[j]; // prepend
      buckets_[j] = node;
      node = next; // next
    }
  }
  // release
  delete[] oldBuckets;
}
```

* 开放定址法的再哈希

```cpp
void HashTable::checkCapacity() {
  double loadFactor = (double) size() / capacity_;
  double fillFactor = (double) numNonEmpty_ / capacity_;
  if (fillFactor > kLoadFactorLimit) {
    // expand
    resize(capacity_ << 1);
  } else if (loadFactor < 0.25 * kLoadFactorLimit &&
             capacity_ > kInitialCapacity) {
    // shrink
    resize(capacity_ >> 1);
  }
}

void HashTable::resize(size_t capacity) {
  Entry* oldBuckets = buckets_;
  size_t oldCapacity = capacity_;
  capacity_ = capacity;
  buckets_ = new Entry[capacity_];
  // rehash
  Entry* o;
  Entry* e;
  for (size_t i = 0; i < oldCapacity; i++) {
    o = oldBuckets + i;
    if (o->type == Entry::ACTIVE) {
      e = entryFor(o->key);
      e->key = o->key;
      e->value = o->value;
      e->type = Entry::ACTIVE;
    }
  }
  numNonEmpty_ -= numDeleted_;
  numDeleted_ = 0;
  // release
  delete[] oldBuckets;
}
```

### 优化
* 取模运算：当表的容量为2的整数次幂时，取模运算可以用按位与运算等价

  `h % capacity` <=> `h & (capacity - 1)`

* 扩容/缩容：可以发现，当表的容量为2的 w 次幂时，哈希码最低的 w 位实际上就是模运算之后的下标，
因此当表扩容到之前的2倍，或者缩容到之前的1/2时，一条记录的新下标只与之前的第 w+1 位有关，如果
第 w+1 位为0，则记录的下标不变，如果为1，则下标加/减capacity

  如果采用的分离链接法，那么一条链表上平均有50%的元素是不需要移动的，跳过这些元素，可以有效提升
扩容/缩容的性能，Android SDK中的HashMap就应用了这种优化

  至于采用开放定址法的哈希表，由于元素拷贝是不可避免的，所以无法有效优化

* 链表搜索：对于采用分离链接法的哈希表，链表的查询效率其实是很低的，但由于在一般情况下，冲突重复
发生在同一个桶中的概率很小，链表的长度不会很长，但是对于一些刻意选取的键值序列，还是会导致某一条
链表的长度过长，导致性能问题

  以上面的哈希算法为例，字符串"Aa"、"BB"、"C#"的哈希码都相等，都会被储存到同一条链表中，对于
服务端程序来说，大量的这种数据会占用计算资源，造成服务中断，这就是Hash DoS攻击

  JDK8中的HashMap针对这种情况的做法是：如果链表的长度超过8，则链表会被转化为红黑树，从而保证
算法在最坏情况下的时间复杂度不超过\\(O(log(n))\\)

参考资料：  
[1] Mark A. Weiss Data Structures and Algorithm Analysis in C++-4th - Hashing  
[2] [R. Sedgewick and K. Wayne Algorithms-4th - Hash Tables](https://algs4.cs.princeton.edu/34hash/)  
[3] [wikipedia - List of hash functions](https://en.wikipedia.org/wiki/List_of_hash_functions)  
[4] [wikipedia - Hash table](https://en.wikipedia.org/wiki/Hash_table)  
