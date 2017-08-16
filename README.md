# weapp-demo

小程序 demo
推荐使用[wepy](https://github.com/wepyjs/wepy) 和 [labrador] (https://github.com/maichong/labrador),这两个库已经封装得非常优雅了！

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
