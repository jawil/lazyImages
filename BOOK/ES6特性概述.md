本文中将重温 JavaScript/ECMAScript 2015 的新特性，该版本是对 JavaScript 语言的重大更新。我们会特别重视这些特性是如何有助于更大系统的开发，以及如何与过去的方法比较。还会向你展示如何用 ECMAScript 2015，加上 async/await 支持，来创建一个现代项目。请继续阅读！

本文基于 Luke Hoban 的出色工作，以及他的 [es6features GitHub repository](https://github.com/lukehoban/es6features)。对于想学习更多的人来说，另一个不错的资源就是 [Mozilla 开发者网络](https://developer.mozilla.org/en-US/)。当然，致谢词如果不提到 [Rauschmayer 博士的博客](http://www.2ality.com)那就是不完整的，在他的博客中可以找到对 ECMAScript 2015 的深入看法。

* * *

## 简介

在多年的缓慢发展之后，JavaScript 已经看到了重生。Node.js 和较新的前端框架以及库已经恢复了语言背后的热情。它在 medium 和大系统上的使用已经让人们努力思考 JavaScript 需要如何发展。其结果就是 ECMAScript 2015，对该语言的一次重大更新，带来了很多已经计划很久的想法。下面我们来看看这些想法是如何有助于让 JavaScript 成为一门对今天的各种使用都更好的语言。

## ECMAScript 2015 特性

### Let 和 Const

JavaScript 最初就只有一种声明变量的方式：`var`。不过，`var` 语句遵从**变量提升**的规则。也就是说，`var` 声明表现的好像是变量声明在当前执行上下文（函数）的顶部一样。这会导致不直观的行为：

```
function test() {
    // 想写一个全局变量 'foo'
    foo = 2;

    // 大量代码在这里

    for(var i = 0; i < 5; ++i) {
        // 这个声明被移到函数顶部，导致第一个 'foo' 成为局部变量而不是全局的。
        var foo = i;
    }
}

test();
console.log(foo); //应该打印 2，但是结果一个异常。
```

对于大的代码库，变量提升会导致不可预期以及有时令人吃惊的行为。特别是，在很多其它流行的语言中，变量声明是被限制到封闭块的词法作用域，所以 JavaScript 新手会完全忽视 `var` 的语义。

ECMAScript 2015 引入了两种声明变量的新方法：`let` 和 `const`。这两个语句的行为与其它语言更符合。

#### LET

`let` 语句的写法与 `var` 完全一样，但是有一个很大的不同之处：`let` 声明被限制到包围作用域，但是只在从语句所在的点向前可用。换句话说，在 `for` 循环内，或者仅在封闭括号内声明的变量，只在该块内有效，并且只在该 `let` 语句之后有效。这种行为更直观。用 `let` 替代 `var` 在很多情况下是被鼓励的。

#### CONST

`const` 的概念稍微复杂点。在 JavaScript 中，所有声明都是**可重新绑定的（rebindable）**。变量声明在 `name` 和 JavaScript 对象或者基础类型之间建立了一种连接。这个相同的名称其后可能被重新绑定到不同的对象或者基础类型。也就是说：

```
var foo = 3; //foo 被绑定到基础类型数据 3。
foo = ["abc", "def"]; // foo 现在被绑定到一个数组对象。
```

`const` 语句与 `let` 和 `var` 语句相反，它不允许在初始声明后，将名称重新绑定到不同对象：

```
const foo = 3; //foo 被绑定到基础类型数据 3。
foo = ["abc", "def"]; // TypeError exception!
```

值得注意的是，`const` 不会以任何方式影响**可写性（writability）**。这与诸如 C 和 C++ 这类语言的 `const` 概念是相反的。可以说，选择 `const` 这么个名字可能不是一个好主意。

> 可写性可以用 `Object.defineProperty()` 和 `Object.freeze()` 控制，并且与 `const` 语句无关。要记住在非严格模式下写入只读属性是会被默默忽略的。严格模式下会将这些错误报告为 TypeError 异常。

在某种绑定可以被操纵的地方放上较为严格的要求可以防止代码错误。在这种情况下，`let` 和 `const` 都有很大帮助。

### 箭头函数和词法 this

JavaScript 作为一门多范式语言，可以使用很多函数式特性。在这些特性中，闭包和匿名函数是精华。箭头函数引入了一种新的、较短的语法来声明它们。我们来看看：

```
// ES2015 之前
[1, 2, 3, 4].forEach(function(element, idx) {
    console.log(element);
});

// ES2015 之后：箭头函数
[1, 2, 3, 4].forEach((element, idx) => {
    console.log(element);
});
```

起初这可能看起来像小的改进。不过，当箭头函数遇到 `this`、`arguments`、`super` 和 `new.target` 时，表现的就完全不同了。这些都是在函数作用域内局部预定义的声明。箭头函数是从外层函数继承这些元素的值，而不是声明重新声明一套。这就防止了出错，并且整理出某种常见的代码模式：

```
function Counter() {
    this.count = 20;

    setInterval(function callback() {
        ++this.count; // BUG! this 指向 Global 对象
                      // 或者是未定义的（在严格模式下）
    }, 1000);
}

const counter = new Counter();
```

很容易像这样犯错。过去修复这种错误的方式相当麻烦：

```
function Counter() {
    // 每当在一个局部函数内需要引用 this 时，我们就会用这种方式。
    var that = this;
    this.count = 20;

    setInterval(function callback() {
        ++that.count; 
    }, 1000);
}

const counter = new Counter();
```

而在 ECMAScript 2015 中事情就更简单明了：

```
function Counter() {
    this.count = 20;

    setInterval(() => {
        // this 绑定到外层作用域的 this 值。
        ++this.count; 
    }, 1000);
}

const counter = new Counter();
```

### JavaScript 类

JavaScript 从它最初就已经支持了面向对象编程。不过，JavaScript 实现 OOP 的形式对很多开发者来说却是完全不熟悉的，特别是哪些来自 Java 和 C++ 语言家族的开发者。这两类语言以及很多其它语言是本着 Simula 67 的精神来实现对象。而 JavaScript 是本着 Self 的精神来实现对象。这种 OOP 模式被称为**基于原型编程**。

基于原型编程对于来自其它对象模式的开发者来说可能是不直观的。这已经导致了很多 JavaScript 库推出了它们自己使用对象的方法。这些方法有时候是不兼容的。基于原型编程足够强大去模拟基于类的编程模型，库编写者已经推出了很多这样做的方法。

在做这事的方法上缺乏一致意见已经导致分裂以及库之间的耦合问题。ECMAScript 2015 试图纠正此问题，它提供了一种在原型之上做基于类的编程的常用方法。这已经导致社区中的一些争论，因为很多人认为基于原型的方式更好。

ECMAScript 2015 中的类是在原型之上模仿类的语法糖：

```
class Vehicle {
    constructor(maxSpeed) {
        this.maxSpeed = maxSpeed;
    }

    get maxSpeed() {
        return maxSpeed;
    }
}

class Car extends Vehicle {
    constructor(maxSpeed) {
        super(maxSpeed);
        this.wheelCount = 4;
    }
}
```

在基于原型的方式中看起来是这样的：

```
function Vehicle(maxSpeed) {
    this.maxSpeed = maxSpeed;
}

Vehicle.prototype.maxSpeed = function() {
    return this.maxSpeed;
}

function Car(maxSpeed) {
    Vehicle.call(this, maxSpeed);
}

Car.prototype = new Vehicle();
```

JavaScript 解释器将类翻译为原型链所采用的确切步骤在 [JavaScript 规范](https://tc39.github.io/ecma262/#sec-runtime-semantics-classdefinitionevaluation)中已经有了。

对于大的项目来说，类的实际用处与倾向于原型相比，是一个讨论较多的问题。有些人认为基于类的设计随着代码库的发展会较难扩展，或者说，基于类的设计需要考虑更周全。而另一方面，类的倡导者认为类更容易被来自其它语言的开发者所理解，而且有久经考验的现成设计证明其有用性。

> 作为启发 JavaScript 原型的语言，Self 的设计目标之一，就是要避免 Simula 方式的对象的问题。特别是，类和实例之间的对立被看作是 Simula 方法中很多内在问题的起因。有人认为，因为类为对象实例提供了某种原型，随着代码演变和变得更大，它越来越难让这些基类适应预料不到的新需求。通过为构造新对象的原型创建实例，这种限制就被移除了。因此**原型**的概念是：通过提供它自己的行为，来填补新实例空白的实例。如果一个原型被认为不适合创建新对象，可以就将它克隆，然后修改，不会影响所有其它子实例。这可以说在基于类的方式中（即修改基类）是较难做到的。

不管你在此问题上是什么想法，有一件事情是清楚的：如果你宁愿坚持基于类的方式，那么现在有一个官方批准这样做的方法。否则，就对核心内容用原型好了。

### JavaScript 对象字面量改进

另一个带来实用性的特性是对象字面量声明的改进。来看一看：

```
function getKey() {
    return 'some key';
}

let obj = {

    // 原型可以按这种方式设置
    __proto__: prototypeObject,
    
    // key === value, someObject: someObject 的缩写
    someObject,
    
    // 方法现在可以按这种方式定义
    method() {
        return 3;
    },
    
    // key 的动态值
    [getKey()]: 'some value'
};
```

对比一下，过去做这些事情需要像这样：

```
let obj = {
    someObject: someObject,
    method: function() {
        return 3;
    }
};

obj.prototype = prototypeObject;
obj[getKey()] = 'some value';
```

任何有助于可读性，以及让应该合成整体的代码块尽可能靠近的事情都有助于减少犯错的机会。

### JavaScript 模板字符串字面量

现在几乎每个项目中你都需要将值插到一个字符串中。在 JavaScript 做这事的标准方式是通过重复的字符串连接：

```
var str = 'The result of operation ' + op + ' is ' + someNumber;
```

这样做不咋漂亮，或者有可维护性的问题。假如有一个很长的字符串带有很多值，那么事情就会很快失控。

基于此原因，像 `sprintf` 这种库被创建了，该库是受 C 的 `sprintf` 函数启发：

```
var str = sprintf('The result of operation %s is %s', op, someNumber);
```

这样做要好一些，但是太像 C 的 sprintf 了，格式字符串和传递给 sprintf 所需的值之间是完美相关的。如果从调用中删除一个参数，就会得到 bug。

ECMAScript 2015 带来了更好的解决方案：

```
const str = `The result of operation ${op} is ${someNumber}`;
```

简单，并且较难打破！这些新字符串字面量的附加特性是支持多行：

```
const str = `This is a very long string.
We have broken it into multiple lines to make it easier to read.`;
```

其它与字符串相关的附加特性是原始字符串和标签函数。原始字符串有助于防止与转义符和引号相关的错误：

```
String.raw`Hi\u000A!`; // 不处理 unicode 转义符
```

如果还没有理解字符串标签的话，语法会看起来有点古怪：

```
function tag(strings, ...values) {
  console.log(strings[0]); // "Hello "
  console.log(strings[1]); // " world "
  console.log(strings[2]); // ""
  console.log(values[0]);  // 1
  console.log(values[1]);  // 'something'

  return "这是被返回的字符串，它不需要用参数";
}

const foo = 1;
const bar = 'something';

tag`Hello ${a} world ${b}`;
```

标签函数本质上是以任意方式转换字符串字面量的函数。可想而知，它们可能被以损害可读性的方式滥用，所以要小心使用。

### ECMAScript 2015 Promise

ECMAScript 2015 中最大特性之一。Promise 试图给 JavaScript 的异步本性带来点理智。如果你是一名经验丰富的 JavaScript 开发者，就知道回调和闭包是主流。你也知道，它们是很灵活的。这意味着每个人都有权选择如何去用它们。而在动态语言中，如果出乎意料地将两个回调约定混合在一起，是没有人能阻止你的。

如下是没有用 promise 时 JavaScript 中的样子：

```
var updateStatement = '...';

function apiDoSomething(withThis) {
    var url = 'https://some.cool.backend.com/api/justDoIt';
    httpLib.request(url, withThis, function(result) {
        try { 
            database.update(updateStatement, parseResult(result), 
                function(err) {
                    logger.error('HELP! ' + err);
                    apiRollbackSomething(withThis);
                }
            );
        } catch(e) {
            logger.error('EXCEPTION ' + e.toString());
            apiRollbackSomething(withThis);
        }
    }, function(error) {
        logger.error('HELP! ' + error + ' (from: ' + url + ')');
    });
}
```

这看上去很简单。为什么说是看上去呢？因为它实际上对以后的程序员（或者你自己！）来说是一个雷区。下面我们一步一步看看它。我们首先看到的是 `updateStatement`。这个变量可能是包含一条 SQL 语句或者命令，可能是用某个值做参数去更新数据库。但是 `var` 不会阻止之后将 `updateStatement` 重新绑定到其它地方，所以，如果偶然有人这些写：

```
function buggedFunction() {
    // 重新绑定全局的 updateStatement!
    updateStatement = 'some function local update statement';
    // ...
}
```

而不是：

```
function buggedFunction() {
    // 遮蔽全局 updateStatement
    var updateStatement = 'some function local update statement';
    // ...
}
```

那么，你得到的就是...一个 BUG!

但是这与 promise 没有任何关系，我们继续看：

```
httpLib.request(url, withThis, function(result) {
    try { 
        database.update(updateStatement, parseResult(result), 
            function(err) {
                logger.error('HELP! ' + err);
                apiRollbackSomething(withThis);
            }
        );
    } catch(e) {
        logger.error('EXCEPTION ' + e.toString());
        apiRollbackSomething(withThis);
    }
}, function(error) {
    logger.error('HELP! ' + error + ' (from: ' + url + ')');
});

```

仔细看看这段代码。可以看到，这里有两类回调，一个嵌套在另一个中。二者对如何处理错误，以及如何传递成功调用后的结果，有不同的约定。出现不明错误时，不一致性是一个大的因素。不仅如此，它们嵌套的方式会阻止异常处理器成为块中唯一的故障点，所以 `apiRollbackSomething` 需要用完全相同的参数调用两次。这是特别危险的。假如有人在将来修改代码，添加新的失败分支，会怎么样？这人还记得要回滚么？这人甚至能看到它么？最后，logger 也被多次调用，只是为了展示当前的错误，并且传递给它的参数是用字符串连接构造的，这又是不明错误的另一个来源。也就是说，这个函数对很多错误打开了大门。下面我们来看看 ECMAScript 是如何能帮助我们防止这些错误：

```Javascript
// 这样将来就不会被重新绑定！加上字符串是常量，所以保证永远不会修改。
const updateStatement = '...'; 

function apiDoSomething(withThis) {
    const url = 'https://some.cool.backend.com/api/justDoIt';
    httpLib.request(url, withThis).then(result => {
        // database.update 也返回一个 promise
        return database.update(updateStatement,parseResult(result));
    }).catch(error => {
        logger.error(`ERROR: ${error} (from url: ${url})`);
        // 我们的API是如此，这样万一最初的请求没有成功，回滚就被认为是空操作，
        // 所以在这里调用它是 OK 的。
        apiRollbackSomething(withThis);
    });
}
```

这样很漂亮。前面描述的所有冲突点都被 ECMAScript 2015 摧毁了。当代码像这样呈现时，很难犯错，而且更容易读。这是个双赢的结果。

那么，为什么我们要从 `database.update` 返回结果呢？这是因为 promise 可以是链式的。也就是说，如果成功了，promise 可以把结果传给链中的下一个 promise；如果失败了，它可以执行正确的行为。下面我们来看看这在上例中是如何工作的。

第一个 promise 是 `httpLib.request` 创建的那一个。这是最外层的 promise，它将是告诉我们 `httpLib.request` 执行顺利或者失败的那一个。不管顺利还是失败，如果要做点事情的话，我们可以用 `then` 或者 `catch` 函数。这两个函数并非必须要调用。你可以调用一个，也可以两个都调用（像上面我们做的那样），或者是完全不理会结果。现在，在两个处理器中有两件事情会发生：

1. 可以把数据传递给函数（要么是结果，要么是错误），并返回一个值、一个 promise 或者什么都不返回。
2. 可以抛出一个异常。

如果抛出了一个异常，`then` 和 `catch` 都知道如何处理它：把它当作一个错误条件。也就是说，链中的下一个 `catch` 会捕获该异常。在本例中，最外层的 `catch` 捕获所有错误，包括由 `httpLib.request` promise 产生的那些错误以及 `then` 之内产生的那些错误。要注意在最外层 `catch` 内抛出的异常会发生什么：它们被**存储**在 promise 内，将来给 `catch` 或者 `then` 调用。如果没有调用执行（如同上例中发生的），该异常就被忽视。还好 `apiRollbackSomething` 不会抛出任何异常。

> 函数 `then` 和 `catch` 总是会返回 promise（即使在链中没有更多 promise）。这意味着在调用两个函数之后，你还可以再次调用 `then` 或者 `catch`。这就是为什么说 promise 可以是**链式**的原因。当所有事情执行完后，任何对 `then` 或者 `catch` 的进一步调用会立即执行传递给它们的回调。

值得注意的是，链式 Promise 通常是对的。在上例中，我们可以省略 `database.update` 前的 `return` 语句。如果数据库操作没有导致错误，那么这段代码一样起作用。但是，如果发生了错误，那么代码就有不同的表现了：如果数据库操作失败，下面的 `catch` 块不会被调用，因为这个 promise 不会链到最外层的 promise。

那么如何创建自己的 promise 呢？很简单：

```
const p = new Promise((resolve, reject) => {
    try {
        const result = action(data);
        resolve(result);
    } catch(e) {
        logger.error(e.toString());
        reject(e);
    }
});
```

promise 也可以在promise 构造器内链在一起：

```
const p = new Promise((resolve, reject) => {
    const url = getUrl();
    resolve(
        httpLib.request(url).then(result => {
            const newUrl = parseResult(result);
            return httpLib.request(newUrl); 
        })
    );
});
```

这里可以看到 promise 的全部威力了：两个 HTTP 请求被链进一个 promise。第一个请求的数据结果被处理，然后用来构造第二个请求。所有的错误都在内部被 promise 逻辑处理。

总之，promise 让异步代码更具可读性，减少了犯错的机会。它们还结束了有关 promise 如何工作的讨论，因为在 ECMAScript 2015 之前，有不少有自己 API 的竞争性解决方案。

### ECMAScript 2015 Generator、iterator、iterable 和 for...of

生成器（generator）是 ECMAScript 2015 的另一个重大特性。如果你是 Python 程序员，那么就会很快明白 JavaScript 生成器，因为二者是很相似的。我们来看一看：

```
function* counter() {
    let i = 0;
    while(true) {
        yield i++;
    }
}
```

如果不是 Python 开发者，那么在分析以上代码时，脑子里面会抛出 `SyntaxError` 好几次。我们来看看是咋回事。第一件看起来有点古怪的事情是 `function` 旁边的星号，这是在 ECMAScript 2015 中声明生成器的新方法。第二个就是函数内的 `yield`。`yield` 是一个新关键词，用来指示解释器临时暂停生成器的执行，并返回传递给它的值。在本例中，`yield` 会返回 `i` 中的值。重复调用生成器会从最后一个 yield **恢复**执行，从而会保留所有状态。

```
const gen = counter();
console.log(gen.next().value); // 0
console.log(gen.next().value); // 1
console.log(gen.next().value); // 2
```

如果这些东西似曾相识，可能是因为在计算机科学中有一个很熟悉的称为**协程（coroutine）**的概念。但是协程与异常对比，有一个特殊功能：它们可以在每次调用 `yield` 后，从外部接受新数据。实际上，JavaScript 支持协程！所以 JavaScript 生成器实际上是协程。

```
function* counter() {
    let i = 0;
    while(true) {
        const reset = yield i++;
        if(reset) {
            i = 0;
        }
    }
}

const gen = counter();
console.log(gen.next().value); // 0
console.log(gen.next().value); // 1
console.log(gen.next().value); // 2
console.log(gen.next(true).value); // 0
console.log(gen.next().value); // 1
console.log(gen.next().value); // 2
```

不过，所有这些此时可能看起来是多此一举。为什么要添加生成器？它们以哪种方式可以帮助让代码更干净以及防止错误呢？生成器被添加进来，是为了更容易给 JavaScript 带来 **迭代器（iterator）** 的概念。现在，迭代器确实相当多地出现在很多项目中。那么在 ECMAScript 2015 之前，迭代器是怎么实现的呢？每个人都有自己的实现方式：

```
function arrayIterator(array) {
    var i = 0;
    return {
        next: function() {
            // 可能会抛出
            return array[i++];
        },
        ended: i >= array.length,
        reset: function() {
            i = 0;
        }
    }
}

var data = [0, 1, 2, 3, 4];
var iter = arrayIterator(data);
console.log(iter.next()); // 0
console.log(iter.next()); // 1
console.log(iter.next()); // 2
```

所以，从某种程度上说，生成器试图为迭代器的使用带来一种标准方法。实际上，JavaScript 中的迭代器不过就是一种协议，即，它是一种用来创建对象的被批准的 API，可以用来迭代可迭代的对象。这个协议最好是用一个示例来描述：

```
function arrayIterator(array) {
    var i = 0;
    return {
        next: function() {
            return i < array.length ? {
                value: array[i++],
                done: false
            } : {
                done: true
            };
        }
    }
}
```

特别关注一下 `arrayIterator` 函数返回的对象：它描述了 JavaScript 迭代器所需的协议。也就是说，迭代器是一个满足如何条件的对象：

* 包含一个不带参数的 `next` 函数。
* `next` 函数返回一个包含一个或者两个成员的对象。如果成员 `done` 为真，那么就不出现其它成员。`done` 标志迭代是否完成。另一个成员将是 `value`，代表当前迭代值。

所以，任何遵循该协议的对象都可以被称为 JavaScript 迭代器。这样挺好，有官方的方法，意味着混用不同的库不会导致出现六种不同类型的迭代器（并且必要时不得不在它们之间用适配器！）。约定和协议对于可维护性是很好的，因为这样混合似是而非的东西的机会就会更少，而在 JavaScript 中是极其容易干出这种事情的。

所以，必须按这种方式写迭代器，虽然简单，但是也是比较麻烦的。如果 JavaScript 提供了一种很容易创建这些对象的方法会怎么样？这就是生成器。生成器函数实际上就是返回迭代器。也就是说，JavaScript 生成器是以更方便的方式创建迭代器的助手。特别是生成器和 `yield` 关键字的使用，有助于更容易理解在迭代器中状态管理的方式。例如，上面的示例可以简化为：

```
function* arrayIterator(array) {
    for(let i = 0; i < array.length; ++i) {
        yield array[i];
    }
}
```

简单，而且更容易读和理解，即使对一个没有经验的开发者来说也是如此。代码清晰对可维护性是至关重要的。

但是我们遗漏了生成器和迭代器谜题中的一个关键部分：有很多**可迭代（iterable）**的东西。特别是，集合通常是可以遍历的。当然，集合中元素被遍历的方式会根据有关的集合而改变，但是迭代的概念依然适用。所以 ECMAScript 2015 多提供了两个方式来完成迭代器和生成器谜题：**iterable** 协议和 `for..of`。

iterable 是为方便创建迭代器而提供接口的对象。也就是说，iterable 是提供如下 key 的对象：

```
const infiniteSequence = {
    value: 0
    [Symbol.iterator]: function* () {
        while(true) {
            yield value++; 
        }
    }
};
```

`Symbol.iterator` 和 `Symbol` 对象是 ECMAScript 2015 中新出现的，所以看起来很古怪。后面我们会复习 `Symbol`，但是现在就把它当作是一种创建唯一标识符（Symbol）的方式，这种唯一标识符可以用来索引其它对象。这里另一个古怪的东西是字面量对象语法。我们是在一个对象字面量内使用 `[Symbol.iterator]` 来设置其 key。在上面我们已经复习了这种对象字面量的扩展。这里出现的示例没有什么不同：

```
let obj = {
    // ...
    // key 的动态值
    [getKey()]: 'some value'
}
```

所以，简而言之，iterable 是提供一个 `Symbol.iterator` 键的对象，该键的值是一个生成器函数。

这样现在遍历的对象内部就有一个新的键。那么，每次我们想遍历由这些对象管理的元素时，是否需要显式从这些对象获取生成器吗？答案是不需要！鉴于这是一个很常见的模式（遍历容器管理的元素），所以 JavaScript 现在提供了一种新版本的 `for` 控制结构：

```
for(let num of infiniteSequence) {
    if(num > 1000) {
        break;
    }
    console.log(num);
}
```

不错！所以可迭代的对象都可以使用新的 `for..of` 循环轻松遍历。并且关于 `for..of` 的好消息是，已有的集合为了用它，已经被改编了。所以，数组和新的集合（`Map`、`Set`、`WeakMap`）都可以用这种方式：

```
const array = [1, 2, 3, 4];
// 本文后面会讨论 Map
const map = new Map([['key1', 1], 
                     ['key2', 2], 
                     ['key3', 3]]);

for(let elem of array) {
    console.log(elem);
}

for(let [key, value] of map) {
    console.log(`${key}: ${value}`);
}
```

注意最后一个 `for..of` 循环中的古怪语法：`let [key, value]`。这种语法称为解构（desctructuring），是 ECMAScript 2015 的另一个新特性。我们会在后面讨论。

一致性和简化可以对可读性和可维护性创造奇迹，这正是迭代器、iterable、生成器以及 `for..of` 循环所带来的。

### 函数: 默认参数和 rest 运算符

函数现在支持默认参数，简化了检查一个参数是否存在，然后给它设置值的常见模式。


```
function request(url, method = 'GET') {
    // (...)
}
```

随着参数的数目增长，默认参数简化了在函数开头需要检查的流程。简化在编码中是没错的。

```
function request(url, method) {
    // 想像一下如果没有 ES 2015，每个默认参数都要重复这个步骤！
    if(typeof method === 'undefined') {
        method = 'GET';
    }
}
```

默认参数还可以用 `undefined` 值。也就是说，当传递 `undefined` 给一个默认参数，那么该参数会采用其默认值替换。

```
function request(url, method = 'GET', data = {}, contentType = 'application/json') {
    // (...)
}

request('https://my-api.com/endpoint', undefined, { hello: 'world' });
```

不过，这并不是说就不要恰当的 API 设计了。在上面的示例中，用户可能会把第三个参数传为第二个，特别是在用 `HTTP GET` 时。所以，虽然默认参数可以帮助减少函数内的样板代码，但是还是必须注意挑选正确的参数次序及其默认值。

`rest` 运算符是一个新的运算符，受 C 语言启发。我们来看看：

```
function manyArgs(a, b, ...args) {
    // args === ['Hello', 'World', true]
}

manyArgs(1, 2, 'Hello', 'World', true);
```

当然，JavaScript 确实允许通过 `arguments`，访问在函数的参数列表中没有声明的参数。那么为什么要用 rest 运算符呢？有两个好的理由：

* 为了去掉必须手动查找在参数列表中没有命名的第一个参数的需要。这可以防止愚蠢的算错边界的错误，这个错误通常发生在参数被添加或者删除到函数时。
* 为了能把包含未声明参数的变量当作一个真正的 JavaScript 数组。因为从一开始 `argument` 就一直像数组一样，但是实际上并不是数组。相反，由 rest 运算符创建的变量是真正的数组，这带来一致性，一致性总是好的。

因为通过 rest 运算符声明的变量是真正的数组，所以 `arguments` 中出现的有些方法，比如 `caller` 和 `callee` 现在就不能用了。

### 扩展语法

快速理解扩展（spread）的一种方式是将它当作与 rest 运算符相反。扩展语法用来自一个数组（或者实际上是任何 iterable）的元素替换参数列表。也就是说：

```
function manyArgs(a, b, c, d) {
    // (...)
}

let arr = [1, 2, 3, 4];

manyArgs(...arr);

//manyArgs.apply(null, arr); //老方法，可读性不佳
```

扩展语法可以用在除函数调用以外的地方。这为有趣的应用程序打开了可能性：

```
const firstNumbers = [1, 2, 3, 4];
const manyNumbers = [-2, -1, 0, ...firstNumbers, 5, 6, 7];

const arrayCopy = [...firstNumbers];
```

扩展语法从以前版本的 JavaScript 中删除了一个烦人的限制：`new` 运算符不能与 `apply` 一起用。`apply` 带有一个函数对象为参数，`new` 是一个运算符。也就是说，不可能像下面这样做：

```
const nums = [1, 2, 3, 4, 5];
function NumberList(a, b, c, d, e) {
    this.a = a;
    // (...)
}

//NumberList.apply(new NumberList(), nums); //没有参数传递给NumberList!
```

现在我们可以这样做：

```
const numList = new NumberList(...nums);

```

扩展语法简化了很多常用模式。而简化对可读性和可维护性总是不错的。

### JavaScript 中的解构

解构（Destructuring）是一种 JavaScript 语法的扩展，它允许采用某种有趣的方式，将一个变量转换成绑定到其内部的多个变量。我们在上面已经看过一个例子：

```
for(let [key, value] of map) {
    console.log(`${key}: ${value}`);
}
```

在本例中，变量 `map` 被绑定到一个 `Map`。这种数据解构遵循 iterable 协议，为每次迭代提供值：一个键，及与该键关联的值。这两个值被返回在一个带有两个元素的数组中。键是第一个元素，值是第二个元素。

如果没有解构，那么上面的代码要像这样写：

```
for(let tuple of map) {
    console.log(`${tuple[0]}: ${tuple[1]}`);
}
```

这种使用与原始结构一样的语法，将对象的内部结构映射给变量的能力，使代码更清晰。下面我们来看另一个例子：

```
let [a, b, c, d, e] = [1, 2, 3, 4, 5];
console.log(a); // 1
console.log(b); // 2
```

这是简单的数组解构。对象解构是什么样呢？

```
const obj = {
    hello: 'world',
    arr: [1, 2, 3, 4],
    subObj: {
        a: true,
        b: null
    }
};

let { hello, arr, subObj: { b } } = obj;

console.log(hello); // world
console.log(b); // null
```

这就变得更有意思了。来看看这个例子：

```
const items = [
    {
        id: 0,
        name: 'iPhone 7'
    },
    {
        id: 1,
        name: 'Samsung Galaxy S7'
    },
    {
        id: 2,
        name: 'Google Pixel'
    }
];

for(let { name } of items) {
    console.log(name);
}
```

解构也可以用于函数的参数：

```
items.forEach(({ name }) => console.log(name));
```

还可以为解构了的元素挑选不同的名称：

```
items.forEach(({ name: phone }) => console.log(phone));
```

如何不能正确解构对象，会导致变量带有未定义值。

解构可以用默认参数组合（ECMAScript 2015 中的另一个新特性）。这简化了某种常见的代码模式：

```
function request(url, { method: 'GET', data }) {
    // (...)
}
```

对于默认参数和解构必须适当小心，因为 ECMAScript 2015 不允许捕获任何在解构表达式中没有声明的键。也就是说，如果上例中作为第二个参数传递的对象没有第三个键（假如说 `contentType` 键），就不可能访问它（除了通过 `arguments`，而这样做很烦人，且影响可读性）。这个疏忽会在 ECMAScript 2016 中修正。

在 ECMAScript 2015 中，数组确实有这种能力：

```
let arr = [1, 2, 3, 4, 5];
let [a, b, ...rest] = arr; // rest === [3, 4, 5]
```

数组也允许跳过条目：

```
let arr = [1, 2, 3, 4, 5];
let [a, , ...rest] = arr; // rest === [3, 4, 5], 数字 2 被跳过
```

可以说，解构是一种办事的新方法，而不是更好的方法。我个人建议保持简单和可读性。当引用一个内部变量可以简单地被写为 `let a = obj.subObj.a` 时，就不要滥用解构了。解构特定用于当从不同嵌套级别的对象中**挑选**多个元素时。这种情况下，可读性可以改进。它还可以用于函数参数和 `for` 循环，以减少所需辅助变量的数量。

### JavaScript 模块

模块是ECMAScript 2015 最期待的特性之一。为了让 JavaScript 实现大多数语言已经做到的功能：以方便、便携和高性能的方式将代码分离到不同的地方，必须对 JavaScript 进行扩展。模块的出现终结了与扩展的正确方式有关的无休止的讨论。

> 如果你是编程新手，可能很难理解为什么模块化对于正确的开发体验是如此必不可少的需求。可以把模块当作是一种组织代码的方式，这种方式下，代码被组织到自包含的工作单元中。这些单元定义了一种与其它单元进行交互的清晰方法。这种分离提升了可维护性、可读性，允许更多人同时开发，而不会相互干扰。保持小和简单在设计和实现过程中也很有帮助。

因为 JavaScript 被构想为一门针对 Web 的语言，所以它已经总是与 HTML 文件关联在一起。HTML 文件告诉浏览器去加载放在其它文件中的或者行内的脚本。先加载的脚本可以创建对于后来的脚本可用的全局对象。一直到 ECMAScript 2015，这都是来自不同 JavaScript 文件的代码可以相互通讯的唯一基本方式。这导致了大量不同的处理该问题的方法。模块打包器出于这种情况带来一些理智而应运而生。其它环境（比如 Node.js）的 JavaScript 解释器采纳了像 Common.js 这样的解决方案。其它的规范，比如异步模块定义（AMD），也出现了。社区中缺乏共识也逼得 ECMAScript 工作组去考虑一下现状。其结果就是 ECMAScript 2015 模块的出现。

> 要学习更多关于 Common.js、AMD 和 ECMAscript 2015 模块之间的区别，请看看 [JavaScript 模块系统对决：CommonJS vs AMD vs ES2015](https://auth0.com/blog/javascript-module-systems-showdown/)。

```
// helloworld.js

export function hello() {
    console.log('hello');
}
export function world() {
    console.log('world');
}

export default hello;

console.log('Module helloworld.js');
```

```
// main.js

import { hello, world } from 'helloworld.js';

hello();
world();
```

ECMAScript 2015 给该语言添加了一堆关键字： `import` 和 `export`。`import` 关键字让你可以把来自其它模块的元素带到当前模块。这些模块在导入期间可以重新命名，或者可以被批量导入。`export` 关键字做相反的事情：它将来自当前模块的元素标记为可用于导入。从其它模块导入的元素可以被再导出。

```
// hello 和 world 都可以用
import * from 'helloworld.js';

// HelloWorld 是一个包含 hello 和 world 的对象.
import * as HelloWorld from 'helloworld.js';

// 在这个模块中，helloFn 就是 hello，worldFn 就是 world.
import { hello as helloFn, world as worldFn } from 'helloworld.js';

// h 是 helloworld.js 中名为 Hello 的默认输出
import h from 'helloworld.js'; 

// 没有导入元素，但是 helloworld.js 模块的副作用运行了
// (模块中的 console.log 语句就是个副作用)。
import 'helloworld.js';
```

ECMAScript 2015 模块的一个有意思的特征是，`import` 的语义既允许异步加载模块，又允许同步加载模块。也就是说，解释器可以自由选择更合适的方式。而这在 Common.js（同步）和 AMD 模块中（异步）是大相径庭的。

#### 为什么浏览器花了这么久来实现模块？

如果根据上面所描述的原因，模块是这么重要，那么为什么现在还不能用它们呢？到 2016 年 11 月为止，大多数主流浏览器都原生实现了 ECMAScript 的大部分特性，但是模块依然是漏掉了。这到底是怎么回事呢？

虽然 ECMAScript 2015 确实在语法上定义了模块，但是规范没有提到在 Web 上到底该如何实现。也就是说，一个符合标准的实现只需要解析包含 `import` 和 `export` 语句的 JavaScript 文件，不需要实际用这做什么事情！这可能看起来像是一个大的疏忽，但是并非如此。正如本节开头提到的，JavaScript 总是与 Web 中的 HTML 搅在一起。不过，ECMAScript 2015 规范只关注 JavaScript 本身，它与 HTML 以及 JavaScript 如何被访问无关。也就是说，虽然一条 `import` 语句说清楚了让解释器应该试图去加载指定名称的文件，但是它却完全没说如何去得到这个文件。在 web 上，这意味着向服务器发送一条向指定 URL 的请求。而且，ECMAScript 对 HTML 和 JavaScript 的关系只字不提。

这个问题预计会被 [JavaScript 加载器标准](https://github.com/whatwg/loader) 解决，该标准试图为浏览器提出一个加载器规范以及类似于独立的解释器。HTML 预计也会添加所需语法，用来将 JavaScript 模块与其它常见的脚本区分（为此提议的一个语法是 ``）。

#### import 和 export 的静态性质

`import` 和 `export` 都是静态性质的。也就是说，使用这两个关键字的效果必须是在脚本执行前完全可计算的。这就为静态分析器和模块打包器做点手脚打开了可能性。像 Webpack 这种模块打包器可以在打包时创建一个完整而明确的依赖树。也就是说，删除不需要的依赖以及其它优化是可能的，而且规范是完全支持的。这与 Common.js 和 AMD 是有很大区别的。

但是静态模块确实也去掉一些在某些条件下很方便的灵活性。不幸的是，动态加载器提案没有把它加到 ECMAScript 2015 中。预计会在将来版本中会被加进去。已经有一个提案以 `System.import` 的形式存在。

#### 我们现在可以用模块吗？

是的，而且你应该用！虽然模块加载在浏览器中还没有实现，但是像 Babel、Webpack 和 System.js 这种打包器、编译器和库已经实现了 ECMAScript 2015 模块。提早采用模块的好处是，模块已经是规范的一部分了！你知道不管怎样，模块是一成不变的，在将来的 JavaScript 版本中不会看到大的变动。现在还用 Common.js 或者 AMD 意味着退步，采用将来会逐渐淡出的解决方案。

### 新的 JavaScript 集合

虽然 JavaScript 有必要的能力实现很多数据结构，但是有些数据结构最好是通过优化来实现，而这些优化只能靠解释器来实现。ECMAScript 2015 工作组决定解决此问题，并提出了 `Set`、`Map`、`WeakSet` 和 `WeakMap`。

`Set` 存储唯一的对象。对象要出现在集合中必须通过测试。`Set` 用特殊的比较语法（与 `===` 很相似）来检查对象的相等性。

`Map` 对 `Set` 进行了扩展，让任意值与唯一键关联在一起。也就是说，`Map` 允许使用任意唯一的键，这与普通 JavaScript 对象形成了对比（普通 JavaScript 对象只允许用字符串作为键）。

`WeakSet` 表现的像 `Set`，但是它不会取得存储在它其中的对象的所有权。也就是说，`WeakSet` 内的对象在集合外的对象不再引用它们之后，就变成了无效的了。`WeakSet` 值只允许对象存储在其内，不允许原始值。

`WeakMap` 是在键上弱（像 `WeakSet`），在它存储的值上强。

JavaScript 一直在数据结构部分比较弱。Set 和 Map 是用得最多的数据结构之一，所以将它们集成在语言中可以带来不少好处：

* 减少在外部库上的依赖数量
* 更少的测试代码（如果 map 或者 set 被语言实现了，就只需要测试其功能了）
* 为最常见的需求之一提供一致性的 API

不幸的是，基于 hash 的 map 依然不可用。

### 对象代理

对象代理（proxy）是 ECMAScript 2016 的另一个重大补充。对象代理可以让我们以有趣的方式自定义对象的行为。JavaScript 作为一门动态语言，在修改对象时是非常灵活的。不过，某些修改通过使用代理会更好表达。例如，下面我们来看看如何修改一个对象的所有属性的 get 操作，如果属性是一个数字，就加一。我们先用 ECMAScript 5 来解决这个问题。

```
var obj = {
    a: 1,
    b: 2,
    c: 'hello',
    d: 3
};

var obj2 = Object.create(obj);

Object.keys(obj).forEach(function(k) {
    if(obj[k] instanceof Number || typeof obj[k] === 'number') {
        Object.defineProperty(obj2, k, {
            get: function() {
                return obj[k] + 1;
            },
            set: function(v) {
                obj[k] = v;
            }
        });
    }
});

console.log(obj2.a); // 2
console.log(obj.a);  // 1
obj2.a = 4;
console.log(obj.a);  // 4
console.log(obj2.a); // 5
```

这里我们利用 JavaScript 的原型链机制，来重写（`译者注：shadow，意思是为隐藏、遮蔽、重新`）对象中的变量。重写的对象有一个自定义的 setter 和 getter，可以从原型对象访问该对象的变量。这样做可以起作用，但是按这样做有点难。下面我们看看 ECMAScript 2015 是如何改进的。

```
let obj = {
    a: 1,
    b: 2,
    c: 'hello',
    d: 3
};

let obj2 = new Proxy(obj, {
    get: function(object, property) {
        const value = object[property];
        if(value instanceof Number || typeof value === 'number') {
            return value + 1;
        } else {
            return value;
        }
    }
});

console.log(obj2.a); // 2
console.log(obj.a);  // 1
obj2.a = 4;
console.log(obj.a);  // 4
console.log(obj2.a); // 5
```

这样更干净一些：没有过多的键迭代，不需要显式重写 setter，不需要玩弄原型链。并且我们已经说过：更干净的代码就是更好的代码。

代理的另一个额外好处是，它们可以重写原本很难（或者不可能）重写的操作。例如，代理可以修改构造器的行为：

```
let Obj = new Proxy(function () { return { a: 1 } }, {
    construct: function(target, args, newTarget) {
        target.extension = 'This is an extension!';
        return target;
    }
});

const o = new Obj;
console.log(o.extension); // 'This is an extension';
```

### 反射

代理是对 JavaScript 动态能力的一个不错的补充，而对代理的补充就是反射（reflection）。对于每个可以被代理捕获和重写的操作，`Reflect` 对象允许用同样一致的 API 访问该操作。也就是说，如果代理提供了一个重写访问属性的 `get` 操作，那么 `Reflect` 也提供一个访问一个属性的 `get` 操作。

```
let obj = {
    a: 1,
    b: 2,
    c: 'hello',
    d: 3
};

// 等于 obj['a'];
console.log(Reflect.get(obj, 'a')); // 1

function SomeConstructor() {
    return { a: 1 };
}

// 等于 new SomeConstructor
const newObj = Reflect.construct(SomeConstructor, []);
console.log(newObj.a); // 1

// 等于 newObj 中的 'a'
console.log(Reflect.has(newObj, 'a'));
```

反射 API 的目标是给过去以其它方式执行的某种操作带来一致性。这些函数的作用可能没有代理 API 那么重要，但是依然是一个很受欢迎的补充。

### Symbol

Symbol 是 JavaScript 中新增加的基础数据类型。与已有的数据类型相比，Symbol 没有真实值。其优点在于唯一性。所有 Symbol 都是唯一的，并且是不可修改的。Symbol 主要用作对象的键。Symbol 对象键不同于字符串键，不能被 `Object.keys` 枚举，也不能被 `JSON.stringify`看到。

Symbol 的主要应用是用来创建对象内的特殊键。ECMAScript 2015 用 Symbol 机制定义某种很特定的键。例如，可迭代的对象可以用 `Symbol.iterator` 来定义它们的迭代器：

```
const obj = {
    [Symbol.iterator]: function* () {
        yield 1;
        yield 2;
    }
}

for(const v of obj) {
    console.log(v);
}
```

Symbol 可以帮助我们阻止污染带有不透明键的对象。它可以带有辅助消息来让调试更轻松。不过，带有相同消息的两个 Symbol 依然是可以区分的。

通过让特殊对象键的命名空间与一般键分开，ECMAScript 2015 就让调试变得更容易，对象序列化变得跟简单，减少了遇到由键名冲突导致的 bug 的机会。

### 类型化数组

JavaScript 的缺陷之一就是缺乏合适的数字数据类型。大部分时间，是可能以某种方法规避掉这种限制的。不过，大量数值的高效存储是不能实现的。这可以用类型化数组来解决。

```
const arr = new Uint8Array(1024);
arr[8] = 255;
```

类型化数组提供了对有符号和无符号 8 位、16 位 和 32 位整数的高效存储。它还有 32 位和 64 位浮点值的版本。

### 次要特性

#### 内置子类化

作为添加到 ECMAScript 2015 类中的有争议的特性，大多数内置对象现在都可以被子类化。

```
class SpecialArray extends Array {
    constructor(...args) {
        super(...args);
    }

    get lengthWithTerminator() {
        return this.length + 1;
    }
}

const arr = new SpecialArray(1, 2, 3);
console.log(arr.lengthWithTerminator);
```

子类化应该是优于操作内置对象的原型，而代理应该优先于这两个选项。最终还是得由你根据自己的使用案例挑选最佳的选项。一般来说，通过组合或者代理来表达行为重用，比通过子类化更好，所以要谨慎使用子类化这个特性。 

#### 有保证的尾调用优化

很多函数式编程语言都会执行尾调用优化。尾调用优化负责将递归函数调用转换为循环。这种转换避免了栈溢出。JavaScript 带来了很多函数式特性，但是唯一漏掉了尾调用优化，直到 ECMAScript 2015 才添上。有些算法用递归比用循环更好表示：

```
function factorial(n) {
    "use strict";
    function helper(n, result) {
        return n <= 1 ? result : helper(n - 1, result * n);
    }
    return helper(n, 1);
}
```

尾调用优化需要函数出现在尾调用位置，即，造成下一次调用递归函数的分支，必须是该分支的最后一次调用，没有还没有处理的操作。这就是上面的示例比下面所示的直接实现要复杂一点的原因。

```
function factorial(n) {
    return n <= 0 ? 1 : n * factorial(n - 1);
}
```

在这个示例中，在分支之一中的最后一个操作是 `n` 被递归函数相乘。也就是说，递归函数不处于尾位置，于是尾调用优化不能执行。

有些语言的实现会很巧妙地将最后这个示例转换为前一个，从而启用尾调用优化。这对 ECMAScript 2015 的实现不是必需的，也不是它所期待的，所以不应该依靠它。

尾调用优化是对 JavaScript 工具箱很有意义的补充。不过，应该只在它提高了代码条理性时才用它。

#### UNICODE

虽然 JavaScript 在 ECMAScript 2015 之前就支持 Unicode，但是现在有一些有意思的补充。新的 Unicode 转义符是其中最突出的：

```
const str = '\u{10437}'; // 𐐷
str.codePointAt(0) === 0x10437;
```

在 ECMAScript 2015 之前，要像上面一样指定一个字符，而不把它按字面放在源代码中，那就必须放上显式的替代对：

```
const str = '\uD801\uDC37'; // 𐐷
```

正则表达式现在支持在模式中通过从 `u` 标志嵌入码点：

```
'\u{10437}'.match(/./u)[0].length == 2; //替代对
```

#### 新的数字字面量

现在可以用二进制和八进制字面量：

```
0b10100001 === 0xA1 === 0o241 === 161;
```

## 下一版本 ECMAScript 中会出现什么

下一版本的 ECMAScript 可能不会与 ECMAScript 2015 一样大，不过预期会有有趣的补充。我们来看看主要的一些。
The next versions of ECMAScript will probably not be as big as ECMAScript 2015, however interesting additions are expected. Let's see some of the major ones.

### Async/Await

我们已经看到 ECMAScript 2015 通过 promise 的方式改进了异步编程。不过，对于其所有优点来说，promise 也带来了相当大的句法负担。有没有什么办法可以改进呢？幸运的是，有！这就是 ECMAScript 2017 中 async/await 试图要做的事情。

这里是一个来自上面 promise 小节的示例：

```
const updateStatement = '...'; 

function apiDoSomething(withThis) {
    const url = 'https://some.cool.backend.com/api/justDoIt';
    httpLib.request(url, withThis).then(result => {
        // database.update 也返回一个 promise
        return database.update(updateStatement, parseResult(result));
    }).catch(error => {
        logger.error(`ERROR: ${error} (from url: ${url})`);
        // Our API is such that rollbacks are considered no-ops in case 
        // the original request did not succeed, so it is OK to call it here.
        apiRollbackSomething(withThis);
    });
}
```

如下是 ECMAScript 2017 中它会是什么样子：

```
const updateStatement = '...'; 

async function apiDoSomething(withThis) {
    const url = 'https://some.cool.backend.com/api/justDoIt';
    try {
        const result = await httpLib.request(url, withThis);
        return database.update(updateStatement, parseResult(result));
    } catch(e) {
        logger.error(`ERROR: ${e} (from url: ${url})`);
        // Our API is such that rollbacks are considered no-ops in case 
        // the original request did not succeed, so it is OK to call it here.
        apiRollbackSomething(withThis);
    }
}
```

这看起来好像也没有多大改进，所以下面我们来看一个更复杂的例子。

```
function apiDoSomethingMoreComplex(withThis) {
    const urlA = '...';
    const urlB = '...';

    httpLib.request(urlA, withThis).then(result => {
        const parsed = parseResult(result);
        return new Promise((resolve, reject) => {
            database.update(updateStatement, parsed).then(() => {
                resolve(parsed);
            }, error => {
                reject(error);
            });
        });
    }).then(result => {
        return httpLib.request(urlB, result);
    }).then(result => {
        return worker.processData(result);
    }).then(result => {
        logger.info(`apiDoSomethingMoreComplex success (${result})`);
    }, error => {
        logger.error(error);
    });
}
```

在这个示例中，有一个异步操作链，该链依赖于前一个操作的结果。而且，传递给下一个操作的结果不一定是前一个操作的结果，所以需要用到 `resolve` 和 `reject`。必须注意的是，尽管这段代码要照着做有点难，但是比没有 promise 时需要做的事情好得多。下面我们看看 async/await 如何对此做更多改进：

```
async function apiDoSomethingMoreComplex(withThis) {
    const urlA = '...';
    const urlB = '...';

    try { 
        let result = await httpLib.request(urlA, withThis);
        const parsed = parseResult(result);
        await database.update(updateStatement, parsed);
        result = await httpLib.request(urlB, parsed);
        result = await worker.processData(result);
        logger.info(`apiDoSomethingMoreComplex success (${result})`);
    } catch(e) {
        logger.error(e);
    }
}
```

改进是显著的。可读性更好了，有人甚至会把它当作同步代码。`async`/`await` 通过充当语法糖，来隐藏背后工作的 promise 的行为，让异步函数看起来像同步函数。是的，这是对的，`async/awiat` 只不过是 promise 的语法糖！所以，只是是能用 prmoise 的代码现在都已经支持 `async/await`！要搞清楚 `async/await` 如何与 promise 关联，我们将让这种行为更明确点。

* `await` 只能被用在 `async` 函数内。
* 一个 `async` 函数返回一个 promise。从该函数返回的值就是该 promise 的结果。如果函数抛出异常，那么该 promise 就被拒绝。该函数可能返回一个 promise，就会得到一个链式的 promise。也就是说，async 函数总是将其结果封装在一个 promise 中。
* `await` 导致当前 `async` 函数在一个 promise 上等待。当 promise 被成功解决时，来自该 promise 的结果被打开，成为 await 表达式的结果，等着被使用。如果 promise 失败了，那么带有该 promise 的被拒绝值的异常就被抛出。如果该异常被捕获，async 函数可能照样继续下去。否则就会被拒绝。

从上面可能看不出来 `async` 函数是如何与普通函数一起用。下面我们来看看：

```
function normalFunction() {
    const data = getData();
    // 是的，async 函数只不过就是 promise.
    apiDoSomethingMoreComplex(data).then(result => {
        console.log(`Success! ${result}`);
    }, error => {
        console.log(`Error: ${error}`);
    });
}
```

一个 `async` 函数只是一个 promise。在其它 `async` 函数外，你需要按遵循 `Promise` API。就是这样！`Async/await` 具有 promise 的威力，让 promise 可读性更佳。而可读性总是更好：对代码更好，对你和将来的程序员更好。

### 单指令多数据（SIMD）

随着 JavaScript 被用于越来越多的用途，如何访问某种硬件操作可以让事情更有效率就变得很明显了。单指令多数据（SIMD）指令是同时作用于数据的多个元素上的一连串硬件操作。某些操作如果能访问这些指令的话，就可以大大加快。它们特别用在图像、声频和加密操作，这些领域已经开始用 JavaScript 了。

```
const a = SIMD.Float32x4(1, 2, 3, 4);
const b = SIMD.Float32x4(5, 6, 7, 8);
const c = SIMD.Float32x4.add(a, b); // [6,8,10,12]
```

这个示例来自于 [MDN SIMD 页](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SIMD)，展示四个浮点值可以用一条操作相加。虽然从 API 看起来不明显，不过如果一个硬件操作可以用来执行该加法，而且它所需的指令小于四条独立的加法，它就会被使用。

SIMD 操作为 JavaScript 打开了更多可能性的大门。

### 异步迭代

异步迭代采用了来自 ECMAScript 2015 和 2017 的三个重大特性，并将其混在一起：iterator、generator 和 async/await。这是一个较早的提案，所以语法还不是一成不变的。它可能看起来像如下这样：

```
for await (const line of readLines(filePath)) {
  console.log(line);
}
```

`readLines` 是一个在每次迭代中返回一个 promise 的生成器函数。通过 `await` 关键字来扩展 `for` 的语法，让它可以处理 promise，
By extending the syntax of `for` to handle promises through the `await` keyword, uses like the above become possible. It is important to note that the restriction of using `await` inside `async` functions remains in place. Here's what an async generator like `readLines` could look like:

```
async function* readLines(path) {
  let file = await fileOpen(path);

  try {
    while (!file.EOF) {
      yield await file.readLine();
    }
  } finally {
    await file.close();
  }
}

```

要对此提案了解更多，请访问它的 [GitHub repository](https://github.com/tc39/proposal-async-iteration).

## 悄悄话: 用 ECMAScript 2015 + Async/Await 实现 Auth0 Lock

现在你就可以用 ECMAScript 2015 和 aysnc/await！我们会看到如何用 webpack + Babel 来做这事情。对于本例，我们将改编 Auth0 VanillaJS Lock 示例之一来使用 ECMAScript 2015 和 async/await。


```
$ git clone git@github.com:auth0-samples/auth0-javascript-spa.git
```

进入 `01-Login` 目录，初始化一个新 NPM 项目。

```
npm init
```

下面安装所有开发依赖：

```
npm install --save-dev http-server webpack babel-loader babel-core babel-preset-es2015 babel-plugin-transform-runtime babel-preset-stage-3 bluebird 
```

简单 Webpack + Babel 设置，需要两个简单的配置文件：

```
// webpack.config.js
module.exports = {
    entry: "./app.js",
    output: {
        path: __dirname,
        filename: "app.bundle.js"
    },
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
            loader: 'babel',
            query: {
                presets: ['es2015', 'stage-3']
            }
        }]
    }
};

```

```
// .babelrc
{
  "plugins": ["transform-runtime"]
}

```

现在编辑 HTML 文件，引入新编译过的打包文件：

```
 </script>

```

现在，修改 `auth0-variables.js` 文件，来使用 ECMAScript 2015 的新 `export` 关键字：

```
export const AUTH0_CLIENT_ID='E799daQPbejDsFx57FecbKLjAvkmjEvo';
export const AUTH0_DOMAIN='speyrott.auth0.com';
export const AUTH0_CALLBACK_URL=location.href;
```

现在到了主要部分，我们将重构 `app.js` 文件，让它使用来自 ECMAScript 2015 的一些特性以及 aysnc/await。但是首先，我们得用 `Bluebird` 来将 Auth0 Lock 的老式 Node.js 回调转换为 promise。

```
import {
  AUTH0_CLIENT_ID,
  AUTH0_DOMAIN,
  AUTH0_CALLBACK_URL
} from './auth0-variables.js';

import Promise from 'bluebird';

var lock = new Auth0Lock(AUTH0_CLIENT_ID, AUTH0_DOMAIN);
const getProfile = Promise.promisify(lock.getProfile, { context: lock });
```

下面我们来使用 promise 和 async/await：

```
async function retrieveProfile() {
  var idToken = localStorage.getItem('id_token');
  if (idToken) {
    try {
      const profile = await getProfile(idToken);
      showProfileInfo(profile);
    } catch(err) {
      alert('There was an error getting the profile: ' + err.message);
    }
  }
}

async function afterLoad() {
  // 按钮
  var btnLogin = document.getElementById('btn-login');
  var btnLogout = document.getElementById('btn-logout');

  btnLogin.addEventListener('click', function () {
    lock.show();
  });

  btnLogout.addEventListener('click', function () {
    logout();
  });

  lock.on("authenticated", function(authResult) {
    getProfile(authResult.idToken).then(profile => {
      localStorage.setItem('id_token', authResult.idToken);
      showProfileInfo(profile); 
    }, error => {
      // 处理错误
    });
  });

  return retrieveProfile();
}

window.addEventListener('load', function () {
  afterLoad().then();
});
```


`getProfile` 函数是一个 promise。你既可以像这样用它，也可以在 `async` 函数内 `await` 它的结果。

[获取完整的工作示例](https://github.com/auth0-blog/es2015-rundown-example).

## 总结

ECMAScript 2015 是对 JavaScript 的一次重大更新。很多讨论多年的改进现在都可以用了。这些特性让 JavaScript 变得更适合于大型开发。某些常用模式被简化了，代码更清晰了，表现力增加了。虽然 ECMAScript 2015 对于旧浏览器或者环境的支持是个问题，但是 Babel 和 Traceur 这类转译器让你现在就可以获利。既然现在大多数 JavaScript 项目都利用了打包器，那么转译器的使用就简单和方便了。没有理由不用 ECMAScript 2015，没有理由不现在就用它获利。
                

> 本文转载自：[众成翻译](http://www.zcfy.cc)
> 
> 译者：[网络埋伏纪事](http://www.zcfy.cc/@bigshaw)
> 
> 链接：[http://www.zcfy.cc/article/1915](http://www.zcfy.cc/article/1915)
> 
> 原文：[https://auth0.com/blog/a-rundown-of-es6-features/](https://auth0.com/blog/a-rundown-of-es6-features/)

