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

/**
 * generates random string of characters i.e salt
 * @function
 * @param {number} length - Length of the random string.
 */
var genRandomString = function(length){
    return crypto.randomBytes(Math.ceil(length/2))
        .toString('hex') /** convert to hexadecimal format */
        .slice(0,length);   /** return required number of characters */
};

/**
 * hash password with sha512.
 * @function
 * @param {string} password - List of required fields.
 * @param {string} salt - Data to be validated.
 */
var sha512 = function(password, salt){
    var hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
    hash.update(password);
    var value = hash.digest('hex');
    return {
        salt:salt,
        passwordHash:value
    };
};

router.post('/', function(req, res, next) {

    var email= req.body.email;
    var password= req.body.password;
    var sql= 'SELECT * FROM `on-hour-time`.login WHERE email=\''+email+'\'';
    var insert='INSERT INTO `on-hour-time`.`login`(`email`, `password`)VALUES(\''+email+'\',\''+password+'\')';
    //check if email exists, if email does not exist send error
    db.query(sql, function(err, rows, fields) {

        if(rows.length==0){
            console.log('user does not exist')
            db.query(insert, function(err, rows, fields) {

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
