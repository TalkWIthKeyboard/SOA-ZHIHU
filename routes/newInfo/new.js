/**
 * Created by CoderSong on 16/10/18.
 */
'use strict';

var pub = {};
var format = require('js-format');
var request = require('request');
var fs = require('fs');

const latest_new_api = 'http://news-at.zhihu.com/api/4/news/latest';
const new_by_id_api = 'http://news-at.zhihu.com/api/4/news/%s';
const comment_by_id_api = 'http://news-at.zhihu.com/api/4/story/%s/long-comments';
const dir = 'public/images';

const regex = /((https|http):\/\/pic\d.*\.(png|jpg))/ig;


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
            res.render('newInfo/new.ejs',{
                'html' : html,
                'comments': comments
            })
        })
    })
};

function stampToString(timestamp) {
    var newDate = new Date();
    newDate.setTime(timestamp * 1000);
    return newDate.toDateString()
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