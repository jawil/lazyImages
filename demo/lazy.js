! function(context = window, callback) {
    //AMD规范，主要是require.js和curl.js实现
    if (typeof define === 'function' && define.amd) {
        define(function() {
            return callback(context)
        })
    }
    //CommonJS规范
    else if (typeof exports === 'object') {
        module.exports = callback()
    }
    //浏览器直接引入
    else {
        //非严格模式下浏览器全局环境下的this(context)指向window，所以这部分不要使用 'use strict'
        context.Lazy = callback(context)
    }
}(this, function(context) {
    'use strict'

    //默认配置参数
    const DEFAULT_OPTIONS = {
        containerId: context, //图片顶层容器
        offset: 100, //在定义可视区的范围内开始加载
        throttle: 250, //250ms触发一次元素scroll时间，函数节流防抖
        unload: false, //一旦图片不在可视区就移除已经加载的图片
        callback: function(element, op) { //图片加载完成之后的回调函数
            //doSomething
        }
    }

    //函数节流防抖
    const throttle = function(fn, interval = 250) {
        let timer,
            firstTime = true
        return function() {
            let args = arguments,
                me = this
            if (firstTime) {
                fn.apply(me, args)
                return firstTime = false
            }
            if (timer) {
                return false
            }
            timer = setTimeout(() => {
                clearTimeout(timer)
                timer = null
                fn.apply(me, args)
            }, interval)
        }
    }

    //判断图片是否在规定的可视区内
    const inView = function(element, view) {
        let react = element.getBoundingClientRect()
        return (
            react.right >= view.l &&
            react.bottom >= view.t &&
            react.left <= view.r &&
            react.top <= view.b
        )
    }

    //图片懒加载Lazy类
    class Lazy {
        constructor(opts = {}) {
            this.opts = Object.assign({}, DEFAULT_OPTIONS, opts)
            this.init()
        }

        //初始化数据和方法
        init() {
            let offsetAll = this.opts.offset, //默认为0
                offsetVertical = this.opts.offsetVertical || offsetAll, //距离容器可视区上下的距离
                offsetHorizontal = this.opts.offsetHorizontal || offsetAll, //距离容器可视区左右的距离
                offsetTop = this.opts.offsetTop || offsetVertical,
                offsetBottom = this.opts.offsetBottom || offsetVertical,
                offsetLeft = this.opts.offsetLeft || offsetHorizontal,
                offsetRight = this.opts.offsetRight || offsetHorizontal

            //图片开始加载的范围
            this.opts.offset = {
                t: offsetTop,
                b: offsetBottom,
                l: offsetLeft,
                r: offsetRight
            }

            //首次渲染
            this.render()

            //containerId默认是window全局对象，函数节流
            this.opts.containerId.addEventListener('scroll', throttle(f => {
                this.render()
            }, 1000), false)

        }

        //实现图片加载渲染模块
        render() {
            let container = this.opts.containerId === window ? document : this.opts.containerId,
                root = this.opts.containerId,
                nodes = container.querySelectorAll('[data-lazy],[data-lazy-bg]'),
                length = nodes.length,
                srcCache,
                view = {
                    l: 0 - this.opts.offset.l,
                    t: 0 - this.opts.offset.t,
                    b: root.innerHeight + this.opts.offset.b,
                    r: root.innerWidth + this.opts.offset.r
                }

            Array.from(nodes).forEach((ele, index) => {
                if (inView(ele, view)) {
                    //图片出现在可视区，unload为true，也就是不在可视区时候卸载图片资源
                    if (this.opts.unload && !ele.getAttribute('data-lazy-placeholer')) {
                        ele.setAttribute('data-lazy-placeholer', ele.src)
                    }

                    if (ele.getAttribute('data-lazy-bg') !== null) {
                        ele.style.backgroundImage = `url(${ele.getAttribute('data-lazy-bg')})`
                    } else if (ele.src !== (srcCache = ele.getAttribute('data-lazy'))) {
                        ele.src = srcCache
                    }

                    if (!this.opts.unload) {
                        ele.removeAttribute('data-lazy')
                        ele.removeAttribute('data-lazy-bg')
                    }
                    //回调函数
                    this.opts.callback && this.opts.callback(ele, 'load')
                }
                //不在可视区内，移除图片元素
                else if (this.opts.unload && !!(srcCache = ele.getAttribute('data-lazy-placeholer'))) {
                    if (ele.getAttribute('data-lazy-bg' !== null)) {
                        ele.style.backgroundImage = `url(${srcCache})`
                    } else {
                        ele.src = srcCache
                    }
                    //回调函数
                    this.opts.callback && this.opts.callback(ele, 'load')
                }
            })

            //所有图片加载完成，移除滚动事件
            if (!length) {
                this.detach()
            }
        }

        //页面没有任何data-lazy属性时候，移除滚动事件
        detach() {
            this.opts.containerId.removeEventListener('scroll', throttle)
        }
    }

    return Lazy

})
