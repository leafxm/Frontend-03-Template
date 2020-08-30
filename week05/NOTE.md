#   CSS总论
## 1. CSS语法的研究
[CSS2.1](http://w3.org/TR/CSS2/grammar.html#q25.0)

stylesheet 开头
CDO CDC: 历史包袱，可忽略

### CSS总体结构
- @charset
- @import
- rules
    - @media
    - @page
    - rule

## 2. CSS @ 规则的研究
- @charset ： https://www.w3.org/TR/css-syntax-3/
- @import ：https://www.w3.org/TR/css-cascade-4/
- @media ：https://www.w3.org/TR/css3-conditional/
- @page ： https://www.w3.org/TR/css-page-3/
- @counter-style ：https://www.w3.org/TR/css-counter-styles-3
- @keyframes ：https://www.w3.org/TR/css-animations-1/
- @fontface ：https://www.w3.org/TR/css-fonts-3/
- @supports ：https://www.w3.org/TR/css3-conditional/
- @namespace ：https://www.w3.org/TR/css-namespaces-3

## 3. CSS 规则
- 选择器
- 声明
  - key
  - value

文档：

- Selector
    - https://www.w3.org/TR/selectors-3/
    - https://www.w3.org/TR/selectors-4/ （working draft）
- Key
    - Properties
    - Variables: https://www.w3.org/TR/css-variables/
- Value
    - https://www.w3.org/TR/css-values-4/

## 4. 收集标准
爬虫

## 总结
- CSS语法
- at-rule
- seletor
- variables
- value
- 实验

# CSS选择器
## 选择器语法
### 简单选择器
- `*`
- div svg|a，类型选择器，单竖线：命名空间分隔符
- .cls
- #id
-  [attr=value] ：可以代替.cls, #id
- :hover, 伪类表示元素状态，多半来自交互
- ::before， 伪元素，原本不存在的元素

### 复合选择器
- 简单选择器的组合: `<简单选择器><简单选择器><简单选择器>`
- `*` 或者 div 必须写在最前面

### 复杂选择器
复合选择器+连接符
- `<复合选择器><sp><复合选择器>` 子孙选择器
- `<复合选择器>">"<复合选择器>` 父子选择器
- `<复合选择器>"~"<复合选择器>` 邻接关系
- `<复合选择器>"+"<复合选择器>` 邻接关系
- `<复合选择器>"||"<复合选择器>` Selector Level 4，表格选择一列

逗号相隔不会算，因为相当于是两个选择器，“或”的关系

## 选择器的优先级
简单选择器计数

练习：选择器的优先级
- div#a.b .c[id=x]：[0, 1, 3, 1]
- #a:not(#b): [0, 2, 0, 0]
- *.a: [0, 0, 1, 0]
- div.a: [0, 0, 1, 1]

## 伪类
### 链接/行为
- :any-link 匹配所有超链接
- :link :visited 访问/未访问的超链接
- :hover 
- :active 
- :focus 所有可以获取焦点的元素
- :target hash指向了超链接

### 树结构
- :empty 
- :nth-child() 复杂机制简单用：奇偶、倍数
- :nth-last-child()
- :first-child :last-child :only-child

破坏CSS回溯原则的，不建议使用

### 逻辑型
- :not伪类
- :where :has CCS4

## 伪元素
通过选择器向界面添加一个元素
- ::before
- ::after

用不存在的元素把一部分文本括起来
- ::first-line
- ::first-letter： 不同机型内容可能不同

