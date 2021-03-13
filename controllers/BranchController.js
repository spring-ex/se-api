'use strict';
var statusCodes = require('./StatusCodesController.js');
var database = require('../database_scripts/connection_string.js');

module.exports = {
    getAllBranches: function(req, res) {
        var result = {};
        var queryString = 'SELECT * from Branch';
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
    getBranchesByCourse: function(req, res) {
        var result = {};
        var queryString = 'SELECT Branch.Id, Branch.Name FROM Branch INNER JOIN CollegeHasBranch ON Branch.Id = CollegeHasBranch.BranchId WHERE CollegeHasBranch.CourseId = ' + req.params.CourseId + ' AND CollegeHasBranch.CollegeId = ' + req.params.CollegeId;
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
    getBranchesByCollege: function(req, res) {
        var result = {};
        var queryString = 'SELECT Branch.Id, Branch.Name FROM Branch INNER JOIN CollegeHasBranch ON Branch.Id = CollegeHasBranch.BranchId WHERE CollegeHasBranch.CollegeId = ' + req.params.CollegeId;
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
    getAllBranches: function(req, res) {
        var result = {};
        var queryString = 'SELECT * FROM Branch WHERE CourseId = ' + req.params.CourseId;
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
    addBranch: function(req, res) {
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
                var query = 'INSERT INTO Branch(Id, Name, CourseId) VALUES(null, "' + req.body.Names[i] + '", ' + req.body.CourseId + ')';
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
    assignBranchesToCollege: function(req, res) {
        var result = {};
        if (req.body.BranchIds.length == 0 || req.body.CourseId == "" || req.body.CollegeId == "" || req.body.UniversityId == "" || req.body.StateId == "") {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            var queries = [];
            for (var i = 0; i < req.body.BranchIds.length; i++) {
                var query = 'INSERT INTO CollegeHasBranch(Id, BranchId, CollegeId, CourseId, UniversityId, StateId) VALUES(null, ' + req.body.BranchIds[i] + ', ' + req.body.CollegeId + ', ' + req.body.CourseId + ', ' + req.body.UniversityId + ', ' + req.body.StateId + ')';
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
    getAllBranchesForUser: function(req, res) {
        var result = {};
        if (req.params.UserId == null) {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            var queryString = 'SELECT * From Branch WHERE Id IN (SELECT DISTINCT BranchId FROM UserSubject WHERE UserId = ' + req.params.UserId + ')';
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
    updateBranch: function(req, res) {
        var result = {};
        if (req.body.Name == "" || req.body.Id == "") {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            var queryString = 'UPDATE Branch SET Name = "' + req.body.Name + '" WHERE Id = ' + req.body.Id;
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
    deleteBranch: function(req, res) {
        var result = {};
        if (req.body.Id == "") {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            var queryString = 'DELETE FROM Branch WHERE Id = ' + req.body.Id;
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