# webpack 
1. webpack构建发展历史
2. webpack基本用法
3. webpack进阶用法
4. 编写可维护的webpack构建配置
5. webpack构建速度和体积优化的策略
6. 掌握webpack 原理
7. 编写loader 和插件
8. 实际配置个webpack项目


### webpack构建发展历史
为什么需要？ =》 mudule[转换es6 jsx sass] 压缩混淆 图片压缩

前端现在构建工具：[rollup webpack parcel];

为什么选择webpack?
1. 社区活跃度
2. 官方插件，loader数量和质量很高
3. 官方插件更新活跃
4. 自己团队可以开发自己团队的插件和loader

* 配置文件的名字可以自己配置： webpack --config newName.config.js


0配置的webpack写法 === webpack4.0?

 ```
    //只配置其他默认配置 不设定 
    entry: '',
    output: '',
 ```
 初始化demo 
 ```
    //终端操作
    npm init -y
    npm install webpack webpack-cli --save-dev
    //检查是否安装成功
    ./node_modules/.bin/webpack -v

 ```

package.json
配置wenpack 打包

配置 .gitignore 文件

## webpack 基本概念和日常开发技巧

## 以工程化的方式组织webpack构建配置，webpack 打包优化

## webpack 打包原理，插件 loader开发

## 实际项目webpack使用


