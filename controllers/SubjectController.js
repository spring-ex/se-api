'use strict';
var statusCodes = require('./StatusCodesController.js');
var database = require('../database_scripts/connection_string.js');

module.exports = {
    getAllSubjects: function(req, res) {
        var result = {};
        var queryString = 'SELECT * from Subject';
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
    getSubjectsBySemester: function(req, res) {
        var result = {};
        var queryString = 'SELECT * FROM Subject WHERE CourseId = ' + req.params.CourseId + ' AND BranchId = ' + req.params.BranchId + ' AND SemesterId = ' + req.params.SemesterId;
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
    getNonElectiveSubjectsBySemester: function(req, res) {
        var result = {};
        var queryString = 'SELECT * FROM Subject WHERE CourseId = ' + req.params.CourseId + ' AND BranchId = ' + req.params.BranchId + ' AND SemesterId = ' + req.params.SemesterId + ' AND SpecialSubjectId IS NULL';
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
    getSubjectsByCourseAndSem: function(req, res) {
        var result = {};
        var queryString = 'SELECT * FROM Subject WHERE CourseId = ' + req.params.CourseId + ' AND SemesterId = ' + req.params.SemesterId + ' AND IsElective = "true"';
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
    getSubjectsBySemesterAndUser: function(req, res) {
        var result = {};
        var queryString = 'SELECT * FROM Subject WHERE CourseId = ' + req.params.CourseId + ' AND BranchId = ' + req.params.BranchId + ' AND SemesterId = ' + req.params.SemesterId + ' AND Id IN (SELECT SubjectId from UserSubject WHERE UserId = ' + req.params.UserId + ')';
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
    getSubjectsBySemesterAndStudent: function(req, res) {
        var result = {};
        var queryString = '(SELECT * FROM Subject WHERE CourseId = ' + req.params.CourseId + ' AND BranchId = ' + req.params.BranchId + ' AND SemesterId = ' + req.params.SemesterId + ' AND IsElective = "false") UNION (SELECT s.*FROM Subject s INNER JOIN StudentTakesElective ste ON s.Id = ste.SubjectId WHERE s.CourseId = ' + req.params.CourseId + ' AND s.BranchId = ' + req.params.BranchId + ' AND s.SemesterId = ' + req.params.SemesterId + ' AND ste.StudentId = ' + req.params.StudentId + ')';
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
    getElectiveSubjectsBySemester: function(req, res) {
        var result = {};
        var queryString = 'SELECT * FROM Subject WHERE CourseId = ' + req.params.CourseId + ' AND BranchId = ' + req.params.BranchId + ' AND SemesterId = ' + req.params.SemesterId + ' AND IsElective = "true"';
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
    getSubjectsWithUserId: function(req, res) {
        var result = {};
        var queryString = 'SELECT s.*, us.UserId from Subject s LEFT JOIN UserSubject us ON s.Id = us.SubjectId WHERE s.CourseId = ' + req.params.CourseId + ' AND s.BranchId = ' + req.params.BranchId + ' AND s.SemesterId = ' + req.params.SemesterId;
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
    getSubjectsBySemesterAndUser: function(req, res) {
        var result = {};
        var queryString = 'SELECT * FROM Subject WHERE CourseId = ' + req.params.CourseId + ' AND BranchId = ' + req.params.BranchId + ' AND SemesterId = ' + req.params.SemesterId + ' AND Id IN (SELECT SubjectId from UserSubject WHERE UserId = ' + req.params.UserId + ')';
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
    getSubjectsByUser: function(req, res) {
        var result = {};
        var queryString = 'SELECT Id,Name,Nickname,CourseId,BranchId,SemesterId,IsElective,SpecialSubjectId from Subject WHERE SpecialSubjectId IS NULL AND Id IN (SELECT SubjectId from UserSubject WHERE UserId =  ' + req.params.UserId + ')';
        database.connectionString.query(queryString, function(err, rows) {
            if (!err) {
                var queryString2 = 'SELECT Id,Name,CourseId,SemesterId,CollegeId from SpecialSubject WHERE Id IN(SELECT SpecialSubjectId from UserTakesSpecialSubject WHERE UserId = ' + req.params.UserId + ')';
                database.connectionString.query(queryString2, function(err2, rows2) {
                    if (!err2) {
                        result.Code = statusCodes.successCodes[0].Code;
                        result.Message = statusCodes.successCodes[0].Message;
                        result.Data = rows;
                        for (var i = 0; i < rows2.length; i++) {
                            result.Data.push(rows2[i]);
                        }
                        res.send(result);
                    } else {
                        res.send(err2);
                    }
                });
            } else {
                res.send(err);
            }
        });
    },
    addSubject: function(req, res) {
        var result = {};
        if (req.body.SubjectNames.length == "" || req.body.CourseId == "" || req.body.BranchId == "" || req.body.SemesterId == "") {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            var queries = [];
            for (var i = 0; i < req.body.SubjectNames.length; i++) {
                var query = 'INSERT INTO Subject(Id, Name, Nickname, CourseId, BranchId, SemesterId, IsElective) VALUES (null, "' + req.body.SubjectNames[i] + '", "' + req.body.SubjectNames[i] + '", ' + req.body.CourseId + ', ' + req.body.BranchId + ', ' + req.body.SemesterId + ', "false")';
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
    updateSubject: function(req, res) {
        var result = {};
        if (req.body.Name == "" || req.body.Id == "") {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            var queryString = 'UPDATE Subject SET Name = "' + req.body.Name + '" WHERE Id = ' + req.body.Id;
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
    deleteSubject: function(req, res) {
        var result = {};
        if (req.body.Id == "") {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            var queryString = 'DELETE FROM Subject WHERE Id = ' + req.body.Id;
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