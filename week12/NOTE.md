# proxy与双向绑定
预期性变差

## proxy 的基本用法
```
let po = new Proxy(object, {
  set(obj, prop, val) {
    console.log(obj, prop, val)
  },
})
```

## 模仿reactive实现原理（一）
设置`reactive`函数
在`set`中实现设置

## 模仿reactive实现原理（二）
`effect` 传函数
不考虑性能问题：使用全局`callbacks`数组对`callback`函数进行存储，`set`的时候调用`callback`
问题：无法做到变量和函数的对应，导致多个`callback`的时候性能差

## 模仿reactive实现原理（三）
使用`usedReactivities`数组来存储被`effect`涉及的`callback`里涉及的obj和属性
使用`Map`类型的`callbacks`来将`obj`作为key，和一个`prop`作为key、`callback`组成的数组作为value的`Map`类型作为value存储数据。

## 优化reactive
`po.a.b`的实现情况

## reactivity 响应式对象
实现和dom的绑定

## 基本拖拽
利用`mouse`相关事件
注意事件注册的位置，以及需要移动的位置

## 正常流中的拖拽