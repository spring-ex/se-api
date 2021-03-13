'use strict';
var statusCodes = require('./StatusCodesController.js');
var database = require('../database_scripts/connection_string.js');

module.exports = {
    addDaysTimetable: function(req, res) {
        var result = {};
        if (req.body.Action == "add") {
            var queryString = 'INSERT INTO TimeTable(ClassId, SubjectId, Day) VALUES(' + req.body.ClassId + ',' + req.body.SubjectId + ', "' + req.body.Day + '")';
        } else {
            var queryString = 'DELETE FROM TimeTable WHERE ClassId = ' + req.body.ClassId + ' AND SubjectId = ' + req.body.SubjectId + ' AND Day = "' + req.body.Day + '"';
        }
        database.connectionString.query(queryString, function(err, rows) {
            if (!err) {
                result.Code = statusCodes.successCodes[0].Code;
                result.Message = statusCodes.successCodes[0].Message;
                result.Data = rows;
                res.send(result);
            } else {
                res.send(err);
            }
        });
    },
    getDaysTimetable: function(req, res) {
        var result = {};
        var queryString = 'SELECT * FROM TimeTable WHERE ClassId = ' + req.body.ClassId;
        database.connectionString.query(queryString, function(err, rows) {
            if (!err) {
                if (rows.length == 0) {
                    result.Code = statusCodes.errorCodes[0].Code;
                    result.Message = statusCodes.errorCodes[0].Message;
                    result.Data = null;
                } else {
                    result.Code = statusCodes.successCodes[0].Code;
                    result.Message = statusCodes.successCodes[0].Message;
                    result.Data = rows;
                }
                res.send(result);
            } else {
                res.send(err);
            }
        });
    }
};