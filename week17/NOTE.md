# 初始化与构建

## 初始化工具Yeoman

[Yeoman](https://yeoman.io/authoring/index.html)

`npm init`初始化一个package.json, `npm install yeoman-generator` 安装。

`npm link` 把toolchain的全局模块link到此toolchain目录中的模块。

package 的名字需要是 generator 开头。

顺次执行class Generator 里面的所有方法。可以使用 `async` 添加异步的方法。

### 输入
```js
    const answers = await this.prompt([
    {
        type: "input",
        name: "name",
        message: "Your project name",
        default: this.appname // Default to current folder name
    },
    {
        type: "confirm",
        name: "cool",
        message: "Would you like to enable the Cool feature?"
    }
    ]);

    this.log("app name", answers.name);
    this.log("cool feature", answers.cool);
```

### 文件模板
```js
this.fs.copyTpl(
    this.templatePath('index.html'),
    this.destinationPath('public/index.html'),
    { title: 'Templating with Yeoman' }
);
this.npmInstall(); 
```

### 依赖系统
对npm进行了简单的包装

## webpack
node 代码打包为 浏览器可用的代码。
