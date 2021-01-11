# 组件

## 组件的基本知识-组件的基本概念和基本组成部分
组件化提升复用率。
### 对象和组件
对象：
- Properties
- Methods
- Inherit

组件：
- Properties
- Methods
- Inherit
- Attribute
- Config & State
- Event
- Lifecycle
- Children


### Property和Attribute
- Attribute 强调描述性
- Property 强调从属关系

例子：
- class和div.className
- style和div.style(对象)
- href和a.href（rosolve过的结果）
- input.getAttribute('value') 不会变， input.value 会变

### 如何设计组件状态

|  |Markup set| JS set| JS change| User Input Change|
| --- | --- | --- | --- | --- |
| property | × | √  | √| ? |
| attribute | √ | √ | √ | ? |
| state | × |  × | × | √ |
| config | × | √ | × | × |

### Lifecycle
create ... destoryed

### Children
模板作用

## 组件的基本知识|为组件添加JSX语法


# 轮播图组件
## 拆分
拆分文件：framework.js， 并拆出 class Component，作为组件的父类。

## 轮播图的样式
`display: inline-block` 横排展示，父元素和子元素设置同样宽高，且`overflow:hidden;white-space: nowrap;`强制不换行并隐藏其他图片。

## 自动播放轮播图
使用`setInterval`和`transform`控制自动移动。

最后一张图向第一张转换的问题：只需要移动当前图片和下一张图片的位置。

## 手动移动轮播图
监听`mousedown`，并在其中监听`document.mousemove` `document.mouseup`，并up的时候移除move 和 up 的事件监听（拖拽常用处理，在之前的课程中也有使用）

需要注意图片的移动距离的计算。