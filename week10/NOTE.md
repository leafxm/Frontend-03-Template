# 使用LL算法构建AST
AST： 抽象语法树

分为：
- LL算法：从左到右扫描，从左到右规约
- LR算法

## 四则运算
- TokenNumber: 1 2 3 4 5 6 7 7 9 0 的组合 + 小数点
- Operator: + - * / 之一
- Whitespace: <SP>
- LineTerminator: <LF> <CR>

用js的产出式定义 加减乘除法

## 词法分析
用正则表达式分析词法

## 语法分析
