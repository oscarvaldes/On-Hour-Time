var express = require('express'),
    mysql = require('mysql'),
    fs = require('fs'),
    router = express.Router(),
    bodyParser = require('body-parser-json'),
    crypto = require('crypto'),
    path = require('path'),
    db = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'Blue$apph1re#2',
        database: 'on-hour-time',
        multipleStatements: 'true'
    }),
    moment = require('moment');

router.use(bodyParser.urlencoded({
    extended: true
}));

db.connect(function(err) {
    if (!err) {
        console.log(' ');
        console.log(' ');
        console.log('____________________________________________________________________');
        console.log('Database is connected!');
    } else {
        console.log('Error connecting database: '+err);
    }
}); //db.connect
router.post('/', function(req, res, next) {
    var email= req.body.email;
    var password= req.body.password;

    //check if email exists, if email does not exist send error

    //check if password matches, if password does not match send error

    res.send(true);

}); //router.post
router.get('/', function(req, res, next) {

}); //router.get

module.exports = router;
