# 奇妙迷宫

写给五岁孩子的主题迷宫小游戏（手机/平板触屏）。

## 怎么玩

用手机浏览器打开 `index.html`，或在项目目录运行：

```bash
npx --yes serve .
```

点「开始」选关，用屏幕下方方向键走到终点。

## 关卡

| 主题 | 尺寸 |
|------|------|
| 森林小动物 | 10×10 |
| 海底冒险 | 15×15 |
| 星空火箭 | 20×20 |

## 测试

```bash
node tests/maze-core.test.js
node tests/levels.test.js
```
