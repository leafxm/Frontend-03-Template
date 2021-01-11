var Generator = require('yeoman-generator');

// 顺次执行class里面的所有方法
module.exports = class extends Generator {
    constructor(args, opts) {
        // Calling the super constructor is important so our generator is correctly set up
        super(args, opts);
      }
      async initPackage() {
        const answer = await this.prompt([
          {
            type: "input",
            name: "name",
            message: "Your project name",
            default: this.appname // Default to current folder name
          }
        ]);
        const pkgJson = {
          "name": answer.name,
          "version": "1.0.0",
          "description": "",
          "main": "generators/app/index.js",
          "scripts": {
            "test": "echo \"Error: no test specified\" && exit 1"
          },
          "author": "",
          "license": "ISC",
          "dependencies": {
          },
          "devDependencies": {
            "webpack": '4.44.1'
          }
        }        
      
        // Extend or create package.json file in destination path
        this.fs.extendJSON(this.destinationPath('package.json'), pkgJson);
        this.npmInstall(['vue'], {'save-dev': false});
        this.npmInstall(['vue-loader','vue-style-loader', 'webpack',
        'css-loader', 'vue-template-compiler', 'copy-webpack-plugin'], {'save-dev': true });

        this.fs.copyTpl(
          this.templatePath('HelloWorld.vue'),
          this.destinationPath('src/HelloWorld.vue'),
          {}
        )
        this.fs.copyTpl(
          this.templatePath('webpack.config.js'),
          this.destinationPath('webpack.config.js'),
          {}
        )
        this.fs.copyTpl(
          this.templatePath('main.js'),
          this.destinationPath('src/main.js'),
          {}
        )
        this.fs.copyTpl(
          this.templatePath('index.html'),
          this.destinationPath('src/index.html'),
          {title: answer.name}
        )
      }
};