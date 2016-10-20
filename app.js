'use strict';

var port = process.env.PORT || 3000;
var express = require('express');
var path = require('path');
var _ = require('underscore');
var partials = require('express-partials');
var bodyParser = require('body-parser');
var app = express();


//设置view的路径
app.set('views','./views');
app.set('view engine','ejs');
app.use(express.static('public'));
app.use(partials());

//bodyParser 解析req.body的内容
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:true }));

//静态文件的路径
app.use(express.static(path.join(__dirname, 'public')));
app.locals.moment = require('moment');

//监听端口
app.listen(port);

var modules = require('./routes/module-router');
app.use('/',modules);

module.exports = app;