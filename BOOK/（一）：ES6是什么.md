
> 编者按：ECMAScript 6离我们越来越近了，作为它最重要的方言，Javascript也即将迎来语法上的重大变革，InfoQ特开设“深入浅出ES6”专栏，来看一下ES6将给我们带来哪些新内容。本专栏文章来自Mozilla Web开发者博客，由作者授权翻译并发布。

欢迎来到**ES6**深入浅出！**JavaScript**的新版本离我们越来越近，我们将通过每周一节的系列课程一起探索**ECMAScript 6**新世界。**ES6**中包含了许多新的语言特性，它们将使**JS**变得更加强大，更富表现力。在接下来的几周内，我们将一一深入了解它们。但在我们开始详细学习之前，我认为十分有必要花几分钟讲解一下**ES6**到底是什么，以及你可以从中学到什么！

## ECMAScript发生了什么变化？
编程语言**JavaScript**是**ECMAScript**的实现和扩展，由**ECMA**（一个类似**W3C**的标准组织）参与进行标准化。**ECMAScript**定义了：

* [语言语法](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Lexical_grammar) – 语法解析规则、关键字、语句、声明、运算符等。
* [类型](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Data_structures) – 布尔型、数字、字符串、对象等。
* [原型和继承](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Inheritance_and_the_prototype_chain)
* 内建对象和函数的[标准库](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects) – [JSON](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/JSON)、[Math](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Math)、[数组方法](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array)、[对象自省方法](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object)等。

**ECMAScript**标准不定义**HTML**或CSS的相关功能，也不定义类似**DOM**（文档对象模型）的[Web API](https://developer.mozilla.org/zh-CN/docs/Web/API)，这些都在独立的标准中进行定义。**ECMAScript**涵盖了各种环境中**JS**的使用场景，无论是浏览器环境还是类似[node.js](https://nodejs.org/en/)的非浏览器环境。

## 新标准
上周，**ECMAScript**语言规范第6版最终草案提请**Ecma**大会审查，这意味着什么呢？

这意味着在今年夏天，我们将迎来最新的**JavaScript**核心语言标准。

这无疑是一则重磅新闻。早在**2009**年，上一版**ES5**刚刚发布，自那时起，**ES**标准委员会一直在紧锣密鼓地筹备新的**JS语言标准——ES6**。

ES6是一次重大的版本升级，与此同时，由于**ES6**秉承着最大化兼容已有代码的设计理念，你过去编写的**JS**代码将继续正常运行。事实上，许多浏览器已经支持部分**ES6**特性，并将继续努力实现其余特性。这意味着，在一些已经实现部分特性的浏览器中，你的**JS**代码已经可以正常运行。如果到目前为止你尚未遇到任何兼容性问题，那么你很有可能将不会遇到这些问题，浏览器正飞速实现各种新特性。

## 版本号6
**ECMAScript**标准的历史版本分别是**1、2、3、5**。

那么为什么没有第**4**版？其实，在过去确实曾计划发布提出巨量新特性的第**4**版，但最终却因想法太过激进而惨遭废除（这一版标准中曾经有一个极其复杂的支持泛型和类型推断的内建静态类型系统）。

ES4饱受争议，当标准委员会最终停止开发**ES4**时，其成员同意发布一个相对谦和的**ES5**版本，随后继续制定一些更具实质性的新特性。这一明确的协商协议最终命名为**“Harmony”**，因此，**ES5**规范中包含这样两句话：

>ECMAScript是一门充满活力的语言，并在不断进化中。

>未来版本的规范中将持续进行重要的技术改进。

这一声明许下了一个未来的承诺。

## 兑现承诺
**2009**年发布的改进版本**ES5**，引入了[Object.create()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/create)、[Object.defineProperty()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)、[getters](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions/set)和[setters](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions/set)、[严格模式](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Strict_mode)以及[JSON](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/JSON)对象。我已经使用过所有这些新特性，并且我非常喜欢**ES5**做出的改进。但事实上，这些改进并没有深入影响我编写**JS**代码的方式，对我来说最大的革新大概就是新的[数组](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array)方法：[.map()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/map)、. [filter()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)这些。

但是，**ES6**并非如此！经过持续几年的磨砺，它已成为**JS**有史以来最实质的升级，新的语言和库特性就像无主之宝，等待有识之士的发掘。新的语言特性涵盖范围甚广，小到受欢迎的语法糖，例如箭头函数**（arrow functions）**和简单的字符串插值**（string interpolation）**，大到烧脑的新概念，例如代理**（proxies）**和生成器**（generators）**。

**ES6**将彻底改变你编写JS代码的方式！

这一系列旨在向你展示如何仔细审阅**ES6**提供给**JavaScript**程序员的这些新特性。

我们将从一个经典的“遗漏特性”说起，十年来我一直期待在**JavaScript**中看到的它。所以从现在起就加入我们吧，一起领略一下**ES6**迭代器**（iterators）**和新的**for-of**循环！

