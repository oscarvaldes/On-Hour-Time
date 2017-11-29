var express = require('express'),
    mysql = require('mysql'),
    fs = require('fs'),
    router = express.Router(),
    bodyParser = require('body-parser-json'),
    path = require('path'),
    moment = require('moment');

router.use(bodyParser.urlencoded({
  extended: true
}));

// router.post('/', function(req, res, next) {

// }); //router.post
// router.get('/', function(req, res, next) {

// }); //router.get

module.exports = router;
