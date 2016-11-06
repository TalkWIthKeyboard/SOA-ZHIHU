/**
 * Created by CoderSong on 16/10/18.
 */
'use strict';

var pub = {};
var format = require('js-format');
var request = require('request');
var fs = require('fs');
var select = require('xpath.js');
var dom = require('xmldom').DOMParser;

var latest_new_api = 'http://news-at.zhihu.com/api/4/news/latest';
var new_by_id_api = 'http://news-at.zhihu.com/api/4/news/%s';
var comment_by_id_api = 'http://news-at.zhihu.com/api/4/story/%s/long-comments';
var short_by_id_api = 'http://news-at.zhihu.com/api/4/story/%s/short-comments';
var dir = 'public/images';

var regex = /((https|http):\/\/pic\d.*\.(png|jpg))/ig;
var BAIDU_MOVIE_API = "http://api.map.baidu.com/telematics/v3/movie?qt=hot_movie&location=%s,%s&ak=l28tQqC0MN6pK7RWf4kjt0gnzUhXUNmp";
var BAIDU_CITY_API = "http://api.map.baidu.com/geocoder/v2/?ak=l28tQqC0MN6pK7RWf4kjt0gnzUhXUNmp&location=%s,%s&output=XML";
var BAIDU_WEATHER_API = "http://api.map.baidu.com/telematics/v3/weather?location=%s,%s&ak=l28tQqC0MN6pK7RWf4kjt0gnzUhXUNmp";

pub.basicUrl = (req, res) => {

    res.redirect('/latestNew');
};

pub.getLatestNew = (req, res) =>{

    request(latest_new_api,function (error, response, body) {
        var list = JSON.parse(body);
        var date = list.date;
        var stories = list.stories;
        //界面顶部viewpager滚动显示的内容
        var top_stories = top_stories;

        res.render('newInfo/index.ejs',{
            'stories': stories
        })
    })
};

pub.getHotMovie = (req, res) => {

    var longitude = req.params.lo;
    var latitude = req.params.la;
    var api = format(BAIDU_MOVIE_API,[latitude,longitude]);
    request(api,function (error, response, body) {

        var doc = new dom().parseFromString(body);
        var movie_name = select(doc,'//movie_name');
        var movie_release_date = select(doc,'//movie_release_date');
        var movie_score = select(doc,'//movie_score');
        var movie_picture = select(doc,'//movie_picture');

        var list = [];
        for (var index = 0; index < movie_name.length - 1; index++){
            var info = {};
            info['movie_name'] = getData(movie_name[index]);
            info['movie_release_date'] = getData(movie_release_date[index]);
            info['movie_score'] = getData(movie_score[index]);
            info['movie_picture'] = getData(movie_picture[index]);
            list.push(info);
        }

        list.sort(function (a,b) {
            if (strToDate(b['movie_release_date']) > strToDate(a['movie_release_date'])){
                return 1
            } else {
                return -1
            }
        });

        res.render('newInfo/movie.ejs',{
            'movies': list
        })
    })
};


pub.getPosition = (req, res) => {

    var longitude = req.params.lo;
    var latitude = req.params.la;
    var api = format(BAIDU_CITY_API,[longitude,latitude]);
    request(api, function (error, response, body) {

        var doc = new dom().parseFromString(body);
        var info = {};
        info['address'] = getData(select(doc,'//formatted_address')[0]);
        info['description'] = getData(select(doc, '//sematic_description')[0]);
        res.json(info);
    })
};


pub.getWeather = (req, res) => {

    var longitude = req.params.lo;
    var latitude = req.params.la;
    var api = format(BAIDU_WEATHER_API,[latitude,longitude]);
    request(api, function (error, response, body) {

        var doc = new dom().parseFromString(body);
        var info = {};
        info['weather'] = getData(select(doc,'//weather')[0]);
        info['wind'] = getData(select(doc,'//wind')[0]);
        info['temperature'] = getData(select(doc,'//temperature')[0]);
        res.json(info);
    })
};

pub.getNewFromId = (req, res) =>{

    var id = req.params.id;
    var url = format(new_by_id_api,[id]);
    //获取新闻主要内容
    request(url, function (error, response, body) {
        var json = JSON.parse(body);
        var html = json.body;
        html = html.replace(regex,function (match) {
            return 'http://zhihu.garychang.cn/tiny-pic?img=' + match
        });

        //获取该新闻的长评论
        url = format(comment_by_id_api,[id]);
        request(url, function (error, response, body) {
            var comment_json = JSON.parse(body);
            var comments = comment_json.comments;
            for (var i = 0; i < comments.length; i++) {
                comments[i].time = stampToString(comments[i].time);
            }

            //获取该新闻的短评论
            url = format(short_by_id_api,[id]);
            request(url, function (error, response, body) {
                var short_json = JSON.parse(body);
                var shorts = short_json.comments;
                for (var i = 0; i < shorts.length; i++) {
                    shorts[i].time = stampToString(shorts[i].time);
                }
                comments = shorts.concat(comments);
                res.render('newInfo/new.ejs',{
                    'html' : html,
                    'comments': comments
                })
            })
        })
    })
};

function stampToString(timestamp) {
    var newDate = new Date();
    newDate.setTime(timestamp * 1000);
    return newDate.toDateString()
}

function getData(elem) {
    if (elem.firstChild) {
        return elem.firstChild.data;
    } else {
        return null;
    }
}

function strToDate(str){
    var list = str.split('-');
    var date = new Date(list[0],list[1]-1,list[2]);
    return date;
}

function downloadImg(url,id) {

    request(url,function (err, response) {
        if (!err && response.statusCode == 200){
            request.head(url, function () {
                var name = id + '.jpg';
                request(url).pipe(fs.createWriteStream(dir + '/' + name));
            })
        }
    })
}

module.exports = pub;