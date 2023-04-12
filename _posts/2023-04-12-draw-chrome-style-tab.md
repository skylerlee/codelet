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
```
