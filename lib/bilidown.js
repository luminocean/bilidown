/*
 * bilidown主文件
 */

// 对外导出的js对象，包含所有对外API
var bilidown = {};
module.exports = bilidown;

var http = require('http');
var fs = require('fs');
var path = require('path');
var Download = require('download');

// 视频描述文件的url地址模板
var descriptorUrlTemplate = 'http://www.bilibili.com/m/html5?aid=#{av_number}&page=#{page_number}';

/**
 * 下载B站的视频
 * @param  {string}   pageUrl  视频页面的URL地址
 * @param  {number}   pageNumber  视频页面里第几页
 * @param  {string}   saveDir  用户输入的视频保存目录
 * @param  {Function} callback err
 */
bilidown.downloadPageVideo = function(pageUrl, pageNumber, saveDir, callback){
  var avNumber = pageUrl.match(/av(\d+)\//)[1];
  // 拼接出描述文件的url地址
  var descriptorUrl = descriptorUrlTemplate.replace(/#{av_number}/, avNumber)
    .replace(/#{page_number}/, pageNumber);

  // 视频存储的实际绝对地址
  var savePath = resolePath(saveDir);

  http.get(descriptorUrl, function(res){ // 获取描述文件
    getTextFromResponse(res, function(err, text){ // 获取描述文件内的文本
      handleVideoDescriptor(text, function(err, videoUrl){ //截取视频url
        downloadVideo(videoUrl, avNumber, pageNumber, savePath, function(err){ // 下载视频
          callback(err);
        });
      });
    });
  });
};

/**
 * 解析用户输入的路径（相对或绝对地址），返回实际的绝对地址
 * 如果输入的是相对地址，则相对于当前的【执行】目录
 * @param  {string} inputPath 用户的输入路径
 * @return {string} 解析后的实际路径
 */
function resolePath(inputPath){
  var realPath = '';

  // 相对路径
  if(!path.isAbsolute(inputPath)){
    realPath = path.join(process.cwd(),inputPath);
  }else{
    realPath = inputPath;
  }

  console.log('视频保存到目录：'+realPath);

  return realPath;
}

/**
 * 直接下载视频
 * @param  {string}   videoUrl 视频url
 * @param  {number}   avNumber av号的数字部分
 * @param  {number}   pageNumber 视频里地第几页
 * @param  {string}   savePath 保存路径（绝对地址）
 * @param  {Function} callback err
 */
function downloadVideo(videoUrl, avNumber, pageNumber, savePath, callback){
  http.get(videoUrl, function(res){
    var fileName = 'av'+avNumber
    if(pageNumber != 1) // 第一个视频不加下划线
      fileName += ('_' + pageNumber);
    fileName += '.mp4'; // 后缀

    // 使用download模块进行下载
    new Download()
      .get(videoUrl)
      .dest(savePath)
      .rename(fileName)
      .run(function(err){
        callback(err);
      });
  }).on('error', function(err){
    callback(err);
  });
}

/**
 * 处理视频描述文件，获取视频实际的url
 * @param  {[type]}   descriptor 视频描述文件文本
 * @param  {Function} callback   err, videoUrl
 */
function handleVideoDescriptor(descriptorText, callback){
  var descriptor = JSON.parse(descriptorText);
  return callback(null, descriptor.src);
}

/**
 * 从http响应中取出文本
 * @param  {object}   response http响应
 * @param  {Function} callback err,string
 */
function getTextFromResponse(response, callback){
  var html = '';
  response.on('data', function(chunk){
    html += chunk;
  });
  response.on('end', function(){
    callback(null, html);
  });
}
