# 联运知慧-管理后台 Vue 组件库

### Node 版本

node >= 10

- v12.22.1

# 安装依赖

```bash
# 安装依赖
yarn install

# 切换淘宝源，解决 npm 下载速度慢的问题
yarn install --registry=https://registry.npm.taobao.org

# 启动服务
npm run dev

# 打包
npm run build:prod

```

# 目录结构

```bash
├─ src                        # 项目源代码
│   ├─ components             # 组件
│   │   ├─ business           # 业务组件
│   │   └─ ui                 # UI组件
│   ├─ styles                 # 全局样式
│   ├─ utils                  # 全局公用方法
│   └─index.js                # 源码入口
├── dist                      # 打包后代码
├── example                   # Demo
```

# 组件

### 业务组件

- LoginPanel - 登录面板组件
- SelectMemberModal - 选择员工组件

### UI 组件

# 代码提交规范

1. [commitlint](https://github.com/conventional-changelog/commitlint)

```
commitlint:
eg.
git add --all
git commit -m 'feat: 提交功能'
git push
```

| 规范名   | 描述                                                    |
| -------- | ------------------------------------------------------- |
| docs     | 仅仅修改了文档，比如 README, CHANGELOG, CONTRIBUTE 等等 |
| build    | 调整编译脚本以及流程                                    |
| ci       | 持续集成 CICD 相关流程                                  |
| chore    | 改变构建流程、或者增加依赖库、工具等                    |
| feat     | 新增 feature                                            |
| fix      | 修复 bug                                                |
| merge    | 合并分之                                                |
| perf     | 优化相关，比如提升性能、体验                            |
| refactor | 代码重构，没有加新功能或者修复 bug                      |
| revert   | 回滚到上一个版本                                        |
| style    | 仅仅修改了空格、格式缩进、都好等等，不改变代码逻辑      |
| test     | 测试用例，包括单元测试、集成测试等                      |
