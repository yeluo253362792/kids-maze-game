# 奇妙迷宫

写给五岁孩子的主题迷宫小游戏（手机/平板触屏）。

## 怎么玩

用手机浏览器打开 `index.html`，或在项目目录运行：

```bash
npx --yes serve .
```

打开首页直接选关，用屏幕下方方向键走到终点。

## 关卡（共 99 关）

前 15 关保持原主题与迷宫不变；其余 84 关尺寸在 15×15～45×45，错误分叉嵌套 ≤2 或 ≤3。

每关主题、成功路径均不同；全格可走，通关路线唯一。

## 迷宫数据

关卡路径已预计算并保存在 `js/mazes-data.js`。游戏运行时只读取，不再现场生成。

若改了种子或生成算法，重新烘焙：

```bash
node scripts/bake-mazes.js
```

## 测试

```bash
node tests/maze-core.test.js
node tests/levels.test.js
```
