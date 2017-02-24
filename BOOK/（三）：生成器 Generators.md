今天的这篇文章令我感到非常兴奋，我们将一起领略**ES6**中最具魔力的特性。

为什么说是“最具魔力的”？对于初学者来说，此特性与**JS**之前已有的特性截然不同，可能会觉得有点晦涩难懂。但是，从某种意义上来说，它使语言内部的常态行为变得更加强大，如果这都不算有魔力，我不知道还有什么能算。

不仅如此，此特性可以极大地简化代码，它甚至可以帮助你逃离“回调地狱”。

既然新特性如此神奇，那么就一起深入了解它的魔力吧！

## ES6生成器（Generators）简介
什么是生成器？

我们从一个示例开始：

```
function* quips(name) {
  yield "你好 " + name + "!";
  yield "希望你能喜欢这篇介绍ES6的译文";
  if (name.startsWith("X")) {
    yield "你的名字 " + name + "  首字母是X，这很酷！";
  }
  yield "我们下次再见！";
}
```
这是一只[会说话的猫](https://people-mozilla.org/~jorendorff/demos/meow.html)，这段代码很可能代表着当今互联网上最重要的一类应用。（试着点击这个[链接](https://people-mozilla.org/~jorendorff/demos/meow.html)，与这只猫互动一下，如果你感到有些困惑，回到这里继续阅读）。

这段代码看起来很像一个函数，我们称之为生成器函数，它与普通函数有很多共同点，但是二者有如下区别：

* 普通函数使用function声明，而生成器函数使用function*声明。
* 在生成器函数内部，有一种类似return的语法：关键字yield。二者的区别是，普通函数只可以return一次，而生成器函数可以yield多次（当然也可以只yield一次）。在生成器的执行过程中，遇到yield表达式立即暂停，后续可恢复执行状态。

这就是普通函数和生成器函数之间最大的区别，普通函数不能自暂停，生成器函数可以。

## 生成器做了什么？
当你调用**quips()**生成器函数时发生了什么？

```
> var iter = quips("jorendorff");
  [object Generator]
> iter.next()
  { value: "你好 jorendorff!", done: false }
> iter.next()
  { value: "希望你能喜欢这篇介绍ES6的译文", done: false }
> iter.next()
  { value: "我们下次再见！", done: false }
> iter.next()
  { value: undefined, done: true }
```
你大概已经习惯了普通函数的使用方式，当你调用它们时，它们立即开始运行，直到遇到**return**或抛出异常时才退出执行，作为**JS**程序员你一定深谙此道。

生成器调用看起来非常类似：**quips("jorendorff")**。但是，当你调用一个生成器时，它并非立即执行，而是返回一个已暂停的生成器对象（上述实例代码中的**iter**）。你可将这个生成器对象视为一次函数调用，只不过立即冻结了，它恰好在生成器函数的最顶端的第一行代码之前冻结了。

每当你调用生成器对象的**.next()**方法时，函数调用将其自身解冻并一直运行到下一个**yield**表达式，再次暂停。

这也是在上述代码中我们每次都调用**iter.next()**的原因，我们获得了**quips()**函数体中**yield**表达式生成的不同的字符串值。

调用最后一个**iter.next()**时，我们最终抵达生成器函数的末尾，所以返回结果中**done**的值为**true**。抵达函数的末尾意味着没有返回值，所以返回结果中**value**的值为**undefined**。

现在回到[会说话的猫的demo页面](https://people-mozilla.org/~jorendorff/demos/meow.html)，尝试在循环中加入一个**yield**，会发生什么？

如果用专业术语描述，每当生成器执行**yields**语句，生成器的堆栈结构（本地变量、参数、临时值、生成器内部当前的执行位置）被移出堆栈。然而，生成器对象保留了对这个堆栈结构的引用（备份），所以稍后调用**.next()**可以重新激活堆栈结构并且继续执行。

值得特别一提的是，**生成器不是线程**，在支持线程的语言中，多段代码可以同时运行，通通常导致竞态条件和非确定性，不过同时也带来不错的性能。生成器则完全不同。当生成器运行时，它和调用者处于同一线程中，拥有确定的连续执行顺序，永不并发。与系统线程不同的是，生成器只有在其函数体内标记为**yield**的点才会暂停。

现在，我们了解了生成器的原理，领略过生成器的运行、暂停恢复运行的不同状态。那么，这些奇怪的功能究竟有何用处？

## 生成器是迭代器！
上周，我们学习了**ES6**的迭代器，它是**ES6**中独立的内建类，同时也是语言的一个扩展点，通过实现**Symbol.iterator**和**.next()**两个方法你就可以创建自定义迭代器。

实现一个接口不是一桩小事，我们一起实现一个迭代器。举个例子，我们创建一个简单的**range**迭代器，它可以简单地将两个数字之间的所有数相加。首先是传统**C**的**for(;;)**循环：

```
// 应该弹出三次 "ding"
for (var value of range(0, 3)) {
  alert("Ding! at floor #" + value);
}
```
使用**ES6**的类的解决方案（如果不清楚语法细节，无须担心，我们将在接下来的文章中为你讲解）：

```
class RangeIterator {
  constructor(start, stop) {
    this.value = start;
    this.stop = stop;
  }

  [Symbol.iterator]() { return this; }

  next() {
    var value = this.value;
    if (value < this.stop) {
      this.value++;
      return {done: false, value: value};
    } else {
      return {done: true, value: undefined};
    }
  }
}

// 返回一个新的迭代器，可以从start到stop计数。
function range(start, stop) {
  return new RangeIterator(start, stop);
}
```
[查看代码运行情况](http://codepen.io/anon/pen/NqGgOQ)。

这里的实现类似[Java](http://gafter.blogspot.jp/2007/07/internal-versus-external-iterators.html)或[Swift](https://schani.wordpress.com/2014/06/06/generators-in-swift/)中的迭代器，不是很糟糕，但也不是完全没有问题。我们很难说清这段代码中是否有**bug**，这段代码看起来完全不像我们试图模仿的传统**for (;;)**循环，迭代器协议迫使我们拆解掉循环部分。

此时此刻你对迭代器可能尚无感觉，他们用起来很酷，但看起来有些难以实现。

你大概不会为了使迭代器更易于构建从而建议我们为**JS**语言引入一个离奇古怪又野蛮的新型控制流结构，但是既然我们有生成器，是否可以在这里应用它们呢？一起尝试一下：

```
function* range(start, stop) {
  for (var i = start; i < stop; i++)
    yield i;
}
```
[查看代码运行情况。](http://codepen.io/anon/pen/mJewga)

以上**4**行代码实现的生成器完全可以替代之前引入了一整个**RangeIterator**类的**23**行代码的实现。可行的原因是：**生成器是迭代器**。所有的生成器都有内建**.next()**和**Symbol.iterator**方法的实现。你只须编写循环部分的行为。

我们都非常讨厌被迫用被动语态写一封很长的邮件，不借助生成器实现迭代器的过程与之类似，令人痛苦不堪。当你的语言不再简练，说出的话就会变得难以理解。**RangeIterator**的实现代码很长并且非常奇怪，因为你需要在不借助循环语法的前提下为它添加循环功能的描述。所以生成器是最好的解决方案！

我们如何发挥作为迭代器的生成器所产生的最大效力？

| 使任意对象可迭代。编写生成器函数遍历这个对象，运行时**yield**每一个值。然后将这个生成器函数作为这个对象的**[Symbol.iterator]**方法。

| 简化数组构建函数。假设你有一个函数，每次调用的时候返回一个数组结果，就像这样：

```
// 拆分一维数组icons
// 根据长度rowLength
function splitIntoRows(icons, rowLength) {
  var rows = [];
  for (var i = 0; i < icons.length; i += rowLength) {
    rows.push(icons.slice(i, i + rowLength));
  }
  return rows;
}
```
使用生成器创建的代码相对较短：

```
function* splitIntoRows(icons, rowLength) {
  for (var i = 0; i < icons.length; i += rowLength) {
    yield icons.slice(i, i + rowLength);
  }
}
```
行为上唯一的不同是，传统写法立即计算所有结果并返回一个数组类型的结果，使用生成器则返回一个迭代器，每次根据需要逐一地计算结果。

* 获取异常尺寸的结果。你无法构建一个无限大的数组，但是你可以返回一个可以生成一个永无止境的序列的生成器，每次调用可以从中取任意数量的值。
* 重构复杂循环。你是否写过又丑又大的函数？你是否愿意将其拆分为两个更简单的部分？现在，你的重构工具箱里有了新的利刃——生成器。当你面对一个复杂的循环时，你可以拆分出生成数据的代码，将其转换为独立的生成器函数，然后使用for (var data of myNewGenerator(args))遍历我们所需的数据。
* 构建与迭代相关的工具。ES6不提供用来过滤、映射以及针对任意可迭代数据集进行特殊操作的扩展库。借助生成器，我们只须写几行代码就可以实现类似的工具。

举个例子，假设你需要一个等效于**Array.prototype.filter**并且支持**DOM NodeLists**的方法，可以这样写：

```
function* filter(test, iterable) {
  for (var item of iterable) {
    if (test(item))
      yield item;
  }
}
```
你看，生成器魔力四射！借助它们的力量可以非常轻松地实现自定义迭代器，记住，迭代器贯穿ES6的始终，它是数据和循环的新标准。

以上只是生成器的冰山一角，最重要的功能请继续观看！

## 生成器和异步代码
这是我在一段时间以前写的一些**JS**代码

```
         };
        })
      });
    });
  });
});
```
可能你已经在自己的代码中见过类似的片段，[异步API](http://www.html5rocks.com/en/tutorials/async/deferred/)通常需要一个回调函数，这意味着你需要为每一次任务执行编写额外的异步函数。所以如果你有一段代码需要完成三个任务，你将看到类似的三层级缩进的代码，而非简单的三行代码。

后来我就这样写了：

```
}).on('close', function () {
  done(undefined, undefined);
}).on('error', function (error) {
  done(error);
});
```
异步**API**拥有错误处理规则，不支持异常处理。不同的**API**有不同的规则，大多数的错误规则是默认的；在有些**API**里，甚至连成功提示都是默认的。

这些是到目前为止我们为异步编程所付出的代价，我们正慢慢开始接受异步代码不如等效同步代码美观又简洁的这个事实。

生成器为你提供了避免以上问题的新思路。

实验性的[Q.async()](https://github.com/kriskowal/q/tree/v1/examples/async-generators)尝试结合**promises**使用生成器产生异步代码的等效同步代码。举个例子：

```
// 制造一些噪音的同步代码。
function makeNoise() {
  shake();
  rattle();
  roll();
}

// 制造一些噪音的异步代码。
// 返回一个Promise对象
// 当我们制造完噪音的时候会变为resolved
function makeNoise_async() {
  return Q.async(function* () {
    yield shake_async();
    yield rattle_async();
    yield roll_async();
  });
}
```
二者主要的区别是，异步版本必须在每次调用异步函数的地方添加**yield**关键字。

在**Q.async**版本中添加一个类似if语句的判断或**try/catch**块，如同向同步版本中添加类似功能一样简单。与其它异步代码编写方法相比，这种方法更自然，不像是学一门新语言一样辛苦。

如果你已经看到这里，你可以试着阅读来自**James Long**的[更深入地讲解生成器的文章](http://jlongster.com/A-Study-on-Solving-Callbacks-with-JavaScript-Generators)。

生成器为我们提供了一个新的异步编程模型思路，这种方法更适合人类的大脑。相关工作正在不断展开。此外，更好的语法或许会有帮助，[ES7](https://github.com/tc39/ecma262)中有一个有关[异步函数的提案](https://github.com/tc39/ecmascript-asyncawait)，它基于**promises**和生成器构建，并从**C#**相似的特性中汲取了大量灵感。

## 如何应用这些疯狂的新特性？
在服务器端，现在你可以在**io.js**中使用**ES6**（在**Node**中你需要使用**--harmony**这个命令行选项）。

在浏览器端，到目前为止只有**Firefox 27+**和**Chrome 39+**支持了**ES6**生成器。如果要在**web**端使用生成器，你需要使用**Babel**或**Traceur**来将你的**ES6**代码转译为**Web**友好的**ES5**。

起初，**JS**中的生成器由**Brendan Eich**实现，他的设计参考了[Python生成器](https://www.python.org/dev/peps/pep-0255/)，而此Python生成器则受到[Icon](https://www2.cs.arizona.edu/icon/)的启发。他们[早在2006年](https://developer.mozilla.org/en-US/docs/Web/JavaScript/New_in_JavaScript/1.7)就在**Firefox 2.0**中移植了相关代码。但是，标准化的道路崎岖不平，相关语法和行为都在原先的基础上有所改动。Firefox和**Chrome**中的**ES6**生成器都是由编译器**hacker** [Andy Wingo](http://wingolog.org/)实现的。这项工作由[彭博](https://www.bloomberg.com/asia)赞助支持（没听错，就是大名鼎鼎的那个彭博！）。

## yield;
生成器还有更多未提及的特性，例如：**.throw()**和.**return()**方法、可选参数**.next()**、**yield***表达式语法。由于行文过长，估计观众老爷们已然疲乏，我们应该学习一下生成器，暂时**yield**在这里，剩下的干货择机为大家献上。

下一次，我们变换一下风格，由于我们接连搬了两座大山：迭代器和生成器，下次就一起研究下不会改变你编程风格的**ES6**特性好不？就是一些简单又实用的东西，你一定会喜笑颜开哒！你还别说，在什么都要“微”一下的今天，**ES6**当然要有微改进了！

下回预告：**ES6**模板字符串深度解析，每天都会写的代码！观众老爷们记得回来哦！我会想你们的！

上一篇：[（二）：迭代器和for-of循环](https://github.com/jawil/ES6/blob/master/BOOK/%EF%BC%88%E4%BA%8C%EF%BC%89%EF%BC%9A%E8%BF%AD%E4%BB%A3%E5%99%A8%E5%92%8Cfor-of%E5%BE%AA%E7%8E%AF.md)----------------------------------------下一篇：[（四）：模板字符串](https://github.com/jawil/ES6/blob/master/BOOK/%EF%BC%88%E5%9B%9B%EF%BC%89%EF%BC%9A%E6%A8%A1%E6%9D%BF%E5%AD%97%E7%AC%A6%E4%B8%B2.md)


