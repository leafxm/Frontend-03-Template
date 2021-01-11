# 轮播组件

## 完善组件
首先整合了手势库和动画系统，解决了手势和轮播的冲突。在手势库中添加了 `start` 和 `end`事件。 

## 私有化
使用 `Symbol` 来实现  `position` 和  `attribute` 的私有化。


## 添加其他性质
添加`onChange`, `onClick` 事件监听。通过 `CustomEvent` API来实现。

## Children 机制
Children有两种类型：一种是内容型,和模板型

- 内容型：如 <Button>content</Button>
- 模板型：如 <List> <Item></Item> </List>

学习了如何改为模板型Children机制。
