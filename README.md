# SOA-ZHIHU

SOA课程作业，作业要求利用4个API制作一个小东西。该项目利用<font color=red>**知乎日报api**</font> + <font color=red>**百度地图、天气、电影api**</font>，以<font color=blue>**express框架**</font>为基础制作了一个网站。

## 使用方法
### 依赖安装
+ 确保git环境
+ 确保node环境
+ 确保npm环境
+ 首先在本地的workspace中初始化git环境，并进行clone

```
$ git init
$ git clone https://github.com/TalkWIthKeyboard/SOA-ZHIHU.git
```
+ 包依赖安装、更新

```
$ node install 
$ ncu -u
$ node update
```
+ 前段包依赖安装

```
$ bower install bootstrap
```
### 启动方式

```
$ node app.js
```
+ 进入 **localhost:3000** 进行访问

## 功能模块
+ 知乎日报模块
	+ 每天的知乎日报（实时更新）
		+ **API URL:** http://news-at.zhihu.com/api/4/news/latest
	+ 知乎日报的详细内容
		+ **API URL:** http://news-at.zhihu.com/api/4/news/**{新闻id}**
	+ 知乎日报的评论
		+ **长评论API URL:** http://news-at.zhihu.com/api/4/story/**{新闻id}**/long-comments
		+ **短评论API URL:** http://news-at.zhihu.com/api/4/story/**{新闻id}**/short-comments
+ 百度地图定位模块
	+ **API URL:** http://api.map.baidu.com/geocoder/v2/?ak=**{开发者openid}**&location=**{经纬度}**&output=XML
+ 百度天气模块
	+ **API URL:** http://api.map.baidu.com/telematics/v3/weather?location=**{经纬度}**&ak=**{开发者openid}** 
+ 百度电影模块
	+ **API URL:** http://api.map.baidu.com/telematics/v3/movie?qt=hot_movie&location=**{经纬度}**&ak=**{开发者openid}** 