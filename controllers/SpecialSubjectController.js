'use strict';
var statusCodes = require('./StatusCodesController.js');
var database = require('../database_scripts/connection_string.js');

module.exports = {
    getAllSpecialSubjects: function(req, res) {
        var result = {};
        var queryString = 'SELECT * FROM SpecialSubject WHERE CourseId =' + req.params.CourseId + ' AND SemesterId = ' + req.params.SemesterId;
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
    },
    addSpecialSubject: function(req, res) {
        var result = {};
        if (req.body.SubjectNames.length == "" || req.body.CourseId == "" || req.body.CollegeId == "" || req.body.SemesterId == "") {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            var queries = [];
            for (var i = 0; i < req.body.SubjectNames.length; i++) {
                var query = 'INSERT INTO SpecialSubject(Id, Name, CollegeId, CourseId, SemesterId) VALUES (null, "' + req.body.SubjectNames[i] + '", ' + req.body.CollegeId + ', ' + req.body.CourseId + ', ' + req.body.SemesterId + ')';
                queries.push(query);
            }
            database.connectionString.query(queries.join("; "), req.body, function(err, rows) {
                if (!err) {
                    result.Code = statusCodes.successCodes[0].Code;
                    result.Message = statusCodes.successCodes[0].Message;
                    result.Data = rows;
                    res.send(result);
                } else {
                    res.send(err)
                }
            });
        }
    },
    linkSubjects: function(req, res) {
        var result = {};
        if (req.body.SubjectIds.length == "" || req.body.SpecialSubjectId == "") {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            var queryString = 'UPDATE Subject SET SpecialSubjectId = ' + req.body.SpecialSubjectId + ' WHERE Id IN(' + req.body.SubjectIds.join(",") + ')';
            database.connectionString.query(queryString, function(err, rows) {
                if (!err) {
                    result.Code = statusCodes.successCodes[0].Code;
                    result.Message = statusCodes.successCodes[0].Message;
                    result.Data = rows;
                    res.send(result);
                } else {
                    res.send(err)
                }
            });
        }
    }
}