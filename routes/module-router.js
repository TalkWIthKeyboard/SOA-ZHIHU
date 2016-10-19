/**
 * Created by CoderSong on 16/10/18.
 */
'use strict';

const router = require('express').Router();

const newInfo = require('./newInfo/new');

router.get('/latestNew',newInfo.getLatestNew);
router.get('/getNewFromId/:id',newInfo.getNewFromId);

module.exports = router;