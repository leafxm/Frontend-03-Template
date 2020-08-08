# 学习笔记

> 本周学习了浏览器工作原理、状态机、实现HTTP请求。

## 浏览器工作原理
浏览器解析步骤：
url =http=> Html =parse=> Dom =css computing=> Dom with css =layout=> lDom with position =render=> Bitmap

## 状态机
### 有限状态机是什么？
每一个状态都是一个机器，每一个机器知道下一个状态，状态机是纯函数。

[拓展学习](https://zhuanlan.zhihu.com/p/46347732)

### 如何写状态机
可以使用的方法
- 常量 + if
- 函数（推荐）

## HTTP请求
### 基础认识
文本型协议：每一个字节都理解为字符串的一部分

### 第一步: HTTP请求
示例：
```
POST/HTTP/1.1
HOST: 127.0.0.1
Content-Type: application/x-www-form-urlencoded

field1=aaa&code=x%3D1
```
对应为
```
Request line:method(POST) path(默认/) HTTP HTTP版本
headers

body
```

老师总结：
- 设计HTTP请求类
- Content-Type 必要的字段，没有的话要默认值
- body 是 KV 格式
- Content-Type 不同会影响body格式

个人补充：
`class Request`的 `constructor` 对HTTP请求的基本元素(method, host, port, path, body, headers)进行初始化和处理。

### 第二步：send函数
老师总结：
- 前提：在Request的构造器中收集必要的信息
- send函数作用：把请求真实发送到服务器
- send函数形式：异步的，返回Promise

### 第三步：发送请求
- 设计支持已有connection或自己新建connection
- 收到数据传给parser
- 根据parser的状态resole Promise

### 第四步：ResponseParser
Response示例：
```
HTTP/1.1 200 OK
Content-Type: text/html
Date: Sat,08 Aug 2020 20:20:56 GMT
Connection: keep-alive
Transfer-Encoding:chunked

26
<html><body>Hello World</body></html>
0


```

对应：
```
status line: HTTP 版本号 HTTP状态码 HTTP状态文本
headers

body
```
总结:
- Response必须分段构造，所以使用ResponseParser来”装配“
- ResponseParser分段处理ResponseText，状态机分析文本结构

### 第五步 BodyParser
总结:
- 第一步中提到的Content-Type不同影响body格式，所以采用子Parser的结构来解决问题
- 以TrunkedBodyParser为例，用状态机处理body的格式

## 问题总结
### 400 问题
开始运行的时候报400，正好群里也有同学遇到这个问题，产生这个问题的原因是`toString`里老师代码`\r\n`由于vscode自动换行而不完整，实际是很重要的`\r\n`被”吞“了……

遇到这个问题，也让我更了解了HTTP请求的流程。

### 返回空字符串的问题
开始也是懵懵的——怎么没有console呢？

debug了一下，发现是前面课程里为了让程序运行而写的`resolve('')`忘记删了……

### server.js问题
开始出现报错，发现是server端的保存，错误如下：
```
buffer.js:473
      throw new ERR_INVALID_ARG_TYPE(
      ^
      
TypeError [ERR_INVALID_ARG_TYPE]: The "list[0]" argument must be one of type Array, Buffer, or Uint8Array. Received type string
```
经过同学提示，发现是`body.push(chunk.toString()); ` 这句的问题，因为这里`chunk`的类型是Buffer，不需要经过`toString`，所以修改为`body.push(chunk)`，终于成功啦~

