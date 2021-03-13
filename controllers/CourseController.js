'use strict';
var statusCodes = require('./StatusCodesController.js');
var database = require('../database_scripts/connection_string.js');

module.exports = {
    getAllCourses: function(req, res) {
        var result = {};
        var queryString = 'SELECT * from Course';
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
    getCoursesByCollege: function(req, res) {
        var result = {};
        var queryString = 'SELECT * from Course WHERE Id IN (SELECT CourseId FROM CollegeHasCourse WHERE CollegeId = ' + req.params.CollegeId + ')';
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
    addCourse: function(req, res) {
        var result = {};
        if (req.body.Names.length == 0) {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            var queries = [];
            for (var i = 0; i < req.body.Names.length; i++) {
                var query = 'INSERT INTO Course(Id, Name) VALUES(null, "' + req.body.Names[i] + '")';
                queries.push(query);
            }
            database.connectionString.query(queries.join("; "), function(err, rows) {
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
    assignCoursesToCollege: function(req, res) {
        var result = {};
        if (req.body.CourseIds == "" || req.body.CollegeId == "" || req.body.UniversityId == "" || req.body.StateId == "") {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            var queries = [];
            for (var i = 0; i < req.body.CourseIds.length; i++) {
                var query = 'INSERT INTO CollegeHasCourse(Id, CourseId, CollegeId, UniversityId, StateId) VALUES(null, "' + req.body.CourseIds[i] + '", ' + req.body.CollegeId + ', ' + req.body.UniversityId + ', ' + req.body.StateId + ')';
                queries.push(query);
            }
            database.connectionString.query(queries.join("; "), function(err, rows) {
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
    updateCourse: function(req, res) {
        var result = {};
        if (req.body.Name == "" || req.body.Id == "") {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            var queryString = 'UPDATE Course SET Name = "' + req.body.Name + '" WHERE Id = ' + req.body.Id;
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
    deleteCourse: function(req, res) {
        var result = {};
        if (req.body.Id == "") {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            var queryString = 'DELETE FROM Course WHERE Id = ' + req.body.Id;
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