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
const dir = 'public/images';


pub.getLatestNew = (req, res) =>{

    request(latest_new_api,function (error, response, body) {
        var list = JSON.parse(body);
        var date = list.date;
        var stories = list.stories;
        //界面顶部viewpager滚动显示的内容
        var top_stories = top_stories;

        for (var i = 0; i < stories.length; i++) {
            downloadImg(stories[i].images[0],stories[i].id);
        }

        res.render('newInfo/index.ejs',{
            'stories': stories
        })
    })
};

pub.getNewFromId = (req, res) =>{

    var id = req.params.id;
    var url = format(new_by_id_api,[id]);
    request(url, function (error, response, body) {
        var json = JSON.parse(body);
        var html = json.body;

        res.render('newInfo/new.ejs',{
            'html' : html
        })
    })
};


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