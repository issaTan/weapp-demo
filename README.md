# weapp-demo

> 小程序 demo  推荐联合 [wap-cli](https://github.com/issaTan/wap-cli) 使用

## 缘由：
github 上[labrador] (https://github.com/maichong/labrador) 和 [wepy](https://github.com/wepyjs/wepy) ,两个框架已经对小程序的开发已经封装得非常优雅了，并且支持NPM 包、优化小程序API、有状态管理。
但我个人实在不太想除了小程序的API之外，再去了解一套框架的API 了。  
我的需求很简单：
1. 统一代码风格 
2. 编译前检查可能存在的错误  
3. 样式文件可使用变量  
4. 样式文件引用的图片可自动base64化
5. 可配置忽略一些文件，不交给开发者工具打包  
所以自己实现了这么一套，因为还是自用，可配置的东西不多。需要更高的自定义化，推荐使用上面两个库，或者自己`fork`一份修改吧。  

## 特性：
1. 可使用less
2. less 文件中引用的背景图片将被自动base64（因为小程序背景图不支持相对路径）
3. 使用eslint 统一代码风格
4. 使用babel 转换代码
5. 压缩代码
6. 因为最终交给微信的`dist`包，所以可以忽略一些文件，例如：使用了cdn 链接的图片

## 项目目录结构
```
demo                 # 项目根目录
├── .babelrc         # babel配置文件
├── .editorconfig    # Editor Config
├── .eslintignore    # ESLint 忽略配置
├── .eslintrc        # ESLint 语法检查配置
├── package.json
├── gulpfile.js      # gulp 配置
├── dist/            # 目标目录
├── node_modules/
└── src/             # 源码目录
    ├── app.js
    ├── app.json
    ├── app.less
    ├── var.less     # less 变量文件
    ├── imgs/        # 图片目录
    │    └── icon    # icon 图片
    ├── styles/      # 样式目录
    ├── pages/       # 页面目录
    └── utils/
```  

## 开发流程
1. 使用 `npm install wap-cli -g` 全局安装 `wap命令行工具`
2. `wap create 你的项目名称` 创建项目
3. `npm run dev` 进入开发模式
4. 使用IDE 打开代码，使用`微信开发者工具` 打开`dist` 目录，查看效果  
   - 在 `微信开发者工具` 的 `设置` - `编辑器` 中勾选`文件保存时自动编译小程序`，可实现自动刷新。**注意：**其它选项请**不要**勾选！！！
5. 开发过程中可使用 `wap g 你的页面` 新建页面，在新建的文件中编写你的代码，保持即可看到效果    
   - 因为小程序每个页面需要4个文件，分别是 `.js`,`.json`,`.wxml`,`.wxss` 文件，直接使用 `wap g my/index` 命令，将会在 `pages` 文件夹在生成 `my`文件夹，并生成 `index.js`, `index.json`, `index.wxml`, `index.less` 文件；并且会在 `app.json` 的`pages`自动添加文件路径。
6. 开发完成，使用`npm run build` 进行打包  
   - `npm run build` 与 `npm run dev` 的区别在于，`build` 命令会压缩代码量  


## 微信开发者工具
项目初始化后用 IDE打开项目根目录。  
安装完依赖后使用 `npm run dev` ，然后打开`微信web开发者工具`新建项目，本地开发目录选择 `dist`目标目录。
请**务必**先进行 `npm run dev` 命令后再打开`微信开发者工具`。

## 注意事项：
1. `微信开发者工具`中 `项目` 栏取消勾选 `开启ES6 转ES5`、`开启代码压缩上传`，因为`wap`都做了这些事件，让`微信开发者工具` 重复操作可能会导致不可预知的错误！！
2. 不要**直接修改** `dist`目录下代码，因为每一次修改代码`wap`都会修改`dist`目录下的文件，在`dist`目录下修改的代码会被重置。
3. `微信开发者工具`的`设置-编辑器` 中打开`文件保存时自动编译小程序`，可实现实时预览。
4. 开发完成使用 `npm run build` 命令后，`微信开发者工具` 可能会报错，这是因为`wap` 在 执行`build`时会删掉整个 `dist` 文件，此时重启 `微信开发者工具`即可。
