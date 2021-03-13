'use strict';
var statusCodes = require('./StatusCodesController.js');
var database = require('../database_scripts/connection_string.js');

module.exports = {
    addSpecialClass: function(req, res) {
        var result = {};
        if (req.body.Name == "") {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            var queryString = 'INSERT INTO SpecialClass SET ?';
            database.connectionString.query(queryString, req.body, function(err, rows) {
                if (!err) {
                    result.Code = statusCodes.successCodes[0].Code;
                    result.Message = statusCodes.successCodes[0].Message;
                    result.Data = rows;
                    res.send(result);
                } else {
                    res.send(err);
                }
            });
        }
    },
    getAllClassesForSubject: function(req, res) {
        var result = {};
        if (req.params.SpecialSubjectId == "") {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            var queryString = 'SELECT * FROM SpecialClass WHERE SpecialSubjectId = ' + req.params.SpecialSubjectId + ' AND CollegeId = ' + req.params.CollegeId;
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
        }
    },
    getAllStudentsInCourseAndSem: function(req, res) {
        var result = {};
        if (req.params.CourseId == "") {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            var queryString = 'SELECT * FROM Student WHERE CollegeId = ' + req.params.CollegeId + ' AND CourseId = ' + req.params.CourseId + ' AND SemesterId = ' + req.params.SemesterId + ' AND Status <> 1 ORDER BY Name ASC';
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
        }
    },
    getAllStudentsInSpecialClass: function(req, res) {
        var result = {};
        if (req.params.SpecialClassId == "") {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            var queryString = 'SELECT * FROM Student WHERE Id IN (SELECT StudentId FROM StudentTakesSpecialClass WHERE SpecialClassId = ' + req.params.SpecialClassId + ') AND Status <> 1 ORDER BY Name ASC';
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
        }
    }
}