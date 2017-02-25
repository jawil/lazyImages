# 简介说明
**[欢迎阅读 《深入浅出 ES6》！](https://github.com/jawil/ES6)**

这个系列的文章，由 [Jason Orendorff](https://hacks.mozilla.org/author/jorendorffmozillacom/) 发表于 [hacks.moziila.org](https://hacks.mozilla.org/category/es6-in-depth/)，[InfoQ](http://www.infoq.com/cn/) 有个专栏翻译了这系列文章：[深入浅出 ES6](http://www.infoq.com/cn/es6-in-depth/)。但是由于文章不全、[InfoQ](http://www.infoq.com/cn/) 的排版等问题，遂在此做一遍整理,用**markdown**编辑排版,纯属搬运,**喜欢点个star**,慰劳我搬了几天砖,也是不容易,没有功劳也有苦劳。

##文章目录

>[ES6特性概述](https://github.com/jawil/ES6/blob/master/BOOK/ES6%E7%89%B9%E6%80%A7%E6%A6%82%E8%BF%B0.md)

>[卷首语](https://github.com/jawil/ES6/blob/master/BOOK/%E5%8D%B7%E9%A6%96%E8%AF%AD.md)

>[(一）：ES6是什么](https://github.com/jawil/ES6/blob/master/BOOK/%EF%BC%88%E4%B8%80%EF%BC%89%EF%BC%9AES6%E6%98%AF%E4%BB%80%E4%B9%88.md)

>[(二）：迭代器和for-of循环](https://github.com/jawil/ES6/blob/master/BOOK/%EF%BC%88%E4%BA%8C%EF%BC%89%EF%BC%9A%E8%BF%AD%E4%BB%A3%E5%99%A8%E5%92%8Cfor-of%E5%BE%AA%E7%8E%AF.md)

>[(三）：生成器 Generators.md](https://github.com/jawil/ES6/blob/master/BOOK/%EF%BC%88%E4%B8%89%EF%BC%89%EF%BC%9A%E7%94%9F%E6%88%90%E5%99%A8%20Generators.md)

>[(四）：模板字符串](https://github.com/jawil/ES6/blob/master/BOOK/%EF%BC%88%E5%9B%9B%EF%BC%89%EF%BC%9A%E6%A8%A1%E6%9D%BF%E5%AD%97%E7%AC%A6%E4%B8%B2.md)

**ECMAScript 6**（亦称 **ES2015**，以下简称 **ES6**）是2015年6月份定稿的第六版 **JavaScript** 语言规范。**ES6** 包含了很多新的特性让 **JavaScript** 更为强大、生动的语言特性。

在探索这些特性之前，先来了解以下什么是 **ES6**、**ES6** 能带给你什么吧。

# ES6 核心特性

## 1. ES6 核心特性

本章讲述 ES6 核心特性。这些核心特性很容易理解，库作者会比较关心其它的没讲的内容。我会使用对应的 ES5 代码来解释讲到的每一个特性。
![](http://ww1.sinaimg.cn/large/a660cab2gy1fd0wp180vvj21kw0y5qku)


### 1.1 从 `var` 到 `let`/`const`

ES5 中申明使用 `var`，这些变量都是*函数级作用域*的，它们的作用域是包含它们的最内层的函数。`var` 的行为偶尔会使人混淆，这里有一个例子：

```
var x = 3;
function func(randomize) {
    if (randomize) {
        var x = Math.random(); // (A) 作用域: 整个函数
        return x;
    }
    return x; // 访问的 x 是在 A 行申明的
}
func(false); // undefined
```

`func()` 返回 `undefined`，这可能让人觉得吃惊。下面重写的代码更接近实际运行过程：


```
var x = 3;
function func(randomize) {
    var x;
    if (randomize) {
        x = Math.random();
        return x;
    }
    return x;
}
func(false); // undefined
```

在 ES6 中还可以使用 `let` 和 `const` 来申明变量。这类变量是*块级作用域*的，它们的作用域是包含它们最近的块。`let` 可以理解为块级作用域中的 `var`，`const` 与 `let` 类似，只是用 `const` 申明的变量其值是不可修改的。

`let` 和 `const` 更为严格，会抛出更多异常(比如，在变量作用域内访问还没有申明的变量)。块级作用域有助于保持代码片段的作用更局限(参考下一节的演示)。相比函数级作用域来说，块级作用域更为主流，它使 JavaScript 更接近于其它编程语言。

如果把最开始那个示例中的 `var` 替换为 `let`，你会发现结果发生了变化：

```
let x = 3;
function func(randomize) {
    if (randomize) {
        let x = Math.random();
        return x;
    }
    return x;
}
func(false); // 3
```

也就是说，你不能盲目地将即存代码中的 `var` 替换为 `let` 或 `const`。在重构的时候必须非常小心。

我的建议是：

*   首选 `const`。所有不会改变值的变量都可以使用它。
*   其它的使用 `let`，用于值会被改变的变量。
*   避免使用 `var`。

**更多信息：** “[变量和作用域](http://exploringjs.com/es6/ch_variables.html#ch_variables)”章节。

### 1.2 从 IIFE 到块

ES5 中如果你想限制变量 `tmp` 的作用范围仅在某一块代码中有效，你不得不使用一个叫 IIFE(Immediately-Invoked Function Expression，立即执行函数表达式) 的模式：

```
(function () {  // IIFE 开始
    var tmp = ···;
    ···
}());  // IIFE 结束

console.log(tmp); // ReferenceError

```

ECMAScript 6 中可以简单地使用块和 `let` 申明(或 `const` 申明)：

```
{  // 块起始
    let tmp = ···;
    ···
}  // 块结束

console.log(tmp); // ReferenceError

```

**更多信息：** “[在 ES6 中避免使用 IIFE](http://exploringjs.com/es6/ch_callables.html#sec_iifes-in-es6)”.

### 1.3 从字符串拼接，到模板字面量

ES6 中，JavaScript 终于有了字符串插值和多行文本。

#### 1.3.1 String 插值

ES5 中你想把在字符串中引用一些值，你需要将那些值和一些零碎的字符串连接起来：

```
function printCoord(x, y) {
    console.log('('+x+', '+y+')');
}

```

ES6 中你可以在模板字面量中使用字符串插值：

```
function printCoord(x, y) {
    console.log(`(${x}, ${y})`);
}

```

#### 1.3.2 多行文本

模板字面量也带来了多行文本的表现形式。

例如，在 ES5 中你要这么做：

```
var HTML5_SKELETON =
    '<!doctype html>\n' +
    '<html>\n' +
    '<head>\n' +
    '    <meta charset="UTF-8">\n' +
    '    <title></title>\n' +
    '</head>\n' +
    '<body>\n' +
    '</body>\n' +
    '</html>\n';

```

如果通过反斜杠来转义换行符，看起来会好一些(但是仍然需要显式添加换行符)：

```
var HTML5_SKELETON = '\
 <!doctype html>\n\
 <html>\n\
 <head>\n\
 <meta charset="UTF-8">\n\
 <title></title>\n\
 </head>\n\
 <body>\n\
 </body>\n\
 </html>';

```

ES6 的模板字面量允许多行文本：

```
const HTML5_SKELETON = `
 <!doctype html>
 <html>
 <head>
 <meta charset="UTF-8">
 <title></title>
 </head>
 <body>
 </body>
 </html>`;

```

(示例中包含了与之前数量不同的空白字符，不过空白字符对这个示例没有影响。)

**更多信息：** “[模板字符量和标签模板](http://exploringjs.com/es6/ch_template-literals.html#ch_template-literals)”.

### 1.4 从函数表达式到箭头函数

当前 ES5 代码中，在使用了函数表达式的时候，你必须小心处理 `this`。我会在下面的示例中创建一个 `_this`(A 行) 作为辅助变量，这样在 B 行才可能访问到指向 `UiComponent` 对象的 `this`。

```
function UiComponent() {
    var _this = this; // (A)
    var button = document.getElementById('myButton');
    button.addEventListener('click', function () {
        console.log('CLICK');
        _this.handleClick(); // (B)
    });
}
UiComponent.prototype.handleClick = function () {
    ···
};`

```

而在 ES6 中，使用箭头函数将不用担心 `this`(A 行) 有问题：

```
function UiComponent() {
    var button = document.getElementById('myButton');
    button.addEventListener('click', () => {
        console.log('CLICK');
        this.handleClick(); // (A)
    });
}

```

(ES6 中你也可以使用 class 代替构建函数，这会在稍后详述。)

对于一些简短的只需要返回某个表达式值的简短回调，用箭头函数特别方便。

ES5 中这类回调相对繁琐：

```
var arr = [1, 2, 3];
var squares = arr.map(function (x) { return x * x });

```

ES6 中使用箭头函数就简洁得多：

```
const arr = [1, 2, 3];
const squares = arr.map(x => x * x);

```

在定义参数的时候，如果只有一个参数，你可以省略掉括号。像 `(x) => x * x` 和 `x => x * x` 都可以。

**更多信息：**  “[箭头函数](http://exploringjs.com/es6/ch_arrow-functions.html#ch_arrow-functions)”.

### 1.5 处理多个返回值

有一些函数或者方便会通过数组或对象返回多个值。在 ES5 中，你需要创建一个临时变量来访问那些值。但在 ES6 中你可以使用解构。

#### 1.5.1 通过数组返回多个值

`exec()` 以伪数组对象的形式返回匹配到的各组。ES5 中需要一个临时变量(下面示例中的`matchOjb`)，即使你只关心配到的组：

```
var matchObj =
    /^(\d\d\d\d)-(\d\d)-(\d\d)$/
    .exec('2999-12-31');
var year = matchObj[1];
var month = matchObj[2];
var day = matchObj[3];

```

ES6 的解构让代码变得简单：

```
const [, year, month, day] =
    /^(\d\d\d\d)-(\d\d)-(\d\d)$/
    .exec('2999-12-31');

```

数组样板最开始空了一个位置，这是用来跳过第 0 个数组元素的。

#### 1.5.2 通过对象返回多个值

`Object.getOwnPropertyDescriptor()` 方法返回一个*属性描述对象*，这个对象在它的属性中包含了多个值。

即使你只关心对象的属性，在 ES5 中你也必须使用临时变量(下例中的 `propDesc`)：

```
var obj = { foo: 123 };

var propDesc = Object.getOwnPropertyDescriptor(obj, 'foo');
var writable = propDesc.writable;
var configurable = propDesc.configurable;

console.log(writable, configurable); // true true

```

在 ES6 中就可以使用解构

```
const obj = { foo: 123 };

const {writable, configurable} =
    Object.getOwnPropertyDescriptor(obj, 'foo');

console.log(writable, configurable); // true true

```

`{writable, configurable}` 是一个缩写。完整的是：

```
{ writable: writable, configurable: configurable }

```

**更多信息：** “[解构](http://exploringjs.com/es6/ch_destructuring.html#ch_destructuring)”.

### 1.6 从 `for` 到 `forEach()` 再到 `for-of`

在 ES5 之前，需要通过下面的代码遍历数组：

```
var arr = ['a', 'b', 'c'];
for (var i=0; i<arr.length; i++) {
    var elem = arr[i];
    console.log(elem);
}

```

ES5 中多了一个选择，可以使用数组的 `forEach()` 方法：

```
arr.forEach(function (elem) {
    console.log(elem);
});

```

`for` 循环的优势在于可以中止，`forEach()` 则更简洁。

ES6 带来的 `for-of` 循环综合了两者的优点：

```
const arr = ['a', 'b', 'c'];
for (const elem of arr) {
    console.log(elem);
}

```

如果你既需要元素索引又需要元素的值，`for-of` 可以通过数组的 `entries()` 方法，配合使用解构来办到：

```
for (const [index, elem] of arr.entries()) {
    console.log(index+'. '+elem);
}

```

**更多信息：** “[`for-of`循环](http://exploringjs.com/es6/ch_for-of.html#ch_for-of)”.

### 1.7 默认参数值

在 ES5 中指定参数的默认值需要 这样：

```
function foo(x, y) {
    x = x || 0;
    y = y || 0;
    ···
}

```

ES6 有更漂亮的语法：

```
function foo(x=0, y=0) {
    ···
}

```

ES6 默认参数语法的好处在于，只有 `undefined` 会被替换成默认值，而在前面的 ES5 代码中，所有判 `false` 的值都会被替换成默认值。

**更多信息：** “[默认参数值](http://exploringjs.com/es6/ch_parameter-handling.html#sec_parameter-default-values)”.

### 1.8 命名参数

JavaScript 中处理命名参数的常用方法是使用对象字面量(所谓的 _选项对象模式_)：

```
selectEntries({ start: 0, end: -1 });

```

这种方式带来了两个好处：代码可自解释，而且很容易做到省略某些参数。

ES5 中如下实现 `selectEntries()`：

```
function selectEntries(options) {
    var start = options.start || 0;
    var end = options.end || -1;
    var step = options.step || 1;
    ···
}

```

ES6 中可以在参数定义中使用解构，代码简单多了：

```
function selectEntries({ start=0, end=-1, step=1 }) {
    ···
}

```

#### 1.8.1 使参数可选(非必须)

在 ES5 中要使 `options` 成为可选(非必须)的，你需要添加代码中的 A 行：

```
function selectEntries(options) {
    options = options || {}; // (A)
    var start = options.start || 0;
    var end = options.end || -1;
    var step = options.step || 1;
    ···
}

```

ES6 可以指定 `{}` 作为参数的默认值：

```
function selectEntries({ start=0, end=-1, step=1 } = {}) {
    ···
}

```

**更多信息：** section “[模拟命名参数](http://exploringjs.com/es6/ch_parameter-handling.html#sec_named-parameters)”.

### 1.从 `arguments` 到剩余参数

如果你想在 ES5 中让函数(或方法)接受任意数量的参数，必须使用特殊变量 `arguments`：

```
function logAllArguments() {
    for (var i=0; i < arguments.length; i++) {
        console.log(arguments[i]);
    }
}

```

ES6 中则可以通过 `...` 运算符定义一个剩余参数(在下面示例中是`args`)：

```
function logAllArguments(...args) {
    for (const arg of args) {
        console.log(arg);
    }
}

```

如果有一部分固定参数，剩余参数就更适用了：

```
function format(pattern, ...args) {
    ···
}

```

在 ES5 中处理同样的事情有点麻烦：

```
function format(pattern) {
    var args = [].slice.call(arguments, 1);
    ···
}

```

剩余参数使代码变得简单易读：通过观察函数的参数定义就能知道它有可变数量的参数。

**更多信息：** “[剩余参数](http://exploringjs.com/es6/ch_parameter-handling.html#sec_rest-parameters)”.

### 1.从 `apply()` 到扩展运算符 (`...`)

ES5 中可以用 `apply()` 把数组作为参数使用。ES6 使用扩展运算符解决这个问题。

#### 1.10.1 `Math.max()`

`Math.max()` 返回参数中最大的数。它接受数量不定的参数，但不接受数级。

ES5 – `apply()`：

```
> Math.max.apply(Math, [-1, 5, 11, 3])
11

```

ES6 – 扩展运算符：

```
> Math.max(...[-1, 5, 11, 3])
11

```

#### 1.10.2 `Array.prototype.push()`

`Array.prototype.push()` 把所有接受到的参数添加为元素。它不能把一个数组展开并添加到另一个数组中。

ES5 – `apply()`：

```
var arr1 = ['a', 'b'];
var arr2 = ['c', 'd'];

arr1.push.apply(arr1, arr2);
    // arr1 is now ['a', 'b', 'c', 'd']

```

ES6 – 扩展运算符：

```
const arr1 = ['a', 'b'];
const arr2 = ['c', 'd'];

arr1.push(...arr2);
    // arr1 is now ['a', 'b', 'c', 'd']

```

**更多信息：** “[扩展运算符 (`...`)](http://exploringjs.com/es6/ch_parameter-handling.html#sec_spread-operator)”.

### 1.11 从 `concat()` 到扩展运算符 (`...`)

扩展运算符也能(并非解构)将其内容转换为数组元素。也就是说，它可以代替数组方法 `concat()`。

ES5 – `concat()`：

```
var arr1 = ['a', 'b'];
var arr2 = ['c'];
var arr3 = ['d', 'e'];

console.log(arr1.concat(arr2, arr3));
    // [ 'a', 'b', 'c', 'd', 'e' ]

```

ES6 – 扩展运算符：

```
const arr1 = ['a', 'b'];
const arr2 = ['c'];
const arr3 = ['d', 'e'];

console.log([...arr1, ...arr2, ...arr3]);
    // [ 'a', 'b', 'c', 'd', 'e' ]

```

**更多信息：** section “[扩展运算符 (`...`)](http://exploringjs.com/es6/ch_parameter-handling.html#sec_spread-operator)”.

### 1.12 从对象字符量的函数表达式到方法定义

JavaScript 的方法是值为函数的属性。

ES5 对象字面量中，添加方法和添加其它属性一样，其属性值是函数表达式。

```
var obj = {
    foo: function () {
        ···
    },
    bar: function () {
        this.foo();
    }, // trailing comma is legal in ES5
}

```

ES6 引入了 _方法定义_，专门用于添加方法的语法：

```
const obj = {
    foo() {
        ···
    },
    bar() {
        this.foo();
    },
}

```

**更多信息：** “[方法定义](http://exploringjs.com/es6/ch_oop-besides-classes.html#object-literal-method-definitions)”.

### 1.13 从构造器到类

ES6 引入的类语法比原来的构建函数更为方便。

#### 1.13.1 基类

ES5 中直接实现一个构造函数：

```
function Person(name) {
    this.name = name;
}
Person.prototype.describe = function () {
    return 'Person called '+this.name;
};

```

ES6 的类语法提供了比构造函数稍微方便一些的语法：

```
class Person {
    constructor(name) {
        this.name = name;
    }
    describe() {
        return 'Person called '+this.name;
    }
}

```

注意简化的方法定义语法 —— 不再需要 `function` 关键字。也请注意类的各个部分之间没有逗号。

#### 1.13.2 派生类

ES5 中实现子类是件麻烦的事情，尤其是引用父类构造函数和父类属性的时候。下面使用经典方法创建 `Person` 的子类构造函数 `Employee`：

```
function Employee(name, title) {
    Person.call(this, name); // super(name)
    this.title = title;
}
Employee.prototype = Object.create(Person.prototype);
Employee.prototype.constructor = Employee;
Employee.prototype.describe = function () {
    return Person.prototype.describe.call(this) // super.describe()
           + ' (' + this.title + ')';
};

```

ES6 内置支持子类，只需要使用 `extends` 子句：

```
class Employee extends Person {
    constructor(name, title) {
        super(name);
        this.title = title;
    }
    describe() {
        return super.describe() + ' (' + this.title + ')';
    }
}

```

**更多信息：** “[类](http://exploringjs.com/es6/ch_classes.html#ch_classes)”.

### 1.14 从自定义错误构造函数到 `Error` 的子类

ES5 不能实现内置异常构造器 `Error` 的子类。下面的代码展示了如果让 `MyError` 实现一些重要的功能，比如栈跟踪：

```
function MyError() {
    // Use Error as a function
    var superInstance = Error.apply(null, arguments);
    copyOwnPropertiesFrom(this, superInstance);
}
MyError.prototype = Object.create(Error.prototype);
MyError.prototype.constructor = MyError;

function copyOwnPropertiesFrom(target, source) {
    Object.getOwnPropertyNames(source)
    .forEach(function(propKey) {
        var desc = Object.getOwnPropertyDescriptor(source, propKey);
        Object.defineProperty(target, propKey, desc);
    });
    return target;
};

```

ES6 中所有内置构造器都可以被继承，下面的代码展示了在 ES5 只能模拟的东西：

```
class MyError extends Error {
}

```

**更多信息：** “[从内置构建器继承](http://exploringjs.com/es6/ch_classes.html#subclassing-builtin-constructors)”.

### 1.15 从对象到 Map

为了处理字符串向其它类型值映射(一种数据结构)，将 _对象_ 当作映射表一直都是 JavaScript 中的临时解决办法。最安全的方法是创建一个原型是 `null` 的对象。然后你还得确保永远不会有一个键是 `'__proto__'`，因为那个属性名称在很多 JavaScript 引擎中有着特殊的意义。

下面的 ES5 代码含有函数 `countWords`，它把名为 `dict` 的对象作为映射表：

```
var dict = Object.create(null);
function countWords(word) {
    var escapedWord = escapeKey(word);
    if (escapedWord in dict) {
        dict[escapedWord]++;
    } else {
        dict[escapedWord] = 1;
    }
}
function escapeKey(key) {
    if (key.indexOf('__proto__') === 0) {
        return key+'%';
    } else {
        return key;
    }
}

```

ES6 提供了内置数据结构 `Map`，使它的时候不需要对键进行转义。不过它有一个缺点是不太方便使用自增运算。

```
const map = new Map();
function countWords(word) {
    const count = map.get(word) || 0;
    map.set(word, count + 1);
}

```

Map 带来的另一个好处是你可以使用任意类型的值，而不一定是字符串值，来作为键。

**更多信息：**

*   Section “[字典模式：最好用没有原型的对象来作为映射表](http://speakingjs.com/es5/ch17.html#dict_pattern)” in “Speaking JavaScript”
*   Chapter “[映射表和集合](http://exploringjs.com/es6/ch_maps-sets.html#ch_maps-sets)”

### 1.16 新的字符串方法

ECMAScript 6 标准库为字符串提供了一些新的方法。

从`indexOf` 到 `startsWith`:

```
if (str.indexOf('x') === 0) {} // ES5
if (str.startsWith('x')) {} // ES6

```

从`indexOf` 到 `endsWith`:

```
function endsWith(str, suffix) { // ES5
  var index = str.indexOf(suffix);
  return index >= 0
    && index === str.length-suffix.length;
}
str.endsWith(suffix); // ES6

```

从`indexOf` 到 `includes`:

```
if (str.indexOf('x') >= 0) {} // ES5
if (str.includes('x')) {} // ES6

```

从`join` 到 `repeat` (ES5 中重复字符串的方法更需要技巧)：

```
new Array(3+1).join('#') // ES5
'#'.repeat(3) // ES6

```

**更多信息：** “[新的字符串特性](http://exploringjs.com/es6/ch_strings.html#ch_strings)”

### 1.17 新的数组方法

ES6 也为数组提供了一些新的方法。

#### 1.17.1 从`Array.prototype.indexOf` 到 `Array.prototype.findIndex`

后者可用于查找 `NaN`，这是前者无法做到的：

```
const arr = ['a', NaN];

arr.indexOf(NaN); // -1
arr.findIndex(x => Number.isNaN(x)); // 1

```

顺便说一下，新的 `Number.isNaN()` 提供了更安全的方法来检测 `NaN`(因为它不会将非数值类型强制转换为数值类型)：

```
> isNaN('abc')
true
> Number.isNaN('abc')
false

```

#### 1.17.2 从 `Array.prototype.slice()` 到 `Array.from()` 或者扩展运算符

ES5 中使用 `Array.prototype.slice()` 把伪数组转换为数组。ES6 中可以使用 `Array.from()` 来做这个事情：

```
var arr1 = Array.prototype.slice.call(arguments); // ES5
const arr2 = Array.from(arguments); // ES6

```

如果某个值是可枚举的(比如当前用伪数组表示的所有DOM数结构结构)，你可以使用扩展运算符(`...`) 将其转换为数组：

```
const arr1 = [...'abc'];
    // ['a', 'b', 'c']
const arr2 = [...new Set().add('a').add('b')];
    // ['a', 'b']

```

#### 1.17.3 从 `apply()` 到 `Array.prototype.fill()`

ES5 中可以通过一定的技巧使用 `apply()` 来创建任意长度的数组，其所有元素都是 `undefined`：

```
// Same as Array(undefined, undefined)
var arr1 = Array.apply(null, new Array(2));
    // [undefined, undefined]

```

ES6 带来的 `fill()` 提供了更简单的方法：

```
const arr2 = new Array(2).fill(undefined);
    // [undefined, undefined]

```

如果你想在创建数组的时候填入其它值，`fill()` 则更实用：

```
// ES5
var arr3 = Array.apply(null, new Array(2))
    .map(function (x) { return 'x' });
    // ['x', 'x']

// ES6
const arr4 = new Array(2).fill('x');
    // ['x', 'x']

```

`fill()` 会把所有数组元素替换为给定的值。

**更多信息：** Sect. “[创建填充了值的数组](http://exploringjs.com/es6/ch_arrays.html#sec_creating-filled-arrays)”

### 1.18 从 CommonJS 模块到 ES6 模块

在 ES5 中，基于 AMD 或者 CommonJS 语法的模块系统已经取代了纯手工解决方案，比如 [提示模块模式](http://christianheilmann.com/2007/08/22/again-with-the-module-pattern-reveal-something-to-the-world/).

ES6 内置了对模块的支持，可惜目前还没有哪个 JavaScript 引擎原生支持这个特性。但像 browserify、webpack 和 jspm 这样的工具可以让你使用 ES6 语法来创建模块，让你的代码提前用上新语法。

#### 1.18.1 多项导出

##### 1.18.1.1 CommonJS 中的多项导出

CommonJS 中像下面这样导出多个实例：

```
//------ lib.js ------
var sqrt = Math.sqrt;
function square(x) {
    return x * x;
}
function diag(x, y) {
    return sqrt(square(x) + square(y));
}
module.exports = {
    sqrt: sqrt,
    square: square,
    diag: diag,
};

//------ main1.js ------
var square = require('lib').square;
var diag = require('lib').diag;

console.log(square(11)); // 121
console.log(diag(4, 3)); // 5

```

你也可以把整个模块作为一个对象导入，然后再通过它访问 `square` 和 `diag`：

```
//------ main2.js ------
var lib = require('lib');
console.log(lib.square(11)); // 121
console.log(lib.diag(4, 3)); // 5

```

##### 1.18.1.2 ES6 的多项导出

ES6 中的多项导出被称为 _命名的导出_，操作起来像这样：

```
//------ lib.js ------
export const sqrt = Math.sqrt;
export function square(x) {
    return x * x;
}
export function diag(x, y) {
    return sqrt(square(x) + square(y));
}

//------ main1.js ------
import { square, diag } from 'lib';
console.log(square(11)); // 121
console.log(diag(4, 3)); // 5

```

将模块导入为对象的语法如下所示(A行)：

```
//------ main2.js ------
import * as lib from 'lib'; // (A)
console.log(lib.square(11)); // 121
console.log(lib.diag(4, 3)); // 5

```

#### 1.18.2 单项导出

##### 1.18.2.1 CommonJS 的单项导出

Node.js 扩展了 CommonJS 让你可以通过 `module.exports` 导出单个值：

```
//------ myFunc.js ------
module.exports = function () { ··· };

//------ main1.js ------
var myFunc = require('myFunc');
myFunc();

```

##### 1.18.2.2 ES6 的单项导出

ES6 中使用 _默认导出_ 来做同样的事情(通过 `export default` 申明)：

```
//------ myFunc.js ------
export default function () { ··· } // no semicolon!

//------ main1.js ------
import myFunc from 'myFunc';
myFunc();

```

**更多信息：** “[模块](http://exploringjs.com/es6/ch_modules.html#ch_modules)”.

### 1.19 接下来干什么

现在你已经了解了 ES6，接下来你可以浏览其它章节继续探索：每个章节都涵盖了某个特性，或者通过概述引开的一系列相关特性。[最后一章](http://exploringjs.com/es6/ch_overviews.html#ch_overviews) 将所有这些概述的内容集中到了一起。
                


> 本文转载自：[众成翻译](http://www.zcfy.cc)
> 
> 译者：[边城](http://www.zcfy.cc/@jamesfancy)
> 
> 链接：[http://www.zcfy.cc/article/2267](http://www.zcfy.cc/article/2267)
> 
> 原文：[http://exploringjs.com/es6/ch_core-features.html](http://exploringjs.com/es6/ch_core-features.html)


