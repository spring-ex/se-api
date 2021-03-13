'use strict';
var statusCodes = require('./StatusCodesController.js');
var database = require('../database_scripts/connection_string.js');
var cloudinary = require('cloudinary');
var TinyURL = require('tinyurl');
var asyncLoop = require('node-async-loop');
cloudinary.config({
    cloud_name: 'dzerq05zm',
    api_key: '199453447665147',
    api_secret: 'BoLRDxRTwA7gYNIJB0seOIeqopU'
});

module.exports = {
    getAllQuestionsForTopic: function(req, res) {
        var result = {};
        if (req.params.IsSmartLearning == 'true') {
            var queryString = 'SELECT * from Question WHERE Id IN(SELECT QuestionId FROM TopicHasQuestion WHERE TopicId = ' + req.params.TopicId + ') AND IncludeInSmartLearning = "0" ORDER BY RAND()';
        } else {
            var queryString = 'SELECT * from Question WHERE Id IN(SELECT QuestionId FROM TopicHasQuestion WHERE TopicId = ' + req.params.TopicId + ') AND IncludeInSmartLearning = "1" ORDER BY RAND()';
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
    getAllQuestionsForChapter: function(req, res) {
        var result = {};
        var queryString = 'SELECT q.*, thq.Tags, thq.TopicId, thq.Notes FROM Question q INNER JOIN TopicHasQuestion thq ON q.Id = thq.QuestionId WHERE thq.ChapterId = ' + req.params.ChapterId + ' AND q.IncludeInSmartLearning = 0';
        database.connectionString.query(queryString, function(err, rows) {
            if (!err) {
                if (rows.length == 0) {
                    result.Code = statusCodes.errorCodes[0].Code;
                    result.Message = statusCodes.errorCodes[0].Message;
                    result.Data = null;
                } else {
                    // for (var i = 0; i < rows.length; i++) {
                    //     TinyURL.shorten(rows[i].QuestionMediaURL, function(res) {
                    //         rows[i].QuestionMediaURL = res;
                    //     });
                    // }
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
    getQuestionCountForTopic: function(req, res) {
        var result = {};
        var queryString = 'SELECT COUNT(Id) AS NumberOfQuestions from Question WHERE Id IN(SELECT QuestionId FROM TopicHasQuestion WHERE TopicId = ' + req.params.TopicId + ') AND IncludeInSmartLearning = "1" ORDER BY RAND()';
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
    getAllQuestionsForTest: function(req, res) {
        var result = {};
        var queryString = 'SELECT * from Question WHERE Id IN(SELECT QuestionId FROM SmartTestHasQuestions WHERE SmartTestId = ' + req.params.SmartTestId + ') AND IncludeInSmartLearning != "1" ORDER BY RAND()';
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
    addQuestion: function(req, res) {
        var result = {};
        if (req.body.QuestionForm == "" || req.body.QuestionMediaUrl == "") {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            var options = req.body.Options;
            var topicId = req.body.TopicId;
            var chapterId = req.body.ChapterId;
            var btId = req.body.BTId;
            var tags = req.body.Tags;
            delete req.body.Options;
            delete req.body.TopicId;
            delete req.body.ChapterId;
            delete req.body.BTId;
            delete req.body.Tags;
            var queryString = 'INSERT INTO Question SET ?';
            database.connectionString.query(queryString, req.body, function(err, rows) {
                if (!err) {
                    if (rows.length == 0) {
                        result.Code = statusCodes.errorCodes[0].Code;
                        result.Message = statusCodes.errorCodes[0].Message;
                        result.Data = null;
                        res.send(result);
                    } else {
                        var queries = [];
                        for (var i = 0; i < options.length; i++) {
                            var query = 'INSERT INTO Options(Id, QuestionId, OptionForm, OptionText, OptionValue) VALUES (null, ' + rows.insertId + ', "' + options[i].OptionForm + '", "' + options[i].OptionText + '", ' + options[i].OptionValue + ')';
                            queries.push(query);
                        }
                        database.connectionString.query(queries.join("; "), function(err2, rows2) {
                            if (!err2) {
                                var queryString3 = 'INSERT INTO TopicHasQuestion(Id, TopicId, ChapterId, QuestionId, BTId, Tags) VALUES(null, ' + topicId + ', ' + chapterId + ', ' + rows.insertId + ', ' + btId + ', "' + tags + '")';
                                database.connectionString.query(queryString3, function(err3, rows3) {
                                    if (!err3) {
                                        result.Code = statusCodes.successCodes[0].Code;
                                        result.Message = statusCodes.successCodes[0].Message;
                                        result.Data = rows3;
                                        res.send(result);
                                    } else {
                                        res.send(err3);
                                    }
                                });
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
    },
    assignQuestionToTopic: function(req, res) {
        var result = {};
        if (req.body.QuestionId == "" || req.body.TopicId == "") {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            var query = 'UPDATE TopicHasQuestion SET TopicId = ' + req.body.TopicId + ', ChapterId = ' + req.body.ChapterId + ' WHERE QuestionId = ' + req.body.QuestionId;
            database.connectionString.query(query, function(err, rows) {
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
    studentReportsQuestion: function(req, res) {
        var result = {};
        if (req.body.QuestionId == "" || req.body.StudentId == "") {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            var query = 'INSERT INTO StudentReportsQuestion(StudentId, QuestionId, Remarks) VALUES(' + req.body.StudentId + ', ' + req.body.QuestionId + ', "' + req.body.Remarks + '") ON DUPLICATE KEY UPDATE Remarks = VALUES(Remarks)';
            database.connectionString.query(query, function(err, rows) {
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
    updateTimeToSolveForQuestion: function(req, res) {
        var result = {};
        if (req.body.QuestionId == "" || req.body.TimeToSolveInSeconds == "") {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            var query = 'UPDATE Question SET TimeToSolveInSeconds = ' + req.body.TimeToSolveInSeconds + ' WHERE Id = ' + req.body.QuestionId;
            database.connectionString.query(query, function(err, rows) {
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
    updateQuestion: function(req, res) {
        var result = {};
        if (req.body.QuestionId == "" || req.body.TimeToSolveInSeconds == "") {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            var query = 'UPDATE Question SET QuestionText = "' + req.body.QuestionText + '",  IncludeInSmartLearning = ' + req.body.IncludeInSmartLearning + ', Solution = "' + req.body.Solution + '" WHERE Id = ' + req.body.QuestionId;
            database.connectionString.query(query, function(err, rows) {
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
    deleteQuestion: function(req, res) {
        var result = {};
        if (req.body.Id == "") {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
            return;
        } else {
            var query = 'DELETE FROM StudentWritesSmartTest WHERE QuestionId = ' + req.body.Id;
            database.connectionString.query(query, function(err, rows) {
                if (!err) {
                    var query2 = 'DELETE FROM Question WHERE Id = ' + req.body.Id;
                    database.connectionString.query(query2, function(err2, rows2) {
                        if (!err2) {
                            if (req.body.QuestionPublicId != null) {
                                cloudinary.uploader.destroy(req.body.QuestionPublicId, function(ress) {
                                    result.Code = statusCodes.successCodes[0].Code;
                                    result.Message = statusCodes.successCodes[0].Message;
                                    result.Data = rows2;
                                    res.send(result);
                                }, { invalidate: true });
                            } else {
                                result.Code = statusCodes.successCodes[0].Code;
                                result.Message = statusCodes.successCodes[0].Message;
                                result.Data = rows2;
                                res.send(result);
                            }
                        } else {
                            res.send(err2);
                        }
                    });
                } else {
                    res.send(err);
                }
            });
        }
    },
    removeQuestionImage: function(req, res) {
        var result = {};
        if (req.body.Id == "") {
            result.Code = statusCodes.errorCodes[1].Code;
            result.Message = statusCodes.errorCodes[1].Message;
            result.Data = null;
            res.send(result);
        } else {
            var query2 = 'UPDATE Question SET QuestionMediaURL = null, QuestionPublicId = null WHERE Id = ' + req.body.Id;
            database.connectionString.query(query2, function(err2, rows2) {
                if (!err2) {
                    cloudinary.uploader.destroy(req.body.QuestionPublicId, function(ress) {
                        result.Code = statusCodes.successCodes[0].Code;
                        result.Message = statusCodes.successCodes[0].Message;
                        result.Data = rows2;
                        res.send(result);
                    }, { invalidate: true });
                } else {
                    res.send(err2);
                }
            });
        }
    },
    questionBulkUpload: function(req, res) {
        var result = {};
        var no_of_questions = req.body.length;
        asyncLoop(req.body, function(item, next) {
            var newQuestion = {
                QuestionText: item.Question,
                QuestionType: "SINGLE",
                QuestionForm: "TEXT",
                QuestionMediaURL: null,
                QuestionPublicId: null,
                TimeToSolveInSeconds: 60,
                IncludeInSmartLearning: 0,
                Solution: item.Solution,
            };
            var topicId = item.TopicId;
            var chapterId = item.ChapterId;
            var btId = null;
            var tags = null;
            var options = [{
                QuestionId: null,
                OptionForm: "TEXT",
                OptionText: item.Answer,
                OptionValue: 1
            }, {
                QuestionId: null,
                OptionForm: "TEXT",
                OptionText: item.Option2,
                OptionValue: 0
            }, {
                QuestionId: null,
                OptionForm: "TEXT",
                OptionText: item.Option3,
                OptionValue: 0
            }, {
                QuestionId: null,
                OptionForm: "TEXT",
                OptionText: item.Option4,
                OptionValue: 0
            }];
            var queryString = 'INSERT INTO Question SET ?';
            database.connectionString.query(queryString, newQuestion, function(err, rows) {
                if (!err) {
                    if (rows.length == 0) {
                        result.Code = statusCodes.errorCodes[0].Code;
                        result.Message = statusCodes.errorCodes[0].Message;
                        result.Data = null;
                        res.send(result);
                    } else {
                        var queries = [];
                        for (var i = 0; i < options.length; i++) {
                            var query = 'INSERT INTO Options(Id, QuestionId, OptionForm, OptionText, OptionValue) VALUES (null, ' + rows.insertId + ', "' + options[i].OptionForm + '", "' + options[i].OptionText + '", ' + options[i].OptionValue + ')';
                            queries.push(query);
                        }
                        database.connectionString.query(queries.join("; "), function(err2, rows2) {
                            if (!err2) {
                                var queryString3 = 'INSERT INTO TopicHasQuestion(Id, TopicId, ChapterId, QuestionId, BTId, Tags) VALUES(null, ' + topicId + ', ' + chapterId + ', ' + rows.insertId + ', ' + btId + ', "' + tags + '")';
                                database.connectionString.query(queryString3, function(err3, rows3) {
                                    if (!err3) {
                                        if (--no_of_questions == 0) {
                                            console.log('done');
                                            result.Code = statusCodes.successCodes[0].Code;
                                            result.Message = statusCodes.successCodes[0].Message;
                                            result.Data = rows3;
                                            res.send(result);
                                        } else {
                                            next();
                                        }
                                    } else {
                                        res.send(err3);
                                    }
                                });
                            } else {
                                res.send(err2);
                            }
                        });
                    }
                } else {
                    res.send(err);
                }
            });
        });
    }
}