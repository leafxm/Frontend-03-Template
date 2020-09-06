# CSS 排版
## 盒 Box
源代码     语义     表现
标签       元素     盒
Tag      Element   Box

## 正常流
三代：
1 基于正常流
2 Flex
3 Grid
3.5 CSS Houdini

排版：可见东西放到正确位置

书写习惯：
- 左到右书写
- 同一行文字对齐
- 一行满了到下一行

正常流排版：
- 收集盒进行
- 计算盒在行中排布
- 计算行的排布

line-box
block-level-box

IFC：左到右排布（忽略writing mode）
BFC：上到下排布

## 正常流的行级排布
Baseline：以基线原点为坐标定义文字位置

行模型：
line-top 行高大于文字时
text-top 多种字体混排，由fontSize最大的字体决定
base-line
text-bottom
line-bottom 行高大于文字时

与盒混排时，line-top line-bottom 可能发生偏移（盒的先后顺序、尺寸、vertical-align会影响）
例子：line.html

## 正常流的块级排布
### float 与 clear
float: 影响高度占据范围内的生成的行盒的尺寸，和其他float元素（同方向下一个float元素不会占据上一个float元素的位置）
clear: 找一个干净的空间来执行浮动（使得不受其他float影响）
例子：float1.html

模拟正常流inline-block: 全部float:left，需要换行时使用clear
例子： float2.html

float导致的重排
例子： float3.html

### margin折叠
只会发生同一个BFC里
例子： margin.html

## BFC 合并
### Block
- Block Container: 里面有BFC的，如 block, inline-block, table-cell, flex item, grid cell, table-caption
- Block-level Box: 外面有BFC的
- Block Box = Block Container + Block-level Box：里外都有BFC

### 创建BFC
 - floats
 - absolutely positioned elements
 - block containers that are not block boxes: inline-blocks， table-cells, and table-captions, flex items, grid cell ...
 - block boxes width 'overflow' other than 'visible'

 默认能容纳正常流的盒都会创建BFC， 除了BFC合并的情况

 ### BFC合并
 - block box && overflow: visible
   - BFC合并与float
   - BFC合并与边距折叠

## Flex排版
- 收集盒进行
    - 根据主轴尺寸，把元素分进行
    - 若设置了no-wrap,强行分进第一行
- 计算盒在主轴方向的排布
    - 找出所有设置了`flex`的元素
    - 把主轴方向的剩余尺寸按比例分配给这些元素
    - 若剩余空间为负数，所有flex元素为0， 等比压缩剩余元素
- 计算盒在交叉轴的排布
    - 根据每一行中最大元素尺寸计算行高
    - 根据行高flex-align和item-align，确定元素具体位置


## CSS动画与绘制-动画
### Animation
- @keyframes
- animation 使用

### transtion

### 三次贝塞尔曲线
- 常用：ease, linear, ease-in（用于退出）, ease-out(用于进入), ease-in-out...

## CSS动画与绘制-颜色
RGB 视觉细胞接收
CMY, CMYK 调料RGB补色
HSL, HSV 

## CSS动画与绘制-绘制
- 几何绘制
    - border
    - box-shadow
    - border-radius
- 文字
    - font
    - text-decoration
- 位图
    - background-image

图形：data uri + svg 