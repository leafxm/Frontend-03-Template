# 手势和动画

## 手势的基本知识
```
start ----end---> tap
start -移动10px-> pan start -move-> pan(move 循环到pan) -end-> pan end
start -移动10px-> pan start -move-> pan -end 且速度大于？-> flick（swipe）
                    ↑ 移动10px
start -0.5s---> press start--end -->press end
```


touch 事件和 mouse 不一样的在于：touchstart 后，touchmove和start触发在同一元素上，所以不需要在mousedown后去监听。

touch事件中的`event.changedTouches[0].identify`表示touch的唯一id，用于追踪move end

touch比鼠标事件多了`touchcancel`，表示以异常的模式结束的（比如`alert`）

## 封装
`new Listener(element, new Recognizer(new Dispatcher(element)))`