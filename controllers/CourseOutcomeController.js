'use strict';
var statusCodes = require('./StatusCodesController.js');
var database = require('../database_scripts/connection_string.js');

module.exports = {
    getAllCourseOutcomes: function(req, res) {
        var result = {};
        var queryString = 'SELECT * FROM CourseOutcome co WHERE co.ClassId IN (' + req.body.ClassIds.join(";") + ') AND co.SubjectId IN (' + req.body.SubjectIds.join(";") + ')';
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
    getAllCourseOutcomesWithDescriptor: function(req, res) {
        var result = {};
        var queryString = 'SELECT co.Name, co.Description, po.Name AS POName, po.Description AS PODescription, pohco.* FROM ProgramOutcomeHasCourseOutcome pohco INNER JOIN CourseOutcome co ON pohco.COId = co.Id INNER JOIN ProgramOutcome po ON pohco.POId = po.Id WHERE co.ClassId IN (' + req.body.ClassIds.join(";") + ') AND co.SubjectId IN (' + req.body.SubjectIds.join(";") + ')';
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
    getAllCOandBT: function(req, res) {
        var result = {};
        var queryString = 'SELECT * from CourseOutcome WHERE CollegeId = ' + req.params.CollegeId + ' AND SubjectId = ' + req.params.SubjectId + ' AND ClassId = ' + req.params.ClassId;
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
    addCourseOutcome: function(req, res) {
        var result = {};
        var queries = [];
        if (req.body.IsElective == "true") {
            for (var i = 0; i < req.body.ClassIds.length; i++) {
                var query = 'INSERT INTO CourseOutcome(Id, Name, Description, CollegeId, CourseId, BranchId, SemesterId, ClassId, SubjectId) VALUES(null, "' + req.body.Name + '", "' + req.body.Description + '", ' + req.body.CollegeId + ', ' + req.body.CourseId + ', ' + req.body.BranchIds[0] + ', ' + req.body.SemesterId + ', ' + req.body.ClassIds[i] + ',' + req.body.SubjectIds[i] + ')';
                queries.push(query);
            }
        } else {
            var query = 'INSERT INTO CourseOutcome(Id, Name, Description, CollegeId, CourseId, BranchId, SemesterId, ClassId, SubjectId) VALUES(null, "' + req.body.Name + '", "' + req.body.Description + '", ' + req.body.CollegeId + ', ' + req.body.CourseId + ', ' + req.body.BranchIds[0] + ', ' + req.body.SemesterId + ', ' + req.body.ClassIds[0] + ',' + req.body.SubjectIds[0] + ')';
            queries.push(query);
        }
        database.connectionString.query(queries.join("; "), function(err, rows) {
            if (!err) {
                var queries2 = [];
                if (rows.length == undefined) {
                    for (var j = 0; j < req.body.ProgramOutcomes.length; j++) {
                        var query = 'INSERT INTO ProgramOutcomeHasCourseOutcome(Id, POId, COId, Descriptor) VALUES(null, ' + req.body.ProgramOutcomes[j].Id + ', ' + rows.insertId + ', ' + req.body.ProgramOutcomes[j].Descriptor + ')';
                        queries2.push(query);
                    }
                } else {
                    for (var i = 0; i < rows.length; i++) {
                        for (var j = 0; j < req.body.ProgramOutcomes.length; j++) {
                            var query = 'INSERT INTO ProgramOutcomeHasCourseOutcome(Id, POId, COId, Descriptor) VALUES(null, ' + req.body.ProgramOutcomes[j].Id + ', ' + rows[i].insertId + ', ' + req.body.ProgramOutcomes[j].Descriptor + ')';
                            queries2.push(query);
                        }
                    }
                }
                database.connectionString.query(queries2.join("; "), function(err2, rows2) {
                    if (!err2) {
                        result.Code = statusCodes.successCodes[0].Code;
                        result.Message = statusCodes.successCodes[0].Message;
                        result.Data = rows2;
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
    removeCOPOMapping: function(req, res) {
        var result = {};
        var queryString = 'DELETE FROM ProgramOutcomeHasCourseOutcome WHERE Id = ' + req.body.Id;
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