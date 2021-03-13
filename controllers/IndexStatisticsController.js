'use strict';
var statusCodes = require('./StatusCodesController.js');
var database = require('../database_scripts/connection_string.js');

module.exports = {
    getCollegeMarksStatisticsByIndexing: function(req, res) {
        var result = {};
        if (req.body.CollegeId == "") {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            var response = {
                Percentage: 0
            };
            if (req.body.CourseId != null && req.body.BranchId != null && req.body.SemesterId != null && req.body.ClassId != null) {
                var queryString = 'SELECT * FROM Student WHERE CollegeId = ' + req.body.CollegeId + ' AND CourseId = ' + req.body.CourseId + ' AND BranchId = ' + req.body.BranchId + ' AND SemesterId = ' + req.body.SemesterId + ' AND ClassId = ' + req.body.ClassId + ' AND Status <> 1';
            } else if (req.body.CourseId != null && req.body.BranchId != null && req.body.SemesterId != null) {
                var queryString = 'SELECT * FROM Student WHERE CollegeId = ' + req.body.CollegeId + ' AND CourseId = ' + req.body.CourseId + ' AND BranchId = ' + req.body.BranchId + ' AND SemesterId = ' + req.body.SemesterId + ' AND Status <> 1';
            } else if (req.body.CourseId != null && req.body.BranchId != null) {
                var queryString = 'SELECT * FROM Student WHERE CollegeId = ' + req.body.CollegeId + ' AND CourseId = ' + req.body.CourseId + ' AND BranchId = ' + req.body.BranchId + ' AND Status <> 1';
            } else if (req.body.CourseId != null) {
                var queryString = 'SELECT * FROM Student WHERE CollegeId = ' + req.body.CollegeId + ' AND CourseId = ' + req.body.CourseId + ' AND Status <> 1';
            } else {
                var queryString = 'SELECT * FROM Student WHERE CollegeId = ' + req.body.CollegeId + ' AND Status <> 1';
            }
            database.connectionString.query(queryString, function(err, rows) {
                if (!err) {
                    var studentIds = [];
                    for (var i = 0; i < rows.length; i++) {
                        studentIds.push(rows[i].Id);
                    }
                    if (studentIds.length == 0) {
                        result.Code = statusCodes.errorCodes[4].Code;
                        result.Message = statusCodes.errorCodes[4].Message;
                        result.Data = null;
                        res.send(result);
                    } else {
                        var queryString2 = 'SELECT AVG(SubjectScore) AS Result FROM SubjectAcademicPerformanceIndex WHERE StudentId IN (' + studentIds.join(",") + ')';
                        database.connectionString.query(queryString2, function(err2, rows2) {
                            if (!err2) {
                                response.Percentage = rows2[0].Result;
                                result.Code = statusCodes.successCodes[0].Code;
                                result.Message = statusCodes.successCodes[0].Message;
                                result.Data = response;
                                res.send(result);
                            } else {
                                res.send(err2)
                            }
                        });
                    }
                } else {
                    res.send(err);
                }
            });
        }
    },
    getStudentAcademicStatisticsByIndexing: function(req, res) {
        var result = {};
        var queryString = 'SELECT AVG(SubjectScore) AS Average FROM SubjectAcademicPerformanceIndex WHERE StudentId = ' + req.params.StudentId;
        database.connectionString.query(queryString, function(err, rows) {
            if (!err) {
                if (rows.length == 0) {
                    result.Code = statusCodes.errorCodes[0].Code;
                    result.Message = statusCodes.errorCodes[0].Message;
                    result.Data = null;
                    res.send(result);
                } else {
                    result.Code = statusCodes.successCodes[0].Code;
                    result.Message = statusCodes.successCodes[0].Message;
                    result.Data = rows[0];
                    res.send(result);
                }
            } else {
                res.send(err)
            }
        });
    },
    getStudentSmartStatisticsByIndexing: function(req, res) {
        var result = {};
        var queryString = 'SELECT AVG(TopicScore) AS Average FROM TopicPerformanceIndex WHERE StudentId = ' + req.params.StudentId;
        database.connectionString.query(queryString, function(err, rows) {
            if (!err) {
                if (rows.length == 0) {
                    result.Code = statusCodes.errorCodes[0].Code;
                    result.Message = statusCodes.errorCodes[0].Message;
                    result.Data = null;
                    res.send(result);
                } else {
                    result.Code = statusCodes.successCodes[0].Code;
                    result.Message = statusCodes.successCodes[0].Message;
                    result.Data = rows[0];
                    res.send(result);
                }
            } else {
                res.send(err)
            }
        });
    },
    getSubjectSmartStatisticsByIndexing: function(req, res) {
        var result = {};
        var queryString = 'SELECT AVG(TopicScore) AS Average FROM TopicPerformanceIndex WHERE SubjectId = ' + req.params.SubjectId + ' AND StudentId IN (SELECT Id FROM Student WHERE ClassId = ' + req.params.ClassId + ')';
        database.connectionString.query(queryString, function(err, rows) {
            if (!err) {
                if (rows.length == 0) {
                    result.Code = statusCodes.errorCodes[0].Code;
                    result.Message = statusCodes.errorCodes[0].Message;
                    result.Data = null;
                    res.send(result);
                } else {
                    result.Code = statusCodes.successCodes[0].Code;
                    result.Message = statusCodes.successCodes[0].Message;
                    result.Data = rows[0];
                    res.send(result);
                }
            } else {
                res.send(err)
            }
        });
    },
    getStudentSubjectSmartStatisticsByIndexing: function(req, res) {
        var result = {};
        var queryString = 'SELECT AVG(TopicScore) AS Average FROM TopicPerformanceIndex WHERE StudentId = ' + req.params.StudentId + ' AND SubjectId = ' + req.params.SubjectId;
        database.connectionString.query(queryString, function(err, rows) {
            if (!err) {
                if (rows.length == 0) {
                    result.Code = statusCodes.errorCodes[0].Code;
                    result.Message = statusCodes.errorCodes[0].Message;
                    result.Data = null;
                    res.send(result);
                } else {
                    result.Code = statusCodes.successCodes[0].Code;
                    result.Message = statusCodes.successCodes[0].Message;
                    result.Data = rows[0];
                    res.send(result);
                }
            } else {
                res.send(err)
            }
        });
    }
}