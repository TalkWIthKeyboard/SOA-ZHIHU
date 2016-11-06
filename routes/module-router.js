/**
 * Created by CoderSong on 16/10/18.
 */
'use strict';

var router = require('express').Router();

var newInfo = require('./newInfo/new');

router.get('/',newInfo.basicUrl);
router.get('/latestNew',newInfo.getLatestNew);
router.get('/getNewFromId/:id',newInfo.getNewFromId);
router.get('/getHotMovie/:lo/:la',newInfo.getHotMovie);
router.get('/getPosition/:lo/:la',newInfo.getPosition);
router.get('/getWeather/:lo/:la',newInfo.getWeather);

module.exports = router;