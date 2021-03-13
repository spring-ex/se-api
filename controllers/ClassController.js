'use strict';
var statusCodes = require('./StatusCodesController.js');
var database = require('../database_scripts/connection_string.js');

module.exports = {
    getAllClasses: function(req, res) {
        var result = {};
        var queryString = 'SELECT * from Class';
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
    getClassById: function(req, res) {
        var result = {};
        var queryString = 'SELECT * from Class WHERE Id = ' + req.params.ClassId;
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
    getClassesBySemester: function(req, res) {
        var result = {};
        var queryString = 'SELECT * from Class WHERE SemesterId = ' + req.params.SemesterId + ' AND BranchId = ' + req.params.BranchId + ' AND CourseId = ' + req.params.CourseId + ' AND CollegeId = ' + req.params.CollegeId + ' AND UniversityId = ' + req.params.UniversityId + ' AND StateId = ' + req.params.StateId;
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
    getClassesBySubject: function(req, res) {
        var result = {};
        if (req.params.IsElective == "true") {
            var queryString = 'SELECT Id, CollegeId, CourseId, Name, SemesterId, SpecialSubjectId AS SubjectId FROM SpecialClass WHERE Id IN (SELECT SpecialClassId FROM UserTakesSpecialSubject WHERE SpecialSubjectId = ' + req.params.SubjectId + ' AND UserId = ' + req.params.UserId + ')';
        } else {
            var queryString = 'SELECT * from Class WHERE Id IN (SELECT ClassId FROM UserSubject WHERE SubjectId = ' + req.params.SubjectId + ' AND UserId = ' + req.params.UserId + ')';
        }
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
    addClasses: function(req, res) {
        var result = {};
        if (req.body.Names.length == 0 || req.body.BranchId == "" || req.body.SemesterId == "" || req.body.CollegeId == "" || req.body.CourseId == "" || req.body.UniversityId == "" || req.body.StateId == "") {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            var queries = [];
            for (var i = 0; i < req.body.Names.length; i++) {
                var query = 'INSERT INTO Class(Id, Name, CollegeId, CourseId, BranchId, SemesterId, UniversityId, StateId) VALUES(null, "' + req.body.Names[i] + '", ' + req.body.CollegeId + ',' + req.body.CourseId + ',' + req.body.BranchId + ',' + req.body.SemesterId + ',' + req.body.UniversityId + ',' + req.body.StateId + ')';
                queries.push(query);
            }
            database.connectionString.query(queries.join("; "), req.body, function(err, rows) {
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
    updateClass: function(req, res) {
        var result = {};
        if (req.body.Name == "" || req.body.Id == "") {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            var queryString = 'UPDATE Class SET ? WHERE Id = ' + req.body.Id;
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
    deleteClass: function(req, res) {
        var result = {};
        if (req.body.Id == "") {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            var queryString = 'DELETE FROM Class WHERE Id = ' + req.body.Id;
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