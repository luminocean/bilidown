# Bilidown
基于Node.js的B站视频下载器

### 基本用法

在bin目录下可以找到可执行文件bilidown

Usage: bilidown [options]

  Options:

    -h, --help         output usage information
    -V, --version      output the version number
    -u, --url [url]    The url of the video page
    -p, --path [path]  The path to which videos will be saved (absolute or relative). Default to the current execution path.
    -n, --nth [page_number]  The number of the subpage you want to download.(In the case where one video page has multiple subpages) Default to 1

示例：
bin/bilidown -p videos -n 2 -u http://www.bilibili.com/video/av2474781/

这行命令将下载该页面的第二个视频到当前目录下的videos文件夹下

### 安装

首先确认安装了Node.js与npm工具，参考 https://nodejs.org 与 https://www.npmjs.com
git clone以后，在项目目录下执行`npm install`安装依赖后即可使用
