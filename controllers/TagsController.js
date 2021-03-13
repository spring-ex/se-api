'use strict';
var statusCodes = require('./StatusCodesController.js');
var database = require('../database_scripts/connection_string.js');

module.exports = {
    getAllTags: function(req, res) {
        var result = {};
        var queryString = 'SELECT * FROM Searchword WHERE SubjectId IN (' + req.body.SubjectIds.join(",") + ') AND Type = ' + req.body.Type;
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
                    result.Data = rows;
                    res.send(result);
                }
            } else {
                res.send(err);
            }
        });
    },
    getAllSmartTestForFiltering: function(req, res) {
        var result = {};
        var response = [];
        var queryString = 'SELECT * FROM SmartTest WHERE SubjectId = ' + req.params.SubjectId + ' AND TestType = 2';
        database.connectionString.query(queryString, function(err, rows) {
            if (!err) {
                if (rows.length == 0) {
                    result.Code = statusCodes.errorCodes[0].Code;
                    result.Message = statusCodes.errorCodes[0].Message;
                    result.Data = null;
                    res.send(result);
                } else {
                    var smartTestIds = [];
                    for (var i = 0; i < rows.length; i++) {
                        smartTestIds.push(rows[i].Id);
                    }
                    var queryString2 = 'SELECT * FROM StudentCompletesSmartTest WHERE StudentId = ' + req.params.StudentId + ' AND SmartTestId IN (' + smartTestIds.join(", ") + ')';
                    database.connectionString.query(queryString2, function(err2, rows2) {
                        if (!err2) {
                            for (var i = 0; i < rows.length; i++) {
                                rows[i].IsComplete = false;
                                for (var j = 0; j < rows2.length; j++) {
                                    if (rows[i].Id == rows2[j].SmartTestId && rows2[j].IsCompleted == '1') {
                                        rows[i].IsComplete = true;
                                    }
                                }
                            }
                            result.Code = statusCodes.successCodes[0].Code;
                            result.Message = statusCodes.successCodes[0].Message;
                            result.Data = rows;
                            res.send(result);
                        } else {
                            res.send(err2);
                        }
                    });
                }
            } else {
                res.send(err);
            }
        });
    },
    addSearchword: function(req, res) {
        var result = {};
        var queries = [];
        var tags = req.body.Searchwords.split("|");
        for (var i = 0; i < tags.length; i++) {
            var query = 'INSERT INTO Searchword(Id, Name, SubjectId, Type) VALUES(null, "' + tags[i] + '", ' + req.body.SubjectId + ', ' + req.body.Type + ')';
            queries.push(query);
        }
        database.connectionString.query(queries.join("; "), function(err, rows) {
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
    deleteSearchword: function(req, res) {
        var result = {};
        var queryString = 'DELETE FROM Searchword WHERE Id = ' + req.body.Id;
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
    updateSearchword: function(req, res) {
        var result = {};
        var queryString = 'UPDATE Searchword SET Name = "' + req.body.Name + '" WHERE Id = ' + req.body.Id;
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
    updateTagsForQuestion: function(req, res) {
        var result = {};
        var queryString = 'UPDATE TopicHasQuestion SET Tags = "' + req.body.Tags + '", Notes = "' + req.body.Notes + '" WHERE QuestionId = ' + req.body.Id;
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
    getQuestionsForSkill: function(req, res) {
        var result = {};
        var queryString = 'SELECT thc.*, t.Name, c.Name AS QuestionName FROM TopicHasCriteria thc INNER JOIN Topic t ON t.Id = thc.TopicId INNER JOIN Criteria c ON thc.CriteriaId = c.Id WHERE thc.Tags REGEXP "' + req.body.SkillName + '" AND thc.ChapterId IN (SELECT Id From Chapter WHERE SubjectId = ' + req.body.SubjectId + ')';
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
    getQuizzesForSkill: function(req, res) {
        var result = {};
        //type 4 for skill based quiz
        var queryString = 'SELECT * FROM SmartTest WHERE TestType = 4 AND SubjectId = ' + req.body.SubjectId + ' AND Name REGEXP "' + req.body.SkillName + '"';
        database.connectionString.query(queryString, function(err, rows) {
            if (!err) {
                if (rows.length == 0) {
                    result.Code = statusCodes.errorCodes[0].Code;
                    result.Message = statusCodes.errorCodes[0].Message;
                    result.Data = null;
                    res.send(result);
                } else {
                    var smartTestIds = [];
                    for (var i = 0; i < rows.length; i++) {
                        smartTestIds.push(rows[i].Id);
                    }
                    var queryString2 = 'SELECT * FROM StudentCompletesSmartTest WHERE StudentId = ' + req.body.StudentId + ' AND SmartTestId IN (' + smartTestIds.join(", ") + ')';
                    database.connectionString.query(queryString2, function(err2, rows2) {
                        if (!err2) {
                            for (var i = 0; i < rows.length; i++) {
                                rows[i].IsComplete = false;
                                for (var j = 0; j < rows2.length; j++) {
                                    if (rows[i].Id == rows2[j].SmartTestId && rows2[j].IsCompleted == '1') {
                                        rows[i].IsComplete = true;
                                    }
                                }
                            }
                            result.Code = statusCodes.successCodes[0].Code;
                            result.Message = statusCodes.successCodes[0].Message;
                            result.Data = rows;
                            res.send(result);
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