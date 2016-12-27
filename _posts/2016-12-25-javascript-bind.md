---
layout: post
title: JavaScript绑定函数
date: 2016-12-25 21:49:58 +0800
tags:
  - note
  - frontend
  - javascript
---

在JS中，我们经常需要指定函数的`this`值，通常我们会用`call/apply`这样的函数为`this`绑定值，
除此之外函数还可以通过`bind`方法绑定`this`，现在就来深入分析一下`bind`函数。

先看下面的例子

```js
function test () {}

test.call(obj, 0, 1)
test.apply(obj, [0, 1])

var fn = test.bind(obj, 0, 1)
fn()
```

可见，不同于`call/apply`在调用时指定`this`，`bind`完成绑定后会返回一个函数，当调用此函数时
原函数才会执行，这种方式很适合为回调函数绑定上下文，因此在Web环境中被广泛的使用。

之前我一直以为`bind`的实现并不困难，在我看来它应该差不多是这样的：

```js
Function.prototype.bind = function (thisArg) {
  var that = this
  var args = Array.prototype.slice.call(arguments, 1)
  return function () {
    var rest = Array.prototype.slice.call(arguments)
    return that.apply(thisArg, args.concat(rest))
  }
}
```

但后来看了You-Dont-Know-JS才发现原来事情并不简单，下面就来解释为什么

还记得之前讲过的构造函数变长参数调用的问题吗？

```js
var arg = [1, 2, 3];
var t = new (Function.prototype.bind.apply(Test, [null].concat([0], arg)))();
```

可以简化为

```js
var t = new (Test.bind(null, 0, 1, 2, 3))
```

发现了问题吗？如果通过`new`关键字调用`bind`返回的函数，按照我之前的写法`t`应该是个空对象`{}`
才对呀，可是为什么会执行原函数的绑定呢？看来`bind`里面针对`new`有特殊的处理，下面就来分析一下

MDN上对于构造函数绑定有如下说明：

> Bound functions are automatically suitable for use with the `new` operator to
> construct new instances created by the target function. When a bound function
> is used to construct a value, the provided `this` is ignored.
> However, provided arguments are still prepended to the constructor call.

`bind`函数的polyfill代码如下：

```js
if (!Function.prototype.bind) {
  Function.prototype.bind = function(oThis) {
    if (typeof this !== 'function') {
      // closest thing possible to the ECMAScript 5
      // internal IsCallable function
      throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
    }

    var aArgs   = Array.prototype.slice.call(arguments, 1),
        fToBind = this,
        fNOP    = function() {},
        fBound  = function() {
          return fToBind.apply(this instanceof fNOP
                 ? this
                 : oThis,
                 aArgs.concat(Array.prototype.slice.call(arguments)));
        };

    if (this.prototype) {
      // Function.prototype doesn't have a prototype property
      fNOP.prototype = this.prototype;
    }
    fBound.prototype = new fNOP();

    return fBound;
  };
}
```

1. 首先检查自身是否callable
2. 然后得到绑定参数
3. 最后是创建并返回绑定后的函数`fBound`

其中的关键就在于第三步中的`fBound`以及`fNOP`的作用，又可以分为两个阶段：

1. 绑定时
  设置`fNOP`的原型为原函数的原型，并设置`fBound`的原型，也就是说通过`fBound`构造产生的实例
  具有原型链`fBound->fNOP==this`，也就是说`fBound`原型继承自`fNOP`

2. 调用时
  通过`this instanceof fNOP`判断是否是`new`调用，如果是则忽略指定的`oThis`，而是以`new`
  创建的新对象作为`this`调用原函数初始化，这就是`bind`对于`new`的特殊处理

好了，过程大致梳理清楚了，但是还有一个疑问，那就是为什么一定要通过`fNOP`继承呢，调用时直接通过
`this instanceof fBound`一样可以区分构造函数调用啊，至于原型也可以通过`Object.create()`
函数来设置，也就是下面这样

```js
var fToBind = this
var fBound  = function () {
  return fToBind.apply(this instanceof fBound
         ? this
         : oThis)
}

fBound.prototype = Object.create(this.prototype)

return fBound
```

因为IE9以下不支持`Object.create()`函数，所以还需要一个polyfill，其中对于对象隐式原型的设置
其实也是通过一个dummy function来实现的，这样一来`fNOP`的意义就清楚了

```js
if (typeof Object.create !== "function") {
  Object.create = function (proto, propertiesObject) {
    if (typeof proto !== 'object' && typeof proto !== 'function') {
      throw new TypeError('Object prototype may only be an Object: ' + proto);
    } else if (proto === null) {
      throw new Error("This browser's implementation of Object.create is a shim and doesn't support 'null' as the first argument.");
    }

    if (typeof propertiesObject != 'undefined') {
      throw new Error("This browser's implementation of Object.create is a shim and doesn't support a second argument.");
    }

    function F() {}
    F.prototype = proto;

    return new F();
  };
}
```

`fNOP`用于以兼容的方式设置对象的隐式原型

还有一个疑问，为什么MDN用的是`this instanceof fNOP`，而不是`this instanceof fBound`呢？
这样明显有一个问题，那就是`instanceof`检查的‘区间’变大了，比如像下面这样：

```js
function Test () {
  console.log(this.foo)
}

var t = new Test() // undefined
t.foo = 'instance'

var bindTest = Test.bind({
  foo: 'strong'
})

bindTest.call({   // strong
  foo: 'explicit'
})
bindTest.call(t)  // instance
```

可见，如果使用原函数的实例`call`绑定函数，强绑定会失效，造成不一致的行为，所以在这一块MDN可能
实现的并不好，我们还可以参考[es5-shim](https://github.com/es-shims/es5-shim)的`bind`
实现，其中就是用的`this instanceof fBound`，这样更严格一些。

**注意：**
其实这个polyfill还有一些问题，首先`bind`方式构造的实例会被添加一个额外的`fBound`原型，也就是
说`bind`实际会产生一个子类；其次创建的绑定函数具有`prototype`，而正确的绑定应该是没有的；还有
绑定函数的`length`属性始终为0，而不是原函数的形参个数。

```js
function Test () {}
var bindTest = Test.bind({})

var t0 = new Test()
var t1 = new bindTest()

t0 instanceof Test     // true
t1 instanceof bindTest // true
t1 instanceof Test     // true
t0 instanceof bindTest // false
```

通过上面的代码，可以得知`bindTest`是`Test`的子类，因此`t0`不是`bindTest`的实例，但如果使用
的是原生`bind`实现，则这两者是平级的。

其实`bind`的标准实现是很复杂的，polyfill只满足了大多数情况下的功能，我们平常使用时还是要多用
正常用法，少用黑魔法，避免掉到坑里。

参考资料：  
[1] [MDN - Function bind](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind)  
[2] [MDN - Object create](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create)  
