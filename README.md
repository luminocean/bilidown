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

示例：
bilidown -p videos -u http://www.bilibili.com/video/av2474781/

> -p 参数可以使用相对于当前执行路径的相对路径，也可以直接写绝对路径

### 安装

首先确认安装了Node.js与npm工具，参考 https://nodejs.org 与 https://www.npmjs.com
git clone以后，在项目目录下执行`npm install`安装依赖后即可使用
