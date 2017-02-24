我们如何遍历数组中的元素？**20**年前**JavaScript**刚萌生时，你可能这样实现数组遍历：

```
for (var index = 0; index < myArray.length; index++) {
  console.log(myArray[index]);
}
```
自ES5正式发布后，你可以使用内建的[forEach](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach)方法来遍历数组：

```
myArray.forEach(function (value) {
console.log(value);
});
```
这段代码看起来更加简洁，但这种方法也有一个小缺陷：你不能使用[break](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/break)语句中断循环，也不能使用[return](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/return)语句返回到外层函数。

当然，如果只用**for**循环的语法来遍历数组元素也很不错。

那么，你一定想尝试一下[for-in](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/for...in)循环：

```
for (var index in myArray) { // 千万别这样做
  console.log(myArray[index]);
}
```

这绝对是一个糟糕的选择，为什么呢？

*  在这段代码中，赋给index的值不是实际的数字，而是字符串“0”、“1”、“2”，此时很可能在无意之间进行字符串算数计算，例如：“2” + 1 == “21”，这给编码过程带来极大的不便。
* 作用于数组的for-in循环体除了遍历数组元素外，还会遍历[自定义](https://developer.mozilla.org/zh-CN/docs/Glossary/Expando)属性。举个例子，如果你的数组中有一个可枚举属性myArray.name，循环将额外执行一次，遍历到名为“name”的索引。就连数组原型链上的属性都能被访问到。
* 最让人震惊的是，在某些情况下，这段代码可能按照随机顺序遍历数组元素。
简而言之，for-in是为普通对象设计的，你可以遍历得到字符串类型的键，因此不适用于数组遍历。

## 强大的for-of循环
还记得在**《深入浅出ES6（一）：ES6是什么》**中我向你们承诺过的话么？**ES6**不会破坏你已经写好的**JS**代码。目前看来，成千上万的**Web**网站依赖**for-in**循环，其中一些网站甚至将其用于数组遍历。如果想通过修正**for-in**循环增加数组遍历支持会让这一切变得更加混乱，因此，标准委员会在**ES6**中增加了一种新的循环语法来解决目前的问题。

就像这样：

```
for (var value of myArray) {
  console.log(value);
}
```
是的，与之前的内建方法相比，这种循环方式看起来是否有些眼熟？那好，我们将要探究一下**for-of**循环的外表下隐藏着哪些强大的功能。现在，只需记住：

* 这是最简洁、最直接的遍历数组元素的语法
* 这个方法避开了for-in循环的所有缺陷
* 与forEach()不同的是，它可以正确响应break、continue和return语句

**for-in**循环用来遍历对象属性。

**for-of**循环用来遍历数据—例如数组中的值。

但是，不仅如此！

## for-of循环也可以遍历其它的集合
**for-of**循环不仅支持数组，还支持大多数类数组对象，例如**DOM** [NodeList](https://developer.mozilla.org/zh-CN/docs/Web/API/NodeList)对象。

**for-of**循环也支持字符串遍历，它将字符串视为一系列的**Unicode**字符来进行遍历：

```
for (var chr of "") {
  alert(chr);
}
```
它同样支持**Map**和**Set**对象遍历。

对不起，你一定没听说过**Map**和**Set**对象。他们是**ES6**中新增的类型。我们将在后续的文章讲解这两个新的类型。如果你曾在其它语言中使用过**Map**和**Set**，你会发现**ES6**中的并无太大出入。

举个例子，**Set**对象可以自动排除重复项：


```
// 基于单词数组创建一个set对象
var uniqueWords = new Set(words);
```
生成**Set**对象后，你可以轻松遍历它所包含的内容：

```
for (var word of uniqueWords) {
   console.log(word);
}
```
**Map**对象稍有不同：内含的数据由键值对组成，所以你需要使用解构（**destructuring**）来将键值对拆解为两个独立的变量：

```
for (var [key, value] of phoneBookMap) {
   console.log(key + "'s phone number is: " + value);
}
```
解构也是**ES6**的新特性，我们将在另一篇文章中讲解。看来我应该记录这些优秀的主题，未来有太多的新内容需要一一剖析。

现在，你只需记住：未来的**JS**可以使用一些新型的集合类，甚至会有更多的类型陆续诞生，而**for-of**就是为遍历所有这些集合特别设计的循环语句。

**for-of**循环不支持普通对象，但如果你想迭代一个对象的属性，你可以用**for-in**循环（这也是它的本职工作）或内建的**Object.keys()**方法：

```
// 向控制台输出对象的可枚举属性
for (var key of Object.keys(someObject)) {
  console.log(key + ": " + someObject[key]);
}
```
## 深入理解
`“能工摹形，巧匠窃意。”——巴勃罗·毕卡索`

**ES6**始终坚持这样的宗旨：凡是新加入的特性，势必已在其它语言中得到强有力的实用性证明。

举个例子，新加入的**for-of**循环像极`了C++、Java、C#`以及`Python`中的循环语句。与它们一样，这里的**for-of**循环支持语言和标准库中提供的几种不同的数据结构。它同样也是这门语言中的一个扩展点（译注：关于扩展点，建议参考 1. [浅析扩展点](http://www.blogjava.net/yangbutao/archive/2007/09/27/148500.html) 2. [What are extensions and extension points?](https://wiki.eclipse.org/FAQ_What_are_extensions_and_extension_points%3F)）。

正如其它语言中的**for/foreach**语句一样，for-of循环语句通过方法调用来遍历各种集合。数组、**Maps**对象、**Sets**对象以及其它在我们讨论的对象有一个共同点，它们都有一个迭代器方法。

你可以给任意类型的对象添加迭代器方法。

当你为对象添加**myObject.toString()**方法后，就可以将对象转化为字符串，同样地，当你向任意对象添加**myObjectSymbol.iterator**方法，就可以遍历这个对象了。

举个例子，假设你正在使用**jQuery**，尽管你非常钟情于里面的**.each()**方法，但你还是想让**jQuery**对象也支持**for-of**循环，你可以这样做：

```
// 因为jQuery对象与数组相似
// 可以为其添加与数组一致的迭代器方法
jQuery.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator];
```
好的，我知道你在想什么，那个**[Symbol.iterator]**语法看起来很奇怪，这段代码到底做了什么呢？这里通过**Symbol**处理了一下方法的名称。标准委员会可以把这个方法命名为**.iterator()**方法，但是如果你的代码中的对象可能也有一些**.iterator()**方法，这一定会让你感到非常困惑。于是在**ES6**标准中使用**symbol**来作为方法名，而不是使用字符串。

你大概也猜到了，**Symbols**是**ES6**中的新类型，我们会在后续的文章中讲解。现在，你需要记住，基于新标准，你可以定义一个全新的**symbol**，就像**Symbol.iterator**，如此一来可以保证不与任何已有代码产生冲突。这样做的代价是，这段代码的语法看起来会略显生硬，但是这微乎其微代价却可以为你带来如此多的新特性和新功能，并且你所做的这一切可以完美地向后兼容。

所有拥有**Symbol.iterator**的对象被称为可迭代的。在接下来的文章中你会发现，可迭代对象的概念几乎贯穿于整门语言之中，不仅是**for-of**循环，还有**Map**和**Set**构造函数、解构赋值，以及新的展开操作符。

## 迭代器对象
现在，你将无须亲自从零开始实现一个对象迭代器，我们会在下一篇文章详细讲解。为了帮助你理解本文，我们简单了解一下迭代器（如果你跳过这一章，你将错过非常精彩的技术细节）。

**for-of**循环首先调用集合的**Symbol.iterator**方法，紧接着返回一个新的迭代器对象。迭代器对象可以是任意具有**.next()**方法的对象；**for-of**循环将重复调用这个方法，每次循环调用一次。举个例子，这段代码是我能想出来的最简单的迭代器：

```
var zeroesForeverIterator = {
 [Symbol.iterator]: function () {
   return this;
  },
  next: function () {
  return {done: false, value: 0};
 }
};
```
每一次调用**.next()**方法，它都返回相同的结果，返回给for-of循环的结果有两种可能：(a) 我们尚未完成迭代；(b) 下一个值为0。这意味着(**value of zeroesForeverIterator**) {}将会是一个无限循环。当然，一般来说迭代器不会如此简单。

这个迭代器的设计，以及它的**.done**和**.value**属性，从表面上看与其它语言中的迭代器不太一样。在**Java**中，迭代器有分离的**.hasNext()**和**.next()**方法。在**Python**中，他们只有一个**.next() **方法，当没有更多值时抛出**StopIteration**异常。但是所有这三种设计从根本上讲都返回了相同的信息。

迭代器对象也可以实现可选的**.return()**和**.throw(exc)**方法。如果**for-of**循环过早退出会调用**.return()**方法，异常、**break**语句或**return**语句均可触发过早退出。如果迭代器需要执行一些清洁或释放资源的操作，可以在**.return()**方法中实现。大多数迭代器方法无须实现这一方法。**.throw(exc)**方法的使用场景就更特殊了：**for-of**循环永远不会调用它。但是我们还是会在下一篇文章更详细地讲解它的作用。

现在我们已了解所有细节，可以写一个简单的**for-of**循环然后按照下面的方法调用重写被迭代的对象。

首先是**for-of**循环：

```
for (VAR of ITERABLE) {
  一些语句
}
```
然后是一个使用以下方法和少许临时变量实现的与之前大致相当的示例，：

```
var $iterator = ITERABLE[Symbol.iterator]();
var $result = $iterator.next();
while (!$result.done) {
   VAR = $result.value;
   一些语句
   $result = $iterator.next();
 }
```
这段代码没有展示**.return()**方法是如何处理的，我们可以添加这部分代码，但我认为这对于我们正在讲解的内容来说过于复杂了。**for-of**循环用起来很简单，但是其背后有着非常复杂的机制。

## 我何时可以开始使用这一新特性？
目前，对于**for-of**循环新特性，所有最新版本**Firefox**都（部分）支持（译注：从**FF 13**开始陆续支持相关功能，**FF 36 - FF 40**基本支持大部分特性），在**Chrome**中可以通过访问**chrome://flags** 并启用“实验性JavaScript”来支持。微软的**Spartan**浏览器支持，但是**IE**不支持。如果你想在**web**环境中使用这种新语法，同时需要支持**IE**和**Safari**，你可以使用[Babel](http://babeljs.io/)或Google的[Traceur](https://github.com/google/traceur-compiler#what-is-traceur)这些编译器来将你的ES6代码翻译为**Web**友好的**ES5**代码。

而在服务端，你不需要类似的编译器，**io.js**中默认支持**ES6**新语法（部分），在**Node**中需要添加--**harmony**选项来启用相关特性。

**{done: true}**

喲！

好的，我们今天的讲解就到这里，但是对于**for-of**循环的使用远没有结束。

在**ES6**中有一种新的对象与**for-of**循环配合使用非常契合，我没有提及它因为它是我们下周文章的主题，我认为这种新特性是**ES6**种最梦幻的地方，如果你尚未在类似**Python**和**C#**的语言中遇到它，你一开始很可能会发现它令人难以置信，但是这是编写迭代器最简单的方式，在重构中非常有用，并且它很可能改变我们书写异步代码的方式，无论是在浏览器环境还是服务器环境，所以，下周的深入浅出 **ES6** 中，请务必一起来仔细看看 **ES6** 的生成器：**generators**。


