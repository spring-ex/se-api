'use strict';
var mysql = require('mysql');

//prod
module.exports.connectionString = mysql.createConnection({
    host: 'd6rii63wp64rsfb5.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
    user: 'fi4bcsco5gtlragx',
    password: 'fd7hw5nkyavsj4i1',
    database: 'na0anxg7rwh93qm1',
    multipleStatements: true
});