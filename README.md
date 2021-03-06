# Vite 2.x + Vue 2.x template

## 在线预览

https://guixianleng.github.io/vite2-vue2-template/

## 技术栈

- 构建工具：Vite 2.x
- 前端框架：Vue 2.x
- 编程语言：JavaScript
- Git Hook 工具：husky + lint-staged
- 代码规范：EditorConfig + Prettier + ESLint + Airbnb JavaScript Style Guide
- 提交规范：Commitizen + Commitlint
- 自动部署：GitHub Actions

> 说明：UI 框架本打算使用 ant-design-vue 1.x 版本的，但是使用之后发现兼容不了 vite2.x 具体请查看文末踩坑说明

## 快速开始

### 安装依赖

```
npm install

# or

yarn add
```

### 启动项目

```
npm run dev
```

### 项目打包

```
npm run build
```

## 搭建配置

### 代码规范

- 集成 EditorConfig 配置
  - EditorConfig 有助于为不同 IDE 编辑器上处理同一项目的多个开发人员维护一致的编码风格
  - 官网：[editorconfig.org](https://editorconfig.org/), 具体配置查看项目根目录下`.editorconfig`、文件
- ESLint + Prettier
  - 配置详见项目根目录`.eslintrc.js`、 `prettier.config.js`文件
- 集成 husky 和 lint-staged
  - husky —— Git Hook 工具，可以设置在 git 各个阶段（pre-commit、commit-msg、pre-push 等）触发我们的命令。
  - lint-staged —— 在 git 暂存的文件上运行 linters。

### git 规范

#### commit message 格式规范

commit message 由 Header、Body、Footer 组成。

```
<Header>

<body>

<footer>
```

#### Header

Header 部分包括三个字段 type（必需）、scope（可选）和 subject（必需）。

```
<type>(<scope>): <subject>
```

##### type 类型

|   表头   | 表头                                                     |
| :------: | :------------------------------------------------------- |
|   feat   | 新增一个功能                                             |
|   fix    | 修复一个 Bug                                             |
|   perf   | 更改代码，以提高性能                                     |
|   docs   | 文档修改                                                 |
|  style   | 代码格式（不影响功能，例如空格、分号等格式修正）         |
| refactor | 代码重构（重构，在不影响代码内部行为、功能下的代码修改） |
|   test   | 测试                                                     |
|  build   | 测试                                                     |
|    ci    | 持续集成相关文件修改                                     |
|  chore   | 其他修改（变更构建流程或辅助工具）                       |
|  revert  | 代码回退                                                 |
| workflow | 工作流相关文件修改                                       |
| release  | 发布新版本                                               |

##### scope

commit 影响的范围, 比如: route, component, utils, build…

##### subject

commit 的概述

#### Body

commit 具体修改内容, 可以分为多行.

#### Footer

一些备注, 通常是 BREAKING CHANGE 或修复的 bug 的链接.

示例：

- fix（修复 BUG）

```
// 示例1
fix(global): 修复 checkbox 不能复选的问题
```

- feat（添加新功能或新页面）

```
feat: 添加网站主页静态页面
```

- chore（其他修改）

```
chore: v3.4.2
```

#### `规范 commit message 的好处`

- 首行就是简洁实用的关键信息，方便在 git history 中快速浏览。
- 具有更加详细的 body 和 footer，可以清晰的看出某次提交的目的和影响。
- 可以通过 type 过滤出想要查找的信息，也可以通过关键字快速查找相关提交。
- 可以直接从 commit 生成 change log。

### 2. 验证提交规范

#### 1. 使用 Commitizen 实现规范提交

安装及配置这里不做赘述，

**注意**：若提交时候，使用`git cz`自动生成规范的 commit message，需要全局安装`ommitizen`

```
npm install -g commitizen
```

默认识英文提交 ![image](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d5bc364437b54bad9946fd43daaf10e7~tplv-k3u1fbpfcp-zoom-1.image)

改为自定义中文配置，具体请查看`.cz-config.js`文件 ![image](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c52e04ef0cda442fbd6c5c58691f8751~tplv-k3u1fbpfcp-zoom-1.image)

#### 2. commitlint 验证提交规则

安装及配置这里不做赘述，是通过`husky`的`commit-msg` hook 触发验证提交信息的命令

- 不符合规范的提交信息

如下图，提交信息 test commitlint 不符合规范，提交失败。 ![image](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dcce89c773b1424d88c915446be8d0eb~tplv-k3u1fbpfcp-zoom-1.image)

- 符合规范的提交信息

如下图，提交信息 test: commitlint test 符合规范，成功提交到仓库。 ![image](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/190ba1b62d8d433faf3d221eb8fb5119~tplv-k3u1fbpfcp-zoom-1.image)

若想偷懒，建议大家用`git cz`来代替`git commit`提交代码，可以保证提交信息规范。

## 踩坑：

### 1. git bush 无法使用箭头进行选择

第一种情况可以使用：

- 1 找到 git bash 的安装目录，找到 bash.bashrc 文件，

- 2 在文件的尾部加上：alias vue='winpty vue.cmd'，

- 3 重启 git bash 即可第二种直接输入箭头`所在行`的`数字`既可以

### 2. vite2.0 使用不了 ant-design-vue1.x 版本

问题描述：https://github.com/vueComponent/ant-design-vue/issues/2745

原因分析：由于`@ant-design/icons`不支持 ES Module 导出导致被 rollup-plugin-commonjs 处理了, 而 vite 正是由[ES Module](https://cn.vitejs.dev/guide/why.html#the-problems)进行预构建依赖的，而 ant-design-vue2.x 版本的 icon 组件不是内置的了，而是单独的`@ant-design/icons-vue`
