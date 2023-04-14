---
layout: post
title: 绘制Chrome风格的Tab栏
date: 2023-04-12 00:12:28 +0800
tags:
  - note
  - frontend
  - javascript
---

大约在12年左右第一次接触Sublime编辑器和Chrome浏览器的时候，对这两款软件最深刻的印象就是其非常
现代化的标签栏样式。同样作为多Tab布局应用，不同于当时我用的比较多的IE或者NotePad++，这两款软件
的Tab栏都采用了圆角梯形加底部融合过渡曲线的设计，但因为当时我也不太关注UI，就忽略这块没有深究了。

但正巧最近在研究一个东西，得知了这种Tab风格在Chromium里的实现叫做GM2TabStyle，就翻了一下源码
看看究竟是怎么绘制的，同时解答心中多年的疑惑。

### 代码
真实的源码太长了，而且有很多细节处理，这里就大致简化了，有兴趣的可以参看下面的Chromium源码

[chromium@/chrome/browser/ui/views/tabs/tab_style_views.cc#L79](https://github.com/chromium/chromium/blob/main/chrome/browser/ui/views/tabs/tab_style_views.cc#L79)

```cpp
SkPath GM2TabStyle::GetPath(PathType path_type,
                            float scale,
                            bool force_active,
                            RenderUnits render_units) const {
  // Start with the left side of the shape.
  path.moveTo(left, extended_bottom);
  // Draw the left edge of the extension.
  //   ╭─────────╮
  //   │ Content │
  // ┏─╯         ╰─┐
  path.lineTo(left, tab_bottom);
  // Draw the bottom-left corner.
  //   ╭─────────╮
  //   │ Content │
  // ┌━╝         ╰─┐
  path.lineTo(tab_left - bottom_radius, tab_bottom);
  path.arcTo(bottom_radius, bottom_radius, 0, SkPath::kSmall_ArcSize,
             SkPathDirection::kCCW, tab_left, tab_bottom - bottom_radius);
  // Draw the ascender and top-left curve, if present.
  //   ┎─────────╮
  //   ┃ Content │
  // ┌─╯         ╰─┐
  path.lineTo(tab_left, tab_top + top_radius);
  path.arcTo(top_radius, top_radius, 0, SkPath::kSmall_ArcSize,
             SkPathDirection::kCW, tab_left + top_radius, tab_top);
  // Draw the top crossbar and top-right curve, if present.
  //   ╭━━━━━━━━━╗
  //   │ Content │
  // ┌─╯         ╰─┐
  path.lineTo(tab_right - top_radius, tab_top);
  path.arcTo(top_radius, top_radius, 0, SkPath::kSmall_ArcSize,
             SkPathDirection::kCW, tab_right, tab_top + top_radius);
  // Draw the descender and bottom-right corner.
  //   ╭─────────╮
  //   │ Content ┃
  // ┌─╯         ╚━┐
  path.lineTo(tab_right, tab_bottom - bottom_radius);
  path.arcTo(bottom_radius, bottom_radius, 0, SkPath::kSmall_ArcSize,
             SkPathDirection::kCCW, tab_right + bottom_radius, tab_bottom);
  path.lineTo(right, tab_bottom);
  // Draw anything remaining: the descender, the bottom right horizontal
  // stroke, or the right edge of the extension, depending on which
  // conditions fired above.
  //   ╭─────────╮
  //   │ Content │
  // ┌─╯         ╰─┓
  path.lineTo(right, extended_bottom);
  path.close();
  return path;
}
```

挺出乎我意料的，其实代码不难理解，而且注释非常清晰，每一步都用ASCII图标注出来了，最终返回的路径
会被用于填充以及边框的绘制，最终Skia会将其显示在屏幕上。

下面我用JS Canvas API复刻了一遍

### Canvas实现
```js
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

class ChromeTabBar {
  x = 0;
  y = 0;
  width = 400;
  height = 50;
  extensionHeight = 10;
  tabs = [];
  backgroundColor = '#3388ff';

  constructor() {
    this.tabs.push(new ChromeTab(this));
  }

  draw(ctx) {
    ctx.fillStyle = this.backgroundColor;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    this.tabs.forEach((tab) => { tab.draw(ctx); });
  }
}

class ChromeTab {
  tabWidth = 200;
  tabHeight = 40;
  offsetX = 0;
  radius = 10;
  parent = null;
  backgroundColor = '#eeeeee';

  constructor(parent) {
    this.parent = parent;
  }

  draw(ctx) {
    const x0 = this.parent.x + this.offsetX + this.radius;
    const y0 = this.parent.y;
    const x1 = x0 + this.tabWidth;
    const y1 = y0 + this.tabHeight;
    const path = new Path2D();
    // Start from bottom-left
    path.moveTo(this.parent.x, y1 + this.parent.extensionHeight);
    // Draw the left edge of the extension
    //   ╭─────────╮
    //   │ Content │
    // ┏─╯         ╰─┐
    path.lineTo(this.parent.x, y1);
    // Draw the bottom-left corner
    //   ╭─────────╮
    //   │ Content │
    // ┌━╝         ╰─┐
    path.lineTo(x0 - this.radius, y1);
    path.arcTo(x0, y1, x0, y1 - this.radius, this.radius);
    // Draw the ascender and top-left curve
    //   ┎─────────╮
    //   ┃ Content │
    // ┌─╯         ╰─┐
    path.lineTo(x0, y0 + this.radius);
    path.arcTo(x0, y0, x0 + this.radius, y0, this.radius);
    // Draw the top crossbar and top-right curve
    //   ╭━━━━━━━━━╗
    //   │ Content │
    // ┌─╯         ╰─┐
    path.lineTo(x1 - this.radius, y0);
    path.arcTo(x1, y0, x1, y0 + this.radius, this.radius);
    // Draw the descender and bottom-right corner
    //   ╭─────────╮
    //   │ Content ┃
    // ┌─╯         ╚━┐
    path.lineTo(x1, y1 - this.radius);
    path.arcTo(x1, y1, x1 + this.radius, y1, this.radius);
    path.lineTo(this.parent.x + this.parent.width, y1);
    // Draw anything remaining: the descender, the bottom right horizontal stroke
    path.lineTo(this.parent.x + this.parent.width, y1 + this.parent.extensionHeight);
    path.closePath();
    ctx.fillStyle = this.backgroundColor;
    ctx.fill(path);
  }
}

const shape = new ChromeTabBar();
shape.draw(ctx);
```
