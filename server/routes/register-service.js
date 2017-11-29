var express = require('express'),
    mysql = require('mysql'),
    fs = require('fs'),
    router = express.Router(),
    bodyParser = require('body-parser-json'),
    crypto = require('crypto'),
    passwordHash = require('password-hash'),
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
    var hashedPassword = passwordHash.generate(password);
    var sql= 'SELECT * FROM `on-hour-time`.login WHERE email=\''+email+'\'';
    var insert='INSERT INTO `on-hour-time`.`login`(`email`, `password`)VALUES(\''+email+'\',\''+hashedPassword+'\')';
    //check if email exists
    db.query(sql, function(err, rows, fields) {

        if(rows.length==0){
            console.log('user does not exist')
            db.query(insert, function(err, rows, fields) {
                if(err){
                    console.log(err);
                }

            });
            res.send(true);
        }
        else{
            console.log('user already exists')
            res.send(false);
        }
    }); //query



}); //router.post
router.get('/', function(req, res, next) {

}); //router.get

module.exports = router;
