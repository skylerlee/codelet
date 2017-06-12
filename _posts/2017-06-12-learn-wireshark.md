---
layout: post
title: 学习Wireshark
date: 2017-06-12 19:41:28 +0800
tags:
  - tutorial
  - tool
---

### 安装
在Arch Linux上安装Wireshark只需要一条命令`sudo yaourt -S wireshark-qt`，软件安装好之后
开始抓包，结果抛出错误信息：`couldn't run dumpcap ... Permission Denied`，查看Wiki得知
是用户组的问题，需要将用户添加进wireshark组，执行命令`sudo gpasswd -a $USER wireshark`，
重新登录即可
