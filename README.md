# 文档说明

## 代码规范

- 集成 EditorConfig 配置
  - EditorConfig 有助于为不同 IDE 编辑器上处理同一项目的多个开发人员维护一致的编码风格
  - 官网：[editorconfig.org](https://editorconfig.org/), 具体配置查看项目根目录下`.editorconfig`、文件
- ESLint + Prettier
  - 配置详见项目根目录`.eslintrc.js`、 `prettier.config.js`文件
- 集成 husky 和 lint-staged
  - husky —— Git Hook 工具，可以设置在 git 各个阶段（pre-commit、commit-msg、pre-push 等）触发我们的命令。
  - lint-staged —— 在 git 暂存的文件上运行 linters。

## git 规范

### commit message 格式规范

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

### 验证提交规范

commitlint 验证提交规则，并通过`husky`的`commit-msg` hook 触发验证提交信息的命令