'use strict';
var statusCodes = require('./StatusCodesController.js');
var database = require('../database_scripts/connection_string.js');

module.exports = {
    getObservationDetails: function(req, res) {
        var result = {};
        var queryString = 'SELECT * FROM Subject WHERE CourseId = ' + req.body.CourseId + ' AND BranchId = ' + req.body.BranchId + ' AND SemesterId = ' + req.body.SemesterId;
        database.connectionString.query(queryString, function(err, rows) {
            if (!err) {
                if (rows.length == 0) {
                    result.Code = statusCodes.errorCodes[0].Code;
                    result.Message = statusCodes.errorCodes[0].Message;
                    result.Data = null;
                    res.send(result);
                } else {
                    var subjectIds = [];
                    for (var i = 0; i < rows.length; i++) {
                        subjectIds.push(rows[i].Id);
                    }
                    var queryString2 = 'SELECT tc.*, shc.SubjectId, shc.TestCategoryId FROM TestCategory tc INNER JOIN SubjectHasCategory shc ON tc.Id = shc.TestCategoryId WHERE shc.SubjectId IN (' + subjectIds.join(",") + ')';
                    database.connectionString.query(queryString2, function(err2, rows2) {
                        if (!err2) {
                            if (rows2.length == 0) {
                                result.Code = statusCodes.errorCodes[0].Code;
                                result.Message = statusCodes.errorCodes[0].Message;
                                result.Data = null;
                                res.send(result);
                            } else {
                                var queryString3 = 'SELECT * FROM Test WHERE ClassId = ' + req.body.ClassId;
                                database.connectionString.query(queryString3, function(err3, rows3) {
                                    if (!err3) {
                                        if (rows3.length == 0) {
                                            result.Code = statusCodes.errorCodes[0].Code;
                                            result.Message = statusCodes.errorCodes[0].Message;
                                            result.Data = null;
                                            res.send(result);
                                        } else {
                                            var subjects = [],
                                                categories = [],
                                                tests = [];
                                            for (var i = 0; i < rows.length; i++) {
                                                categories = [];
                                                for (var j = 0; j < rows2.length; j++) {
                                                    tests = [];
                                                    if (rows[i].Id == rows2[j].SubjectId) {
                                                        for (var k = 0; k < rows3.length; k++) {
                                                            if (rows2[j].TestCategoryId == rows3[k].TestCategoryId) {
                                                                tests.push({
                                                                    Id: rows3[k].Id,
                                                                    Name: rows3[k].Name,
                                                                    MaxMarks: rows3[k].MaxMarks,
                                                                });
                                                            }
                                                        }
                                                        categories.push({
                                                            Id: rows2[j].Id,
                                                            Name: rows2[j].Name,
                                                            Tests: tests
                                                        });
                                                    }
                                                }
                                                subjects.push({
                                                    Id: rows[i].Id,
                                                    Name: rows[i].Name,
                                                    Categories: categories
                                                });
                                            }
                                            result.Code = statusCodes.successCodes[0].Code;
                                            result.Message = statusCodes.successCodes[0].Message;
                                            result.Data = subjects;
                                            res.send(result);
                                        }
                                    } else {
                                        res.send(err3);
                                    }
                                });
                            }
                        } else {
                            res.send(err2);
                        }
                    });
                }
            } else {
                res.send(err);
            }
        });
    }
}