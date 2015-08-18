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
var descriptorUrlTemplate = 'http://www.bilibili.com/m/html5?aid=#{av_number}&page=1';

/**
 * 下载B站的视频
 * @param  {string}   pageUrl  视频页面的URL地址
 * @param  {string}   savePathStr  用户输入的视频保存地址
 * @param  {Function} callback err
 */
bilidown.downloadPageVideo = function(pageUrl, savePathStr, callback){
  var avNumber = pageUrl.match(/av(\d+)\//)[1];
  var descriptorUrl = descriptorUrlTemplate.replace(/#{av_number}/, avNumber);
  // 视频存储的实际绝对地址
  var savePath = resolePath(savePathStr);

  http.get(descriptorUrl, function(res){ // 获取描述文件
    getTextFromResponse(res, function(err, text){ // 获取描述文件内的文本
      handleVideoDescriptor(text, function(err, videoUrl){ //截取视频url
        downloadVideo(videoUrl, avNumber, savePath, function(err){ // 下载视频
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
  if(inputPath.indexOf('.') == 0){
    realPath = path.join(process.cwd(),inputPath);
  }else{
    realPath = inputPath;
  }

  console.log('视频保存到：'+realPath);

  return realPath;
}

/**
 * 直接下载视频
 * @param  {string}   videoUrl 视频url
 * @param  {string}   avNumber av号的数字部分
 * @param  {string}   savePath 保存路径（绝对地址）
 * @param  {Function} callback err
 */
function downloadVideo(videoUrl, avNumber, savePath, callback){
  http.get(videoUrl, function(res){
    // 使用download模块进行下载
    new Download()
      .get(videoUrl)
      .dest(savePath)
      .rename('av'+avNumber+'.mp4')
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
