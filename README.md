#### 基于ES6的轻量级，高性能，简单的图片懒加载插件

>[http://codepen.io/jawil/full/EWJRMN/](http://codepen.io/jawil/full/EWJRMN/)

 ```text
  * [lazyImage plugin]
  * 基于ES6的轻量级，高性能，简单的图片懒加载插件
  * @Author  jawil
  * @date    2017-05-22
  * @param   {object}   插件配置参数
 ```

#### 示例：

 ```JavaScript
 // 默认配置
 new Lazy({
        containerId: window, //图片顶层容器
        offset: 100, //在定义可视区的范围内开始加载
        throttle: 250, //250ms触发一次元素scroll时间，函数节流防抖
        unload: false, //一旦图片不在可视区就移除已经加载的图片
        callback: function(element, op) { //图片加载完成之后的回调函数
            //doSomething
        })
 ```

#### 效果图

图片有点大，稍等片刻。建议上面Demo效果预览地址进行预览。

![](https://segmentfault.com/img/remote/1460000008997803?w=444&h=575)

