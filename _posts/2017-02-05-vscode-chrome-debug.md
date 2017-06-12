---
layout: post
title: VS Code Chrome debug
date: 2017-02-05 23:35:17 +0800
tags:
  - note
  - tool
  - frontend
---

最近发现了一个vscode插件——vscode-chrome-debug，通过它可以直接在编辑器里调试代码，为浏览器、
Node.js、Python甚至C++提供了统一的调试方式，下面记录一下踩过的坑

### 添加配置
通过Add Configuration命令添加的默认配置如下

```json
{
  "type": "chrome",
  "request": "launch",
  "name": "Launch Chrome",
  "url": "http://localhost:8080",
  "webRoot": "${workspaceFolder}"
}
```

### 遇到的问题
开启服务器之后，点击Launch，这时url页面会被打开，但vscode提示错误`connect ECONNREFUSED`，
原因是我之前已经启动chrome浏览器了，导致新的标签页无法开启调试端口，因此需要关闭所有页面，重新
Launch，或者启动chrome时指定参数`--remote-debugging-port=9222`

解决了问题之后，vscode能成功连接上chrome了，但断点却没有触发，折腾了好久发现是url配置的问题，
如果将url条目改为`"file": "${workspaceFolder}/index.html"`，以file协议的方式打开文件，
则断点是能够正常触发的

原因是url路径的问题，虽然目录下的index.html默认会被serve，但插件却无法在workspaceFolder下
匹配文件路径`/`，因此需要加上完整的文件名index.html，最终的配置如下

```json
{
  "type": "chrome",
  "request": "launch",
  "name": "Launch Chrome",
  "runtimeExecutable": "${workspaceFolder}/.chrome",
  "url": "http://localhost:8080/index.html",
  "webRoot": "${workspaceFolder}"
}
```
