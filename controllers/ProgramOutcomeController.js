'use strict';
var statusCodes = require('./StatusCodesController.js');
var database = require('../database_scripts/connection_string.js');

module.exports = {
    getAllProgramOutcomes: function(req, res) {
        var result = {};
        var queryString = 'SELECT * from ProgramOutcome WHERE CollegeId = ' + req.params.CollegeId + ' AND CourseId = ' + req.params.CourseId + ' AND BranchId  = ' + req.params.BranchId;
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
    getCOPODescriptor: function(req, res) {
        var result = {};
        var queryString = 'SELECT Descriptor FROM ProgramOutcomeHasCourseOutcome WHERE POId = ' + req.params.POId + ' AND COId = ' + req.params.COId;
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
    getAllProgramOutcomesForSubject: function(req, res) {
        var result = {};
        if (req.params.IsElective == "true") {
            var queryString = 'SELECT * from ProgramOutcome WHERE CollegeId = ' + req.params.CollegeId + ' AND CourseId = ' + req.params.CourseId + ' AND BranchId IN (SELECT BranchId FROM Subject WHERE SpecialSubjectId = ' + req.params.SubjectId + ')';
        } else {
            var queryString = 'SELECT * from ProgramOutcome WHERE CollegeId = ' + req.params.CollegeId + ' AND CourseId = ' + req.params.CourseId + ' AND BranchId IN (SELECT BranchId FROM Subject WHERE Id = ' + req.params.SubjectId + ')';
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
    addProgramOutcome: function(req, res) {
        var result = {};
        var queryString = 'INSERT INTO ProgramOutcome SET ?';
        database.connectionString.query(queryString, req.body, function(err, rows) {
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
    updateProgramOutcome: function(req, res) {
        var result = {};
        if (req.body.Name == "" || req.body.Id == "") {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            var queryString = 'UPDATE ProgramOutcome SET Description = "' + req.body.Description + '" WHERE Id = ' + req.body.Id;
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
    deleteProgramOutcome: function(req, res) {
        var result = {};
        if (req.body.Id == "") {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            var queryString = 'DELETE FROM ProgramOutcome WHERE Id = ' + req.body.Id;
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